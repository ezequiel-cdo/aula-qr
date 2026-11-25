/**
 * PAIVD v0.4 - recepción de solicitudes. Solo ensayo con datos ficticios.
 * Proyecto PARTICIPANTES: instalar este archivo y PAIVD_Registro.gs.
 * No instalar funciones administrativas en este proyecto.
 * Propiedades privadas: PAIVD_TARGET_ID, PAIVD_ENSAYO=SI,
 * PAIVD_SECRETO (64 hex aleatorios). Sin credenciales para declaraciones.
 */
const PAIVD_V_='0.4';
function paivdProp_(key){const v=PropertiesService.getScriptProperties().getProperty(key);if(!v)throw Error('Configuración incompleta');return v;}
function paivdLibro_(){if(paivdProp_('PAIVD_ENSAYO')!=='SI')throw Error('Solo ensayo');const ss=SpreadsheetApp.openById(paivdProp_('PAIVD_TARGET_ID'));if(ss.getName()!=='PAIVD_ENSAYO_FICTICIO')throw Error('Solo libro ficticio');return ss;}
function paivdSecret_(){const s=paivdProp_('PAIVD_SECRETO');if(!/^[a-f0-9]{64}$/i.test(s))throw Error('Configuración incompleta');return s;}
function paivdDigest_(s){return Utilities.computeHmacSha256Signature(s,paivdSecret_()).map(b=>('0'+(b&255).toString(16)).slice(-2)).join('');}
function paivdToken_(){return Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'');}
function paivdLock_(fn){const l=LockService.getScriptLock();l.waitLock(15000);try{return fn();}finally{l.releaseLock();}}
function paivdTable_(ss,name,head){const h=ss.getSheetByName(name);if(!h||h.getLastColumn()!==head.length||h.getRange(1,1,1,head.length).getDisplayValues()[0].some((v,i)=>v!==head[i]))throw Error('Esquema incompatible');return h;}
const PAIVD_SOL_HEAD_=['ID_Solicitud','ID_Interno','ID_Estudiante','ID_Matricula','Fecha_Solicitud','Estado','Datos_Propuestos_JSON','Version_Esquema','Fecha_Revision','Responsable_Revision','Observaciones_Revision'];
function paivdRows_(h){return h.getLastRow()>1?h.getRange(2,1,h.getLastRow()-1,h.getLastColumn()).getDisplayValues():[];}
function paivdCache_(){return CacheService.getScriptCache();}
function paivdPiloto_(){return epjaPublicoRegistroValidado_().filas;}
function paivdRef_(r){return {i:r.ID_Interno,e:r.ID_Estudiante,m:r.ID_Matricula,n:r.Nombre_Mostrar,a:r.Ano_Escolar,c:r.Curso,s:r.Seccion};}
function paivdActual_(ref){const r=paivdPiloto_().find(x=>x.ID_Matricula===ref.m);if(!r||JSON.stringify(paivdRef_(r))!==JSON.stringify(ref))throw Error('La matrícula cambió. Contacta al docente.');return r;}
function paivdPublica_(r){return {nombre:r.Nombre_Mostrar,anio:r.Ano_Escolar,curso:r.Curso,seccion:r.Seccion};}
function paivdReadToken_(prefix,t){if(typeof t!=='string'||! /^[a-f0-9]{64}$/.test(t))throw Error('Sesión no válida');const raw=paivdCache_().get(prefix+paivdDigest_(t));if(!raw)throw Error('Sesión vencida. Vuelve a buscar tu nombre.');return JSON.parse(raw);}
function paivdStore_(prefix,data,seconds){const t=paivdToken_();paivdCache_().put(prefix+paivdDigest_(t),JSON.stringify(data),seconds);return t;}
function paivdLimit_(key,max,windowMs){const p=PropertiesService.getScriptProperties(),now=Date.now();let a;try{a=JSON.parse(p.getProperty(key)||'null');}catch(e){a=null;}if(!a||a.until<=now)a={n:0,until:now+windowMs};if(a.n>=max)throw Error('Límite temporal alcanzado. Intenta más tarde.');a.n++;p.setProperty(key,JSON.stringify(a));}
function paivdContextos(){
  const m=new Map();
  paivdPiloto_().forEach(r=>{const k=JSON.stringify([r.Ano_Escolar,r.Curso,r.Seccion]);m.set(k,{anio:r.Ano_Escolar,curso:r.Curso,seccion:r.Seccion});});
  return [...m.values()].sort((a,b)=>b.anio.localeCompare(a.anio)||a.curso.localeCompare(b.curso,'es')||a.seccion.localeCompare(b.seccion,'es'));
}
function paivdBuscar(anio,curso,seccion,texto){
  if([anio,curso,seccion,texto].some(x=>typeof x!=='string'||x.length>80))return [];
  const q=epjaPublicoNormalizar_(texto);if(q.length<3)return [];
  paivdLock_(()=>paivdLimit_('PAIVD_BUSQUEDAS',300,600000));
  const lista=paivdPiloto_().filter(r=>(!anio||r.Ano_Escolar===anio)&&(!curso||r.Curso===curso)&&(!seccion||r.Seccion===seccion)).map(r=>({r,score:epjaPublicoPuntuacion_(q,[r.Nombre_Mostrar])})).filter(x=>x.score>=12).sort((a,b)=>b.score-a.score||a.r.Nombre_Mostrar.localeCompare(b.r.Nombre_Mostrar,'es'));
  return paivdAgrupar_(lista).map(x=>({...paivdPublica_(x.r),homonimos:x.refs.length,token:paivdStore_('sel:',{refs:x.refs},600)}));
}
function paivdAgrupar_(lista){
 const grupos=new Map();
 lista.forEach(({r})=>{
   const k=JSON.stringify([r.Nombre_Mostrar,r.Ano_Escolar,r.Curso,r.Seccion]);
   if(!grupos.has(k))grupos.set(k,{r,refs:[]});
   grupos.get(k).refs.push(paivdRef_(r));
 });
 return [...grupos.values()].slice(0,5);
}
// La selección solo autoriza enviar una declaración, nunca leer información privada.
function paivdGrupoActual_(refs){
  if(!Array.isArray(refs)||!refs.length)throw Error('Vuelve a buscar tu nombre');
  const first=refs[0];
  const actuales=paivdPiloto_().filter(r=>r.Nombre_Mostrar===first.n&&r.Ano_Escolar===first.a&&r.Curso===first.c&&r.Seccion===first.s).map(paivdRef_);
  const canon=arr=>JSON.stringify(arr.slice().sort((x,y)=>x.m.localeCompare(y.m)));
  if(canon(actuales)!==canon(refs))throw Error('La selección cambió. Busca tu nombre nuevamente.');
  return actuales;
}
function paivdDeclarar(seleccion,confirmado){
  if(confirmado!==true)throw Error('Confirma tu selección');
  return paivdLock_(()=>{
    const selection=paivdReadToken_('sel:',seleccion);
    paivdLimit_('PAIVD_DECLARACIONES_GLOBAL',120,900000);
    const refs=paivdGrupoActual_(selection.refs),first=refs[0];
    // Reintento de la misma selección conserva el identificador de solicitud.
    if(selection.declaracion)return selection.declaracion;
    const session=paivdStore_('decl04:',{refs,sol:Utilities.getUuid(),exp:Date.now()+1800000},1800);
    const result={session,datos:{nombre:first.n,anio:first.a,curso:first.c,seccion:first.s},homonimos:refs.length};
    selection.declaracion=result;
    paivdCache_().put('sel:'+paivdDigest_(seleccion),JSON.stringify(selection),600);
    return result;
  });
}
function paivdTexto_(v,max,required=false){if(typeof v!=='string')throw Error('Campo no válido');const s=v.trim();if(s.length>max||(required&&!s)||/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(s))throw Error('Revisa los campos del formulario');return s;}
function paivdEnum_(v,opts){if(!opts.includes(v))throw Error('Selecciona una opción válida');return v;}
function paivdTel_(v){let s=paivdTexto_(v,30).replace(/[ ()-]/g,'');if(s.startsWith('+1'))s=s.slice(2);else if(s.length===11&&s[0]==='1')s=s.slice(1);if(!/^(809|829|849)[2-9]\d{6}$/.test(s))throw Error('Usa un teléfono dominicano de 10 dígitos');return '+1'+s;}
function paivdContacto_(x,tipo){if(!x||typeof x!=='object'||Array.isArray(x))throw Error('Contacto no válido');const relacion=paivdEnum_(x.relacion,['PROPIO','COMPARTIDO','FAMILIAR','OTRO']);if(tipo==='EMERGENCIA'&&relacion==='PROPIO')throw Error('Indica otra persona para emergencia');return {tipo,telefono:paivdTel_(x.telefono),titular:paivdTexto_(x.titular,120,relacion!=='PROPIO'),relacion,whatsapp:paivdEnum_(x.whatsapp,['SI','NO','NO_SABE'])};}
function paivdValidar_(p){
  if(!p||typeof p!=='object'||Array.isArray(p))throw Error('Solicitud no válida');
  const confirmacion=paivdEnum_(p.confirmacion,['CORRECTOS','CORREGIR']);
  const correccion=paivdTexto_(p.correccion,600,confirmacion==='CORREGIR');
  if(confirmacion==='CORRECTOS'&&correccion)throw Error('Revisa la confirmación');
  if(typeof p.sinTelefonoPropio!=='boolean'||p.consentimiento!==true)throw Error('Confirma la declaración y el aviso de privacidad');
  const contactos=[];
  if(p.principal)contactos.push(paivdContacto_(p.principal,'PRINCIPAL'));
  if(p.alternativo)contactos.push(paivdContacto_(p.alternativo,'ALTERNATIVO'));
  if(p.emergencia)contactos.push(paivdContacto_(p.emergencia,'EMERGENCIA'));
  if(!p.sinTelefonoPropio&&!contactos.some(c=>c.tipo!=='EMERGENCIA'&&c.relacion==='PROPIO'))throw Error('Indica tu teléfono propio o marca que no dispones de uno');
  if(p.sinTelefonoPropio&&contactos.some(c=>c.tipo!=='EMERGENCIA'&&c.relacion==='PROPIO'))throw Error('Revisa la titularidad');
  if(contactos.some(c=>c.tipo==='ALTERNATIVO')&&!contactos.some(c=>c.tipo==='PRINCIPAL'))throw Error('Indica primero el contacto principal');
  const pers=contactos.filter(c=>c.tipo!=='EMERGENCIA');
  if(new Set(pers.map(c=>c.telefono)).size!==pers.length)throw Error('Los teléfonos principal y alternativo deben ser distintos');
  const correo=paivdTexto_(p.correo,160);if(correo&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))throw Error('Correo no válido');
  const perfil={dispositivo:paivdEnum_(p.dispositivo,['CELULAR','TABLETA','COMPUTADORA','NINGUNO']),titularidad:paivdEnum_(p.titularidad,['PROPIO','COMPARTIDO','PRESTADO','NO_APLICA']),conectividad:paivdEnum_(p.conectividad,['SIEMPRE','ALGUNAS_VECES','NO']),dificultades:paivdEnum_(p.dificultades,['SI','NO','ALGUNAS_VECES'])};
  if((perfil.dispositivo==='NINGUNO')!==(perfil.titularidad==='NO_APLICA'))throw Error('Revisa el dispositivo y su titularidad');
  return {confirmacion,correccion,contactos,sinTelefonoPropio:p.sinTelefonoPropio,municipio:paivdTexto_(p.municipio,100,true),sector:paivdTexto_(p.sector,120,true),correo,perfil,consentimiento:true,avisoVersion:'ENSAYO-0.4'};
}
function paivdEnviar(session,payload){
  return paivdLock_(()=>{
    const s=paivdReadToken_('decl04:',session);if(Date.now()>=s.exp)throw Error('Sesión vencida. Vuelve a buscar tu nombre.');
    const refs=paivdGrupoActual_(s.refs),first=refs[0],data=paivdValidar_(payload);
    const h=paivdTable_(paivdLibro_(),'Actualizaciones',PAIVD_SOL_HEAD_),rows=paivdRows_(h);
    if(rows.some(r=>r[0]===s.sol))return {ok:true,referencia:s.sol,estado:'RECIBIDA'};
    paivdLimit_('PAIVD_ENVIOS_GLOBAL',120,900000);
    // No bloquear a la persona legítima por una declaración de terceros.
    // Toda declaración queda sin asignación oficial, incluso con candidato único.
    data.identificacion={tipo:'DECLARADA_NO_VERIFICADA',nombre:first.n,anio:first.a,curso:first.c,seccion:first.s,candidatos:refs.map(r=>({ID_Interno:r.i,ID_Estudiante:r.e,ID_Matricula:r.m}))};
    const estado=refs.length>1?'PENDIENTE_ASIGNACION':'PENDIENTE';
    h.appendRow([s.sol,'','','',new Date().toISOString(),estado,JSON.stringify(data),PAIVD_V_,'','','']);
    SpreadsheetApp.flush();
    return {ok:true,referencia:s.sol,estado:'RECIBIDA'};
  });
}
function doGet(){return HtmlService.createHtmlOutputFromFile('FormularioPAIVD').setTitle('PAIVD · Ensayo institucional');}
