# AulaQR V2 — Integración visual y pedagógica INFOTEP

## Alcance
Adaptación visual de AulaQR para una demostración educativa inspirada en la identidad INFOTEP. No implica aval, autorización ni certificación oficial de la institución.

## Base
- Logo institucional: imagen servida por el portal institucional de INFOTEP, integrada como referencia externa para esta fase. **Dependencia externa pendiente de eliminar:** sustituir por el logo proporcionado en un archivo local versionado, con autorización de uso, antes de prometer funcionamiento íntegramente offline.
- Colores de interfaz tomados como *paleta de trabajo* del HTML de referencia, no como especificación oficial certificada: azul marino #0c2338; verde #0a7a4b; verde claro #18a56d; lima #b7d63b; fondo #f4f8f6.
- Fuente pedagógica: *Manual de formación profesional y componentes de la formación basada en competencia*, INFOTEP, segunda versión, noviembre 2024. Se recoge su enfoque activo y centrado en el participante, con criterios de aprendizaje y desempeño; no se reproducen fragmentos extensos del manual.
- Fuente de contenido: HTML compartido «INFOTEP | Contraseñas Seguras», con seis conceptos, analizador ilustrativo, generador y mini-reto. Las actividades están redistribuidas en la secuencia de AulaQR.

## Matriz de momentos
| Archivo | Momento | Ampliación |
|---|---|---|
| index.html | QR Maestro | Resultado esperado, instrucciones y saber / saber hacer / saber ser |
| qr1.html | Aprende | Seis criterios, conflicto conceptual y reflexión guardada |
| qr2.html | Practica | Analizador de ejemplos ficticios, generador didáctico y decisión con explicación inmediata |
| qr3.html | Evalúate | Cuatro preguntas nuevas, sin mostrar soluciones hasta el envío final |
| qr4.html | Retroalimenta | Cambio conceptual, transferencia, autonomía, claridad y mejora |

## Precauciones
- Nunca solicitar contraseñas reales ni guardar ejemplos introducidos en el analizador.
- El generador de frases utiliza un diccionario pequeño: sirve **solo como demostración** y no se recomienda para generar credenciales de producción.
- La revisión de longitud/patrones del analizador es heurística, no una medida científica de robustez.
- No existe backend; los resultados y reflexiones se conservan únicamente en el navegador que realiza la actividad.
- La marca y el logo deben someterse a autorización de publicación externa cuando corresponda.
- Los QR impresos de la propuesta visual previa son una ilustración; antes de usarlos hay que generar códigos QR reales a partir de las URL públicas finales y comprobarlos.

## Publicación
GitHub Pages usa main; esta rama NO altera el sitio publicado hasta integrar el Pull Request. No fusionar sin revisión funcional y de identidad.

## Pendientes para V2
1. Incorporar el PNG original del logo como asset local autorizado (en lugar de enlace externo).
2. Generar el afiche final imprimible con códigos QR reales verificables.
3. Ejecutar pruebas en Android/iOS, persistencia, evaluación, accesibilidad y uso sin conexión.
4. Exportar evidencias a PDF y validar el flujo de facilitación.
