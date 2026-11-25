/** Ejecutar solo en proyecto privado de ensayo. Crea dos libros NUEVOS con datos ficticios. */
function PAIVD_CrearDatosFicticios(){
  const ss=SpreadsheetApp.create('PAIVD_ENSAYO_FICTICIO');
  const aux=SpreadsheetApp.create('PAIVD_CREDENCIALES_FICTICIAS');
  const i1=Utilities.getUuid(),i2=Utilities.getUuid(),m1=Utilities.getUuid(),m2=Utilities.getUuid();
  const put=(book,name,rows)=>{const h=book.insertSheet(name);h.getRange(1,1,rows.length,rows[0].length).setNumberFormat('@').setValues(rows);};
  put(ss,'Estudiantes',[['ID_Interno','ID_Estudiante','Apellidos_Nombres'],[i1,'DEMO-001','Ensayo Pérez, Ana'],[i2,'DEMO-002','Ensayo Pérez, Ana']]);
  put(ss,'Matriculas',[['ID_Matricula','ID_Interno','ID_Estudiante','Ano_Escolar','Curso','Seccion','Estado'],[m1,i1,'DEMO-001','2026-2027','Tercero','A','Inscrito'],[m2,i2,'DEMO-002','2026-2027','Tercero','A','Inscrito']]);
  put(ss,'Vista_AulaQR',[['ID_Interno','Ano_Escolar','Curso','Seccion','Nombre_Mostrar','ID_Matricula'],[i1,'2026-2027','Tercero','A','Ensayo Pérez, Ana',m1],[i2,'2026-2027','Tercero','A','Ensayo Pérez, Ana',m2]]);
  put(ss,'Actualizaciones',[['ID_Solicitud','ID_Interno','ID_Estudiante','ID_Matricula','Fecha_Solicitud','Estado','Datos_Propuestos_JSON','Version_Esquema','Fecha_Revision','Responsable_Revision','Observaciones_Revision']]);
  put(ss,'Verificacion_Identidad',[['ID_Verificacion','ID_Interno','ID_Estudiante','ID_Matricula','Metodo','Resultado','Fecha_Verificacion','Responsable']]);
  put(aux,'Credenciales',[['ID_Matricula','Hash_Codigo','Expira_MS','Estado','Responsable','Fecha_Emision']]);
  console.log('Libro ficticio: '+ss.getUrl());
  console.log('Almacén auxiliar ficticio: '+aux.getUrl());
  console.log('Matrícula ficticia 1: '+m1+'; matrícula ficticia 2: '+m2);
  console.log('No se modificó ningún libro existente. No compartir estas URLs.');
}

/** Amplía exclusivamente el libro ficticio existente. No cambia filas ni credenciales previas. */
function PAIVD_AmpliarDatosFicticios(){
  const ss=paivdLibro_();
  if(ss.getName()!=='PAIVD_ENSAYO_FICTICIO')throw Error('Destino no ficticio');
  const l=LockService.getScriptLock();l.waitLock(15000);
  try{
    const defs={
      Estudiantes:['ID_Interno','ID_Estudiante','Apellidos_Nombres'],
      Matriculas:['ID_Matricula','ID_Interno','ID_Estudiante','Ano_Escolar','Curso','Seccion','Estado'],
      Vista_AulaQR:['ID_Interno','Ano_Escolar','Curso','Seccion','Nombre_Mostrar','ID_Matricula']
    };
    const h={},rows={};
    Object.entries(defs).forEach(([n,cols])=>{
      const t=ss.getSheetByName(n);
      if(!t||t.getLastColumn()!==cols.length||t.getRange(1,1,1,cols.length).getDisplayValues()[0].some((v,i)=>v!==cols[i]))throw Error('Esquema ficticio incompatible: '+n);
      h[n]=t;rows[n]=t.getLastRow()>1?t.getRange(2,1,t.getLastRow()-1,cols.length).getDisplayValues():[];
    });
    if(rows.Estudiantes.some(r=>!/^DEMO-[0-9]{3}$/.test(r[1])))throw Error('Existen registros no reconocidos como ficticios');
    epjaPublicoRegistroValidado_();
    const casos=[
      ['DEMO-003','Ensayo Rodríguez, Daria María','Primero','A'],
      ['DEMO-004','Ensayo Martínez, Luis Manuel','Primero','B'],
      ['DEMO-005','Ensayo López, Dariana Isabel','Segundo','A'],
      ['DEMO-006','Ensayo García, Luis Alberto','Segundo','B'],
      ['DEMO-007','Ensayo Gómez, Daria Elena','Tercero','B'],
      ['DEMO-008','Ensayo Díaz, Luis Antonio','Cuarto','A'],
      ['DEMO-009','Ensayo Santos, María Isabel','Cuarto','B'],
      ['DEMO-010','Ensayo Núñez, Luis Rafael','Quinto','A'],
      ['DEMO-011','Ensayo Rodríguez, Daria María','Quinto','B']
    ];
    const nuevos={Estudiantes:[],Matriculas:[],Vista_AulaQR:[]};
    casos.forEach(([id,n,c,s])=>{
      const e=rows.Estudiantes.find(r=>r[1]===id);
      if(e){
        const m=rows.Matriculas.filter(r=>r[2]===id);
        if(e[2]!==n||m.length!==1||m[0][4]!==c||m[0][5]!==s||m[0][3]!=='2026-2027')throw Error('Caso ficticio existente incompatible: '+id);
        return;
      }
      const i=Utilities.getUuid(),mat=Utilities.getUuid();
      nuevos.Estudiantes.push([i,id,n]);
      nuevos.Matriculas.push([mat,i,id,'2026-2027',c,s,'Inscrito']);
      nuevos.Vista_AulaQR.push([i,'2026-2027',c,s,n,mat]);
    });
    Object.keys(nuevos).forEach(n=>{
      const vals=nuevos[n];if(!vals.length)return;
      const start=h[n].getLastRow()+1,needed=start+vals.length-1-h[n].getMaxRows();
      if(needed>0)h[n].insertRowsAfter(h[n].getMaxRows(),needed);
      h[n].getRange(start,1,vals.length,defs[n].length).setNumberFormat('@').setValues(vals);
    });
    SpreadsheetApp.flush();
    const result=epjaPublicoRegistroValidado_(),conteos={};
    result.filas.forEach(r=>conteos[r.Curso]=(conteos[r.Curso]||0)+1);
    console.log(JSON.stringify({nuevos:nuevos.Estudiantes.length,total:result.estudiantes,matriculas:result.matriculas,porCurso:conteos},null,2));
  }finally{l.releaseLock();}
}
