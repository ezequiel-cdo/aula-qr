# PFMTTD · Validación integral de Inicio de sesión (PR #9)
**Versión:** 1.0 · **Fecha:** 2026-11-15 · **Estado:** validación técnica parcial, pendiente de prueba real.
**Objeto:** Etapa 2, 07:00–11:00 de la simulación PFMTTD.
**Compatibilidad:** no modifica RT-03, EPRADI, el piloto Contraseñas seguras, ni el servicio ya desplegado de acuerdos y expectativas.
**Dependencias:** PFMTTD HTML v0.9.4, Apps Script v1.4 y Google Sheets restringida.
**Cambios:** documento nuevo de validación y propuesta de armonización; no confundir con una modificación aprobada del plan.

## 1. Fuente curricular y discrepancia
El **RT-03 revisado** señala en Inicio de sesión:
- 07:00–08:00: recuperación de acuerdos, proceso de MiPyME y beneficio de registro digital (1 min).
- 08:00–08:30: exhibición y distribución del instrumento de diagnóstico, explicación de finalidad; **no se aplica ni se califica** (30 s).
- 08:30–10:00: pregunta sobre Excel y WhatsApp, intercambio de ideas (1 min 30 s).
- 10:00–11:00: RA1.1, contenidos, estrategias, AulaQR, actividades, evaluación y tiempos (1 min).

**Decisión posterior del facilitador:** el diagnóstico sí debe ejecutarse. El HTML ha añadido formulario y recepción de cuatro respuestas. Es una **variación del plan**, no un cumplimiento de su literalidad. La planificación revisada debe actualizarse y validarse por su responsable antes de la práctica oficial. No cambiar el archivo RT-03 sin acuerdo expreso.

## 2. Opciones de armonización y recomendación
**Opción A (conserva el cronograma de simulación):** en 08:00–08:30 presentar el instrumento, abrir QR e **iniciar** diagnóstico; completar y enviar las cuatro respuestas como tarea del encuentro real fuera de la simulación, o previamente en una fase diagnóstica con tiempo suficiente. Este esquema **no permite afirmar que el diagnóstico completo se ejecutó dentro de los 30 minutos**; registrar únicamente respuestas que realmente se reciban. Requiere nueva redacción del RT-03 para aclarar cuándo se aplica.

**Opción B (diagnóstico totalmente aplicado y observado dentro de la simulación):** dedicar un bloque mayor al diagnóstico, con ensayo real de apertura y 4 ítems para 21 personas, descontando ese tiempo de otras actividades con ajuste formal del RT-03, de la duración y de la matriz EPRADI. **No asignar un tiempo exacto sin piloto cronometrado.** Si no cabe, reducir el número de ítems mediante instrumento revisado o ejecutar el diagnóstico previo a la simulación y documentarlo como tal.

**Recomendación provisional:** Opción A para conservar la secuencia hasta que el facilitador confirme la nueva temporalización. No describir la apertura como aplicación finalizada.

## 3. Matriz de prueba por recurso
| Tiempo | Recurso | Actuación verificable | Evidencia válida | No demuestra |
|---|---|---|---|---|
| 07:00–08:00 | Recordemos | recuperar proceso, ventaja digital y acuerdo; escuchar 2 voces | observación presencial/bitácora vinculada a intervenciones | abrir pantalla = participación |
| 08:00–08:30 | Diagnóstico | QR, propósito, respaldo; completar cuando exista tiempo formal | comprobante + fila recibida en Diagnostico_PFMTTD | QR abierto = formulario recibido |
| 08:30–10:00 | ¿Qué sabemos? | dos argumentos distintos; contraste y retroalimentación | observación del diálogo y síntesis de argumentos | seleccionar postura = evaluación individual |
| 10:00–11:00 | Nuestra ruta | explicar RA1.1 literal, contenidos, técnicas, evaluación y duración | observación del facilitador y preguntas del grupo | RA1.1 presentado = logrado |

**EPRADI:** esta etapa apoya las actuaciones de los criterios 15–20. Verificar texto, puntuación y grado contra matriz original al cerrar la auditoría. Nunca dar por cumplido automáticamente un criterio tras navegar.

## 4. Pruebas ejecutadas y pendientes
- [x] Los cuatro botones están presentes en la tercera pantalla de la rama.
- [x] La navegación manual de tres pantallas está implementada.
- [x] Los archivos HTML/JS y el receptor tienen sintaxis JS válida en inspección estática.
- [x] La implementación Apps Script v4 con código v1.4 fue mostrada en captura; configurar() finalizó sin error visible.
- [ ] Inspección visual real en proyector 16:9 y móvil.
- [ ] Recorrer atrás/adelante, abrir/cerrar cuatro ventanas, foco de teclado y página completa.
- [ ] Escanear QR en Android y iPhone y verificar enlace HTTPS publicado. **Actualmente el QR apunta a la URL de main; antes de fusionar la página destino no está disponible en GitHub Pages.**
- [ ] Enviar respuestas reales de prueba (seudónimo ficticio) desde teléfono; corroborar comprobante y fila RECIBIDO en hoja Diagnostico_PFMTTD.
- [ ] Verificar que acuerdos y expectativas anteriores aún reciben respuestas.
- [ ] Ensayar y registrar duración efectiva con participantes o roles simulados.
- [ ] Confirmar armonización de RT-03 con la decisión de aplicar.
- [ ] Revisar EPRADI completo con matriz oficial.

## 5. Criterios de publicación
La fusión con `main` se considerará lista **después** de confirmar recepción y tiempos/plan. Integrar código en GitHub no modifica Apps Script ya desplegado ni demuestra recepción. Si la prueba de QR desde la rama falla por enlace aún no publicado, abrir manualmente el formulario Apps Script ya desplegado y validar primero el receptor; repetir la prueba QR completa una vez desplegada la página destino en Pages.

## 6. Evidencia de prueba a conservar
Fecha, dispositivo, URL de entrada, ID de sesión, identificador ficticio, comprobante, estado en Sheets, resultado de prueba de teclado/proyección, duración real y observación de la persona evaluadora. No exponer públicamente datos de participantes ni registros de la hoja.
