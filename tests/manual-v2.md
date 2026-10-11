# Plan de aceptación AulaQR + INFOTEP V2

- [ ] Portada muestra identidad visual, cuatro momentos y navegación coherente.
- [ ] Logotipo carga y su uso institucional está autorizado.
- [ ] QR1 muestra seis conceptos y guarda/refresca reflexión.
- [ ] QR2 analiza solo un ejemplo ficticio y no guarda la cadena introducida.
- [ ] QR2 genera ejemplos con crypto.getRandomValues; se advierte que las frases del pequeño diccionario no son claves seguras reales.
- [ ] QR2 da retroalimentación inmediata y conserva una decisión justificada.
- [ ] QR3 impide enviar respuestas incompletas.
- [ ] QR3 no presenta las respuestas correctas antes de finalizar.
- [ ] QR3 muestra cuatro explicaciones solamente después de finalizar y conserva el resultado.
- [ ] Al recargar QR3 después de finalizar, se restauran respuestas, puntuación y explicaciones, y se bloquea el reenvío accidental.
- [ ] Si localStorage está deshabilitado, QR3 comunica el error sin afirmar que el resultado se guardó.
- [ ] QR4 conserva reflexión y autoevaluación tras recargar.
- [ ] Carga visual correcta en navegador móvil y sin zoom horizontal.
- [ ] Se comunica que no hay envío de evidencias al facilitador.
- [ ] Se prueba la disponibilidad sin red y se documentan las limitaciones del logo remoto.
- [ ] Se verifica el estado de GitHub Pages tras la fusión aprobada.
- [ ] Cada código QR se escanea desde papel y abre la URL correcta.

Resultado: PENDIENTE DE EJECUCIÓN. Las comprobaciones estáticas no sustituyen pruebas manuales.

## Regresión QR2 — Analizador visual
- [ ] Al abrir QR2 sin texto, el panel de dureza permanece oculto.
- [ ] Pulsar «Probar con Equipo2026!» rellena el campo y muestra puntuación /100, barra coloreada y cuatro observaciones.
- [ ] Escribir o pegar otro ejemplo ficticio recalcula inmediatamente la puntuación y los consejos.
- [ ] Pulsar «Borrar ejemplo» oculta el análisis y vacía el campo.
- [ ] El campo no utiliza contraseñas reales y el texto analizado no se guarda en localStorage.
- [ ] La puntuación indica claramente que es una heurística didáctica, no una garantía de seguridad.
