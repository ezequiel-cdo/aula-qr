/**
 * EPJA V3 - Registro Maestro existente: docente + autocompletado Aula QR.
 * Sustituye el contenido de EPJA_Buscador_Real_Privado_V3.gs.
 * No modifica ninguna hoja ni utiliza códigos V4.
 *
 * ADVERTENCIA: antes de publicar el proyecto actual como "Cualquier persona",
 * retirar V4 y auditar TODAS las funciones globales V1/V2 (ejecutar como Yo
 * daría acceso a funciones públicas potencialmente administrativas).
 */
const EPJA_V3 = Object.freeze({
  ADMIN:'ecuello.minerd@gmail.com',
  MATRICULAS:'Matriculas_2026_2027',
  PERSONAS:'Personas',
  ALIAS:'Alias_Nombres',
  MAX:5
});
function epjaV3ExigirAdmin_(){
  const active=String(Session.getActiveUser().getEmail()||'').toLowerCase();
  const effective=String(Session.getEffectiveUser().getEmail()||'').toLowerCase();
  if(active!==EPJA_V3.ADMIN||effective!==EPJA_V3.ADMIN)
    throw new Error('Solo el administrador institucional puede usar el buscador privado.');
}
function epjaV3Leer_(nombre,obligatorias){
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  const hoja=ss.getSheetByName(nombre);
  if(!hoja)throw new Error('No existe la hoja: '+nombre);
  const values=hoja.getDataRange().getDisplayValues();
  if(!values.length)throw new Error('No hay cabeceras en: '+nombre);
  const header=values[0].map(x=>x.trim());
  obligatorias.forEach(k=>{if(!header.includes(k))throw new Error('Falta '+k+' en '+nombre)});
  return values.slice(1)
    .map(v=>Object.fromEntries(header.map((k,i)=>[k,String(v[i]||'').trim()])))
    .filter(x=>Object.values(x).some(Boolean));
}
function epjaV3Normalizar_(x){
  return String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
}
function epjaV3DistanciaCorta_(a,b){
  if(Math.abs(a.length-b.length)>1||a.length>32||b.length>32)return 9;
  let ant=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++){
    const sig=[i];
    for(let j=1;j<=b.length;j++)
      sig[j]=Math.min(sig[j-1]+1,ant[j]+1,ant[j-1]+(a[i-1]===b[j-1]?0:1));
    ant=sig;
  }
  return ant[b.length];
}
function epjaV3Puntuacion_(consulta,variantes){
  const partes=consulta.split(' ').filter(Boolean);
  let mejor=0;
  variantes.forEach(raw=>{
    const nombre=epjaV3Normalizar_(raw),palabras=nombre.split(' ');
    if(!nombre)return;
    if(nombre===consulta)mejor=Math.max(mejor,120);
    if(nombre.startsWith(consulta))mejor=Math.max(mejor,100);
    if(nombre.includes(consulta))mejor=Math.max(mejor,75);
    const aciertos=partes.map(p=>palabras.includes(p)?30:
      palabras.some(w=>w.startsWith(p))?22:
      p.length>=4&&palabras.some(w=>epjaV3DistanciaCorta_(p,w)<=1)?12:0);
    if(aciertos.length&&aciertos.every(Boolean))
      mejor=Math.max(mejor,aciertos.reduce((a,b)=>a+b,0));
  });
  return mejor;
}
function epjaV3AbrirBuscadorReal(){
  epjaV3ExigirAdmin_();
  const html=HtmlService.createHtmlOutputFromFile('EPJA_Buscador_Real_V3')
    .setTitle('EPJA | Buscador de matrícula real');
  SpreadsheetApp.getUi().showSidebar(html);
}
function epjaV3ContextosBase_(){
  const filas=epjaV3Leer_(EPJA_V3.MATRICULAS,
    ['persona_id_interno','anio_escolar','curso','seccion']);
  const values=new Map();
  filas.forEach(m=>{
    const key=[m.anio_escolar,m.curso,m.seccion].join('|');
    if(m.anio_escolar&&m.curso&&m.seccion)
      values.set(key,{anio:m.anio_escolar,curso:m.curso,seccion:m.seccion});
  });
  return [...values.values()].sort((a,b)=>
    [a.anio,a.curso,a.seccion].join('|').localeCompare([b.anio,b.curso,b.seccion].join('|'),'es'));
}
function epjaV3Contextos(){
  epjaV3ExigirAdmin_();
  return epjaV3ContextosBase_();
}
function epjaV3ContextosPublicos(){
  return epjaV3ContextosBase_();
}
function epjaV3BuscarBase_(anio,curso,seccion,texto){
  const q=epjaV3Normalizar_(texto);
  if(q.length<3||q.length>80)return [];
  if(!epjaV3ContextosBase_().some(c=>c.anio===anio&&c.curso===curso&&c.seccion===seccion))return [];
  const matriculas=epjaV3Leer_(EPJA_V3.MATRICULAS,
    ['persona_id_interno','anio_escolar','curso','seccion','estado_matricula']);
  const ids=new Set(matriculas
    .filter(m=>m.anio_escolar===anio&&m.curso===curso&&m.seccion===seccion)
    .map(m=>m.persona_id_interno).filter(Boolean));
  if(!ids.size)return [];
  const personas=epjaV3Leer_(EPJA_V3.PERSONAS,
    ['persona_id_interno','nombre_completo_origen','identidad_confirmada']);
  const alias=epjaV3Leer_(EPJA_V3.ALIAS,
    ['persona_id_interno','alias_validado','estado']);
  const aliasMap=new Map();
  alias.forEach(a=>{
    if(String(a.estado).toUpperCase()!=='VALIDADO')return;
    if(!aliasMap.has(a.persona_id_interno))aliasMap.set(a.persona_id_interno,[]);
    aliasMap.get(a.persona_id_interno).push(a.alias_validado);
  });
  return personas.filter(p=>ids.has(p.persona_id_interno))
    .map(p=>({p,score:epjaV3Puntuacion_(q,
      [p.nombre_completo_origen].concat(aliasMap.get(p.persona_id_interno)||[]))}))
    .filter(x=>x.score>=12)
    .sort((a,b)=>b.score-a.score||
      a.p.nombre_completo_origen.localeCompare(b.p.nombre_completo_origen,'es'))
    .slice(0,EPJA_V3.MAX).map(x=>({
      nombre:x.p.nombre_completo_origen,
      estado_identidad:x.p.identidad_confirmada==='SI'?'Confirmada':'Pendiente de confirmar'
    }));
}
function epjaV3BuscarNombres(anio,curso,seccion,texto){
  epjaV3ExigirAdmin_();
  return epjaV3BuscarBase_(anio,curso,seccion,texto);
}
function epjaV3BuscarNombresPublico(anio,curso,seccion,texto){
  return epjaV3BuscarBase_(anio,curso,seccion,texto).map(r=>({nombre:r.nombre}));
}
/** Entrada del formulario público. ¡Desplegar solo después de auditar V1/V2 y retirar V4! */
function doGet(e){
  return HtmlService.createHtmlOutputFromFile('EPJA_Buscador_Real_V3')
    .setTitle('Aula QR | Identificación del participante')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}
