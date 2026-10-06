> Diagnóstico anterior a los cambios. Los estados vigentes y las verificaciones están en [AUDITORIA.md](../AUDITORIA.md). Las referencias de línea de este diagnóstico corresponden a la versión original.

# Auditoría integral: código, diseño y experiencia de uso

Repositorio: `lucasgilgon/ana-gil-portfolio`. Commit revisado: `c169184aa29b93c3f3636ae04030414792768374`. Fecha: 6 de octubre de 2026.

## Dictamen

El portfolio tiene una identidad coherente: archivo, papel, costura, tipografía editorial y fotografías del trabajo de Ana. El escritorio y el libro aportan personalidad. El principal problema es que esas experiencias todavía tienen fallos de lectura y navegación, y en algunos recorridos exigen más esfuerzo que una presentación directa del trabajo.

Recomiendo conservar la identidad y dar prioridad a tres objetivos: que todo el contenido se pueda leer, que cualquier persona pueda navegar con sus dispositivos de entrada y que proyectos, CV y contacto se encuentren con facilidad. Las propuestas estéticas son recomendaciones de producto; los errores reproducidos se detallan aparte.

No se ha cambiado código, contenido, dependencias declaradas ni lockfiles del repositorio. Los informes, herramientas y pruebas se guardaron fuera del checkout.

## Qué se revisó

- 72 archivos de código propios, aproximadamente 19.435 líneas: inventario, análisis sintáctico y revisión dirigida de los componentes, scripts, API y configuraciones relevantes. No se presenta como una verificación manual exhaustiva de cada línea.
- Build de producción y comprobación de tipos de `site/src`, ambos correctos; 21 páginas prerenderizadas.
- 42 cargas de rutas en Chromium: las 21 rutas en escritorio y móvil; sin errores JavaScript ni imágenes rotas en esas cargas.
- 24 capturas principales: seis pantallas en 1440×900, 768×1024, 390×844 y 1024×600; capturas adicionales del libro abierto y del texto.
- Pruebas dirigidas de navegación SPA, cierre móvil, foco modal, teclado, formularios, recorte de contenido, dimensiones del Dock, cabeceras de caché y generación de contenido inválido.
- axe-core en contacto, notas con formulario abierto y probador, en escritorio y móvil. La herramienta identifica problemas; no certifica por sí sola cumplimiento WCAG.
- Auditoría de npm en raíz y en site. Los resultados contienen dependencias compartidas y avisos cuya aplicabilidad depende del runtime.
- API y D1 locales. No se han realizado escrituras en Framer, enviado formularios reales, modificado la base de producción ni desplegado cambios.

No se han verificado Safari, Firefox, hardware móvil físico ni funcionamiento remoto de Framer/Web3Forms/analítica. Las medidas locales de recursos no son resultados de Lighthouse ni Core Web Vitals de visitantes reales.

## Prioridad de los problemas

P1 significa corregir primero por impacto material. P2 significa una corrección relevante en el siguiente ciclo. “Confirmado” se refiere al entorno o prueba indicado, no a todos los despliegues posibles.

| ID | Prioridad | Problema | Evidencia |
|---|---|---|---|
| 11 | P1 | Texto de proyectos recortado y sin scroll en ventanas bajas | Confirmado en 1024×600 |
| 1 | P1 | Avisos de seguridad altos en Vite y Sharp | npm audit; explotación no probada |
| 2 | P2 | POST de notas con JSON null devuelve 500 | Confirmado contra Pages local |
| 3 | P2 | Comprobación de cuota e inserción no atómicas | Código y reproducción simulada; no bypass en D1 local probado |
| 4 | P2 | Inicio móvil atenuado tras cerrar una app en desarrollo | Confirmado en Vite/StrictMode |
| 5 | P2 | Cortina del probador sin teclado ni valor ARIA | Confirmado |
| 6 | P2 | El foco sale de Spotlight al Dock tapado | Confirmado |
| 7 | P2 | Canonical y otros metadatos quedan en la ruta anterior | Confirmado en navegación SPA |
| 8 | P2 | El generador oculta errores de tejidos | Confirmado con fixture aislado |
| 9 | P2 | La opción Vercel documentada no incluye la API/D1 | Incompatibilidad estructural; despliegue remoto no probado |
| 10 | P2 | Contraste y patrón ARIA del menú incorrectos | Resultados axe-core y revisión |
| 12 | P2 | Dock recortado y composición congestionada en tablet | Confirmado a 768 px |
| 13 | P2 | Libro móvil sin alternativa para pasar páginas con teclado | Confirmado a 390 px |
| 14 | P2 | Fotografías reemplazadas conservan URL con caché de 30 días | Rutas deterministas y cabecera HTTP verificadas |

