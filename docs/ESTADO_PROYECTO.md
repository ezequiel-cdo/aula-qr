# Estado del proyecto — 2026-11-25
Repositorio: cinco aulas, portada institucional, V3 anterior y V3 institucional, documentación V4 y backend de evidencias. V3 documenta validación histórica del XLSX: 424 registros, 12 grupos, cinco cursos (55/63/79/104/123). La auditoría compacta ejecutada por el responsable el 25/11/2026 confirma 424 estudiantes, 424 matrículas, 424 filas de Vista_AulaQR, 1102 filas de historial y 11 hojas; Contactos e Incidencias_Admin vacías. No prueba integridad referencial ni permisos. No se accedió directamente a la hoja viva. La versión Apps Script desplegada aún no se verificó.
- [x] Recuperar arquitectura y documentación.
- [x] Confirmar encabezados reales de las 11 hojas mediante informe del responsable.
- [ ] Revisar reglas del Diccionario y permisos; comprobar integridad referencial y despliegue.
- [ ] Aprobar diseño de almacenamiento y credenciales (ver actualizacion-participantes/README.md).
- [ ] Implementar módulo separado compatible con V3, piloto Tercero.
- [ ] Probar con datos ficticios: homónimos, caducidad, accesos indebidos, duplicados, concurrencia, consentimiento y fotos privadas.
- [ ] Validar en móvil y cuenta institucional antes de publicar.
La documentación pedagógica se conserva en cada aula. No declarar pruebas o despliegues que no se realizaron.

- [x] Crear instalador de esquema PAIVD en rama de continuidad.
- [ ] Ejecutar diagnóstico y ensayo en copia privada; revisar reglas y permisos antes de aplicar.
