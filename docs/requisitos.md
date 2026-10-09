# AulaQR V1 — Requisitos

## Propósito
Prototipo funcional de microexperiencia de aprendizaje mediante códigos QR, accesible desde un teléfono móvil. Una ruta integrada: **APRENDE → PRACTICA → EVALÚATE → RETROALIMENTA**.

## Entrada
Un QR Maestro dirige a `index.html`, con acceso a los cuatro momentos. Cada etapa también debe admitir una URL directa.

## Momentos y evidencias
| Etapa | Finalidad | Evidencia |
|---|---|---|
| QR1 Aprende | Activar saberes previos, comparar y comprender | Reflexión conceptual |
| QR2 Practica | Analizar casos y justificar decisiones | Selección razonada y retroalimentación inmediata |
| QR3 Evalúate | Transferir criterios a preguntas nuevas sin ayuda | Resultado individual; soluciones solo al finalizar |
| QR4 Retroalimenta | Reflexionar, autoevaluar y proponer mejoras | Reflexión, transferencia y opinión sobre el prototipo |

## Restricciones
- No solicitar contraseñas reales ni almacenar secretos.
- Diseño mobile-first, recursos accesibles desde navegador.
- Datos de participantes no se envían al facilitador: el almacenamiento local no es un backend.
- PDF para respaldo y evidencias, no como sustituto de HTML.
- Los QR impresos deben probarse físicamente antes de considerar el producto terminado.

## Tema piloto
**Contraseñas seguras.** Longitud, imprevisibilidad, unicidad, privacidad, gestores de contraseñas y MFA. El desempeño debe combinar saber, saber hacer y saber ser.

## Criterios de aceptación
1. Cuatro QR y QR Maestro accesibles desde móvil.
2. Navegación secuencial clara, con acceso directo a cada etapa.
3. QR1 forma sin convertirse en evaluación sumativa.
4. QR2 exige decisiones y justificación, con feedback inmediato.
5. QR3 no revela respuestas correctas antes de finalizar.
6. QR4 recoge reflexión, transferencia y propuestas de mejora.
7. Sin contraseñas reales, enlaces rotos ni servicios externos obligatorios.
8. Prototipo validado en dispositivos reales y estación impresa.

## Límites de esta iteración
Implementación inicial de la ruta y de una actividad mínima por etapa. Pendientes: pruebas de usabilidad, evaluación de accesibilidad, exportación de evidencias a PDF, creación/impresión de QR y validación del comportamiento offline. No se declara finalizado el prototipo.
