# PFMTTD — Encuadre grupal (propuesta en revisión)

**Versión:** 0.3-github · **Fecha:** 2026-11-15 · **Estado:** borrador de Pull Request.

## Entrada
Abrir `pfmtd/index.html`. La versión temática **no sustituye** `index.html` ni los cuatro recursos del piloto «Contraseñas seguras».

## Actividades
Portada → panel de nueve accesos: bienvenida; facilitador; presentación oral con asistencia física; integración; sorteo de comunidades; acuerdos; programa; tema y aprendizaje; expectativas. Navegación manual, modales y exportación local. La lista nominal se carga en el navegador y **no se publica en GitHub**.

El formulario `pfmtd/acuerdos.html` permite redactar y exportar propuestas. **No hay backend ni recepción central**. Para que las propuestas aparezcan en el panel, el facilitador puede importarlas manualmente en JSON o registrar intervenciones orales.

## Trazabilidad y restricciones
- Inicio de curso RT-03: siete minutos, con actividades complementarias y conducción oral.
- Criterios EPRADI relacionados: 8–14, según actuación observada; 16–17 corresponden al inicio de sesión y no se acreditan aquí.
- La presencia de una pantalla NO demuestra asistencia, aprendizaje ni ejecución.
- Para los 21 participantes previstos: cinco comunidades de tamaños 5/4/4/4/4. El listado previamente recibido contenía 19 nombres, que deberán cargarse en el entorno privado del facilitador.
- El sistema solo persiste en `localStorage` de ese navegador y permite exportar; no sincroniza entre dispositivos.
- No hay QR incorporado hasta verificar una URL HTTPS publicada. Tras fusionar y publicar Pages, se podrá configurar uno hacia `https://ezequiel-cdo.github.io/aula-qr/pfmtd/acuerdos.html`. **No anunciarlo como activo antes de comprobarlo**.
- El acceso a «Color Esperanza» remite a búsqueda de una reproducción autorizada, sin audio integrado.
- Este módulo es una integración funcional reducida basada en el prototipo autónomo v0.3. No incluye las dos imágenes incrustadas en el HTML local; la portada original y el retrato deben integrarse como activos optimizados en una revisión posterior, con consentimiento para la foto.
- La competencia general literal y RA1.1 deben cotejarse con el RT-03 revisado.
- No probados aún: iPhone, Android, proyector, navegación publicada y carga por QR.

## Compatibilidad
Los archivos nuevos están confinados en `pfmtd/`. No se cambia la ruta del AulaQR existente. Las funciones de la versión local v0.3 permanecen disponibles en el artefacto descargable de la conversación; este módulo elimina los datos personales incrustados antes de publicarse.


## Actualización 0.4 — 15/11/2026
- Se precargaron en el HTML público los **19 nombres** suministrados por la coordinación, con autorización expresa de publicación indicada en la conversación. Faltan dos registros para completar las 21 plazas previstas.
- Se añadió un enlace y código QR propuesto a `/aula-qr/pfmtd/acuerdos.html`; **el destino no ha sido verificado públicamente** y no debe proyectarse como funcional mientras continúe en la rama sin publicación.
- El formulario incluye estructura para POST HTTPS a un servicio receptor, pero `RECEPTOR_HTTPS` permanece vacío. Solo marcará recepción si el servidor devuelve HTTP 2xx y `receipt_id` en JSON. GitHub Pages por sí solo no almacena envíos.
- La portada gráfica exacta y la fotografía original están preparadas en un paquete de activos para incorporarlas a `pfmtd/assets/portada-programa.png` y `pfmtd/assets/ezequiel-cuello.jpg`. **No están aún subidas al repositorio**, por lo que la portada que se ve en la rama es una reconstrucción tipográfica provisional.
- Pendiente: autorización y configuración del servicio de respuestas (por ejemplo, Apps Script, Function o backend autorizado), persistencia segura y panel de consolidación; pruebas reales de punta a punta.
