/** PAIVD 0.9.1 alpha. Private administrative web app. Requires advanced Sheets service. */
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
 if(mode==='ENSAYO'){if(ss.getName()!=='PAIVD_ENSAYO_FICTICIO')throw Error('Destino de ensayo inválido');}
 else if(mode==='REAL'){if(ss.getName()!=='Registro_Maestro_Institucional_EPJA_V1'||id!==p.getProperty('PAIVD_REAL_ID_CONFIRMADO'))throw Error('Destino real inválido');}
 else throw Error('Modo administrativo no configurado');
 return {ss,a,p,mode};
}
function pa8CanWrite_(mode,p){
 return ['ENSAYO','REAL'].includes(mode)&&p.getProperty('PAIVD_ADMIN08_ESCRITURA')==='SI'&&(mode!=='REAL'||p.getProperty('PAIVD_ADMIN08_RESPALDO')==='SI');
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
function pa8Request_(ss,id,mode){
 const t=pa8Table_(ss,'Actualizaciones'),r=pa8One_(t,'ID_Solicitud',id),d=r.d;
 if(!['0.7','0.9','0.9.1'].includes(d.Version_Esquema)||!['PENDIENTE','PENDIENTE_ASIGNACION','OBSERVADA'].includes(d.Estado)||d.ID_Interno||d.ID_Estudiante||d.ID_Matricula)throw Error('Solicitud no revisable');
 const j=JSON.parse(d.Datos_Propuestos_JSON),i=j.identificacion;
 if(!i||i.tipo!=='DECLARADA_NO_VERIFICADA'||!Array.isArray(i.candidatos)||!i.candidatos.length||j.consentimiento!==true||j.entorno!==(mode==='REAL'?'INSTITUCIONAL_RESTRINGIDO':'FICTICIO'))throw Error('Declaración inválida');
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
 return {version:'0.9.1',modo:mode,escritura:pa8CanWrite_(mode,PropertiesService.getScriptProperties()),solicitudes:t.rows.filter(x=>x.d.ID_Solicitud).map(x=>{let i={};try{i=JSON.parse(x.d.Datos_Propuestos_JSON).identificacion||{};}catch(e){}return {id:x.d.ID_Solicitud,fecha:x.d.Fecha_Solicitud,estado:x.d.Estado,version:x.d.Version_Esquema,nombre:i.nombre||'',curso:i.curso||'',seccion:i.seccion||'',anio:i.anio||''};})};
}
function pa8Cell_(v){return {userEnteredValue:{stringValue:String(v)}};}
function pa8Write_(t,row,col,vals){return {updateCells:{start:{sheetId:t.h.getSheetId(),rowIndex:row,columnIndex:col},rows:[{values:vals.map(pa8Cell_)}],fields:'userEnteredValue'}};}
function pa8Append_(t,vals){return {appendCells:{sheetId:t.h.getSheetId(),rows:[{values:vals.map(pa8Cell_)}],fields:'userEnteredValue'}};}
function pa8Decidir_(input){
 const lock=LockService.getScriptLock();lock.waitLock(15000);
 try{
 const {ss,a,p,mode}=pa8Access_();
 if(!pa8CanWrite_(mode,p))throw Error('Escritura no autorizada');
 if(typeof Sheets==='undefined')throw Error('Habilitar servicio avanzado Google Sheets');
 const {t,r,j,i}=pa8Request_(ss,input.id,mode),note=pa8Text_(input.nota==null?'':input.nota,500),now=new Date().toISOString(),op=input.accion;
 if(!['APROBADA','RECHAZADA'].includes(op))throw Error('Decisión inválida');
 if(!input.huella||input.huella!==pa8Fingerprint_(r.d))throw Error('Solicitud modificada desde el cotejo. Recargue la bandeja.');
 const req=[],audit=pa8Table_(ss,'Auditoria_Cambios');let fotoPlan=null;
 if(op==='APROBADA'){
 const actual=PA8_Cotejo().filas.find(x=>x.id===input.id);
 if(!actual||!actual.apto||actual.candidato!==input.candidato||actual.huella!==input.huella||actual.huellaCotejo!==input.huellaCotejo)throw Error('Cotejo cambió o requiere corrección en Sheets');
 if(input.identidad!==true||input.contactos!==true||input.metodo!=='PRESENCIAL')throw Error('Requiere verificación presencial de identidad y contactos');
 if(j.confirmacion!=='CORRECTOS'||j.correccion)throw Error('Corrección académica requiere revisión separada');
 const {m,e}=pa8Candidate_(ss,i,input.candidato),ii=m.ID_Interno,ie=m.ID_Estudiante;
 const ct=pa8Table_(ss,'Contactos'),dr=pa8Table_(ss,'Datos_Reservados'),rr=pa8One_(dr,'ID_Interno',ii);
 if(rr.d.ID_Estudiante!==ie)throw Error('Vínculo reservado inválido');
 const prev=pa91Contactos_(ct,ii,ie,t);
 const municipal=pa8Text_(j.municipio,100),sector=pa8Text_(j.sector,120);
 if(!municipal||!sector)throw Error('Residencia incompleta');
 if(!Array.isArray(j.contactos)||!j.contactos.length||j.contactos.length>3||j.contactos.filter(x=>x.tipo==='PRINCIPAL').length!==1||new Set(j.contactos.map(x=>x.tipo)).size!==j.contactos.length)throw Error('Contactos inválidos');
 const seen=new Set();
 j.contactos.forEach(c=>{
 if(!['PRINCIPAL','ALTERNATIVO','EMERGENCIA'].includes(c.tipo)||!/^\+1(?:809|829|849)[2-9]\d{6}$/.test(c.telefono)||!['PROPIO','COMPARTIDO','FAMILIAR','OTRO'].includes(c.relacion)||!['SI','NO','NO_SABE'].includes(c.whatsapp)||(c.tipo==='EMERGENCIA'&&c.relacion==='PROPIO'))throw Error('Contacto inválido');
 const titular=pa8Text_(c.titular,120);if(c.relacion!=='PROPIO'&&!titular)throw Error('Titular requerido');
 if(seen.has(c.telefono))throw Error('Teléfono duplicado en solicitud');seen.add(c.telefono);
 const old=prev.find(x=>x.d.Tipo_Contacto===c.tipo&&x.d.Telefono===c.telefono&&x.d.Relacion===c.relacion&&x.d.Titular===(titular||e.Apellidos_Nombres));
 if(old){req.push(pa8Write_(ct,old.row,7,[c.tipo==='PRINCIPAL'?'SI':'NO','Validado',now,'PAIVD',input.id,c.whatsapp,old.d.Tiene_WhatsApp===c.whatsapp?old.d.WhatsApp_Verificado:'',old.d.Tiene_WhatsApp===c.whatsapp?old.d.Fecha_Verificacion_WhatsApp:'','ACTIVO',old.d.Fecha_Registro,now,'PRESENCIAL']));}
 else req.push(pa8Append_(ct,[Utilities.getUuid(),ii,ie,c.tipo,c.telefono,titular||e.Apellidos_Nombres,c.relacion,c.tipo==='PRINCIPAL'?'SI':'NO','Validado',now,'PAIVD',input.id,c.whatsapp,'','', 'ACTIVO',now,now,'PRESENCIAL']));
 if(old)old.reutilizado=true;
 req.push(pa8Append_(audit,[Utilities.getUuid(),input.id,ii,ie,now,a,'Contactos',c.tipo,old?'REVALIDAR':'CREAR','Contacto verificado; WhatsApp según verificación previa si procede']));
 });
 prev.filter(x=>!x.reutilizado&&j.contactos.some(c=>c.tipo===x.d.Tipo_Contacto)).forEach(x=>{req.push(pa8Write_(ct,x.row,7,['NO','Desactualizado']),pa8Write_(ct,x.row,15,['INACTIVO',x.d.Fecha_Registro,now]));req.push(pa8Append_(audit,[Utilities.getUuid(),input.id,ii,ie,now,a,'Contactos',x.d.Tipo_Contacto,'DESACTIVAR','Sustituido por contacto autorizado']));});
 if(['0.9','0.9.1'].includes(r.d.Version_Esquema)){const evidence=j.foto&&j.foto.modo==='EXISTENTE'?null:pa9Evidence_(j,input.id);if(j.foto&&j.foto.modo==='EXISTENTE')pa91FotoOficial_(rr.d,j.foto.id);if(evidence){if(input.foto!==true||rr.d.Foto_Drive_ID)throw Error('Cotejo fotográfico requerido o fotografía vigente');fotoPlan=pa9Plan_(evidence,e,ie);req.push(pa8Write_(dr,rr.row,8,[evidence.getId(),j.foto.fecha,'SI',j.foto.fecha]));req.push(pa8Append_(audit,[Utilities.getUuid(),input.id,ii,ie,now,a,'Datos_Reservados','Foto_Drive_ID','VINCULAR','Evidencia fotográfica cotejada']));}else if(input.foto!==true)throw Error('Confirme verificación presencial asistida');}
 req.push(pa8Write_(dr,rr.row,5,[municipal,sector]),pa8Write_(dr,rr.row,12,[now]));
 req.push(pa8Append_(audit,[Utilities.getUuid(),input.id,ii,ie,now,a,'Datos_Reservados','Municipio_Residencia|Sector_Residencia','ACTUALIZAR','Cambio autorizado; valores no duplicados en auditoría']));
 req.push(pa8Append_(pa8Table_(ss,'Verificacion_Identidad'),[Utilities.getUuid(),ii,ie,m.ID_Matricula,'PRESENCIAL','VERIFICADA',now,a]));
 req.push(pa8Write_(t,r.row,1,[ii,ie,m.ID_Matricula]));
 req.push(pa8Append_(audit,[Utilities.getUuid(),input.id,ii,ie,now,a,'Actualizaciones','Estado','APROBAR','APROBADA']));
 }
 req.push(pa8Write_(t,r.row,5,[op]),pa8Write_(t,r.row,8,[now,a,note]));
 // No unassigned audit row: installer requires valid student links. Rejection/observation trace is in Actualizaciones.
 try{if(fotoPlan){fotoPlan.file.setName(fotoPlan.name);fotoPlan.file.moveTo(fotoPlan.folder);}Sheets.Spreadsheets.batchUpdate({requests:req},ss.getId());}
 catch(e){throw Error('RESULTADO_INCIERTO: compruebe Actualizaciones y las hojas de destino antes de reintentar.');}
 return {estado:op,modo:mode};
 }finally{lock.releaseLock();}
}
function doGet(){pa8Access_();return HtmlService.createHtmlOutputFromFile('PAIVD_Revision08').setTitle('PAIVD Administración 0.9.1');}

/** Private directory: only active, verified contacts linked to approved requests. */
function PA8_Directorio(f){
 const {ss}=pa8Access_();f=f||{};
 const anio=pa8Text_(f.anio||'',20),curso=pa8Text_(f.curso||'',20),seccion=pa8Text_(f.seccion||'',20);
 const est=pa8Table_(ss,'Estudiantes',['ID_Interno','ID_Estudiante','Apellidos_Nombres']),mat=pa8Table_(ss,'Matriculas',['ID_Interno','ID_Estudiante','ID_Matricula','Ano_Escolar','Curso','Seccion','Estado']),ct=pa8Table_(ss,'Contactos'),dr=pa8Table_(ss,'Datos_Reservados'),sol=pa8Table_(ss,'Actualizaciones');
 const active=mat.rows.map(x=>x.d).filter(m=>m.Estado.toLowerCase()==='inscrito'&&['Primero','Segundo','Tercero','Cuarto','Quinto'].includes(m.Curso));
 const contextos=[...new Map(active.map(m=>[JSON.stringify([m.Ano_Escolar,m.Curso,m.Seccion]),{anio:m.Ano_Escolar,curso:m.Curso,seccion:m.Seccion}])).values()];
 const aprobadas=new Map(sol.rows.filter(x=>x.d.Estado==='APROBADA').map(x=>[x.d.ID_Solicitud,x.d]));
 const rows=active.filter(m=>(!anio||m.Ano_Escolar===anio)&&(!curso||m.Curso===curso)&&(!seccion||m.Seccion===seccion)).map(m=>{
 const e=pa8One_(est,'ID_Interno',m.ID_Interno).d;if(e.ID_Estudiante!==m.ID_Estudiante)throw Error('Vínculo académico inválido');
 const contactos=ct.rows.map(x=>x.d).filter(c=>{const a=aprobadas.get(c.Observaciones);return a&&a.ID_Interno===m.ID_Interno&&a.ID_Estudiante===m.ID_Estudiante&&c.ID_Interno===m.ID_Interno&&c.ID_Estudiante===m.ID_Estudiante&&c.Estado_Contacto==='ACTIVO'&&c.Verificacion==='Validado'&&c.Fecha_Verificacion&&c.Fuente==='PAIVD';}).map(c=>({tipo:c.Tipo_Contacto,telefono:c.Telefono,titular:c.Titular,relacion:c.Relacion,whatsapp:c.Tiene_WhatsApp,whatsappVerificado:c.WhatsApp_Verificado}));
 const r=pa8One_(dr,'ID_Interno',m.ID_Interno).d;if(r.ID_Estudiante!==m.ID_Estudiante)throw Error('Vínculo reservado inválido');
 const actualizado=[...aprobadas.values()].some(a=>a.ID_Interno===m.ID_Interno&&a.ID_Estudiante===m.ID_Estudiante);
 return {nombre:e.Apellidos_Nombres,anio:m.Ano_Escolar,curso:m.Curso,seccion:m.Seccion,contactos,municipio:actualizado?r.Municipio_Residencia:'',sector:actualizado?r.Sector_Residencia:'',actualizado};
 }).sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));
 return {contextos,filas:rows,total:rows.length,conContacto:rows.filter(r=>r.contactos.some(c=>c.tipo==='PRINCIPAL')).length,actualizados:rows.filter(r=>r.actualizado).length};
}
function PA8_Diagnostico(){const l=PA8_Listar(),d=PA8_Directorio({}),c=PA8_Cotejo(),aptas=c.filas.filter(x=>x.apto);console.log(JSON.stringify({version:l.version,modo:l.modo,escritura:l.escritura,solicitudes:l.solicitudes.length,matriculas:d.total,contextos:d.contextos.length,conContacto:d.conContacto,actualizados:d.actualizados,aptas:aptas.length,aptasConHuella:aptas.filter(x=>/^[a-f0-9]{64}$/.test(x.huellaCotejo||'')).length,excepciones:c.filas.filter(x=>!x.apto).length}));}

