# Aula virtual de Matemática EPJA · Tercer Año

## Módulo II · Encuentro 2: ecuaciones lineales I, despeje (noviembre 2026)

- **Matriz aprobada:** P2-E02, fecha 14/11/2026, contenido M2.03; CE-MAT1 e IL-3 principales, IL-4 complementario; IL-8/IL-18 condicionales únicamente cuando haya evidencia. Se conservan dos horas presenciales y dos de autoestudio.
- **Libro oficial:** Matemática, Módulo II, páginas impresas **42–43** (PDF páginas 15–16). Las explicaciones y problemas incluyen la ecuación 5x−3=12 (p. 42), actividades −4x+1=21 y 5x−6=34 (p. 43) y verificaciones. Los temas con fracciones, paréntesis e incógnitas en ambos miembros se referencian, pero se profundizan en el Encuentro 3 según la matriz.
- **Archivo:** `modulo2-encuentro2.js` agrega una lección independiente a P2-E02 y un registro formativo en «Mis registros», con clave local `epja_modulo2_encuentro2_v1`.
- **Cinco pestañas:** «¿Qué sabemos?» recupera igualdad y equivalencia del E1; «Contenidos» presenta cuatro subtemas y laboratorios (comprobación por sustitución, operaciones en ambos miembros, detección de un despeje incorrecto y factura laboral); «Ejemplos» ofrece seis casos resueltos; «Práctica» tiene 12 actividades por cuatro destrezas, pistas, reintentos y autoestudio de 30+50+40 minutos; «Evaluación» incluye 16 reactivos nuevos en cuatro agrupaciones y cuatro niveles, además de dos justificaciones escritas.
- **Evaluación:** los agrupamientos B1–B4 y las categorías de dificultad constituyen evidencias **formativas**; no se calculan notas oficiales. Autoevaluación, coevaluación y heteroevaluación docente requieren valorar las explicaciones abiertas.
- **Conservación:** no se alteran el diagnóstico, las diez lecciones del Módulo I, ni la clave `epja_modulo2_encuentro1_v1` del encuentro anterior. Se evitó que la pantalla genérica se mostrara al navegar entre E1, E2 y otro módulo.
- **Pruebas realizadas:** sintaxis JavaScript; prueba en Chromium con 5 pestañas, 4 subtemas, 4 laboratorios, 12 prácticas, 16 reactivos, entrega e historial de intento simulado; vista móvil de 375 píxeles sin desbordamiento y sin errores JavaScript. Además, cuatro alternancias E1↔E2, con restauración de la guía al abrir otro período. **Pendiente:** comprobación integral en URL pública con móviles reales.
- **Estado:** P2-E01 y P2-E02 desarrollados individualmente. P2-E03 a P2-E10 continúan como guías con referencias curriculares hasta desarrollo posterior.

## Módulo II · Encuentro 1: lección interactiva individual (noviembre 2026)

