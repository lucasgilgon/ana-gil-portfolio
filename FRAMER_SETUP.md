# Framer Setup — Guía completa

Este documento describe paso a paso cómo construir el portfolio de Ana en Framer.

---

## Fase 1: Sistema de diseño y variables

### 1.1 Crear variables globales

En **Project Settings > Tokens**:

**Colors:**
```
colors/white: #FFFFFF
colors/black: #1A1A1A
colors/gray-light: #F5F5F5
colors/gray-dark: #555555
colors/green-forest: #2D5A4A
colors/terra: #C4876B
colors/accent: colors/green-forest (por defecto)
colors/text: colors/black
colors/bg: colors/white
colors/border: colors/gray-light
```

**Typography:**
```
fonts/title: "Prata" (serif, Google Fonts)
fonts/body: "Inter" (sans-serif, Google Fonts)
fonts/mono: "IBM Plex Mono" (monospace, Google Fonts)

sizes/h1: 56px (desktop), 48px (tablet), 32px (mobile)
sizes/h2: 40px (desktop), 32px (tablet), 28px (mobile)
sizes/h3: 32px (desktop), 28px (tablet), 24px (mobile)
sizes/body: 16px
sizes/label: 12px (uppercase, letter-spacing: 0.5px)

weights/regular: 400
weights/medium: 500
weights/bold: 700
```

**Spacing:**
```
space/xs: 4px
space/sm: 8px
space/md: 16px
space/lg: 32px
space/xl: 64px
space/xxl: 128px
```

**Radii:**
```
radii/none: 0px
radii/sm: 2px
radii/md: 4px
radii/lg: 8px
```

---

## Fase 2: Crear páginas

### 2.1 Home (`/`)

**Estructura:**
```
Frame: "Home"
├─ HeroSection
│  ├─ Title: "Ana Gil Gonzalez" (h1, serif, verde acento en palabra clave)
│  ├─ Subtitle: "Diseñadora de moda & Narrador visual"
│  ├─ Description: "El cuerpo como documento. La tela como archivo."
│  └─ ScrollIndicator (animated chevron down)
└─ ProjectsIndex
   ├─ ProjectCard × 4 (380:NOT FOUND, ASH ARCHIVE, FRAGMENTOS DE MÍ, EX_CORPO)
```

**Altura hero:** 100vh
**Altura projects index:** auto, lista scrolleable

### 2.2 Projects Index (`/projects`)

**Estructura:**
```
Frame: "Projects Index"
├─ PageHeader
│  ├─ Title: "Proyectos"
│  └─ Description: "Una selección de trabajos conceptuales sobre trauma, resilencia y transformación."
└─ ProjectsList (Grid 1 columna)
   ├─ ProjectCard × N (con link a detail page)
```

### 2.3 Project Detail (`/projects/[slug]`)

**Estructura:**
```
Frame: "Project Detail" (template with CMS binding)
├─ ProjectHero
│  ├─ Breadcrumb: "Proyectos > [Title]"
│  ├─ Title: {{ title }} (h1)
│  ├─ Category + Year: {{ category }} · {{ year }}
│  ├─ Description: {{ description_short }} (tagline)
│  └─ FeaturedImage: {{ featured_image }}
├─ ProjectContent
│  ├─ Section: Contexto
│  │  └─ RichText: {{ description_long }}
│  ├─ Section: Galería
│  │  └─ ImageGallery: {{ gallery }} (con scroll animation)
│  ├─ Section: Detalles
│  │  ├─ Field: "Cliente/Contexto"
│  │  ├─ Field: "Rol"
│  │  └─ Field: "Año"
│  └─ Section: Enlaces
│     └─ Button: "Ver más" (si {{ external_link }} existe)
└─ ProjectNavigation
   ├─ Button: "← Anterior"
   └─ Button: "Siguiente →"
   └─ Button: "Volver a proyectos"
```

### 2.4 About (`/about`)

**Estructura:**
```
Frame: "About"
├─ PageHeader
│  ├─ Title: "Sobre mí"
├─ AboutContent
│  ├─ Bio (rich text, 2 párrafos)
│  ├─ Image: Retrato (placeholder)
│  ├─ Section: Especialidades
│  │  └─ List: Moda, dirección de arte, diseño editorial, investigación, confección
│  ├─ Section: Educación
│  │  └─ Item: "2º Moda, ESD MADRID"
│  └─ Section: Servicios
│     └─ List: Consultoría conceptual, development de colecciones, art direction, etc.
```

