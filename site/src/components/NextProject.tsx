// NextProject — cierre de la página de proyecto: "Siguiente proyecto" a lo grande.
// El título en Bodoni enlaza al siguiente; al pasar el ratón su portada sigue al cursor.
// Debajo: anterior y vuelta al índice. Datos del bloque @archive-data.

import * as React from "react"
import { thumb } from "../lib/media"
import { addPropertyControls, ControlType, Link } from "framer"
import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from "framer-motion"

import { PROJECTS as _PROJECTS } from "../content/generated"
type ArchiveFile = { src: string; name: string }
type ArchiveProject = (typeof _PROJECTS)[number]
const PROJECTS: ArchiveProject[] = _PROJECTS

const INK = "var(--ag-ink, #111111)"
const PAPER = "var(--ag-paper, #F4F2ED)"
const FOG = "var(--ag-fog, #D7D4CD)"
const ASH = "var(--ag-ash, #625f59)"
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


function useNarrow(bp = 700) {
    const [n, setN] = React.useState(false)
    React.useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${bp}px)`)
        const u = () => setN(mq.matches)
        u()
        mq.addEventListener?.("change", u)
        return () => mq.removeEventListener?.("change", u)
    }, [bp])
    return n
}

interface Props {
    project: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1000
 * @framerIntrinsicHeight 360
 */
export default function NextProject({ project, style }: Props) {
    useAgBodoni()
    const cur = useProject(project)
    const narrow = useNarrow()
    const reduce = useReducedMotion()
    const list = [...PROJECTS].sort((a, b) => a.number - b.number)
    const idx = Math.max(0, list.findIndex((p) => p.slug === cur?.slug))
    const next = list[(idx + 1) % list.length]
    const prev = list[(idx - 1 + list.length) % list.length]
    const [hover, setHover] = React.useState(false)
    const box = React.useRef<HTMLDivElement>(null)
    const mx = useMotionValue(0)
    const my = useMotionValue(0)
    const x = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.6 })
    const y = useSpring(my, { stiffness: 180, damping: 22, mass: 0.6 })

    if (!next) return null
    const size = narrow ? 44 : 112

    return (
        <div
            ref={box}
            onPointerMove={(e) => {
                const r = box.current!.getBoundingClientRect()
                mx.set(e.clientX - r.left)
                my.set(e.clientY - r.top)
            }}
            style={{ ...style, position: "relative", width: "100%", fontFamily: UI, color: INK, padding: narrow ? "8px 0" : "8px 0 4px", overflow: "visible" }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontFamily: MONO, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: ASH }}>
                <span>Siguiente proyecto →</span>
                <span>
                    {String(next.number).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
                </span>
            </div>

            <Link href={next.link}>
                <a
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onFocus={() => setHover(true)}
                    onBlur={() => setHover(false)}
                    style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginTop: narrow ? 10 : 14, color: INK, textDecoration: "none" }}
                >
                    <motion.span
                        animate={{ x: hover && !reduce ? 14 : 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        style={{ fontFamily: DISPLAY, fontVariationSettings: opsz(size), fontSize: size, lineHeight: 0.98, letterSpacing: "-0.02em", paddingBottom: "0.04em" }}
                    >
                        {typeset(next.title)}
                    </motion.span>
                    {narrow ? (
                        <img src={thumb(next.cover, 320)} alt="" style={{ width: 64, height: 80, objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                        <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.04em", paddingBottom: 18, whiteSpace: "nowrap" }}>
                            {next.category} · {next.year}
                        </span>
                    )}
                </a>
            </Link>
            <div style={{ height: 2, marginTop: 14, background: FOG, position: "relative", overflow: "hidden" }}>
                <motion.div animate={{ scaleX: hover ? 1 : 0 }} transition={{ duration: 0.6, ease: EASE }} style={{ position: "absolute", inset: 0, background: next.accent, transformOrigin: "0 50%" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginTop: 14, fontFamily: MONO, fontSize: 11, letterSpacing: "0.04em" }}>
                <Link href={prev.link}>
                    <a style={{ color: ASH, textDecoration: "none" }}>← {typeset(prev.title)}</a>
                </Link>
                <Link href="/projects">
                    <a style={{ color: INK, textDecoration: "none", borderBottom: `1px solid ${INK}` }}>Volver al índice</a>
                </Link>
            </div>

            {/* Portada que sigue al cursor */}
            {!narrow && (
                <AnimatePresence>
                    {hover && (
                        <motion.img
                            key={next.slug}
                            src={thumb(next.cover, 768)}
                            alt=""
                            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                            animate={{ opacity: 1, scale: 1, rotate: -2 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: EASE }}
                            style={{ position: "absolute", left: 0, top: 0, x, y, translateX: "-50%", translateY: "-105%", width: 240, height: 300, objectFit: "cover", pointerEvents: "none", zIndex: 5, boxShadow: "0 24px 50px rgba(0,0,0,.25)" }}
                        />
                    )}
                </AnimatePresence>
            )}
        </div>
    )
}

NextProject.defaultProps = { project: "" }

addPropertyControls(NextProject, {
    project: { type: ControlType.String, title: "Proyecto", placeholder: "Título o slug (vacío = URL)" },
})
