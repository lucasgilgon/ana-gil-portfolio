# Próximos pasos — Completar el portfolio en Framer

¡Hemos creado la estructura completa! Ahora necesitas hacer algunos pasos finales en Framer visualmente. Esto te tomará ~2-3 horas.

---

## ✅ Ya completado (por el AI)

- ✅ Páginas creadas: Home, Projects, About, Contact
- ✅ CMS Collection "Projects" con todos los campos
- ✅ Componentes: Button, Navigation, Footer, ProjectCard
- ✅ Design tokens: colores, tipografía, estilos
- ✅ Contenido base en About y Contact
- ✅ Documentación completa (README, FRAMER_SETUP, DESIGN_SYSTEM, CMS_GUIDE)
- ✅ Repositorio GitHub inicializado

---

## 📝 Qué haces ahora en Framer

### Paso 1: Ir a tu proyecto Framer
Abre el proyecto `web-ana` en Framer.

### Paso 2: Aplicar design tokens a componentes

En **Components > Button**:
1. Selecciona el frame del botón
2. En **Fill**, aplica el token **green-forest**
3. En **Text**, selecciona el texto y aplica color token **white**
4. Añade **Hover effect**:
   - Opacity: 0.9
   - Scale: 1.02
   - Transition: 200ms ease-out
5. Crea variante `secondary`:
   - Duplica el botón (Shift + D)
   - Cambia Fill a **white** con border **1px solid green-forest**
   - Cambia Text color a **green-forest**

En **Components > Navigation**:
1. Selecciona el frame de nav
2. Aplica Fill: **white**, Border-bottom: **1px solid gray-light**
3. El logo "AG" debe ser **18px, Prata, bold, black**
4. Los links (cuando los agregues) serán **14px, Inter, black** con hover → **green-forest**

En **Components > ProjectCard**:
1. Aplica los text styles creados:
   - Número: **Label** style (12px mono)
   - Título: **H2** style
   - Meta: **Label** style
2. Añade hover effect:
   - Title color → **green-forest**
   - Duration: 200ms
3. *Opcional:* Añade PreviewImage flotante (frame escondido que aparece on hover)

En **Components > Footer**:
1. Aplica Fill: **white**, Border-top: **1px solid gray-light**
2. Text styles según labels

### Paso 3: Construir la Home visualmente

En la página **Home (/)**:

**Sección Hero** (el frame `heroSection` ya existe):
1. Establece altura mínima: **800px** (o más en desktop)
2. Asegúrate que tiene **layout: stack vertical, centered**
3. El título "Ana Gil Gonzalez" debe:
   - Aplicar text style **H1**
   - Tener fade-in animation (ya configurada)
   - Opcional: cambiar color a **green-forest** en primera palabra
4. Subtítulo y descripción ya tienen estilos aplicados

**Sección Projects Index**:
1. Arrastráe el componente **ProjectCard** 4 veces debajo del título de proyectos
2. Para cada uno, configura:
   - Número: 01, 02, 03, 04
   - Título: (será dinámico desde CMS después)
   - Meta: (será dinámico desde CMS después)
3. Agrupa todos en un **collection list** que repite sobre la colección CMS "Projects"
   - Frame > Collection list binding
   - Collection: "Projects"
   - Sorting: Order (ascending)
   - Limit: 10
   - Template: el ProjectCard que creaste

*Nota: El binding a CMS es visual en Framer. Si no sabes cómo hacerlo, déjalo como mockup por ahora.*

**Scroll indicator** (opcional):
- Frame pequeño con un chevron "↓"
- Posición: absolute bottom 32px
- Animación: loop de bounce (scale 1 → 1.05 → 1)
- Aparece en hero section

### Paso 4: Agregar Navigation y Footer a todas las páginas

1. Ve a **Components > Navigation**
2. Copia el componente
3. Ve a Home, arriba de todo
4. Pega (Cmd+V)
5. Posiciona en la parte superior
6. Repite para Projects, About, Contact

Lo mismo con **Footer** pero al final de cada página.

### Paso 5: Crear animaciones y hover effects

En cada **ProjectCard**:
1. Selecciona el frame de la tarjeta
2. **Hover effect**:
   - Title color: **green-forest** (200ms)
   - Slight background change: **gray-light** (200ms)
   - Scale: 1.02 (200ms)
3. *Opcional:* PreviewImage flotante:
   - Crea un frame escondido con imagen
   - On card hover → image appears con:
     - Opacity: 0 → 1 (300ms)
     - Scale: 0.95 → 1 (300ms)
     - Position: follow cursor (custom code o frame fijo)

En **Hero section**:
1. Selecciona título
2. **Appear effect** (ya debe estar):
   - Trigger: onMount
   - Enter: opacity 0 → 1, y: 20px → 0
   - Duration: 800ms
   - Easing: ease-out
3. Repite para subtítulo y descripción con delays: 0ms, 100ms, 200ms

### Paso 6: Responsive design

Para cada página/componente:

**Desktop (1200px+):**
- Padding: 64px-128px
- H1: 56px
- H2: 40px
- Grid: 2-3 columnas

**Tablet (768px-1199px):**
- Padding: 48px
- H1: 48px
- H2: 32px
- Grid: 2 columnas

**Mobile (<768px):**
- Padding: 32px
- H1: 32px (o clamp(32px, 8vw, 48px))
- H2: 28px
- Grid: 1 columna
- Navigation: hamburger menu (opcional)

**En Framer**:
- Usa el panel **Responsive** arriba a la derecha
- Selecciona breakpoint (Desktop/Tablet/Mobile)
- Ajusta tamaños y espaciado
- Repite para cada breakpoint

