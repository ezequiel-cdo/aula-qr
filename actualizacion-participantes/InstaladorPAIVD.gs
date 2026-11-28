/**
 * PAIVD - instalador de esquema v1.0.4.
 * SOLO en proyecto privado independiente, nunca en app web pública.
 * Configurar PAIVD_TARGET_ID en Script Properties (ID del libro de ensayo).
 * No modifica datos existentes. Aplicación no transaccional; respaldo previo.
 */
const PAIVD_BASE_ = {
  LEEME_CONTROL:'Campo|Valor|Alcance / explicación',
  Estudiantes:'ID_Interno|ID_Estudiante|Nombre_Apellidos|Apellidos_Nombres|Nombres|Primer_Apellido|Segundo_Apellido|Origen_Fuente|Fila_Fuente',
  Matriculas:'ID_Matricula|ID_Interno|ID_Estudiante|Ano_Escolar|Ciclo|Curso|Seccion|Numero_Lista|Regional|Distrito|Centro|Docente|Estado|Condicion|Ult_Ano|Origen_Fuente|Fila_Fuente',
  Contactos:'ID_Contacto|ID_Interno|ID_Estudiante|Tipo_Contacto|Telefono|Titular|Relacion|Es_Principal|Verificacion|Fecha_Verificacion|Fuente|Observaciones',
  Historial_Academico:'ID_Historial|ID_Interno|ID_Estudiante|Secuencia|Ano_Escolar|Grado_Texto_Original|Seccion|Resultado|Docente|Centro|Registro_Original|Estado_Parseo',
  Historial_Original:'ID_Interno|ID_Estudiante|Cantidad_Registros_Declarada|Cantidad_Registros_Separada|Res_Historial_Original|Fila_Fuente',
  Datos_Reservados:'ID_Interno|ID_Estudiante|Fecha_Nac|Declaracion_Original|Edad_Declarada_Origen',
  Vista_AulaQR:'ID_Interno|Ano_Escolar|Curso|Seccion|Nombre_Mostrar|ID_Matricula',
  Incidencias_Admin:'Categoria|ID_Estudiante|Fila_Fuente|Detalle|Accion_Sugerida',
  Diccionario:'Tabla|Campo|Tipo|Regla / finalidad',
  Fuentes:'Archivo|Tipo|Fecha_Procesamiento|Registros|Criterio|Observacion'
};
const PAIVD_ADD_ = {
  Contactos:'Tiene_WhatsApp|WhatsApp_Verificado|Fecha_Verificacion_WhatsApp|Estado_Contacto|Fecha_Registro|Fecha_Actualizacion|Metodo_Verificacion',
  Datos_Reservados:'Municipio_Residencia|Sector_Residencia|Correo_Electronico|Foto_Drive_ID|Fecha_Fotografia|Consentimiento_Foto|Fecha_Consentimiento_Foto|Fecha_Actualizacion'
};
const PAIVD_NEW_ = {
  Actualizaciones:'ID_Solicitud|ID_Interno|ID_Estudiante|ID_Matricula|Fecha_Solicitud|Estado|Datos_Propuestos_JSON|Version_Esquema|Fecha_Revision|Responsable_Revision|Observaciones_Revision',
  Perfil_Digital:'ID_Interno|ID_Estudiante|Dispositivo|Titularidad_Dispositivo|Conectividad|Dificultades|Fecha_Actualizacion',
  Verificacion_Identidad:'ID_Verificacion|ID_Interno|ID_Estudiante|ID_Matricula|Metodo|Resultado|Fecha_Verificacion|Responsable',
  Auditoria_Cambios:'ID_Evento|ID_Solicitud|ID_Interno|ID_Estudiante|Fecha_Evento|Responsable|Tabla|Campo|Accion|Resultado'
};
function paivdLibro_(){
  const id=PropertiesService.getScriptProperties().getProperty('PAIVD_TARGET_ID');
  if(!id) throw Error('Configurar PAIVD_TARGET_ID en propiedades del proyecto privado.');
  return SpreadsheetApp.openById(id.trim());
}
function paivdHash_(value){
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,JSON.stringify(value),Utilities.Charset.UTF_8).map(b=>('0'+(b&255).toString(16)).slice(-2)).join('');
}
function paivdLeer_(ss,name){
  const h=ss.getSheetByName(name);
  if(!h) return null;
  const nr=h.getLastRow(),nc=h.getLastColumn();
  const all=nr&&nc?h.getRange(1,1,nr,nc).getDisplayValues():[];
  return {h,head:all[0]||[],rows:all.slice(1).filter(r=>r.some(v=>v.trim()!=='')),nr,nc};
}
function paivdCampos_(s){return s.split('|');}
function paivdPlan_(ss){
  const errores=[], cambios=[], tablas={}, counts={}, dictAdd=[];
  const err=s=>{if(errores.length<100)errores.push(s);};
  Object.keys(PAIVD_BASE_).concat(Object.keys(PAIVD_NEW_)).forEach(n=>{
    const t=paivdLeer_(ss,n);tablas[n]=t;
    if(!t){
      if(PAIVD_NEW_[n]) cambios.push({hoja:n,accion:'CREAR',campos:paivdCampos_(PAIVD_NEW_[n])});
      else err('Falta hoja '+n);
      return;
    }
    counts[n]=t.rows.length;
    const base=PAIVD_BASE_[n]?paivdCampos_(PAIVD_BASE_[n]):paivdCampos_(PAIVD_NEW_[n]);
    const extra=PAIVD_ADD_[n]?paivdCampos_(PAIVD_ADD_[n]):[];
    if(new Set(t.head.map(x=>x.trim().toLowerCase())).size!==t.head.length||t.head.some(x=>!x.trim()))err('Encabezado vacío o duplicado: '+n);
    if(!base.every((v,i)=>t.head[i]===v)) {err('Encabezados base distintos: '+n);return;}
    const cola=t.head.slice(base.length);
    // Solo se admite un prefijo de la ampliación prevista: no reordenar ni invadir columnas ajenas.
    if(cola.length>extra.length||!cola.every((v,i)=>extra[i]===v)){err('Columnas adicionales no previstas: '+n);return;}
    const faltan=extra.slice(cola.length);
    if(faltan.length)cambios.push({hoja:n,accion:'AMPLIAR',campos:faltan});
  });
  const filas=n=>{
    const t=tablas[n];return t?t.rows.map(r=>Object.fromEntries(t.head.map((c,i)=>[c,String(r[i]||'').trim()]))):[];
  };
  const est=new Map(), oficiales=new Set(), mat=new Map(), vistas=new Set();
  filas('Estudiantes').forEach(e=>{
    if(!e.ID_Interno||!e.ID_Estudiante||!e.Apellidos_Nombres||est.has(e.ID_Interno)||oficiales.has(e.ID_Estudiante))err('Estudiantes: clave o nombre vacío, o clave duplicada');
    est.set(e.ID_Interno,e);oficiales.add(e.ID_Estudiante);
  });
  if(!est.size)err('Estudiantes sin registros');
  const vinculo=(n,r)=>{
    const e=est.get(r.ID_Interno);
    if(!e||!r.ID_Estudiante||e.ID_Estudiante!==r.ID_Estudiante)err(n+': relación de estudiante incoherente');
  };
  filas('Matriculas').forEach(m=>{
    vinculo('Matriculas',m);
    if(!m.ID_Matricula||mat.has(m.ID_Matricula)||!m.Ano_Escolar||!m.Curso||!m.Seccion||!m.Estado)err('Matriculas: clave duplicada o campo obligatorio vacío');
    mat.set(m.ID_Matricula,m);
  });
  const norm=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  filas('Vista_AulaQR').forEach(v=>{
    const m=mat.get(v.ID_Matricula),e=est.get(v.ID_Interno);
    if(!v.ID_Matricula||vistas.has(v.ID_Matricula)||!m||!e||m.ID_Interno!==v.ID_Interno||m.Ano_Escolar!==v.Ano_Escolar||m.Curso!==v.Curso||m.Seccion!==v.Seccion||!v.Nombre_Mostrar||norm(e.Apellidos_Nombres)!==norm(v.Nombre_Mostrar))err('Vista_AulaQR: matrícula, nombre o grupo incoherente');
    vistas.add(v.ID_Matricula);
  });
  mat.forEach(m=>{if(String(m.Estado||'').toLowerCase()==='inscrito'&&['Primero','Segundo','Tercero','Cuarto','Quinto'].includes(m.Curso)&&!vistas.has(m.ID_Matricula))err('Matricula inscrita ausente de Vista_AulaQR');});
  ['Contactos','Datos_Reservados','Historial_Academico','Historial_Original','Perfil_Digital','Verificacion_Identidad','Auditoria_Cambios'].forEach(n=>filas(n).forEach(r=>vinculo(n,r)));
  // Desde PAIVD 0.4 la bandeja admite declaraciones sin asignación oficial.
  filas('Actualizaciones').forEach(r=>{
    if(r.ID_Interno||r.ID_Estudiante||r.ID_Matricula){
      vinculo('Actualizaciones',r);
      const m=mat.get(r.ID_Matricula);
      if(!m||m.ID_Interno!==r.ID_Interno||m.ID_Estudiante!==r.ID_Estudiante)err('Actualizaciones: matrícula incoherente');
      return;
    }
    try{
      const d=JSON.parse(r.Datos_Propuestos_JSON).identificacion;
      if(!['0.4','0.5','0.6','0.7'].includes(r.Version_Esquema)||!['PENDIENTE','PENDIENTE_ASIGNACION','EN_REVISION','OBSERVADA','RECHAZADA'].includes(r.Estado)||!d||d.tipo!=='DECLARADA_NO_VERIFICADA'||!Array.isArray(d.candidatos)||!d.candidatos.length)throw Error('declaración inválida');
      if(new Set(d.candidatos.map(x=>x.ID_Matricula)).size!==d.candidatos.length)throw Error('candidatos duplicados');
      d.candidatos.forEach(x=>{vinculo('Actualizaciones (candidato)',x);const m=mat.get(x.ID_Matricula);if(!m||m.ID_Interno!==x.ID_Interno||m.ID_Estudiante!==x.ID_Estudiante)err('Actualizaciones: candidato incoherente');});
    }catch(e){err('Actualizaciones: declaración no asignada inválida');}
  });
  const unica=(n,k)=>{const s=new Set();filas(n).forEach(r=>{if(!r[k]||s.has(r[k]))err(n+': clave vacía o duplicada '+k);s.add(r[k]);});return s;};
  ['Datos_Reservados','Historial_Original'].forEach(n=>{const s=unica(n,'ID_Interno');if(s.size!==est.size)err(n+': cobertura de estudiantes incompleta');});
  [['Contactos','ID_Contacto'],['Historial_Academico','ID_Historial'],['Actualizaciones','ID_Solicitud'],['Perfil_Digital','ID_Interno'],['Verificacion_Identidad','ID_Verificacion'],['Auditoria_Cambios','ID_Evento']].forEach(([n,k])=>unica(n,k));
  const dic=filas('Diccionario'), claves=new Map();
  dic.forEach(r=>{const k=String(r.Tabla||'').toLowerCase()+'|'+String(r.Campo||'').toLowerCase();if(!r.Tabla||!r.Campo||claves.has(k))err('Diccionario: clave vacía o duplicada');claves.set(k,r);});
  const tipo=c=>/^Fecha_/.test(c)?'Fecha/hora ISO':c.endsWith('_JSON')?'JSON texto':'Texto';
  const reglas={
    Tiene_WhatsApp:'Declarado: SI, NO o NO_SABE; no implica verificación.',
    WhatsApp_Verificado:'Comprobación efectiva del canal; no inferir de la declaración.',
    Fecha_Verificacion_WhatsApp:'Fecha de comprobación efectiva, si existe.',
    Estado_Contacto:'ACTIVO, INACTIVO o SUSTITUIDO.',
    Metodo_Verificacion:'Método de comprobación efectiva del contacto.',
    Foto_Drive_ID:'ID de archivo privado, nunca URL pública.',
    Consentimiento_Foto:'Consentimiento específico; no obligatorio para estudiar.',
    Datos_Propuestos_JSON:'Solicitud privada; no es dato aprobado ni credencial.',
    Estado:'Estado de revisión de solicitud; no equivale a aprobación automática.',
    ID_Solicitud:'Identificador de solicitud; en auditoría referencia al origen.',
    ID_Interno:'Referencia técnica a Estudiantes.',
    ID_Estudiante:'Referencia institucional a Estudiantes.',
    ID_Matricula:'Referencia a Matriculas.',
    Resultado:'Resultado registrado; no implica autenticación por sí solo.'
  };
  Object.entries({...PAIVD_ADD_,...PAIVD_NEW_}).forEach(([n,cols])=>paivdCampos_(cols).forEach(c=>{
    const row=[n,c,tipo(c),reglas[c]||'PAIVD: '+c.replace(/_/g,' ')+'. Campo de gestión institucional.'];
    const old=claves.get((n+'|'+c).toLowerCase());
    if(!old)dictAdd.push(row);
    else if(old.Tabla!==n||old.Campo!==c||old.Tipo!==row[2]||old['Regla / finalidad']!==row[3])err('Diccionario: definición previa distinta para '+n+'.'+c);
  }));
  const snapshot=Object.fromEntries(Object.entries(tablas).map(([n,t])=>[n,t?{head:t.head,rows:t.rows}:null]));
  const huella=paivdHash_({version:'1.0.4',id:ss.getId(),snapshot,cambios,dictAdd});
  return {errores,cambios,dictAdd,counts,huella};
}
function paivdMostrar_(p){
  console.log(JSON.stringify({version:'1.0.4',errores:p.errores,conteos:p.counts,cambios:p.cambios,filasDiccionarioNuevas:p.dictAdd.length,huella:p.huella},null,2));
}
function PAIVD_Diagnosticar(){
  paivdMostrar_(paivdPlan_(paivdLibro_()));
}
function PAIVD_RevisarDiccionario(){
  const t=paivdLeer_(paivdLibro_(),'Diccionario');
  if(!t)throw Error('Falta Diccionario');
  // Solo mostrar definiciones localmente; revisar antes de compartir.
  t.rows.forEach(r=>console.log(JSON.stringify(r)));
}
function PAIVD_Aplicar(){
  const props=PropertiesService.getScriptProperties();
  const lock=LockService.getScriptLock();
  lock.waitLock(30000);
  try{
    const ss=paivdLibro_(), p=paivdPlan_(ss);
    if(p.errores.length){paivdMostrar_(p);throw Error('Diagnóstico con errores; sin cambios.');}
    if(!p.cambios.length&&!p.dictAdd.length){console.log('Esquema ya instalado. Sin cambios.');return;}
    if(props.getProperty('PAIVD_APPROVED_PLAN')!==p.huella||props.getProperty('PAIVD_BACKUP_REVIEWED')!=='SI'){
      paivdMostrar_(p);throw Error('Se requiere respaldo revisado, reglas y permisos comprobados y huella aprobada.');
    }
    // Consumir autorización antes de escribir. Si falla, diagnosticar de nuevo.
    props.deleteProperty('PAIVD_APPROVED_PLAN');
    props.deleteProperty('PAIVD_BACKUP_REVIEWED');
    const before=Object.fromEntries(Object.keys(PAIVD_BASE_).map(n=>{const t=paivdLeer_(ss,n);return [n,{nr:t.nr,nc:t.nc,hash:paivdHash_(t.h.getRange(1,1,t.nr,t.nc).getDisplayValues())}];}));
    p.cambios.forEach(c=>{
      const h=c.accion==='CREAR'?ss.insertSheet(c.hoja):ss.getSheetByName(c.hoja);
      const start=c.accion==='CREAR'?1:h.getLastColumn()+1;
      const need=start+c.campos.length-1-h.getMaxColumns();
      if(need>0)h.insertColumnsAfter(h.getMaxColumns(),need);
      h.getRange(1,start,1,c.campos.length).setValues([c.campos]);
    });
    if(p.dictAdd.length){
      const h=ss.getSheetByName('Diccionario'), start=h.getLastRow()+1;
      const need=start+p.dictAdd.length-1-h.getMaxRows();
      if(need>0)h.insertRowsAfter(h.getMaxRows(),need);
      h.getRange(start,1,p.dictAdd.length,4).setValues(p.dictAdd);
    }
    SpreadsheetApp.flush();
    Object.entries(before).forEach(([n,b])=>{
      if(paivdHash_(ss.getSheetByName(n).getRange(1,1,b.nr,b.nc).getDisplayValues())!==b.hash)throw Error('Cambió contenido original de '+n+'; revisar respaldo y detener.');
    });
    const after=paivdPlan_(ss);paivdMostrar_(after);
    if(after.errores.length||after.cambios.length||after.dictAdd.length)throw Error('Verificación posterior no satisfactoria; revisar antes de continuar.');
    console.log('Instalación verificada: esquema completo y valores visibles originales conservados.');
  }finally{lock.releaseLock();}
}