### 2.5 Contact (`/contact`)

**Estructura:**
```
Frame: "Contact"
├─ PageHeader
│  ├─ Title: "Hablemos"
├─ ContactContent
│  ├─ ContactForm
│  │  ├─ Field: "Nombre"
│  │  ├─ Field: "Email"
│  │  ├─ Field: "Asunto"
│  │  ├─ Field: "Mensaje"
│  │  └─ Button: "Enviar"
│  ├─ ContactInfo
│  │  ├─ Email: ana.gil@example.com (reemplazar)
│  │  ├─ LinkedIn: [link]
│  │  └─ Instagram: @anagil_design (reemplazar)
```

---

## Fase 3: Crear componentes reutilizables

### 3.1 Navigation

**Componente: MainNav**
```
Frame: "MainNav"
├─ Logo: "AG" (clickable → home)
├─ NavLinks (flex horizontal)
│  ├─ Link: "Proyectos" → /projects
│  ├─ Link: "Sobre" → /about
│  ├─ Link: "Contacto" → /contact
└─ MobileMenu (hidden en desktop, visible en mobile)
   └─ HamburgerIcon (interactivo)

States:
- Default (bg: white, text: black)
- OnScroll (bg: white, shadow suave, sticky)
- Hover (text color → acento)
```

### 3.2 ProjectCard

**Componente: ProjectCard (para Index)**
```
Frame: "ProjectCard" (reutilizable)
├─ Number: "01" (label, monospace, small)
├─ Title: {{ title }} (h2)
├─ Meta: {{ category }} · {{ year }} (label gris)
├─ Description: {{ description_short }} (body, gris oscuro)
├─ Arrow: "→" (monospace)
└─ PreviewImage (hidden, se mostrará on hover)

Interactive:
- Hover:
  - Title color → acento
  - PreviewImage aparece (floating, cursor tracking)
  - Bg levemente gris
```

### 3.3 ProjectPreview (Floating Image)

**Componente: FloatingPreview**
```
Frame: "FloatingPreview"
├─ Image: {{ featured_image }} (200×300px aprox)
├─ Shadow: suave (blur 16px, offset 4px)

Interactivo:
- Follow cursor: x, y basado en mouse position
- Fade in/out on project hover
```

### 3.4 Button

**Componente: Button (primary & secondary)**
```
Frame: "Button"
├─ Label: "Text" (body, medium)

Variants:
- Type: primary (bg: acento, text: white) | secondary (bg: transparent, border: acento)
- Size: sm (12px) | md (16px) | lg (20px)
- State: default | hover (opacity, scale) | active (darker)
```

### 3.5 CategoryTag

**Componente: CategoryTag**
```
Frame: "CategoryTag"
├─ Label: {{ category }}

Variants:
- Moda: bg-terra
- Editorial: bg-gray-dark
- Dirección de arte: bg-green-forest
- Otro: bg-gray-light
```

### 3.6 Footer

**Componente: MainFooter**
```
Frame: "MainFooter"
├─ Left Column
│  ├─ Name: "Ana Gil Gonzalez"
│  └─ Year: "2025"
├─ Right Column
│  ├─ Links: LinkedIn, Instagram, Email
│  └─ Copyright: "© 2025. Todos los derechos reservados."
```

---

## Fase 4: Configurar CMS

### 4.1 Crear colección "Projects"

En **CMS > Collections**, crear:

**Nombre:** Projects
**Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | Text | Yes | Ej: "ASH ARCHIVE" |
| slug | Slug | Yes | Auto-generated from title |
| category | Select | Yes | Options: Moda, Editorial, Dirección de arte, Otro |
| year | Number | Yes | Ej: 2025 |
| description_short | Text | Yes | Máx 150 chars |
| description_long | Rich Text | Yes | Contexto conceptual completo |
| client_or_context | Text | No | Ej: "ESD MADRID, 2º Moda" |
| role | Text | No | Ej: "Diseñadora & Investigadora" |
| featured_image | Asset (Image) | Yes | 1200×800px recomendado |
| gallery | Assets (Images) | Yes | Multiple, min. 3 |
| external_link | URL | No | Link a más info si existe |
| order | Number | Yes | 1, 2, 3, 4... (para ordenar) |

---

## Fase 5: Animaciones y Scroll Effects

### 5.1 Hero entrance

