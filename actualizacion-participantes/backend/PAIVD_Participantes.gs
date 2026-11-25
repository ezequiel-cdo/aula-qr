/**
 * PAIVD v0.2 - recepción de solicitudes. Solo ensayo con datos ficticios.
 * Proyecto PARTICIPANTES: instalar este archivo y PAIVD_Registro.gs.
 * No instalar funciones administrativas en este proyecto.
 * Propiedades privadas: PAIVD_TARGET_ID, PAIVD_ENSAYO=SI,
 * PAIVD_CREDENCIALES_ID (libro privado auxiliar), PAIVD_SECRETO (64 hex aleatorios).
 */
const PAIVD_V_='0.2';
function paivdProp_(key){const v=PropertiesService.getScriptProperties().getProperty(key);if(!v)throw Error('Configuración incompleta');return v;}
function paivdLibro_(){if(paivdProp_('PAIVD_ENSAYO')!=='SI')throw Error('Solo ensayo');return SpreadsheetApp.openById(paivdProp_('PAIVD_TARGET_ID'));}
function paivdCred_(){return SpreadsheetApp.openById(paivdProp_('PAIVD_CREDENCIALES_ID'));}
function paivdSecret_(){const s=paivdProp_('PAIVD_SECRETO');if(!/^[a-f0-9]{64}$/i.test(s))throw Error('Configuración incompleta');return s;}
function paivdDigest_(s){return Utilities.computeHmacSha256Signature(s,paivdSecret_()).map(b=>('0'+(b&255).toString(16)).slice(-2)).join('');}
function paivdToken_(){return Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'');}
function paivdEqual_(a,b){if(typeof a!=='string'||typeof b!=='string'||a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0;}
function paivdLock_(fn){const l=LockService.getScriptLock();l.waitLock(15000);try{return fn();}finally{l.releaseLock();}}
function paivdTable_(ss,name,head){const h=ss.getSheetByName(name);if(!h||h.getLastColumn()!==head.length||h.getRange(1,1,1,head.length).getDisplayValues()[0].some((v,i)=>v!==head[i]))throw Error('Esquema incompatible');return h;}
const PAIVD_CRED_HEAD_=['ID_Matricula','Hash_Codigo','Expira_MS','Estado','Responsable','Fecha_Emision'];
const PAIVD_SOL_HEAD_=['ID_Solicitud','ID_Interno','ID_Estudiante','ID_Matricula','Fecha_Solicitud','Estado','Datos_Propuestos_JSON','Version_Esquema','Fecha_Revision','Responsable_Revision','Observaciones_Revision'];
const PAIVD_VER_HEAD_=['ID_Verificacion','ID_Interno','ID_Estudiante','ID_Matricula','Metodo','Resultado','Fecha_Verificacion','Responsable'];
function paivdRows_(h){return h.getLastRow()>1?h.getRange(2,1,h.getLastRow()-1,h.getLastColumn()).getDisplayValues():[];}
function paivdCache_(){return CacheService.getScriptCache();}
function paivdPiloto_(){return epjaPublicoRegistroValidado_().filas;}
function paivdRef_(r){return {i:r.ID_Interno,e:r.ID_Estudiante,m:r.ID_Matricula,n:r.Nombre_Mostrar,a:r.Ano_Escolar,c:r.Curso,s:r.Seccion};}
function paivdActual_(ref){const r=paivdPiloto_().find(x=>x.ID_Matricula===ref.m);if(!r||JSON.stringify(paivdRef_(r))!==JSON.stringify(ref))throw Error('La matrícula cambió. Contacta al docente.');return r;}
function paivdPublica_(r){return {nombre:r.Nombre_Mostrar,anio:r.Ano_Escolar,curso:r.Curso,seccion:r.Seccion};}
function paivdReadToken_(prefix,t){if(typeof t!=='string'||! /^[a-f0-9]{64}$/.test(t))throw Error('Sesión no válida');const raw=paivdCache_().get(prefix+paivdDigest_(t));if(!raw)throw Error('Sesión vencida. Contacta al docente si necesitas otra credencial.');return JSON.parse(raw);}
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
  return lista.slice(0,5).map(x=>({...paivdPublica_(x.r),token:paivdStore_('sel:',paivdRef_(x.r),600)}));
}
function paivdVerificar(seleccion,codigo){
  return paivdLock_(()=>{
    const ref=paivdReadToken_('sel:',seleccion);
    paivdLimit_('PAIVD_INTENTOS_GLOBAL',100,900000);
    paivdLimit_('PAIVD_INT_'+paivdDigest_(ref.m),5,900000);
    if(typeof codigo!=='string'||!/^[a-f0-9]{64}$/i.test(codigo.trim()))throw Error('Credencial no válida');
    const r=paivdActual_(ref), h=paivdTable_(paivdCred_(),'Credenciales',PAIVD_CRED_HEAD_);
    const rows=paivdRows_(h), digest=paivdDigest_('codigo:'+codigo.trim().toLowerCase());
    const matches=rows.map((v,i)=>({v,i})).filter(x=>x.v[0]===ref.m&&x.v[3]==='EMITIDA'&&Number(x.v[2])>Date.now()&&paivdEqual_(x.v[1],digest));
    if(matches.length!==1)throw Error('Credencial no válida o vencida');
    const x=matches[0], ss=paivdLibro_(), log=paivdTable_(ss,'Verificacion_Identidad',PAIVD_VER_HEAD_);
    // Consumir antes de otorgar acceso. Ante un fallo posterior se requiere nueva emisión.
    h.getRange(x.i+2,4).setValue('CONSUMIDA');SpreadsheetApp.flush();
    log.appendRow([Utilities.getUuid(),ref.i,ref.e,ref.m,'CREDENCIAL_DOCENTE','VALIDADA',new Date().toISOString(),x.v[4]]);
    const session=paivdStore_('ses:',{ref,sol:Utilities.getUuid(),exp:Date.now()+1800000},1800);
    paivdCache_().remove('sel:'+paivdDigest_(seleccion));
    return {session,datos:paivdPublica_(r)};
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
  return {confirmacion,correccion,contactos,sinTelefonoPropio:p.sinTelefonoPropio,municipio:paivdTexto_(p.municipio,100,true),sector:paivdTexto_(p.sector,120,true),correo,perfil,consentimiento:true,avisoVersion:'ENSAYO-0.2'};
}
function paivdEnviar(session,payload){
  return paivdLock_(()=>{
    const s=paivdReadToken_('ses:',session);if(Date.now()>=s.exp)throw Error('Sesión vencida');paivdActual_(s.ref);
    const data=paivdValidar_(payload), h=paivdTable_(paivdLibro_(),'Actualizaciones',PAIVD_SOL_HEAD_),rows=paivdRows_(h);
    const existing=rows.find(r=>r[0]===s.sol);
    if(existing)return {ok:true,referencia:s.sol,estado:existing[5]};
    if(rows.some(r=>r[2]===s.ref.e&&['PENDIENTE','EN_REVISION','OBSERVADA'].includes(r[5])))throw Error('Ya hay una solicitud abierta. Contacta al docente.');
    // JSON starts with "{", not a formula prefix; IDs derive only from validated server rows.
    const safe=v=>/^[=+\-@]/.test(String(v))?"'"+v:v;
    h.appendRow([s.sol,safe(s.ref.i),safe(s.ref.e),safe(s.ref.m),new Date().toISOString(),'PENDIENTE',JSON.stringify(data),PAIVD_V_,'','','']);
    SpreadsheetApp.flush();
    // Mantener sesión hasta caducidad para recuperar el comprobante si se pierde respuesta.
    return {ok:true,referencia:s.sol,estado:'PENDIENTE'};
  });
}
function doGet(){return HtmlService.createHtmlOutputFromFile('FormularioPAIVD').setTitle('PAIVD · Ensayo institucional');}
