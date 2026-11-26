/** Herramienta de diagnóstico desde editor privado; NO incorporar al proyecto web público.
 * Instalar en proyecto privado independiente con PAIVD_TARGET_ID y PAIVD_ADMIN_EMAIL.
 * Propiedad opcional PAIVD_REFERENCIA_REVISION: referencia del comprobante.
 */
function PAIVD_VerificarAlmacenamiento(){
 const p=PropertiesService.getScriptProperties(),email=Session.getActiveUser().getEmail().toLowerCase();
 if(!email||email!==Session.getEffectiveUser().getEmail().toLowerCase()||email!==(p.getProperty('PAIVD_ADMIN_EMAIL')||'').trim().toLowerCase())throw Error('Acceso restringido');
 const ss=SpreadsheetApp.openById(p.getProperty('PAIVD_TARGET_ID')||'');
 const h=ss.getSheetByName('Actualizaciones');if(!h)throw Error('Falta Actualizaciones');
 const head=['ID_Solicitud','ID_Interno','ID_Estudiante','ID_Matricula','Fecha_Solicitud','Estado','Datos_Propuestos_JSON','Version_Esquema','Fecha_Revision','Responsable_Revision','Observaciones_Revision'];
 if(h.getLastColumn()!==head.length||h.getRange(1,1,1,head.length).getDisplayValues()[0].some((x,i)=>x!==head[i]))throw Error('Encabezados incompatibles');
 const rows=h.getLastRow()>1?h.getRange(2,1,h.getLastRow()-1,head.length).getDisplayValues().filter(r=>r.some(Boolean)):[];
 const ref=(p.getProperty('PAIVD_REFERENCIA_REVISION')||'').trim();
 const result={libro:ss.getName(),totalSolicitudes:rows.length,version07:rows.filter(r=>r[7]==='0.7').length,referenciaConsultada:!!ref};
 if(ref){
  const matches=rows.filter(r=>r[0]===ref);result.coincidencias=matches.length;
  if(matches.length===1){const r=matches[0],d=JSON.parse(r[6]);result.estado=r[5];result.version=r[7];result.idsOficialesVacios=r.slice(1,4).every(x=>!x);result.identificacion=d.identificacion?.tipo;result.candidatos=d.identificacion?.candidatos?.length||0;result.contactos=d.contactos?.length||0;result.entorno=d.entorno;result.sinCorreoNiPerfil=!('correo' in d)&&!('perfil' in d);}
 }
 console.log(JSON.stringify(result,null,2));
}
