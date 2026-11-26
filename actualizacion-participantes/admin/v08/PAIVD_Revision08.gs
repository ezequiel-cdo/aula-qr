/** PAIVD 0.8 alpha. Private administrative web app. Requires advanced Sheets service. */
const PA8_HEADERS={
 Actualizaciones:'ID_Solicitud|ID_Interno|ID_Estudiante|ID_Matricula|Fecha_Solicitud|Estado|Datos_Propuestos_JSON|Version_Esquema|Fecha_Revision|Responsable_Revision|Observaciones_Revision',
 Contactos:'ID_Contacto|ID_Interno|ID_Estudiante|Tipo_Contacto|Telefono|Titular|Relacion|Es_Principal|Verificacion|Fecha_Verificacion|Fuente|Observaciones|Tiene_WhatsApp|WhatsApp_Verificado|Fecha_Verificacion_WhatsApp|Estado_Contacto|Fecha_Registro|Fecha_Actualizacion|Metodo_Verificacion',
 Datos_Reservados:'ID_Interno|ID_Estudiante|Fecha_Nac|Declaracion_Original|Edad_Declarada_Origen|Municipio_Residencia|Sector_Residencia|Correo_Electronico|Foto_Drive_ID|Fecha_Fotografia|Consentimiento_Foto|Fecha_Consentimiento_Foto|Fecha_Actualizacion',
 Verificacion_Identidad:'ID_Verificacion|ID_Interno|ID_Estudiante|ID_Matricula|Metodo|Resultado|Fecha_Verificacion|Responsable',
 Auditoria_Cambios:'ID_Evento|ID_Solicitud|ID_Interno|ID_Estudiante|Fecha_Evento|Responsable|Tabla|Campo|Accion|Resultado'
};
function pa8Access_(){
 const p=PropertiesService.getScriptProperties(),a=Session.getActiveUser().getEmail().toLowerCase();
 if(!a||a!==Session.getEffectiveUser().getEmail().toLowerCase()||a!==(p.getProperty('PAIVD_ADMIN_EMAIL')||'').trim().toLowerCase())throw Error('No autorizado');
 const id=p.getProperty('PAIVD_TARGET_ID'),mode=p.getProperty('PAIVD_ADMIN08_MODO');
 const ss=SpreadsheetApp.openById(id);
 if(mode==='ENSAYO'){if(ss.getName()!=='Registro_Maestro_Institucional_EPJA_ENSAYO_PAIVD')throw Error('Destino de ensayo inválido');}
 else if(mode==='REAL'){if(ss.getName()!=='Registro_Maestro_Institucional_EPJA_V1'||id!==p.getProperty('PAIVD_REAL_ID_CONFIRMADO'))throw Error('Destino real inválido');}
 else throw Error('Modo administrativo no configurado');
 return {ss,a,p,mode};
}
function pa8Table_(ss,n,required){
 const h=ss.getSheetByName(n);if(!h)throw Error('Falta '+n);
 const v=h.getDataRange().getDisplayValues(),head=v.shift();
 if(PA8_HEADERS[n]&&head.join('|')!==PA8_HEADERS[n])throw Error('Esquema incompatible: '+n);
 if((required||[]).some(k=>!head.includes(k)))throw Error('Columnas faltantes: '+n);
 return {h,head,rows:v.map((r,i)=>({row:i+1,d:Object.fromEntries(head.map((k,j)=>[k,r[j]]))}))};
}
function pa8One_(t,k,v){const r=t.rows.filter(x=>x.d[k]===v);if(!v||r.length!==1)throw Error('Identificación no única: '+k);return r[0];}
function pa8Text_(v,max){if(typeof v!=='string'||v.length>max||/[\x00-\x1f]/.test(v))throw Error('Texto inválido');return v.trim();}
function pa8Request_(ss,id){
 const t=pa8Table_(ss,'Actualizaciones'),r=pa8One_(t,'ID_Solicitud',id),d=r.d;
 if(d.Version_Esquema!=='0.7'||!['PENDIENTE','PENDIENTE_ASIGNACION','OBSERVADA'].includes(d.Estado)||d.ID_Interno||d.ID_Estudiante||d.ID_Matricula)throw Error('Solicitud no revisable');
 const j=JSON.parse(d.Datos_Propuestos_JSON),i=j.identificacion;
 if(!i||i.tipo!=='DECLARADA_NO_VERIFICADA'||!Array.isArray(i.candidatos)||!i.candidatos.length||j.consentimiento!==true||j.entorno!=='INSTITUCIONAL_RESTRINGIDO')throw Error('Declaración inválida');
 return {t,r,j,i};
}
function pa8Candidate_(ss,i,id){
 const c=i.candidatos.filter(x=>x.ID_Matricula===id);if(c.length!==1)throw Error('Candidato no válido');
 const m=pa8One_(pa8Table_(ss,'Matriculas',['ID_Matricula','ID_Interno','ID_Estudiante','Ano_Escolar','Curso','Seccion','Estado']),'ID_Matricula',id).d;
 const e=pa8One_(pa8Table_(ss,'Estudiantes',['ID_Interno','ID_Estudiante','Apellidos_Nombres']),'ID_Interno',m.ID_Interno).d;
 if(m.ID_Interno!==c[0].ID_Interno||m.ID_Estudiante!==c[0].ID_Estudiante||e.ID_Estudiante!==m.ID_Estudiante||m.Estado.toLowerCase()!=='inscrito'||m.Ano_Escolar!==i.anio||m.Curso!==i.curso||m.Seccion!==i.seccion)throw Error('Matrícula cambió');
 return {m,e};
}
function PA8_Listar(){
 const {ss,mode}=pa8Access_(),t=pa8Table_(ss,'Actualizaciones');
 return {modo:mode,solicitudes:t.rows.filter(x=>x.d.ID_Solicitud).map(x=>({id:x.d.ID_Solicitud,fecha:x.d.Fecha_Solicitud,estado:x.d.Estado,version:x.d.Version_Esquema}))};
}
function PA8_Detalle(id){
 const {ss}=pa8Access_(),{j,i}=pa8Request_(ss,id);
 return {propuesta:j,candidatos:i.candidatos.map(c=>{const {m,e}=pa8Candidate_(ss,i,c.ID_Matricula);const r=pa8One_(pa8Table_(ss,'Datos_Reservados'),'ID_Interno',m.ID_Interno).d;return {id:m.ID_Matricula,nombre:e.Apellidos_Nombres,oficial:e.ID_Estudiante,municipio:r.Municipio_Residencia,sector:r.Sector_Residencia,contactos:pa8Table_(ss,'Contactos').rows.filter(x=>x.d.ID_Interno===m.ID_Interno).map(x=>x.d)};})};
}
function pa8Cell_(v){return {userEnteredValue:{stringValue:String(v)}};}
function pa8Write_(t,row,col,vals){return {updateCells:{start:{sheetId:t.h.getSheetId(),rowIndex:row,columnIndex:col},rows:[{values:vals.map(pa8Cell_)}],fields:'userEnteredValue'}};}
function pa8Append_(t,vals){return {appendCells:{sheetId:t.h.getSheetId(),rows:[{values:vals.map(pa8Cell_)}],fields:'userEnteredValue'}};}
function PA8_Decidir(input){
 const lock=LockService.getScriptLock();lock.waitLock(15000);
 try{
 const {ss,a,p,mode}=pa8Access_();
 if(p.getProperty('PAIVD_ADMIN08_ESCRITURA')!=='SI')throw Error('Escritura no autorizada');
 if(typeof Sheets==='undefined')throw Error('Habilitar servicio avanzado Google Sheets');
 const {t,r,j,i}=pa8Request_(ss,input.id),note=pa8Text_(input.nota,500),now=new Date().toISOString(),op=input.accion;
 if(!note||!['APROBADA','RECHAZADA','OBSERVADA'].includes(op))throw Error('Decisión u observación inválida');
 const req=[],audit=pa8Table_(ss,'Auditoria_Cambios');
 if(op==='APROBADA'){
 if(input.identidad!==true||input.contactos!==true||input.metodo!=='PRESENCIAL')throw Error('Requiere verificación presencial de identidad y contactos');
 if(j.confirmacion!=='CORRECTOS'||j.correccion)throw Error('Corrección académica requiere revisión separada');
 const {m,e}=pa8Candidate_(ss,i,input.candidato),ii=m.ID_Interno,ie=m.ID_Estudiante;
 const ct=pa8Table_(ss,'Contactos'),dr=pa8Table_(ss,'Datos_Reservados'),rr=pa8One_(dr,'ID_Interno',ii);
 if(rr.d.ID_Estudiante!==ie)throw Error('Vínculo reservado inválido');
 if(ct.rows.some(x=>x.d.ID_Interno===ii||x.d.ID_Estudiante===ie))throw Error('Contactos existentes: conciliación manual requerida en esta versión');
 const municipal=pa8Text_(j.municipio,100),sector=pa8Text_(j.sector,120);
 if(!municipal||!sector)throw Error('Residencia incompleta');
 if(!Array.isArray(j.contactos)||!j.contactos.length||j.contactos.length>3||j.contactos.filter(x=>x.tipo==='PRINCIPAL').length!==1||new Set(j.contactos.map(x=>x.tipo)).size!==j.contactos.length)throw Error('Contactos inválidos');
 const seen=new Set();
 j.contactos.forEach(c=>{
 if(!['PRINCIPAL','ALTERNATIVO','EMERGENCIA'].includes(c.tipo)||!/^\+1(?:809|829|849)[2-9]\d{6}$/.test(c.telefono)||!['PROPIO','COMPARTIDO','FAMILIAR','OTRO'].includes(c.relacion)||!['SI','NO','NO_SABE'].includes(c.whatsapp)||(c.tipo==='EMERGENCIA'&&c.relacion==='PROPIO'))throw Error('Contacto inválido');
 const titular=pa8Text_(c.titular,120);if(c.relacion!=='PROPIO'&&!titular)throw Error('Titular requerido');
 if(seen.has(c.telefono))throw Error('Teléfono duplicado en solicitud');seen.add(c.telefono);
 req.push(pa8Append_(ct,[Utilities.getUuid(),ii,ie,c.tipo,c.telefono,titular||e.Apellidos_Nombres,c.relacion,c.tipo==='PRINCIPAL'?'SI':'NO','Validado',now,'PAIVD',input.id,c.whatsapp,'','', 'ACTIVO',now,now,'PRESENCIAL']));
 req.push(pa8Append_(audit,[Utilities.getUuid(),input.id,ii,ie,now,a,'Contactos',c.tipo,'CREAR','Contacto verificado; WhatsApp no verificado']));
 });
 req.push(pa8Write_(dr,rr.row,5,[municipal,sector]),pa8Write_(dr,rr.row,12,[now]));
 req.push(pa8Append_(audit,[Utilities.getUuid(),input.id,ii,ie,now,a,'Datos_Reservados','Municipio_Residencia|Sector_Residencia','ACTUALIZAR','Cambio autorizado; valores no duplicados en auditoría']));
 req.push(pa8Append_(pa8Table_(ss,'Verificacion_Identidad'),[Utilities.getUuid(),ii,ie,m.ID_Matricula,'PRESENCIAL','VERIFICADA',now,a]));
 req.push(pa8Write_(t,r.row,1,[ii,ie,m.ID_Matricula]));
 req.push(pa8Append_(audit,[Utilities.getUuid(),input.id,ii,ie,now,a,'Actualizaciones','Estado','APROBAR','APROBADA']));
 }
 req.push(pa8Write_(t,r.row,5,[op]),pa8Write_(t,r.row,8,[now,a,note]));
 // No unassigned audit row: installer requires valid student links. Rejection/observation trace is in Actualizaciones.
 Sheets.Spreadsheets.batchUpdate({requests:req},ss.getId());
 return {estado:op,modo:mode};
 }finally{lock.releaseLock();}
}
function doGet(){pa8Access_();return HtmlService.createHtmlOutputFromFile('PAIVD_Revision08').setTitle('PAIVD Administración 0.8');}
