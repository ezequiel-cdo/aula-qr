/** BANDEJA PUBLICA EPJA — INSTALAR SOLO EN UNA NUEVA HOJA VACIA, NO EN REGISTRO MAESTRO.
 * No usar en el proyecto V1/V2/V3/V4 ni dar acceso de edición a participantes.
 * Recibe solicitudes que requieren revisión, sin validar identidad ni devolver información del Maestro.
 */
const SOLICITUD_HEADERS=['fecha_recepcion','anio_escolar','curso','seccion','nombre_declarado','estado_revision'];
function epjaBandejaSetup(){
 const ss=SpreadsheetApp.getActiveSpreadsheet();if(!ss)throw Error('Vincula el script a la nueva bandeja');
 if(ss.getSheetByName('Personas')||ss.getSheetByName('Matriculas_2026_2027'))throw Error('Prohibido ejecutar en el Registro Maestro');
 let s=ss.getSheetByName('Solicitudes');if(!s)s=ss.insertSheet('Solicitudes');
 if(s.getLastRow()===0)s.getRange(1,1,1,SOLICITUD_HEADERS.length).setValues([SOLICITUD_HEADERS]);
 s.setFrozenRows(1);
}
function epjaPagina_(msg){
 return HtmlService.createHtmlOutput('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:system-ui;max-width:580px;margin:55px auto;padding:20px"><h1>Aula QR · Solicitud de matrícula</h1><p>'+msg+'</p><a href="https://ezequiel-cdo.github.io/aula-qr/matematica-epja-3ero/">Volver al aula</a></body></html>');
}
function doGet(){return epjaPagina_('Para solicitar revisión, abre el formulario desde Aula QR.')}
function doPost(e){
 const ok='Se recibió tu solicitud de revisión. El docente la comprobará personalmente. Esto no verifica tu matrícula ni concede acceso.';
 const error='No se pudo recibir la solicitud. Intenta de nuevo o consulta al docente.';
 try{
  const p=e&&e.parameter||{};
  if(p.website)return epjaPagina_(ok);
  const year=String(p.anio_escolar||''),curso=String(p.curso||''),sec=String(p.seccion||'');
  const name=String(p.nombre_declarado||'').trim().replace(/\s+/g,' ');
  if(year!=='2026-2027'||p.consentimiento!=='SI'||name.length<5||name.length>100||!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ .'-]+$/.test(name))return epjaPagina_(error);
  if(!(curso==='Tercero'&&['A','B'].includes(sec)||curso==='Cuarto'&&['A','C'].includes(sec)))return epjaPagina_(error);
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  if(!ss||ss.getSheetByName('Personas')||ss.getSheetByName('Matriculas_2026_2027'))return epjaPagina_(error);
  const sheet=ss.getSheetByName('Solicitudes');if(!sheet)return epjaPagina_(error);
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(8000))return epjaPagina_(error);
  try{
   // Prefix literal text to prevent spreadsheet formula injection.
   sheet.appendRow([new Date(),year,curso,sec,"'"+name,'PENDIENTE_REVISION']);
  }finally{lock.releaseLock();}
  return epjaPagina_(ok);
 }catch(ex){console.error(String(ex&&ex.message||'unknown'));return epjaPagina_(error)}
}