- **Fuentes revisadas:** libro del MINERD, Tercer Año, Módulo II, Matemática, páginas impresas **38–41** (PDF pp. 11–14), y matriz aprobada de 37 encuentros: M2.01 + M2.02; CE-MAT1/IL-3 principales, IL-4 complementario. No se adelanta el estudio sistemático de las ecuaciones lineales del Encuentro 2.
- **Archivo:** `modulo2-encuentro1.js`, cargado después de los recursos del Módulo I. Accesible desde el calendario y la lista P2 como **Lección interactiva**, exclusivamente en P2-E01.
- **Cinco pestañas:** ¿Qué sabemos? (expresiones algebraicas de P1); Contenidos (cuatro mini secciones: equilibrio, tipos de igualdades, ecuación/identidad, ecuaciones equivalentes); Ejemplos (cinco explicaciones contextualizadas); Práctica (12 ejercicios en cuatro destrezas con pistas y correcciones, más 120 minutos de autoestudio); Evaluación (16 reactivos, cuatro bloques y cuatro niveles, dos evidencias escritas abiertas, informe y revisión posterior de respuestas).
- **Exploraciones:** balanza con variable, sustitución de dos variables, clasificación de igualdad y comparación de transformaciones equivalentes. Se requiere distinguir una **identidad** de una **ecuación**, y comprobar soluciones sin limitarse a elegir una respuesta.
- **Persistencia:** clave local `epja_modulo2_encuentro1_v1`; los registros de diagnóstico y Módulo I no se reemplazan. Se muestran resultados orientativos en Mis registros; las evidencias escritas requieren evaluación docente.
- **Evaluación responsable:** B1–B4 son grupos didácticos y no se calcula automáticamente el registro oficial C1–C4. No se han subido los PDF de P2–P4 a GitHub por las restricciones de reproducción del MINERD; se indican las páginas del libro y el enlace a la biblioteca oficial.
- **QA:** se realizó una prueba de comportamiento con Chromium para los cinco pasos, cuatro mini secciones, doce ejercicios, dieciséis reactivos, cálculo de informe, persistencia simulada y retorno entre pantallas, a ancho 375 px. Sin errores JavaScript ni desbordamiento en ese escenario. Falta revisar el recorrido desde la URL pública completa y en dispositivos del grupo.
- **Estado de P2:** este encuentro está desarrollado; los nueve siguientes permanecen como guías documentales hasta completar su desarrollo **uno por uno** y validarlos pedagógicamente.

## Auditoría integral e implementación coordinada · Módulo I (noviembre de 2026)

- **Alcance:** 10 encuentros de P1, matriz integrada de 29 contenidos y matriz curricular de 37 jornadas, libro oficial de Matemática Módulo I (pp. impresas 36–59), catálogo de CE-MAT1–7/IL-1–21 y banco de actividades existente.
- **Documento auditable entregado al docente:** `Auditoria_Holistica_Modulo_I_EPJA_2026-2027.xlsx`, con seis hojas: resumen, correspondencia de diez encuentros, trazabilidad de 40 apartados/subtemas (incluido E1), hallazgos y reservas, QA funcional y listado de 252 preguntas originales de E2–E10 con sus IDs y destrezas.
- **Implementación:** `laboratorios-contenidos-m1.js` incorpora en los encuentros 2–10 un desarrollo adicional de 36 conceptos y **36 actividades breves de comprensión**, una por cada uno de sus cuatro subtemas; presentan opciones, explicación, error y posibilidad de corregir sin puntuación. Las 12 prácticas y las 16 preguntas de evaluación de cada encuentro se conservan, al igual que los registros previos.
- **Interacción y posición:** `subnavegacion-m1.js` sitúa los laboratorios existentes en el subtema que les corresponde, en lugar de separarlos en una pestaña aislada de exploración; el nuevo script se carga después y complementa la comprensión dentro de cada subtema. Se completó la interacción de los selectores de polinomios E2 y clasificación E3, la comparación de factores E8 y de proveedores E10.
- **Correspondencia didáctica:** concepto/procedimiento C/P de la matriz → explicación → laboratorio y comprobación → ejemplos resueltos → IDs de prácticas y evaluación por destrezas. Los vínculos práctica/indicador son **propuestas de auditoría**, no acreditación de competencias ni correspondencia oficial de C1–C4.
- **Factorización:** M1.A01 sigue siendo ampliación propuesta y **no** tiene capítulo específico del PDF. No convertir en calificación oficial.
- **Pruebas efectivamente realizadas:** pruebas con Chromium en páginas de ensayo para encuentros 2–10; 36/36 actividades montadas, 36/36 comprobaciones de acierto, 36/36 de respuesta errónea y 36/36 reintentos; controles E2/E3/E8/E10 comprobados; nueve vistas móviles de 375 px sin desbordamientos; cero excepciones JavaScript. También se comprobaron los archivos por sintaxis.
- **Pendiente de certificación final:** prueba del recorrido integrado desde el enlace público (incluyendo el Encuentro 1 y el cambio entre todas las pestañas), prueba en dispositivos reales, observación con participantes y validación de las asociaciones CE/IL del registro oficial. Las pruebas de componentes por sí solas no equivalen a la validación integral de producción.
- **Sin cambios:** estructura aprobada de 37 fechas, diagnóstico independiente, portada, evaluaciones oficiales no automatizadas, claves locales de progresos y el acceso a los cuatro módulos.