## Diseño: qué conservar y qué mejorar

### 1. Portada con una jerarquía más clara

Conservaría el retrato, los grupos de fotografías, el papel y la firma. La captura de escritorio muestra una composición reconocible, pero fotografías pequeñas, seis iconos laterales y doce apps en el Dock compiten como puntos de entrada. Los iconos de Adobe son fichas de herramientas, mientras que los demás suelen navegar: visualmente esa diferencia no es evidente.

Propuesta: destacar uno o dos proyectos; hacer explícitos “Ver proyectos”, “CV” y “Contacto”; mover herramientas y elementos secundarios a una sección complementaria. Añadir una frase concreta sobre Ana y el tipo de oportunidades o colaboraciones que presenta el portfolio, usando información que ella confirme. No inventar disponibilidad o servicios.

### 2. Proyectos con lectura rápida y libro opcional

La portada del libro es visualmente cuidada, pero la ficha, el concepto y el resultado requieren pasar páginas. Propondría una vista inicial breve: imagen principal, resumen, rol, técnicas, año y galería de resultados. Mantener “Abrir libro” para quien quiera recorrer la narrativa editorial.

La alternativa de lectura tiene además una función práctica: evitar pérdida de contenido al reducir altura, ampliar texto o usar tecnología de asistencia. Si se mantiene el libro como vista principal, debe tener paginación adaptable y una opción “Leer en continuo”. No reducir indefinidamente la letra para hacerla caber.

### 3. Tablet con una composición propia

La captura de 768×1024 mantiene el escritorio y el Dock de doce apps; este sobresale 35,5 px por cada lado y los grupos de fotos se acercan a los iconos laterales.

Propuesta: definir el modo según espacio disponible y tipo de interacción. Reducir apps principales, usar una cuadrícula o pilas de proyectos y permitir desplazamiento natural. Ajustar también ventanas y paneles laterales; cambiar un único breakpoint no resuelve toda la composición.

### 4. Móvil: entrada directa y controles explícitos

La home móvil mantiene la identidad y reúne proyectos, CV y accesos útiles. Aun así, simula un sistema operativo con bloqueo, apps y navegación por gestos. Propondría que el bloqueo fuese opcional o prescindible y que el primer acceso mostrase directamente el trabajo.

Añadir “Anterior/Siguiente” al libro y una indicación breve de los gestos. Mantener acciones principales claramente nombradas; no exigir que se reconozca un icono de Finder, Notas o Contactos para entender el destino.

### 5. Tipografía, contraste y escalado

Conservar Bodoni para titulares, Inter para lectura y mono para detalles. Revisar peso y tamaño óptico de los grandes títulos: en las capturas los trazos finos son muy delicados, especialmente sobre la foto de fondo. Probar zoom y pantallas de menor resolución antes de fijar sus valores.

Para información necesaria propondría texto de lectura de 16–18 px y etiquetas de alrededor de 12–14 px, adaptados al contexto. Los folios decorativos pueden ser menores si no son la única vía de información. Corregir los contrastes medidos y probar estados de foco y tema oscuro.

### 6. CV con menos opciones iniciales

El CV ofrece cinco vistas: información, carta, trayectoria, etiqueta y terminal. En móvil, la barra ocupa varias filas y aparece una instrucción de arrastrar el PDF al Dock pese a estar dentro de una app móvil.

Propuesta: mostrar primero perfil, formación, experiencia y botón de descarga; dejar carta y trayectoria como opciones secundarias. Agrupar etiqueta y terminal como vistas creativas. Adaptar las instrucciones al dispositivo. Mantener la selección de idioma, pero revisar coherencia de idioma entre navegación general y CV.

### 7. Contacto con estados y acción fáciles de encontrar

En la captura móvil, el botón de envío queda por debajo del primer viewport (posición aproximada y=900 en una pantalla de 844 px); existe scroll, por lo que no está inaccesible.

Propuesta: equilibrar la altura del mensaje, hacer visible o fácilmente alcanzable el envío y comprobar el comportamiento con teclado virtual. Si se usa mailto, describir el resultado como “Abrir correo” o “Mensaje preparado”; reservar “Enviado” para una confirmación real. Mantener el texto del usuario ante un error y anunciar estados mediante una región accesible.

