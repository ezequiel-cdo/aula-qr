# Buscador Público V3 · Fuente Institucional EPJA (migración controlada)

## Estado

**Código listo para probar, NO publicado automáticamente en Apps Script.** Esta carpeta es código de referencia de GitHub; los proyectos de Google Apps Script tienen su propia copia y sus propias versiones desplegadas.

La nueva fuente es el archivo nativo Google Sheets **Registro_Maestro_Institucional_EPJA_V1**, con validación conjunta de las pestañas **Estudiantes**, **Matriculas** y **Vista_AulaQR**. No se leen tablas de contactos, historia ni información reservada. Su identificador proviene del enlace facilitado por el centro y debe cotejarse visualmente antes de activar.

El viejo maestro `Registro_Maestro_EPJA_2026-2027_V2_IDS`, sus 167 registros manuales, sus UUID y sus alias **no forman parte** del nuevo buscador. No se reutilizan.

## Campos de entrada estrictamente necesarios

| Columna en Vista_AulaQR | Significado |
|---|---|
| ID_Interno | Identificador técnico, leído solo en servidor |
| Ano_Escolar | Año escolar, por ejemplo 2026-2027 |
| Curso | Primero / Segundo / Tercero / Cuarto / Quinto |
| Seccion | Sección oficial |
| Nombre_Mostrar | Nombre visible en el buscador |
| ID_Matricula | Matrícula específica, leída solo en servidor |

El servidor comprueba que `Estudiantes.ID_Estudiante` coincida con `Matriculas.ID_Estudiante` a través de `ID_Interno`, y que `Vista_AulaQR.ID_Matricula`, nombre y grupo coincidan con esas dos hojas. Solo ofrece matrículas con estado `Inscrito`. Estas uniones se vuelven a comprobar al confirmar un token de selección. El `ID_Estudiante` se mantiene en el servidor y no se devuelve al navegador.

La hoja administrativa no se publica como archivo ni se distribuye en GitHub. El cliente recibe **hasta cinco nombres** y tokens aleatorios efímeros, nunca los UUID ni los campos privados. El token solo recupera los datos necesarios para mostrar el nombre y elegir el destino; **no constituye autenticación** ni protege recursos privados.

## Validación previa realizada con el XLSX fuente

- 424 registros en Vista_AulaQR.
- 424 ID_Interno distintos y 424 ID_Matricula distintos.
- Los seis campos anteriores están presentes, sin filas incompletas.
- 12 combinaciones año/curso/sección.
- 424 correspondencias consistentes entre las tres hojas y 424 `ID_Estudiante` únicos (comprobado contra el XLSX aprobado).
- Cursos: Primero 55, Segundo 63, Tercero 79, Cuarto 104 y Quinto 123.

La prueba del archivo fuente **no prueba todavía la conectividad al Google Sheets convertido** ni los permisos de ejecución del Apps Script.

## Proceso seguro de prueba sin interrumpir V3 en producción

1. **Mantener sin modificar** el despliegue de producción `Publicación abierta` y el enlace del Aula QR.
2. En el proyecto público `EPJA_Buscador_Publico_V3`, verificar primero el ID de Google Sheets en `EPJA_PUBLICO.SHEET_ID` contra la URL del libro institucional y permisos de la cuenta ejecutora. **No sustituir los archivos de producción antes de disponer de una copia de seguridad y un entorno de prueba.**
3. Crear un proyecto **de prueba independiente** de Apps Script, con archivos `BuscadorPublicoV3.gs` y `FormularioV3.html` (nombre HTML en el editor: `FormularioV3`). Esto es un ambiente de ensayos de código, **no una hoja de cálculo adicional**. El mismo Registro Maestro Institucional es la única fuente.
4. Ejecutar manualmente en el editor la función **`epjaPublicoPruebaInstitucional`** (sin guion bajo final). Esperar **424 matrículas, 12 grupos y 424 `ID_Estudiante` únicos**. Una discrepancia en los datos bloquea la lectura e informa la hoja y la fila; no debe corregirse desde Aula QR. Autorizar acceso a Google Sheets para el propietario del proyecto si es necesario.
5. Implementar **solo el proyecto de prueba** como aplicación web: ejecutar como **Yo** y acceso **Cualquier usuario** (no «Cualquier usuario con una cuenta de Google»). Abrir la URL `/exec` de prueba en Edge, Chrome Invitado y Chrome habitual. Si falla un perfil, revisar sesiones/cookies antes de atribuirlo al código.
6. Probar los 5 cursos: año → curso → sección → búsqueda por 3 caracteres → hasta 5 sugerencias → seleccionar nombre → `Continuar como: [Nombre]` → destino de ese curso. Confirmar `← Volver a la portada institucional`.
7. Probar un nombre duplicado: cada resultado se selecciona mediante token temporal distinto; no reutilizar nombres como identificadores. Probar además token vencido: debe indicar repetir búsqueda. No debe permitir ver calificaciones ni datos privados.
8. **Solo después de validar**: actualizar los dos archivos del proyecto V3 público de producción, guardar, crear nueva versión de la implementación existente y probar la URL pública. No alterar las portadas ni el enlace de GitHub mientras la URL del despliegue sea la misma.
9. Confirmar que los 167 registros anteriores dejan de ser consultados por V3. Conservarlos únicamente en archivo administrativo externo, de acuerdo con la decisión del centro.

