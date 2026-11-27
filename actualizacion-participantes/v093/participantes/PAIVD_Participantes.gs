/**
 * PAIVD v0.9.3 - recepción de solicitudes. Ensayo ficticio o piloto institucional restringido.
 * Proyecto PARTICIPANTES: instalar este archivo y PAIVD_Registro.gs.
 * No instalar funciones administrativas en este proyecto.
 * Propiedades privadas: PAIVD_TARGET_ID, PAIVD_ENSAYO=SI,
 * PAIVD_SECRETO (64 hex aleatorios). Sin credenciales para declaraciones.
 */
const PAIVD_V_='0.9.3';
function paivdProp_(key){const v=PropertiesService.getScriptProperties().getProperty(key);if(!v)throw Error('Configuración incompleta');return v;}
function paivdEntorno_(){
  const modo=PropertiesService.getScriptProperties().getProperty('PAIVD_MODO')||'FICTICIO';
  if(modo==='FICTICIO'){
    if(paivdProp_('PAIVD_ENSAYO')!=='SI')throw Error('Configuración de ensayo inválida');
  }else if(modo==='INSTITUCIONAL_RESTRINGIDO'){
    if(paivdProp_('PAIVD_REAL_AUTORIZADO')!=='SI')throw Error('Piloto institucional no autorizado');
    const email=Session.getActiveUser().getEmail().toLowerCase(),effective=Session.getEffectiveUser().getEmail().toLowerCase();
    if(!email||email!==effective||email!==paivdProp_('PAIVD_ADMIN_EMAIL').trim().toLowerCase())throw Error('Acceso restringido al responsable institucional');
  }else if(modo==='PRODUCCION_CONTROLADA'){
    if(paivdProp_('PAIVD_REAL_AUTORIZADO')!=='SI'||paivdProp_('PAIVD_PUBLICO_AUTORIZADO')!=='SI'||Session.getEffectiveUser().getEmail().toLowerCase()!==paivdProp_('PAIVD_ADMIN_EMAIL').trim().toLowerCase())throw Error('Producción no autorizada');
  }else throw Error('Entorno no válido');
  return modo;
}
function paivdLibro_(){
  const modo=paivdEntorno_(),ss=SpreadsheetApp.openById(paivdProp_('PAIVD_TARGET_ID').trim());
  if(modo==='FICTICIO'&&ss.getName()!=='PAIVD_ENSAYO_FICTICIO')throw Error('Solo libro ficticio');
  if(['INSTITUCIONAL_RESTRINGIDO','PRODUCCION_CONTROLADA'].includes(modo)){
    if(ss.getName()!=='Registro_Maestro_Institucional_EPJA_V1')throw Error('El destino no es el Registro Maestro institucional esperado');
    if(ss.getId()!==paivdProp_('PAIVD_REAL_ID_CONFIRMADO').trim())throw Error('El ID del maestro no coincide con la confirmación');
    paivdTable_(ss,'Actualizaciones',PAIVD_SOL_HEAD_);
    ['Contactos','Datos_Reservados','Perfil_Digital','Verificacion_Identidad','Auditoria_Cambios'].forEach(n=>{if(!ss.getSheetByName(n))throw Error('Esquema institucional incompleto. Ejecuta diagnóstico privado.');});
  }
  return ss;
}
function paivdDestino_(){return paivdEntorno_()+':'+paivdProp_('PAIVD_TARGET_ID').trim();}

