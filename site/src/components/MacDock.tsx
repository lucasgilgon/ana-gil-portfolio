// MacDock v3 — Dock de macOS de verdad: cristal esmerilado, iconos de app a color y efecto lupa.
// Apps → secciones del portfolio:
//   Finder → Índice · Ae / Ps / Ai → herramientas de Ana (rebotan y muestran su ficha) · ⚠ → 404:NOT FOUND_
//   Notas → Sobre mí · Fotos → todas las fotos · Vista previa → Portfolio PDF · Contactos → Currículum
//   Instagram · Mail → Contacto · Papelera
// Al abrir una app rebota como en macOS; punto bajo la app de la página actual.
// En móvil (< 600px): 4 apps estilo iPhone, sin lupa.

import * as React from "react"
import { thumb } from "../lib/media"
import { addPropertyControls, ControlType, Link } from "framer"
import { useLocation } from "react-router-dom"
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, useAnimationControls, AnimatePresence, MotionValue } from "framer-motion"

export type AppId = "finder" | "ae" | "ps" | "ai" | "warning" | "notes" | "photos" | "preview" | "contacts" | "instagram" | "mail" | "trash"
export type App = { id: AppId; label: string; link?: string; external?: boolean; tool?: string; sepBefore?: boolean }

const PORTFOLIO_PDF = "/docs/Portfolio_Ana_Gil.pdf"
const PREVIEW_FRONT = thumb("/media/ash-archive/01", 256)
const PREVIEW_BACK = thumb("/media/amman/01", 256)
const PORTRAIT = thumb("/media/sistema/retrato", 256)
const UI = `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", sans-serif`

export const APPS: App[] = [
    { id: "finder", label: "Finder — Índice", link: "/projects" },
    { id: "ae", label: "After Effects", tool: "Adobe After Effects" },
    { id: "ps", label: "Photoshop", tool: "Adobe Photoshop" },
    { id: "ai", label: "Illustrator", tool: "Adobe Illustrator" },
    { id: "warning", label: "404:NOT FOUND_", link: "/projects/404-not-found" },
    { id: "notes", label: "Notas — Sobre mí", link: "/about", sepBefore: true },
    { id: "photos", label: "Fotos", link: "/fotos" },
    { id: "preview", label: "Vista previa — Portfolio.pdf", link: PORTFOLIO_PDF, external: true },
    { id: "contacts", label: "CV — Currículum", link: "/cv" },
    { id: "instagram", label: "Instagram", link: "https://www.instagram.com/byana_________/", external: true, sepBefore: true },
    { id: "mail", label: "Mail — Nuevo mensaje", link: "/contact" },
    { id: "trash", label: "Papelera", link: "/papelera", sepBefore: true },
]
const MOBILE_APPS: AppId[] = ["finder", "photos", "contacts", "mail"]

