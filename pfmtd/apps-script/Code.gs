/**
 * PFMTTD · Receptor central de acuerdos (Apps Script)
 * Versión: 1.0 | Fecha: 2026-11-15 | Estado: requiere despliegue autorizado.
 * Nuevas funciones: registro en hoja privada, comprobante, deduplicación.
 * Compatibilidad: AulaQR en GitHub Pages; no altera el piloto original.
 * Dependencias: Google Sheets y Apps Script asociado a la hoja.
 *
 * No publicar esta hoja ni compartir su URL con participantes.
 * Nunca almacenar contraseñas, tokens o secretos en HTML público.
 */
const CONFIG = Object.freeze({
  SHEET_NAME: 'Acuerdos_PFMTTD',
  HEADERS: ['Recepción UTC','ID comprobante','ID sesión','ID actividad',
            'Pseudónimo (opcional)','Propuesta','Estado','Versión']
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
  return 'Hoja preparada: ' + CONFIG.SHEET_NAME;
}
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Formulario')
    .setTitle('PFMTTD · Acuerdos de convivencia')
    .addMetaTag('viewport','width=device-width, initial-scale=1');
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
      seguro(propuesta),'RECIBIDO','1.0']);
    SpreadsheetApp.flush();
    return {recibido:true,comprobante:comprobante,duplicado:false};
  } finally {
    candado.releaseLock();
  }
}