### 8. Movimiento al servicio del recorrido

Elegir unas pocas animaciones distintivas: apertura, costura o transición del proyecto. Reducir movimiento automático que no aporta información y ofrecer una preferencia de efectos sencilla.

Hay componentes que ya respetan movimiento reducido, como BootScreen y FocusWallpaper. La cobertura no es uniforme: animaciones imperativas de libros y otros elementos deben revisarse individualmente. MotionConfig no garantiza por sí solo que cada llamada a animate respete esa preferencia.

## Código: mejoras de estructura y mantenimiento

| Mejora | Cambio concreto | Beneficio y cautela |
|---|---|---|
| Componentes compartidos | Extraer tokens, tipografía, helpers de títulos y piezas visuales repetidas | Corregir una vez; mantener adaptadores separados para Framer y la web |
| CV modular | Separar datos e idiomas, vistas, descargas y animaciones de CVWindow | Facilita revisar un componente de unas 1.800 líneas |
| Rutas como fuente común | Generar navegación, buscador, prerender y metadatos desde una definición común | Evita títulos, enlaces y metadatos divergentes |
| Contenido validado | Validar frontmatter, tipos, fotos, URL, colores, slugs y referencias a telas | Errores claros antes del build; evitar catch vacíos |
| Estado e interacciones | Reducir eventos globales dentro del árbol React; tipar los necesarios con un contrato claro | Mantener eventos cuando la integración Framer realmente los necesita |
| Tipado progresivo | Sustituir any críticos y activar comprobaciones estrictas por módulos | Detectar entradas y estados imposibles sin convertirlo en una migración ciega |
| Error boundaries | Recuperación ante errores de render o carga de chunks | Mensaje útil, reintento y acceso a inicio/contacto |
| Caché y recursos | Hash de contenido en media y carga diferida de módulos por dispositivo | Evita fotos antiguas y descargas innecesarias |
| Tests de regresión | API, cuotas, libro, foco, rutas, metadata y tamaños límite | Proteger comportamiento; no duplicar cada detalle de implementación |
| Framer reproducible | Validación específica y proceso de generación/sincronización documentado | Las copias standalone pueden requerir generación, no imports directos |

En concreto, `useAgBodoni` y `typeset` están repetidos en numerosos archivos; el CV contiene datos propios en lugar de consumir todos los datos comunes. Son buenos primeros candidatos a extracción. El exportador de Framer debe proteger `proyecto.md` existente antes de reutilizarse; su ejecución actual puede sobrescribir ediciones locales.

## Rendimiento: lo medido y lo que cambiaría

La home, observada aproximadamente un segundo después de la carga con contextos de navegador nuevos, produjo:

| Tamaño | Respuestas capturadas | Cuerpos de recursos | Scripts capturados | Imágenes capturadas |
|---|---:|---:|---:|---:|
| Escritorio | 53 | ~1,45 MB | 12 (~575 KB) | 34 |
| Móvil | 28 | ~0,90 MB | 13 (~600 KB) | 8 |
| Tablet | 53 | ~1,44 MB | 12 (~575 KB) | 34 |

Son bytes de cuerpos leídos por Playwright, sin asumir el tamaño comprimido en red. No incluyen necesariamente recursos que terminen después de la ventana de observación y no prueban tiempos de carga reales.

`App.tsx` importa DesktopShell de forma estática y `prefetchWindows()` solicita todas las ventanas, también en móvil. Separaría la carga de los shells y precargaría destinos probables según interacción y conexión. Revisaría imágenes de miniaturas y fondo con un perfil de red móvil antes de añadir más efectos. Las fuentes locales, WebP y tamaños responsive ya son buenas decisiones y conviene conservarlas.

## Plan conjunto, con criterios de aceptación

### Primer bloque: corregir lo que rompe o pierde contenido

- Libro: cualquier texto de proyecto debe poder leerse completo a 1024×600, en móvil y con zoom; usar paginación adaptativa o lectura continua.
- Dependencias: revisar avisos, actualizar versiones compatibles y repetir build, tipos y recorridos principales.
- API: entradas inválidas deben devolver 400; las cuotas deben resistir solicitudes concurrentes con garantías documentadas.
- Generación: referencias inválidas deben producir diagnóstico y error de build, no una publicación incompleta silenciosa.

