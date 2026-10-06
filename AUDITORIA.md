# Auditoría y mejoras aplicadas

Revisión del portfolio de Ana Gil, 7 de octubre de 2026. Los cambios están en este checkout; no se ha publicado la web, sincronizado Framer ni enviado el trabajo a Claude.

El [diagnóstico original completo](docs/AUDITORIA_ORIGINAL.md) conserva las evidencias previas, prioridades y recomendaciones. Este documento describe el estado después de corregirlas.

## Código

| Problema detectado | Cambio aplicado |
|---|---|
| Dependencias con avisos de seguridad | Vite, plugin de React, router y Sharp actualizados; gray-matter sustituido por YAML. Sharp de Miniflare actualizado mediante una sustitución de versión de parche. Ambas auditorías npm sin avisos conocidos. |
| POST con JSON `null` provocaba un error | Validación de objetos y tipos; respuestas 400 para datos inválidos y 413 para cuerpos mayores de 8 KiB. |
| Comprobación de cuotas separada de la inserción | Una sola sentencia SQLite comprueba y escribe. Las pruebas de 12 solicitudes simultáneas admiten una y rechazan 11. También se comprueba el máximo diario. |
| Inicialización compartida incorrectamente entre bases | Inicialización por conexión, con reintento cuando falla. Moderación valida identificadores y almacenamiento. |
| Inicio móvil quedaba atenuado en StrictMode | Estado derivado de la ruta; eliminado el contador de aperturas y las actualizaciones que se desequilibraban. El inicio queda inerte mientras hay una app abierta. |
| Probador inaccesible con teclado | Flechas, Page Up/Down, Home y End; valor y explicación accesibles. Se libera el arrastre al cancelarse. |
| Spotlight permitía salir del diálogo con Tab | Confinamiento y restauración del foco; cierre con Escape y semántica de diálogo. |
| Metadatos conservaban la página anterior | Registro compartido entre prerender y navegador para título, descripción, canonical y tarjetas sociales. Datos estructurados actualizados al navegar. |
| El generador ocultaba errores | Fallos explícitos ante archivos obligatorios ausentes, YAML inválido, proyectos incompletos, números repetidos y tejidos inexistentes o inválidos. |
| Markdown podía introducir HTML ejecutable | Saneamiento del HTML y de los enlaces antes de generar contenido. Escapado seguro de datos estructurados. |
| Imágenes conservaban la misma URL tras cambios | Nombres con huella de contenido y versión del procesador, orientación EXIF corregida y límites de rutas de entrada/salida. |
| La documentación recomendaba un hosting incompatible con la API | Cloudflare Pages desde la raíz, salida `site/dist` y D1 `DB`; Vercel documentado como alternativa estática. |
| Contacto mostraba éxito sin confirmar el envío | Éxito únicamente cuando Web3Forms confirma. Sin integración, se anuncia un borrador y se conserva el mensaje. |
| Ausencia de controles de regresión | Pruebas de API/contenido, navegador, comprobación de tipos y flujo de CI. Pantalla de recuperación ante errores de React. |

La exportación desde Framer ahora rechaza sobrescribir contenido existente sin `--overwrite`. No se ejecutó la sincronización remota.

## Diseño y uso

- Se conserva la identidad del archivo, la tipografía editorial y las interfaces de escritorio y móvil.
- El inicio de escritorio tiene accesos explícitos a proyectos, currículum y contacto. El Dock muestra las herramientas de navegación útiles; las etiquetas del Dock móvil son visibles.
- El móvil abre directamente el portfolio. El escritorio Mac sigue siendo la portada en escritorio y tablet; el Dock compacto cabe en ambas pantallas. La interfaz móvil se utiliza hasta 700 px y no muestra una tarjeta de CV al entrar.
- Cada proyecto abre una lectura continua: contexto, rol, concepto, resultado, proceso y técnica. El libro editorial sigue disponible mediante un botón y tiene una vuelta al resumen.
- La lectura emplea texto de 16–17 px, imágenes adaptables y galerías de dos columnas. Los textos largos del libro se pueden desplazar; el gesto de página no intercepta ese desplazamiento.
- El libro móvil añade controles anterior/siguiente, navegación por teclado y anuncio de página.
- El CV prioriza información, carta y trayectoria; etiqueta y terminal se conservan en un selector secundario. Su contenido y traducciones están separados del componente de presentación.
- Se mejora el contraste, la correspondencia de nombres accesibles y las indicaciones de foco. Menús y controles usan semántica compatible con su funcionamiento.
- Se elimina el arranque que retrasaba el acceso y se desactiva el salvapantallas automático. El libro, la apertura móvil, el probador y el widget de proyectos respetan la preferencia de movimiento reducido.

## Verificación

- Instalación reproducida con los dos lockfiles mediante `npm ci`.
- Compilación: 5 proyectos, 51 entradas de imágenes y 21 páginas prerenderizadas.
- TypeScript: sin errores.
- 10 pruebas de API y contenido; incluyen JSON inválido, tamaño del cuerpo, concurrencia, cuota diaria, persistencia, moderación, HTML seguro y metadatos.
- 9 pruebas de navegador: lectura/libro a 390, 768 y 1440 px; navegación SPA; foco de Spotlight; teclado del probador; API sobre D1 local; inicio del escritorio sin una ventana de CV y apertura del currículum solo desde su icono.
- Revisión de 42 cargas de página (21 rutas en escritorio y móvil), sin errores JavaScript ni imágenes rotas.
- Revisión visual en escritorio, tablet, móvil y pantalla baja, con 24 capturas.
- 12 comprobaciones automáticas de accesibilidad de inicio, proyecto, CV, contacto, notas y probador en móvil y escritorio: sin incidencias detectadas por las reglas WCAG A/AA ejecutadas. Una comprobación automática complementa la revisión visual y el teclado; no equivale a una certificación de accesibilidad completa.
- `npm audit` en raíz y `site`: cero vulnerabilidades conocidas al realizar la revisión.

Los comandos para repetir la verificación y publicar están en [PUBLICAR.md](PUBLICAR.md). La configuración reutilizable de instalación y arranque se ha actualizado en el borrador del entorno en la nube.

## Alcance y pendientes externos

No se han probado la base de datos publicada, la entrega real de correo ni el runtime independiente de Framer. El servicio de contacto real requiere configurar Web3Forms; el modo correo funciona como preparación de borrador.

Los componentes de `framer/` constituyen otra implementación: estos cambios de interfaz corresponden a la aplicación `site/`. Publicar o trasladarlos a un proyecto alojado en Framer necesita su propio flujo de sincronización y validación.

La CI está añadida y sus comandos se han ejecutado localmente; no se ha observado una ejecución en GitHub. Los datos biográficos, experiencia y disponibilidad no se han inventado ni actualizado. Una evaluación con lectores de pantalla y usuarios reales puede detectar problemas que no cubren estas pruebas.

La publicación del sitio y la activación del nuevo borrador del entorno son acciones separadas. Para conservar el nuevo entorno en futuras tareas, revisa y guarda el borrador en la configuración del entorno y publícalo.