function paivdSecret_(){const s=paivdProp_('PAIVD_SECRETO');if(!/^[a-f0-9]{64}$/i.test(s))throw Error('Configuración incompleta');return s;}
function paivdDigest_(s){return Utilities.computeHmacSha256Signature(paivdDestino_()+':'+s,paivdSecret_()).map(b=>('0'+(b&255).toString(16)).slice(-2)).join('');}
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
function paivdVersion(){paivdLibro_();paivdFotoCarpeta_();return {version:PAIVD_V_,modo:paivdEntorno_()};}
function paivdContextos(){
  paivdEntorno_();
  const m=new Map();
  paivdPiloto_().forEach(r=>{const k=JSON.stringify([r.Ano_Escolar,r.Curso,r.Seccion]);m.set(k,{anio:r.Ano_Escolar,curso:r.Curso,seccion:r.Seccion});});
  return [...m.values()].sort((a,b)=>b.anio.localeCompare(a.anio)||a.curso.localeCompare(b.curso,'es')||a.seccion.localeCompare(b.seccion,'es'));
}
function paivdBuscar(anio,curso,seccion,texto){
  const modo=paivdEntorno_();
  if([anio,curso,seccion,texto].some(x=>typeof x!=='string'||x.length>80))return [];
  const q=epjaPublicoNormalizar_(texto);if(q.length<3)return [];
  if(modo==='PRODUCCION_CONTROLADA'&&(q.length<5||q.split(/\s+/).filter(x=>x.length>=2).length<2))return [];
  paivdLock_(()=>paivdLimit_('PAIVD_BUSQUEDAS',300,600000));
  const lista=paivdPiloto_().filter(r=>(!anio||r.Ano_Escolar===anio)&&(!curso||r.Curso===curso)&&(!seccion||r.Seccion===seccion)).map(r=>({r,score:epjaPublicoPuntuacion_(q,[r.Nombre_Mostrar])})).filter(x=>x.score>=12&&(modo!=='PRODUCCION_CONTROLADA'||q.split(/\s+/).every(t=>epjaPublicoNormalizar_(x.r.Nombre_Mostrar).split(/\s+/).includes(t)))).sort((a,b)=>b.score-a.score||a.r.Nombre_Mostrar.localeCompare(b.r.Nombre_Mostrar,'es'));
  if(modo==='PRODUCCION_CONTROLADA'&&paivdAgrupar_(lista).length>3)return [];
  return paivdAgrupar_(lista).map(x=>({...paivdPublica_(x.r),homonimos:x.refs.length,token:paivdStore_('sel093:',{refs:x.refs},600)}));
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
  paivdEntorno_();
  if(confirmado!==true)throw Error('Confirma tu selección');
  return paivdLock_(()=>{
    const selection=paivdReadToken_('sel093:',seleccion);
    paivdLimit_('PAIVD_DECLARACIONES_GLOBAL',120,900000);
    const refs=paivdGrupoActual_(selection.refs),first=refs[0];
    // Reintento de la misma selección conserva el identificador de solicitud.
    if(selection.declaracion)return selection.declaracion;
    const session=paivdStore_('decl093:',{refs,sol:Utilities.getUuid(),exp:Date.now()+1800000},1800);
    const result={session,datos:{nombre:first.n,anio:first.a,curso:first.c,seccion:first.s},homonimos:refs.length};
    selection.declaracion=result;
    paivdCache_().put('sel093:'+paivdDigest_(seleccion),JSON.stringify(selection),600);
    return result;
  });
}
function paivdTexto_(v,max,required=false){if(typeof v!=='string')throw Error('Campo no válido');const s=v.trim();if(s.length>max||(required&&!s)||/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(s))throw Error('Revisa los campos del formulario');return s;}
function paivdEnum_(v,opts){if(!opts.includes(v))throw Error('Selecciona una opción válida');return v;}
function paivdTel_(v){
  const s=paivdTexto_(v,14,true);
  if(!/^\((809|829|849)\) [2-9]\d{2}-\d{4}$/.test(s))throw Error('Usa el formato (809) 555-0101 con un código de área dominicano válido.');
  return '+1'+s.replace(/\D/g,'');
}
function paivdTelCampo_(v,tipo){try{return paivdTel_(v)}catch(e){throw Error('Teléfono '+({PRINCIPAL:'principal',ALTERNATIVO:'alternativo',EMERGENCIA:'de emergencia'}[tipo])+': introduce 10 dígitos válidos (809, 829 o 849).')}}
function paivdContacto_(x,tipo){if(!x||typeof x!=='object'||Array.isArray(x))throw Error('Contacto no válido');const relacion=paivdEnum_(x.relacion,['PROPIO','COMPARTIDO','FAMILIAR','OTRO']);if(tipo==='EMERGENCIA'&&relacion==='PROPIO')throw Error('Indica otra persona para emergencia');return {tipo,telefono:paivdTelCampo_(x.telefono,tipo),titular:paivdTexto_(x.titular,120,relacion!=='PROPIO'),relacion,whatsapp:paivdEnum_(x.whatsapp,['SI','NO','NO_SABE'])};}
function paivdValidar_(p){
  if(!p||typeof p!=='object'||Array.isArray(p))throw Error('Solicitud no válida');
  const confirmacion=paivdEnum_(p.confirmacion,['CORRECTOS','CORREGIR']);
  const correccion=paivdTexto_(p.correccion,600,confirmacion==='CORREGIR');
  if(confirmacion==='CORRECTOS'&&correccion)throw Error('Revisa la confirmación');
  if(p.consentimiento!==true)throw Error('Confirma la declaración y el aviso de privacidad');
  const contactos=[];
  if(!p.principal)throw Error('Indica un teléfono principal propio, compartido o de otra persona.');
  contactos.push(paivdContacto_(p.principal,'PRINCIPAL'));
  if(p.alternativo)contactos.push(paivdContacto_(p.alternativo,'ALTERNATIVO'));
  if(p.emergencia)contactos.push(paivdContacto_(p.emergencia,'EMERGENCIA'));
  const pers=contactos.filter(c=>c.tipo!=='EMERGENCIA');
  if(new Set(contactos.map(c=>c.telefono)).size!==contactos.length)throw Error('Los teléfonos registrados deben ser distintos');
  return {confirmacion,correccion,contactos,municipio:paivdTexto_(p.municipio,100,true),sector:paivdTexto_(p.sector,120,true),consentimiento:true,avisoVersion:'PAIVD-0.9.3'};
}
function paivdEnviar(session,payload){
  paivdEntorno_();
  return paivdLock_(()=>{
    const s=paivdReadToken_('decl093:',session);if(Date.now()>=s.exp)throw Error('Sesión vencida. Vuelve a buscar tu nombre.');
    const h=paivdTable_(paivdLibro_(),'Actualizaciones',PAIVD_SOL_HEAD_),rows=paivdRows_(h);
    if(rows.some(r=>r[0]===s.sol))return paivdComprobante_(h,s.sol);
    const refs=paivdGrupoActual_(s.refs),first=refs[0],data=paivdValidar_(payload);
    paivdLimit_('PAIVD_ENVIOS_GLOBAL',120,900000);
    // No bloquear a la persona legítima por una declaración de terceros.
    // Toda declaración queda sin asignación oficial, incluso con candidato único.
    data.entorno=paivdEntorno_();
    const vigente=pa91FotoVigente_(refs);
    if(vigente){if(!payload.foto||payload.foto.modo!=='EXISTENTE')throw Error('Ya existe una fotografía institucional. Vuelve a seleccionar tu nombre.');data.foto={modo:'EXISTENTE',id:vigente.getId()};}
    else{if(payload.foto&&payload.foto.modo==='EXISTENTE')throw Error('La fotografía vigente cambió. Consulta al centro.');data.foto=paivdFotoGuardar_(s.sol,payload.foto);}
    data.identificacion={tipo:'DECLARADA_NO_VERIFICADA',nombre:first.n,anio:first.a,curso:first.c,seccion:first.s,candidatos:refs.map(r=>({ID_Interno:r.i,ID_Estudiante:r.e,ID_Matricula:r.m}))};
    const estado=refs.length>1?'PENDIENTE_ASIGNACION':'PENDIENTE';
    h.appendRow([s.sol,'','','',new Date().toISOString(),estado,JSON.stringify(data),PAIVD_V_,'','','']);
    SpreadsheetApp.flush();
    return paivdComprobante_(h,s.sol);
  });
}
function paivdComprobante_(h,id){
  const rows=paivdRows_(h).filter(r=>r[0]===id);
  if(rows.length!==1||rows[0][7]!==PAIVD_V_||!rows[0][6])throw Error('No se pudo confirmar una única solicitud guardada. Reintenta en la misma sesión.');
  return {ok:true,referencia:id,estado:'RECIBIDA',almacenamientoConfirmado:true};
}
function doGet(){paivdEntorno_();return HtmlService.createHtmlOutputFromFile('FormularioPAIVD').setTitle('PAIVD · Actualización institucional');}

