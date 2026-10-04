// MacDock v2 — dock del "Archivo vivo".
// · Tira de papel con borde de tinta (sin cristal ni degradados, según la guía).
// · Secciones internas como etiquetas tipográficas en mono; lo externo solo con logos oficiales.
// · Efecto lupa de macOS, etiqueta al pasar el ratón y punto bajo la página actual.
// · En móvil (< 600px): 4 apps, sin lupa.

import * as React from "react"
import { addPropertyControls, ControlType, Link } from "framer"
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, AnimatePresence, MotionValue } from "framer-motion"

type IconKind = "label" | "instagram" | "image"
type ResponsiveImage = { src?: string; srcSet?: string; alt?: string }
type DockItem = { label: string; text?: string; glyph?: string; word?: string; icon: IconKind; image?: ResponsiveImage; logoUrl?: string; link?: string; separatorBefore?: boolean }

const INK = "var(--ag-ink, #111111)"
const PAPER = "var(--ag-paper, #F4F2ED)"
const ASH = "var(--ag-ash, #918E88)"
const MONO = `"IBM Plex Mono", Menlo, monospace`
const DISPLAY = `"Bodoni Moda", "Didot", Georgia, serif`

function InstagramIcon() {
    const uid = React.useId().replace(/:/g, "")
    return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden>
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

// Logos oficiales reconocidos por dominio del enlace
const OFFICIAL_LOGOS: Record<string, string> = {
    "heyzine.com": "https://framerusercontent.com/images/YJ2Z7gwaU3XMuOHhRUn8t4Ho.png",
}
function logoFor(item: DockItem) {
    const hay = `${typeof item.link === "string" ? item.link : ""} ${item.label}`.toLowerCase()
    const key = Object.keys(OFFICIAL_LOGOS).find((d) => hay.includes(d) || hay.includes(d.split(".")[0]))
    return key ? OFFICIAL_LOGOS[key] : undefined
}

function AppIcon({ item }: { item: DockItem }) {
    const hay = `${typeof item.link === "string" ? item.link : ""} ${item.label}`.toLowerCase()
    if (item.icon === "instagram" || hay.includes("instagram")) return <InstagramIcon />
    const logo = item.logoUrl || item.image?.src || logoFor(item)
    if (logo) return <img src={logo} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
    const word = item.word || item.text || item.label
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                background: PAPER,
                border: `1px solid ${INK}`,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.04em",
                color: INK,
                overflow: "hidden",
            }}
        >
            {item.glyph && <span style={{ fontFamily: DISPLAY, fontSize: "0.46em", lineHeight: 0.9 }}>{item.glyph}</span>}
            <span
                style={{
                    fontFamily: MONO,
                    fontSize: item.glyph ? "0.13em" : "0.17em",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    lineHeight: 1,
                }}
            >
                {word}
            </span>
        </div>
    )
}

const DEFAULT_ITEMS: DockItem[] = [
        { label: "Escritorio", text: "Inicio", glyph: "⌂", word: "Inicio", icon: "label", link: "/" },
        { label: "Índice de proyectos", text: "Índice", glyph: "№", word: "Índice", icon: "label", link: "/projects" },
        { label: "Sobre mí", text: "Sobre mí", glyph: "A", word: "Ana", icon: "label", link: "/about" },
        { label: "Contacto", text: "Mail", glyph: "@", word: "Mail", icon: "label", link: "/contact" },
        {
            label: "Portfolio PDF",
            text: "PDF",
            glyph: "¶",
            word: "PDF",
            icon: "label",
            link: "https://framerusercontent.com/assets/yMAsUUEO82a4MP3NjxH1Pswlvv4.pdf",
        },
        { label: "Instagram · @byana_________", icon: "instagram", link: "https://www.instagram.com/byana_________/", separatorBefore: true },
        { label: "Instagram · @anagilgon", icon: "instagram", link: "https://www.instagram.com/anagilgon/" },
        {
            label: "Heyzine · 404:NOT FOUND_",
            icon: "image",
            logoUrl: "https://framerusercontent.com/images/YJ2Z7gwaU3XMuOHhRUn8t4Ho.png",
            link: "https://heyzine.com/flip-book/72320f3df7.html",
        },
    ]

// Framer no siempre guarda todos los campos de los elementos de una lista en la instancia
// (p. ej. los enlaces). Rellenamos lo que falte con los valores por defecto del componente.
function withDefaults<T extends object>(items: T[] | undefined, defaults: T[]): T[] {
    if (!items || items.length === 0) return defaults
    return items.map((it, i) => {
        const out: any = { ...(defaults[i] ?? {}) }
        for (const [k, v] of Object.entries(it as any)) if (v !== undefined && v !== null && v !== "") out[k] = v
        return out as T
    })
}

