# Aula QR · recepción sencilla sin códigos

La página pública `registro.html` solicita curso, sección y el nombre declarado por la persona. No consulta la lista de 167 matrículas ni sugiere nombres de compañeros. Mientras `registro-solicitud-config.js` esté vacío, el botón de envío permanecerá deshabilitado.

## Conexión sin comprometer el Registro Maestro

1. Crea **otro Google Sheets completamente vacío y privado**, con el nombre `EPJA_Bandeja_Solicitudes`. No copies fichas de estudiantes.
2. En ese archivo nuevo abre Extensiones > Apps Script, pega el contenido de `epja-bandeja-publica.gs` y ejecuta `epjaBandejaSetup`.
3. Comprueba la pestaña `Solicitudes`; luego Implementar > Nueva implementación > Aplicación web, **Ejecutar como Yo**, **Quién tiene acceso Cualquier persona**. Este permiso se aplica solo a la bandeja aislada, jamás al proyecto V4 del Registro Maestro.
4. Copia su URL de implementación terminada en `/exec` y pégala entre comillas en `registro-solicitud-config.js` del repositorio.
5. Abre el formulario desde un navegador sin iniciar sesión en Google y envía un **nombre ficticio**. Comprueba que llegó como `PENDIENTE_REVISION`; borra la fila de ensayo.

## Límites importantes

- No hay autocompletado desde la lista institucional: la autocompletación del navegador solo utiliza datos introducidos por la misma persona.
- Una solicitud no identifica ni autentica al solicitante. El docente coteja cada caso en sus herramientas privadas; no enviar resultados ni nombres de compañeros al navegador.
- El formulario público puede recibir solicitudes falsas o masivas; antes de uso extenso conviene reforzar límites y monitoreo antispam. No almacenar cédulas ni teléfonos en esta bandeja.
- No activa acceso a notas, evidencias ni perfiles individuales.
- El antiguo acceso de códigos V4 sigue privado, pero ya no está enlazado desde el aula.
