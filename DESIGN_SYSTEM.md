# Design System — Ana Gil Portfolio

Sistema de diseño completo para el portfolio en Framer.

---

## 🎨 Paleta de colores

### Colores principales
```css
/* Neutrals */
--color-white: #FFFFFF
--color-bg: #FAFAFA (crema muy suave)
--color-gray-light: #F5F5F5
--color-gray-medium: #D0D0D0
--color-gray-dark: #555555
--color-black: #1A1A1A

/* Accents */
--color-accent-primary: #2D5A4A (verde foresta)
--color-accent-secondary: #C4876B (ocre/terracota)

/* Semantic */
--color-text: #1A1A1A
--color-text-muted: #555555
--color-border: #F5F5F5
--color-hover: #2D5A4A (change text/border to this on hover)
```

### Uso por elemento

| Elemento | Color | Notas |
|----------|-------|-------|
| Fondo | `--color-white` o `--color-bg` | Blanco puro o crema suave |
| Texto principal | `--color-black` | Todo el body text |
| Texto secundario | `--color-gray-dark` | Meta, labels, descripciones cortas |
| Enlaces | `--color-accent-primary` | Verde foresta, underline on hover |
| Títulos | `--color-black` | Por defecto, puede cambiar a acento on hover |
| Botones primarios | `--color-accent-primary` (bg) + `--color-white` (text) | |
| Botones secundarios | `--color-white` (bg) + `--color-accent-primary` (text/border) | |
| Bordes | `--color-border` | Líneas divisoras, separadores |
| Hover state | `--color-accent-primary` | Color que cambia on interaction |

---

## 🔤 Tipografía

### Familias

```
Titulos (Serif):
  Font: Prata (Google Fonts)
  Fallback: Georgia, serif
  Weight: 400 (regular)

Body (Sans-serif):
  Font: Inter (Google Fonts)
  Fallback: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
  Weight: 400 (regular), 500 (medium), 700 (bold)

Monospace (opcional, para detalles):
  Font: IBM Plex Mono (Google Fonts)
  Fallback: Courier New, monospace
  Weight: 400
```

### Escalas tipográficas

#### Desktop (1200px+)
```
H1: 56px, 700 weight, line-height 1.2
H2: 40px, 700 weight, line-height 1.3
H3: 32px, 700 weight, line-height 1.4
H4: 28px, 700 weight, line-height 1.4
H5: 24px, 700 weight, line-height 1.4
H6: 20px, 700 weight, line-height 1.5

Body: 16px, 400 weight, line-height 1.6
Body Strong: 16px, 700 weight, line-height 1.6
Small: 14px, 400 weight, line-height 1.5
Label: 12px, 500 weight, line-height 1.4, letter-spacing 0.5px
Caption: 12px, 400 weight, line-height 1.4
```

#### Tablet (768px - 1199px)
```
H1: 48px
H2: 32px
H3: 28px
H4: 24px
H5: 20px
H6: 18px
Body: 16px
Small: 14px
Label: 12px
```

#### Mobile (< 768px)
```
H1: clamp(32px, 8vw, 48px)
H2: clamp(28px, 6vw, 32px)
H3: clamp(24px, 5vw, 28px)
H4: 20px
H5: 18px
H6: 16px
Body: 16px
Small: 14px
Label: 12px
```

### Combinaciones recomendadas

**Hero section title:**
```
Font: Prata
Size: H1 (56px desktop)
Weight: 700
Color: --color-black (o acento en palabras clave)
Letter-spacing: -0.5px (para títulos grandes)
```

**Project card title:**
```
Font: Prata
Size: H2 (40px desktop)
Weight: 700
Color: --color-black
Hover: --color-accent-primary
```

**Project description (index):**
```
Font: Inter
Size: 16px
Weight: 400
Color: --color-gray-dark
Line-height: 1.6
```

**Project meta (category + year):**
```
Font: Inter
Size: 12px
Weight: 500
Color: --color-gray-dark
Letter-spacing: 0.5px
Uppercase
```

**Navigation links:**
```
Font: Inter
Size: 14px
Weight: 400
Color: --color-black
Hover: --color-accent-primary
Underline: on hover (text-decoration: underline)
```

---

## 📏 Espaciado

### Escala modular (4px base)

```css
--space-0: 0
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
--space-32: 128px
```

### Cómo aplicar

| Contexto | Medida | Notas |
|----------|--------|-------|
| Padding (botones) | `--space-3` (12px) | Vertical: 8px, Horizontal: 16px |
| Margin (paragrafos) | `--space-4` (16px) | Entre párrafos |
| Gap (flex/grid) | `--space-4` a `--space-8` | En listas, tarjetas |
| Padding (cards) | `--space-6` a `--space-8` | 24px - 32px |
| Margin (sections) | `--space-16` a `--space-32` | 64px - 128px vertical |
| Padding (hero) | `--space-32` (128px) | Top/bottom vertical |

---

