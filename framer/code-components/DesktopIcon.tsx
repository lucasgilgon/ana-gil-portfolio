// DesktopIcon v2 — icono de escritorio del "Archivo vivo" de Ana Gil.
// · Foto del proyecto sin marco ni sombra (guía de identidad) o tile tipográfico.
// · Arrastrable con física suave; un clic (sin arrastrar) abre el enlace con el Link de Framer.
// · Quick Look: al pasar el ratón aparece una ficha grande con imagen, título y metadatos.
// · Escucha el evento "ag:arrange" (desde la barra de menú) para ordenarse en rejilla
//   por número, año o categoría, o volver a esparcirse.

import * as React from "react"
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType, RenderTarget, Link } from "framer"
import { motion, AnimatePresence, useMotionValue, animate, useReducedMotion, MotionValue } from "framer-motion"

type Kind = "photo" | "txt" | "pdf" | "mail" | "instagram" | "folder"
type ResponsiveImage = { src?: string; srcSet?: string; alt?: string }

const INK = "#111111"
const PAPER = "#F4F2ED"
const FOG = "#D7D4CD"
const ASH = "#918E88"
const MONO = `"IBM Plex Mono", "SFMono-Regular", Menlo, monospace`
const DISPLAY = `"Bodoni Moda", "Didot", "GFS Didot", Georgia, serif`
const UI = `"Inter", -apple-system, BlinkMacSystemFont, sans-serif`
const EASE = [0.22, 1, 0.36, 1] as const
const FONTS_HREF =
    "https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap"

function useFonts() {
    React.useEffect(() => {
        if (typeof document === "undefined" || document.querySelector("link[data-ag-v2-fonts]")) return
        const l = document.createElement("link")
        l.rel = "stylesheet"
        l.href = FONTS_HREF
        l.setAttribute("data-ag-v2-fonts", "")
        document.head.appendChild(l)
    }, [])
}

// ---------- Registro compartido para "Ordenar" ----------
type Entry = {
    group: string
    number: number
    year: number
    category: string
    el: () => HTMLElement | null
    x: MotionValue<number>
    y: MotionValue<number>
}
const registry: Map<string, Entry> = (globalThis as any).__agIcons ?? new Map()
;(globalThis as any).__agIcons = registry

function arrange(mode: string, reduce: boolean) {
    const all = [...registry.values()].filter((e) => e.el())
    const t = { duration: reduce ? 0 : 0.55, ease: EASE }
    if (mode === "scatter") {
        all.forEach((e, i) => {
            animate(e.x, 0, { ...t, delay: reduce ? 0 : i * 0.03 })
            animate(e.y, 0, { ...t, delay: reduce ? 0 : i * 0.03 })
        })
        return
    }
    const projects = all.filter((e) => e.group === "project")
    const others = all.filter((e) => e.group !== "project")
    const sorted = [...projects].sort((a, b) => {
        if (mode === "year") return b.year - a.year || a.number - b.number
        if (mode === "category") return a.category.localeCompare(b.category) || a.number - b.number
        return a.number - b.number
    })
    const order = [...sorted, ...others]
    const W = window.innerWidth
    const cellW = W < 600 ? 122 : 156
    const cellH = W < 600 ? 150 : 180
    const left = W < 600 ? 10 : 56
    const top = W < 600 ? 64 : 84
    const cols = Math.max(1, Math.floor((W - left * 2) / cellW))
    order.forEach((e, i) => {
        const el = e.el()
        if (!el) return
        const r = el.getBoundingClientRect()
        const baseX = r.left - e.x.get()
        const baseY = r.top - e.y.get()
        const tx = left + (i % cols) * cellW + (cellW - r.width) / 2
        const ty = top + Math.floor(i / cols) * cellH
        animate(e.x, tx - baseX, { ...t, delay: reduce ? 0 : i * 0.035 })
        animate(e.y, ty - baseY, { ...t, delay: reduce ? 0 : i * 0.035 })
    })
}

if (typeof window !== "undefined" && !(window as any).__agArrangeBound) {
    ;(window as any).__agArrangeBound = true
    window.addEventListener("ag:arrange", (ev: Event) => {
        const mode = (ev as CustomEvent).detail?.mode ?? "number"
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
        arrange(mode, reduce)
    })
}

