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
