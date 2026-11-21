/**
 * Aula QR EPJA · V3 público de SOLO LECTURA.
 * PROYECTO APPS SCRIPT INDEPENDIENTE. No pegar en Apps Script administrativo.
 * No crea hojas, no escribe celdas, no consulta teléfonos ni documentos.
 * Usa el Registro Maestro existente en Google Sheets.
 * Riesgo aceptado para esta etapa: nombres consultables mediante búsqueda pública.
 */
const EPJA_PUBLICO = Object.freeze({
  SHEET_ID: '1KEOTGdMHVAPC8vhAPp6EeleZfdPoWbVjq0TwwUm1XDY',
  MATRICULAS: 'Matriculas_2026_2027',
  PERSONAS: 'Personas',
  ALIAS: 'Alias_Nombres',
  MAX: 5
});
function epjaPublicoLeer_(nombre, obligatorias) {
  const h=SpreadsheetApp.openById(EPJA_PUBLICO.SHEET_ID).getSheetByName(nombre);
  if(!h)throw new Error('Falta hoja: '+nombre);
  const data=h.getDataRange().getDisplayValues();
  if(!data.length)throw new Error('Faltan encabezados: '+nombre);
  const cols=data[0].map(x=>String(x||'').trim());
  obligatorias.forEach(x=>{if(!cols.includes(x))throw new Error('Falta campo '+x)});
  return data.slice(1).map(row=>Object.fromEntries(cols.map((col,i)=>[col,String(row[i]||'').trim()])))
    .filter(row=>Object.values(row).some(Boolean));
}
function epjaPublicoNormalizar_(x) {
  return String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
}
function epjaPublicoDistancia_(a,b) {
  if(Math.abs(a.length-b.length)>1||a.length>32||b.length>32)return 9;
  let ant=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++){let sig=[i];for(let j=1;j<=b.length;j++)
    sig[j]=Math.min(sig[j-1]+1,ant[j]+1,ant[j-1]+(a[i-1]===b[j-1]?0:1));
    ant=sig}
  return ant[b.length];
}
function epjaPublicoPuntuacion_(consulta,variantes) {
  const partes=consulta.split(' ').filter(Boolean);let mejor=0;
  variantes.forEach(raw=>{
    const nombre=epjaPublicoNormalizar_(raw), palabras=nombre.split(' ');
    if(!nombre)return;
    if(nombre===consulta)mejor=Math.max(mejor,120);
    if(nombre.startsWith(consulta))mejor=Math.max(mejor,100);
    if(nombre.includes(consulta))mejor=Math.max(mejor,75);
    const aciertos=partes.map(p=>palabras.includes(p)?30:
      palabras.some(w=>w.startsWith(p))?22:
      p.length>=4&&palabras.some(w=>epjaPublicoDistancia_(p,w)<=1)?12:0);
    if(aciertos.length&&aciertos.every(Boolean))
      mejor=Math.max(mejor,aciertos.reduce((a,b)=>a+b,0));
  });
  return mejor;
}
function epjaPublicoContextos() {
  const filas=epjaPublicoLeer_(EPJA_PUBLICO.MATRICULAS,['persona_id_interno','anio_escolar','curso','seccion']);
  const m=new Map();
  filas.forEach(x=>{if(x.anio_escolar&&x.curso&&x.seccion)
    m.set([x.anio_escolar,x.curso,x.seccion].join('|'),
      {anio:x.anio_escolar,curso:x.curso,seccion:x.seccion})});
  return [...m.values()].sort((a,b)=>
    [a.anio,a.curso,a.seccion].join('|').localeCompare([b.anio,b.curso,b.seccion].join('|'),'es'));
}
function epjaPublicoBuscarNombres(anio,curso,seccion,texto) {
  const q=epjaPublicoNormalizar_(texto);
  if(q.length<3||q.length>80)return [];
  const contextos=epjaPublicoContextos();
  if(!contextos.some(x=>x.anio===anio&&x.curso===curso&&x.seccion===seccion))return [];
  const matriculas=epjaPublicoLeer_(EPJA_PUBLICO.MATRICULAS,['persona_id_interno','anio_escolar','curso','seccion']);
  const ids=new Set(matriculas.filter(m=>m.anio_escolar===anio&&m.curso===curso&&m.seccion===seccion)
    .map(m=>m.persona_id_interno).filter(Boolean));
  const personas=epjaPublicoLeer_(EPJA_PUBLICO.PERSONAS,['persona_id_interno','nombre_completo_origen']);
  const alias=epjaPublicoLeer_(EPJA_PUBLICO.ALIAS,['persona_id_interno','alias_validado','estado']);
  const aliasMap=new Map();
  alias.forEach(a=>{if(String(a.estado).toUpperCase()!=='VALIDADO'||!ids.has(a.persona_id_interno))return;
    if(!aliasMap.has(a.persona_id_interno))aliasMap.set(a.persona_id_interno,[]);
    aliasMap.get(a.persona_id_interno).push(a.alias_validado)});
  return personas.filter(p=>ids.has(p.persona_id_interno)).map(p=>({
    p,score:epjaPublicoPuntuacion_(q,[p.nombre_completo_origen].concat(aliasMap.get(p.persona_id_interno)||[]))
  })).filter(x=>x.score>=12)
    .sort((a,b)=>b.score-a.score||a.p.nombre_completo_origen.localeCompare(b.p.nombre_completo_origen,'es'))
    .slice(0,EPJA_PUBLICO.MAX).map(x=>({nombre:x.p.nombre_completo_origen}));
}
function doGet() {
  return HtmlService.createHtmlOutputFromFile('FormularioV3')
    .setTitle('Aula QR · Identificación del participante')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