## Restricciones de privacidad y continuidad

- El filtrado por nombre **no es verificación de identidad**, y una aplicación pública permite enumerar nombres con búsquedas repetidas. No habilitar notas ni información privada por esta selección.
- No se leen `Contactos`, `Historial_Academico` ni `Datos_Reservados`.
- No se publica `ID_Estudiante`, `ID_Interno` ni `ID_Matricula` en el cliente. Se validan internamente.
- No se generan matrículas ni se escriben datos en el libro institucional.
- Los controles de confirmación y navegación usan **CacheService (10 minutos)**, no guardan contactos ni el ID técnico en el navegador.
- Los cinco enlaces de curso son destinos de aprendizaje, no permisos de acceso. Si en el futuro requieren autorización, deberá añadirse verificación real de identidad.

## Continuidad de identificación declarada en las aulas

- El formulario **actualizado** muestra la leyenda **«Ensayo V3 con continuidad de identificación»**. Si el encabezado sigue diciendo «Registro Maestro · Año escolar vigente», se está abriendo **una implementación antigua** y puede seguir enviando Cuarto al aula de Tercero.
- Al seleccionar un participante, Apps Script comprueba los tres identificadores en servidor y devuelve solo nombre, año, curso, sección y URL del aula.
- Al pulsar «Continuar como: ...», esos datos mínimos se transfieren en el fragmento de navegación a GitHub Pages, que los guarda en **sessionStorage** y borra el fragmento de la barra de direcciones.
- Cada portada de curso utiliza `assets/js/epja-session.js` para mostrar el nombre y el grupo declarados. Si el curso de la sesión no coincide con el del aula, oculta el contenido principal y ofrece ir al aula correspondiente.
- La comprobación en el navegador **no es autenticación** y no evita que un usuario técnicamente capacitado manipule la sesión. No usarla para autorizar calificaciones, historial, datos privados o acciones personales.
- La información declarada se conserva por pestaña del navegador y se pierde al cerrar esa pestaña. Al volver desde el enlace institucional a la identificación puede elegirse otra matrícula.
- En producción el Aula QR actual aún utiliza su implementación pública anterior; se debe probar primero el ensayo actualizado y no confundir el GitHub HTML con el código que está desplegado en Google Apps Script.

### Pruebas de aceptación de navegación

1. En `Implementar → Probar implementaciones`, abrir la URL `/dev` con permiso de edición. Debe verse el texto «Ensayo V3 con continuidad de identificación».
2. Elegir **Cuarto A** y una coincidencia real. El botón `Continuar como` debe abrir **`matematica-epja-4to/`** y mostrar «Identificado como» con curso Cuarto.
3. Desde esa pestaña visitar manualmente **`matematica-epja-3ero/`**: debe aparecer aviso de incompatibilidad y un enlace de vuelta a Cuarto, sin mostrar el contenido de Tercero.
4. Elegir **Tercero A** y repetir: debe abrir `matematica-epja-3ero/` y mostrar la franja con el nombre y sección.
5. Probar «Volver a la portada institucional» desde el formulario y la portada de Tercero.
6. Abrir directamente una portada de curso desde una pestaña nueva sin haber seleccionado ningún nombre: debe solicitar identificación y ocultar el contenido principal.
7. Tras completar `/dev`, publicar **una implementación separada de ensayo `/exec`**, comprobar Edge anónimo y Chrome Invitado antes de modificar `Publicación abierta`. `/dev` no está disponible para visitantes anónimos.
