// Spotlight — buscador ⌘K / Ctrl+K del archivo.
// Busca en título, categoría, año y palabras clave ("ceniza" → ASH ARCHIVE).
// También se abre con el evento "ag:spotlight" (menú Visualización / icono ⌘K).

import * as React from "react"
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType, RenderTarget, Link } from "framer"
import { motion, AnimatePresence } from "framer-motion"

const INK = "#111111"
const PAPER = "#F4F2ED"
const FOG = "#D7D4CD"
const ASH = "#918E88"
const MONO = `"IBM Plex Mono", Menlo, monospace`
const DISPLAY = `"Bodoni Moda", "Didot", Georgia, serif`
const UI = `"Inter", -apple-system, sans-serif`

type Item = { title: string; meta?: string; keywords?: string; link?: string; accent?: string }

interface Props {
    items: Item[]
    placeholder: string
}

const DEFAULT_ITEMS: Item[] = [
        { title: "404:NOT FOUND_", meta: "Editorial · 2025", keywords: "error digital glitch libro memoria familia código píxel", link: "/projects/404-not-found", accent: "#6EA7CC" },
        { title: "ASH ARCHIVE", meta: "Moda · 2025", keywords: "ceniza fuego incendio encaje satén gasa duelo kintsugi", link: "/projects/ash-archive", accent: "#A95A45" },
        { title: "FRAGMENTOS DE MÍ", meta: "Dirección de arte · 2025", keywords: "alzheimer memoria sellos tacto postales cuidado", link: "/projects/fragmentos-de-mi", accent: "#6A2028" },
        { title: "EX_CORPO", meta: "Moda · 2025", keywords: "verde lino espalda cuerpo patronaje confección", link: "/projects/ex-corpo", accent: "#243A2D" },
        { title: "AMMAN", meta: "Moda · 2026", keywords: "casati galliano dior subasta bancarrota acuarela surrealismo", link: "/projects/amman", accent: "#6A2028" },
        { title: "Sobre mí", meta: "About", keywords: "ana gil esd madrid biografía educación servicios", link: "/about", accent: "#111111" },
        { title: "Contacto", meta: "Mail", keywords: "email mensaje colaboración encargo instagram", link: "/contact", accent: "#111111" },
        { title: "Índice de proyectos", meta: "Index", keywords: "todos proyectos finder", link: "/projects", accent: "#111111" },
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

const norm = (s: string) =>
    s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function Spotlight(props: Props) {
    const { placeholder } = props
    const items = withDefaults(props.items, DEFAULT_ITEMS)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const [open, setOpen] = React.useState(false)
    const [q, setQ] = React.useState("")
    const [active, setActive] = React.useState(0)
    const [mounted, setMounted] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const linkRefs = React.useRef<(HTMLElement | null)[]>([])
    React.useEffect(() => setMounted(true), [])

    React.useEffect(() => {
        if (isCanvas) return
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault()
                setOpen((v) => !v)
            } else if (e.key === "Escape") setOpen(false)
        }
        const onEvt = () => setOpen(true)
        window.addEventListener("keydown", onKey)
        window.addEventListener("ag:spotlight", onEvt)
        return () => {
            window.removeEventListener("keydown", onKey)
            window.removeEventListener("ag:spotlight", onEvt)
        }
    }, [isCanvas])

    React.useEffect(() => {
        if (open) {
            setQ("")
            setActive(0)
            setTimeout(() => inputRef.current?.focus(), 30)
        }
    }, [open])

    const results = React.useMemo(() => {
        const n = norm(q.trim())
        if (!n) return items
        return items.filter((it) => norm(`${it.title} ${it.meta ?? ""} ${it.keywords ?? ""}`).includes(n))
    }, [q, items])

    if (isCanvas)
        return <div style={{ padding: 8, fontFamily: UI, fontSize: 11, color: ASH, background: PAPER, border: `1px solid ${FOG}` }}>Spotlight ⌘K</div>
    if (!mounted) return null

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    key="sp"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onPointerDown={(e) => e.target === e.currentTarget && setOpen(false)}
                    style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(17,17,17,0.12)", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: "18vh" }}
                >
                    <motion.div
                        role="dialog"
                        aria-label="Buscar en el archivo"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -6, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        style={{ width: "min(640px, calc(100vw - 24px))", background: PAPER, border: `1px solid ${INK}` }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: `1px solid ${INK}` }}>
                            <span style={{ fontFamily: MONO, fontSize: 11, color: ASH }}>⌘K</span>
                            <input
                                ref={inputRef}
                                value={q}
                                onChange={(e) => {
                                    setQ(e.target.value)
                                    setActive(0)
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "ArrowDown") {
                                        e.preventDefault()
                                        setActive((a) => Math.min(a + 1, results.length - 1))
                                    } else if (e.key === "ArrowUp") {
                                        e.preventDefault()
                                        setActive((a) => Math.max(a - 1, 0))
                                    } else if (e.key === "Enter") {
                                        linkRefs.current[active]?.click()
                                        setOpen(false)
                                    }
                                }}
                                placeholder={placeholder}
                                aria-label="Buscar"
                                style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: DISPLAY, fontSize: 26, color: INK }}
                            />
                        </div>
                        <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
                            {results.length === 0 && (
                                <div style={{ padding: "18px 16px", fontFamily: MONO, fontSize: 11, color: ASH, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                    Error 404 — sin resultados en el archivo
                                </div>
                            )}
                            {results.map((it, i) => (
                                <Link key={it.title + i} href={it.link || "/"}>
                                    <a
                                        ref={(el) => {
                                            linkRefs.current[i] = el
                                        }}
                                        onMouseEnter={() => setActive(i)}
                                        onClick={() => setOpen(false)}
                                        style={{
                                            display: "flex",
                                            alignItems: "baseline",
                                            gap: 14,
                                            padding: "12px 16px",
                                            textDecoration: "none",
                                            color: i === active ? PAPER : INK,
                                            background: i === active ? it.accent || INK : "transparent",
                                            borderBottom: `1px solid ${FOG}`,
                                            transition: "background 150ms ease-out",
                                        }}
                                    >
                                        <span style={{ fontFamily: MONO, fontSize: 10, opacity: 0.8, minWidth: 22 }}>{String(i + 1).padStart(2, "0")}</span>
                                        <span style={{ fontFamily: DISPLAY, fontSize: 22, flex: 1 }}>{it.title}</span>
                                        <span style={{ fontFamily: MONO, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.8 }}>{it.meta}</span>
                                    </a>
                                </Link>
                            ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 16px", fontFamily: MONO, fontSize: 10, color: ASH, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            <span>↑↓ navegar · ↵ abrir · esc cerrar</span>
                            <span>{results.length} resultados</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}

Spotlight.defaultProps = {
    placeholder: "Buscar en el archivo…",
    items: DEFAULT_ITEMS,
}

addPropertyControls(Spotlight, {
    placeholder: { type: ControlType.String, title: "Placeholder" },
    items: {
        type: ControlType.Array,
        title: "Resultados",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Título" },
                meta: { type: ControlType.String, title: "Meta" },
                keywords: { type: ControlType.String, title: "Claves" },
                link: { type: ControlType.Link, title: "Enlace" },
                accent: { type: ControlType.Color, title: "Acento" },
            },
        },
    },
})
