/** AulaQR 4to V0.1.0. Piloto privado supervisado, solo lectura.
 * Requiere A4_Diagnostico.gs existente. No instalar en PAIVD ni en el buscador V3.
 * Selección declarada; autorización de consulta pertenece al administrador autenticado.
 */
const A4_IDENT_VERSION_='0.1.0';
function doGet(){
 a4Libro_();
 return HtmlService.createHtmlOutputFromFile('A4_Piloto').setTitle('AulaQR Cuarto Año · Piloto institucional');
}
function a4Actor_(){a4Libro_();return Session.getActiveUser().getEmail().trim().toLowerCase()}
function a4Filas_(){return epjaPublicoRegistroValidado_().filas.filter(r=>r.Curso==='Cuarto')}
function A4_Contextos(){
 a4Actor_();const m=new Map();a4Filas_().forEach(r=>m.set(JSON.stringify([r.Ano_Escolar,r.Seccion]),{anio:r.Ano_Escolar,seccion:r.Seccion}));
 return {version:A4_IDENT_VERSION_,contextos:[...m.values()].sort((a,b)=>b.anio.localeCompare(a.anio)||a.seccion.localeCompare(b.seccion))};
}
function a4Token_(tipo,r,actor,ttl){
 const token=Utilities.getUuid();CacheService.getScriptCache().put('a4:'+tipo+':'+token,JSON.stringify({actor,i:r.ID_Interno,e:r.ID_Estudiante,m:r.ID_Matricula,a:r.Ano_Escolar,s:r.Seccion,exp:Date.now()+ttl*1000}),ttl);return token;
}
function a4Resolver_(tipo,token){
 const actor=a4Actor_();if(typeof token!=='string'||!/^[0-9a-f-]{36}$/i.test(token))throw Error('Sesión inválida');
 const raw=CacheService.getScriptCache().get('a4:'+tipo+':'+token);if(!raw)throw Error('Sesión vencida. Vuelve a identificarte.');
 const v=JSON.parse(raw);if(v.actor!==actor||v.exp<=Date.now())throw Error('Sesión inválida o vencida');
 const r=a4Filas_().find(x=>x.ID_Interno===v.i&&x.ID_Estudiante===v.e&&x.ID_Matricula===v.m&&x.Ano_Escolar===v.a&&x.Seccion===v.s);
 if(!r)throw Error('La matrícula cambió. Vuelve a identificarte.');return r;
}
function A4_Buscar(anio,seccion,texto){
 const actor=a4Actor_(),q=epjaPublicoNormalizar_(texto);if(q.length<3||q.length>80)return [];
 return a4Filas_().filter(r=>(!anio||r.Ano_Escolar===anio)&&(!seccion||r.Seccion===seccion)).map(r=>({r,score:epjaPublicoPuntuacion_(q,[r.Nombre_Mostrar])})).filter(x=>x.score>=12).sort((a,b)=>b.score-a.score||a.r.Nombre_Mostrar.localeCompare(b.r.Nombre_Mostrar,'es')).slice(0,5).map(x=>({nombre:x.r.Nombre_Mostrar,anio:x.r.Ano_Escolar,seccion:x.r.Seccion,token:a4Token_('sel',x.r,actor,600)}));
}
function a4Foto_(r){
 const cols=['ID_Interno','ID_Estudiante','Foto_Drive_ID','Fecha_Fotografia','Consentimiento_Foto','Fecha_Consentimiento_Foto'];
 try{
 const rows=epjaPublicoLeerColumnas_(a4Libro_(),'Datos_Reservados',cols).map(x=>x.datos).filter(x=>x.ID_Interno===r.ID_Interno||x.ID_Estudiante===r.ID_Estudiante);
 if(rows.length!==1||rows[0].ID_Interno!==r.ID_Interno||rows[0].ID_Estudiante!==r.ID_Estudiante)return {estado:'NO_DISPONIBLE',imagen:''};
 const d=rows[0];if(!d.Foto_Drive_ID)return {estado:'SIN_FOTO',imagen:''};
 if(d.Consentimiento_Foto!=='SI'||!d.Fecha_Fotografia||!d.Fecha_Consentimiento_Foto)return {estado:'NO_DISPONIBLE',imagen:''};
 const folder=DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty('A4_FOTOS_ID')),f=DriveApp.getFileById(d.Foto_Drive_ID),parents=f.getParents();let match=false;
 while(parents.hasNext())if(parents.next().getId()===folder.getId())match=true;
 if(folder.getName()!=='PARTICIPANTES'||folder.getSharingAccess()!==DriveApp.Access.PRIVATE||!match||f.isTrashed()||f.getMimeType()!=='image/jpeg'||f.getSize()>300000||f.getSharingAccess()!==DriveApp.Access.PRIVATE)return {estado:'NO_DISPONIBLE',imagen:''};
 return {estado:'VIGENTE',imagen:'data:image/jpeg;base64,'+Utilities.base64Encode(f.getBlob().getBytes())};
 }catch(e){return {estado:'NO_DISPONIBLE',imagen:''}}
}
function a4Perfil_(r){return {nombre:r.Nombre_Mostrar,idEstudiante:r.ID_Estudiante,curso:r.Curso,seccion:r.Seccion,anio:r.Ano_Escolar,tipo:'DECLARADA_SUPERVISADA'}}
function A4_Confirmar(token,confirmado){
 if(confirmado!==true)throw Error('Confirma la selección');
 const r=a4Resolver_('sel',token),actor=a4Actor_();CacheService.getScriptCache().remove('a4:sel:'+token);
 return {session:a4Token_('ses',r,actor,1800),perfil:a4Perfil_(r),foto:a4Foto_(r)};
}
function A4_Consultar(session,mostrarFoto){const r=a4Resolver_('ses',session);return {perfil:a4Perfil_(r),foto:mostrarFoto===true?a4Foto_(r):null}}
function A4_Cerrar(session){
 a4Actor_();if(typeof session==='string'&&/^[0-9a-f-]{36}$/i.test(session)){a4Resolver_('ses',session);CacheService.getScriptCache().remove('a4:ses:'+session)}return true;
}