## Ampliación de contenidos y ejemplos interactivos · Módulo I

- **Encuentro 1:** se añaden ejemplos contextualizados de pago por horas y factura de agua, sin alterar la práctica, evaluación ni clave de progreso aprobadas.
- **Encuentro 2:** laboratorio de anatomía algebraica para coeficiente con signo, término, variable, exponente, término independiente, grado y semejanza. Se añade selector de polinomios para observar sus componentes. Se amplían los ejemplos de costos, recibos y producción.
- **Encuentro 3:** clasificador exploratorio por cantidad de términos y grado, y nuevos ejemplos de inventario y comparación de expresiones ordenadas.
- **Encuentro 4:** exploración de polinomio nulo, constante, mónico y raíz, junto al evaluador numérico. Se añaden ejemplos de raíz y costo fijo.
- **Encuentro 5:** control deslizante de coeficientes para observar la suma de términos semejantes; ejemplos de presupuestos y comprobación por sustitución.
- **Encuentro 6:** modelo de área/distributiva con variable ajustable; ejemplos de terrenos y lotes de producción.
- **Encuentro 7:** demostración de división larga en cinco pasos: ordenar, dividir, multiplicar, restar y repetir/verificar; ejemplos de cociente y resto en reparto.
- **Encuentro 8:** se amplían ejemplos de factor común y se presenta la distributiva inversa con tres casos resueltos. Se conserva como ampliación M1.A01 pendiente de validación curricular.
- **Encuentro 9:** laboratorio de caja sin tapa con ajuste simultáneo del volumen y dimensiones; se amplían contextos de cartón y presupuesto familiar.
- **Encuentro 10:** se añaden casos comparativos de proveedores y verificación de identidades mediante sustitución y distributiva.
- **Ejemplos:** E2–E10 pasan de dos a cuatro ejemplos desarrollados. No se aumentó el número de preguntas de práctica ni de evaluación.
- **Límite de la revisión:** las ampliaciones son contenido didáctico original y contextualizaciones; no sustituyen ni se presentan como transcripción literal de las actividades del libro. Deben contrastarse con las páginas impresas y, en el caso de M1.A01, con la decisión curricular correspondiente.
- **Verificación técnica:** sintaxis de los cinco archivos del aula (incluida la navegación y actividades de E1), conteo de 4 ejemplos por encuentro E2–E10 y presencia de laboratorios de anatomía, clasificación, polinomios especiales, suma, multiplicación, división y cajas. Queda pendiente validación pedagógica y funcional en navegador/dispositivo real con participantes.

## Portada y recorridos independientes · revisión de noviembre 2026

