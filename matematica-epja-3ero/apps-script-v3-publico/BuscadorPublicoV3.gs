/**
 * Aula QR · Buscador público V3, fuente institucional EPJA (2026-2027).
 * SOLO LECTURA. Proyecto Apps Script público independiente.
 * Fuente exclusiva: Registro_Maestro_Institucional_EPJA_V1.
 * Valida Estudiantes + Matriculas + Vista_AulaQR (solo campos mínimos).
 * NO consulta teléfonos, historial, datos reservados ni fuente manual de 167.
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
/**
 * Filas de uso mínimo: no extrae contactos, documentos ni antecedentes.
 * Falla explícitamente ante columnas ausentes o referencias incoherentes.
 */
function epjaPublicoLeerColumnas_(libro,nombre,requeridos){
  const hoja=libro.getSheetByName(nombre);
  if(!hoja)throw new Error('Falta la hoja '+nombre);
  const datos=hoja.getDataRange().getDisplayValues();
  if(!datos.length)throw new Error('No hay encabezados en '+nombre);
  const encabezados=datos[0].map(x=>String(x||'').trim());
  const indices=requeridos.map(c=>{
    const i=encabezados.indexOf(c);
    if(i<0)throw new Error('Falta columna '+nombre+'.'+c);
    return i;
  });
  return datos.slice(1).map((fila,i)=>({
    fila:i+2,
    datos:Object.fromEntries(requeridos.map((c,j)=>[c,String(fila[indices[j]]||'').trim()]))
  })).filter(x=>Object.values(x.datos).some(Boolean));
}
function epjaPublicoRegistroValidado_(){
  const libro=SpreadsheetApp.openById(EPJA_PUBLICO.SHEET_ID);
  const estudiantes=epjaPublicoLeerColumnas_(libro,'Estudiantes',
    ['ID_Interno','ID_Estudiante','Apellidos_Nombres']);
  const matriculas=epjaPublicoLeerColumnas_(libro,'Matriculas',
    ['ID_Matricula','ID_Interno','ID_Estudiante','Ano_Escolar','Curso','Seccion','Estado']);
  const vista=epjaPublicoLeerColumnas_(libro,EPJA_PUBLICO.VISTA,
    ['ID_Interno','Ano_Escolar','Curso','Seccion','Nombre_Mostrar','ID_Matricula']);
  const porInterno=new Map(),porOficial=new Map(),porMatricula=new Map();
  function invalida(tabla,fila,razon){throw new Error('Inconsistencia en '+tabla+' fila '+fila+': '+razon)}
  estudiantes.forEach(({fila,datos:e})=>{
    if(!e.ID_Interno||!e.ID_Estudiante||!e.Apellidos_Nombres)
      invalida('Estudiantes',fila,'identificador o nombre vacío');
    if(porInterno.has(e.ID_Interno)||porOficial.has(e.ID_Estudiante))
      invalida('Estudiantes',fila,'ID_Interno o ID_Estudiante duplicado');
    porInterno.set(e.ID_Interno,e);porOficial.set(e.ID_Estudiante,e);
  });
  matriculas.forEach(({fila,datos:m})=>{
    if(!m.ID_Matricula||!m.ID_Interno||!m.ID_Estudiante||!m.Ano_Escolar||
       !m.Curso||!m.Seccion||!m.Estado)invalida('Matriculas',fila,'campo requerido vacío');
    if(porMatricula.has(m.ID_Matricula))invalida('Matriculas',fila,'ID_Matricula duplicado');
    const e=porInterno.get(m.ID_Interno);
    if(!e||e.ID_Estudiante!==m.ID_Estudiante||
       porOficial.get(m.ID_Estudiante)!==e)
      invalida('Matriculas',fila,'no coincide ID_Estudiante con la persona');
    porMatricula.set(m.ID_Matricula,m);
  });
  const usadas=new Set(),validas=[];
  vista.forEach(({fila,datos:v})=>{
    if(['ID_Interno','Ano_Escolar','Curso','Seccion','Nombre_Mostrar','ID_Matricula']
      .some(c=>!v[c]))invalida(EPJA_PUBLICO.VISTA,fila,'campo requerido vacío');
    if(usadas.has(v.ID_Matricula))invalida(EPJA_PUBLICO.VISTA,fila,'matrícula repetida');
    usadas.add(v.ID_Matricula);
    const m=porMatricula.get(v.ID_Matricula);
    const e=porInterno.get(v.ID_Interno);
    if(!m||!e||m.ID_Interno!==v.ID_Interno||
       e.ID_Estudiante!==m.ID_Estudiante||
       m.Ano_Escolar!==v.Ano_Escolar||m.Curso!==v.Curso||m.Seccion!==v.Seccion||
       epjaPublicoNormalizar_(e.Apellidos_Nombres)!==epjaPublicoNormalizar_(v.Nombre_Mostrar))
      invalida(EPJA_PUBLICO.VISTA,fila,'persona, nombre, matrícula o grupo no coincide');
    if(m.Estado.toLowerCase()!=='inscrito')return; // No ofrecer bajas o traslados
    if(!EPJA_PUBLICO.DESTINOS[v.Curso])return;
    validas.push({...v,ID_Estudiante:e.ID_Estudiante});
  });
  // Ninguna matrícula activa queda excluida silenciosamente de la vista.
  matriculas.forEach(({fila,datos:m})=>{
    if(m.Estado.toLowerCase()==='inscrito'&&EPJA_PUBLICO.DESTINOS[m.Curso]&&!usadas.has(m.ID_Matricula))
      invalida('Matriculas',fila,'matrícula inscrita ausente de Vista_AulaQR');
  });
  return {filas:validas,estudiantes:estudiantes.length,matriculas:matriculas.length};
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
  epjaPublicoRegistroValidado_().filas.forEach(r=>{
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
  const filas=epjaPublicoRegistroValidado_().filas.filter(r=>r.Ano_Escolar===anio&&r.Curso===curso&&r.Seccion===seccion);
  const lista=filas.map(r=>({r,score:epjaPublicoPuntuacion_(q,[r.Nombre_Mostrar])}))
    .filter(x=>x.score>=12)
    .sort((a,b)=>b.score-a.score||a.r.Nombre_Mostrar.localeCompare(b.r.Nombre_Mostrar,'es'))
    .slice(0,EPJA_PUBLICO.MAX);
  const cache=CacheService.getScriptCache();
  return lista.map(x=>{
    const token=Utilities.getUuid();
    // El navegador solo recibe un token efímero; ambos IDs permanecen en servidor.
    cache.put('epja-v3:'+token,JSON.stringify({
      idInterno:x.r.ID_Interno,idEstudiante:x.r.ID_Estudiante,idMatricula:x.r.ID_Matricula,
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
  // Revalidar también al continuar: no basta un resultado guardado antes de un cambio.
  const actual=epjaPublicoRegistroValidado_().filas.find(x=>x.ID_Matricula===r.idMatricula);
  if(!actual||actual.ID_Interno!==r.idInterno||
      actual.ID_Estudiante!==r.idEstudiante||
      actual.Ano_Escolar!==r.anio||actual.Curso!==r.curso||
      actual.Seccion!==r.seccion||actual.Nombre_Mostrar!==r.nombre)
    throw new Error('La matrícula cambió o no está vigente; vuelve a identificarte');
  return {nombre:actual.Nombre_Mostrar,anio:actual.Ano_Escolar,
    curso:actual.Curso,seccion:actual.Seccion,
    destino:EPJA_PUBLICO.DESTINOS[actual.Curso]};
}
function epjaPublicoPruebaInstitucional_(){
  const datos=epjaPublicoRegistroValidado_();
  const filas=datos.filas;
  const internos=new Set(filas.map(r=>r.ID_Interno));
  const oficiales=new Set(filas.map(r=>r.ID_Estudiante));
  const matriculas=new Set(filas.map(r=>r.ID_Matricula));
  if(internos.size!==filas.length||oficiales.size!==filas.length||
     matriculas.size!==filas.length)
    throw new Error('Identificadores duplicados en la matrícula vigente');
  const grupos=epjaPublicoContextos();
  Logger.log('Fuente institucional validada: '+filas.length+' matrículas, '+
    grupos.length+' grupos, '+oficiales.size+' ID_Estudiante oficiales');
  Logger.log(JSON.stringify(grupos));
  return {matriculas:filas.length,grupos:grupos.length,
    idEstudianteUnicos:oficiales.size};
}
function epjaPublicoPruebaInstitucional(){
  // Función ejecutable desde el editor; no publicarla como acción del formulario.
  return epjaPublicoPruebaInstitucional_();
}
function doGet(){
  return HtmlService.createHtmlOutputFromFile('FormularioV3')
    .setTitle('Aula QR · Identificación del participante');
}