```
Title + Subtitle:
- Opacity: 0 → 1
- Y: 20px → 0
- Duration: 800ms
- Delay (stagger): 0ms, 100ms, 200ms
- Easing: ease-out
```

### 5.2 Proyecto index fade-in

```
ProjectCard (cada uno):
- Opacity: 0 → 1
- Y: 10px → 0
- Duration: 600ms
- Trigger: on scroll into view
- Easing: ease-out
```

### 5.3 Project gallery scroll animation

```
Image (in gallery):
- On scroll: parallax (y: 0%, 5%)
- Fade in/out at viewport edges
```

### 5.4 Hover effects

```
ProjectCard on hover:
- Title color → verde foresta (200ms ease)
- PreviewImage opacity: 0 → 1 (300ms ease)
- PreviewImage scale: 0.95 → 1 (300ms ease)
```

---

## Fase 6: Responsive Design

### 6.1 Breakpoints

```
Desktop: 1200px+
Tablet: 768px - 1199px
Mobile: < 768px
```

### 6.2 Cambios por breakpoint

**Typography:**
- h1: clamp(32px, 6vw, 56px)
- h2: clamp(28px, 4vw, 40px)
- body: 16px (sin cambiar)

**Layout:**
- Hero height: 100vh (desktop/tablet) → auto (mobile)
- ProjectCard: grid-cols-1 (always single column)
- Navigation: full (desktop) → hamburger (mobile < 768px)
- Spacing: lg/xl (desktop) → md (mobile)

**Images:**
- Featured image: 100% width en mobile
- Gallery: 1 columna (mobile) → 2 columnas (tablet) → 3 columnas (desktop)

---

## Fase 7: SEO & Performance

### 7.1 Meta tags

Para cada página, definir en Framer Settings:

```
Home:
- Title: "Ana Gil Gonzalez — Diseñadora de moda"
- Description: "Portfolio de diseño editorial y moda conceptual. Proyectos sobre trauma, resilencia y transformación."
- OG Image: hero-image.jpg

Projects Index:
- Title: "Proyectos — Ana Gil"
- Description: "Colección completa de proyectos: moda, dirección de arte, diseño editorial."

Project Detail:
- Title: "[Project Title] — Ana Gil"
- Description: "{{ description_short }}"
- OG Image: {{ featured_image }}
```

### 7.2 Optimizaciones

- **Imágenes:** Comprimir con TinyPNG/ImageOptim antes de subir
- **Fuentes:** Limitar a 2 familias (serif + sans-serif)
- **Lazy loading:** Activar en Framer (auto para imágenes)
- **CSS:** Framer optimiza automáticamente
- **JS:** Evitar scripts innecesarios

---

## Fase 8: Accesibilidad

### 8.1 Checklist WCAG AA

- [ ] Contraste h1-h2 vs background ≥ 4.5:1
- [ ] Links underlined o distintos en color
- [ ] Focus outline visible (2px, acento color)
- [ ] Navegación por teclado (Tab → todos los links)
- [ ] Alt text en todas las imágenes
- [ ] Estructura semántica (H1 > H2 > H3)
- [ ] Skip link a main content (opcional pero recomendado)
- [ ] Form labels asociados a inputs

### 8.2 Framer specifics

```
- Image alt text: siempre llenar
- Button text claro (no solo iconos)
- Color contrast check: usar accesibilidad.com/contrast
- Animations: respetar prefers-reduced-motion
```

---

## Fase 9: Testing

### 9.1 Desktop browsers
- Chrome, Firefox, Safari (latest versions)
- Comprobar links internos y externos

### 9.2 Mobile testing
- iPhone (Safari), Android (Chrome)
- Touch interactions (buttons, forms)
- Responsive layout

### 9.3 Performance
- **PageSpeed Insights:** Target > 80 score
- **Lighthouse:** Performance > 90
- **Mobile:** LCP < 2.5s, CLS < 0.1

---

## Publicación

1. Asegurar que todas las páginas están completas
2. Revisar contenido: spelling, grammar, links
3. Probar en todos los devices
4. Framer > Publish to web
5. Configurar dominio personalizado (si aplica)
6. Activar SSL (automático en Framer)

---

## Mantenimiento futuro

### Agregar un proyecto nuevo:

1. Ve a **CMS > Projects > Add item**
2. Rellena todos los campos
3. Sube imágenes (featured + gallery)
4. Asigna un número de orden
5. Guarda y publica
6. El proyecto aparecerá automáticamente en Index y Detail pages

---

**Última actualización:** Octubre 2025
