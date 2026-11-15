# PFMTTD · Recepción central de acuerdos en Google Apps Script

**Versión** 1.0 · **Fecha** 2026-11-15 · **Estado** requiere configuración, autorización y pruebas reales.

## Diseño
Se mantiene el QR de AulaQR apuntando a `https://ezequiel-cdo.github.io/aula-qr/pfmtd/acuerdos.html`.
Esa página actúa como puerta de entrada y dirige al formulario alojado por Apps Script, donde `google.script.run` evita las restricciones de CORS entre GitHub Pages y Google. El almacenamiento está en una hoja **privada**, no en el navegador. La aplicación confirma cada respuesta con un ID producido después de escribirla.

## Instalación en la cuenta de Google acordada
1. Inicia sesión con `ecuello.minerd@gmail.com`.
2. Crea una **hoja de cálculo privada** titulada `PFMTTD - Acuerdos de convivencia`. No la publiques ni concedas acceso general.
3. Desde la hoja elige **Extensiones → Apps Script**.
4. Sustituye el contenido de `Código.gs` por el archivo `Code.gs` de este directorio.
5. Crea un archivo **HTML** de Apps Script llamado `Formulario` y pega el contenido de `Formulario.html`.
6. En el editor selecciona la función `configurar`, pulsa **Ejecutar** y acepta las autorizaciones para escribir en esta hoja. Debe crear la pestaña `Acuerdos_PFMTTD` y sus ocho columnas.
7. Elige **Implementar → Nueva implementación → Aplicación web**; ejecutar como **Yo** (`ecuello.minerd@gmail.com`), acceso **Cualquier persona** si participan desde teléfonos sin iniciar sesión. Copia la URL `https://script.google.com/macros/s/.../exec`.
8. En GitHub, edita `pfmtd/acuerdos.html` y sustituye SOLO el valor de `APPS_SCRIPT_URL` por la URL completa /exec. Guarda en una rama y publica con PR.
9. Desde el teléfono: escanea QR → página de AulaQR → botón **Abrir formulario** → envía propuesta de prueba. Exige el comprobante y confirma una fila correspondiente en la hoja con estado `RECIBIDO`.

## Seguridad y límites
- **La hoja debe permanecer privada.** Para permitir envío anónimo, el formulario público de Apps Script es accesible por cualquiera con la URL. No es un mecanismo de autenticación ni antispam robusto.
- No incluyas credenciales, claves ni el ID de la hoja en el código HTML publicado.
- El formulario solo admite propuesta e identificador opcional; no recopila correo ni nombre obligatorio.
- Comprobar recibo requiere tanto el comprobante visible como la fila en Sheets.
- La tabla de propuestas no se publica automáticamente. La consolidación debe hacerla el facilitador en sesión, o en una fase posterior construir un panel autenticado.
- La publicación en GitHub Pages no sustituye la configuración de Apps Script.
- Tras modificar Apps Script, publica una **nueva versión** de la implementación para que los cambios se reflejen.
- Pruebas pendientes: Android, iPhone, escaneo físico, permisos de Google, conexión desde red móvil, envío duplicado y concurrencia.


## Mejoras del encuadre v0.6: panel visible y ruleta
Se agregó `Panel.html` para proyectar en el mismo recurso «Nuestros acuerdos» las propuestas que el facilitador haya seleccionado para presentación. La hoja sigue privada y **no** se divulgan seudónimos, identificadores ni comprobantes.

### Actualizar Apps Script sin interrumpir la recepción
1. Abrir el proyecto Google Apps Script asociado a la hoja de la cuenta autorizada.
2. Sustituir `Código.gs` con la versión 1.1 de este repositorio. No borrar la hoja de respuestas.
3. Añadir archivo HTML llamado `Panel` y pegar íntegro `Panel.html`.
4. Guardar; elegir **Implementar → Gestionar implementaciones → Editar** y seleccionar **Nueva versión** de la implementación existente. Verificar que la URL pública /exec se conserve.
5. Ejecutar `configurar` si la columna I todavía no tiene encabezado `Proyectar`; esto agrega la columna sin borrar los acuerdos previos.
6. En la columna I de la hoja, marcar **SI** únicamente en las filas cuyo texto se considere apropiado para proyección pública. Las demás permanecen ocultas.
7. Abrir `https://script.google.com/macros/s/.../exec?vista=panel`, confirmar que solo aparecen los textos aprobados y comprobar la actualización. La vista puede abrirse en el modal de AulaQR; si el navegador bloquea el iframe, usar su enlace «Abrir consolidación en pantalla completa».
8. Probar con dos teléfonos, enviando aportes distintos, comprobando filas y marcando solo uno «SI». Verificar que el no aprobado no aparece.

### Limitaciones relevantes
- **No existe publicación automática de todas las propuestas**: se requiere revisión en la hoja antes de marcarlas `SI`; esto evita proyectar contenido enviado por cualquiera con el QR.
- La vista pública es accesible a cualquiera que conozca su URL, pero solo devuelve los textos aprobados.
- La aceptación final del conjunto de acuerdos se realiza presencialmente, no mediante el listado.
- La conexión nueva no estará activa mientras no se actualice la implementación de Apps Script.
- Probar iframe y QR en Android y iPhone antes de la simulación.
- La asignación de comunidades sigue local en el navegador de conducción para mantener el sorteo durante la sesión; la recepción central se aplica a **acuerdos**, no a toda interacción.
