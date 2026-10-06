// Libro de visitas — app de Notas: quien visita deja una nota con su nombre (y quién es).
// Las notas se guardan en la base de datos de Cloudflare (functions/api/notas.js).
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Window, { INK, ASH, PAPER, SHEET, FOG, MONO, UI, DISPLAY, opsz, ChromeCtx } from "../shell/Window"
import { track } from "../lib/analytics"

type Nota = { id: number; nombre: string; rol: string; texto: string; color: string; creado: number }
const COLORES: Record<string, string> = { amarillo: "#F6E7A6", rosa: "#F3CFCB", azul: "#CFE0EE", verde: "#D6E3C9", papel: "#FFFEFA" }
const ROLES = ["Reclutador/a", "Profesor/a", "Estudiante", "Diseñador/a", "Amigo/a", "Familia"]

const fecha = (t: number) => new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric" }).format(new Date(t))
const giro = (id: number) => (((id * 37) % 7) - 3) * 0.6

export default function Visitas() {
    const ios = React.useContext(ChromeCtx) === "ios"
    const [notas, setNotas] = React.useState<Nota[] | null>(null)
    const [offline, setOffline] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [form, setForm] = React.useState({ nombre: "", rol: "", texto: "", color: "amarillo", web: "" })
    const [estado, setEstado] = React.useState<"" | "enviando" | "error" | "ok">("")
    const [msg, setMsg] = React.useState("")
    const nuevo = React.useRef<number | null>(null)

    React.useEffect(() => {
        fetch("/api/notas")
            .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
            .then((j) => setNotas(j.notas || []))
            .catch(() => {
                setOffline(true)
                setNotas([])
            })
    }, [])

    const enviar = async (e: React.FormEvent) => {
        e.preventDefault()
        setEstado("enviando")
        try {
            const r = await fetch("/api/notas", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) })
            const j = await r.json().catch(() => ({}))
            if (!r.ok) throw new Error(j.error || "No se pudo pegar la nota.")
            if (j.nota) {
                nuevo.current = j.nota.id
                setNotas((n) => [j.nota, ...(n || [])])
            }
            track("libro-de-visitas")
            setEstado("ok")
            setForm({ nombre: "", rol: "", texto: "", color: form.color, web: "" })
            window.setTimeout(() => {
                setOpen(false)
                setEstado("")
            }, 900)
        } catch (err: any) {
            setEstado("error")
            setMsg(err?.message || "No se pudo pegar la nota.")
        }
    }

    const input: React.CSSProperties = { width: "100%", border: "none", borderBottom: `1px solid ${FOG}`, background: "transparent", fontFamily: UI, fontSize: 14, padding: "9px 2px", outline: "none", color: INK }
    const btn: React.CSSProperties = { fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", padding: "5px 11px", border: `1px solid ${INK}`, background: "transparent", color: INK, cursor: "pointer" }

    return (
        <Window
            label="Libro de visitas"
            title="Libro de visitas"
            toolbar={
                <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
                    <button type="button" onClick={() => setOpen((o) => !o)} style={{ ...btn, background: open ? "transparent" : INK, color: open ? INK : PAPER }}>
                        {open ? "Cancelar" : "✎ Dejar una nota"}
                    </button>
                    <span style={{ fontFamily: MONO, fontSize: 10.5, color: ASH, letterSpacing: "0.04em" }}>{notas ? `${notas.length} ${notas.length === 1 ? "nota" : "notas"}` : "…"}</span>
                </div>
            }
            status={
                <>
                    <span>Gracias por pasar</span>
                    <span className="ag-hide-narrow">Las notas son públicas</span>
                </>
            }
            bodyStyle={{ background: SHEET }}
        >
            <div style={{ padding: ios ? "16px 14px 40px" : "26px 28px 40px" }}>
                <AnimatePresence initial={false}>
                    {open && (
                        <motion.form
                            onSubmit={enviar}
                            initial={{ opacity: 0, y: -12, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -12, height: 0 }}
                            style={{ overflow: "hidden", marginBottom: 26 }}
                        >
                            <div style={{ maxWidth: 520, margin: "4px auto 0", padding: "22px 22px 18px", background: COLORES[form.color], boxShadow: "0 10px 26px rgba(0,0,0,.12)", transform: "rotate(-0.6deg)" }}>
                                <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: ASH, marginBottom: 6 }}>Nueva nota para Ana</div>
                                <textarea required maxLength={400} value={form.texto} onChange={(e) => setForm({ ...form, texto: e.target.value })} placeholder="Escribe aquí tu nota…" rows={4} style={{ ...input, resize: "none", fontFamily: DISPLAY, fontStyle: "italic", fontSize: 19, lineHeight: 1.35, fontVariationSettings: opsz(19), borderBottom: "none" }} />
                                <div style={{ display: "grid", gridTemplateColumns: ios ? "1fr" : "1fr 1fr", gap: 10 }}>
                                    <input required maxLength={40} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre" autoComplete="name" style={input} />
                                    <input maxLength={40} list="ag-roles" value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })} placeholder="¿Quién eres? (opcional)" style={input} />
                                    <datalist id="ag-roles">
                                        {ROLES.map((r) => (
                                            <option key={r} value={r} />
                                        ))}
                                    </datalist>
                                </div>
                                <input tabIndex={-1} aria-hidden autoComplete="off" value={form.web} onChange={(e) => setForm({ ...form, web: e.target.value })} style={{ position: "absolute", left: -9999, width: 1, height: 1 }} />
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                                    <div style={{ display: "flex", gap: 6 }} role="radiogroup" aria-label="Color de la nota">
                                        {Object.entries(COLORES).map(([k, v]) => (
                                            <button key={k} type="button" role="radio" aria-checked={form.color === k} aria-label={k} onClick={() => setForm({ ...form, color: k })} style={{ width: 20, height: 20, borderRadius: "50%", background: v, border: `1px solid ${form.color === k ? INK : "rgba(0,0,0,.2)"}`, outline: form.color === k ? `2px solid ${INK}` : "none", outlineOffset: 1, cursor: "pointer", padding: 0 }} />
                                        ))}
                                    </div>
                                    <button type="submit" disabled={estado === "enviando"} style={{ ...btn, background: INK, color: PAPER }}>
                                        {estado === "enviando" ? "Pegando…" : estado === "ok" ? "¡Pegada!" : "Pegar nota"}
                                    </button>
                                </div>
                                {estado === "error" && <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "#B23A2B" }}>{offline ? "El libro de visitas funciona en la web publicada." : msg}</p>}
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                {notas && notas.length === 0 && !open && (
                    <div style={{ textAlign: "center", padding: "60px 20px", color: ASH }}>
                        <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 30, color: INK, fontVariationSettings: opsz(30) }}>Todavía no hay notas.</div>
                        <p style={{ fontSize: 14, margin: "10px 0 18px" }}>Sé la primera persona en dejarle algo a Ana.</p>
                        <button type="button" onClick={() => setOpen(true)} style={{ ...btn, background: INK, color: PAPER }}>
                            ✎ Dejar una nota
                        </button>
                    </div>
                )}

                <div style={{ columnWidth: ios ? 150 : 220, columnGap: ios ? 14 : 24 }}>
                    {(notas || []).map((n) => (
                        <motion.article
                            key={n.id}
                            initial={n.id === nuevo.current ? { opacity: 0, scale: 1.3, rotate: -8, y: -40 } : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, scale: 1, rotate: giro(n.id), y: 0 }}
                            transition={{ type: "spring", stiffness: 220, damping: 18 }}
                            style={{ breakInside: "avoid", display: "inline-block", width: "100%", margin: "0 0 22px", padding: "18px 16px 14px", background: COLORES[n.color] || COLORES.amarillo, boxShadow: "0 1px 0 rgba(0,0,0,.05), 0 10px 18px rgba(0,0,0,.1)", position: "relative" }}
                        >
                            <span aria-hidden style={{ position: "absolute", left: "50%", top: -8, width: 54, height: 16, marginLeft: -27, background: "rgba(255,255,255,.55)", boxShadow: "0 1px 2px rgba(0,0,0,.08)", transform: `rotate(${-giro(n.id) * 2}deg)` }} />
                            <p style={{ margin: 0, fontFamily: DISPLAY, fontStyle: "italic", fontSize: 17, lineHeight: 1.35, whiteSpace: "pre-wrap", overflowWrap: "anywhere", color: "#1C1C1C", fontVariationSettings: opsz(17) }}>{n.texto}</p>
                            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                                <span style={{ fontFamily: DISPLAY, fontSize: 15, color: "#1F2C4D", fontVariationSettings: opsz(15) }}>— {n.nombre}</span>
                                <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", color: "rgba(0,0,0,.72)", textTransform: "uppercase", textAlign: "right" }}>
                                    {n.rol && (
                                        <>
                                            {n.rol}
                                            <br />
                                        </>
                                    )}
                                    {fecha(n.creado)}
                                </span>
                            </div>
                        </motion.article>
                    ))}
                </div>
                {offline && !open && <p style={{ textAlign: "center", fontSize: 12, color: ASH }}>El libro de visitas se activa en la web publicada.</p>}
            </div>
        </Window>
    )
}
