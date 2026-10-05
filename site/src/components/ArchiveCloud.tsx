// ArchiveCloud — "nube de archivos" del escritorio de Ana Gil.
// Todas las fotos de los proyectos (desde ArchiveData, sincronizado con el CMS) se colocan
// como archivos agrupados por proyecto en un halo alrededor de la cara del retrato.
// · 3 tamaños: portada (con etiqueta), detalle y pequeño.
// · Al pasar el ratón por un archivo se ilumina todo su proyecto; el resto se atenúa.
// · Clic abre el proyecto; se pueden arrastrar.
// · Visualización → Ordenar (evento "ag:arrange") los lleva a columnas; Desordenar vuelve al halo.
// · En móvil: una pila deslizable por proyecto.

import * as React from "react"
import { thumb } from "../lib/media"
import { addPropertyControls, ControlType, RenderTarget, Link } from "framer"
import { motion, useReducedMotion } from "framer-motion"

import { PROJECTS as _PROJECTS } from "../content/generated"
type ArchiveFile = { src: string; name: string }
type ArchiveProject = (typeof _PROJECTS)[number]
const PROJECTS: ArchiveProject[] = _PROJECTS

const INK = "var(--ag-ink, #111111)"
const PAPER = "var(--ag-paper, #F4F2ED)"

// Texto sobre un acento: los acentos de proyecto son oscuros, así que el texto es papel claro
// también en modo noche; el acento "tinta" se invierte con el tema.
// Transición icono → portada: AgSystem hace crecer la foto pulsada hasta la portada del libro.
function openCover(root: Element | null, link?: string) {
    if (!root || !link || !link.startsWith("/projects/")) return
    const img = root.querySelector("img")
    if (!img) return
    const r = img.getBoundingClientRect()
    window.dispatchEvent(
        new CustomEvent("ag:open-cover", { detail: { src: img.currentSrc || img.src, rect: { x: r.left, y: r.top, w: r.width, h: r.height } } })
    )
}

const isInk = (a?: string) => !a || /--ag-ink|af4fc6f1|^#111111$/i.test(a.trim())
const acc = (a?: string) => (isInk(a) ? INK : (a as string))
const onAccent = (a?: string) => (isInk(a) ? PAPER : "#F4F2ED")

const MONO = `"IBM Plex Mono", Menlo, monospace`
const DISPLAY = `"AG Bodoni", "Bodoni Moda", "Didot", Georgia, serif`
// Tamaño óptico de la Bodoni ajustado al tamaño real (con opsz 96 en tamaños medianos los trazos finos desaparecen)
const opsz = (px: number) => `"opsz" ${Math.max(6, Math.min(96, Math.round(px)))}`

// Bodoni Moda variable (con eje de tamaño óptico) bajo un nombre propio, para no depender de la versión que cargue Framer
const AG_BODONI_CSS = `@font-face{font-family:"AG Bodoni";font-style:normal;font-weight:400 900;font-display:swap;src:url(/fonts/bodoni-moda.woff2) format("woff2")}@font-face{font-family:"AG Bodoni";font-style:italic;font-weight:400 900;font-display:swap;src:url(/fonts/bodoni-moda-italic.woff2) format("woff2")}`
// La Bodoni Moda apenas dibuja el guion bajo: lo componemos en mono (encaja con 404:NOT FOUND_ y EX_CORPO)
function typeset(t: string): React.ReactNode {
    if (!t || !t.includes("_")) return t
    return t.split(/(_)/).map((part, i) =>
        part === "_" ? (
            <span key={i} style={{ fontFamily: `"IBM Plex Mono", Menlo, monospace`, fontWeight: 500, fontVariationSettings: "normal", letterSpacing: 0 }}>
                _
            </span>
        ) : (
            part
        )
    )
}

function useAgBodoni() {
    React.useEffect(() => {
        if (typeof document === "undefined" || document.getElementById("ag-bodoni-face")) return
        const s = document.createElement("style")
        s.id = "ag-bodoni-face"
        s.textContent = AG_BODONI_CSS
        document.head.appendChild(s)
    }, [])
}
const EASE = [0.22, 1, 0.36, 1] as const


// Pseudoaleatorio estable (misma composición en cada visita)
function rand(seed: number) {
    const x = Math.sin(seed * 9301 + 49297) * 233280
    return x - Math.floor(x)
}

type Placed = {
    key: string
    project: ArchiveProject
    index: number
    src: string
    name: string
    size: number
    x: number
    y: number
    rotate: number
    isCover: boolean
}

// Ángulo (grados, 0 = derecha, sentido horario en pantalla) de cada racimo alrededor de la cara
const ANGLES = [205, 262, 322, 28, 150, 95, 245, 350]

