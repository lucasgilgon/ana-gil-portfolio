# Ana Gil Gonzalez — Portfolio

Portfolio personal de diseñadora de moda, construido en **Framer** con enfoque editorial, conceptual y accesible.

---

## 🎯 Visión

Un sitio que funcione como **directorio creativo**: lista refinada de proyectos, tipografía como protagonista, estética minimalista y contemporánea. Inspirado en la sensibilidad editorial de Ana, cada proyecto cuenta una historia compleja sobre trauma, resilencia y transformación.

**Identidad visual:**
- Fondo blanco/crema puro
- Tipografía serif para títulos (enormous), sans-serif para body
- Paleta restringida: blanco, negro, verde foresta, ocre/terracota
- Mucho espacio en blanco, composiciones asimétricas
- Hover interactions suaves, sin exceso

---

## 📋 Estructura del sitio

```
Home (/)
  └─ Hero: nombre, rol, frase de posicionamiento
  └─ Index de proyectos: lista con preview flotante en hover

Projects Index (/projects)
  └─ Vista completa de todos los proyectos (para SEO y navegación)

Project Detail (/projects/[slug])
  └─ Plantilla CMS reutilizable
  └─ Hero + galería + contexto + navegación siguiente/anterior

About (/about)
  └─ Bio, especialidades, servicios, CV

Contact (/contact)
  └─ Email destacado, enlaces sociales, formulario simple
```

---

## 🗂️ Contenido en Framer CMS

### Colección: Projects
Campos:
- **title** (Text): Nombre del proyecto
- **slug** (Slug): URL amigable
- **category** (Select): Moda, Editorial, Dirección de arte, Otro
- **year** (Number): Año de realización
- **description_short** (Text): Frase corta para el index
- **description_long** (Rich Text): Contexto conceptual completo
- **client_or_context** (Text): Contexto del proyecto
- **role** (Text): Tu rol en el proyecto
- **featured_image** (Asset): Imagen para preview
- **gallery** (Assets): Galería de fotos/sketches
- **external_link** (URL): Link a más detalles si existe
- **order** (Number): Orden de aparición

---

## 🎨 Sistema de diseño

### Colores
```
Primary Colors:
- Blanco: #FFFFFF
- Negro: #1A1A1A
- Gris claro: #F5F5F5
- Gris oscuro: #555555

Accent Colors:
- Verde foresta: #2D5A4A
- Ocre/Terracota: #C4876B
```

### Tipografía
```
Títulos (Serif, +56px, 700)
  → Google Fonts: Prata o EB Garamond

Body (Sans-serif, 16px, 400)
  → Google Fonts: Inter o Grotesk

Labels/Monospaced (para detalles técnicos)
  → Google Fonts: IBM Plex Mono o JetBrains Mono
```

### Espaciado (Escala modular)
```
xs: 4px
sm: 8px
md: 16px
lg: 32px
xl: 64px
xxl: 128px
```

---

## 🔧 Proyectos iniciales (CMS)

**1. 404:NOT FOUND_**
- Categoría: Editorial
- Año: 2025
- Descripción: Libro editorial que materializa el trauma del abandono familiar como un fallo de sistema digital.

**2. ASH ARCHIVE**
- Categoría: Moda
- Año: 2025/26
- Descripción: Colección de moda que explora la resiliencia tras la pérdida, usando encaje como agente destructor y constructor.

**3. FRAGMENTOS DE MÍ**
- Categoría: Dirección de arte
- Año: 2025
- Descripción: Kit de herramientas táctiles para conectar con pacientes de Alzheimer, usando símbolos y memoria sensorial.

**4. EX_CORPO**
- Categoría: Moda
- Año: 2025
- Descripción: Conjunto que articula la tensión entre protección y vulnerabilidad, el silencio que carga y la espalda que se abre.

---

## 🚀 Componentes a crear en Framer

- **Button** (primario, secundario, estados: hover, active)
- **ProjectCard** (número, título, categoría, año, preview flotante)
- **ProjectPreview** (imagen flotante que sigue el cursor en hover)
- **Navigation** (sticky header, responsive)
- **CategoryTag** (badge con estilos)
- **Footer** (nombre, año, redes, copyright)
- **HeroSection** (título enorme, rol, subtítulo)
- **ProjectGallery** (con scroll animations)

---

## 🎬 Animaciones & Interacciones

- **Entrada hero**: fade + desplazamiento vertical con stagger
- **Hover en proyectos**: cambio de color, desplazamiento sutil, preview flotante
- **Scroll animations**: fade-in, parallax suave, reveal de texto
- **Page transitions**: transición suave entre índice y detalle
- **Sticky nav**: oculta al bajar, reaparece al subir (opcional)

---

## 📱 Responsive Breakpoints

```
Desktop: 1200px+
Tablet: 768px - 1199px
Mobile: < 768px

Cambios principales:
- Tamaño tipográfico: usar clamp() para fluidez
- Grid: 2 columnas en tablet, 1 en móvil
- Preview flotante: tarjeta visible en móvil, no flotante
- Navegación: menú hamburguesa en móvil
```

---

## ✅ Checklist antes de publicar

### SEO & Performance
- [ ] Títulos y meta descriptions para cada página
- [ ] Open Graph images configuradas
- [ ] URLs limpias y semánticas
- [ ] Imágenes optimizadas (lazy loading)
- [ ] Fuentes limitadas (máx. 2-3 familias)
- [ ] Favicon y manifest.json
- [ ] Robots.txt y sitemap

### Accesibilidad
- [ ] Contraste suficiente (WCAG AA, min 4.5:1)
- [ ] Navegación por teclado funcional
- [ ] Focus visible en todos los elementos interactivos
- [ ] Textos alternativos en imágenes
- [ ] Respeto por `prefers-reduced-motion`
- [ ] Estructura semántica (h1, h2, nav, main, footer)

### Navegación & UX
- [ ] Links internos funcionales
- [ ] Breadcrumbs o contexto claro en proyecto detail
- [ ] Navegación "siguiente/anterior" en projects
- [ ] Footer con enlaces importantes
- [ ] Formulario de contacto validado

### Testing
- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Tablet (iPad, Android)
- [ ] Mobile (iPhone, Android)
- [ ] Velocidad de carga (PageSpeed Insights > 80)
- [ ] Links internos y externos

---

## 📚 Documentación adicional

Ver carpeta `/docs` para:
- **DESIGN_SYSTEM.md** — Variables, componentes, patrones
- **CMS_GUIDE.md** — Cómo agregar/editar proyectos
- **FRAMER_SETUP.md** — Paso a paso de la construcción

---

## 👤 Autor

**Ana Gil Gonzalez**
- Estudiante de 2º Moda, ESD MADRID
- Diseñadora con enfoque conceptual y narrativo
- Especialidades: Moda, dirección de arte, diseño editorial

---

## 📄 Licencia

Todos los proyectos y contenido son propiedad intelectual de Ana Gil Gonzalez. © 2025.

---

**Última actualización:** Octubre 2025
