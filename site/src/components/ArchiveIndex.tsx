// ArchiveIndex — índice de archivo (vista Finder en lista) del portfolio de Ana Gil.
// · Tabla en mono: Nº · NOMBRE · CATEGORÍA · AÑO · ACENTO. La fila activa se pinta del color del proyecto.
// · Vista previa grande al lado (foto, título, frase, asignatura, "Abrir proyecto →").
// · Teclado: ↑↓ para moverse, Enter para abrir. Clic en cabecera para ordenar.
// · Botones Lista / Iconos. En pantallas estrechas, solo la tabla con miniaturas.

import * as React from "react"
import { thumb } from "../lib/media"
import { addPropertyControls, ControlType, Link } from "framer"
import { motion, AnimatePresence } from "framer-motion"

import { PROJECTS as _PROJECTS } from "../content/generated"
type ArchiveFile = { src: string; name: string }
type ArchiveProject = (typeof _PROJECTS)[number]
const PROJECTS: ArchiveProject[] = _PROJECTS

const INK = "var(--ag-ink, #111111)"
const PAPER = "var(--ag-paper, #F4F2ED)"
const SHEET = "var(--ag-sheet, #FBFAF7)"
const FOG = "var(--ag-fog, #D7D4CD)"
const ASH = "var(--ag-ash, #7C7973)"

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
const EASE = [0.22, 1, 0.36, 1] as const

type SortKey = "number" | "title" | "category" | "year"

