// Exporta los proyectos del CMS de Framer a archivos sencillos en content/proyectos/<slug>/
//   proyecto.md  → datos y textos (se edita a mano)
//   fotos/       → fotos del proyecto en orden (01.jpg, 02.jpg…)
//   proceso/     → material de proceso (bocetos, planos, pruebas)
// Uso (una sola vez): FRAMER_API_KEY=... node scripts/export-from-framer.mjs
import { mkdir, writeFile, access } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { connect } from "framer-api"
import TurndownService from "turndown"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const OUT = path.join(ROOT, "content/proyectos")
const td = new TurndownService({ headingStyle: "atx", bulletListMarker: "-" })

const PROCESO = {
    "ash-archive": [
        ["https://framerusercontent.com/images/39RAbHGX9w3h5lKnUxm0jRyafpM.jpg", "boceto-a.jpg", "Plano del vestido con volantes de gasa que caen como humo sobre el satén."],
        ["https://framerusercontent.com/images/hjWJ0QGtp1Xiu9MCqTY2KcTKCk.jpg", "boceto-b.jpg", "Variante en satén con el bajo ondulado y la cola que arrastra."],
        ["https://framerusercontent.com/images/gGBi0TXuVfvvx6cpWvVFWfWg.jpg", "toma-02.jpg", "Una de las tres tomas casi idénticas: la sombra del encaje sobre la cara."],
    ],
    "ex-corpo": [
        ["https://framerusercontent.com/images/iFuMndu9re5czgQgompZwXTjKj8.jpg", "plano-tecnico.jpg", "Plano técnico delantero y espalda: blusa de manga abullonada y falda con canesú."],
        ["https://framerusercontent.com/images/ri0GYJ0FWBaylTl4f2UxPGZJR2g.jpg", "toma-vertical.jpg", "Recorte vertical de la sesión, junto a la ventana."],
    ],
    amman: [["https://framerusercontent.com/images/bg6QtZJs9N5qk03RItyM24NXb4.jpg", "acuarelas.jpg", "Acuarelas de los figurines junto a las piezas ya montadas en el maniquí."]],
    "fragmentos-de-mi": [
        ["https://framerusercontent.com/images/vMwkTZUrgm49SQg4hzZT0jmw3bw.jpg", "sellos.jpg", "Pruebas de estampación de los sellos del kit: la casa, las tijeras, las gafas, YAYA."],
        ["https://framerusercontent.com/images/6IwNrx76ju0dpBmWGdAsmc8AYQ.jpg", "postal.jpg", "Postales escritas a mano: el tacto como forma de recordar."],
    ],
    "404-not-found": [["https://framerusercontent.com/images/gsDA0e2dyWdyPUDrjWOVINsol8.jpg", "pliego.jpg", "Pliego abierto del libro: la retícula de iconos de error antes de imprimir."]],
}

const exists = (p) => access(p).then(() => true, () => false)
async function download(url, file) {
    if (await exists(file)) return
    const r = await fetch(url)
    if (!r.ok) throw new Error(`${r.status} ${url}`)
    await writeFile(file, Buffer.from(await r.arrayBuffer()))
}
const rgbToHex = (c) => {
    const m = String(c).match(/(\d+),\s*(\d+),\s*(\d+)/)
    return m ? "#" + m.slice(1).map((n) => Number(n).toString(16).padStart(2, "0")).join("").toUpperCase() : c
}
const yaml = (v) => (v === undefined || v === null || v === "" ? '""' : typeof v === "number" ? String(v) : JSON.stringify(String(v)))

const framer = await connect("https://framer.com/projects/web-ana--5GD78Ie1TwPsuTi1VC5P-iKxAF", process.env.FRAMER_API_KEY)
try {
    const col = (await framer.getCollections()).find((c) => c.name === "Projects")
    const F = Object.fromEntries((await col.getFields()).map((f) => [f.name, f]))
    const fotoField = F["Fotos"].fields[0]
    for (const it of await col.getItems()) {
        if (it.draft) continue
        const v = (n) => it.fieldData[F[n]?.id]?.value
        const slug = it.slug
        const dir = path.join(OUT, slug)
        await mkdir(path.join(dir, "fotos"), { recursive: true })
        const fotos = (v("Fotos") || []).map((a) => a.fieldData?.[fotoField.id]?.value?.url).filter(Boolean)
        const featured = v("Featured Image")?.url
        for (const [i, u] of fotos.entries()) await download(u, path.join(dir, "fotos", `${String(i + 1).padStart(2, "0")}.jpg`))
        let portada = "fotos/01.jpg"
        if (featured && !fotos.includes(featured)) {
            await download(featured, path.join(dir, "portada.jpg"))
            portada = "portada.jpg"
        } else if (featured) portada = `fotos/${String(fotos.indexOf(featured) + 1).padStart(2, "0")}.jpg`
        const proceso = PROCESO[slug] || []
        if (proceso.length) await mkdir(path.join(dir, "proceso"), { recursive: true })
        for (const [u, f] of proceso) await download(u, path.join(dir, "proceso", f))

        // Los subtítulos de dentro de Concepto/Técnica bajan un nivel (###) para no confundirse con las secciones
        const md = (html) => (html ? td.turndown(String(html).replace(/ dir="auto"/g, "")).trim().replace(/^#{1,2} /gm, "### ").replace(/^### \\> /gm, "### > ") : "")
        const front = [
            "---",
            `titulo: ${yaml(v("Title"))}`,
            `numero: ${yaml(v("Order"))}`,
            `año: ${yaml(v("Year"))}`,
            `categoria: ${yaml(v("Category"))}`,
            `contexto: ${yaml(v("Client Or Context"))}`,
            `rol: ${yaml(v("Role"))}`,
            `acento: ${yaml(rgbToHex(v("Acento") || "#111111"))}`,
            `resumen: ${yaml(v("Description Short"))}`,
            `cita: ${yaml(v("Cita"))}`,
            `palabras_clave: ${yaml(v("Clave"))}`,
            `enlace: ${yaml(v("Enlace") || v("External Link"))}`,
            `portada: ${yaml(portada)}`,
            "proceso:",
            ...(proceso.length ? proceso.map(([, f, n]) => `  - foto: ${yaml(f)}\n    nota: ${yaml(n)}`) : ["  []"]),
            "---",
        ].join("\n")
        const body = [`## Concepto\n\n${md(v("Concepto") || v("Description Long"))}`, `## Técnica\n\n${md(v("Técnica"))}`].join("\n\n")
        await writeFile(path.join(dir, "proyecto.md"), front.replace("proceso:\n  []", "proceso: []") + "\n\n" + body + "\n")
        console.log(`  · ${slug}: ${fotos.length} fotos, ${proceso.length} de proceso`)
    }
} finally {
    await framer.disconnect()
}
