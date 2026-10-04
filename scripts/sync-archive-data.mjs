// Lee la colección "Projects" del CMS de Framer e inyecta los datos en los componentes que tengan
// el bloque @archive-data (nube de archivos del escritorio, índice…). Después los sube a Framer.
//
// Uso: FRAMER_API_KEY=... node scripts/sync-archive-data.mjs
// Ejecutarlo cada vez que se añadan o cambien proyectos/fotos en el CMS.

import { readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { connect } from "framer-api"

const PROJECT_URL = process.env.FRAMER_PROJECT_URL ?? "https://framer.com/projects/web-ana--5GD78Ie1TwPsuTi1VC5P-iKxAF"
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const val = (fd, field) => (field ? fd[field.id]?.value : undefined)
const url = (v) => (typeof v === "string" ? v : v?.url)
const short = (s) =>
    (s || "")
        .toUpperCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^A-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")

const framer = await connect(PROJECT_URL)
try {
    const col = (await framer.getCollections()).find((c) => c.name === "Projects")
    const fields = await col.getFields()
    const F = Object.fromEntries(fields.map((f) => [f.name, f]))
    const fotoItemField = F["Fotos"]?.fields?.[0]
    const items = (await col.getItems()).filter((i) => !i.draft)

    const projects = items
        .map((it) => {
            const fd = it.fieldData
            const fotos = (val(fd, F["Fotos"]) || []).map((a) => url(a.fieldData?.[fotoItemField?.id]?.value)).filter(Boolean)
            const featured = url(val(fd, F["Featured Image"]))
            const images = fotos.length ? fotos : [featured].filter(Boolean)
            const title = val(fd, F["Title"]) || it.slug
            const code = short(title)
            return {
                slug: it.slug,
                title,
                number: Number(val(fd, F["Order"]) || 0),
                category: val(fd, F["Category"]) || "",
                year: Number(val(fd, F["Year"]) || 0),
                context: val(fd, F["Client Or Context"]) || "",
                short: val(fd, F["Description Short"]) || "",
                accent: val(fd, F["Acento"]) || "#111111",
                link: `/projects/${it.slug}`,
                cover: featured || images[0] || "",
                files: images.map((src, i) => ({ src, name: `${code}_${String(i + 1).padStart(2, "0")}.jpg` })),
            }
        })
        .sort((a, b) => a.number - b.number)

    // Inyecta los datos en todos los componentes que tengan el bloque @archive-data
    const block = `// @archive-data-start (generado por scripts/sync-archive-data.mjs — no editar a mano)
type ArchiveFile = { src: string; name: string }
type ArchiveProject = { slug: string; title: string; number: number; category: string; year: number; context: string; short: string; accent: string; link: string; cover: string; files: ArchiveFile[] }
const PROJECTS: ArchiveProject[] = ${JSON.stringify(projects, null, 4)}
// @archive-data-end`
    const dir = path.join(ROOT, "framer/code-components")
    for (const f of await readdir(dir)) {
        if (!f.endsWith(".tsx")) continue
        const file = path.join(dir, f)
        const src = await readFile(file, "utf8")
        const re = /\/\/ @archive-data-start[\s\S]*?\/\/ @archive-data-end/
        if (!re.test(src)) continue
        const next = src.replace(re, block)
        await writeFile(file, next)
        const cf = await framer.getCodeFile(f)
        if (cf) await cf.setFileContent(next)
        else await framer.createCodeFile(f.replace(/\.tsx$/, ""), next)
        console.log(`  · ${f} actualizado`)
    }
    console.log(`ArchiveData: ${projects.length} proyectos, ${projects.reduce((n, p) => n + p.files.length, 0)} archivos`)
} finally {
    await framer.disconnect()
}