/** Cotejo masivo: no sustituye la verificación humana. */
function pa8Fingerprint_(d){
 return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,JSON.stringify([d.ID_Solicitud,d.ID_Interno,d.ID_Estudiante,d.ID_Matricula,d.Estado,d.Version_Esquema,d.Datos_Propuestos_JSON]),Utilities.Charset.UTF_8).map(b=>('0'+(b&255).toString(16)).slice(-2)).join('');
}
function PA8_Cotejo(){
 const {ss,mode,p}=pa8Access_(),t=pa8Table_(ss,'Actualizaciones'),ct=pa8Table_(ss,'Contactos'),mat=pa8Table_(ss,'Matriculas',['ID_Matricula','ID_Interno','ID_Estudiante','Ano_Escolar','Curso','Seccion','Estado']),est=pa8Table_(ss,'Estudiantes',['ID_Interno','ID_Estudiante','Apellidos_Nombres']),dr=pa8Table_(ss,'Datos_Reservados');
 const counts=new Map();
 t.rows.forEach(x=>{if(x.d.ID_Solicitud)counts.set(x.d.ID_Solicitud,(counts.get(x.d.ID_Solicitud)||0)+1)});
 const filas=t.rows.filter(x=>x.d.ID_Solicitud&&['PENDIENTE','PENDIENTE_ASIGNACION','OBSERVADA'].includes(x.d.Estado)).map(x=>{
 const d=x.d,base={id:d.ID_Solicitud,fecha:d.Fecha_Solicitud,estado:d.Estado,huella:pa8Fingerprint_(d),fila:x.row+1,apto:false,rechazable:false,motivo:'',nombre:'',anio:'',curso:'',seccion:'',contactos:[],municipio:'',sector:'',candidato:'',oficial:'',actualMunicipio:'',actualSector:''};
 try{
 const j=JSON.parse(d.Datos_Propuestos_JSON),i=j.identificacion||{};
 Object.assign(base,{nombre:i.nombre||'',anio:i.anio||'',curso:i.curso||'',seccion:i.seccion||'',municipio:j.municipio||'',sector:j.sector||'',contactos:Array.isArray(j.contactos)?j.contactos.map(c=>({tipo:c.tipo,telefono:c.telefono,titular:c.titular,relacion:c.relacion,whatsapp:c.whatsapp})):[]});
 if(counts.get(d.ID_Solicitud)!==1||!['0.7','0.9','0.9.1'].includes(d.Version_Esquema)||d.ID_Interno||d.ID_Estudiante||d.ID_Matricula||j.consentimiento!==true||i.tipo!=='DECLARADA_NO_VERIFICADA'||j.entorno!==(mode==='REAL'?'INSTITUCIONAL_RESTRINGIDO':'FICTICIO'))throw Error('Declaración o referencia incompatible');
 if(!Array.isArray(i.candidatos)||!i.candidatos.length)throw Error('Declaración sin candidatos');
 base.rechazable=true;
 if(i.candidatos.length!==1||d.Estado==='PENDIENTE_ASIGNACION')throw Error('Identidad ambigua: corregir en Sheets');
 if(j.confirmacion!=='CORRECTOS'||j.correccion)throw Error('Corrección académica: revisar en Sheets');
 const c=i.candidatos[0],m=pa8One_(mat,'ID_Matricula',c.ID_Matricula).d,e=pa8One_(est,'ID_Interno',c.ID_Interno).d;
 if(m.ID_Interno!==c.ID_Interno||m.ID_Estudiante!==c.ID_Estudiante||e.ID_Estudiante!==c.ID_Estudiante||m.Estado.toLowerCase()!=='inscrito'||m.Ano_Escolar!==i.anio||m.Curso!==i.curso||m.Seccion!==i.seccion)throw Error('Matrícula incoherente');
 const rr=pa8One_(dr,'ID_Interno',m.ID_Interno).d;if(rr.ID_Estudiante!==m.ID_Estudiante)throw Error('Vínculo reservado inválido');
 Object.assign(base,{candidato:m.ID_Matricula,oficial:e.ID_Estudiante,nombre:e.Apellidos_Nombres,actualMunicipio:rr.Municipio_Residencia,actualSector:rr.Sector_Residencia});
 base.fotoModo=d.Version_Esquema==='0.7'?'LEGADO':(j.foto||{}).modo;
 if(['0.9','0.9.1'].includes(d.Version_Esquema)){const evidence=j.foto&&j.foto.modo==='EXISTENTE'?pa91FotoOficial_(rr,j.foto.id):pa9Evidence_(j,d.ID_Solicitud);if(evidence){base.fotoDisponible=true;if(rr.Foto_Drive_ID&&j.foto.modo!=='EXISTENTE')throw Error('Fotografía vigente: sustitución manual requerida');}}
 const prev=pa91Contactos_(ct,m.ID_Interno,m.ID_Estudiante,t);base.contactosActuales=prev.map(x=>({tipo:x.d.Tipo_Contacto,telefono:x.d.Telefono,relacion:x.d.Relacion,titular:x.d.Titular,whatsapp:x.d.Tiene_WhatsApp}));
 if(!pa8Text_(j.municipio,100)||!pa8Text_(j.sector,120)||!Array.isArray(j.contactos)||!j.contactos.length||j.contactos.length>3||j.contactos.filter(c=>c.tipo==='PRINCIPAL').length!==1||new Set(j.contactos.map(c=>c.tipo)).size!==j.contactos.length)throw Error('Residencia o contactos incompletos');
 const seen=new Set();j.contactos.forEach(c=>{if(!['PRINCIPAL','ALTERNATIVO','EMERGENCIA'].includes(c.tipo)||!/^\+1(?:809|829|849)[2-9]\d{6}$/.test(c.telefono)||!['PROPIO','COMPARTIDO','FAMILIAR','OTRO'].includes(c.relacion)||!['SI','NO','NO_SABE'].includes(c.whatsapp)||(c.tipo==='EMERGENCIA'&&c.relacion==='PROPIO')||(!pa8Text_(c.titular,120)&&c.relacion!=='PROPIO')||seen.has(c.telefono))throw Error('Contacto inválido');seen.add(c.telefono)});
 base.huellaCotejo=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,JSON.stringify([base.huella,m.ID_Interno,m.ID_Estudiante,m.ID_Matricula,e.Apellidos_Nombres,rr.Municipio_Residencia,rr.Sector_Residencia,rr.Fecha_Actualizacion,rr.Foto_Drive_ID,prev.map(x=>x.d)]),Utilities.Charset.UTF_8).map(b=>('0'+(b&255).toString(16)).slice(-2)).join('');
 if(!/^[a-f0-9]{64}$/.test(base.huellaCotejo))throw Error('No se pudo generar la huella del cotejo');
 base.apto=true;
 }catch(e){base.apto=false;delete base.huellaCotejo;base.motivo=e.message||'Revisión manual requerida'}
 return base;
 });
 const byCandidate=new Map();filas.filter(x=>x.apto).forEach(x=>byCandidate.set(x.candidato,(byCandidate.get(x.candidato)||0)+1));
 filas.forEach(x=>{if(x.apto&&byCandidate.get(x.candidato)>1){x.apto=false;x.motivo='Varias solicitudes del mismo participante: conciliar en Sheets'}});
 return {version:'0.9.1',modo:mode,escritura:pa8CanWrite_(mode,p),hoja:ss.getUrl()+'#gid='+t.h.getSheetId(),filas};
}
function PA8_DecidirLote(input){
 const {mode,p}=pa8Access_();
 if(!pa8CanWrite_(mode,p))throw Error('Escritura no autorizada');
 if(!input||!['APROBADA','RECHAZADA'].includes(input.accion)||input.confirmado!==true||!Array.isArray(input.items)||!input.items.length||input.items.length>10)throw Error('LOTE_INVALIDO: máximo 10 solicitudes por llamada');
 const aprobar=input.accion==='APROBADA',ids=new Set(),candidates=new Set(),hex=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
 input.items.forEach(x=>{
 if(!x||typeof x.id!=='string'||!x.id)throw Error('LOTE_INVALIDO: falta la referencia de una solicitud');
 if(!hex(x.huella))throw Error('LOTE_INVALIDO: falta la huella de la solicitud; recargue el cotejo');
 if(ids.has(x.id))throw Error('LOTE_INVALIDO: solicitud duplicada');
 if(aprobar){
 if(typeof x.candidato!=='string'||!x.candidato)throw Error('LOTE_INVALIDO: candidato no identificado');
 if(!hex(x.huellaCotejo))throw Error('LOTE_INVALIDO: falta la huella del cotejo; recargue el cotejo');
 if(x.identidad!==true||x.contactos!==true)throw Error('LOTE_INVALIDO: verificación de identidad o contactos incompleta');
 if(candidates.has(x.candidato))throw Error('LOTE_INVALIDO: participante duplicado');
 }
 ids.add(x.id);if(aprobar)candidates.add(x.candidato);
 });
 const resultados=[];
 for(let k=0;k<input.items.length;k++){
 const x=input.items[k];
 try{pa8Decidir_({id:x.id,candidato:x.candidato,huella:x.huella,huellaCotejo:x.huellaCotejo,identidad:x.identidad,contactos:x.contactos,foto:x.foto,metodo:'PRESENCIAL',nota:'',accion:input.accion});resultados.push({id:x.id,estado:input.accion});}
 catch(e){const msg=e.message||String(e),incierto=msg.indexOf('RESULTADO_INCIERTO')>=0;resultados.push({id:x.id,estado:incierto?'COMPROBAR':'ERROR',motivo:msg});if(incierto){input.items.slice(k+1).forEach(y=>resultados.push({id:y.id,estado:'NO_PROCESADA',motivo:'Lote detenido por resultado incierto'}));break;}}
 }
 return {resultados};
}