function paivdFotoCarpeta_(){
 const f=DriveApp.getFolderById(paivdProp_('PAIVD_FOTOS_PENDIENTES_ID'));
 if(f.getName()!=='PENDIENTES_REVISION'||f.getSharingAccess()!==DriveApp.Access.PRIVATE)throw Error('Carpeta fotográfica no válida o no privada');
 return f;
}
function paivdFotoHash_(bytes){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,bytes).map(b=>('0'+(b&255).toString(16)).slice(-2)).join('');}
function paivdFotoGuardar_(id,foto){
 if(!foto||foto.modo==='ASISTIDA'){
  if(!foto||foto.modo!=='ASISTIDA'||foto.consentimiento!==false)throw Error('Selecciona fotografía o verificación presencial asistida');
  return {modo:'ASISTIDA',consentimiento:false};
 }
 if(foto.modo!=='CAPTURA'||foto.consentimiento!==true||typeof foto.jpeg!=='string'||foto.jpeg.length>420000||! /^[A-Za-z0-9+/]+={0,2}$/.test(foto.jpeg))throw Error('Fotografía o consentimiento inválido');
 const bytes=Utilities.base64Decode(foto.jpeg);
 if(bytes.length<1000||bytes.length>300000||(bytes[0]&255)!==255||(bytes[1]&255)!==216||(bytes[2]&255)!==255||(bytes[bytes.length-2]&255)!==255||(bytes[bytes.length-1]&255)!==217)throw Error('Selecciona una fotografía JPEG válida');
 const folder=paivdFotoCarpeta_(),name='SOLICITUD_'+id+'.jpg',hash=paivdFotoHash_(bytes),it=folder.getFilesByName(name);
 let file;
 if(it.hasNext()){file=it.next();if(it.hasNext()||file.getMimeType()!=='image/jpeg'||file.getSharingAccess()!==DriveApp.Access.PRIVATE||paivdFotoHash_(file.getBlob().getBytes())!==hash)throw Error('Existe evidencia diferente para esta sesión. Reinicia la solicitud.');}
 else{file=folder.createFile(Utilities.newBlob(bytes,'image/jpeg',name));}
 if(file.getSharingAccess()!==DriveApp.Access.PRIVATE)throw Error('La evidencia no está en acceso privado');
 return {modo:'CAPTURA',consentimiento:true,id:file.getId(),sha256:hash,fecha:file.getDateCreated().toISOString(),origen:'DECLARACION_CLIENTE_NO_VERIFICADA'};
}

