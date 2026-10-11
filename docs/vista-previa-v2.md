# Vista previa aislada de AulaQR V2.1

**No se modificó main ni la configuración de GitHub Pages.**

## Abrir desde GitHub Codespaces
1. En `feature/infotep-aulaqr-v2`, pulsa **Code → Codespaces → Create codespace on feature/infotep-aulaqr-v2**.
2. Espera a que se inicie el entorno y el servidor de vista previa. La configuración `.devcontainer/devcontainer.json` levanta un servidor estático de Python en el puerto 8000.
3. En la pestaña **Ports** abre el puerto **8000** mediante **Open in Browser**. En Codespaces el enlace tiene un dominio de GitHub para puertos reenviados y es independiente del sitio de GitHub Pages.
4. Verifica en la portada el logo local de INFOTEP y visita `qr1.html`, `qr2.html`, `qr3.html`, `qr4.html`.
5. Deja la visibilidad del puerto en **Private**. No compartas un enlace privado con participantes. Detén el Codespace al terminar.

## Alternativa sin Codespaces
Descarga el ZIP de la rama desde GitHub, descomprímelo y ejecuta en la carpeta del proyecto:

```bash
python -m http.server 8000
```

Abre `http://localhost:8000/` en el navegador. Si quieres probar desde otro teléfono conectado a tu misma red, utiliza una conexión de prueba local segura: no expongas el puerto a Internet.

## Pruebas mínimas
- [ ] La portada y las cuatro etapas abren.
- [ ] Todas las páginas muestran `assets/brand/Logo_Infotep.png`.
- [ ] QR1 conserva la reflexión tras recargar.
- [ ] QR2 ejecuta laboratorio, generador didáctico y retroalimentación inmediata.
- [ ] QR3 muestra explicaciones solo al enviar y conserva la evaluación tras recargar.
- [ ] QR4 conserva la reflexión y valoración.
- [ ] La pantalla móvil es legible y navegable.

**Nota:** esta vista previa no es un despliegue público permanente ni una publicación de GitHub Pages. La V1 pública se conserva intacta en `main`.
