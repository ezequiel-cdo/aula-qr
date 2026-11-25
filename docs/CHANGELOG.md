# Historial de cambios
## 2026-11-24 — Continuidad técnica
Se incorporan AGENTS.md y documentación central de contexto, arquitectura, diccionario, decisiones y estado. Se documenta la evolución del módulo de actualización a partir de V3, sin cambiar código operativo ni datos. Revisión documental del repositorio; no se ejecutaron pruebas funcionales ni se verificó Google Sheets o Apps Script en vivo. El siguiente hito es cotejar el esquema real y desarrollar el módulo compatible.

## 2026-11-25 — Auditoría institucional
Se incorporan encabezados y conteos de las 11 hojas, obtenidos del informe ejecutado por el responsable. Se documenta propuesta de actualización de participantes, pendiente de aprobación y pruebas. Sin cambios operativos ni datos personales.

## Instalador PAIVD v1.0.0
Código privado de instalación con simulación, integridad referencial, aprobación por huella, ampliación idempotente y verificación de valores visibles. Se revisó estructura del archivo en GitHub; sin ejecución en Apps Script ni cambios en el maestro. Las reglas y permisos requieren revisión manual.

## 2026-11-25 — diagnóstico PAIVD ejecutado por responsable
Se recibió resultado de PAIVD_RevisarDiccionario (23 reglas) y PAIVD_Diagnosticar v1.0.0: cero errores, 6 operaciones de esquema, 51 definiciones nuevas previstas. Se documentan reglas relevantes. Aplicación, confirmación del destino de ensayo, permisos y verificación posterior pendientes. No almacenar huella específica del libro en repositorio público.

## 2026-11-25 — instalación PAIVD reportada
El responsable ejecutó PAIVD_Aplicar y PAIVD_Diagnosticar: ambas salidas reportan 15 hojas, 74 definiciones, 424 estudiantes y matrículas, 1102 registros históricos, cero errores y cero cambios pendientes; huellas posteriores coinciden. El instalador informó conservación de valores visibles originales. No se verificaron directamente destino, permisos, fórmulas ni despliegue. No publicar huellas del archivo.

## Backend PAIVD 0.1 — ensayo
Código y formulario de ensayo, emisión privada, generador ficticio y guía de pruebas. Sin despliegue ni ejecución funcional. No aprobación, fotografía ni verificación telefónica; revisión de seguridad pendiente.

## PAIVD 0.2 — alcance institucional
Filtros opcionales y dinámicos, búsqueda por nombre en matrículas inscritas de cinco cursos, ubicación académica en coincidencias, diagnóstico visible de carga y reintento, etapas de contactos visibles. Emisión administrativa compatible con cualquier matrícula vigente. Se mantienen credenciales y captura pendiente de revisión; no se ejecutaron pruebas de esta versión ni se publicó.
