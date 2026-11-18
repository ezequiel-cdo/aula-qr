/**
 * Plantilla de recepción EPJA para Google Apps Script.
 * No está desplegada. Ejecutar desde una cuenta autorizada por el centro.
 * Establecer ScriptProperties:
 *   EPJA_SPREADSHEET_ID : ID de una hoja privada de seguimiento.
 *
 * IMPORTANTE: sin autenticación individual, la autoría queda SIN VERIFICAR.
 * Esta plantilla NO debe desplegarse con acceso público sin añadir un
 * mecanismo de autorización y controles antispam en el servidor.
 */
const HEADERS = [
  "recibido_servidor", "id_entrega", "periodo", "tipo",
  "participante_alias", "actividad", "calificaciones_simuladas",
  "promedio_simulado", "estado_autoria", "datos_recibidos"
];
function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({servicio:"EPJA",estado:"plantilla_sin_activacion"})
  ).setMimeType(ContentService.MimeType.JSON);
}
function doPost(e) {
  // Receptor DESACTIVADO por diseño hasta configurar autorización y permisos.
  return ContentService.createTextOutput(
    JSON.stringify({ok:false,code:"REQUIERE_CONFIGURACION_SEGURA",
      detail:"Configurar autorización y controles antes de recibir evidencias."})
  ).setMimeType(ContentService.MimeType.JSON);
}
/**
 * Función interna para futura llamada posterior a la autorización.
 * NO exponer directamente como endpoint sin autenticar.
 */
function registrarEvidenciaValidada_(payload) {
  const ssid=PropertiesService.getScriptProperties().getProperty("EPJA_SPREADSHEET_ID");
  if (!ssid) throw new Error("Falta EPJA_SPREADSHEET_ID");
  const period=String(payload.period||"");
  const type=String(payload.type||"");
  if (!/^P[1-4]$/.test(period)) throw new Error("Periodo inválido");
  if (!["practica","simulacion_final"].includes(type)) throw new Error("Tipo inválido");
  const alias=String(payload.alias||"").slice(0,80);
  const id=type==="simulacion_final" ? Utilities.getUuid() : "";
  const scores=Array.isArray(payload.scores)&&payload.scores.length===4
    ? payload.scores.map(v=>Number.isFinite(Number(v))?Math.max(0,Math.min(100,Number(v))):null)
    : [];
  const avg=scores.length===4 && scores.every(v=>v!==null)
    ? scores.reduce((a,b)=>a+b,0)/4 : "";
  const book=SpreadsheetApp.openById(ssid);
  const sheet=book.getSheetByName("Evidencias")||book.insertSheet("Evidencias");
  if(sheet.getLastRow()===0)sheet.appendRow(HEADERS);
  const safeCell=x=>{let s=String(x??"");if(/^[=+\-@]/.test(s))s="'"+s;return s};
  sheet.appendRow([
    new Date(),id,period,type,safeCell(alias),
    safeCell(String(payload.activity||"").slice(0,90)),
    JSON.stringify(scores),avg,"AUTORIA_NO_VERIFICADA",
    JSON.stringify(payload).slice(0,15000)
  ]);
  return {ok:true,receivedAtServer:new Date().toISOString(),
    deliveryId:id,authorship:"unverified",gradeStatus:"practice_only"};
}
