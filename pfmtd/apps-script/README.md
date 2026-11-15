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
