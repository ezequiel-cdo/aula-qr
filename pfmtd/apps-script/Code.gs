/**
 * PFMTTD · Receptor central de acuerdos (Apps Script)
 * Versión: 1.4 | Fecha: 2026-11-15 | Estado: requiere actualizar implementación activa.
 * Nuevas funciones: registro, comprobante y proyección inmediata por defecto (SI).
 * Compatibilidad: AulaQR en GitHub Pages; no altera el piloto original.
 * Dependencias: Google Sheets y Apps Script asociado a la hoja.
 *
 * No publicar esta hoja ni compartir su URL con participantes.
 * Nunca almacenar contraseñas, tokens o secretos en HTML público.
 */
const CONFIG = Object.freeze({
  SHEET_NAME: 'Acuerdos_PFMTTD',
  EXPECT_SHEET: 'Expectativas_PFMTTD',
  DIAG_SHEET: 'Diagnostico_PFMTTD',
  DIAG_HEADERS: ['Recepción UTC','ID comprobante','ID sesión','ID actividad','Pseudónimo (opcional)','Proceso MiPyME','Automatización elegida','Diferencia transformación','Información útil','Estado','Versión'],
  EXPECT_HEADERS: ['Recepción UTC','ID comprobante','ID sesión','ID actividad','Pseudónimo (opcional)','Expectativa 80h','Expectativa práctica 30min','Estado','Versión','Proyectar'],
  HEADERS: ['Recepción UTC','ID comprobante','ID sesión','ID actividad',
            'Pseudónimo (opcional)','Propuesta','Estado','Versión','Proyectar']
});
function configurar() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  if (!libro) throw new Error('Ejecute configurar() en el Apps Script asociado a la hoja.');
  const propiedades = PropertiesService.getScriptProperties();
  propiedades.setProperty('PFMTTD_SHEET_ID',libro.getId());
  let hoja = libro.getSheetByName(CONFIG.SHEET_NAME) || libro.insertSheet(CONFIG.SHEET_NAME);
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(CONFIG.HEADERS);
    hoja.setFrozenRows(1);
  }
  if (hoja.getRange(1,9).getValue() !== 'Proyectar') hoja.getRange(1,9).setValue('Proyectar');
  let expectativas=libro.getSheetByName(CONFIG.EXPECT_SHEET)||libro.insertSheet(CONFIG.EXPECT_SHEET);
  if(expectativas.getLastRow()===0){expectativas.appendRow(CONFIG.EXPECT_HEADERS);expectativas.setFrozenRows(1);}
  let diag=libro.getSheetByName(CONFIG.DIAG_SHEET)||libro.insertSheet(CONFIG.DIAG_SHEET);
  if(diag.getLastRow()===0){diag.appendRow(CONFIG.DIAG_HEADERS);diag.setFrozenRows(1);}
  return 'Hojas preparadas: '+CONFIG.SHEET_NAME+', '+CONFIG.EXPECT_SHEET+' y '+CONFIG.DIAG_SHEET;
}
function doGet(e) {
  const vista=(e&&e.parameter&&e.parameter.vista)||'';
  const rutas={
    panel:['Panel','PFMTTD · Acuerdos para proyectar'],
    diagnostico:['Diagnostico','PFMTTD · Diagnóstico inicial'],
    expectativas:['Expectativas','PFMTTD · Registro de expectativas'],
    'expectativas-panel':['ExpectativasPanel','PFMTTD · Recuperación de expectativas']
  };
  const ruta=rutas[vista]||['Formulario','PFMTTD · Acuerdos de convivencia'];
  const salida=HtmlService.createHtmlOutputFromFile(ruta[0])
    .setTitle(ruta[1])
    .addMetaTag('viewport','width=device-width, initial-scale=1');
  if(vista==='panel'||vista==='expectativas-panel') salida.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return salida;
}

