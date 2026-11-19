# Aula virtual de Matemática EPJA · Tercer Año

## Estructura curricular de los 37 encuentros (integrada)

La planificación aprobada ya es una fuente de datos que lee la interfaz sin necesidad de duplicar manualmente las jornadas en el HTML.

- `estructura-37.js`: 29 contenidos (códigos M, conceptos, procedimientos), 37 jornadas (fechas, aprendizajes, actividades presenciales, 120 min de autoestudio, CE/IL propuestos, evidencias y observaciones) y seis recesos.
- `index.html`: las vistas **Mi ruta**, **Catálogo de contenidos**, **Encuentros** y **Recuperación** consumen estos datos.
- Secuencia aprobada: P1 polinomios (10), P2 ecuaciones e inecuaciones (10), P3 sistemas lineales (7) y P4 relaciones y funciones (10).
- Esta fase estructura y publica la **planificación**; no significa que las 37 guías explicativas ni sus prácticas interactivas se hayan redactado.
- La factorización M1.A01 es una ampliación sujeta a validación; los vínculos CE–IL son propuestas didácticas. La matriz aprobada de 37 encuentros sigue siendo la fuente que debe actualizarse antes de regenerar este archivo.
- La simulación P1 de 40 preguntas sigue operativa pero exige una auditoría de cobertura curricular con el nuevo orden de contenidos antes de una adopción oficial.

## Diagnóstico de entrada al grado · antes de P1

- **Sección Diagnóstico** accesible desde el final del Encuadre, Inicio y Mi ruta. El diagnóstico **no bloquea** el acceso a los módulos: respeta la autonomía de EPJA.
- `diagnostico-grado.js`: repaso con ejemplos de siete fundamentos (números, propiedades, signos, fracciones, potencias, raíces, jerarquía), seguido de 28 preguntas diagnósticas (cuatro niveles didácticos por eje). Muestra desempeño por eje y por nivel de dificultad.
- Niveles operativos de las tareas: Reconoce, Aplica, Analiza y Transfiere. No son escala oficial ni una medición psicométrica del dominio real. Una prueba de cuatro ítems por eje ofrece una **aproximación inicial orientativa**, complementable con observación y resolución explicada.
- **Plan de mejora** para ejes con ≤2/4 respuestas correctas, con acceso a repaso y una comprobación adicional de dos preguntas diferentes por eje. Registrar esas comprobaciones por separado del diagnóstico inicial evita sustituir retroactivamente el resultado.
- `repaso-aritmetica.html`: recurso autónomo basado en el HTML aportado por el usuario y adaptado a EPJA: tablas, laboratorios de signos, fracciones, potencias, raíces y jerarquía. Su autoevaluación interna de seis preguntas **no** es la prueba diagnóstica del grado.
- Las respuestas y revisiones de diagnóstico se guardan localmente (`epja_3ero_diagnostico_v1`), son consultables desde **Mis registros** y pueden exportarse como JSON. No se simula recepción docente ni calificación oficial.

## Experiencia de aprendizaje piloto · P1, Encuentro 1

- `encuentro1.js`: lección interactiva centrada en el participante, con cinco pasos (recordar, comprender, resolver un problema, autoestudio de 120 minutos y comprobación).
- Explicación de expresiones algebraicas mediante situaciones de ingresos y gastos, tabla de valores, pregunta de activación, ejercicio guiado, dos expresiones personales y reflexión.
- Comprobación final de cinco preguntas con explicaciones y posibilidad de repetir el intento.
- El trabajo se conserva en el navegador bajo la clave `epja_p1_e1_v1` y aparece resumido en **Mis registros**.
- El botón **Comenzar a aprender** de Inicio y la primera tarjeta de P1 abren la lección.
- **Importante:** es un piloto pedagógico, no una evaluación oficial; los demás 36 encuentros mantienen por ahora su estructura de planificación hasta desarrollarse.
- Validación realizada: sintaxis de los scripts y estructura de las referencias. El navegador automatizado disponible no permitió navegación por restricciones de administración, por lo que falta una prueba funcional completa en dispositivo.

## Estado del proyecto

## Estado actual

- Portada con imagen de 3.er Año proporcionada por el usuario (incorporada como SVG autocontenido con imagen JPEG), encuadre, inicio, ruta P1–P4, recuperación de encuentros.
- Calendario 2026–2027: 37 sábados lectivos propuestos.
- Ruta de cinco pasos por encuentro; guías completas de encuentros pendientes de desarrollo.
- P1: simulación de 40 preguntas, 10 por cada bloque C1–C4, disponible desde el cierre de P1 (31/10/2026).
- Correcciones exclusivamente después de finalizar.
- Historial de intentos finales de P1 en `localStorage`, resultados por bloque, diagnóstico, revisión de respuestas, exportación JSON.
- Cierre anual posterior al módulo IV (vista de estructura y resultados locales existentes).
- P2, P3 y P4: evaluaciones finales pendientes de módulos curriculares validados.

## Archivos

- `index.html`: interfaz del aula y navegación.
- `portada-grado.svg`: imagen institucional del grado incrustada de manera autónoma.
- `evaluacion-p1.js`: banco de preguntas y almacenamiento.
- `motor-p1.js`: navegación, corrección y resultados de P1.
- `apps-script/Code.gs`: **plantilla de backend desactivada**; NO recibe evidencias.

## Seguridad y alcance

El navegador guarda las prácticas de manera local; no autentica la identidad. Se recomienda usar el mismo dispositivo y exportar copias de respaldo. La hora local no sustituye la fecha de recepción del servidor. Ningún envío a Google Drive/Sheets funciona todavía. Las notas son simulaciones de práctica, no calificaciones oficiales.

Antes de habilitar Apps Script, deben configurarse la hoja privada, una política de autorización y controles antiabuso. La cuenta administradora será la autorizada expresamente por el centro.

## Auditoría curricular pendiente

La agrupación de las CE en los bloques C3 y C4 presenta una discrepancia entre la explicación general y la página impresa del registro de Matemática. Antes de procesar calificaciones oficiales debe validarse institucionalmente. El banco actual usa IL-1, IL-2, IL-4, IL-12, IL-14 e IL-16 para P1, pero la selección múltiple no acredita la dimensión integral de todas las competencias.

## Prueba manual recomendada

1. Entrar a portada, revisar encuadre y abrir el aula.
2. Abrir Mi ruta y recuperar un encuentro previo.
3. Entrar en Evaluaciones y comenzar P1.
4. Marcar preguntas, cambiar de bloque, actualizar la pestaña y comprobar borrador.
5. Entregar la práctica y verificar resultados de C1–C4.
6. Abrir Mis registros y comprobar historial del intento.
7. Exportar JSON y verificar que RP1 permanece sin calificación.
8. Acceder a cierre anual desde Mi ruta.

Nota: las comprobaciones estáticas de JavaScript y estructura no equivalen a una prueba completa con navegador real.
