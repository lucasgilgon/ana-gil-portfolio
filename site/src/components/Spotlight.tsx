// Spotlight — buscador ⌘K / Ctrl+K del archivo.
// Busca en título, categoría, año y palabras clave ("ceniza" → ASH ARCHIVE).
// También se abre con el evento "ag:spotlight" (menú Visualización / icono ⌘K).

import * as React from "react"
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType, RenderTarget, Link } from "framer"
import { motion, AnimatePresence } from "framer-motion"
import { PROJECTS } from "../content/generated"

const INK = "var(--ag-ink, #111111)"
const PAPER = "var(--ag-paper, #F4F2ED)"
const FOG = "var(--ag-fog, #D7D4CD)"
const ASH = "var(--ag-ash, #918E88)"

// Texto sobre un acento: los acentos de proyecto son oscuros, así que el texto es papel claro
// también en modo noche; el acento "tinta" se invierte con el tema.
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
const UI = `"Inter", -apple-system, sans-serif`

type Item = { title: string; meta?: string; keywords?: string; link?: string; accent?: string }

interface Props {
    items: Item[]
    placeholder: string
}

const DEFAULT_ITEMS: Item[] = [
        ...PROJECTS.map((p) => ({ title: p.title, meta: `${p.category} · ${p.year}`, keywords: p.keywords, link: p.link, accent: p.accent })),
        { title: "Sobre mí", meta: "About", keywords: "ana gil esd madrid biografía educación servicios", link: "/about", accent: INK },
        { title: "Contacto", meta: "Mail", keywords: "email mensaje colaboración encargo instagram", link: "/contact", accent: INK },
        { title: "Índice de proyectos", meta: "Index", keywords: "todos proyectos finder", link: "/projects", accent: INK },
        { title: "Currículum", meta: "CV", keywords: "cv curriculum resume experiencia estudios esd konecta renatta corte inglés idiomas inglés italiano lvmh descargar pdf", link: "/cv", accent: INK },
        { title: "Fotos", meta: "Todas las fotos", keywords: "fotos galería biblioteca imágenes álbumes sesión", link: "/fotos", accent: INK },
        { title: "Papelera", meta: "Proceso", keywords: "bocetos planos técnicos pruebas tomas descartes proceso sellos acuarelas", link: "/papelera", accent: INK },
    ]

// Framer no siempre guarda todos los campos de los elementos de una lista en la instancia
// (p. ej. los enlaces). Rellenamos lo que falte con los valores por defecto del componente.
function withDefaults<T extends object>(items: T[] | undefined, defaults: T[]): T[] {
    if (!items || items.length === 0) return defaults
    const merged = items.map((it, i) => {
        const out: any = { ...(defaults[i] ?? {}) }
        for (const [k, v] of Object.entries(it as any)) if (v !== undefined && v !== null && v !== "") out[k] = v
        return out as T
    })
    // Entradas nuevas del componente que la instancia guardada aún no tiene
    return [...merged, ...defaults.slice(items.length)]
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
    useAgBodoni()
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
                    style={{ position: "fixed", inset: 0, zIndex: 2000, background: "var(--ag-scrim, rgba(17,17,17,0.12))", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: "18vh" }}
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
                                style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: DISPLAY, fontVariationSettings: opsz(26), fontSize: 26, color: INK }}
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
                                            color: i === active ? onAccent(it.accent) : INK,
                                            background: i === active ? it.accent || INK : "transparent",
                                            borderBottom: `1px solid ${FOG}`,
                                            transition: "background 150ms ease-out",
                                        }}
                                    >
                                        <span style={{ fontFamily: MONO, fontSize: 10, opacity: 0.8, minWidth: 22 }}>{String(i + 1).padStart(2, "0")}</span>
                                        <span style={{ fontFamily: DISPLAY, fontVariationSettings: opsz(22), fontSize: 22, flex: 1 }}>{typeset(it.title)}</span>
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
