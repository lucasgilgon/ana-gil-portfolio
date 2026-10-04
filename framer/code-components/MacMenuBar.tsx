// MacMenuBar — barra de menú tipo macOS para el portfolio.
// - Escritorio: monograma, nombre en negrita, menús desplegables y reloj real.
// - Móvil (< 600px): barra de estado estilo iPhone (hora + iconos).
// Los menús se abren con clic (como en macOS) y se cierran con Escape o clic fuera.

import * as React from "react"
import { addPropertyControls, ControlType, Link } from "framer"
import { motion, AnimatePresence } from "framer-motion"

const FONTS_HREF =
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Special+Elite&display=swap"
const UI = `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
const TYPE = `"Special Elite", "Courier New", monospace`

function useGoogleFonts() {
    React.useEffect(() => {
        if (typeof document === "undefined") return
        if (document.querySelector("link[data-ag-mac-fonts]")) return
        const l = document.createElement("link")
        l.rel = "stylesheet"
        l.href = FONTS_HREF
        l.setAttribute("data-ag-mac-fonts", "")
        document.head.appendChild(l)
    }, [])
}

function useIsMobile(breakpoint = 600) {
    const [m, setM] = React.useState(false)
    React.useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
        const u = () => setM(mq.matches)
        u()
        mq.addEventListener?.("change", u)
        return () => mq.removeEventListener?.("change", u)
    }, [breakpoint])
    return m
}

function useNow() {
    const [now, setNow] = React.useState<Date | null>(null)
    React.useEffect(() => {
        setNow(new Date())
        const id = setInterval(() => setNow(new Date()), 10000)
        return () => clearInterval(id)
    }, [])
    return now
}

function formatClock(d: Date | null) {
    if (!d) return ""
    const day = new Intl.DateTimeFormat("es-ES", { weekday: "short", day: "numeric", month: "short" })
        .format(d)
        .replace(/\./g, "")
        .replace(",", "")
    const time = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(d)
    return `${day}  ${time}`
}

type Item = { label: string; link?: string }

interface Props {
    appName: string
    projects: Item[]
    aboutLink: string
    contactLink: string
    email: string
    socials: Item[]
    textColor: string
    background: string
    accent: string
    style?: React.CSSProperties
}

const Wifi = ({ c }: { c: string }) => (
    <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden>
        <path d="M8 11.2l2.1-2.6a3.3 3.3 0 0 0-4.2 0L8 11.2z" fill={c} />
        <path d="M2.9 5.8l1.3 1.6a6 6 0 0 1 7.6 0l1.3-1.6a8.1 8.1 0 0 0-10.2 0z" fill={c} />
        <path d="M.3 2.7l1.3 1.6a10.2 10.2 0 0 1 12.8 0l1.3-1.6a12.3 12.3 0 0 0-15.4 0z" fill={c} />
    </svg>
)
const Battery = ({ c }: { c: string }) => (
    <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden>
        <rect x=".5" y=".5" width="21" height="11" rx="3" fill="none" stroke={c} opacity=".45" />
        <rect x="2" y="2" width="15" height="8" rx="1.6" fill={c} />
        <path d="M23 4v4c.8-.3 1.3-1.1 1.3-2S23.8 4.3 23 4z" fill={c} opacity=".45" />
    </svg>
)
const Signal = ({ c }: { c: string }) => (
    <svg width="17" height="11" viewBox="0 0 17 11" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 4.5} y={8 - i * 2.6} width="3" height={3 + i * 2.6} rx=".8" fill={c} />
        ))}
    </svg>
)

function Monogram({ color }: { color: string }) {
    return (
        <span
            aria-hidden
            style={{ fontFamily: TYPE, fontSize: 15, letterSpacing: "0.5px", color, lineHeight: 1 }}
        >
            AG
        </span>
    )
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 28
 */
export default function MacMenuBar(props: Props) {
    const { appName, projects, aboutLink, contactLink, email, socials, textColor, background, accent, style } = props
    useGoogleFonts()
    const isMobile = useIsMobile()
    const now = useNow()
    const [open, setOpen] = React.useState<string | null>(null)
    const ref = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (!open) return
        const onDown = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null)
        }
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null)
        document.addEventListener("mousedown", onDown)
        document.addEventListener("keydown", onKey)
        return () => {
            document.removeEventListener("mousedown", onDown)
            document.removeEventListener("keydown", onKey)
        }
    }, [open])

    const menus: { id: string; label: string; bold?: boolean; items: (Item | "sep")[] }[] = [
        {
            id: "app",
            label: appName,
            bold: true,
            items: [
                { label: `Acerca de ${appName}`, link: aboutLink },
                "sep",
                { label: "Contactar…", link: contactLink },
                { label: "Enviar email", link: `mailto:${email}` },
            ],
        },
        { id: "projects", label: "Proyectos", items: [{ label: "Ver todos", link: "/projects" }, "sep", ...projects] },
        { id: "about", label: "Sobre mí", items: [{ label: "Sobre mí.txt", link: aboutLink }] },
        {
            id: "contact",
            label: "Contacto",
            items: [{ label: "Nuevo mensaje", link: contactLink }, { label: email, link: `mailto:${email}` }, ...(socials.length ? ["sep" as const, ...socials] : [])],
        },
    ]

    const bar: React.CSSProperties = {
        ...style,
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
        padding: isMobile ? "0 22px" : "0 10px",
        background: isMobile ? "transparent" : background,
        backdropFilter: isMobile ? undefined : "blur(24px) saturate(160%)",
        WebkitBackdropFilter: isMobile ? undefined : "blur(24px) saturate(160%)",
        color: textColor,
        fontFamily: UI,
        fontSize: 13,
        userSelect: "none",
    }

    if (isMobile) {
        const t = now ? new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(now) : ""
        return (
            <div style={bar}>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{t}</span>
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <Signal c={textColor} />
                    <Wifi c={textColor} />
                    <Battery c={textColor} />
                </span>
            </div>
        )
    }

    return (
        <div ref={ref} style={bar} role="menubar">
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
                <Link href="/">
                <a
                    aria-label="Escritorio"
                    style={{ padding: "0 10px", height: "100%", display: "flex", alignItems: "center", textDecoration: "none" }}
                >
                    <Monogram color={textColor} />
                </a>
                </Link>
                {menus.map((m) => {
                    const isOpen = open === m.id
                    return (
                        <div key={m.id} style={{ position: "relative", height: "100%" }}>
                            <button
                                type="button"
                                role="menuitem"
                                aria-haspopup="true"
                                aria-expanded={isOpen}
                                onClick={() => setOpen(isOpen ? null : m.id)}
                                onMouseEnter={() => open && setOpen(m.id)}
                                style={{
                                    height: 22,
                                    marginTop: 3,
                                    padding: "0 9px",
                                    border: "none",
                                    borderRadius: 4,
                                    background: isOpen ? "rgba(0,0,0,0.1)" : "transparent",
                                    color: textColor,
                                    font: "inherit",
                                    fontWeight: m.bold ? 700 : 400,
                                    cursor: "default",
                                }}
                            >
                                {m.label}
                            </button>
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        role="menu"
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.12 }}
                                        style={{
                                            position: "absolute",
                                            top: 27,
                                            left: 0,
                                            minWidth: 220,
                                            padding: 5,
                                            borderRadius: 8,
                                            background: "rgba(246,246,246,0.82)",
                                            backdropFilter: "blur(30px) saturate(180%)",
                                            WebkitBackdropFilter: "blur(30px) saturate(180%)",
                                            border: "0.5px solid rgba(0,0,0,0.18)",
                                            boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
                                            zIndex: 1000,
                                        }}
                                    >
                                        {m.items.map((it, i) =>
                                            it === "sep" ? (
                                                <div key={i} style={{ height: 1, margin: "5px 8px", background: "rgba(0,0,0,0.1)" }} />
                                            ) : (
                                                <Link key={i} href={it.link || "/"}>
                                                <a
                                                    role="menuitem"
                                                    onClick={() => setOpen(null)}
                                                    className="ag-menu-item"
                                                    style={{
                                                        display: "block",
                                                        padding: "4px 10px",
                                                        borderRadius: 4,
                                                        color: "#1A1A1A",
                                                        textDecoration: "none",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {it.label}
                                                </a>
                                                </Link>
                                            )
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, paddingRight: 8 }}>
                <Battery c={textColor} />
                <Wifi c={textColor} />
                <span style={{ fontVariantNumeric: "tabular-nums", minWidth: 110, textAlign: "right" }}>{formatClock(now)}</span>
            </div>
            <style>{`.ag-menu-item:hover,.ag-menu-item:focus-visible{background:${accent};color:#fff!important;outline:none}`}</style>
        </div>
    )
}

