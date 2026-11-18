# Aula virtual de Matemática EPJA · Tercer Año

Piloto independiente dentro de `ezequiel-cdo/aula-qr`. No altera el recurso PFMTTD.

## Estado actual

- Portada gráfica provisional, encuadre, inicio, ruta P1–P4, recuperación de encuentros.
- Calendario 2026–2027: 37 sábados lectivos propuestos.
- Ruta de cinco pasos por encuentro; guías completas de encuentros pendientes de desarrollo.
- P1: simulación de 40 preguntas, 10 por cada bloque C1–C4.
- Correcciones exclusivamente después de finalizar.
- Historial de intentos finales de P1 en `localStorage`, resultados por bloque, diagnóstico, revisión de respuestas, exportación JSON.
- Cierre anual posterior al módulo IV (vista de estructura y resultados locales existentes).
- P2, P3 y P4: evaluaciones finales pendientes de módulos curriculares validados.

## Archivos

- `index.html`: interfaz del aula y navegación.
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
