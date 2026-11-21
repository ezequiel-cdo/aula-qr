# Recuperación V3 — identificación de participantes Aula QR

## Resultado
La pantalla pública de GitHub Pages solo es la entrada. El formulario que consulta los nombres reales se sirve desde una nueva aplicación web de Google Apps Script independiente, con código de lectura basado en V3.

El flujo es Año escolar → Curso → Sección → Autocompletado de nombre (hasta 5 coincidencias). No hay códigos de activación, solicitudes de nueva matrícula, teléfonos ni escritura en el Registro Maestro. La selección NO equivale a identidad verificada.

## Activación, sin modificar el proyecto administrativo

1. Abre script.google.com con la cuenta propietaria del Registro Maestro. Crea un **proyecto nuevo independiente**, llamado `EPJA_Buscador_Publico_V3`. No lo vincules al maestro y no pegues el código en el proyecto V1–V4.
2. En su archivo `Código.gs` pega TODO el contenido de `apps-script-v3-publico/BuscadorPublicoV3.gs`.
3. Crea un archivo HTML llamado exactamente `FormularioV3` y pega el contenido de `apps-script-v3-publico/FormularioV3.html`. Guarda.
4. El proyecto deberá autorizar la lectura del Registro Maestro. Despliega este **proyecto nuevo**: Implementar → Nueva implementación → Aplicación web → Ejecutar como **Yo** → Quién tiene acceso **Cualquier persona**. Esta elección expone nombres consultables a cualquiera con la URL, riesgo aceptado para el piloto; no compartir datos sensibles.
5. Copia la URL /exec de la implementación nueva y colócala en `registro-buscador-config.js` como `window.EPJA_BUSCADOR_V3_URL = "https://script.google.com/macros/s/.../exec";`.
6. Abre la página `registro.html` desde el Aula QR en una sesión sin cuenta Google. Pulsa `Iniciar identificación`. Verifica curso/sección; escribe 3 letras de un nombre de prueba autorizado, selecciona la coincidencia y confirma que no se muestran teléfonos ni estados de identidad.

## Controles y alcance
- No publica un archivo de la nómina en GitHub.
- El endpoint devuelve nombres reales de hasta cinco coincidencias en el contexto solicitado, sin otra verificación del solicitante.
- Este endpoint público **puede utilizarse para enumerar nombres** mediante consultas repetidas: la aceptación del riesgo no cambia este hecho. No usarlo para notas ni información personal.
- No conceder acceso a notas ni cuentas por seleccionar un nombre. La comprobación telefónica queda para una etapa futura.
- El proyecto administrativo V1–V4 y la hoja `Codigos_Activacion_EPJA` no se tocan. Los archivos de solicitudes antiguos permanecen en GitHub por historial, sin enlazarse desde el flujo principal.