- **Tres accesos desde la portada:** «Entrar al Aula», «Conocer el Encuadre y Evaluación» y «Diagnóstico del Grado Anterior». La portada es la entrada inicial en cada recarga, sin imponer encuadre o diagnóstico como paso obligatorio.
- **Retorno:** el encuadre termina en la portada; el diagnóstico dispone de «Terminar diagnóstico y volver a la portada»; el aula ofrece retorno a portada en Inicio y en la cabecera, conservando el acceso a los apartados habituales mientras se estudia.
- **Inicio del aula:** sin CTA de diagnóstico ni encuadre; la tarjeta principal presenta **«La clase al día»** correspondiente al último sábado programado no posterior a la fecha mostrada, para estudiar o recuperar durante la semana. En semanas con receso declarado, el texto se transforma en «repasar el último encuentro» y no etiqueta una jornada anterior como clase nueva.
- **Reinicio de P1:** botón «Volver a comenzar el Módulo I» lleva al Encuentro 1 sin eliminar resultados ni reiniciar la clave local de progreso.
- **Mi ruta / Todos mis encuentros:** la jornada correspondiente a la semana se distingue por fondo azul suave, borde marcado y etiqueta textual «Clase de la semana». El resto mantiene sus estados habilitado/programado y el sistema no interpreta fechas anteriores como finalización.
- **Encuadre:** la orientación describe las cinco pestañas aprobadas: ¿Qué sabemos?, Contenidos, Ejemplos, Práctica y Evaluación. La marca de lectura del encuadre se puede conservar sin forzar la navegación.
- **Compatibilidad:** se mantienen el diagnóstico, las evaluaciones formativas y las claves de almacenamiento local. No se ha añadido cálculo oficial de calificaciones ni personalización automática.
- **Verificación técnica:** sintaxis de cinco scripts; ausencia de duplicados de ID HTML; enlaces de inicio, diagnóstico y encuadre desacoplados; comprobación de fechas de ejemplo, resaltado y recesos. **Pendiente:** revisión funcional integral en navegador público y dispositivos participantes.

## Subnavegación pedagógica por subtemas y competencias · Módulo I

- `subnavegacion-m1.js` añade un segundo nivel de navegación en **Contenidos** (subtemas), **Práctica** (destrezas) y **Evaluación** (B1-B4 y evidencias/entrega) para los diez encuentros de P1.
- **Encuentro 1:** 5 subtemas; 4 destrezas con 12 ejercicios y autoestudio; 4 bloques de evaluación con 16 reactivos, seguidos de evidencias, entrega única e informe.
- **Encuentros 2–10:** conceptos definidos en sus lecciones y una sección de exploración/referencias; 12 prácticas organizadas en 4 grupos de 3, más autoestudio; 16 reactivos organizados en 4 bloques más evidencias/entrega.
- La navegación es exclusivamente de **presentación** y no cambia el banco de reactivos, las claves de almacenamiento, el motor de corrección ni los resultados. La elección de mini sección se conserva mientras esté abierta la página, sin pretender medir dominio solo por visitarla.
- Los bloques B1–B4 son agrupaciones didácticas provisionales para orientación y seguimiento, no equivalencias verificadas del cálculo oficial C1–C4; los promedios oficiales de los cuatro períodos **siguen sin automatizarse**.
- Validación realizada en Chromium mediante página de ensayo (HTML inyectado): mini secciones de contenidos/práctica/evaluación para E1 y E2–E10, acceso a evaluaciones y campos de autoestudio, vista de 375 px y sin errores JavaScript. La última corrección de agrupación de la entrega E1 se verificó sintácticamente; queda pendiente la prueba completa desde la URL pública en un dispositivo del grupo.
- P2–P4 no se han convertido todavía a este formato, ya que continúan en alineación documental; primero corresponde validar el modelo actualizado en P1.

## Alineación curricular y documental de los cuatro módulos · noviembre de 2026