// ——— Iconos (SVG 100×100, forma de icono de macOS) ———————————————————————————
const SQ = "M50 0C87 0 100 13 100 50S87 100 50 100 0 87 0 50 13 0 50 0Z" // squircle
function Squircle({ id, children, fill }: { id: string; children?: React.ReactNode; fill: string }) {
    return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden style={{ display: "block", overflow: "visible" }}>
            <defs>
                <clipPath id={`c${id}`}>
                    <path d={SQ} />
                </clipPath>
                <linearGradient id={`gl${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#fff" stopOpacity=".18" />
                    <stop offset=".5" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
            </defs>
            <g clipPath={`url(#c${id})`}>
                <rect width="100" height="100" fill={fill} />
                {children}
                <rect width="100" height="100" fill={`url(#gl${id})`} />
            </g>
            <path d={SQ} fill="none" stroke="rgba(0,0,0,.12)" strokeWidth=".8" />
        </svg>
    )
}

function AdobeIcon({ id, bg, fg, letters }: { id: string; bg: string; fg: string; letters: string }) {
    return (
        <Squircle id={id} fill={bg}>
            <text x="50" y="66" textAnchor="middle" fontFamily={`"Source Sans 3", "Source Sans Pro", "Inter", sans-serif`} fontWeight="700" fontSize="46" letterSpacing="-1" fill={fg}>
                {letters}
            </text>
        </Squircle>
    )
}

export function AppIcon({ app }: { app: App }) {
    const uid = React.useId().replace(/:/g, "")
    switch (app.id) {
        case "finder":
            return (
                <Squircle id={uid} fill="#E8F1FC">
                    <defs>
                        <linearGradient id={`f${uid}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#3FA0FF" />
                            <stop offset="1" stopColor="#1468E8" />
                        </linearGradient>
                    </defs>
                    <path d="M0 0 H56 C49 22 46 40 50 58 C44 58 40 58 38 58 C38 72 42 86 48 100 H0Z" fill={`url(#f${uid})`} />
                    <rect x="30" y="30" width="5" height="14" rx="2.5" fill="#0D1B33" />
                    <rect x="68" y="30" width="5" height="14" rx="2.5" fill="#0D1B33" />
                    <path d="M24 70 Q50 86 78 68" fill="none" stroke="#0D1B33" strokeWidth="4" strokeLinecap="round" />
                </Squircle>
            )
        case "ae":
            return <AdobeIcon id={uid} bg="#00005B" fg="#9999FF" letters="Ae" />
        case "ps":
            return <AdobeIcon id={uid} bg="#001E36" fg="#31A8FF" letters="Ps" />
        case "ai":
            return <AdobeIcon id={uid} bg="#330000" fg="#FF9A00" letters="Ai" />
        case "warning":
            return (
                <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden style={{ display: "block", overflow: "visible" }}>
                    <defs>
                        <linearGradient id={`w${uid}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#F9D65A" />
                            <stop offset="1" stopColor="#EDB72B" />
                        </linearGradient>
                    </defs>
                    <path d="M50 12 L92 84 H8 Z" fill={`url(#w${uid})`} stroke="#FFFFFF" strokeWidth="7" strokeLinejoin="round" style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,.25))" }} />
                    <rect x="46.5" y="38" width="7" height="26" rx="3.5" fill="#FFFFFF" />
                    <circle cx="50" cy="72" r="4.2" fill="#FFFFFF" />
                </svg>
            )
        case "notes":
            return (
                <Squircle id={uid} fill="#FFFFFF">
                    <defs>
                        <linearGradient id={`n${uid}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#FBDC6A" />
                            <stop offset="1" stopColor="#F4C93B" />
                        </linearGradient>
                    </defs>
                    <rect width="100" height="30" fill={`url(#n${uid})`} />
                    <line x1="0" y1="30.5" x2="100" y2="30.5" stroke="#E0B53A" strokeWidth="1" />
                    <line x1="6" y1="34" x2="94" y2="34" stroke="#CFCFCF" strokeWidth="1.2" strokeDasharray="2 2.4" />
                    {[52, 68, 84].map((y) => (
                        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#D9D9D9" strokeWidth="1.4" />
                    ))}
                </Squircle>
            )
        case "photos": {
            const petals = ["#F7A51C", "#F7D51C", "#9BD22F", "#3EC4A6", "#3E9BF0", "#8E6CE8", "#E4458E", "#F2582B"]
            return (
                <Squircle id={uid} fill="#FFFFFF">
                    <g transform="translate(50 50)" style={{ mixBlendMode: "multiply" }}>
                        {petals.map((c, i) => (
                            <ellipse key={c} cx="0" cy="-17" rx="10.5" ry="18" fill={c} opacity=".88" transform={`rotate(${i * 45})`} />
                        ))}
                    </g>
                </Squircle>
            )
        }
        case "preview":
            // Vista previa: dos fotos apiladas (de sus proyectos) y la lupa
            return (
                <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden style={{ display: "block", overflow: "visible" }}>
                    <g transform="rotate(8 50 50)" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,.25))" }}>
                        <rect x="20" y="14" width="62" height="70" fill="#FFFFFF" />
                        <image href={PREVIEW_BACK} x="24" y="18" width="54" height="56" preserveAspectRatio="xMidYMid slice" />
                    </g>
                    <g transform="rotate(-7 50 50)" style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,.3))" }}>
                        <rect x="12" y="20" width="62" height="70" fill="#FFFFFF" />
                        <image href={PREVIEW_FRONT} x="16" y="24" width="54" height="56" preserveAspectRatio="xMidYMid slice" />
                    </g>
                    <circle cx="68" cy="64" r="15" fill="rgba(210,230,255,.35)" stroke="#6B6B6B" strokeWidth="4.5" />
                    <line x1="79" y1="75" x2="92" y2="88" stroke="#3C3C3C" strokeWidth="7.5" strokeLinecap="round" />
                </svg>
            )
        case "contacts":
            return (
                <Squircle id={uid} fill="#B48A5E">
                    <rect x="16" y="10" width="72" height="80" rx="6" fill="#F6F1E8" />
                    <rect x="10" y="10" width="12" height="80" fill="#8E6A45" />
                    <image href={PORTRAIT} x="34" y="20" width="44" height="52" preserveAspectRatio="xMidYMid slice" style={{ filter: "grayscale(1)" }} />
                    <text x="56" y="84" textAnchor="middle" fontFamily={`"IBM Plex Mono", monospace`} fontSize="9" letterSpacing="1.5" fill="#5B4632">
                        CV
                    </text>
                </Squircle>
            )
        case "instagram":
            return (
                <Squircle id={uid} fill="#E1306C">
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
                    <rect width="100" height="100" fill={`url(#ig${uid})`} />
                    <rect width="100" height="100" fill={`url(#ig2${uid})`} />
                    <rect x="24" y="24" width="52" height="52" rx="15" fill="none" stroke="#fff" strokeWidth="6" />
                    <circle cx="50" cy="50" r="12.5" fill="none" stroke="#fff" strokeWidth="6" />
                    <circle cx="65.5" cy="34.5" r="3.6" fill="#fff" />
                </Squircle>
            )
        case "mail":
            return (
                <Squircle id={uid} fill="#2E9BF5">
                    <defs>
                        <linearGradient id={`m${uid}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#5BC0FB" />
                            <stop offset="1" stopColor="#1C7EEF" />
                        </linearGradient>
                    </defs>
                    <rect width="100" height="100" fill={`url(#m${uid})`} />
                    <rect x="18" y="30" width="64" height="42" rx="3" fill="#FFFFFF" />
                    <path d="M19 32 L50 56 L81 32" fill="none" stroke="#9BCDF7" strokeWidth="3.5" strokeLinejoin="round" />
                    <path d="M19 71 L42 50 M81 71 L58 50" fill="none" stroke="#D6E9FB" strokeWidth="2.5" />
                </Squircle>
            )
        case "trash":
            return (
                <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden style={{ display: "block", overflow: "visible" }}>
                    <defs>
                        <linearGradient id={`t${uid}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0" stopColor="#D9DDE2" stopOpacity=".95" />
                            <stop offset=".45" stopColor="#FFFFFF" stopOpacity=".7" />
                            <stop offset="1" stopColor="#C5CAD1" stopOpacity=".95" />
                        </linearGradient>
                    </defs>
                    {/* papeles arrugados */}
                    <path d="M28 20 l8 -9 l9 5 l7 -7 l9 6 l8 -4 l6 9 z" fill="#F4F4F4" stroke="#B9B9B9" strokeWidth="1" />
                    <path d="M40 18 l6 -12 l10 8 l8 -6 l3 10 z" fill="#FFFFFF" stroke="#C4C4C4" strokeWidth="1" />
                    <ellipse cx="50" cy="20" rx="33" ry="6" fill="#E6E9ED" stroke="#A9AEB5" strokeWidth="1.2" />
                    <path d="M17 20 L24 92 Q50 99 76 92 L83 20 Q50 28 17 20Z" fill={`url(#t${uid})`} stroke="#A9AEB5" strokeWidth="1.2" />
                    {[30, 40, 50, 60, 70].map((x) => (
                        <path key={x} d={`M${x} 27 L${50 + (x - 50) * 0.8} 93`} stroke="#A9AEB5" strokeWidth="1.1" opacity=".75" />
                    ))}
                </svg>
            )
    }
}

// ——— Utilidades ———————————————————————————————————————————————————————————
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
    const { pathname } = useLocation()
    return pathname.replace(/\/$/, "") || "/"
}

function isActive(path: string, app: App) {
    if (!app.link || app.external) return false
    const l = app.link.replace(/\/$/, "") || "/"
    if (app.id === "finder") return path === "/projects"
    return path === l || (l !== "/projects" && path.startsWith(l + "/"))
}

// ——— Icono del Dock ————————————————————————————————————————————————————————
function DockIcon({ app, mouseX, base, max, magnify, active, mobile }: { app: App; mouseX: MotionValue<number>; base: number; max: number; magnify: boolean; active: boolean; mobile: boolean }) {
    const ref = React.useRef<HTMLAnchorElement>(null)
    const reduce = useReducedMotion()
    const [hover, setHover] = React.useState(false)
    const [card, setCard] = React.useState(false)
    const bounce = useAnimationControls()
    const distance = useTransform(mouseX, (x) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r || !Number.isFinite(x)) return 999
        return x - (r.left + r.width / 2)
    })
    const sizeRaw = useTransform(distance, [-160, 0, 160], [base, magnify ? max : base, base])
    const size = useSpring(sizeRaw, { mass: 0.1, stiffness: 170, damping: 14 })

    // Rebote de "abrir app" de macOS
    const launch = () => {
        if (reduce) return
        bounce.start({ y: [0, -22, 0, -10, 0], transition: { duration: 0.9, times: [0, 0.3, 0.55, 0.75, 1], ease: "easeOut" } })
    }

    React.useEffect(() => {
        if (!card) return
        const t = window.setTimeout(() => setCard(false), 3200)
        return () => window.clearTimeout(t)
    }, [card])

    const anchor = (
        <motion.a
            ref={ref}
            aria-label={app.label}
            data-dock-app={app.id}
            href={app.tool ? undefined : app.link}
            target={app.external ? "_blank" : undefined}
            rel={app.external ? "noopener" : undefined}
            role={app.tool ? "button" : undefined}
            tabIndex={0}
            onClick={(e) => {
                launch()
                if (app.tool) {
                    e.preventDefault()
                    setCard(true)
                }
            }}
            onKeyDown={(e) => {
                if (app.tool && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault()
                    launch()
                    setCard(true)
                }
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onFocus={() => setHover(true)}
            onBlur={() => setHover(false)}
            animate={bounce}
            whileTap={{ scale: 0.93 }}
            style={{ width: mobile ? base : size, height: mobile ? base : size, display: "block", cursor: "default", outlineOffset: 3, filter: "drop-shadow(0 2px 3px rgba(0,0,0,.18))" }}
        >
            <span aria-hidden style={{ display: "block", width: "100%", height: "100%" }}><AppIcon app={app} /></span>
        </motion.a>
    )

    return (
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <AnimatePresence>
                {(hover || card) && !mobile && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ position: "absolute", bottom: "100%", marginBottom: 14, pointerEvents: card ? "auto" : "none", zIndex: 10 }}
                    >
                        {card && app.tool ? (
                            <div style={{ width: 210, padding: "12px 14px", borderRadius: 12, background: "rgba(246,246,246,.92)", backdropFilter: "blur(20px) saturate(1.6)", WebkitBackdropFilter: "blur(20px) saturate(1.6)", border: "1px solid rgba(0,0,0,.1)", boxShadow: "0 12px 30px rgba(0,0,0,.18)", fontFamily: UI, color: "#1D1D1F", textAlign: "left" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 34, height: 34, flexShrink: 0 }}>
                                        <AppIcon app={app} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600 }}>{app.tool}</div>
                                        <div style={{ fontSize: 11, color: "#6E6E73" }}>Herramienta de Ana</div>
                                    </div>
                                </div>
                                <Link href="/projects">
                                    <a style={{ display: "block", marginTop: 10, fontSize: 12, color: "#0A66D8", textDecoration: "none" }}>Ver los proyectos →</a>
                                </Link>
                            </div>
                        ) : (
                            <span style={{ display: "block", padding: "4px 10px", borderRadius: 7, background: "rgba(236,236,236,.92)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(0,0,0,.12)", boxShadow: "0 4px 12px rgba(0,0,0,.12)", color: "#1D1D1F", fontFamily: UI, fontSize: 12.5, whiteSpace: "nowrap" }}>
                                {app.label}
                            </span>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            {app.link && !app.external && !app.tool ? (
                <Link href={app.link} motionChild>
                    {anchor}
                </Link>
            ) : (
                anchor
            )}
            <span aria-hidden style={{ width: 4, height: 4, borderRadius: "50%", marginTop: 3, background: "var(--ag-ink, #1D1D1F)", opacity: active ? 0.8 : 0 }} />
        </div>
    )
}

interface Props {
    magnify: boolean
    mobileLift: number
    size: number
    maxSize: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function MacDock({ magnify, size, maxSize, mobileLift, style }: Props) {
    const isMobile = useIsMobile()
    const reduce = useReducedMotion()
    const path = usePath()
    const mouseX = useMotionValue(Infinity)
    const list = isMobile ? (MOBILE_APPS.map((id) => APPS.find((a) => a.id === id)) as App[]) : APPS.filter(app => ["finder", "notes", "photos", "preview", "contacts", "mail", "trash"].includes(app.id))
    const base = isMobile ? 58 : Number(size) || 52
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
                gap: isMobile ? 22 : 9,
                padding: isMobile ? "12px 18px 10px" : "7px 9px 3px",
                borderRadius: isMobile ? 30 : 20,
                background: "var(--ag-dock, rgba(246,244,240,.38))",
                backdropFilter: "blur(26px) saturate(1.7)",
                WebkitBackdropFilter: "blur(26px) saturate(1.7)",
                border: "1px solid var(--ag-dock-edge, rgba(255,255,255,.5))",
                boxShadow: "0 10px 40px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.35)",
                height: isMobile ? undefined : base + 14,
                boxSizing: "content-box",
                // En móvil se sube para no quedar debajo del sello «Made in Framer»
                transform: isMobile && Number(mobileLift) ? `translateY(-${Number(mobileLift)}px)` : undefined,
            }}
        >
            {list.map((app) => (
                <React.Fragment key={app.id}>
                    {app.sepBefore && !isMobile && <div style={{ width: 1, alignSelf: "stretch", margin: "6px 3px 12px", background: "rgba(0,0,0,.18)" }} />}
                    <DockIcon app={app} mouseX={mouseX} base={base} max={Number(maxSize) || 84} magnify={doMagnify} active={isActive(path, app)} mobile={isMobile} />
                </React.Fragment>
            ))}
        </nav>
    )
}

MacDock.defaultProps = { magnify: true, size: 52, maxSize: 84, mobileLift: 52 }

addPropertyControls(MacDock, {
    magnify: { type: ControlType.Boolean, title: "Lupa" },
    size: { type: ControlType.Number, title: "Tamaño", min: 32, max: 80, unit: "px" },
    maxSize: { type: ControlType.Number, title: "Tamaño lupa", min: 40, max: 128, unit: "px" },
    mobileLift: { type: ControlType.Number, title: "Subir en móvil", min: 0, max: 120, unit: "px", defaultValue: 52 },
})
