# Diccionario de datos institucional
Fuente: Registro_Maestro_Institucional_EPJA_V1. Auditoría compacta ejecutada por el responsable institucional el 25/11/2026; se recibieron encabezados y conteos, no filas personales. Primera fila como encabezado; cobertura no equivale a unicidad ni exactitud.
| Tabla | Filas | Encabezados observados |
|---|---:|---|
| LEEME_CONTROL | 16 | Campo, Valor, Alcance / explicación |
| Estudiantes | 424 | ID_Interno, ID_Estudiante, Nombre_Apellidos, Apellidos_Nombres, Nombres, Primer_Apellido, Segundo_Apellido, Origen_Fuente, Fila_Fuente |
| Matriculas | 424 | ID_Matricula, ID_Interno, ID_Estudiante, Ano_Escolar, Ciclo, Curso, Seccion, Numero_Lista, Regional, Distrito, Centro, Docente, Estado, Condicion, Ult_Ano, Origen_Fuente, Fila_Fuente |
| Contactos | 0 | ID_Contacto, ID_Interno, ID_Estudiante, Tipo_Contacto, Telefono, Titular, Relacion, Es_Principal, Verificacion, Fecha_Verificacion, Fuente, Observaciones |
| Historial_Academico | 1102 | ID_Historial, ID_Interno, ID_Estudiante, Secuencia, Ano_Escolar, Grado_Texto_Original, Seccion, Resultado, Docente, Centro, Registro_Original, Estado_Parseo |
| Historial_Original | 424 | ID_Interno, ID_Estudiante, Cantidad_Registros_Declarada, Cantidad_Registros_Separada, Res_Historial_Original, Fila_Fuente |
| Datos_Reservados | 424 | ID_Interno, ID_Estudiante, Fecha_Nac, Declaracion_Original, Edad_Declarada_Origen |
| Vista_AulaQR | 424 | ID_Interno, Ano_Escolar, Curso, Seccion, Nombre_Mostrar, ID_Matricula |
| Incidencias_Admin | 0 | Categoria, ID_Estudiante, Fila_Fuente, Detalle, Accion_Sugerida |
| Diccionario | 23 | Tabla, Campo, Tipo, Regla / finalidad |
| Fuentes | 1 | Archivo, Tipo, Fecha_Procesamiento, Registros, Criterio, Observacion |

Segundo_Apellido: 337/424; ausencia no implica error. Historial_Academico.Docente: 1099/1102. Los restantes campos de tablas pobladas tienen cobertura total en la auditoría. V3 valida correspondencias de los tres IDs y ofrece matrículas Inscrito. ID_Estudiante identifica persona institucional, ID_Interno identifica técnicamente, ID_Matricula identifica matrícula. Contactos admite múltiples filas por persona. No publicar filas, valores privados ni fechas de nacimiento individuales. Las reglas de las 23 filas del Diccionario y los permisos reales aún no se han inspeccionado.