function layoutHalo(W: number, H: number, fx: number, fy: number, spread: number): Placed[] {
    const out: Placed[] = []
    const cx = W * fx
    const cy = H * fy
    const rx = W * 0.31 * spread
    const ry = H * 0.3 * spread
    PROJECTS.forEach((p, pi) => {
        const a = (ANGLES[pi % ANGLES.length] * Math.PI) / 180
        const ccx = cx + Math.cos(a) * rx
        const ccy = cy + Math.sin(a) * ry
        p.files.forEach((f, i) => {
            const size = i === 0 ? 116 : i < 3 ? 78 : 56
            const ga = i * 2.39996 + pi // ángulo áureo
            const r = i === 0 ? 0 : 58 + Math.sqrt(i) * 34
            let x = ccx + Math.cos(ga) * r - size / 2
            let y = ccy + Math.sin(ga) * r * 0.85 - size / 2
            x = Math.min(Math.max(x, 16), W - size - 16)
            y = Math.min(Math.max(y, 46), H - size - 150)
            // dejar libre la firma (abajo a la izquierda)
            if (x < 600 && y + size > H - 290) y = H - 290 - size
            out.push({
                key: `${p.slug}-${i}`,
                project: p,
                index: i,
                src: f.src,
                name: f.name,
                size,
                x,
                y,
                rotate: (rand(pi * 31 + i) - 0.5) * 6,
                isCover: i === 0,
            })
        })
    })
    return out
}

function layoutColumns(W: number, mode: string): Placed[] {
    const sorted = [...PROJECTS].sort((a, b) => {
        if (mode === "year") return b.year - a.year || a.number - b.number
        if (mode === "category") return a.category.localeCompare(b.category) || a.number - b.number
        return a.number - b.number
    })
    const colW = Math.min(170, (W - 96) / sorted.length)
    const out: Placed[] = []
    sorted.forEach((p, ci) => {
        p.files.forEach((f, i) => {
            const size = i === 0 ? Math.min(110, colW - 20) : 52
            const x = 48 + ci * colW + (i === 0 ? 0 : ((i - 1) % 2) * 58)
            const y = 96 + (i === 0 ? 0 : 150 + Math.floor((i - 1) / 2) * 60)
            out.push({ key: `${p.slug}-${i}`, project: p, index: i, src: f.src, name: f.name, size, x, y, rotate: 0, isCover: i === 0 })
        })
    })
    return out
}

function useSize(ref: React.RefObject<HTMLDivElement>) {
    const [s, setS] = React.useState({ w: 1200, h: 800 })
    React.useEffect(() => {
        const el = ref.current
        if (!el) return
        const ro = new ResizeObserver(([e]) => setS({ w: e.contentRect.width, h: e.contentRect.height }))
        ro.observe(el)
        return () => ro.disconnect()
    }, [ref])
    return s
}

function FileItem({
    p,
    active,
    dimmed,
    onHover,
    reduce,
    canvas,
    order,
    resetKey,
}: {
    p: Placed
    active: boolean
    dimmed: boolean
    onHover: (slug: string | null) => void
    reduce: boolean
    canvas: boolean
    order: number
    resetKey: number
}) {
    const dragged = React.useRef(false)
    const [hover, setHover] = React.useState(false)
    const accent = p.project.accent
    const label = p.isCover ? `${String(p.project.number).padStart(2, "0")} / ${p.project.title}` : p.name

    return (
        <motion.div
            initial={reduce || canvas ? false : { opacity: 0, scale: 0.6 }}
            animate={{ x: p.x, y: p.y, rotate: p.rotate, opacity: dimmed ? 0.22 : 1, scale: 1 }}
            transition={{
                x: { duration: reduce ? 0 : 0.7, ease: EASE, delay: reduce ? 0 : order * 0.018 },
                y: { duration: reduce ? 0 : 0.7, ease: EASE, delay: reduce ? 0 : order * 0.018 },
                rotate: { duration: 0.5, ease: EASE },
                opacity: { duration: 0.3, ease: "easeOut" },
                scale: { duration: reduce ? 0 : 0.6, ease: EASE, delay: reduce ? 0 : order * 0.018 },
            }}
            style={{ position: "absolute", left: 0, top: 0, zIndex: hover ? 20 : p.isCover ? 3 : 2 }}
        >
            <div
                onClickCapture={(e) => {
                    if (dragged.current) {
                        e.preventDefault()
                        e.stopPropagation()
                    } else openCover(e.currentTarget, p.project.link)
                }}
            >
                <Link href={p.project.link} motionChild>
                    <motion.a
                        key={resetKey}
                        drag={!canvas}
                        dragMomentum
                        dragTransition={{ power: 0.18, timeConstant: 220 }}
                        onPointerDown={() => (dragged.current = false)}
                        onDragStart={() => (dragged.current = true)}
                        onPointerEnter={(e) => {
                            if (e.pointerType !== "mouse") return
                            setHover(true)
                            onHover(p.project.slug)
                        }}
                        onPointerLeave={() => {
                            setHover(false)
                            onHover(null)
                        }}
                        whileHover={reduce ? undefined : { scale: 1.06 }}
                        whileDrag={{ scale: 1.08, rotate: 0, cursor: "grabbing" }}
                        draggable={false}
                        aria-label={`${p.project.title} — ${p.name}`}
                        style={
                            {
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 6,
                                width: Math.max(p.size, 96),
                                textDecoration: "none",
                                cursor: "default",
                                touchAction: "none",
                                userSelect: "none",
                                WebkitUserDrag: "none",
                            } as any
                        }
                    >
                        <img
                            src={thumb(p.src, p.size > 90 ? 512 : 256)}
                            alt={p.isCover ? p.project.title : ""}
                            draggable={false}
                            loading="lazy"
                            style={{
                                maxWidth: p.size,
                                maxHeight: p.size,
                                display: "block",
                                outline: active && hover ? `1px solid ${INK}` : "none",
                                outlineOffset: 3,
                            }}
                        />
                        {(p.isCover || hover) && (
                            <span
                                style={{
                                    padding: "2px 6px",
                                    background: active ? accent : "var(--ag-paper-90, rgba(244,242,237,0.9))",
                                    color: active ? onAccent(accent) : INK,
                                    fontFamily: MONO,
                                    fontSize: p.isCover ? 10.5 : 9.5,
                                    letterSpacing: "0.04em",
                                    textTransform: "uppercase",
                                    whiteSpace: "nowrap",
                                    transition: "background 250ms ease-out, color 250ms ease-out",
                                }}
                            >
                                {label}
                            </span>
                        )}
                    </motion.a>
                </Link>
            </div>
        </motion.div>
    )
}