/** Solo devuelve textos marcados SI en la columna I; nunca nombres ni comprobantes. */
function listarAcuerdosProyectables() {
  const id = PropertiesService.getScriptProperties().getProperty('PFMTTD_SHEET_ID');
  if (!id) throw new Error('Recepción no configurada.');
  const hoja = SpreadsheetApp.openById(id).getSheetByName(CONFIG.SHEET_NAME);
  if (!hoja) throw new Error('Hoja de acuerdos no disponible.');
  const last = hoja.getLastRow();
  if (last < 2) return {items: [],actualizado: new Date().toISOString()};
  // Solo texto y marca de publicación, sin seudónimo, fecha ni comprobante.
  const filas = hoja.getRange(2,6,last-1,4).getDisplayValues();
  const vistos = new Set();
  const items = [];
  filas.forEach(fila => {
    const texto=String(fila[0]||'').trim();
    const estado=String(fila[1]||'').trim().toUpperCase();
    const aprobado=String(fila[3]||'').trim().toUpperCase();
    const llave=texto.toLocaleLowerCase();
    if (texto && texto.length<=300 && estado==='RECIBIDO' && aprobado==='SI' && !vistos.has(llave)) {
      vistos.add(llave); items.push(texto);
    }
  });
  return {items:items.slice(0,40),actualizado:new Date().toISOString()};
}
function registrarAcuerdo(datos) {
  const p = datos && typeof datos === 'object' ? datos : {};
  if (String(p.control || '') !== '') throw new Error('Solicitud no admitida.');
  const propuesta = String(p.propuesta || '').trim().replace(/\s+/g,' ');
  const seudonimo = String(p.seudonimo || '').trim().replace(/\s+/g,' ');
  const idPeticion = String(p.idPeticion || '');
  if (propuesta.length < 8 || propuesta.length > 300) throw new Error('La propuesta debe tener entre 8 y 300 caracteres.');
  if (seudonimo.length > 60) throw new Error('El identificador es demasiado largo.');
  if (!/^[a-zA-Z0-9-]{12,80}$/.test(idPeticion)) throw new Error('Identificador de envío inválido.');
  const idLibro = PropertiesService.getScriptProperties().getProperty('PFMTTD_SHEET_ID');
  if (!idLibro) throw new Error('Recepción no configurada.');
  const candado=LockService.getScriptLock();
  candado.waitLock(15000);
  try {
    const hoja=SpreadsheetApp.openById(idLibro).getSheetByName(CONFIG.SHEET_NAME);
    if (!hoja) throw new Error('La hoja receptora no existe.');
    const ult=hoja.getLastRow();
    if(ult > 1) {
      const ids=hoja.getRange(2,2,ult-1,1).getDisplayValues().flat();
      const previo='PFMTTD-'+idPeticion;
      if(ids.includes(previo)) return {recibido:true,comprobante:previo,duplicado:true};
    }
    // Escapar caracteres que Sheets interpreta como fórmula.
    const seguro=s=>/^[=+@-]/.test(s)?'\''+s:s;
    const comprobante='PFMTTD-'+idPeticion;
    hoja.appendRow([new Date(),comprobante,'PFMTTD-30MIN','INICIO-ACUERDOS',seguro(seudonimo),
      seguro(propuesta),'RECIBIDO','1.2','SI']);
    SpreadsheetApp.flush();
    return {recibido:true,comprobante:comprobante,duplicado:false};
  } finally {
    candado.releaseLock();
  }
}

/**
 * Expectativas: formulario del encuadre (minuto 06–07). Las respuestas
 * identificadas permanecen en hoja privada. Proyectar NO por defecto:
 * el docente podrá autorizar SI por fila para la socialización del cierre.
 */
