# PFMTTD · Inicio de sesión, diagnóstico y «¿Qué sabemos?»
**Versión:** 0.9.3 · **Fecha:** 2026-11-15 · **Estado:** desarrollo para revisión (PR #9).
**Corrección:** recurso diagnóstico ahora accesible por QR y aplicable con registro central; actividad «¿Qué sabemos?» incorporada.
**Compatibilidad:** conserva el encuadre, acuerdos, expectativas y AulaQR original. **Dependencias:** Google Apps Script v1.4 para recepción del diagnóstico.

## Diferencia explícita con el RT-03 revisado
El RT-03 dice **08:00–08:30: exhibición y entrega del diagnóstico inicial; no aplicar ni puntuar durante la simulación**. El usuario ha indicado posteriormente que **sí debe ejecutarse**.
Este cambio implementa su aplicación opcional, pero **no cambia el RT-03**: la temporalización y actividad deben corregirse y aprobarse en el plan para que planificación y ejecución sean coherentes. Cuatro respuestas no pueden garantizarse para 21 personas en 30 segundos. La apertura del formulario por QR tampoco es evidencia de entrega de respuestas.

## Paso a paso para activar
1. En Apps Script del mismo Google Sheets privado, sustituir `Code.gs` con la versión 1.4.
2. Crear archivo HTML **Diagnostico** pegando `pfmtd/apps-script/Diagnostico.html`. No renombrarlo `Diagnostico.html.html`.
3. Guardar y ejecutar `configurar`. Debe crear la pestaña `Diagnostico_PFMTTD` sin eliminar `Acuerdos_PFMTTD` ni `Expectativas_PFMTTD`.
4. Gestionar implementaciones → Editar implementación existente → Nueva versión. Conservar URL `/exec`.
5. Comprobar `/exec?vista=diagnostico`. Enviar una prueba desde móvil y comprobar comprobante y fila `RECIBIDO`. No se asignan notas.
6. Una vez habilitado, abrir el QR de la tercera pantalla; verificar `pfmtd/diagnostico-responder.html` → Google Apps Script → hoja privada. Respaldo: `pfmtd/diagnostico-inicial.html` imprimible.
7. Probar «¿Qué sabemos?» con respuestas argumentadas y mostrar retroalimentación únicamente después del contraste oral.

## Trazabilidad y límites
- **RT-03 inicio de sesión:** recuperación 07:00–08:00; diagnóstico 08:00–08:30; conocimientos previos 08:30–10:00.
- **EPRADI:** actuaciones pertinentes en criterios 15–20, verificables mediante observación presencial y registro del instrumento cuando exista. La proyección no acredita participación.
- **Diagnóstico:** respuestas recibidas en Sheets, no evaluación ni puntuación automática.
- **¿Qué sabemos?:** selección de postura en pantalla es recurso de conducción, no registro individual. La evidencia es la argumentación real observada.
- **Privacidad:** no proyectar filas individuales de la hoja privada ni solicitar información real de empresas. Solo pseudónimo opcional.
- **Temporalización:** se requiere reconciliar el RT-03 con la nueva exigencia de aplicación; no afirmar que se realizaron las dos cosas en los mismos 30 segundos sin prueba cronometrada.

## Pruebas
Validación estática JavaScript realizada; no se ha actualizado todavía Apps Script, probado recepción en teléfono ni verificado la temporalización con participantes. No fusionar antes de completar esas validaciones.