## 🎛️ Componentes

### Button

**Dimensiones:**
```
Small: 32px height, 12px-16px padding horizontal, 12px font
Medium: 40px height, 16px-20px padding horizontal, 14px font (default)
Large: 48px height, 20px-24px padding horizontal, 16px font
```

**Variantes:**

Primary:
```
Background: --color-accent-primary
Text: --color-white
Border: none
Hover: opacity 0.9 + scale 1.02
Active: opacity 0.8
```

Secondary:
```
Background: --color-white
Text: --color-accent-primary
Border: 1px solid --color-accent-primary
Hover: background --color-gray-light
Active: background --color-gray-medium
```

Tertiary (link):
```
Background: transparent
Text: --color-accent-primary
Border: none
Text-decoration: underline on hover
Hover: text-decoration underline
```

### Project Card

```
Layout: vertical flex
Padding: --space-8 (32px)
Border-bottom: 1px solid --color-border
Gap: --space-3 (12px)

Elements:
1. Number: 12px, monospace, --color-gray-dark
2. Title: H2 (40px), --color-black
3. Meta: 12px, --color-gray-dark
4. Description: 16px, --color-gray-dark
5. Arrow: monospace, --color-gray-dark

Hover:
- Title color → --color-accent-primary
- Arrow becomes visible/changes color
- Preview image appears (floating)
- Slight background change (--color-bg)
```

### Navigation

```
Layout: horizontal flex, space-between
Height: 64px
Padding: --space-4 (16px) vertical, --space-8 (32px) horizontal
Border-bottom: 1px solid --color-border (optional)
Position: sticky on desktop

Desktop:
- Logo (16px, bold) left
- Links (14px, medium spacing) center-right
- Link spacing: --space-6 (24px)

Mobile:
- Logo left
- Hamburger icon right
- Menu modal (full screen or slide-in)
```

### Footer

```
Layout: horizontal flex, space-between
Padding: --space-16 (64px) vertical, --space-8 (32px) horizontal
Border-top: 1px solid --color-border
Background: --color-white

Mobile:
- Stack vertically
- Padding: --space-8
```

---

## 🎬 Animaciones

### Easing

```
Ease out (entrada): cubic-bezier(0.215, 0.61, 0.355, 1)
Ease in (salida): cubic-bezier(0.55, 0.055, 0.675, 0.19)
Ease in-out: cubic-bezier(0.645, 0.045, 0.355, 1)
Linear (para loop): linear
```

### Timings

```
Quick interactions (hover): 200ms
Standard interactions (fade): 300ms - 400ms
Entrance animations: 600ms - 800ms
Scroll animations: on viewport trigger (no fixed duration)
```

### Transiciones comunes

**Hover color change:**
```
transition: color 200ms ease-out
```

**Hover scale:**
```
transition: transform 200ms ease-out
transform: scale(1.02) on hover
```

**Fade in (scroll):**
```
opacity: 0 → 1
duration: 600ms
easing: ease-out
```

**Parallax (scroll):**
```
transform: translateY(0%, 5%)
trigger: scroll position
easing: linear
```

---

## 📱 Responsive Breakpoints

### Estructura

```css
/* Desktop First Approach */
Desktop: min-width 1200px
Tablet: min-width 768px and max-width 1199px
Mobile: max-width 767px
```

### Cambios por breakpoint

| Elemento | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Hero height | 100vh | 100vh | auto (min 70vh) |
| H1 size | 56px | 48px | clamp(32px, 8vw, 48px) |
| H2 size | 40px | 32px | clamp(28px, 6vw, 32px) |
| Padding (sections) | 128px | 64px | 32px |
| Gap (grid) | 32px | 24px | 16px |
| Navigation | sticky | sticky | hamburger |
| Grid columns | 2 | 2 | 1 |
| ProjectCard width | 100% (flex) | 100% | 100% |
| Image gallery | 3 cols | 2 cols | 1 col |

---

## ✅ Checklist de implementación

### Framer Setup
- [ ] Variables de color creadas y aplicadas
- [ ] Tipografía vinculada (Google Fonts importadas)
- [ ] Espaciado definido (token scale)
- [ ] Breakpoints configurados
- [ ] Componentes creados y reutilizables

### Componentes
- [ ] Button (todos los estados)
- [ ] ProjectCard (con preview)
- [ ] Navigation (desktop + mobile)
- [ ] Footer
- [ ] CategoryTag

### Pages
- [ ] Home con Hero + Index
- [ ] Projects Index
- [ ] Project Detail (template)
- [ ] About
- [ ] Contact

### CMS
- [ ] Colección Projects con todos los campos
- [ ] 4 proyectos iniciales agregados

### Testing
- [ ] Responsive en desktop, tablet, mobile
- [ ] Contraste de color (≥4.5:1)
- [ ] Links navegables
- [ ] Imágenes cargan correctamente
- [ ] Animaciones suaves

---

**Última actualización:** Octubre 2025
