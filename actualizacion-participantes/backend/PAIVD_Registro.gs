/** Adaptación de BuscadorPublicoV3.gs: solo funciones privadas, sin ID de libro ni rutas públicas. */
const EPJA_PUBLICO=Object.freeze({VISTA:'Vista_AulaQR',DESTINOS:Object.freeze({Primero:true,Segundo:true,Tercero:true,Cuarto:true,Quinto:true})});
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
  const libro=paivdLibro_();
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

