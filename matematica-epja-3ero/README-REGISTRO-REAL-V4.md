# EPJA V4 · identificación real sin publicar listas

## Arquitectura
- GitHub Pages \`matematica-epja-3ero/registro-real.html\` **no recibe códigos** ni datos personales; solamente enlaza al despliegue privado de Apps Script.
- Un Apps Script vinculado a la hoja privada utiliza \`EPJA_Registro_Seguro_V4.gs\` y \`RegistroSeguro.html\`.
- Solo el docente puede emitir códigos, tras verificar presencial/documentalmente y marcar \`identidad_confirmada = SI\`.
- El participante recibe un código aleatorio individual entregado por el docente, visita el enlace privado y confirma exclusivamente su propia matrícula.
- La confirmación de identidad **no** habilita accesos ni actividades. No hay nombres ni teléfonos en el código público.

## Activación
1. En el Registro Maestro, **Extensiones → Apps Script**. Añadir un archivo de código \`EPJA_Registro_Seguro_V4.gs\` (del paquete entregado por ChatGPT) y un archivo HTML llamado \`RegistroSeguro\` (contenido de \`RegistroSeguro.html\`). No reemplazar V1 ni V2.
2. Ejecutar \`epjaV4SetupAdmin\` desde el editor con la cuenta propietaria. Se crea \`Codigos_Activacion_EPJA\` y una sal privada criptográfica en Script Properties.
3. Seleccionar la fila **ya confirmada** de un participante en \`Personas\`, y ejecutar \`epjaV4EmitirCodigoSeleccionado\`. Mostrar el código solo a su titular; no enviarlo por grupos, repositorios o capturas.
4. **Implementar → Nueva implementación → Aplicación web**. Ejecutar como: **Yo**; acceso: **Cualquier persona** solamente después de revisar el proyecto y probar con un registro autorizado. Copiar la URL terminada en \`/exec\`.
5. En GitHub, editar \`matematica-epja-3ero/registro-config.js\` y escribir la URL /exec entre comillas. No colocar código ni secretos en ese archivo.
6. Abrir \`registro-real.html\` desde el Aula QR. El participante sigue el enlace privado, ingresa su código y confirma su nombre.

## Límites
Esta es una **prueba de identificación por código**, no una autenticación integral del aula. La posesión del código permite leer el propio nombre y curso. Debe protegerse la distribución de códigos, auditar eventos, limitar abuso y usar un método de autenticación más sólido antes de exponer calificaciones, evidencias o habilitar cuentas. Apps Script Web Apps ejecutadas como propietario requieren especial atención a permisos. No publicar el Registro Maestro ni la hoja de códigos. No activar código sin verificación previa.
