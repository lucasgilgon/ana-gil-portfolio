// Tras `vite build`: crea una página HTML por ruta con su título, descripción, imagen para compartir
// (WhatsApp, Instagram, iMessage…), datos estructurados para Google, sitemap.xml y robots.txt.
// La URL pública se toma de SITE_URL (o de Vercel / Cloudflare Pages automáticamente).
import { readFile, writeFile, mkdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const DIST = path.join(SITE, "dist")
const env = process.env
const BASE = (
    env.SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL && `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    // en Cloudflare Pages: el proyecto se llama "anagil" → https://anagil.pages.dev
    "https://anagil.pages.dev"
).replace(/\/$/, "")

const { projects, images } = JSON.parse(await readFile(path.join(SITE, ".content.json"), "utf8"))
const template = await readFile(path.join(DIST, "index.html"), "utf8")
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
const strip = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
const largest = (base) => {
    const im = images[base]
    return im ? path.join(DIST, `${base}-${im.sizes[im.sizes.length - 1]}.webp`) : null
}

// ——— Imágenes para compartir (1200×630) ———
await mkdir(path.join(DIST, "og"), { recursive: true })
const CARDS = path.resolve(SITE, "../content/og")
async function og(name, base, position = "attention") {
    // Tarjeta con tipografía (scripts/og-cards.mjs) si existe; si no, recorte de la foto
    const card = path.join(CARDS, `${name}.jpg`)
    if (await readFile(card).then(() => true, () => false)) {
        await sharp(card).resize(1200, 630).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(DIST, "og", `${name}.jpg`))
        return `${BASE}/og/${name}.jpg`
    }
    const src = largest(base)
    if (!src) return null
    const out = path.join(DIST, "og", `${name}.jpg`)
    await sharp(src).resize(1200, 630, { fit: "cover", position }).jpeg({ quality: 82, mozjpeg: true }).toFile(out)
    return `${BASE}/og/${name}.jpg`
}
// Icono para la pantalla de inicio del iPhone
if (largest("/media/sistema/retrato")) await sharp(largest("/media/sistema/retrato")).resize(180, 180, { fit: "cover", position: "north" }).png().toFile(path.join(DIST, "apple-touch-icon.png"))
const ogHome = await og("ana-gil", "/media/sistema/fondo-retrato", "centre")

const NAME = "Ana Gil"
const DESC = "Portfolio de Ana Gil, estudiante de Diseño de Moda en ESD Madrid. Proyectos sobre trauma, memoria y transformación: moda, diseño editorial y dirección de arte."
const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ana Gil González",
    alternateName: "Ana Gil",
    jobTitle: "Diseñadora de moda (estudiante)",
    url: BASE + "/",
    image: ogHome,
    email: "mailto:anagilgonzalez06@gmail.com",
    affiliation: { "@type": "CollegeOrUniversity", name: "ESD Madrid — Escuela Superior de Diseño de Madrid" },
    address: { "@type": "PostalAddress", addressLocality: "Madrid", addressCountry: "ES" },
    sameAs: ["https://www.instagram.com/byana_________/", "https://www.instagram.com/anagilgon/"],
    knowsAbout: ["Diseño de moda", "Diseño editorial", "Dirección de arte", "Confección", "Patronaje"],
}

const nav = `<nav><a href="/">Inicio</a> · <a href="/projects">Proyectos</a> · <a href="/about">Sobre mí</a> · <a href="/cv">Currículum</a> · <a href="/fotos">Fotos</a> · <a href="/contact">Contacto</a></nav>`
const projectList = `<ul>${projects.map((p) => `<li><a href="${p.link}">${esc(p.title)}</a> — ${esc(p.category)}, ${p.year}. ${esc(p.short)}</li>`).join("")}</ul>`

const routes = [
    { path: "/", title: `${NAME} — Fashion design · Portfolio 2026`, desc: DESC, image: ogHome, ld: [person], body: `<h1>Ana Gil — Fashion design</h1><p>${esc(DESC)}</p>${projectList}` },
    { path: "/projects", title: `Proyectos — ${NAME}`, desc: "Índice de proyectos de Ana Gil: 404:NOT FOUND_, ASH ARCHIVE, FRAGMENTOS DE MÍ, EX_CORPO, AMMAN. ESD Madrid, 2025–26.", image: ogHome, body: `<h1>Proyectos</h1>${projectList}` },
    { path: "/about", title: `Sobre mí — ${NAME}`, desc: "Ana Gil, estudiante de Moda en ESD Madrid. El cuerpo como documento, la tela como archivo.", image: await og("sobre-mi", "/media/sistema/retrato", "north"), ld: [person], body: `<h1>Sobre mí</h1><p>${esc(DESC)}</p>` },
    { path: "/cv", title: `Currículum — ${NAME}`, desc: "Currículum de Ana Gil: Fashion Design Student en ESD Madrid, experiencia en atención al cliente y showroom. Descarga el CV en PDF.", image: await og("cv", "/media/sistema/retrato", "north"), body: `<h1>Currículum de Ana Gil</h1><p><a href="/docs/CV_Ana_Gil.pdf">Descargar CV (PDF)</a></p>` },
    { path: "/fotos", title: `Fotos — ${NAME}`, desc: "Todas las fotos del archivo de Ana Gil: colecciones, editoriales y proceso.", image: ogHome, body: `<h1>Fotos</h1>${projectList}` },
    { path: "/papelera", title: `Papelera — proceso — ${NAME}`, desc: "Lo que no llegó al libro también es el trabajo: bocetos, planos, tomas repetidas y pruebas de taller.", image: ogHome, body: `<h1>Papelera: proceso y descartes</h1>` },
    { path: "/contact", title: `Contacto — ${NAME}`, desc: "Escribe a Ana Gil para colaboraciones, prácticas o encargos: anagilgonzalez06@gmail.com", image: ogHome, body: `<h1>Contacto</h1><p><a href="mailto:anagilgonzalez06@gmail.com">anagilgonzalez06@gmail.com</a></p>` },
]
routes.push(
    { path: "/tejidos", title: `Tejidos — muestrario — ${NAME}`, desc: "Muestrario de tejidos de Ana Gil: lino, satén y encaje, y los proyectos en los que se usan.", image: ogHome, body: `<h1>Tejidos</h1>` },
    { path: "/notas", title: `Libro de visitas — ${NAME}`, desc: "Deja una nota a Ana Gil en su libro de visitas.", image: ogHome, body: `<h1>Libro de visitas</h1>` },
)
for (const p of projects) {
    const image = await og(p.slug, p.cover)
    routes.push({ path: `${p.link}/moodboard`, title: `Moodboard — ${p.title} — ${NAME}`, desc: `Referencias, proceso y fotos de ${p.title} en un corcho.`, image, body: `<h1>Moodboard de ${esc(p.title)}</h1>` })
    if (p.probador?.length) routes.push({ path: `${p.link}/probador`, title: `Probador — ${p.title} — ${NAME}`, desc: `Las prendas de ${p.title}: del boceto y el plano técnico a la foto final.`, image, body: `<h1>Probador de ${esc(p.title)}</h1><ul>${p.probador.map((g) => `<li>${esc(g.prenda)} — ${esc(g.nota)}</li>`).join("")}</ul>` })
    routes.push({
        path: p.link,
        title: `${p.title} — ${p.category}, ${p.year} — ${NAME}`,
        desc: p.short || strip(p.concepto).slice(0, 155),
        image,
        type: "article",
        ld: [
            {
                "@context": "https://schema.org",
                "@type": "CreativeWork",
                name: p.title,
                description: p.short,
                dateCreated: String(p.year),
                genre: p.category,
                keywords: p.keywords,
                image,
                url: BASE + p.link,
                creator: { "@type": "Person", name: "Ana Gil González", url: BASE + "/" },
            },
        ],
        body: `<h1>${esc(p.title)}</h1><p>${esc(p.context)}</p><blockquote>${esc(p.cita)}</blockquote><h2>Concepto</h2>${p.concepto}<h2>Técnica</h2>${p.tecnica.map((t) => `<h3>${esc(t.title)}</h3>${t.html}`).join("")}`,
    })
}

for (const r of routes) {
    const url = BASE + (r.path === "/" ? "/" : r.path)
    const meta = [
        `<title>${esc(r.title)}</title>`,
        `<meta name="description" content="${esc(r.desc)}" />`,
        `<link rel="canonical" href="${url}" />`,
        `<meta property="og:type" content="${r.type || "website"}" />`,
        `<meta property="og:site_name" content="Ana Gil — Portfolio" />`,
        `<meta property="og:locale" content="es_ES" />`,
        `<meta property="og:title" content="${esc(r.title)}" />`,
        `<meta property="og:description" content="${esc(r.desc)}" />`,
        `<meta property="og:url" content="${url}" />`,
        r.image && `<meta property="og:image" content="${r.image}" />`,
        r.image && `<meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        r.image && `<meta name="twitter:image" content="${r.image}" />`,
        ...(r.ld || []).map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`),
    ]
        .filter(Boolean)
        .join("\n")
    // Contenido legible sin JavaScript (Google, lectores); React lo sustituye al cargar
    const seo = `<div id="root"><main class="ag-static" style="max-width:720px;margin:40px auto;padding:0 20px;font-family:Georgia,serif;color:#111">${nav}${r.body}</main></div>`
    const html = template.replace(/<!--ag:meta-->[\s\S]*?<!--\/ag:meta-->/, meta).replace('<div id="root"></div>', seo)
    const out = r.path === "/" ? path.join(DIST, "index.html") : path.join(DIST, r.path, "index.html")
    await mkdir(path.dirname(out), { recursive: true })
    await writeFile(out, html)
}

const today = new Date().toISOString().slice(0, 10)
await writeFile(path.join(DIST, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${BASE}${r.path === "/" ? "/" : r.path}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`)
await writeFile(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`)
console.log(`Prerender: ${routes.length} páginas · ${BASE}`)
