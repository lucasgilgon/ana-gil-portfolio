// Convierte content/ (proyectos en archivos sencillos + fotos) en datos para la web.
// · Lee content/proyectos/<slug>/proyecto.md (cabecera con datos + texto en Markdown)
// · Genera cada foto en varios tamaños WebP en public/media/ (solo si cambió) con miniatura difuminada
// · Escribe src/content/generated.ts
// Se ejecuta solo con `npm run dev` / `npm run build`.
import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"
import { marked } from "marked"
import sharp from "sharp"

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const CONTENT = path.resolve(SITE, "../content")
const MEDIA = path.join(SITE, "public/media")
const WIDTHS = [480, 960, 1600, 2400]
const IMG_EXT = /\.(jpe?g|png|webp)$/i

const mtime = (p) => stat(p).then((s) => s.mtimeMs, () => 0)
const images = {}

async function processImage(srcFile, outBase) {
    // outBase: ruta pública sin extensión, p. ej. /media/ash-archive/01
    const meta = await sharp(srcFile).metadata()
    const W = meta.width
    const H = meta.height
    // tamaños estándar por debajo del original + el propio original (sin ampliar nunca)
    const sizes = WIDTHS.filter((w) => w < W - 64)
    sizes.push(Math.min(W, 2400))
    const outDir = path.join(SITE, "public", path.dirname(outBase))
    await mkdir(outDir, { recursive: true })
    const srcT = await mtime(srcFile)
    for (const w of sizes) {
        const out = path.join(SITE, "public", `${outBase}-${w}.webp`)
        if ((await mtime(out)) > srcT) continue
        await sharp(srcFile).rotate().resize({ width: Math.min(w, W) }).webp({ quality: 78, effort: 5 }).toFile(out)
    }
    const blur = await sharp(srcFile).rotate().resize({ width: 16 }).webp({ quality: 40 }).toBuffer()
    images[outBase] = { base: outBase, w: W, h: H, sizes, blur: `data:image/webp;base64,${blur.toString("base64")}` }
    return outBase
}

const code = (t) => (t || "").toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "")

function sections(md) {
    // "## Concepto" / "## Técnica" → html; dentro de Técnica, cada "### Título" es un apartado
    const out = {}
    let cur = null
    for (const line of md.split("\n")) {
        const m = line.match(/^##\s+(.+?)\s*$/)
        if (m) {
            cur = m[1].trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
            out[cur] = ""
            continue
        }
        if (cur) out[cur] += line + "\n"
    }
    return out
}
function subsections(md) {
    const parts = []
    let cur = { title: "", md: "" }
    for (const line of (md || "").split("\n")) {
        const m = line.match(/^###\s+(.+?)\s*$/)
        if (m) {
            if (cur.title || cur.md.trim()) parts.push(cur)
            cur = { title: m[1].trim(), md: "" }
        } else cur.md += line + "\n"
    }
    if (cur.title || cur.md.trim()) parts.push(cur)
    return parts.map((p) => ({ title: p.title, html: marked.parse(p.md.trim()) }))
}

const projects = []
const dirs = (await readdir(path.join(CONTENT, "proyectos"), { withFileTypes: true })).filter((d) => d.isDirectory() && !d.name.startsWith("_"))
for (const d of dirs) {
    const dir = path.join(CONTENT, "proyectos", d.name)
    let raw
    try {
        raw = await readFile(path.join(dir, "proyecto.md"), "utf8")
    } catch {
        continue
    }
    const { data, content } = matter(raw)
    if (data.oculto) continue
    const slug = d.name
    const title = String(data.titulo || slug)
    const fotosDir = path.join(dir, "fotos")
    const fotoFiles = (await readdir(fotosDir).catch(() => [])).filter((f) => IMG_EXT.test(f)).sort()
    const files = []
    for (const [i, f] of fotoFiles.entries()) {
        const base = await processImage(path.join(fotosDir, f), `/media/${slug}/${path.parse(f).name}`)
        files.push({ src: base, name: `${code(title)}_${String(i + 1).padStart(2, "0")}.jpg` })
    }
    let cover = files[0]?.src || ""
    if (data.portada) {
        const p = path.join(dir, data.portada)
        cover = await processImage(p, `/media/${slug}/${data.portada.replace(/^fotos\//, "").replace(IMG_EXT, "")}`)
    }
    const proceso = []
    for (const item of data.proceso || []) {
        const p = path.join(dir, "proceso", item.foto)
        const base = await processImage(p, `/media/${slug}/proceso/${path.parse(item.foto).name}`)
        proceso.push({ src: base, nota: item.nota || "", name: `${code(title)}_${path.parse(item.foto).name}.${path.extname(item.foto).slice(1) || "jpg"}` })
    }
    const sec = sections(content)
    projects.push({
        slug,
        title,
        number: Number(data.numero || 0),
        year: Number(data["año"] || data.anio || 0),
        category: String(data.categoria || ""),
        context: String(data.contexto || ""),
        role: String(data.rol || ""),
        accent: String(data.acento || "#111111"),
        short: String(data.resumen || ""),
        cita: String(data.cita || ""),
        keywords: String(data.palabras_clave || ""),
        external: String(data.enlace || ""),
        link: `/projects/${slug}`,
        cover,
        files,
        proceso,
        concepto: marked.parse((sec.concepto || "").trim()),
        tecnica: subsections(sec.tecnica || ""),
    })
    console.log(`  · ${slug}: ${files.length} fotos, ${proceso.length} de proceso`)
}
// sin número → al final, en orden de año
projects.sort((a, b) => (a.number || 999) - (b.number || 999) || a.year - b.year)
projects.forEach((p, i) => (p.number = p.number || i + 1))

// Imágenes del sistema (retrato, fondos, telas, papel…)
const sistema = {}
for (const f of (await readdir(path.join(CONTENT, "sistema")).catch(() => [])).filter((f) => IMG_EXT.test(f)).sort()) {
    const name = path.parse(f).name
    sistema[name] = await processImage(path.join(CONTENT, "sistema", f), `/media/sistema/${name}`)
}

const ts = `// Generado por scripts/build-content.mjs — no editar a mano (edita content/proyectos/*/proyecto.md)
export type Img = { base: string; w: number; h: number; sizes: number[]; blur: string }
export type ArchiveFile = { src: string; name: string }
export type Proceso = { src: string; nota: string; name: string }
export type Tecnica = { title: string; html: string }
export type Project = {
    slug: string; title: string; number: number; year: number; category: string; context: string; role: string
    accent: string; short: string; cita: string; keywords: string; external: string; link: string; cover: string
    files: ArchiveFile[]; proceso: Proceso[]; concepto: string; tecnica: Tecnica[]
}
export const IMAGES: Record<string, Img> = ${JSON.stringify(images)}
export const PROJECTS: Project[] = ${JSON.stringify(projects, null, 1)}
export const SISTEMA: Record<string, string> = ${JSON.stringify(sistema, null, 1)}
`
await writeFile(path.join(SITE, "src/content/generated.ts"), ts)
console.log(`Contenido: ${projects.length} proyectos, ${Object.keys(images).length} imágenes`)
// Copia para scripts/prerender.mjs (páginas estáticas para Google y vistas previas al compartir)
await writeFile(path.join(SITE, ".content.json"), JSON.stringify({ projects, images }))
