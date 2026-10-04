# Guía CMS — Cómo gestionar proyectos

Esta es una guía rápida para agregar, editar y eliminar proyectos en el Framer CMS.

---

## Acceder al CMS

1. Abre el proyecto Framer
2. Ve a **CMS** (en el panel izquierdo)
3. Selecciona la colección **Projects**

---

## Agregar un proyecto nuevo

### Paso 1: Crear item

Haz clic en **+ Add item** en la sección Projects.

### Paso 2: Llenar campos obligatorios

#### **Title** (Texto)
Nombre del proyecto. Ejemplos:
- "ASH ARCHIVE"
- "404:NOT FOUND_"
- "FRAGMENTOS DE MÍ"

#### **Slug** (URL)
Se genera automáticamente a partir del título, pero puedes editarlo.
Ejemplos:
- `ash-archive`
- `404-not-found`
- `fragmentos-de-mi`

#### **Category** (Seleccionar)
Elige una opción:
- Moda
- Editorial
- Dirección de arte
- Otro

#### **Year** (Número)
Año de realización. Ej: `2025`

#### **Description Short** (Texto)
Frase corta (máx. 150 caracteres) que aparecerá en el index de proyectos.

Ejemplo:
> "Colección que explora la resiliencia tras la pérdida, usando encaje como agente destructor y constructor."

#### **Description Long** (Texto enriquecido)
Contexto conceptual completo del proyecto. Puede incluir:
- Inspiración y concepto
- Técnica y materialidad
- Proceso de desarrollo
- Reflexión personal

Ejemplo (formato markdown):
```
El fuego borra las formas, pero la ceniza conserva su sombra.

La propuesta técnica se basa en resignificar el uso tradicional del encaje.
Lejos de su función ornamental o romántica, aquí el encaje actúa como el
agente destructor: invade la prenda, rompe la estructura y genera asimetrías
violentas que simulan la deconstrucción térmica.

Se establece un diálogo de densidades y pesos opuestos:
- **Gasa:** Aporta volatilidad y transparencia, simulando el humo
- **Satén:** Aporta estructura y cuerpo, representando la piel bajo la quemadura
```

#### **Featured Image** (Imagen)
Imagen principal que aparecerá en:
- Index de proyectos (preview flotante)
- Hero de la página de detalle
- Open Graph (en redes sociales)

**Requerimientos:**
- Tamaño recomendado: 1200×800px
- Formato: JPG o PNG
- Tamaño máximo: 5MB
- Comprimir con TinyPNG antes de subir

#### **Gallery** (Múltiples imágenes)
Galería completa del proyecto. Sube mínimo 3 imágenes.

**Requerimientos:**
- Tamaño: 1200×800px (consistente)
- Formato: JPG o PNG
- Ordenar visualmente (de menos a más importante o narrativamente)

#### **Order** (Número)
Número de posición en el index:
- 1 = aparece primero
- 2 = aparece segundo
- etc.

Si cambias este número, el order cambia automáticamente en la lista.

### Paso 3: Llenar campos opcionales

#### **Client or Context** (Texto)
Contexto de la comisión/educación.

Ejemplos:
- "Trabajo académico, ESD MADRID"
- "Proyecto personal"
- "Colaboración con [Institución]"

#### **Role** (Texto)
Tu rol en el proyecto.

Ejemplos:
- "Diseñadora & Investigadora"
- "Art Director"
- "Diseñadora textil"

#### **External Link** (URL)
Si existe un link externo (web, revista, etc.), pégalo aquí.

Ejemplos:
- `https://heyzine.com/flip-book/...`
- `https://tu-sitio.com/proyecto`

---

## Editar un proyecto

1. Ve a **CMS > Projects**
2. Haz clic en el proyecto que quieres editar
3. Modifica los campos que necesites
4. Guarda automáticamente (Framer guarda cambios en tiempo real)

**Nota:** Si cambias el título, el slug se actualiza automáticamente a menos que lo hayas editado manualmente.

---

## Eliminar un proyecto

⚠️ **Cuidado:** Esta acción no se puede deshacer.

1. Ve a **CMS > Projects**
2. Haz clic en el menú (⋮) junto al proyecto
3. Selecciona **Delete**
4. Confirma

---

## Ordenar proyectos

Hay dos formas:

### Opción 1: Arrastrar (Drag & Drop)
1. Ve a **CMS > Projects**
2. Mantén presionado un proyecto
3. Arrastra hacia arriba o abajo
4. Suelta para confirmar

### Opción 2: Editar número de orden
1. Abre el proyecto
2. Edita el campo **Order**
3. Guarda

---

## Mejores prácticas

### Imágenes
- [ ] Comprimir antes de subir (máx. 500KB por imagen)
- [ ] Usar formato JPG para fotografías, PNG para gráficos
- [ ] Mantener proporción 3:2 (1200×800px)
- [ ] Nombres descriptivos: `proyecto-foto-01.jpg`

### Textos
- [ ] Revisar spelling y puntuación
- [ ] Usar Markdown para formato (bold, italic, listas)
- [ ] Mantener coherencia de voz y tono
- [ ] Mantener descripciones cortas y precisas

### SEO
- [ ] Títulos únicos y descriptivos
- [ ] Descripciones cortas incluyen palabras clave
- [ ] Slug en minúsculas y separado por guiones
- [ ] Imágenes con nombres descriptivos

### Organización
- [ ] Mantener orden consistente (cronológico o por categoría)
- [ ] Actualizar campos si cambian detalles
- [ ] Archivar proyectos antiguos si es necesario (ver nota sobre eliminación)

---

## Plantillas rápidas

### Descripción Short (copia y adapta)

**Moda:**
> "Colección que explora [concepto] a través de [técnica]. [Resultado emocional o visual]."

**Editorial:**
> "Libro que materializa [concepto] mediante [formato]. [Reflexión conceptual]."

**Dirección de arte:**
> "Proyecto que investiga [tema] con [herramientas]. [Impacto o resultado]."

### Descripción Long (estructura)

```
# Concepto
[Inspiración, pregunta central, hipótesis]

# Técnica & Materialidad
[Cómo lo hiciste, materiales, proceso]

# Narrativa visual
[Cómo se cuenta la historia en imágenes, paleta, estética]

# Resultado & Reflexión
[Qué aprendiste, qué comunica, impacto]
```

---

## FAQ

**P: ¿Puedo cambiar el slug después de publicar?**
Sí, pero ten cuidado: si cambias el URL, los links antiguos se rompen. Mejor mantenerlo estable.

**P: ¿Puedo tener proyectos privados?**
No en esta versión. Todos los proyectos aparecen en el sitio. Si quieres ocultar uno, elimínalo temporalmente.

**P: ¿Cuántas imágenes puedo subir en la galería?**
Sin límite técnico, pero recomiendo máx. 8-10 para mantener carga rápida.

**P: ¿Puedo reordenar imágenes de la galería?**
Sí: abre el proyecto, ve al campo Gallery, y arrastra las imágenes para reordenarlas.

**P: ¿Se pueden agregar videos?**
En esta versión, no. Solo imágenes. Puedes linkear a Vimeo/YouTube si necesitas video.

---

## Contacto & Soporte

Si encuentras problemas con el CMS:
1. Recarga la página (a veces hay bugs temporales)
2. Verifica que los campos requeridos estén llenos
3. Revisa el tamaño de imágenes (< 5MB)
4. Contacta con el desarrollador si persiste el error

---

**Última actualización:** Octubre 2025