- **Archivo de referencia:** `alineacion-37.js` incorpora 37 jornadas (P1:10, P2:10, P3:7, P4:10), los propósitos didácticos redactados para los cuatro módulos, las 7 competencias específicas y los 21 indicadores de logro del Registro de Evaluación, con vínculos principales, complementarios y condicionales conforme a la matriz aprobada.
- **Interfaz:** `alineacion-ui.js` añade propósitos y situaciones contextualizadas por módulo; referencias a lecturas del MINERD por encuentro y, en un panel desplegable, los textos oficiales de competencias e indicadores, sus vínculos propuestos y la evidencia esperada.
- **Matriz editable:** `Matriz_Alineacion_Curricular_37_Encuentros_EPJA_2026-2027.xlsx` (entregada en la conversación). Conserva intactas las hojas históricas y agrega **Propósitos de módulos** y **Alineación documental 37**. Si se modifican criterios, actualizar primero la matriz y regenerar los datos de aula.
- **Módulo I (P1):** las 10 lecciones interactivas se mantienen. Todas reciben ficha de propósito, competencia, IL y lectura. El Encuentro 8 sigue siendo **ampliación pendiente de validación curricular** sin capítulo propio; el Encuentro 9 se vincula a pp. 52–53 y 56–59.
- **Módulo II (P2):** 10 jornadas, libro impreso pp. 38–55; igualdades y ecuaciones, ecuaciones lineales, cuadráticas, números imaginarios, inecuaciones, aplicaciones y evaluación. Se distinguen las tres jornadas de cuadráticas que comparten las pp. 44–45.
- **Módulo III (P3):** 7 jornadas, libro impreso pp. 38–55; ecuaciones en dos variables, recta, sistemas 2×2, reducción, **igualación y sustitución combinadas en E5** (pp. 46–49), método gráfico y evaluación.
- **Módulo IV (P4):** 10 jornadas, libro impreso pp. 38–55; relaciones, funciones, dominio y rango, funciones algebraicas, gráficas, funciones lineales, valor absoluto, parábolas, aplicaciones ambientales y evaluación. La función lineal y el valor absoluto comparten la doble página 46–47, pero son jornadas separadas.
- **Estado de disponibilidad:** P1 tiene prácticas y evaluaciones formativas interactivas; P2–P4 solo cuentan con **guías curriculares y referencias de páginas** hasta que se desarrollen sus lecciones. No mostrar como «lección terminada» ningún encuentro de esos períodos.
- **Fuentes y derechos:** las referencias de lectura de P2–P4 señalan páginas impresas de los PDF del usuario. No se subieron los libros completos de P2–P4 a GitHub, por su advertencia de reproducción. La interfaz ofrece un vínculo al portal Libro Abierto MINERD; P1 mantiene su recurso PDF ya existente.
- **Precisión curricular:** los propósitos de módulo son **redacciones didácticas**, no citas oficiales. Las formulaciones CE/IL del catálogo sí proceden del Registro. CE e IL de una jornada se identifican como vínculos **propuestos por la matriz**, no como logros acreditados ni calificaciones.
- **No se cambia** el diagnóstico de entrada ni se activa la personalización automática según sus resultados.
- **Verificación:** sintaxis de los scripts, inventario de 37 jornadas/7 CE/21 IL, 37 pruebas de apertura y consulta de fichas en Chromium con HTML de ensayo, sin errores JavaScript ni desplazamiento horizontal a 375 px. La navegación y almacenamiento desde la dirección pública completa necesitan revisión en dispositivo real.

## Estructura curricular de los 37 encuentros (integrada)

La planificación aprobada ya es una fuente de datos que lee la interfaz sin necesidad de duplicar manualmente las jornadas en el HTML.

- `estructura-37.js`: 29 contenidos (códigos M, conceptos, procedimientos), 37 jornadas (fechas, aprendizajes, actividades presenciales, 120 min de autoestudio, CE/IL propuestos, evidencias y observaciones) y seis recesos.
- `index.html`: las vistas **Mi ruta**, **Catálogo de contenidos**, **Encuentros** y **Recuperación** consumen estos datos.
- Secuencia aprobada: P1 polinomios (10), P2 ecuaciones e inecuaciones (10), P3 sistemas lineales (7) y P4 relaciones y funciones (10).
- Esta fase estructura y publica la **planificación**; no significa que las 37 guías explicativas ni sus prácticas interactivas se hayan redactado.
- La factorización M1.A01 es una ampliación sujeta a validación; los vínculos CE–IL son propuestas didácticas. La matriz aprobada de 37 encuentros sigue siendo la fuente que debe actualizarse antes de regenerar este archivo.
- La simulación P1 de 40 preguntas sigue operativa pero exige una auditoría de cobertura curricular con el nuevo orden de contenidos antes de una adopción oficial.

