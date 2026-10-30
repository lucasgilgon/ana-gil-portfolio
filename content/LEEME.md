# Cómo añadir o cambiar proyectos (sin tocar código)

Todo el contenido de la web vive en esta carpeta `content/`. Al publicar, la web se
reconstruye sola: convierte las fotos a tamaños ligeros, crea las páginas del libro,
las vistas previas para WhatsApp/Instagram y el mapa para Google.

## Añadir un proyecto nuevo

1. Copia la carpeta `proyectos/_plantilla` y ponle de nombre algo corto, en minúsculas y
   sin espacios, por ejemplo `proyectos/mi-coleccion`. Ese nombre será la dirección:
   `tuweb.com/projects/mi-coleccion`.
2. Abre `proyecto.md` y rellena los datos de arriba (título, año, categoría, color…) y
   los textos de **Concepto** y **Técnica**.
3. Mete las fotos en la carpeta `fotos/` numeradas en el orden en que quieras que salgan:
   `01.jpg`, `02.jpg`, `03.jpg`… (sirven JPG o PNG; no hace falta reducirlas).
4. Si quieres fotos de proceso (bocetos, pruebas…), ponlas en `proceso/` y añádelas a la
   lista `proceso:` del archivo con una nota.
5. Sube los cambios a GitHub (desde la web de GitHub: *Add file → Upload files*). En un par
   de minutos la web está actualizada.

El proyecto aparece solo en: el escritorio (nube de fotos), el índice, el menú Proyectos,
el buscador ⌘K, Fotos, el iPhone (como app y en el widget) y tiene su propio libro.

## Gama cromática (opcional)

Un proyecto puede tener su ventana **Color** (`tuweb.com/projects/<nombre>/color`): la línea de
color de la colección con los bocetos colocados encima, en seis vistas (anillo, pasarela, línea,
muestrario, tendedero y pincel). Se rellena en el apartado `gama:` del `proyecto.md` (mira el de
`amman`): los colores en orden y cada boceto con su posición de 0 a 100 o el nombre de un color.
Los bocetos van en la carpeta `gama/` del proyecto (mejor PNG o WebP con fondo transparente).
Para colocarlos arrastrando, abre la ventana con `?editar` al final de la dirección, activa
«Colocar bocetos» y copia el texto que aparece debajo.

## Cambiar algo

- **Textos o datos de un proyecto**: edita su `proyecto.md`.
- **Orden**: cambia el `numero:` de cada proyecto.
- **Esconder un proyecto** sin borrarlo: añade `oculto: true` en su `proyecto.md`.
- **Fotos de la web** (retrato, fondo de escritorio, telas, papel): carpeta `sistema/`,
  manteniendo el mismo nombre de archivo.
- **CV y portfolio en PDF**: `site/public/docs/` (mismo nombre de archivo).

## Tarjetas para compartir

`og/` guarda la imagen que aparece al compartir cada página (con el título en Bodoni).
Si un proyecto nuevo no tiene la suya, se usa su portada recortada automáticamente.
