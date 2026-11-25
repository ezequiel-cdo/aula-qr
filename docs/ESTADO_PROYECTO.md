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