function pa9Folder_(key,name){const id=PropertiesService.getScriptProperties().getProperty(key);if(!id)throw Error('Configuración fotográfica incompleta');const f=DriveApp.getFolderById(id);if(f.getName()!==name||f.getSharingAccess()!==DriveApp.Access.PRIVATE)throw Error('Carpeta fotográfica no privada o incompatible');return f;}
function pa9Hash_(bytes){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,bytes).map(b=>('0'+(b&255).toString(16)).slice(-2)).join('');}
function pa9Evidence_(j,id){
 const f=j.foto;if(!f)throw Error('Evidencia fotográfica ausente');
 if(f.modo==='ASISTIDA'&&f.consentimiento===false)return null;
 if(f.modo!=='CAPTURA'||f.consentimiento!==true||typeof f.id!=='string'||! /^[a-f0-9]{64}$/.test(f.sha256||'')||!f.fecha||Number.isNaN(Date.parse(f.fecha)))throw Error('Evidencia fotográfica inválida');
 const folder=pa9Folder_('PAIVD_FOTOS_PENDIENTES_ID','PENDIENTES_REVISION'),file=DriveApp.getFileById(f.id),parents=file.getParents();let match=false;while(parents.hasNext())if(parents.next().getId()===folder.getId())match=true;
 if(!match||file.isTrashed()||file.getName()!=='SOLICITUD_'+id+'.jpg'||file.getMimeType()!=='image/jpeg'||file.getSize()>300000||file.getSharingAccess()!==DriveApp.Access.PRIVATE||pa9Hash_(file.getBlob().getBytes())!==f.sha256)throw Error('Evidencia alterada o fuera de carpeta privada; conciliar en Drive');
 return file;
}
function pa9Plan_(file,e,ie){
 const folder=pa9Folder_('PAIVD_FOTOS_PARTICIPANTES_ID','PARTICIPANTES'),pending=pa9Folder_('PAIVD_FOTOS_PENDIENTES_ID','PENDIENTES_REVISION');
 if(folder.getId()===pending.getId())throw Error('Carpetas deben ser distintas');
 const clean=v=>String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,'_').replace(/^_+|_+$/g,'');
 if(!/^[A-Za-z0-9_-]+$/.test(ie))throw Error('ID institucional no apto para nombre de archivo');
 const name=clean(e.Apellidos_Nombres)+'_ID_'+ie+'.jpg';if(folder.getFilesByName(name).hasNext())throw Error('Fotografía definitiva existente: conciliar en Drive');
 return {file,folder,name};
}
function PA9_VerFoto(id){
 const {ss,mode}=pa8Access_(),{r,j}=pa8Request_(ss,id,mode);
 if(!['0.9','0.9.1'].includes(r.d.Version_Esquema))throw Error('Solicitud anterior sin fotografía');
 let f;if(j.foto&&j.foto.modo==='EXISTENTE'){if(j.identificacion.candidatos.length!==1)throw Error('Identidad ambigua');const {m}=pa8Candidate_(ss,j.identificacion,j.identificacion.candidatos[0].ID_Matricula);const rr=pa8One_(pa8Table_(ss,'Datos_Reservados'),'ID_Interno',m.ID_Interno).d;if(rr.ID_Estudiante!==m.ID_Estudiante)throw Error('Vínculo reservado inválido');f=pa91FotoOficial_(rr,j.foto.id);}else f=pa9Evidence_(j,id);if(!f)throw Error('Verificación presencial asistida');
 return 'data:image/jpeg;base64,'+Utilities.base64Encode(f.getBlob().getBytes());
}

