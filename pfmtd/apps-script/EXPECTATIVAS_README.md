# PFMTTD · Expectativas centralizadas y recuperación en cierre
**Versión:** 1.0 · **Fecha:** 2026-11-15 · **Estado:** desarrollo en PR, no desplegado en Apps Script.
**Nuevas funciones:** registro central de dos expectativas, comprobante único, lectura restringida a textos autorizados para proyección.
**Compatibilidad:** conserva el receptor y panel de acuerdos, la ruleta y el AulaQR original. Requiere actualizar implementación existente de Apps Script.

## Objetivo didáctico y trazabilidad
**RT-03:** Inicio de curso 06:00–07:00, expectativas; recuperación durante cierre de curso 28:00–29:00.
**EPRADI:** apoya el criterio relacionado con expectativas en inicio de curso y su contraste al cierre. No equivale a cumplimiento automático.
**Resultado de aprendizaje:** las expectativas expresan intereses, no evidencian por sí solas dominio de RA1.1.

## Archivos
- `pfmtd/expectativas.html`: ruta HTTPS estable para QR desde GitHub Pages, conduce al formulario del Apps Script.
- `pfmtd/apps-script/Expectativas.html`: formulario móvil con dos campos de expectativas y comprobante central.
- `pfmtd/apps-script/ExpectativasPanel.html`: recuperación en cierre; muestra únicamente expectativas marcadas SI.
- `pfmtd/apps-script/Code.gs` v1.3: crea pestaña `Expectativas_PFMTTD`, recibe y consulta expectativas. No elimina las respuestas de `Acuerdos_PFMTTD`.
- `pfmtd/index.html` v0.8: presenta QR de expectativas, manteniendo identidad visual del encuadre.

## Activación en Google Apps Script
1. Abrir el mismo proyecto ligado a la hoja privada del facilitador.
2. Sustituir `Código.gs` por v1.3 de esta rama.
3. Crear archivos HTML llamados **Expectativas** y **ExpectativasPanel** y pegar el código correspondiente.
4. Guardar y ejecutar `configurar`. Esto crea la pestaña `Expectativas_PFMTTD` con encabezados: Recepción UTC, ID comprobante, ID sesión, ID actividad, Pseudónimo (opcional), Expectativa 80h, Expectativa práctica 30min, Estado, Versión, Proyectar.
5. Seleccionar **Implementar → Gestionar implementaciones → Editar → Nueva versión** sobre el despliegue actual. Conservar la misma URL /exec.
6. Visitar `/exec?vista=expectativas`, enviar prueba y verificar fila con `RECIBIDO`, comprobante y las dos expectativas.
7. Marcar **SI** en columna J de una fila destinada al cierre. Visitar `/exec?vista=expectativas-panel` para comprobar que se ve sin seudónimo ni comprobante.
8. Comprobar desde un teléfono QR → GitHub Pages → Apps Script → recepción en Google Sheets.

## Restricciones y privacidad
La hoja queda restringida a la cuenta autorizada; el formulario web puede recibir datos de cualquiera que posea la URL. No solicita datos empresariales sensibles. Las nuevas expectativas llevan `NO` por defecto en la columna Proyectar para no divulgar aspiraciones individuales automáticamente. El facilitador cambia a `SI` solo para los textos que desea socializar.
La vista de cierre no prueba que se hayan logrado las 80 horas. Necesita contraste presencial con los aprendizajes observados.
El botón de retorno al cierre y la secuencia completa de 30 minutos serán integrados en el desarrollo posterior. Actualmente `ExpectativasPanel` puede abrirse por URL separada; no se debe fingir que está incorporado al cierre del HTML de solo dos pantallas.

## Pruebas pendientes
- Actualización efectiva de Apps Script v1.3 por parte del propietario.
- Recepción real de una nueva expectativa y coincidencia de comprobante/hoja.
- Recuperación tras marcar SI / ocultación tras cambiar NO.
- Android/iPhone, proyección, conexión y QR reales.
- Revisión visual previa a fusión con main.