## Módulo I completo: encuentros 1 a 10 desarrollados

- **Encuentro 1, M1.01:** conserva la lección y los instrumentos previamente aprobados en `encuentro1.js` y `actividades-e1.js`; clave de almacenamiento `epja_p1_e1_v1` inalterada.
- **Encuentros 2–10:** `modulo1-lecciones.js` contiene una lección con cinco pestañas por encuentro: **¿Qué sabemos?** (recuperación del anterior), **Contenidos** (cuatro explicaciones documentadas), **Ejemplos** (dos aplicaciones resueltas), **Práctica** (12 actividades interactivas, pistas, correcciones y tres evidencias escritas) y **Evaluación** (16 preguntas nuevas, informe por bloque/nivel y dos evidencias cualitativas no puntuadas). Se mantienen 120 minutos de presencialidad y 120 minutos de autoestudio por jornada.
- **Banco de ejercicios:** 9 × 12 = **108 actividades interactivas de práctica**, 9 × 16 = **144 ítems formativos** y 18 ejemplos resueltos, además de los instrumentos del Encuentro 1. Los ítems fueron elaborados a partir de la matriz y los contenidos del libro, **no son una reproducción literal** de las figuras/tablas de actividades oficiales.
- **Referencias de lectura** según páginas impresas del Módulo I: E2 40–41; E3 42–43; E4 44–45; E5 46–47; E6 48–49; E7 50–51; E8 ampliación de factorización **sin capítulo específico**, E9 52–53 y 56–59, E10 54–55.
- **Encuentro 8:** el factor común es una ampliación sujeta a validación curricular, por lo que no debe imponerse como requisito de calificación oficial. **Encuentro 10:** el cierre por evidencias y reflexión no equivale a aplicar ni calcular la calificación oficial del período.
- **Bloques y niveles:** las cuatro agrupaciones de evidencias y los niveles «Reconoce, Aplica, Analiza, Transfiere» son una **organización pedagógica provisional**, no una equivalencia automática y certificada de los bloques de calificación del registro oficial. La clasificación por cuatro preguntas de cada bloque es orientativa. Las respuestas abiertas requieren coevaluación, autoevaluación y heteroevaluación.
- **Registros y continuidad:** los encuentros 2–10 se guardan de forma independiente bajo `epja_modulo1_encuentros_2_10_v1`, sin sobrescribir registros del diagnóstico ni del Encuentro 1. La sección **Mis registros** ofrece resumen por encuentro.
- **Control de calidad:** revisión de las 252 preguntas para evitar opciones duplicadas, sintaxis JavaScript y prueba de interfaz en Chromium con DOM de ensayo: **58/58 verificaciones** de navegación, preguntas, almacenamiento simulado, nueve encuentros y adaptación al tamaño móvil, **0 excepciones JavaScript**. No sustituye la prueba de producción desde la URL pública y dispositivos del grupo.
- **Alcance:** no se han automatizado las recomendaciones a partir del diagnóstico, conforme a lo acordado; los módulos II–IV conservan su estado de planificación.

## Desarrollo interactivo de M1.01: práctica por destrezas y evaluación formativa

