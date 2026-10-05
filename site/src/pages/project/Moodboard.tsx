// Moodboard — el corcho del proyecto: fotos, proceso, notas, cita, color y telas, sueltos y con alfiler.
// Se arrastran, el que tocas pasa delante, doble clic para verlo grande. "Ordenar" los pone en rejilla.
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "framer"
import Window, { INK, ASH, PAPER, MONO, DISPLAY, opsz, ChromeCtx } from "../../shell/Window"
import { TEJIDOS, type Project } from "../../content/generated"
import { thumb, imgInfo } from "../../lib/media"

type Item =
    | { kind: "photo"; key: string; src: string; nota?: string; w: number }
    | { kind: "note"; key: string; text: string; tone: "paper" | "yellow"; w: number }
    | { kind: "quote"; key: string; text: string; w: number }
    | { kind: "color"; key: string; color: string; w: number }
    | { kind: "fabric"; key: string; src: string; name: string; w: number }

// Corcho: color + grano hecho con ruido SVG (sin imágenes)
const CORK = `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .25  0 0 0 0 .15  0 0 0 0 .07  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
)}") , radial-gradient(ellipse at 50% 40%, #C79A68, #A97A4C)`

function rng(seed: number) {
    return () => {
        seed = (seed * 9301 + 49297) % 233280
        return seed / 233280
    }
}

function buildItems(p: Project): Item[] {
    const items: Item[] = []
    const notas = new Map(p.proceso.map((x) => [x.src, x.nota]))
    p.proceso.forEach((x) => items.push({ kind: "photo", key: x.src, src: x.src, nota: x.nota, w: 0.2 }))
    p.files.forEach((f, i) => items.push({ kind: "photo", key: f.src, src: f.src, nota: notas.get(f.src), w: i === 0 ? 0.24 : 0.17 }))
    if (p.cita) items.push({ kind: "quote", key: "cita", text: p.cita, w: 0.22 })
    const first = (p.concepto || "").replace(/<[^>]+>/g, " ").split(/(?<=\.)\s/)[0]?.trim()
    if (first) items.push({ kind: "note", key: "concepto", text: first, tone: "yellow", w: 0.2 })
    if (p.keywords) items.push({ kind: "note", key: "claves", text: p.keywords.split(/\s+/).slice(0, 6).join(" · "), tone: "paper", w: 0.16 })
    items.push({ kind: "color", key: "color", color: p.accent, w: 0.09 })
    p.tejidos.forEach((id) => {
        const t = TEJIDOS.find((x) => x.id === id)
        if (t) items.push({ kind: "fabric", key: `t-${id}`, src: t.src, name: t.nombre, w: 0.11 })
    })
    return items
}