// ---------- Glifos ----------
function Tile({ kind, size }: { kind: Kind; size: number }) {
    const uid = React.useId().replace(/:/g, "")
    if (kind === "instagram") {
        // Logo oficial de Instagram (icono de app)
        return (
            <svg viewBox="0 0 100 100" width={size * 0.78} height={size * 0.78} aria-hidden>
                <defs>
                    <radialGradient id={`ig${uid}`} cx="0.3" cy="1.07" r="1.35">
                        <stop offset="0" stopColor="#FFDD55" />
                        <stop offset="0.1" stopColor="#FFDD55" />
                        <stop offset="0.5" stopColor="#FF543E" />
                        <stop offset="1" stopColor="#C837AB" />
                    </radialGradient>
                    <radialGradient id={`ig2${uid}`} cx="-0.17" cy="0.07" r="0.75">
                        <stop offset="0" stopColor="#3771C8" />
                        <stop offset="0.13" stopColor="#3771C8" />
                        <stop offset="1" stopColor="#6600FF" stopOpacity="0" />
                    </radialGradient>
                </defs>
                <rect width="100" height="100" rx="22" fill={`url(#ig${uid})`} />
                <rect width="100" height="100" rx="22" fill={`url(#ig2${uid})`} />
                <rect x="24" y="24" width="52" height="52" rx="15" fill="none" stroke="#fff" strokeWidth="6" />
                <circle cx="50" cy="50" r="12.5" fill="none" stroke="#fff" strokeWidth="6" />
                <circle cx="65.5" cy="34.5" r="3.6" fill="#fff" />
            </svg>
        )
    }
    const isMail = kind === "mail"
    return (
        <div
            style={{
                width: isMail ? size * 0.82 : size * 0.64,
                height: isMail ? size * 0.58 : size * 0.82,
                background: PAPER,
                border: `1px solid ${INK}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 6,
                boxSizing: "border-box",
            }}
        >
            {isMail ? (
                <span style={{ fontFamily: DISPLAY, fontSize: size * 0.36, lineHeight: 1, color: INK, margin: "auto" }}>@</span>
            ) : (
                <>
                    <span style={{ fontFamily: MONO, fontSize: 8, color: ASH, letterSpacing: "0.06em" }}>{kind === "pdf" ? "A3 · 6 PP" : "UTF-8"}</span>
                    <span style={{ fontFamily: DISPLAY, fontSize: size * 0.22, color: INK, lineHeight: 1 }}>
                        {kind === "pdf" ? "PDF" : kind === "folder" ? "DIR" : "TXT"}
                    </span>
                    <span style={{ display: "block", height: 1, background: INK }} />
                </>
            )}
        </div>
    )
}

// ---------- Componente ----------
interface Props {
    label: string
    number: number
    meta: string
    year: number
    category: string
    image?: ResponsiveImage
    kind: Kind
    link?: string
    accent: string
    size: number
    theme: "desktop" | "finder"
    draggable: boolean
    quickLook: boolean
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function DesktopIcon(props: Props) {
    const { label, number, meta, year, category, image, kind, link, accent, size, theme, draggable, quickLook, style } = props
    useFonts()
    const reduce = useReducedMotion() ?? false
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const [selected, setSelected] = React.useState(false)
    const [hover, setHover] = React.useState(false)
    const [peek, setPeek] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)
    const dragged = React.useRef(false)
    const rootRef = React.useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const id = React.useId()
    const hasImage = kind === "photo" && Boolean(image?.src)
    const onDesktop = theme === "desktop"
    const num = number > 0 ? String(number).padStart(2, "0") : ""
    const caption = num ? `${num} / ${label}` : label

    React.useEffect(() => setMounted(true), [])

    React.useEffect(() => {
        if (!onDesktop || isCanvas) return
        registry.set(id, {
            group: number > 0 ? "project" : "other",
            number: number > 0 ? number : 999,
            year: year || 0,
            category: category || "zz",
            el: () => rootRef.current,
            x,
            y,
        })
        return () => {
            registry.delete(id)
        }
    }, [id, onDesktop, isCanvas, number, year, category, x, y])

    React.useEffect(() => {
        if (!hover || !quickLook || !hasImage) {
            setPeek(false)
            return
        }
        const t = setTimeout(() => setPeek(true), 380)
        return () => clearTimeout(t)
    }, [hover, quickLook, hasImage])

    React.useEffect(() => {
        if (!selected) return
        const off = () => setSelected(false)
        const t = setTimeout(() => document.addEventListener("pointerdown", off, { once: true }), 0)
        return () => {
            clearTimeout(t)
            document.removeEventListener("pointerdown", off)
        }
    }, [selected])

    const rect = peek ? rootRef.current?.getBoundingClientRect() : undefined
    const vw = typeof window !== "undefined" ? window.innerWidth : 1200
    const vh = typeof window !== "undefined" ? window.innerHeight : 800
    const peekLeft = rect ? (rect.right + 344 < vw ? rect.right + 12 : Math.max(8, rect.left - 332)) : 0
    const peekTop = rect ? Math.min(Math.max(rect.top - 40, 44), vh - 470) : 0

    const icon = (
        <motion.a
            drag={draggable && !isCanvas}
            dragMomentum
            dragTransition={{ power: 0.18, timeConstant: 220 }}
            onDragStart={() => {
                dragged.current = true
                setPeek(false)
                setSelected(true)
            }}
            onPointerDown={() => {
                dragged.current = false
                setSelected(true)
            }}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
            onPointerLeave={() => setHover(false)}
            whileDrag={{ rotate: reduce ? 0 : -2, scale: 1.04, zIndex: 50, cursor: "grabbing" }}
            draggable={false}
            aria-label={label}
            style={
                {
                    x,
                    y,
                    width: size + 56,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    padding: 4,
                    textDecoration: "none",
                    cursor: "default",
                    touchAction: "none",
                    userSelect: "none",
                    WebkitUserDrag: "none",
                    position: "relative",
                } as any
            }
        >
            <div
                style={{
                    width: size,
                    height: size,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    outline: `1px solid ${selected ? INK : "transparent"}`,
                    outlineOffset: 3,
                    transition: "outline-color 200ms ease-out",
                }}
            >
                {hasImage ? (
                    <img
                        src={image!.src}
                        srcSet={image!.srcSet}
                        sizes={`${size * 2}px`}
                        alt={image!.alt || label}
                        draggable={false}
                        loading="lazy"
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
                    />
                ) : (
                    <Tile kind={kind === "photo" ? "folder" : kind} size={size} />
                )}
            </div>
            <span
                style={{
                    maxWidth: size + 52,
                    padding: "2px 6px",
                    background: selected ? INK : hover ? accent : onDesktop ? "rgba(244,242,237,0.88)" : "transparent",
                    color: selected || hover ? PAPER : INK,
                    fontFamily: MONO,
                    fontWeight: 400,
                    fontSize: 10.5,
                    lineHeight: 1.35,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    textAlign: "center",
                    wordBreak: "break-word",
                    transition: "background 200ms ease-out, color 200ms ease-out",
                }}
            >
                {caption}
            </span>
        </motion.a>
    )

    return (
        <div
            ref={rootRef}
            style={{ ...style, width: "auto", height: "auto" }}
            onClickCapture={(e) => {
                if (dragged.current) {
                    e.preventDefault()
                    e.stopPropagation()
                }
            }}
        >
            {link ? (
                <Link href={link} motionChild openInNewTab={link.startsWith("http") ? true : undefined}>
                    {icon}
                </Link>
            ) : (
                icon
            )}
            {mounted &&
                !isCanvas &&
                createPortal(
                    <AnimatePresence>
                        {peek && rect && (
                            <motion.div
                                key="peek"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                transition={{ duration: 0.3, ease: EASE }}
                                style={{
                                    position: "fixed",
                                    left: peekLeft,
                                    top: peekTop,
                                    width: 320,
                                    background: PAPER,
                                    border: `1px solid ${INK}`,
                                    zIndex: 900,
                                    pointerEvents: "none",
                                }}
                            >
                                <div style={{ height: 4, background: accent }} />
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "8px 12px",
                                        fontFamily: MONO,
                                        fontSize: 10,
                                        letterSpacing: "0.06em",
                                        color: ASH,
                                        textTransform: "uppercase",
                                        borderBottom: `1px solid ${FOG}`,
                                    }}
                                >
                                    <span>Quick Look</span>
                                    <span>{num ? `Project / ${num}` : ""}</span>
                                </div>
                                <img src={image!.src} srcSet={image!.srcSet} sizes="640px" alt="" style={{ width: "100%", height: 300, objectFit: "cover", display: "block" }} />
                                <div style={{ padding: "12px 12px 14px" }}>
                                    <div style={{ fontFamily: DISPLAY, fontSize: 30, lineHeight: 1, color: INK, letterSpacing: "-0.01em" }}>{label}</div>
                                    {meta && (
                                        <div style={{ marginTop: 8, fontFamily: MONO, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: INK }}>
                                            {meta}
                                        </div>
                                    )}
                                    <div style={{ marginTop: 10, fontFamily: UI, fontSize: 11, color: ASH }}>Clic para abrir · arrastra para mover</div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
        </div>
    )
}

DesktopIcon.defaultProps = {
    label: "ASH ARCHIVE",
    number: 2,
    meta: "Moda · 2025",
    year: 2025,
    category: "Moda",
    kind: "photo",
    accent: "#A95A45",
    size: 96,
    theme: "desktop",
    draggable: true,
    quickLook: true,
}

addPropertyControls(DesktopIcon, {
    label: { type: ControlType.String, title: "Nombre" },
    number: { type: ControlType.Number, title: "Número", min: 0, step: 1 },
    meta: { type: ControlType.String, title: "Meta" },
    year: { type: ControlType.Number, title: "Año", min: 0, step: 1 },
    category: { type: ControlType.String, title: "Categoría" },
    image: { type: ControlType.ResponsiveImage, title: "Imagen" },
    kind: {
        type: ControlType.Enum,
        title: "Tipo",
        options: ["photo", "txt", "pdf", "mail", "instagram", "folder"],
        optionTitles: ["Foto", "TXT", "PDF", "Mail", "Instagram", "Carpeta"],
    },
    link: { type: ControlType.Link, title: "Enlace" },
    accent: { type: ControlType.Color, title: "Acento" },
    size: { type: ControlType.Number, title: "Tamaño", min: 40, max: 200, unit: "px" },
    theme: { type: ControlType.Enum, title: "Estilo", options: ["desktop", "finder"], optionTitles: ["Escritorio", "Finder"] },
    draggable: { type: ControlType.Boolean, title: "Arrastrable" },
    quickLook: { type: ControlType.Boolean, title: "Quick Look" },
})