/** No devuelve IDs ni imágenes al buscador abierto. */
function pa91FotoVigente_(refs){
 if(refs.length!==1)return null;
 const ss=paivdLibro_(),h=ss.getSheetByName('Datos_Reservados');
 if(!h)throw Error('Falta registro reservado');
 const v=h.getDataRange().getDisplayValues(),head=v.shift(),idx=k=>{const n=head.indexOf(k);if(n<0)throw Error('Esquema reservado incompatible');return n;};
 const rows=v.filter(r=>r[idx('ID_Interno')]===refs[0].i);
 if(rows.length!==1||rows[0][idx('ID_Estudiante')]!==refs[0].e)throw Error('Vínculo reservado inválido');
 const row=rows[0],id=row[idx('Foto_Drive_ID')];if(!id)return null;
 if(row[idx('Consentimiento_Foto')]!=='SI'||!row[idx('Fecha_Fotografia')]||!row[idx('Fecha_Consentimiento_Foto')])throw Error('Fotografía requiere revisión administrativa');
 const folder=DriveApp.getFolderById(paivdProp_('PAIVD_FOTOS_PARTICIPANTES_ID')),f=DriveApp.getFileById(id),parents=f.getParents();let match=false;while(parents.hasNext())if(parents.next().getId()===folder.getId())match=true;
 if(folder.getName()!=='PARTICIPANTES'||folder.getSharingAccess()!==DriveApp.Access.PRIVATE||!match||f.isTrashed()||f.getMimeType()!=='image/jpeg'||f.getSize()>300000||f.getSharingAccess()!==DriveApp.Access.PRIVATE)throw Error('Fotografía requiere revisión administrativa');
 return f;
}
function paivdFotoEstado(seleccion){
 const mode=paivdEntorno_();
 if(mode==='PRODUCCION_CONTROLADA')paivdLock_(()=>paivdLimit_('PA93_FOTO_CONSULTAS',300,600000));
 const refs=paivdGrupoActual_(paivdReadToken_('sel093:',seleccion).refs);
 const f=pa91FotoVigente_(refs);
 // La vista solo se habilita con una cuenta administrativa autenticada y supervisión explícita.
 const p=PropertiesService.getScriptProperties(),a=Session.getActiveUser().getEmail().toLowerCase();
 const preview=mode==='INSTITUCIONAL_RESTRINGIDO'&&p.getProperty('PAIVD_FOTO_VISTA_SUPERVISADA')==='SI'&&a&&a===Session.getEffectiveUser().getEmail().toLowerCase()&&a===(p.getProperty('PAIVD_ADMIN_EMAIL')||'').trim().toLowerCase();
 return {registrada:!!f,imagen:f&&preview?'data:image/jpeg;base64,'+Utilities.base64Encode(f.getBlob().getBytes()):''};
}