function MobileStacks() {
    return (
        <div style={{ position: "absolute", inset: "52px 0 0 0", overflowY: "auto", paddingBottom: 260 }}>
            <h1 style={{ position: "absolute", width: 1, height: 1, margin: -1, padding: 0, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0 }}>Ana Gil — Fashion design</h1>
            {PROJECTS.map((p) => (
                <div key={p.slug} style={{ marginBottom: 18 }}>
                    <Link href={p.link}>
                        <a style={{ display: "flex", alignItems: "baseline", gap: 8, padding: "0 16px 8px", textDecoration: "none", color: INK }}>
                            <span style={{ fontFamily: MONO, fontSize: 10, background: p.accent, color: onAccent(p.accent), padding: "1px 5px" }}>
                                {String(p.number).padStart(2, "0")}
                            </span>
                            <span style={{ fontFamily: DISPLAY, fontVariationSettings: opsz(21), fontSize: 21, color: INK, background: "var(--ag-paper-90, rgba(244,242,237,0.92))", padding: "0 6px" }}>{typeset(p.title)}</span>
                        </a>
                    </Link>
                    <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 16px", scrollSnapType: "x mandatory" }}>
                        {p.files.map((f, i) => (
                            <Link key={f.src} href={p.link}>
                                <a style={{ flex: "0 0 auto", scrollSnapAlign: "start" }} aria-label={`${p.title} — ${f.name}`}>
                                    <img src={thumb(f.src, 384)} alt={i === 0 ? p.title : ""} loading="lazy" style={{ height: i === 0 ? 150 : 110, display: "block" }} />
                                </a>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

interface Props {
    faceX: number
    faceY: number
    spread: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 800
 */
export default function ArchiveCloud({ faceX, faceY, spread, style }: Props) {
    useAgBodoni()
    const ref = React.useRef<HTMLDivElement>(null)
    const { w, h } = useSize(ref)
    const reduce = useReducedMotion() ?? false
    const canvas = RenderTarget.current() === RenderTarget.canvas
    const [mode, setMode] = React.useState("scatter")
    const [hovered, setHovered] = React.useState<string | null>(null)
    const [resetKey, setResetKey] = React.useState(0)

    React.useEffect(() => {
        const on = (e: Event) => {
            setMode((e as CustomEvent).detail?.mode ?? "number")
            setResetKey((k) => k + 1)
        }
        window.addEventListener("ag:arrange", on)
        return () => window.removeEventListener("ag:arrange", on)
    }, [])

    const mobile = w < 600
    const placed = React.useMemo(
        () => (mode === "scatter" ? layoutHalo(w, h, faceX, faceY, spread) : layoutColumns(w, mode)),
        [w, h, faceX, faceY, spread, mode]
    )

    return (
        <div ref={ref} style={{ ...style, position: "relative", width: "100%", height: "100%" }}>
            {mobile ? (
                <MobileStacks />
            ) : (
                placed.map((p, i) => (
                    <FileItem
                        key={p.key}
                        p={p}
                        order={i}
                        active={hovered === p.project.slug}
                        dimmed={hovered !== null && hovered !== p.project.slug}
                        onHover={setHovered}
                        reduce={reduce}
                        canvas={canvas}
                        resetKey={resetKey}
                    />
                ))
            )}
        </div>
    )
}

ArchiveCloud.defaultProps = { faceX: 0.5, faceY: 0.42, spread: 1 }

addPropertyControls(ArchiveCloud, {
    faceX: { type: ControlType.Number, title: "Cara X", min: 0, max: 1, step: 0.01 },
    faceY: { type: ControlType.Number, title: "Cara Y", min: 0, max: 1, step: 0.01 },
    spread: { type: ControlType.Number, title: "Apertura", min: 0.5, max: 1.6, step: 0.05 },
})