function Pin({ color = "#B23A2B" }: { color?: string }) {
    return (
        <span aria-hidden style={{ position: "absolute", left: "50%", top: -7, width: 14, height: 14, marginLeft: -7, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff8, ${color} 45%, #0005)`, boxShadow: "1px 3px 3px rgba(0,0,0,.35)", zIndex: 2 }} />
    )
}

function Card({ it, W }: { it: Item; W: number }) {
    const w = Math.round(it.w * W)
    if (it.kind === "photo") {
        const inf = imgInfo(it.src)
        return (
            <div style={{ position: "relative", width: w, background: "#fff", padding: Math.max(5, w * 0.04), paddingBottom: it.nota ? Math.max(5, w * 0.04) : Math.max(5, w * 0.04) }}>
                <Pin />
                <img src={thumb(it.src, w * 2)} alt={it.nota || ""} draggable={false} style={{ display: "block", width: "100%", aspectRatio: inf ? `${inf.w} / ${inf.h}` : "4 / 5", objectFit: "cover", pointerEvents: "none" }} />
                {it.nota && <div style={{ marginTop: 6, fontFamily: DISPLAY, fontStyle: "italic", fontSize: Math.max(11, w * 0.055), lineHeight: 1.25, color: "#222", fontVariationSettings: opsz(14) }}>{it.nota}</div>}
            </div>
        )
    }
    if (it.kind === "note")
        return (
            <div style={{ position: "relative", width: w, padding: "16px 14px", background: it.tone === "yellow" ? "#F6E7A6" : "#FFFEFA", fontFamily: it.tone === "yellow" ? DISPLAY : MONO, fontStyle: it.tone === "yellow" ? "italic" : "normal", fontSize: it.tone === "yellow" ? Math.max(13, w * 0.07) : 10.5, letterSpacing: it.tone === "yellow" ? 0 : "0.06em", textTransform: it.tone === "yellow" ? "none" : "uppercase", lineHeight: 1.35, color: "#222" }}>
                <Pin color="#2B5BAA" />
                {it.text}
            </div>
        )
    if (it.kind === "quote")
        return (
            <div style={{ position: "relative", width: w, padding: "20px 18px", background: "#111", color: "#F4F2ED", fontFamily: DISPLAY, fontStyle: "italic", fontSize: Math.max(14, w * 0.075), lineHeight: 1.2, fontVariationSettings: opsz(24) }}>
                <Pin color="#E8E2D6" />“{it.text}”
            </div>
        )
    if (it.kind === "color")
        return (
            <div style={{ position: "relative", width: w, background: "#fff", padding: 5 }}>
                <Pin />
                <div style={{ aspectRatio: "1", background: it.color }} />
                <div style={{ fontFamily: MONO, fontSize: 9, marginTop: 4, color: "#333" }}>{it.color.toUpperCase()}</div>
            </div>
        )
    return (
        <div style={{ position: "relative", width: w }}>
            <img src={thumb(it.src, w * 2)} alt={it.name} draggable={false} style={{ display: "block", width: "100%", aspectRatio: "1", objectFit: "cover", pointerEvents: "none", clipPath: "polygon(0 4%,4% 0,8% 4%,12% 0,16% 4%,20% 0,24% 4%,28% 0,32% 4%,36% 0,40% 4%,44% 0,48% 4%,52% 0,56% 4%,60% 0,64% 4%,68% 0,72% 4%,76% 0,80% 4%,84% 0,88% 4%,92% 0,96% 4%,100% 0,100% 96%,96% 100%,92% 96%,88% 100%,84% 96%,80% 100%,76% 96%,72% 100%,68% 96%,64% 100%,60% 96%,56% 100%,52% 96%,48% 100%,44% 96%,40% 100%,36% 96%,32% 100%,28% 96%,24% 100%,20% 96%,16% 100%,12% 96%,8% 100%,4% 96%,0 100%)" }} />
            <span style={{ position: "absolute", left: 4, bottom: -16, fontFamily: MONO, fontSize: 9, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,.5)" }}>{it.name}</span>
        </div>
    )
}

export default function Moodboard({ project }: { project: Project }) {
    const ios = React.useContext(ChromeCtx) === "ios"
    const items = React.useMemo(() => buildItems(project), [project])
    const board = React.useRef<HTMLDivElement>(null)
    const [size, setSize] = React.useState({ w: 1000, h: 640 })
    const [tidy, setTidy] = React.useState(false)
    const [z, setZ] = React.useState<Record<string, number>>({})
    const top = React.useRef(10)
    const [zoom, setZoom] = React.useState<Item | null>(null)
    const [seed, setSeed] = React.useState(project.number * 97 + 13)

    React.useLayoutEffect(() => {
        const el = board.current
        if (!el) return
        const u = () => setSize({ w: el.clientWidth, h: el.clientHeight })
        u()
        const ro = new ResizeObserver(u)
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const W = ios ? size.w * 1.7 : size.w
    // Posiciones: sueltas (aleatorias pero estables) u ordenadas en rejilla
    const pos = React.useMemo(() => {
        const r = rng(seed)
        const cols = ios ? 2 : 5
        return items.map((it, k) => {
            if (tidy) {
                const cw = size.w / cols
                return { x: (k % cols) * cw + cw * 0.08, y: Math.floor(k / cols) * (ios ? 260 : 230) + 24, rot: 0 }
            }
            const w = it.w * W
            return { x: r() * Math.max(10, size.w - w - 20) + 10, y: r() * Math.max(10, size.h - w * 1.2 - 20) + 14, rot: (r() - 0.5) * 12 }
        })
    }, [items, tidy, size.w, size.h, seed, W, ios])

    const front = (key: string) => setZ((m) => ({ ...m, [key]: ++top.current }))
    const btn: React.CSSProperties = { fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 10px", border: `1px solid ${INK}`, background: "transparent", color: INK, cursor: "pointer" }

    return (
        <Window
            label={`Moodboard de ${project.title}`}
            title={
                <>
                    Moodboard <span style={{ color: ASH }}>— {project.title}</span>
                </>
            }
            toolbar={
                <div style={{ display: "flex", gap: 8, alignItems: "center", width: "100%" }}>
                    <button type="button" style={btn} onClick={() => setTidy((t) => !t)}>
                        {tidy ? "Desordenar" : "Ordenar"}
                    </button>
                    {!tidy && (
                        <button type="button" style={btn} onClick={() => setSeed((s) => s + 7)}>
                            Barajar
                        </button>
                    )}
                    <span style={{ flex: 1 }} />
                    <Link href={project.link}>
                        <a style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", color: INK }}>← Libro</a>
                    </Link>
                </div>
            }
            status={
                <>
                    <span>{items.length} piezas en el corcho</span>
                    <span className="ag-hide-narrow">Arrastra · doble clic para ampliar</span>
                </>
            }
            bodyStyle={{ overflow: ios ? "visible" : "hidden" }}
        >
            <div ref={board} style={{ position: "relative", width: "100%", height: ios ? Math.max(900, Math.ceil(items.length / 2) * 270 + 60) : "100%", minHeight: 420, background: CORK, boxShadow: "inset 0 0 0 10px #8B5E34, inset 0 0 0 11px #6E4826, inset 0 0 60px rgba(0,0,0,.25)", overflow: "hidden" }}>
                {items.map((it, k) => (
                    <motion.div
                        key={it.key}
                        drag
                        dragMomentum={false}
                        dragConstraints={board}
                        dragElastic={0.05}
                        onPointerDown={() => front(it.key)}
                        onDoubleClick={() => it.kind === "photo" && setZoom(it)}
                        initial={{ opacity: 0, scale: 0.85, x: pos[k].x, y: pos[k].y - 30, rotate: pos[k].rot }}
                        animate={{ opacity: 1, scale: 1, x: pos[k].x, y: pos[k].y, rotate: pos[k].rot }}
                        transition={{ type: "spring", stiffness: 160, damping: 20, delay: Math.min(k * 0.03, 0.5) }}
                        whileDrag={{ scale: 1.05, rotate: 0, boxShadow: "0 24px 40px rgba(0,0,0,.35)" }}
                        style={{ position: "absolute", left: 0, top: 0, zIndex: z[it.key] ?? 1 + k, cursor: "grab", boxShadow: "0 6px 14px rgba(0,0,0,.28)", touchAction: "none" }}
                    >
                        <Card it={it} W={ios ? size.w * 1.7 : size.w} />
                    </motion.div>
                ))}

                <AnimatePresence>
                    {zoom && zoom.kind === "photo" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setZoom(null)} style={{ position: "absolute", inset: 0, zIndex: 999, background: "rgba(20,14,8,.78)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, cursor: "zoom-out" }}>
                            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={thumb(zoom.src, 1600)} alt={zoom.nota || ""} style={{ maxWidth: "100%", maxHeight: "86%", objectFit: "contain", background: "#fff", padding: 8, boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
                            {zoom.nota && <p style={{ margin: "14px 0 0", maxWidth: 560, textAlign: "center", fontFamily: DISPLAY, fontStyle: "italic", fontSize: 18, color: PAPER, fontVariationSettings: opsz(18) }}>{zoom.nota}</p>}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Window>
    )
}
