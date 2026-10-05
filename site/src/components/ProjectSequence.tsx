// ProjectSequence — la secuencia de fotos de un proyecto como tira de contacto.
// · Película con perforaciones y número de fotograma; se arrastra en horizontal.
// · Clic en un fotograma → visor a pantalla completa (← → , Esc, deslizar en móvil).
// Las fotos vienen del bloque @archive-data (scripts/sync-archive-data.mjs).

import * as React from "react"
import { thumb } from "../lib/media"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { createPortal } from "react-dom"

import { PROJECTS as _PROJECTS } from "../content/generated"
type ArchiveFile = { src: string; name: string }
type ArchiveProject = (typeof _PROJECTS)[number]
const PROJECTS: ArchiveProject[] = _PROJECTS

const INK = "var(--ag-ink, #111111)"
const PAPER = "var(--ag-paper, #F4F2ED)"
const FOG = "var(--ag-fog, #D7D4CD)"
const ASH = "var(--ag-ash, #7C7973)"
const UI = `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
const MONO = `"IBM Plex Mono", Menlo, monospace`
const DISPLAY = `"AG Bodoni", "Bodoni Moda", "Didot", Georgia, serif`
const opsz = (px: number) => `"opsz" ${Math.max(6, Math.min(96, Math.round(px)))}`
const EASE = [0.22, 1, 0.36, 1] as const
const AG_BODONI_CSS = `@font-face{font-family:"AG Bodoni";font-style:normal;font-weight:400 900;font-display:swap;src:url(/fonts/bodoni-moda.woff2) format("woff2")}@font-face{font-family:"AG Bodoni";font-style:italic;font-weight:400 900;font-display:swap;src:url(/fonts/bodoni-moda-italic.woff2) format("woff2")}`
function useAgBodoni() {
    React.useEffect(() => {
        if (typeof document === "undefined" || document.getElementById("ag-bodoni-face")) return
        const s = document.createElement("style")
        s.id = "ag-bodoni-face"
        s.textContent = AG_BODONI_CSS
        document.head.appendChild(s)
    }, [])
}
function typeset(t: string): React.ReactNode {
    if (!t || !t.includes("_")) return t
    return t.split(/(_)/).map((part, i) => (part === "_" ? <span key={i} style={{ fontFamily: MONO, fontWeight: 500, fontVariationSettings: "normal" }}>_</span> : part))
}

// Proyecto actual: el control (enlazado al título del CMS) o, si no, la URL /projects/<slug>
function useProject(hint: string): ArchiveProject | undefined {
    const byHint = (h: string) => {
        const k = (h || "").trim().toLowerCase()
        return PROJECTS.find((p) => p.slug === k || p.title.toLowerCase() === k)
    }
    const [p, setP] = React.useState<ArchiveProject | undefined>(() => byHint(hint))
    React.useEffect(() => {
        const fromHint = byHint(hint)
        if (fromHint) return setP(fromHint)
        const m = window.location.pathname.match(/\/projects\/([^/?#]+)/)
        setP((m && byHint(decodeURIComponent(m[1]))) || PROJECTS[0])
    }, [hint])
    return p
}


function Sprockets() {
    return <div aria-hidden style={{ height: 14, backgroundImage: "radial-gradient(ellipse 4px 3px at 50% 50%, rgba(244,242,237,.82) 98%, transparent 100%)", backgroundSize: "18px 14px", backgroundRepeat: "repeat-x", backgroundPosition: "6px 0" }} />
}

function Viewer({ p, start, onClose }: { p: ArchiveProject; start: number; onClose: () => void }) {
    const reduce = useReducedMotion()
    const [i, setI] = React.useState(start)
    const n = p.files.length
    const go = (d: number) => setI((x) => (x + d + n) % n)
    React.useEffect(() => {
        const on = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
            if (e.key === "ArrowRight") go(1)
            if (e.key === "ArrowLeft") go(-1)
        }
        window.addEventListener("keydown", on)
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            window.removeEventListener("keydown", on)
            document.body.style.overflow = prev
        }
    }, [])
    React.useEffect(() => {
        const nx = p.files[(i + 1) % n]
        if (nx) new Image().src = thumb(nx.src, 2048)
    }, [i])
    const f = p.files[i]
    return createPortal(
        <motion.div
            role="dialog"
            aria-label={`${p.title} — ${f.name}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ position: "fixed", inset: 0, zIndex: 2500, background: "#0B0B0B", color: "#F4F2ED", display: "flex", flexDirection: "column", fontFamily: UI }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 20px", fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.accent, flexShrink: 0 }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <span style={{ opacity: 0.6 }}>
                        {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                    </span>
                    <button type="button" onClick={onClose} aria-label="Cerrar" style={{ background: "none", border: "1px solid rgba(244,242,237,.5)", color: "inherit", fontFamily: MONO, fontSize: 11, padding: "3px 9px", cursor: "pointer" }}>
                        ESC ×
                    </button>
                </span>
            </div>
            <div style={{ position: "relative", flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 56px" }}>
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.img
                        key={f.src}
                        src={thumb(f.src, 2048)}
                        alt={`${p.title} — fotograma ${i + 1}`}
                        drag={reduce ? false : "x"}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.5}
                        onDragEnd={(_, info) => (info.offset.x < -60 ? go(1) : info.offset.x > 60 ? go(-1) : null)}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block", cursor: "grab", userSelect: "none" }}
                        draggable={false}
                    />
                </AnimatePresence>
                {n > 1 &&
                    [-1, 1].map((d) => (
                        <button key={d} type="button" aria-label={d < 0 ? "Anterior" : "Siguiente"} onClick={() => go(d)} style={{ position: "absolute", top: "50%", [d < 0 ? "left" : "right"]: 10, transform: "translateY(-50%)", width: 40, height: 40, border: "1px solid rgba(244,242,237,.4)", background: "rgba(11,11,11,.4)", color: "#F4F2ED", fontFamily: MONO, fontSize: 14, cursor: "pointer" }}>
                            {d < 0 ? "←" : "→"}
                        </button>
                    ))}
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "14px 16px 18px", overflowX: "auto" }}>
                {p.files.map((x, k) => (
                    <button key={x.src} type="button" onClick={() => setI(k)} aria-label={`Fotograma ${k + 1}`} style={{ flex: "0 0 auto", padding: 0, border: "none", background: "none", cursor: "pointer", outline: k === i ? `2px solid ${p.accent}` : "none", outlineOffset: 2, opacity: k === i ? 1 : 0.45, transition: "opacity .2s" }}>
                        <img src={thumb(x.src, 160)} alt="" style={{ height: 44, display: "block" }} />
                    </button>
                ))}
            </div>
        </motion.div>,
        document.body
    )
}