- **Fuente:** matriz didáctica aprobada (Encuentro 1, código M1.01; CE-MAT1 e IL-1 principal, IL-12 complementario e IL-16 condicional) y actividades del libro oficial del Módulo I, páginas impresas **38–39**.
- **`actividades-e1.js`**: doce actividades de práctica interactivas, con niveles progresivos de dificultad, pistas, explicaciones después del acierto, nuevos intentos y registro local por destreza. Las cuatro familias de trabajo son: constantes y variables (p. 38), traducción de expresiones (p. 39), relación de edades (p. 38) y perímetro de un solar (p. 39). Las tareas son adaptaciones didácticas, no reproducciones literales de las tablas y figuras del libro.
- **Autoestudio:** se preservan los tres campos abiertos y la orientación **30 + 50 + 40 = 120 minutos** con evidencias de justificación, además de los ejercicios interactivos.
- **Evaluación:** 16 situaciones nuevas, una por cada combinación de cuatro **bloques de competencia** y cuatro niveles de dificultad (**Reconoce, Aplica, Analiza, Transfiere**). Las agrupaciones se basan en el esquema de cuatro grupos del registro oficial, pero no asignan calificación oficial ni acreditan el dominio integral a partir de cuatro preguntas por bloque. El informe ofrece categorías **orientativas** y explicaciones por respuesta.
- **Evidencias cualitativas:** justificación de una expresión y comparación de estrategias, reservadas para autoevaluación, coevaluación y heteroevaluación con criterio del facilitador; no se puntúan automáticamente.
- **Persistencia:** el almacenamiento existente `epja_p1_e1_v1` conserva campos anteriores y añade `practiceE1` y `evalE1`, con historial de intentos de evaluación. «Mis registros» presenta el resumen de ejercicios completados y último intento.
- **Verificación:** sintaxis de los archivos en GitHub, 12 actividades de práctica, 16 ítems evaluativos, cuatro bloques y niveles, correcta carga de scripts; prueba de componentes en Chromium con script inyectado y página de ensayo (pista, reintento, expresión escrita, captura y reinicio de evaluación, conservación del historial, sin errores JavaScript). Queda pendiente la prueba integral desde la URL pública con teléfonos y datos reales.
- **Limitación deliberada:** no se activó la recomendación automática entre diagnóstico inicial y módulos; sigue reservada para una decisión posterior.

## Revalidación documental de Módulo I · Encuentro piloto

- `modulo1-matematica.pdf`: edición web ligera del PDF aportado por el docente; conserva las 24 páginas del módulo y la numeración impresa 36–59. Se ofrece en **Mi ruta**, en la lista del período P1 y mediante enlaces a las páginas pertinentes de cada encuentro.
- `mapa-modulo1.js`: correspondencia estricta de las 10 jornadas del período P1 con códigos de la matriz aprobada, páginas impresas del libro y recurso del maestro. El Encuentro 8 **no** cuenta con capítulo propio de factorización en el PDF y mantiene el aviso de ampliación pendiente de validación. Las lecturas del Encuentro 9 son **52–53 y 56–59**, sin incluir las páginas evaluativas 54–55.
- `transicion-aritmetica-algebra.html`: versión adaptada para EPJA del HTML del maestro. Se enlaza como laboratorio de exploración complementario; sus temas más avanzados se reservan para encuentros posteriores. Su clasificación por arrastre puede requerir ajustes de accesibilidad móvil.
- `encuentro1.js`: pestaña **¿Qué sabemos?** recupera operaciones y prerrequisitos del diagnóstico sin adaptar automáticamente la ruta. **Contenidos** desarrolla M1.01 con constantes, variables, expresiones y traducción de frases (páginas 38–39), patrón numérico y control deslizante original integrado. **Ejemplos** presenta temperatura, perímetro e ingresos/gastos; **Práctica** incluye 30+50+40 minutos de autoestudio y referencia al libro; **Evaluación** conserva cinco preguntas de retroalimentación formativa. La clave previa de almacenamiento `epja_p1_e1_v1` se mantiene.
- Las fichas generales de los encuentros 2–10 recuperan el aprendizaje de la jornada anterior y muestran las lecturas correspondientes. Aún no constituyen diez lecciones interactivas desarrolladas.
- Comprobaciones: sintaxis de scripts, presencia del libro en el árbol del repositorio, diez fechas y títulos coincidentes con la matriz, 24 páginas preservadas en el PDF, y prueba de comportamiento del Encuentro 1 con DOM simulado (navegación, control deslizante, ejemplos, 120 minutos de práctica, cinco preguntas y persistencia). **Pendiente** una prueba de experiencia real con navegador y dispositivo móvil.

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