function registrarExpectativas(datos) {
  const p=datos&&typeof datos==='object'?datos:{};
  if(String(p.control||'')) throw new Error('Solicitud no admitida.');
  const pseudonimo=String(p.pseudonimo||'').trim().replace(/\s+/g,' ');
  const programa=String(p.programa||'').trim().replace(/\s+/g,' ');
  const practica=String(p.practica||'').trim().replace(/\s+/g,' ');
  const peticion=String(p.idPeticion||'');
  if(!/^[a-zA-Z0-9-]{12,80}$/.test(peticion)) throw new Error('ID de envío inválido.');
  if(pseudonimo.length>60) throw new Error('Identificador demasiado largo.');
  if(programa.length<8||programa.length>350||practica.length<8||practica.length>350)
    throw new Error('Cada expectativa debe contener entre 8 y 350 caracteres.');
  const id=PropertiesService.getScriptProperties().getProperty('PFMTTD_SHEET_ID');
  if(!id) throw new Error('Servicio no configurado.');
  const lock=LockService.getScriptLock(); lock.waitLock(15000);
  try{
    const hoja=SpreadsheetApp.openById(id).getSheetByName(CONFIG.EXPECT_SHEET);
    if(!hoja) throw new Error('Falta ejecutar configurar() para crear Expectativas_PFMTTD.');
    const receipt='PFMTTD-EXP-'+peticion;
    const last=hoja.getLastRow();
    if(last>1&&hoja.getRange(2,2,last-1,1).getDisplayValues().flat().includes(receipt))
      return {recibido:true,comprobante:receipt,duplicado:true};
    const safe=t=>/^[=+@-]/.test(t)?"'"+t:t;
    hoja.appendRow([new Date(),receipt,'PFMTTD-30MIN','INICIO-EXPECTATIVAS',
      safe(pseudonimo),safe(programa),safe(practica),'RECIBIDO','1.3','NO']);
    SpreadsheetApp.flush();
    return {recibido:true,comprobante:receipt,duplicado:false};
  }finally{lock.releaseLock();}
}
/** Recupera solo las dos expectativas de filas autorizadas SI, sin seudónimos. */
function listarExpectativasProyectables() {
  const id=PropertiesService.getScriptProperties().getProperty('PFMTTD_SHEET_ID');
  if(!id) throw new Error('Servicio no configurado.');
  const hoja=SpreadsheetApp.openById(id).getSheetByName(CONFIG.EXPECT_SHEET);
  if(!hoja) throw new Error('Pestaña Expectativas_PFMTTD no disponible.');
  const last=hoja.getLastRow();
  if(last<2)return {items:[],actualizado:new Date().toISOString()};
  const filas=hoja.getRange(2,6,last-1,5).getDisplayValues();
  const items=[];
  filas.forEach(f=>{
    if(String(f[2]).toUpperCase()==='RECIBIDO'&&String(f[4]).toUpperCase()==='SI'&&items.length<35){
      items.push({programa:String(f[0]).slice(0,350),practica:String(f[1]).slice(0,350)});
    }
  });
  return {items:items,actualizado:new Date().toISOString()};
}

/** Respuestas reales de diagnóstico; sin puntuación automática. */
function registrarDiagnostico(datos) {
  const p=datos&&typeof datos==='object'?datos:{};
  if(String(p.control||''))throw new Error('Solicitud no admitida.');
  const peticion=String(p.idPeticion||'');
  if(!/^[a-zA-Z0-9-]{12,80}$/.test(peticion))throw new Error('ID de envío inválido.');
  const fields=['pseudonimo','proceso','automatizacion','diferencia','informacion'];
  const values=fields.map(k=>String(p[k]||'').trim().replace(/\s+/g,' '));
  if(values[0].length>60)throw new Error('Identificador demasiado largo.');
  if(values.slice(1).some(v=>v.length<3||v.length>500))throw new Error('Responde los cuatro elementos (3 a 500 caracteres cada uno).');
  const id=PropertiesService.getScriptProperties().getProperty('PFMTTD_SHEET_ID');
  if(!id)throw new Error('Servicio no configurado.');
  const lock=LockService.getScriptLock(); lock.waitLock(15000);
  try{
    const hoja=SpreadsheetApp.openById(id).getSheetByName(CONFIG.DIAG_SHEET);
    if(!hoja)throw new Error('Falta configurar() para crear Diagnostico_PFMTTD.');
    const receipt='PFMTTD-DIAG-'+peticion;
    const last=hoja.getLastRow();
    if(last>1&&hoja.getRange(2,2,last-1,1).getDisplayValues().flat().includes(receipt))
      return {recibido:true,comprobante:receipt,duplicado:true};
    const safe=x=>/^[=+@-]/.test(x)?"'"+x:x;
    hoja.appendRow([new Date(),receipt,'PFMTTD-30MIN','INICIO-DIAGNOSTICO',...values.map(safe),'RECIBIDO','1.4']);
    SpreadsheetApp.flush();
    return {recibido:true,comprobante:receipt,duplicado:false};
  }finally{lock.releaseLock();}
}