interface Props {
    project: string
    height: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1000
 * @framerIntrinsicHeight 330
 */
export default function ProjectSequence({ project, height: h0, style }: Props) {
    useAgBodoni()
    const height = Number(h0) || 230
    const p = useProject(project)
    const reduce = useReducedMotion()
    const [open, setOpen] = React.useState<number | null>(null)
    const wrap = React.useRef<HTMLDivElement>(null)
    const strip = React.useRef<HTMLDivElement>(null)
    const [limit, setLimit] = React.useState(0)
    const dragged = React.useRef(false)

    React.useLayoutEffect(() => {
        const m = () => setLimit(Math.min(0, (wrap.current?.clientWidth ?? 0) - (strip.current?.scrollWidth ?? 0)))
        m()
        const ro = new ResizeObserver(m)
        if (wrap.current) ro.observe(wrap.current)
        if (strip.current) ro.observe(strip.current)
        return () => ro.disconnect()
    }, [p, height])

    if (!p) return <div style={{ ...style, height }} />
    const code = p.title.replace(/[^A-Z0-9]/gi, "").slice(0, 4).toUpperCase()

    return (
        <div style={{ ...style, width: "100%", fontFamily: UI, color: INK }}>
            <div ref={wrap} style={{ position: "relative", overflow: "hidden", background: "#121212", padding: "0 0", cursor: limit < 0 ? "grab" : "default" }}>
                <Sprockets />
                <motion.div
                    ref={strip}
                    drag={limit < 0 ? "x" : false}
                    dragConstraints={{ left: limit, right: 0 }}
                    dragElastic={0.06}
                    dragTransition={{ power: 0.25, timeConstant: 260 }}
                    onDragStart={() => (dragged.current = true)}
                    onDragEnd={() => window.setTimeout(() => (dragged.current = false), 0)}
                    style={{ display: "flex", gap: 10, padding: "8px 12px", width: "max-content" }}
                >
                    {p.files.map((f, i) => (
                        <motion.button
                            key={f.src}
                            type="button"
                            onClick={() => !dragged.current && setOpen(i)}
                            aria-label={`Ver fotograma ${i + 1} de ${p.title}`}
                            initial={reduce ? false : { opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: EASE, delay: Math.min(i, 8) * 0.05 }}
                            whileHover={reduce ? undefined : { y: -3 }}
                            style={{ flex: "0 0 auto", padding: 0, border: "none", background: "none", cursor: "zoom-in", display: "flex", flexDirection: "column", gap: 6 }}
                        >
                            <img src={thumb(f.src, 768)} alt="" loading="lazy" draggable={false} style={{ height, display: "block", userSelect: "none" }} />
                            <span style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.12em", color: "rgba(244,242,237,.78)" }}>
                                <span>
                                    {code} ▸ {String(i + 1).padStart(2, "0")}A
                                </span>
                                <span style={{ color: p.accent === "#111111" ? "inherit" : p.accent, filter: "brightness(1.6)" }}>■</span>
                            </span>
                        </motion.button>
                    ))}
                </motion.div>
                <Sprockets />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 10, fontFamily: MONO, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: ASH }}>
                <span>
                    {p.files.length} fotogramas · {limit < 0 ? "arrastra la tira" : "clic para ampliar"}
                </span>
                <span>Clic = pantalla completa · ← →</span>
            </div>
            <AnimatePresence>{open !== null && typeof document !== "undefined" && <Viewer p={p} start={open} onClose={() => setOpen(null)} />}</AnimatePresence>
        </div>
    )
}

ProjectSequence.defaultProps = { project: "", height: 230 }

addPropertyControls(ProjectSequence, {
    project: { type: ControlType.String, title: "Proyecto", placeholder: "Título o slug (vacío = URL)" },
    height: { type: ControlType.Number, title: "Alto", min: 120, max: 420, step: 10, unit: "px" },
})
