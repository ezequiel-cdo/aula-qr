# Recuperación de V3 sobre el proyecto Apps Script existente

## Entregados
- `EPJA_Buscador_Real_Privado_V3.gs`: código de sustitución del V3 actual, conserva funciones administrativas y añade `epjaV3ContextosPublicos()` y `epjaV3BuscarNombresPublico()`, de solo lectura.
- `EPJA_Buscador_Real_V3.html`: HTML actualizado de búsqueda por año, curso, sección y nombre real, con cinco coincidencias y selección declarada.
- `registro.html` (Aula QR): acceso público con botón cuya URL se configura en `registro-buscador-config.js`.

## Pasos pendientes en la cuenta del propietario
1. **No alterar las 167 matrículas.** En el proyecto Apps Script **ya existente**, hacer copia de seguridad de V1, V2 y V3.
2. Sustituir **solo** el contenido de los dos archivos V3 con los archivos de este repositorio.
3. Desactivar y eliminar del proyecto **las funciones V4 administrativas**, el código de activación y `RegistroSeguro.html`, solo después de comprobar que no son dependencias del resto. No borrar la hoja `Codigos_Activacion_EPJA` sin verificar su estado y respaldarla.
4. **Antes de desplegar acceso público ejecutado como propietario**, inspeccionar y restringir cada función V1/V2 accesible por `google.script.run` y asegurarse de que no puedan ejecutar operaciones administrativas sin autorización; retirar V4 por sí solo no es suficiente. Una función global en el mismo proyecto puede invocarse aunque no aparezca como botón.
5. Tras revisión de seguridad, publicar `doGet` de V3 como una nueva versión de aplicación web; ejecutar como propietario, accesible para cualquier persona (los nombres serán consultables mediante búsqueda, riesgo aceptado para esta etapa).
6. Copiar la **URL /exec de la versión V3** a `registro-buscador-config.js` y comprobar desde teléfono/navegador sin cuenta Google los cuatro filtros y nombres reales.
7. La selección del nombre no autentica la identidad ni autoriza ver calificaciones; teléfono queda para siguiente etapa.

## Estado honesto de la implementación
El repositorio ya contiene los archivos actualizados, pero este entorno **no tiene acceso para editar ni publicar el proyecto Google Apps Script**. Sin la nueva implementación y su URL, el autocompletado real del Aula QR no está operativo.
