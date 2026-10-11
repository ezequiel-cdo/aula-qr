# Plan de aceptación AulaQR + INFOTEP V2

- [ ] Portada muestra identidad visual, cuatro momentos y navegación coherente.
- [ ] Logotipo carga y su uso institucional está autorizado.
- [ ] QR1 muestra seis conceptos y guarda/refresca reflexión.
- [ ] QR2 analiza solo un ejemplo ficticio y no guarda la cadena introducida.
- [ ] QR2 genera ejemplos con crypto.getRandomValues; se advierte que las frases del pequeño diccionario no son claves seguras reales.
- [ ] QR2 da retroalimentación inmediata y conserva una decisión justificada.
- [ ] QR3 impide enviar respuestas incompletas.
- [ ] QR3 no presenta las respuestas correctas antes de finalizar.
- [ ] QR3 presenta diez situaciones alineadas a QR2; las respuestas correctas y las explicaciones aparecen solamente después de finalizar.
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

## Parámetros configurables de QR2
- [ ] Con Equipo2026! y longitud mínima 15, debe fallar longitud y el filtro de patrones.
- [ ] Cambiar mínimo a 10 cumple longitud del ejemplo sin alterar la valoración heurística de dureza.
- [ ] Desmarcar símbolos y números reduce el total de criterios sin alterar la contraseña ni la valoración heurística.
- [ ] Un ejemplo sin mayúsculas falla solo las reglas aplicables seleccionadas.
- [ ] Desmarcar todos los criterios muestra un estado informativo sin división entre cero.
- [ ] El ejemplo no se transmite ni se almacena; la barra de heurística no equivale a seguridad garantizada.

## QR2: diseño compacto y retroalimentación adaptable
- [ ] La longitud mínima aparece por encima de los criterios; los criterios ocupan columnas; la contraseña está debajo.
- [ ] Al introducir una contraseña ficticia aparecen barra de color, robustez textual y puntuación heurística.
- [ ] Modificar casillas actualiza el total, los criterios cumplidos/fallidos y el comentario adaptativo.
- [ ] Cambiar longitud mínima modifica su validación, pero no altera artificialmente la puntuación heurística.
- [ ] Con todos los requisitos desmarcados se muestra una explicación útil.
- [ ] Borrar el ejemplo oculta el resultado y muestra el texto de orientación.

## Evaluación integral QR3 V2.2
- [ ] Hay 10 preguntas nuevas repartidas entre criterios técnicos (4), análisis/aplicación (3) y decisiones responsables (3).
- [ ] La barra textual de progreso muestra respuestas completas sin revelar aciertos.
- [ ] El formulario exige responder las diez preguntas antes de enviar.
- [ ] Antes de finalizar no se muestran respuestas correctas ni explicaciones.
- [ ] Al finalizar se muestra resultado global, desglose por ámbito y explicaciones por pregunta.
- [ ] Al recargar, se recuperan todas las opciones y el resultado, sin permitir un segundo envío accidental.
- [ ] Los resultados antiguos del QR3 de 4 preguntas no se interpretan como evaluación nueva.
- [ ] En un navegador con almacenamiento bloqueado se avisa del error sin afirmar guardado exitoso.
- [ ] No se introducen contraseñas reales y las respuestas no se transmiten a ningún servidor.