### Segundo bloque: navegación y accesibilidad

- Dock y ventanas deben caber en tablet y alturas pequeñas.
- Libro, slider, menús y controles principales deben funcionar con teclado y controles táctiles.
- Diálogos deben gestionar foco, fondo y retorno al activador.
- Corregir contrastes y nombres accesibles; validar modo oscuro, zoom y lectores de pantalla.
- Corregir StrictMode, metadatos SPA y versionado de fotos.

### Tercer bloque: mejorar presentación y mantenimiento

- Destacar trabajos y accesos claros en portada.
- Añadir lectura rápida de proyectos y simplificar CV/móvil.
- Centralizar rutas, datos, tokens y helpers; separar el CV en módulos.
- Reducir carga inicial móvil y movimiento automático innecesario.
- Incorporar pruebas de regresión y documentar una opción de despliegue que soporte las funciones ofrecidas.

Antes de publicar, revisar las 21 rutas, enlaces internos, imágenes/PDF, fallos de red y recorridos de proyecto→CV→contacto. Completar Safari/Firefox y pruebas en dispositivos reales cuando estén disponibles. Este informe propone trabajo; no afirma que esas correcciones ya estén implementadas.

## Detalles de los hallazgos 1–10


### 1. P1 — Dependencias con avisos de seguridad vigentes

Ubicación: `site/package.json:23`, `site/package.json:25`, `site/package-lock.json`.

El lockfile instala Sharp 0.33.5 y Vite 5.4.21. `npm audit` señala avisos de severidad alta para ambos, además de avisos moderados en otras dependencias. Sharp se usa al procesar imágenes durante la generación de contenido; Vite se usa como servidor de desarrollo. El sitio estático publicado no ejecuta estos dos paquetes como servidor.

Impacto: imágenes maliciosas pueden alcanzar bibliotecas nativas vulnerables durante el build; exponer un servidor Vite afectado puede poner archivos de desarrollo en riesgo. Parte de los avisos de Vite corresponde a Windows y no se aplica a esta máquina Linux. Los avisos de React Router sobre hidratación SSR tampoco demuestran explotación aquí, donde se usa BrowserRouter y createRoot.

Corrección: actualizar a versiones parcheadas compatibles, revisar los avisos enlazados en `npm-audit-site.json`, y repetir build, tipos y navegación. No aplicar `npm audit fix --force` sin revisar: su propuesta para gray-matter incluye un downgrade mayor y las demás actualizaciones pueden requerir migración.

Evidencia: auditoría de npm; no se intentó explotar las vulnerabilidades.

### 2. P2 — JSON `null` provoca HTTP 500 en la API pública

Ubicación: `functions/api/notas.js:45` y `:49`.

`request.json()` acepta `null`; la siguiente lectura de `body.web` lanza una excepción. Una petición POST con cuerpo `null` devuelve 500 en Cloudflare Pages local en lugar de un error de entrada 400.

Corrección: comprobar que el cuerpo es un objeto no nulo y no un array; validar tipos y tamaños antes de acceder a sus campos. Mantener respuestas de error JSON consistentes.

Reproducción: enviar `Content-Type: application/json` y cuerpo `null` a `/api/notas` del servidor local. Resultado observado: 500.

### 3. P2 — El límite de notas no se comprueba e inserta de forma atómica

Ubicación: `functions/api/notas.js:58` a `:62`.

Las consultas de recuento y última nota están separadas del INSERT. Varias solicitudes que leen el mismo estado anterior pueden superar tanto las cinco notas diarias como los 30 segundos entre notas. La ejecución en varias instancias no comparte un bloqueo JavaScript.

Corrección: realizar comprobación e inserción mediante una operación SQL atómica compatible con D1, o centralizar la cuota con garantías de exclusión; devolver 429 cuando no se inserte.

Evidencia y límite: una reproducción controlada con una base simulada y 12 solicitudes simultáneas aceptó las 12 (201). La prueba de 8 solicitudes contra D1 local devolvió un 201 y siete 429. El defecto estructural está identificado; no se afirma haber reproducido un bypass en producción ni en esa prueba local real.

### 4. P2 — El inicio móvil queda atenuado al cerrar una app en desarrollo

Ubicación: `site/src/phone/PhoneApp.tsx:59`; `site/src/phone/PhoneShell.tsx:21`.