function useIsMobile(bp = 600) {
    const [m, setM] = React.useState(false)
    React.useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${bp}px)`)
        const u = () => setM(mq.matches)
        u()
        mq.addEventListener?.("change", u)
        return () => mq.removeEventListener?.("change", u)
    }, [bp])
    return m
}

function usePath() {
    const [p, setP] = React.useState("")
    React.useEffect(() => setP(window.location.pathname.replace(/\/$/, "") || "/"), [])
    return p
}

function isActive(path: string, link?: string) {
    if (!link || link.startsWith("mailto:") || link.startsWith("http")) return false
    const l = link.replace(/\/$/, "") || "/"
    if (l === "/") return path === "/"
    return path === l || path.startsWith(l + "/")
}

function DockIcon({ item, mouseX, base, max, magnify, active }: { item: DockItem; mouseX: MotionValue<number>; base: number; max: number; magnify: boolean; active: boolean }) {
    const ref = React.useRef<HTMLAnchorElement>(null)
    const [hover, setHover] = React.useState(false)
    const distance = useTransform(mouseX, (x) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r || !Number.isFinite(x)) return 999
        return x - (r.left + r.width / 2)
    })
    const sizeRaw = useTransform(distance, [-150, 0, 150], [base, magnify ? max : base, base])
    const size = useSpring(sizeRaw, { mass: 0.1, stiffness: 170, damping: 14 })

    const anchor = (
        <motion.a
            ref={ref}
            aria-label={item.label}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onFocus={() => setHover(true)}
            onBlur={() => setHover(false)}
            whileTap={{ scale: 0.94 }}
            style={{ width: size, height: size, display: "block", fontSize: size, outlineOffset: 3, textDecoration: "none", color: INK }}
        >
            <AppIcon item={item} />
        </motion.a>
    )

    return (
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <AnimatePresence>
                {hover && (
                    <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: "absolute",
                            bottom: "100%",
                            marginBottom: 12,
                            padding: "3px 8px",
                            background: INK,
                            color: PAPER,
                            fontFamily: MONO,
                            fontSize: 10.5,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                            pointerEvents: "none",
                        }}
                    >
                        {item.label}
                    </motion.span>
                )}
            </AnimatePresence>
            {item.link ? (
                <Link href={item.link} motionChild>
                    {anchor}
                </Link>
            ) : (
                anchor
            )}
            <span aria-hidden style={{ width: 4, height: 4, marginTop: 4, background: INK, opacity: active ? 1 : 0 }} />
        </div>
    )
}

interface Props {
    items: DockItem[]
    magnify: boolean
    size: number
    maxSize: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function MacDock({ items, magnify, size, maxSize, style }: Props) {
    const isMobile = useIsMobile()
    const reduce = useReducedMotion()
    const path = usePath()
    const mouseX = useMotionValue(Infinity)
    const all = withDefaults(items, DEFAULT_ITEMS)
    const list = isMobile ? all.slice(0, 4) : all
    const base = isMobile ? 56 : size
    const doMagnify = magnify && !isMobile && !reduce

    return (
        <nav
            aria-label="Dock"
            onMouseMove={(e) => mouseX.set(e.clientX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            style={{
                ...style,
                display: "flex",
                alignItems: "flex-end",
                gap: isMobile ? 16 : 10,
                padding: isMobile ? "12px 16px 8px" : "8px 10px 3px",
                background: "var(--ag-paper-94, rgba(244,242,237,0.96))",
                border: `1px solid ${INK}`,
                height: isMobile ? undefined : base + 19,
                boxSizing: "content-box",
            }}
        >
            {list.map((it, i) => (
                <React.Fragment key={i}>
                    {it.separatorBefore && !isMobile && <div style={{ width: 1, alignSelf: "stretch", margin: "2px 2px 10px", background: ASH }} />}
                    <DockIcon item={it} mouseX={mouseX} base={base} max={maxSize} magnify={doMagnify} active={isActive(path, it.link)} />
                </React.Fragment>
            ))}
        </nav>
    )
}

MacDock.defaultProps = {
    items: DEFAULT_ITEMS,
    magnify: true,
    size: 56,
    maxSize: 88,
}

addPropertyControls(MacDock, {
    items: {
        type: ControlType.Array,
        title: "Apps",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Nombre" },
                text: { type: ControlType.String, title: "Texto" },
                glyph: { type: ControlType.String, title: "Glifo" },
                word: { type: ControlType.String, title: "Palabra" },
                icon: { type: ControlType.Enum, title: "Icono", options: ["label", "instagram", "image"], optionTitles: ["Etiqueta", "Instagram", "Logo (imagen)"] },
                image: { type: ControlType.ResponsiveImage, title: "Logo" },
                logoUrl: { type: ControlType.String, title: "Logo URL" },
                link: { type: ControlType.Link, title: "Enlace" },
                separatorBefore: { type: ControlType.Boolean, title: "Separador", defaultValue: false },
            },
        },
    },
    magnify: { type: ControlType.Boolean, title: "Lupa" },
    size: { type: ControlType.Number, title: "Tamaño", min: 32, max: 80, unit: "px" },
    maxSize: { type: ControlType.Number, title: "Tamaño lupa", min: 40, max: 128, unit: "px" },
})
