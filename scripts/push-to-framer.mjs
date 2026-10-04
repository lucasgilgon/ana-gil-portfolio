// Sube a Framer los code components de framer/code-components/ y los proyectos de cms/projects.json.
//
// Uso:
//   FRAMER_API_KEY=... node scripts/push-to-framer.mjs            # simulación: solo muestra lo que haría
//   FRAMER_API_KEY=... node scripts/push-to-framer.mjs --apply    # escribe en el proyecto
//
// No publica el sitio: eso se hace a mano desde Framer tras revisar.

import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { connect } from "framer-api"

const PROJECT_URL =
    process.env.FRAMER_PROJECT_URL ??
    "https://framer.com/projects/web-ana--5GD78Ie1TwPsuTi1VC5P-iKxAF"
const APPLY = process.argv.includes("--apply")
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const CATEGORIES = ["Moda", "Editorial", "Dirección de arte", "Otro"]

// Campos de la colección Projects (FRAMER_SETUP.md, fase 4). La galería se crea a mano en Framer.
const FIELDS = [
    { key: "Title", create: { type: "string", name: "Title" } },
    { key: "Category", create: { type: "enum", name: "Category", cases: CATEGORIES.map((name) => ({ name })) } },
    { key: "Year", create: { type: "number", name: "Year" } },
    { key: "description_short", create: { type: "string", name: "description_short" } },
    { key: "description_long", create: { type: "formattedText", name: "description_long" } },
    { key: "client_or_context", create: { type: "string", name: "client_or_context" } },
    { key: "role", create: { type: "string", name: "role" } },
    { key: "featured_image", create: { type: "image", name: "featured_image" } },
    { key: "external_link", create: { type: "link", name: "external_link" } },
    { key: "Order", create: { type: "number", name: "Order" } },
]

const norm = (s) => s.toLowerCase().replace(/[\s_-]+/g, "")
const log = (...a) => console.log(APPLY ? "  ✓" : "  ·", ...a)

if (!process.env.FRAMER_API_KEY) {
    console.error("Falta FRAMER_API_KEY (Framer → Settings → API Keys).")
    process.exit(1)
}

const framer = await connect(PROJECT_URL)
try {
    const info = await framer.getProjectInfo()
    console.log(`Proyecto: ${info.name ?? PROJECT_URL}${APPLY ? "" : "  [simulación, usa --apply para escribir]"}`)

    // 1. Code components
    console.log("\nCode components:")
    const dir = path.join(ROOT, "framer/code-components")
    const existing = await framer.getCodeFiles()
    for (const file of (await readdir(dir)).filter((f) => f.endsWith(".tsx"))) {
        const code = await readFile(path.join(dir, file), "utf8")
        const current = existing.find((f) => f.name === file || f.path === file)
        if (current) {
            log(`actualizar ${file}`)
            if (APPLY) await current.setFileContent(code)
        } else {
            log(`crear ${file}`)
            if (APPLY) await framer.createCodeFile(file.replace(/\.tsx$/, ""), code)
        }
    }

    // 2. Colección Projects y campos
    console.log("\nCMS:")
    let collection = (await framer.getCollections()).find((c) => norm(c.name) === "projects")
    if (!collection) {
        log("crear colección Projects")
        if (APPLY) collection = await framer.createCollection("Projects")
    }

    const fieldIds = {}
    if (collection) {
        const fields = await collection.getFields()
        const missing = []
        for (const f of FIELDS) {
            const found = fields.find((x) => norm(x.name) === norm(f.key))
            if (found) fieldIds[f.key] = found
            else missing.push(f)
        }
        if (missing.length) {
            log(`crear campos: ${missing.map((f) => f.key).join(", ")}`)
            if (APPLY) {
                const created = await collection.addFields(missing.map((f) => f.create))
                missing.forEach((f, i) => (fieldIds[f.key] = created[i]))
            }
        }
    }

    // 3. Items (upsert por slug)
    const projects = JSON.parse(await readFile(path.join(ROOT, "cms/projects.json"), "utf8"))
    const items = collection ? await collection.getItems() : []
    const toWrite = []
    for (const p of projects) {
        const current = items.find((i) => i.slug === p.Slug)
        log(`${current ? "actualizar" : "crear"} ${p.Title} (/${p.Slug})`)
        if (!APPLY) continue

        // Se adapta al tipo real de cada campo (p. ej. Category puede ser texto o desplegable).
        const fieldData = {}
        const set = (key, value) => {
            const field = fieldIds[key]
            if (!field || value === "" || value == null) return
            if (field.type === "enum") {
                const c = field.cases?.find((k) => k.name === value)
                if (c) fieldData[field.id] = { type: "enum", value: c.id }
            } else if (field.type === "formattedText") {
                fieldData[field.id] = { type: "formattedText", value, contentType: "html" }
            } else if (field.type === "number") {
                fieldData[field.id] = { type: "number", value: Number(value) }
            } else if (field.type === "string" || field.type === "link") {
                fieldData[field.id] = { type: field.type, value: String(value) }
            }
        }
        set("Title", p.Title)
        set("Category", p.Category)
        set("Year", p.Year)
        set("description_short", p.description_short)
        set("description_long", p.description_long)
        set("client_or_context", p.client_or_context)
        set("role", p.role)
        set("external_link", p.external_link)
        set("Order", p.Order)

        toWrite.push(current ? { id: current.id, slug: p.Slug, fieldData } : { slug: p.Slug, fieldData })
    }
    if (APPLY && toWrite.length) await collection.addItems(toWrite)

    console.log(APPLY ? "\nHecho. Revisa en Framer y publica cuando esté listo." : "\nSimulación terminada.")
} finally {
    await framer.disconnect()
}
