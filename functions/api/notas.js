// Libro de visitas (Cloudflare Pages Functions + base de datos D1 "anagil-visitas").
// GET    /api/notas            → últimas notas visibles
// POST   /api/notas            → { nombre, rol, texto, color, web } (web = trampa para bots)
// DELETE /api/notas?id=N       → ocultar una nota (cabecera "x-clave" = variable ADMIN_KEY)
const COLORES = ["amarillo", "rosa", "azul", "verde", "papel"]
const MAX_TEXTO = 400
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } })

let listo = false
async function ensure(db) {
    if (listo) return
    await db.batch([
        db.prepare("CREATE TABLE IF NOT EXISTS notas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, rol TEXT NOT NULL DEFAULT '', texto TEXT NOT NULL, color TEXT NOT NULL DEFAULT 'amarillo', ip TEXT NOT NULL DEFAULT '', oculto INTEGER NOT NULL DEFAULT 0, creado INTEGER NOT NULL)"),
        db.prepare("CREATE INDEX IF NOT EXISTS notas_creado ON notas(creado)"),
        db.prepare("CREATE INDEX IF NOT EXISTS notas_ip ON notas(ip, creado)"),
    ])
    listo = true
}

async function ipHash(request) {
    const ip = request.headers.get("cf-connecting-ip") || "0"
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`anagil:${ip}`))
    return [...new Uint8Array(buf)].slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("")
}

const limpiar = (s, max) =>
    String(s || "")
        .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "")
        .replace(/https?:\/\/\S+|www\.\S+/gi, "") // sin enlaces
        .replace(/\n{3,}/g, "\n\n")
        .trim()
        .slice(0, max)

export async function onRequestGet({ env }) {
    if (!env.DB) return json({ error: "sin base de datos" }, 503)
    await ensure(env.DB)
    const { results } = await env.DB.prepare("SELECT id, nombre, rol, texto, color, creado FROM notas WHERE oculto = 0 ORDER BY creado DESC LIMIT 200").all()
    return json({ notas: results })
}

export async function onRequestPost({ request, env }) {
    if (!env.DB) return json({ error: "sin base de datos" }, 503)
    let body
    try {
        body = await request.json()
    } catch {
        return json({ error: "formato" }, 400)
    }
    if (body.web) return json({ ok: true }) // bot
    await ensure(env.DB)
    const nombre = limpiar(body.nombre, 40)
    const rol = limpiar(body.rol, 40)
    const texto = limpiar(body.texto, MAX_TEXTO)
    const color = COLORES.includes(body.color) ? body.color : "amarillo"
    if (nombre.length < 2 || texto.length < 3) return json({ error: "Escribe tu nombre y una nota." }, 400)
    const ip = await ipHash(request)
    const now = Date.now()
    const recientes = await env.DB.prepare("SELECT COUNT(*) AS n FROM notas WHERE ip = ? AND creado > ?").bind(ip, now - 86400000).first()
    const ultimo = await env.DB.prepare("SELECT MAX(creado) AS t FROM notas WHERE ip = ?").bind(ip).first()
    if ((recientes?.n || 0) >= 5) return json({ error: "Ya has dejado varias notas hoy. ¡Gracias!" }, 429)
    if (ultimo?.t && now - ultimo.t < 30000) return json({ error: "Espera un momento antes de dejar otra nota." }, 429)
    const r = await env.DB.prepare("INSERT INTO notas (nombre, rol, texto, color, ip, creado) VALUES (?, ?, ?, ?, ?, ?)").bind(nombre, rol, texto, color, ip, now).run()
    return json({ nota: { id: r.meta?.last_row_id, nombre, rol, texto, color, creado: now } }, 201)
}

export async function onRequestDelete({ request, env }) {
    const id = Number(new URL(request.url).searchParams.get("id"))
    if (!env.ADMIN_KEY || request.headers.get("x-clave") !== env.ADMIN_KEY) return json({ error: "no autorizado" }, 401)
    await env.DB.prepare("UPDATE notas SET oculto = 1 WHERE id = ?").bind(id).run()
    return json({ ok: true })
}