MacMenuBar.defaultProps = {
    appName: "Ana Gil",
    projects: [
        { label: "404:NOT FOUND_", link: "/projects/404-not-found" },
        { label: "ASH ARCHIVE", link: "/projects/ash-archive" },
        { label: "FRAGMENTOS DE MÍ", link: "/projects/fragmentos-de-mi" },
        { label: "EX_CORPO", link: "/projects/ex-corpo" },
        { label: "AMMAN", link: "/projects/amman" },
    ],
    aboutLink: "/about",
    contactLink: "/contact",
    email: "ana.gil@esdemadrid.es",
    socials: [
        { label: "Instagram  @byana_________", link: "https://www.instagram.com/byana_________/" },
        { label: "Instagram  @anagilgon", link: "https://www.instagram.com/anagilgon/" },
    ],
    textColor: "#1A1A1A",
    background: "rgba(255,255,255,0.45)",
    accent: "#2D5A4A",
}

addPropertyControls(MacMenuBar, {
    appName: { type: ControlType.String, title: "Nombre" },
    projects: {
        type: ControlType.Array,
        title: "Proyectos",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Texto" },
                link: { type: ControlType.Link, title: "Enlace" },
            },
        },
    },
    aboutLink: { type: ControlType.Link, title: "Sobre mí" },
    contactLink: { type: ControlType.Link, title: "Contacto" },
    email: { type: ControlType.String, title: "Email" },
    socials: {
        type: ControlType.Array,
        title: "Redes",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Texto" },
                link: { type: ControlType.Link, title: "Enlace" },
            },
        },
    },
    textColor: { type: ControlType.Color, title: "Texto" },
    background: { type: ControlType.Color, title: "Fondo" },
    accent: { type: ControlType.Color, title: "Selección" },
})