El efecto de montaje incrementa `openN` con `onHome(true)` sin una limpieza simétrica. StrictMode ejecuta el efecto dos veces en desarrollo y el cierre decrementa una sola vez. La pantalla de inicio queda con opacidad 0,4 y escala 1,08 aun cuando ya no hay app abierta.

Corrección: equilibrar montaje y limpieza, o derivar el estado visual de la presencia de la ruta en vez de mantener un contador susceptible de desajustes. Revisar también los cambios entre los shells al redimensionar.

Evidencia: abrir Contacto y volver a Inicio en Vite deja `opacity: 0.4`; en el build de producción se recupera `opacity: 1`. Reproducción: `interactions.mjs`.

### 5. P2 — La cortina del probador no funciona con teclado

Ubicación: `site/src/pages/project/Probador.tsx:164`.

El control declara `role="slider"` y recibe foco, pero no implementa teclas de dirección/Home/End ni declara `aria-valuenow`. Una persona que usa teclado no puede cambiar la comparación entre capas.

Corrección: preferir un input range nativo o implementar el patrón completo de slider, sincronizando valor anunciado y posición visual.

Evidencia: foco y ArrowRight no cambian la posición; `aria-valuenow` es nulo. axe-core también detecta el atributo obligatorio ausente.

### 6. P2 — Spotlight permite que el foco salga al contenido tapado

Ubicación: `site/src/components/Spotlight.tsx:160`.

Al abrir el diálogo se enfoca el buscador, pero no se limita el foco al diálogo ni se vuelve inerte el fondo. Pulsar Shift+Tab pasa al enlace Papelera del Dock mientras el buscador permanece abierto.

Corrección: implementar gestión modal de foco, desactivar el fondo durante la apertura y restaurar el foco al activador al cerrar. Añadir aria-modal solo después de garantizar ese comportamiento. Revisar el mismo patrón en los visores y en las apps móviles.

Evidencia: `focus.mjs`, `insideDialog: false` después de Shift+Tab.

### 7. P2 — Los metadatos de la ruta anterior sobreviven a la navegación SPA

Ubicación: `site/src/App.tsx:30`; `site/scripts/prerender.mjs:108`.

El efecto de ruta actualiza únicamente document.title. Canonical, descripción, Open Graph y JSON-LD permanecen asociados al HTML de entrada. Entrar en `/` y navegar a `/about` conserva el canonical de la portada.

Corrección: mantener los metadatos de cada ruta sincronizados durante la navegación, reutilizando una fuente común con el prerender.

Evidencia: URL `/about`, título `Sobre mí — Ana Gil`, canonical `https://anagil.pages.dev/`. La carga directa de páginas prerenderizadas sí tiene sus metadatos propios; el fallo observado corresponde a navegación SPA.

### 8. P2 — La generación de tejidos oculta errores y puede publicar contenido incompleto

Ubicación: `site/scripts/build-content.mjs:156` a `:162`.

Un catch vacío cubre la lectura YAML y todo el procesamiento de imágenes del muestrario. Un YAML inválido, un archivo ausente o un fallo de Sharp dejan el muestrario vacío o parcial mientras el comando termina correctamente. `Tejidos.tsx` devuelve null si no queda ninguna tela.

Corrección: distinguir ausencia opcional de contenido de contenido presente pero inválido; los errores de lectura, esquema o imagen deben producir una explicación y un exit distinto de cero.

Evidencia: fixture aislado en `content-fixture/` con una tela que referencia `sistema/no-existe.jpg`; el script termina con exit 0 y cero imágenes. No se tocó el contenido del repositorio.

### 9. P2 — El despliegue recomendado en Vercel no incluye el backend del libro de visitas

Ubicación: `PUBLICAR.md:7`; `site/vercel.json`; `functions/api/notas.js:34`.

La guía recomienda desplegar `site/` en Vercel, pero el único backend de notas está fuera de esa raíz, usa el formato de Cloudflare Pages Functions y requiere un binding D1. El cliente siempre solicita `/api/notas`. La configuración Vercel presente no incorpora una adaptación de esa API ni una base de datos equivalente.

Corrección: documentar Cloudflare Pages como opción necesaria para este backend, o implementar y probar un backend compatible con Vercel antes de ofrecer allí la funcionalidad. Mostrar explícitamente cuándo el libro no está disponible.

Evidencia: incompatibilidad estructural de archivos, runtime y binding. No se creó un despliegue de Vercel ni se comprobó uno existente.

