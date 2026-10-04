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

const INK = "var(--ag-ink, #111111)"
const PAPER = "var(--ag-paper, #F4F2ED)"
const FOG = "var(--ag-fog, #D7D4CD)"
const ASH = "var(--ag-ash, #918E88)"

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

const MONO = `"IBM Plex Mono", "SFMono-Regular", Menlo, monospace`
const DISPLAY = `"AG Bodoni", "Bodoni Moda", "Didot", "GFS Didot", Georgia, serif`
// Tamaño óptico de la Bodoni ajustado al tamaño real (con opsz 96 en tamaños medianos los trazos finos desaparecen)
const opsz = (px: number) => `"opsz" ${Math.max(6, Math.min(96, Math.round(px)))}`

// Bodoni Moda variable (con eje de tamaño óptico) bajo un nombre propio, para no depender de la versión que cargue Framer
const AG_BODONI_CSS = `@font-face{font-family:"AG Bodoni";font-style:normal;font-weight:400 900;font-display:swap;src:url(https://fonts.gstatic.com/s/bodonimoda/v28/aFTQ7PxzY382XsXX63LUYJSKSKjWXFBP.woff2) format("woff2")}@font-face{font-family:"AG Bodoni";font-style:italic;font-weight:400 900;font-display:swap;src:url(https://fonts.gstatic.com/s/bodonimoda/v28/aFTS7PxzY382XsXX63LUYJSPeKrcW3JNsao.woff2) format("woff2")}`
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
const PDF_COVER = "https://framerusercontent.com/images/kOUPk1v2pbsJoPIbr1Y2oUDk6Y.jpg?scale-down-to=512"
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
    const sheet: React.CSSProperties = { position: "absolute", background: "#FFFFFF", boxShadow: "0 1px 0 rgba(0,0,0,.08), 0 6px 14px rgba(0,0,0,.14)" }

    if (kind === "txt") {
        // Hoja con esquina doblada y su texto en miniatura (como la vista previa del Finder)
        const w = size * 0.78
        const h = size * 1.0
        const fold = size * 0.17
        return (
            <div style={{ position: "relative", width: w, height: h }}>
                <div style={{ ...sheet, inset: 0, clipPath: `polygon(0 0, calc(100% - ${fold}px) 0, 100% ${fold}px, 100% 100%, 0 100%)`, padding: `${size * 0.1}px ${size * 0.08}px`, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: size * 0.035 }}>
                    <span style={{ fontFamily: DISPLAY, fontVariationSettings: opsz(size * 0.11), fontSize: size * 0.11, lineHeight: 1, color: "#111111" }}>Sobre mí</span>
                    {[1, 0.92, 0.97, 0.7, 0, 0.95, 0.88, 0.6].map((l, i) => (
                        <span key={i} style={{ height: l ? Math.max(1, size * 0.022) : size * 0.01, width: `${l * 100}%`, background: "#B9B6AF", borderRadius: 1 }} />
                    ))}
                </div>
                <div style={{ position: "absolute", top: 0, right: 0, width: fold, height: fold, background: "linear-gradient(225deg, transparent 50%, #E6E3DC 50%)", filter: "drop-shadow(-1px 1px 1px rgba(0,0,0,.12))" }} />
                <span style={{ position: "absolute", left: -4, bottom: size * 0.08, padding: "1px 4px", background: "#111111", color: "#F4F2ED", fontFamily: MONO, fontSize: 7.5, letterSpacing: "0.08em" }}>TXT</span>
            </div>
        )
    }

    if (kind === "pdf") {
        // Portada real del portfolio con páginas apiladas detrás
        const w = size * 1.12
        const h = w * (585 / 827)
        return (
            <div style={{ position: "relative", width: w, height: h + size * 0.06 }}>
                <div style={{ ...sheet, left: 4, top: 6, width: w, height: h, transform: "rotate(4deg)", background: "#F1EFEA" }} />
                <div style={{ ...sheet, left: 2, top: 3, width: w, height: h, transform: "rotate(-3deg)", background: "#F7F5F0" }} />
                <img src={PDF_COVER} alt="" draggable={false} style={{ ...sheet, left: 0, top: 0, width: w, height: h, objectFit: "cover", display: "block" } as React.CSSProperties} />
                <span style={{ position: "absolute", left: -4, bottom: 0, padding: "1px 4px", background: "#A95A45", color: "#F4F2ED", fontFamily: MONO, fontSize: 7.5, letterSpacing: "0.08em" }}>PDF</span>
            </div>
        )
    }

    if (kind === "mail") {
        // Sobre con sello "AG" y matasellos
        const w = size * 1.12
        const h = w * 0.64
        return (
            <svg viewBox="0 0 90 58" width={w} height={h} aria-hidden style={{ overflow: "visible", filter: "drop-shadow(0 5px 8px rgba(0,0,0,.14))" }}>
                <rect x="0.5" y="0.5" width="89" height="57" fill="#FFFFFF" stroke="#111111" strokeWidth="0.8" />
                <path d="M0.5 0.5 L45 33 L89.5 0.5" fill="none" stroke="#111111" strokeWidth="0.8" />
                <path d="M0.5 57.5 L34 25 M89.5 57.5 L56 25" fill="none" stroke="#111111" strokeWidth="0.5" opacity=".45" />
                <rect x="70" y="4" width="15" height="18" fill="#FBFAF7" stroke="#6A2028" strokeWidth="0.8" strokeDasharray="1.4 1" />
                <text x="77.5" y="15.5" textAnchor="middle" fontFamily="Georgia, serif" fontSize="7" fill="#111111">AG</text>
                <g opacity=".75" stroke="#6A2028" fill="none" strokeWidth="0.7">
                    <circle cx="66" cy="15" r="8" />
                    <path d="M58 26 q4 -2 8 0 t8 0 t8 0" />
                </g>
                <text x="10" y="48" fontFamily="IBM Plex Mono, monospace" fontSize="4.6" letterSpacing="0.6" fill="#7C7973">PARA: ANA GIL · MADRID</text>
            </svg>
        )
    }

    // Carpeta (y cualquier otro tipo): pestaña + cuerpo en papel
    return (
        <div style={{ position: "relative", width: size * 0.82, height: size * 0.62 }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: "42%", height: "22%", background: "var(--ag-side, #ECE9E2)", border: `1px solid ${INK}`, borderBottom: "none", boxSizing: "border-box" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: "16%", bottom: 0, background: PAPER, border: `1px solid ${INK}`, boxSizing: "border-box", display: "flex", alignItems: "flex-end", padding: 5 }}>
                <span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.06em", color: ASH }}>DIR</span>
            </div>
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
    useAgBodoni()
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
                    <div style={{ display: "flex" }}>
                        <Tile kind={kind === "photo" ? "folder" : kind} size={size} />
                    </div>
                )}
            </div>
            <span
                style={{
                    maxWidth: size + 52,
                    padding: "2px 6px",
                    background: selected ? INK : hover ? acc(accent) : onDesktop ? "var(--ag-paper-90, rgba(244,242,237,0.88))" : "transparent",
                    color: selected ? PAPER : hover ? onAccent(accent) : INK,
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
                } else if (hasImage) openCover(e.currentTarget, link)
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
                                    <div style={{ fontFamily: DISPLAY, fontVariationSettings: opsz(30), fontSize: 30, lineHeight: 1, color: INK, letterSpacing: "-0.01em" }}>{typeset(label)}</div>
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
