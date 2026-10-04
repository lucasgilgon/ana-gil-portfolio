// MacDock — dock tipo macOS con efecto lupa, etiqueta al pasar el ratón
// y punto bajo la app "abierta" (la página actual).
// Los iconos son diseños propios en la paleta del portfolio (no iconos de Apple).
// En móvil (< 600px) se convierte en un dock de iPhone: 4 iconos, sin lupa.

import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, AnimatePresence, MotionValue } from "framer-motion"

type IconKind = "desktop" | "projects" | "notes" | "mail" | "book" | "camera" | "trash"
type DockItem = { label: string; icon: IconKind; link?: string }

const UI = `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
const TYPE = `"Special Elite", "Courier New", monospace`
const GREEN = "#2D5A4A"
const TERRA = "#C4876B"
const BURGUNDY = "#7A2E33"

function AppIcon({ kind }: { kind: IconKind }) {
    const uid = React.useId().replace(/:/g, "")
    const squircle = "M50 0C87 0 100 13 100 50S87 100 50 100 0 87 0 50 13 0 50 0z"
    const Tile = ({ from, to, children }: { from: string; to: string; children: React.ReactNode }) => (
        <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))", overflow: "visible" }}>
            <defs>
                <linearGradient id={`t${uid}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={from} />
                    <stop offset="1" stopColor={to} />
                </linearGradient>
                <linearGradient id={`g${uid}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="rgba(255,255,255,0.45)" />
                    <stop offset="0.5" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
                <clipPath id={`c${uid}`}>
                    <path d={squircle} />
                </clipPath>
            </defs>
            <path d={squircle} fill={`url(#t${uid})`} />
            <g clipPath={`url(#c${uid})`}>{children}</g>
            <path d={squircle} fill={`url(#g${uid})`} opacity="0.5" />
            <path d={squircle} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
        </svg>
    )
    switch (kind) {
        case "desktop":
            return (
                <Tile from="#FFFFFF" to="#E6E3DC">
                    <text x="50" y="62" textAnchor="middle" fontFamily="'Special Elite','Courier New',monospace" fontSize="38" fill="#1A1A1A">AG</text>
                    <rect x="28" y="72" width="44" height="2.5" rx="1.25" fill="#C4876B" />
                </Tile>
            )
        case "projects":
            return (
                <Tile from="#F7F6F2" to="#E2DFD7">
                    <path d="M18 34a5 5 0 0 1 5-5h17l5 5h32a5 5 0 0 1 5 5v4H18z" fill="#3A6655" />
                    <rect x="16" y="40" width="68" height="40" rx="5" fill="#5E8C7A" />
                    <rect x="16" y="40" width="68" height="4" rx="2" fill="#8DB5A5" />
                </Tile>
            )
        case "notes":
            return (
                <Tile from="#FFFDF7" to="#F1ECE0">
                    <rect x="0" y="0" width="100" height="24" fill="#C4876B" />
                    <rect x="0" y="24" width="100" height="2" fill="rgba(0,0,0,0.08)" />
                    {[40, 52, 64, 76].map((y) => (
                        <rect key={y} x="18" y={y} width={y === 76 ? 36 : 64} height="3" rx="1.5" fill="#CFC8BA" />
                    ))}
                </Tile>
            )
        case "mail":
            return (
                <Tile from="#3F7764" to="#1F4237">
                    <rect x="20" y="30" width="60" height="42" rx="5" fill="#FFFFFF" />
                    <path d="M22 33l28 21 28-21" fill="none" stroke="#2D5A4A" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
                </Tile>
            )
        case "book":
            return (
                <Tile from="#8E3A40" to="#5B2025">
                    {[30, 46, 62].map((y, i) => (
                        <rect key={y} x={i === 1 ? 12 : 0} y={y} width="100" height="2" fill="rgba(255,255,255,0.12)" />
                    ))}
                    <text x="50" y="60" textAnchor="middle" fontFamily="'Special Elite','Courier New',monospace" fontSize="28" fill="#FFFFFF">404_</text>
                </Tile>
            )
        case "camera":
            return (
                <Tile from="#D9A48C" to="#A9634A">
                    <rect x="20" y="32" width="60" height="44" rx="10" fill="none" stroke="#FFFFFF" strokeWidth="5" />
                    <circle cx="50" cy="54" r="12" fill="none" stroke="#FFFFFF" strokeWidth="5" />
                    <circle cx="68" cy="42" r="3" fill="#FFFFFF" />
                </Tile>
            )
        case "trash":
            return (
                <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.18))" }}>
                    <defs>
                        <linearGradient id={`tr${uid}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0" stopColor="rgba(255,255,255,0.5)" />
                            <stop offset="0.5" stopColor="rgba(255,255,255,0.85)" />
                            <stop offset="1" stopColor="rgba(255,255,255,0.5)" />
                        </linearGradient>
                    </defs>
                    <path d="M22 22h56l-5 68a5 5 0 0 1-5 5H32a5 5 0 0 1-5-5z" fill={`url(#tr${uid})`} stroke="rgba(0,0,0,0.25)" />
                    {[34, 42, 50, 58, 66].map((x) => (
                        <path key={x} d={`M${x} 30 L${x + (x - 50) * 0.06} 88`} stroke="rgba(0,0,0,0.13)" strokeWidth="2" strokeLinecap="round" />
                    ))}
                    <rect x="17" y="13" width="66" height="10" rx="5" fill="rgba(255,255,255,0.9)" stroke="rgba(0,0,0,0.25)" />
                </svg>
            )
    }
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

function DockIcon({
    item,
    mouseX,
    base,
    max,
    magnify,
    active,
}: {
    item: DockItem
    mouseX: MotionValue<number>
    base: number
    max: number
    magnify: boolean
    active: boolean
}) {
    const ref = React.useRef<HTMLAnchorElement>(null)
    const [hover, setHover] = React.useState(false)
    const distance = useTransform(mouseX, (x) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r || !Number.isFinite(x)) return 999
        return x - (r.left + r.width / 2)
    })
    const sizeRaw = useTransform(distance, [-150, 0, 150], [base, magnify ? max : base, base])
    const size = useSpring(sizeRaw, { mass: 0.1, stiffness: 170, damping: 14 })

    return (
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <AnimatePresence>
                {hover && (
                    <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.12 }}
                        style={{
                            position: "absolute",
                            bottom: "100%",
                            marginBottom: 10,
                            padding: "3px 10px",
                            borderRadius: 6,
                            background: "rgba(246,246,246,0.9)",
                            border: "0.5px solid rgba(0,0,0,0.15)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            color: "#1A1A1A",
                            fontFamily: UI,
                            fontSize: 12,
                            whiteSpace: "nowrap",
                            pointerEvents: "none",
                        }}
                    >
                        {item.label}
                    </motion.span>
                )}
            </AnimatePresence>
            <motion.a
                ref={ref}
                href={item.link || undefined}
                target={item.link?.startsWith("http") ? "_blank" : undefined}
                rel={item.link?.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={item.label}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onFocus={() => setHover(true)}
                onBlur={() => setHover(false)}
                whileTap={{ scale: 0.92 }}
                style={{ width: size, height: size, display: "block", fontSize: size, outlineOffset: 3 }}
            >
                <AppIcon kind={item.icon} />
            </motion.a>
            <span
                aria-hidden
                style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    marginTop: 3,
                    background: "rgba(26,26,26,0.75)",
                    opacity: active ? 1 : 0,
                }}
            />
        </div>
    )
}

