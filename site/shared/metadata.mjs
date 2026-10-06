export const SITE_DESCRIPTION = 'Portfolio de Ana Gil, estudiante de Diseño de Moda en ESD Madrid. Proyectos sobre trauma, memoria y transformación: moda, diseño editorial y dirección de arte.'
const pages = {
 '/': ['Ana Gil — Fashion design · Portfolio 2026', SITE_DESCRIPTION, 'ana-gil'],
 '/projects': ['Proyectos — Ana Gil', 'Proyectos de moda, diseño editorial y dirección de arte de Ana Gil. ESD Madrid, 2025–26.', 'ana-gil'],
 '/about': ['Sobre mí — Ana Gil', 'Ana Gil, estudiante de Moda en ESD Madrid. El cuerpo como documento, la tela como archivo.', 'sobre-mi'],
 '/cv': ['Currículum — Ana Gil', 'Currículum de Ana Gil: estudios, experiencia, idiomas y descarga del CV en PDF.', 'cv'],
 '/contact': ['Contacto — Ana Gil', 'Escribe a Ana Gil para colaboraciones, prácticas o encargos: anagilgonzalez06@gmail.com', 'ana-gil'],
 '/notas': ['Libro de visitas — Ana Gil', 'Deja una nota a Ana Gil en su libro de visitas.', 'ana-gil'],
 '/tejidos': ['Tejidos — Ana Gil', 'Muestrario de tejidos de Ana Gil y los proyectos en los que se usan.', 'ana-gil'],
 '/fotos': ['Fotos — Ana Gil', 'Todas las fotos del archivo de Ana Gil: colecciones, editoriales y proceso.', 'ana-gil'],
 '/papelera': ['Papelera — Ana Gil', 'Bocetos, planos, tomas repetidas y pruebas de taller de Ana Gil.', 'ana-gil'],
}
export function metadataFor(path, projects, base) {
 const project = projects.find(p => path === p.link || path === `${p.link}/moodboard` || path === `${p.link}/probador`)
 let data = pages[path]
 if (project) {
  const mood = path.endsWith('/moodboard'), fitting = path.endsWith('/probador')
  data = [`${mood ? 'Moodboard — ' : fitting ? 'Probador — ' : ''}${project.title} — Ana Gil`, mood ? `Referencias, proceso y fotos de ${project.title}.` : fitting ? `Del boceto a la prenda final: ${project.title}.` : project.short, project.slug]
 }
 const known = !!data
 data ??= ['Página no encontrada — Ana Gil', SITE_DESCRIPTION, 'ana-gil']
 return { title: data[0], desc: data[1], image: `${base}/og/${data[2]}.jpg`, canonical: `${base}${path}`, type: project ? 'article' : 'website', known }
}
