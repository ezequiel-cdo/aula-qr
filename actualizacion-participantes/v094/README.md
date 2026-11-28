# PAIVD V0.9.4 — continuidad funcional

Base obligatoria de participantes: v09 (V0.9.1), blobs 3f22199359379302b71ab02c04d4fe105b2fb54d (GS) y 5a4a02a709e325f2ba99de424a359a204835de38 (HTML). No se adopta el buscador de v092 ni v093.

Cambios autorizados: versión y prefijos de sesión; admitir PRODUCCION_CONTROLADA con autorización explícita y cuenta efectiva propietaria; comprobar mismo libro real; reconocer modo en HTML y mostrar etiqueta de entorno correcta. Administración: admitir esquema 0.9.4 sin alterar el flujo. Instalador 1.0.9: compatibilidad diagnóstica. PAIVD_Registro.gs se conserva intacto.

Verificación estática tras recuperar los archivos guardados: HTML y CSS anteriores al script idénticos salvo número de versión; función programarBusqueda idéntica (tres caracteres, 350 ms); algoritmo de puntuación y agrupación conservados (hasta cinco fichas), mismos filtros y textos; política de vista fotográfica privada idéntica. No se exige código ni dos palabras completas. No se han ejecutado pruebas reales Apps Script ni se han modificado implementaciones, libro o Drive.

Producción: la búsqueda anónima expone nombres y grupos académicos de coincidencias y estado de existencia de foto, nunca el archivo de foto ni los contactos existentes. El límite original de consultas es global, no garantiza impedir enumeración. La autorización institucional para estos datos y la revisión de todos los RPC públicos (incluido Código.gs local) son requisitos antes de difundir el enlace. La foto sigue siendo evidencia visual, no prueba biométrica de vida. Cámara integrada/selector móvil aún pendientes de validación; no se modifican en esta versión. No otorgar acceso público al panel de revisión ni a Drive/Sheets.

Pruebas: primero editor /dev, escritura administrativa deshabilitada durante diagnóstico; comprobar paridad visual y búsqueda parcial automática, filtros y selección, compatibilidad versión/mode, cámara móvil y consentimiento; después publicación controlada y verificación sin cuenta Google. No borrar historial de solicitudes. No realizar envíos reales con identidad ajena. Las versiones previas permanecen disponibles.