function pa91FotoOficial_(rr,id){
 if(!id||rr.Foto_Drive_ID!==id||rr.Consentimiento_Foto!=='SI'||!rr.Fecha_Fotografia||!rr.Fecha_Consentimiento_Foto)throw Error('Fotografía vigente cambió');
 const folder=pa9Folder_('PAIVD_FOTOS_PARTICIPANTES_ID','PARTICIPANTES'),f=DriveApp.getFileById(id),parents=f.getParents();let match=false;while(parents.hasNext())if(parents.next().getId()===folder.getId())match=true;
 if(!match||f.isTrashed()||f.getMimeType()!=='image/jpeg'||f.getSize()>300000||f.getSharingAccess()!==DriveApp.Access.PRIVATE)throw Error('Fotografía vigente requiere revisión en Drive');return f;
}
function pa91Contactos_(ct,ii,ie,t){
 const rows=ct.rows.filter(x=>x.d.ID_Interno===ii||x.d.ID_Estudiante===ie);
 if(rows.some(x=>x.d.ID_Interno!==ii||x.d.ID_Estudiante!==ie||!['ACTIVO','INACTIVO'].includes(x.d.Estado_Contacto)))throw Error('Contactos requieren conciliación en Sheets');
 const active=rows.filter(x=>x.d.Estado_Contacto==='ACTIVO');
 if(new Set(active.map(x=>x.d.Tipo_Contacto)).size!==active.length||active.some(x=>!['PRINCIPAL','ALTERNATIVO','EMERGENCIA'].includes(x.d.Tipo_Contacto)||x.d.Verificacion!=='Validado'||x.d.Fuente!=='PAIVD'||!t.rows.some(y=>y.d.ID_Solicitud===x.d.Observaciones&&y.d.Estado==='APROBADA'&&y.d.ID_Interno===ii&&y.d.ID_Estudiante===ie)))throw Error('Contactos requieren conciliación en Sheets');
 return active;
}
