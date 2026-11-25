# Diccionario de datos
Fuente documentada: Registro_Maestro_Institucional_EPJA_V1. Encabezados comprobados en código V3, no en la hoja viva:
| Hoja | Columnas requeridas por V3 |
|---|---|
| Estudiantes | ID_Interno, ID_Estudiante, Apellidos_Nombres |
| Matriculas | ID_Matricula, ID_Interno, ID_Estudiante, Ano_Escolar, Curso, Seccion, Estado |
| Vista_AulaQR | ID_Interno, Ano_Escolar, Curso, Seccion, Nombre_Mostrar, ID_Matricula |
El servidor comprueba correspondencias entre los tres IDs y ofrece matrículas Inscrito. ID_Estudiante identifica persona institucional; ID_Interno identifica técnicamente; ID_Matricula identifica matrícula. Contactos, Historial_Academico y Datos_Reservados se mencionan en documentación; encabezados, cardinalidad y permisos pendientes de inspección. No asumir columnas ni crear duplicados. Campos candidatos para Contactos: teléfonos principal y alternativo, WhatsApp declarado y comprobado (separados), titularidad, correo, municipio, sector, contacto de emergencia, horario y canal preferido. Definir ubicación de fotografía, consentimientos, solicitudes y auditoría tras inspección. No usar nombres como claves. Nunca incorporar filas reales a GitHub.
