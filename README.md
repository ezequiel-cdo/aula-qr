# AulaQR — Ruta de Aprendizaje Inteligente

Prototipo educativo mobile-first, basado en una microexperiencia integrada de cuatro momentos, accesible desde un QR Maestro o cuatro QR individuales.

**Ruta:** [APRENDE](qr1.html) → [PRACTICA](qr2.html) → [EVALÚATE](qr3.html) → [RETROALIMENTA](qr4.html).

**Tema piloto:** Contraseñas seguras. Nunca introduzcas contraseñas reales.

## Ejecutar
Abre [index.html](index.html) en un navegador. Para desarrollo, se recomienda un servidor web local estático; la publicación prevista es GitHub Pages. La navegación por archivos descargados y el almacenamiento local requieren validación específica en móvil.

## Estado
Primera implementación funcional mínima en la rama `feature/aulaqr-v1`: navegación, ejercicios de muestra y persistencia local básica. **No** es versión validada ni publicada. No genera aún QR físicos ni PDF; esas tareas siguen pendientes.

## Documentación
- [Requisitos](docs/requisitos.md)
- [Diseño pedagógico](docs/diseno-pedagogico.md)
- [Plan de pruebas](docs/plan-pruebas.md)

## Privacidad
No hay backend ni recepción automática de resultados. El navegador puede guardar reflexiones y respuestas localmente; evita introducir datos personales o secretos.
