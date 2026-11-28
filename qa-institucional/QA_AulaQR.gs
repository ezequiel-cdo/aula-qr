/** QA permanente. Instalar SOLO en Apps Script privado. No ejecutar en app publica. */
const QA_AULAQR = Object.freeze(['Primero','Segundo','Tercero','Cuarto','Quinto'].map((curso,i)=>Object.freeze({curso,nombre:'Prueba '+['1ero','2do','3ero','4to','5to'][i],id:'TEST-AULAQR-00'+(i+1)})));
function qaAulaQRPlan_(){
 const id=PropertiesService.getScriptProperties().getProperty('PAIVD_TARGET_ID');
 if(!id)throw Error('Configurar PAIVD_TARGET_ID en proyecto privado');
 const ss=SpreadsheetApp.openById(id);
 if(ss.getName()!=='Registro_Maestro_Institucional_EPJA_V1')throw Error('Libro no reconocido');
 const defs={Estudiantes:['ID_Interno','ID_Estudiante','Apellidos_Nombres','Origen_Fuente'],Matriculas:['ID_Matricula','ID_Interno','ID_Estudiante','Ano_Escolar','Curso','Seccion','Estado','Condicion','Origen_Fuente'],Vista_AulaQR:['ID_Interno','Ano_Escolar','Curso','Seccion','Nombre_Mostrar','ID_Matricula'],Datos_Reservados:['ID_Interno','ID_Estudiante'],Historial_Original:['ID_Interno','ID_Estudiante']};
 const tables={};
 for(const [n,keys] of Object.entries(defs)){
 const h=ss.getSheetByName(n);if(!h)throw Error('Falta '+n);
 const all=h.getDataRange().getDisplayValues(),head=all.shift();
 if(new Set(head).size!==head.length||!keys.every(k=>head.includes(k)))throw Error('Esquema incompatible '+n);
 tables[n]={h,head,rows:all.map(r=>Object.fromEntries(head.map((k,i)=>[k,r[i]])))};
 }
 const e=tables.Estudiantes.rows,m=tables.Matriculas.rows,v=tables.Vista_AulaQR.rows;
 const plan=QA_AULAQR.map(q=>{
 const existing=e.filter(r=>r.ID_Estudiante===q.id);
 if(existing.length>1||e.some(r=>r.Apellidos_Nombres===q.nombre&&r.ID_Estudiante!==q.id))throw Error('Colision de identidad QA '+q.curso);
 const group=m.filter(r=>r.Ano_Escolar==='2026-2027'&&r.Curso===q.curso&&r.Seccion==='A'&&r.Estado.toLowerCase()==='inscrito'&&!r.ID_Estudiante.startsWith('TEST-AULAQR-'));
 if(!group.length)throw Error('No existe grupo real A '+q.curso);
 if(existing.length){const a=existing[0],ms=m.filter(r=>r.ID_Interno===a.ID_Interno&&r.Ano_Escolar==='2026-2027');
 if(a.Apellidos_Nombres!==q.nombre||a.Origen_Fuente!=='TEST'||ms.length!==1||ms[0].ID_Estudiante!==q.id||ms[0].Curso!==q.curso||ms[0].Seccion!=='A'||ms[0].Condicion!=='TEST'||ms[0].Estado!=='Inscrito'||v.filter(r=>r.ID_Matricula===ms[0].ID_Matricula&&r.ID_Interno===a.ID_Interno&&r.Nombre_Mostrar===q.nombre&&r.Curso===q.curso&&r.Seccion==='A'&&r.Ano_Escolar==='2026-2027').length!==1||['Datos_Reservados','Historial_Original'].some(n=>tables[n].rows.filter(r=>r.ID_Interno===a.ID_Interno&&r.ID_Estudiante===q.id).length!==1))throw Error('Registro QA parcial o incompatible: '+q.curso);
 return {...q,accion:'EXISTE'};}
 if(m.some(r=>r.ID_Estudiante===q.id)||v.some(r=>r.Nombre_Mostrar===q.nombre))throw Error('Registro QA huerfano');
 return {...q,accion:'CREAR',contexto:group[0]};
 });
 const real=m.filter(r=>r.Estado.toLowerCase()==='inscrito'&&!r.ID_Estudiante.startsWith('TEST-AULAQR-')).length;
 const summary={libro:ss.getName(),real,plan:plan.map(({contexto,...q})=>q)};
 const hash=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,JSON.stringify([ss.getId(),summary,Object.values(tables).map(t=>[t.head,t.rows])]),Utilities.Charset.UTF_8).map(b=>('0'+(b&255).toString(16)).slice(-2)).join('');
 return {ss,tables,plan,summary,hash};
}
function QA_AulaQR_Diagnosticar(){const p=qaAulaQRPlan_();console.log(JSON.stringify({...p.summary,huella:p.hash},null,2));}
function QA_AulaQR_Aplicar(){
 const props=PropertiesService.getScriptProperties(),lock=LockService.getScriptLock();lock.waitLock(30000);
 try{const p=qaAulaQRPlan_();
 if(!p.plan.some(q=>q.accion==='CREAR')){console.log('Cinco identidades existentes; sin cambios.');return;}
 if(props.getProperty('QA_APPROVED_PLAN')!==p.hash||props.getProperty('QA_REPORTS_ISOLATED')!=='SI'||props.getProperty('QA_BACKUP_REVIEWED')!=='SI')throw Error('Requiere huella vigente, respaldo y exclusion comprobada de TEST en todos los reportes.');
 props.deleteProperty('QA_APPROVED_PLAN');props.deleteProperty('QA_REPORTS_ISOLATED');props.deleteProperty('QA_BACKUP_REVIEWED');
 const rows=Object.fromEntries(Object.keys(p.tables).map(n=>[n,[]]));
 for(const q of p.plan.filter(q=>q.accion==='CREAR')){
 const i=Utilities.getUuid(),m=Utilities.getUuid(),base={ID_Interno:i,ID_Estudiante:q.id},ctx=q.contexto;
 rows.Estudiantes.push({...base,Apellidos_Nombres:q.nombre,Nombre_Apellidos:q.nombre,Nombres:q.nombre,Origen_Fuente:'TEST'});
 rows.Matriculas.push({...base,ID_Matricula:m,Ano_Escolar:'2026-2027',Curso:q.curso,Seccion:'A',Estado:'Inscrito',Condicion:'TEST',Origen_Fuente:'TEST',Ciclo:ctx.Ciclo,Regional:ctx.Regional,Distrito:ctx.Distrito,Centro:ctx.Centro,Docente:ctx.Docente});
 rows.Vista_AulaQR.push({ID_Interno:i,ID_Matricula:m,Ano_Escolar:'2026-2027',Curso:q.curso,Seccion:'A',Nombre_Mostrar:q.nombre});
 rows.Datos_Reservados.push(base);rows.Historial_Original.push({...base,Cantidad_Registros_Declarada:'0',Cantidad_Registros_Separada:'0'});
 }
 const written=[];
 try{for(const [n,rs] of Object.entries(rows)){if(!rs.length)continue;const t=p.tables[n],start=t.h.getLastRow()+1,need=start+rs.length-1-t.h.getMaxRows();if(need>0)t.h.insertRowsAfter(t.h.getMaxRows(),need);const range=t.h.getRange(start,1,rs.length,t.head.length);const values=rs.map(r=>t.head.map(k=>String(r[k]??'')));written.push({range,values});range.setNumberFormat('@').setValues(values);}
 SpreadsheetApp.flush();const after=qaAulaQRPlan_();if(after.summary.real!==p.summary.real||after.plan.some(q=>q.accion!=='EXISTE'))throw Error('Verificacion posterior fallida');console.log(JSON.stringify(after.summary));
 }catch(err){for(const w of written.reverse()){if(JSON.stringify(w.range.getDisplayValues())===JSON.stringify(w.values))w.range.clearContent();}SpreadsheetApp.flush();throw err;}
 }finally{lock.releaseLock();}
}
