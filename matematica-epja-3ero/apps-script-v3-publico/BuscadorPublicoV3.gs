/**
 * Aula QR · Buscador público V3, fuente institucional EPJA (2026-2027).
 * SOLO LECTURA. Proyecto Apps Script público independiente.
 * Fuente exclusiva: Registro_Maestro_Institucional_EPJA_V1 / Vista_AulaQR.
 * NO consulta hojas administrativas, teléfonos, historial ni fuente manual de 167.
 * Selección de nombre = identificación declarada; NO autenticación ni acceso a notas.
 *
 * IMPORTANTE: el ID de Google Sheets procede del enlace mostrado por el centro;
 * verificarlo en la barra de direcciones antes de activar una nueva implementación.
 */
const EPJA_PUBLICO=Object.freeze({
  SHEET_ID:'1rS8wZJx5x28mbBEj2MnQ9UXdLzof2eB1-7bnANO-slo',
  VISTA:'Vista_AulaQR',
  MAX:5,
  CACHE_SECONDS:600,
  DESTINOS:Object.freeze({
    Primero:'https://ezequiel-cdo.github.io/aula-qr/matematica-epja-1ero/',
    Segundo:'https://ezequiel-cdo.github.io/aula-qr/matematica-epja-2do/',
    Tercero:'https://ezequiel-cdo.github.io/aula-qr/matematica-epja-3ero/',
    Cuarto:'https://ezequiel-cdo.github.io/aula-qr/matematica-epja-4to/',
    Quinto:'https://ezequiel-cdo.github.io/aula-qr/matematica-epja-5to/'
  })
});
function epjaPublicoLeerVista_(){
  const hoja=SpreadsheetApp.openById(EPJA_PUBLICO.SHEET_ID).getSheetByName(EPJA_PUBLICO.VISTA);
  if(!hoja)throw new Error('Falta la hoja institucional Vista_AulaQR');
  const datos=hoja.getDataRange().getDisplayValues();
  if(!datos.length)throw new Error('Vista_AulaQR no contiene encabezados');
  const campos=datos[0].map(v=>String(v||'').trim());
  const requeridos=['ID_Interno','Ano_Escolar','Curso','Seccion','Nombre_Mostrar','ID_Matricula'];
  requeridos.forEach(c=>{if(!campos.includes(c))throw new Error('Falta columna '+c)});
  return datos.slice(1).map(row=>Object.fromEntries(requeridos.map(c=>[c,String(row[campos.indexOf(c)]||'').trim()])))
    .filter(r=>requeridos.every(c=>r[c]));
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

function epjaPublicoContextos(){
  const mapa=new Map();
  epjaPublicoLeerVista_().forEach(r=>{
    if(!EPJA_PUBLICO.DESTINOS[r.Curso])return;
    const k=[r.Ano_Escolar,r.Curso,r.Seccion].join('|');
    mapa.set(k,{anio:r.Ano_Escolar,curso:r.Curso,seccion:r.Seccion});
  });
  const orden=['Primero','Segundo','Tercero','Cuarto','Quinto'];
  return Array.from(mapa.values()).sort((a,b)=>b.anio.localeCompare(a.anio,'es')
    ||orden.indexOf(a.curso)-orden.indexOf(b.curso)
    ||a.seccion.localeCompare(b.seccion,'es'));
}
function epjaPublicoBuscarNombres(anio,curso,seccion,texto){
  const q=epjaPublicoNormalizar_(texto);
  if(q.length<3||q.length>80||!EPJA_PUBLICO.DESTINOS[curso])return [];
  const filas=epjaPublicoLeerVista_().filter(r=>r.Ano_Escolar===anio&&r.Curso===curso&&r.Seccion===seccion);
  const lista=filas.map(r=>({r,score:epjaPublicoPuntuacion_(q,[r.Nombre_Mostrar])}))
    .filter(x=>x.score>=12)
    .sort((a,b)=>b.score-a.score||a.r.Nombre_Mostrar.localeCompare(b.r.Nombre_Mostrar,'es'))
    .slice(0,EPJA_PUBLICO.MAX);
  const cache=CacheService.getScriptCache();
  return lista.map(x=>{
    const token=Utilities.getUuid();
    // El navegador solo recibe un token efímero; ambos IDs permanecen en servidor.
    cache.put('epja-v3:'+token,JSON.stringify({
      idInterno:x.r.ID_Interno,idMatricula:x.r.ID_Matricula,
      anio:x.r.Ano_Escolar,curso:x.r.Curso,seccion:x.r.Seccion,nombre:x.r.Nombre_Mostrar
    }),EPJA_PUBLICO.CACHE_SECONDS);
    return {nombre:x.r.Nombre_Mostrar,token:token};
  });
}
function epjaPublicoConfirmarSeleccion(token){
  if(!/^[0-9a-f-]{36}$/i.test(String(token||'')))throw new Error('Selección no válida');
  const contenido=CacheService.getScriptCache().get('epja-v3:'+token);
  if(!contenido)throw new Error('Selección vencida: vuelve a buscar tu nombre');
  const r=JSON.parse(contenido);
  if(!EPJA_PUBLICO.DESTINOS[r.curso])throw new Error('Curso sin aula configurada');
  return {nombre:r.nombre,anio:r.anio,curso:r.curso,seccion:r.seccion,
    destino:EPJA_PUBLICO.DESTINOS[r.curso]};
}
function epjaPublicoPruebaInstitucional_(){
  // Ejecutar manualmente desde el editor (no exponer en el HTML).
  const filas=epjaPublicoLeerVista_();
  const ids=new Set(filas.map(r=>r.ID_Interno));
  const matriculas=new Set(filas.map(r=>r.ID_Matricula));
  if(ids.size!==filas.length||matriculas.size!==filas.length)
    throw new Error('Identificadores internos o matrículas duplicados');
  const grupos=epjaPublicoContextos();
  Logger.log('Fuente institucional: '+filas.length+' matrículas, '+grupos.length+' grupos');
  Logger.log(JSON.stringify(grupos));
  return {matriculas:filas.length,grupos:grupos.length};
}
function doGet(){
  return HtmlService.createHtmlOutputFromFile('FormularioV3')
    .setTitle('Aula QR · Identificación del participante');
}