interface Props {
    items: DockItem[]
    trash: boolean
    magnify: boolean
    size: number
    maxSize: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function MacDock({ items, trash, magnify, size, maxSize, style }: Props) {
    const isMobile = useIsMobile()
    const reduce = useReducedMotion()
    const path = usePath()
    const mouseX = useMotionValue(Infinity)
    const list = isMobile ? items.slice(0, 4) : items
    const base = isMobile ? 58 : size
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
                gap: isMobile ? 18 : 8,
                padding: isMobile ? "14px 18px" : "6px 8px 2px",
                borderRadius: isMobile ? 32 : 18,
                background: "rgba(255,255,255,0.32)",
                backdropFilter: "blur(30px) saturate(170%)",
                WebkitBackdropFilter: "blur(30px) saturate(170%)",
                border: "0.5px solid rgba(255,255,255,0.55)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.18), inset 0 0 0 0.5px rgba(0,0,0,0.08)",
                height: isMobile ? undefined : base + 15,
                boxSizing: "content-box",
            }}
        >
            {list.map((it, i) => (
                <DockIcon key={i} item={it} mouseX={mouseX} base={base} max={maxSize} magnify={doMagnify} active={!isMobile && isActive(path, it.link)} />
            ))}
            {trash && !isMobile && (
                <>
                    <div style={{ width: 1, alignSelf: "stretch", margin: "4px 4px 8px", background: "rgba(0,0,0,0.15)" }} />
                    <DockIcon item={{ label: "Papelera", icon: "trash" }} mouseX={mouseX} base={base} max={maxSize} magnify={doMagnify} active={false} />
                </>
            )}
        </nav>
    )
}

MacDock.defaultProps = {
    items: [
        { label: "Escritorio", icon: "desktop", link: "/" },
        { label: "Proyectos", icon: "projects", link: "/projects" },
        { label: "Sobre mí", icon: "notes", link: "/about" },
        { label: "Mail", icon: "mail", link: "/contact" },
        { label: "404:NOT FOUND_ (flipbook)", icon: "book", link: "https://heyzine.com/flip-book/72320f3df7.html" },
        { label: "@byana_________", icon: "camera", link: "https://www.instagram.com/byana_________/" },
    ],
    trash: true,
    magnify: true,
    size: 54,
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
                icon: {
                    type: ControlType.Enum,
                    title: "Icono",
                    options: ["desktop", "projects", "notes", "mail", "book", "camera", "trash"],
                    optionTitles: ["Escritorio", "Carpeta", "Notas", "Mail", "Libro", "Cámara", "Papelera"],
                },
                link: { type: ControlType.Link, title: "Enlace" },
            },
        },
    },
    trash: { type: ControlType.Boolean, title: "Papelera" },
    magnify: { type: ControlType.Boolean, title: "Lupa" },
    size: { type: ControlType.Number, title: "Tamaño", min: 32, max: 80, unit: "px" },
    maxSize: { type: ControlType.Number, title: "Tamaño lupa", min: 40, max: 128, unit: "px" },
})