interface Props {
    defaultView: "list" | "icons"
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 760
 */
export default function ArchiveIndex({ defaultView, style }: Props) {
    useAgBodoni()
    const ref = React.useRef<HTMLDivElement>(null)
    const [w, setW] = React.useState(800)
    const [view, setView] = React.useState<"list" | "icons">(defaultView)
    const [sort, setSort] = React.useState<{ key: SortKey; dir: 1 | -1 }>({ key: "number", dir: 1 })
    const [active, setActive] = React.useState(0)
    const linkRefs = React.useRef<(HTMLAnchorElement | null)[]>([])

    React.useEffect(() => {
        const el = ref.current
        if (!el) return
        const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const rows = React.useMemo(() => {
        const r = [...PROJECTS]
        r.sort((a, b) => {
            const va = a[sort.key] as any
            const vb = b[sort.key] as any
            return (typeof va === "number" ? va - vb : String(va).localeCompare(String(vb))) * sort.dir
        })
        return r
    }, [sort])

    const cur = rows[Math.min(active, rows.length - 1)]
    const wide = w > 700
    const narrow = w < 520

    const onKey = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault()
            setActive((a) => Math.min(a + 1, rows.length - 1))
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setActive((a) => Math.max(a - 1, 0))
        } else if (e.key === "Enter") linkRefs.current[active]?.click()
    }

    const head = (key: SortKey, label: string, flex: string, align: "left" | "right" = "left") => (
        <button
            type="button"
            onClick={() => setSort((s) => ({ key, dir: s.key === key ? ((-s.dir) as 1 | -1) : 1 }))}
            style={{
                flex,
                textAlign: align,
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: sort.key === key ? INK : ASH,
            }}
        >
            {label}
            {sort.key === key ? (sort.dir === 1 ? " ↓" : " ↑") : ""}
        </button>
    )

    const toggle = (v: "list" | "icons", label: string) => (
        <button
            type="button"
            onClick={() => setView(v)}
            aria-pressed={view === v}
            style={{
                border: `1px solid ${INK}`,
                background: view === v ? INK : "transparent",
                color: view === v ? PAPER : INK,
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "3px 8px",
                cursor: "pointer",
            }}
        >
            {label}
        </button>
    )

    return (
        <div ref={ref} style={{ ...style, width: "100%", fontFamily: UI, color: INK }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: ASH }}>
                    {rows.length} archivos · ↑↓ y ↵ para navegar
                </span>
                <div style={{ display: "flex", gap: 0 }}>
                    {toggle("list", "Lista")}
                    {toggle("icons", "Iconos")}
                </div>
            </div>

            {view === "icons" ? (
                <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${narrow ? 130 : 170}px, 1fr))`, gap: "28px 18px" }}>
                    {rows.map((p) => (
                        <Link key={p.slug} href={p.link}>
                            <a className="ag-ix-icon" style={{ textDecoration: "none", color: INK, display: "flex", flexDirection: "column", gap: 8 }}>
                                <img src={thumb(p.cover, 512)} alt={p.title} loading="lazy" style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover", display: "block" }} />
                                <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                                    {String(p.number).padStart(2, "0")} / {p.title}
                                </span>
                                <span style={{ height: 3, width: 28, background: p.accent }} />
                            </a>
                        </Link>
                    ))}
                </div>
            ) : (
                <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
                    <div role="listbox" aria-label="Proyectos" tabIndex={0} onKeyDown={onKey} style={{ flex: 1, minWidth: 0, outline: "none", borderTop: `1px solid ${INK}` }}>
                        <div style={{ display: "flex", gap: 12, padding: "8px 10px", borderBottom: `1px solid ${INK}` }}>
                            {head("number", "Nº", "0 0 34px")}
                            {head("title", "Nombre", "1 1 auto")}
                            {!narrow && head("category", "Categoría", wide ? "0 0 92px" : "0 0 112px")}
                            {head("year", "Año", "0 0 44px", "right")}
                            <span style={{ flex: "0 0 14px" }} />
                        </div>
                        {rows.map((p, i) => {
                            const on = i === active
                            return (
                                <Link key={p.slug} href={p.link}>
                                    <a
                                        ref={(el) => {
                                            linkRefs.current[i] = el
                                        }}
                                        role="option"
                                        aria-selected={on}
                                        onMouseEnter={() => setActive(i)}
                                        onFocus={() => setActive(i)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                            padding: narrow ? "10px" : "18px 10px",
                                            borderBottom: `1px solid ${FOG}`,
                                            background: on ? p.accent : "transparent",
                                            color: on ? onAccent(p.accent) : INK,
                                            textDecoration: "none",
                                            transition: "background 250ms ease-out, color 250ms ease-out",
                                        }}
                                    >
                                        <span style={{ flex: "0 0 34px", fontFamily: MONO, fontSize: 11 }}>{String(p.number).padStart(2, "0")}</span>
                                        {narrow && <img src={thumb(p.cover, 160)} alt="" style={{ width: 44, height: 54, objectFit: "cover", display: "block" }} />}
                                        <span style={{ flex: "1 1 auto", minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                                            <span style={{ fontFamily: DISPLAY, fontVariationSettings: opsz(narrow ? 18 : 26), fontSize: narrow ? 18 : 26, lineHeight: 1.12, letterSpacing: "-0.005em", overflowWrap: "anywhere", paddingBottom: 1 }}>{typeset(p.title)}</span>
                                            {!narrow && p.short && (
                                                <span style={{ fontSize: 12, lineHeight: 1.4, opacity: on ? 0.85 : 0.6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.short}</span>
                                            )}
                                        </span>
                                        {!narrow && (
                                            <span style={{ flex: wide ? "0 0 92px" : "0 0 112px", fontFamily: MONO, fontSize: 9.5, lineHeight: 1.4, letterSpacing: "0.04em", textTransform: "uppercase" }}>{p.category}</span>
                                        )}
                                        <span style={{ flex: "0 0 44px", textAlign: "right", fontFamily: MONO, fontSize: 11 }}>{p.year}</span>
                                        <span style={{ flex: "0 0 14px", display: "flex", justifyContent: "flex-end" }}>
                                            <span style={{ width: 9, height: 9, borderRadius: "50%", background: on ? onAccent(p.accent) : p.accent }} />
                                        </span>
                                    </a>
                                </Link>
                            )
                        })}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", padding: "16px 10px 0", fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.04em", color: ASH }}>
                            <span>TAMBIÉN EN EL ARCHIVO</span>
                            <Link href="/papelera">
                                <a style={{ color: INK, textDecoration: "none", borderBottom: `1px solid ${FOG}` }}>Papelera — proceso y descartes</a>
                            </Link>
                            <Link href="/cv">
                                <a style={{ color: INK, textDecoration: "none", borderBottom: `1px solid ${FOG}` }}>Currículum</a>
                            </Link>
                        </div>
                    </div>

                    {wide && cur && (
                        <div style={{ flex: "0 0 260px", position: "sticky", top: 60 }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={cur.slug}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3, ease: EASE }}
                                    style={{ border: `1px solid ${INK}`, background: SHEET }}
                                >
                                    <div style={{ height: 4, background: cur.accent }} />
                                    <img src={thumb(cur.cover, 800)} alt={cur.title} style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover", display: "block" }} />
                                    <div style={{ padding: "14px 14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                                        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: ASH }}>
                                            Project / {String(cur.number).padStart(2, "0")} · {cur.category} · {cur.year}
                                        </span>
                                        <span style={{ fontFamily: DISPLAY, fontVariationSettings: opsz(28), fontSize: 28, lineHeight: 1 }}>{typeset(cur.title)}</span>
                                        <span style={{ fontSize: 13.5, lineHeight: 1.5 }}>{cur.short}</span>
                                        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.04em", color: ASH, textTransform: "uppercase" }}>{cur.context}</span>
                                        <Link href={cur.link}>
                                            <a
                                                style={{
                                                    marginTop: 6,
                                                    alignSelf: "flex-start",
                                                    background: INK,
                                                    color: PAPER,
                                                    padding: "6px 10px",
                                                    fontFamily: MONO,
                                                    fontSize: 10.5,
                                                    letterSpacing: "0.06em",
                                                    textTransform: "uppercase",
                                                    textDecoration: "none",
                                                }}
                                            >
                                                Abrir proyecto →
                                            </a>
                                        </Link>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            )}
            <style>{`.ag-ix-icon:hover img{opacity:.85}`}</style>
        </div>
    )
}

ArchiveIndex.defaultProps = { defaultView: "list" }

addPropertyControls(ArchiveIndex, {
    defaultView: { type: ControlType.Enum, title: "Vista", options: ["list", "icons"], optionTitles: ["Lista", "Iconos"] },
})
