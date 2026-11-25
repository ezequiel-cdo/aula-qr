# Estado del proyecto — 2026-11-25
Repositorio: cinco aulas, portada institucional, V3 anterior y V3 institucional, documentación V4 y backend de evidencias. V3 documenta validación histórica del XLSX: 424 registros, 12 grupos, cinco cursos (55/63/79/104/123). La auditoría compacta ejecutada por el responsable el 25/11/2026 confirma 424 estudiantes, 424 matrículas, 424 filas de Vista_AulaQR, 1102 filas de historial y 11 hojas; Contactos e Incidencias_Admin vacías. No prueba integridad referencial ni permisos. No se accedió directamente a la hoja viva. La versión Apps Script desplegada aún no se verificó.
- [x] Recuperar arquitectura y documentación.
- [x] Confirmar encabezados reales de las 11 hojas mediante informe del responsable.
- [x] Revisar 23 reglas originales y comprobar integridad referencial mediante instalador.
- [ ] Verificar permisos, destino de ensayo y despliegue efectivo.
- [ ] Aprobar diseño de almacenamiento y credenciales (ver actualizacion-participantes/README.md).
- [ ] Implementar módulo separado compatible con V3, piloto Tercero.
- [ ] Probar con datos ficticios: homónimos, caducidad, accesos indebidos, duplicados, concurrencia, consentimiento y fotos privadas.
- [ ] Validar en móvil y cuenta institucional antes de publicar.
La documentación pedagógica se conserva en cada aula. No declarar pruebas o despliegues que no se realizaron.

- [x] Crear instalador de esquema PAIVD en rama de continuidad.
- [x] Recibir ejecución satisfactoria de diagnóstico y aplicación del instalador en archivo configurado.

- [x] Recibir diagnóstico PAIVD v1.0.0 ejecutado por responsable: cero errores, 6 operaciones y 51 definiciones propuestas; revisar 23 reglas originales.
- [x] Aplicación y diagnóstico posterior reportados: 15 hojas, 74 definiciones, cero errores, cero cambios pendientes; valores visibles originales conservados según instalador.
- [ ] Confirmar independientemente destino de ensayo, permisos y comportamiento de V3 antes de producción.

- [x] Programar núcleo de ensayo PAIVD 0.1: reutilización V3, emisión privada, sesión y solicitudes pendientes, formulario y generador ficticio.
- [ ] Ejecutar pruebas restringidas /dev según actualizacion-participantes/PRUEBA_BACKEND.md; no publicar ni usar datos reales.

- [x] Adaptar PAIVD 0.2 a búsqueda institucional con año, curso y sección opcionales y etapas visibles.
- [ ] Comprobar carga de filtros y búsqueda sin filtros en /dev; probar cinco cursos con datos ficticios. La captura 0.1 mostró sección vacía; causa exacta aún no determinada.

- [x] Capturas del responsable confirman carga de filtros y búsqueda parcial sin tilde en 0.2, con dos homónimos ficticios de Tercero A. Error Solo ensayo resuelto mediante configuración.
- [x] Programar 0.3: autocompletado 350 ms, fichas, agrupación de homónimos exactos y ampliador ficticio a cinco cursos.
- [ ] Ejecutar ampliación y pruebas funcionales 0.3 en /dev; no usar datos reales.

- [x] Captura del responsable confirma carga de filtros, autocompletado/ficha agrupada y selección en 0.3.
- [x] Decisión aprobada: retirar credencial del flujo declarativo; programar PAIVD 0.4 e instalador 1.0.1 compatible con solicitudes sin asignación.
- [ ] Probar 0.4 en /dev, envío único, homónimos, reintentos, no exposición privada, no cambios oficiales y diagnóstico compatible. Administración y producción pendientes.

## PAIVD 0.5 — captura mínima
Por observaciones del responsable: eliminar casilla sin teléfono propio, correo y acceso digital de interfaz y payload; conservar esquema institucional. Teléfono principal obligatorio (puede ser compartido o de tercero), alternativo y emergencia opcionales. Máscara (xxx) xxx-xxxx, 809/829/849, validación cliente y servidor; almacenamiento normalizado +1. Si no dispone de ningún número de contacto, requerirá asistencia docente. No implica verificación efectiva de teléfono. Actualizar PAIVD_Participantes.gs y FormularioPAIVD.html conjuntamente; instalador 1.0.2 admite declaraciones 0.4/0.5 sin migrar columnas. No ejecutar Aplicar. Probar en /dev con datos ficticios, teléfono incompleto, código de área inválido, número compartido y envío sin correo/perfil. Sin ejecución en Apps Script ni despliegue.
