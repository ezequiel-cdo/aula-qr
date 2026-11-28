/** Public intake only. No master enrollment writes. Install with 0.10.0 participants files. */
const P10_HEAD_=['ID_Solicitud','ID_Interno','ID_Matricula','ID_Estudiante','Fecha_Solicitud','Estado','Nombre_Mostrar','Ano_Escolar','Curso','Seccion','Datos_Propuestos_JSON','Fecha_Revision','Responsable','Observaciones'];
function p10Norm_(s){return epjaPublicoNormalizar_(s);}
function p10Nombre_(v){const s=paivdTexto_(v,100,true);if(!/^[\p{L}][\p{L}\p{M} .'-]*$/u.test(s)||p10Norm_(s).length<2)throw Error('Revisa los nombres y apellidos');return s;}
function p10Coincidencias_(ss,nombre){
 const q=p10Norm_(nombre),tokens=q.split(' ').sort().join(' ');
 const rows=epjaPublicoLeerColumnas_(ss,'Estudiantes',['Apellidos_Nombres','Nombre_Apellidos']);
 return rows.some(({datos:r})=>[r.Apellidos_Nombres,r.Nombre_Apellidos].some(v=>{const n=p10Norm_(v);return n&&(n.split(' ').sort().join(' ')===tokens||epjaPublicoPuntuacion_(q,[v])>=12);}));
}
function p10Pendientes_(h,nombre){const q=p10Norm_(nombre).split(' ').sort().join(' ');return paivdRows_(h).some(r=>!['RECHAZADA','FORMALIZADA'].includes(r[5])&&p10Norm_(r[6]).split(' ').sort().join(' ')===q);}
function p10Grupo_(ss,a,c,s){return epjaPublicoLeerColumnas_(ss,'Matriculas',['Ano_Escolar','Curso','Seccion','Estado']).some(({datos:r})=>r.Ano_Escolar===a&&r.Curso===c&&r.Seccion===s&&r.Estado.toLowerCase()==='inscrito');}
function P10_VerificarAusencia(texto){
 paivdEntorno_();const q=paivdTexto_(texto,80,true);if(p10Norm_(q).length<3)throw Error('Escribe al menos tres letras');
 return paivdLock_(()=>{paivdLimit_('P10_VERIFICACIONES',120,900000);const ss=paivdLibro_();epjaPublicoRegistroValidado_();const h=paivdTable_(ss,'Solicitudes_Inscripcion_Provisional',P10_HEAD_);
 if(p10Coincidencias_(ss,q)||p10Pendientes_(h,q))return {disponible:false};
 return {disponible:true,token:paivdStore_('p10:',{q,sol:Utilities.getUuid()},900)};
 });
}
function P10_Enviar(token,p){
 paivdEntorno_();return paivdLock_(()=>{
 const ses=paivdReadToken_('p10:',token),ss=paivdLibro_(),h=paivdTable_(ss,'Solicitudes_Inscripcion_Provisional',P10_HEAD_);
 const receipt=()=>{const r=paivdRows_(h).filter(x=>x[0]===ses.sol);if(r.length!==1||!r[0][10])throw Error('No se confirmó almacenamiento');return {ok:true,referencia:ses.sol,almacenamientoConfirmado:true};};
 if(paivdRows_(h).some(r=>r[0]===ses.sol))return receipt();
 if(!p||p.consentimiento!==true)throw Error('Confirma la declaración');
 const nombres=p10Nombre_(p.nombres),apellido=p10Nombre_(p.apellido),segundo=p.segundo?p10Nombre_(p.segundo):'',nombre=[nombres,apellido,segundo].filter(Boolean).join(' ');
 const a=paivdTexto_(p.anio,20,true),c=paivdTexto_(p.curso,20,true),s=paivdTexto_(p.seccion,20,true);
 if(!p10Grupo_(ss,a,c,s))throw Error('Grupo no disponible');
 epjaPublicoRegistroValidado_();
 if(p10Coincidencias_(ss,nombre)||p10Pendientes_(h,nombre))throw Error('Existe una posible coincidencia. El centro debe verificarla antes de continuar.');
 const fecha=paivdTexto_(p.fechaNac,10,true),d=new Date(fecha+'T00:00:00Z');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(fecha)||!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==fecha||d>=new Date()||fecha<'1900-01-01')throw Error('Fecha de nacimiento inválida');
 const data=paivdValidar_({...p,confirmacion:'CORRECTOS',correccion:''});
 if(new Set(data.contactos.map(x=>x.telefono)).size!==data.contactos.length)throw Error('Revisa teléfonos duplicados');
 paivdLimit_('P10_ENVIOS',60,900000);
 data.identificacion={tipo:'SOLICITUD_PROVISIONAL',nombres,apellido,segundo,nombre,fechaNac:fecha,anio:a,curso:c,seccion:s};data.entorno=paivdEntorno_();data.foto=paivdFotoGuardar_(ses.sol,p.foto);data.avisoVersion='PAIVD-0.10.0';
 const row=[ses.sol,'','','',new Date().toISOString(),'PENDIENTE',nombre,a,c,s,JSON.stringify(data),'','',''];
 const range=h.getRange(h.getLastRow()+1,1,1,row.length);range.setNumberFormat('@');range.setValues([row.map(x=>/^[=+@-]/.test(x)?"'"+x:x)]);SpreadsheetApp.flush();return receipt();
 });
}
