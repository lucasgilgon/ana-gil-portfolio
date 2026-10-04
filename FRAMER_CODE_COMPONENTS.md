# Code Components y contenido CMS — Cómo usarlos en Framer

Este documento explica cómo llevar a Framer los archivos de `framer/code-components/` y `cms/`.
Cubren las piezas que en **NEXT_STEPS.md** quedaban como "custom code" u opcionales.

---

## 1. Code Components

| Archivo | Qué hace | Dónde va |
|---------|----------|----------|
| `ProjectCard.tsx` | Fila del índice: número, título (Prata), meta, descripción, flecha. **Preview flotante que sigue al cursor** en desktop; imagen dentro de la tarjeta en táctil. | Dentro de la Collection List de Home y `/projects` |
| `ScrollIndicator.tsx` | Chevron "↓" animado que hace scroll suave hasta un ancla. | Abajo del Hero (posición absoluta, bottom 32px) |
| `MacMenuBar.tsx` | Barra de menú macOS (menús, reloj real) / barra de estado iPhone en móvil. | Plantilla Main Layout, fija arriba |
| `MacDock.tsx` | Dock con efecto lupa, etiquetas y punto de página activa. | Plantilla Main Layout, fijo abajo |
| `DesktopIcon.tsx` | Icono de escritorio arrastrable (miniatura o carpeta/TXT/PDF/Mail). | Home y Finder |
| `BootScreen.tsx` | Pantalla de arranque "AG", una vez por sesión. | Plantilla Main Layout |
| `MobileMenu.tsx` | Hamburguesa + menú a pantalla completa (Escape para cerrar, bloquea scroll). | Variante Mobile de Navigation |

Todos respetan `prefers-reduced-motion`, usan los tokens de **DESIGN_SYSTEM.md** y cargan Prata, Inter e IBM Plex Mono desde Google Fonts.

### Crear un code component en Framer

1. Panel izquierdo → **Assets → Code → + → New component**.
2. Ponle el nombre del archivo (p. ej. `ProjectCard`).
3. Borra el contenido de ejemplo y pega el archivo `.tsx` completo.
4. Guarda (Cmd+S). Aparecerá en **Assets → Code** y se puede arrastrar al canvas.

### ProjectCard + CMS (preview flotante)

1. En Home, dentro de la sección de proyectos, crea una **Collection List** → colección **Projects**.
   - Sort: `Order` ascendente. Limit: 10.
2. Arrastra **ProjectCard** dentro del item de la lista. Ancho: `Fill`.
3. En el panel derecho, vincula cada propiedad (icono **+** junto al control) al campo del CMS:

   | Propiedad | Campo CMS |
   |-----------|-----------|
   | Título | `title` |
   | Categoría | `category` |
   | Año | `year` |
   | Descripción | `description_short` |
   | Imagen | `featured_image` |
   | Enlace | página **Project Detail** con el slug actual |
   | Número | Texto fijo o un campo de texto `number` ("01", "02"…) si lo añades al CMS |

4. Para que el ScrollIndicator llegue aquí, ponle a la sección el **Name/ID** `proyectos`.
5. Repite en `/projects` (puedes copiar la Collection List entera).

> En el canvas de Framer la preview flotante no se muestra (solo en Preview y en el sitio publicado).

### MobileMenu

1. En el componente **Navigation**, crea la variante **Mobile**.
2. Oculta los links de texto en Mobile y coloca **MobileMenu** a la derecha.
3. Los enlaces por defecto ya son Proyectos / Sobre / Contacto; edítalos desde el panel si cambian.

---

## 2. Contenido del CMS (`cms/projects.csv`)

CSV con los 4 proyectos iniciales para importar en **CMS → Projects → ⋯ → Import CSV**.
Framer te pedirá emparejar cada columna con un campo de la colección.

- `description_long` está en HTML (párrafos y listas), que Framer convierte a texto enriquecido.
- **ASH ARCHIVE** tiene el texto largo completo (sacado de CMS_GUIDE.md).
- Los otros tres llevan la frase corta y un recordatorio `[Completar: …]`. **Ana tiene que escribir esos textos** antes de publicar.
- `client_or_context`, `role`, `featured_image`, `gallery` y `external_link` van vacíos: se rellenan a mano en Framer al subir las imágenes.

---

**Última actualización:** Octubre 2026