### Paso 7: SEO y Metadata

Para cada página, en **Page settings** (⚙️):

**Home:**
- Title: "Ana Gil Gonzalez — Diseñadora de moda"
- Description: "Portfolio de diseño editorial y moda conceptual. Proyectos sobre trauma, resilencia y transformación."
- Social image: (upload hero image)

**Projects:**
- Title: "Proyectos — Ana Gil"
- Description: "Colección completa de trabajos conceptuales: moda, dirección de arte, diseño editorial."

**About:**
- Title: "Sobre mí — Ana Gil"
- Description: "Estudiante de moda en ESD MADRID. Investigación conceptual sobre trauma y transformación."

**Contact:**
- Title: "Contacto — Ana Gil"
- Description: "Conecta conmigo para colaboraciones y consultoría conceptual."

### Paso 8: Agregar imágenes a CMS (opcional pero recomendado)

Ve a **CMS > Projects**:
1. Haz clic en "Add item"
2. Rellena todos los campos (ver **CMS_GUIDE.md**)
3. Sube imágenes:
   - featured_image: imagen principal (1200×800px)
   - gallery: mínimo 3 imágenes (1200×800px cada una)
4. Guarda y repite para los 4 proyectos

**Proyectos a agregar:**
- **404:NOT FOUND_** (categoría: Editorial, año: 2025, orden: 1)
- **ASH ARCHIVE** (categoría: Moda, año: 2025, orden: 2)
- **FRAGMENTOS DE MÍ** (categoría: Dirección de arte, año: 2025, orden: 3)
- **EX_CORPO** (categoría: Moda, año: 2025, orden: 4)

Ver **CMS_GUIDE.md** para descripciones completas.

### Paso 9: Crear página de detalle de proyecto

En **Pages**, crea una nueva página con path `/projects/:slug` (plantilla):

**Estructura:**
```
ProjectHero
├─ Breadcrumb: "Proyectos > [Title]"
├─ Title: {{ project.title }}
├─ Category + Year: {{ project.category }} · {{ project.year }}
├─ Description: {{ project.description_short }}
└─ FeaturedImage: {{ project.featured_image }}

ProjectContent
├─ Description: {{ project.description_long }} (rich text)
├─ Gallery: {{ project.gallery }} (collection list)
├─ Details:
│  ├─ Context: {{ project.client_or_context }}
│  ├─ Role: {{ project.role }}
│  └─ Year: {{ project.year }}
└─ Links: if {{ project.external_link }} → Button "Ver más"

Navigation
├─ Button: "← Anterior proyecto"
├─ Button: "Siguiente proyecto →"
└─ Button: "Volver a proyectos"
```

**Binding a CMS:**
- Selecciona los frames de contenido
- En **Inspector > CMS**, vincula cada elemento a la variable correspondiente
- Las imágenes usan `featured_image` (hero) y `gallery` (collection list)

### Paso 10: Testing y refinamiento

**Checklist final:**

- [ ] Todas las páginas cargan correctamente
- [ ] Links internos funcionan (Home → Projects → Detalle → Volver)
- [ ] Responsive funciona en mobile (usar Preview o Chrome DevTools)
- [ ] Animaciones son suaves (no lag)
- [ ] Contraste de colores es suficiente (≥4.5:1)
- [ ] Navegación es clara y accesible
- [ ] SEO metadata completo en cada página
- [ ] Imágenes cargan rápido (comprimir si necesario)
- [ ] Formulario de contacto funciona (si lo agregaste)

---

## 🔗 Enlaces útiles

- **Framer Docs:** https://www.framer.com/docs
- **Component instances:** https://www.framer.com/docs/components
- **CMS guide:** https://www.framer.com/docs/cms
- **Animations:** https://www.framer.com/docs/animation
- **Responsive design:** https://www.framer.com/docs/responsive

---

## 📲 Publicar

Cuando todo esté listo:

1. En Framer, haz clic en **Share** (arriba a la derecha)
2. Selecciona **Publish to web**
3. Elige un dominio (framer.com/... o personalizado)
4. Copia el link y comparte

---

## 💡 Tips finales

- **Guarda frecuentemente** (Cmd+S)
- **Usa componentes reutilizables** para mantener consistencia
- **Prueba en móvil** durante el proceso (Preview mode)
- **No tengas miedo de iterar** — Framer permite cambios rápidos
- **Los colores pueden cambiar en cualquier momento** — los tokens hacen esto fácil
- **Las imágenes son las estrellas** — cuida la calidad y el tamaño

---

## ❓ Problemas frecuentes

**Las animaciones no aparecen:**
- Asegúrate de que el elemento tiene `visibility: visible`
- El trigger debe coincidir (onMount, onInView, etc.)
- Aumenta la duration para verlas mejor

**El CMS no vincula:**
- Asegúrate de que el campo existe en la colección
- El tipo de dato debe coincidir (text ↔ string, image ↔ image)
- Usa el dropdown de variables, no escribas manualmente

**Responsive está roto:**
- Cada breakpoint es independiente
- Prueba mobile first (pequeño → grande)
- Usa max-widths y clamp() para fluidez

---

**¡Felicidades!** Tienes la estructura completa. Ahora es tiempo de darle vida visualmente en Framer.

Si tienes dudas, consulta la **documentación incluida** en el repositorio.

**¿Necesitas ayuda?** Comparte un screenshot o descríbeme qué no funciona.

---

**Creado:** Octubre 2025
**Próxima actualización:** Cuando tengas el sitio publicado 🚀