### 10. P2 — Contraste insuficiente y semántica incorrecta del menú

Ubicación: `site/src/shell/Window.tsx:16`, `site/src/pages/ContactPage.tsx:17`, `site/src/components/MacMenuBar.tsx:295`.

axe-core detecta contraste de 4,15:1 para etiquetas de Contacto (gris #7C7973 sobre #FBFAF7), inferior a 4,5:1 para ese texto pequeño. La barra declara menubar pero contiene enlaces y botones sin el patrón de roles y navegación correspondiente. También aparecen nombres accesibles que no contienen la etiqueta visible en iconos y archivos.

Corrección: ajustar colores por pareja de fondo/texto; usar navegación HTML normal si no se implementa el patrón completo de menubar; hacer que el nombre accesible incluya la etiqueta visible. Revisar también los estados de tema oscuro.

Evidencia: `accessibility-results.json` contiene nodos, selectores y ratios por ruta. Los resultados automáticos necesitan revisión contextual y no certifican conformidad WCAG del sitio entero.

## Detalles de los hallazgos nuevos

### 11. P1 — El libro oculta parte del texto en ventanas de poca altura

Ubicación: `site/src/pages/project/pages.tsx:63`, `:157`, `:178`; `site/src/pages/project/ProjectBook.tsx:74`.

Cada página usa dimensiones fijas en relación con el espacio disponible y `overflow: hidden`. Los párrafos no se paginan según su altura real ni tienen una alternativa de scroll. Al abrir ASH ARCHIVE a 1024×600 y avanzar a las páginas 4–5, el bloque de Concepto termina aproximadamente en y=689 mientras su página termina en y=453. La lectura visible se interrumpe antes de completar el texto. También se midió otro bloque técnico fuera de su página.

Impacto: el visitante pierde contenido existente del proyecto; el problema puede aparecer al usar una ventana baja o aumentar el tamaño de lectura. No es solo una cuestión de preferencia estética.

Corrección: dividir texto según capacidad real, ofrecer lectura continua o permitir desplazamiento accesible dentro de páginas de texto. Revisar fotos, ficha y folios para evitar superposiciones. No resolverlo haciendo la letra cada vez más pequeña.

Evidencia: `deep-results.json`, `deep-check.mjs` y [captura del texto recortado](/workspace/audit-results/screenshots/short-book-text.png). En la comprobación adicional de móvil 390×844 el Concepto medido sí cabía: no se afirma que todas las pantallas sufran el mismo recorte.

### 12. P2 — El Dock queda fuera de la pantalla en tablet

Ubicación: `site/src/App.tsx:9`; `site/src/components/MacDock.tsx:230`, `:373`; `site/src/shell/DesktopShell.tsx:70`.

A 768 px App mantiene el shell de escritorio; el Dock tampoco usa su lista reducida porque su breakpoint es 600 px. La composición resultante mide unos 839 px: izquierda -35,5 y derecha 803,5. Finder y Papelera quedan parcialmente fuera del viewport y los grupos de fotos compiten con accesos laterales.

Corrección: definir una composición adaptable para anchuras intermedias, reducir o reordenar accesos y calcular tamaños según espacio disponible. Permitir overflow controlado solo cuando resulte intencionado y accesible.

Evidencia: `extended-results.json` y [captura tablet](/workspace/audit-results/screenshots/tablet-home.png). El Dock sí cabía en los tamaños de escritorio 1440 px y móvil 390 px probados.

### 13. P2 — El libro móvil depende de acciones con puntero para pasar página

Ubicación: `site/src/phone/PhoneProjects.tsx:149`, `:156`.

PhoneBook usa toques y arrastres, pero no ofrece botones anterior/siguiente ni un manejador de teclado equivalente al del libro de escritorio. Al enviar ArrowRight y PageDown a la página móvil, el contador permaneció en “PORTADA · 1 / 16”. Las páginas sucesivas no tienen una navegación explícita accesible equivalente.

Corrección: incluir botones accesibles de anterior/siguiente, teclado cuando proceda y anunciar cambio de página de forma moderada. Mantener gestos como una opción adicional. Revisar el foco de enlaces situados en hojas ocultas y ofrecer lectura continua.

Evidencia: `deep-results.json`, `deep-check.mjs` y [captura del libro móvil](/workspace/audit-results/screenshots/phone-projects-ash-archive.png). Los toques sí cambian páginas en la comprobación adicional; el problema es la falta de alternativa de entrada.

### 14. P2 — La caché puede conservar fotografías antiguas después de reemplazarlas

Ubicación: `site/scripts/build-content.mjs:34`; `site/public/_headers:5`; `site/vercel.json`.

Las imágenes se generan con nombres como `/media/ash-archive/01-480.webp`, sin versión ni hash de contenido. Reemplazar `01.jpg` y reconstruir no cambia la URL. La respuesta local confirmó `Cache-Control: public, max-age=2592000`, equivalente a 30 días. Durante la frescura de caché, un navegador puede reutilizar la imagen anterior sin consultar su ETag.

Esto afecta al flujo documentado de reemplazar fotografías manteniendo sus nombres. No se ha realizado un experimento de publicación en un CDN ni se ha afirmado que todos los visitantes vean contenido antiguo.

Corrección: generar nombres con hash de contenido y actualizar referencias, conservando caché larga para recursos versionados. Si no se versionan, usar una estrategia de revalidación apropiada y probar la actualización de fotos en una sesión con caché previa.

Evidencia: nombre de salida determinista en el generador y petición HEAD local con la cabecera anterior.

## Riesgos adicionales y límites de las conclusiones

- El contenido Markdown se interpreta como HTML sin sanitización y JSON-LD se incrusta sin proteger secuencias de cierre de script. Hoy el contenido procede de autores del repositorio; no se ha identificado una vía pública de XSS. Sanitización y validación de URLs son necesarias antes de aceptar aportaciones no confiables.
- `ContactPage.tsx:53–54` decide estado a partir de HTTP y JSON, pero resetea el formulario por `r.ok` aunque `success` sea false. Conviene unificar la condición de éxito y conservar el mensaje ante un rechazo. No se reprodujo esa respuesta contra Web3Forms remoto.
- La limpieza de arrastres manuales debe manejar cancelación y desmontaje, además de pointerup. Hay listeners temporales en WindowFrame y Probador cuya liberación se realiza principalmente al soltar el puntero. Revisar esta circunstancia con gestos cancelados y navegación durante un arrastre.
- Datos como bio, roles y proyectos del CV están distribuidos en código y contenido. No se identificó una discrepancia de año entre AMMAN en el CV y su frontmatter: ambos indican 2026. Centralizar reduce el riesgo de divergencias futuras.
- No hay una suite automatizada declarada ni CI de proyecto presente. Build y tipos no sustituyen las pruebas de comportamiento; los casos reproducidos son candidatos a regresiones.
- Las consultas de visitantes usan bind y las notas se renderizan como texto React. No se observó inyección SQL ni HTML en ese recorrido; eso no constituye una garantía de seguridad global.
- El recuento GET de notas está limitado a 200 resultados y la UI muestra el tamaño de esa lista. Si se desea presentar un total histórico, la API debe devolverlo por separado; no es necesariamente un defecto si el objetivo es mostrar solo las últimas notas.

## Evidencias disponibles

- [Auditoría npm de site](/workspace/audit-results/npm-audit-site.json) y [raíz](/workspace/audit-results/npm-audit-root.json).
- [Registro de compilación](/workspace/audit-results/build.log).
- [Resultados de 42 cargas](/workspace/audit-results/browser-results.json).
- [Resultados de accesibilidad](/workspace/audit-results/accessibility-results.json).
- [Resultados visuales](/workspace/audit-results/visual-results.json).
- [Pruebas de texto y teclado](/workspace/audit-results/deep-results.json).
- [Dock, recursos y contacto móvil](/workspace/audit-results/extended-results.json).
- Scripts de reproducción en `/workspace/audit-results/`: `browser-check.mjs`, `interactions.mjs`, `focus.mjs`, `accessibility.mjs`, `visual-check.mjs`, `deep-check.mjs`, `extended-check.mjs`.

Capturas de referencia: [portada escritorio](/workspace/audit-results/screenshots/desktop-home.png), [índice](/workspace/audit-results/screenshots/desktop-projects.png), [sobre mí](/workspace/audit-results/screenshots/desktop-about.png), [CV móvil](/workspace/audit-results/screenshots/phone-cv.png), [contacto móvil](/workspace/audit-results/screenshots/phone-contact.png).

El estado del repositorio sigue limpio al terminar. Los hallazgos están pendientes de corrección; este documento no modifica ni publica la aplicación.
