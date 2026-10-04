// ArchiveIndex — índice de archivo (vista Finder en lista) del portfolio de Ana Gil.
// · Tabla en mono: Nº · NOMBRE · CATEGORÍA · AÑO · ACENTO. La fila activa se pinta del color del proyecto.
// · Vista previa grande al lado (foto, título, frase, asignatura, "Abrir proyecto →").
// · Teclado: ↑↓ para moverse, Enter para abrir. Clic en cabecera para ordenar.
// · Botones Lista / Iconos. En pantallas estrechas, solo la tabla con miniaturas.

import * as React from "react"
import { addPropertyControls, ControlType, Link } from "framer"
import { motion, AnimatePresence } from "framer-motion"

// @archive-data-start (generado por scripts/sync-archive-data.mjs — no editar a mano)
type ArchiveFile = { src: string; name: string }
type ArchiveProject = { slug: string; title: string; number: number; category: string; year: number; context: string; short: string; accent: string; link: string; cover: string; files: ArchiveFile[] }
const PROJECTS: ArchiveProject[] = [
    {
        "slug": "404-not-found",
        "title": "404:NOT FOUND_",
        "number": 1,
        "category": "Editorial",
        "year": 2025,
        "context": "Fundamentos del diseño. Ideación — 1º curso, ESD Madrid. Mayo 2025",
        "short": "Libro editorial que materializa el trauma del abandono familiar como un fallo de sistema digital.",
        "accent": "rgb(110, 167, 204)",
        "link": "/projects/404-not-found",
        "cover": "https://framerusercontent.com/images/Ha2OhSSv1GHlTJ5lI1jVtm8LxPs.jpg",
        "files": [
            {
                "src": "https://framerusercontent.com/images/Ha2OhSSv1GHlTJ5lI1jVtm8LxPs.jpg",
                "name": "404_NOT_FOUND_01.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/VHnhZbJPeGhxODXmj1rsNo9hyy8.jpg",
                "name": "404_NOT_FOUND_02.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/qmdnG8lpAC2tuxU8gOOHQbFdik.jpg",
                "name": "404_NOT_FOUND_03.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/KJRRjszyNkvVBbuEDfnhGOiPeg.jpg",
                "name": "404_NOT_FOUND_04.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/5W1UeJKtvIaUPfJGfssAXLeHoXQ.jpg",
                "name": "404_NOT_FOUND_05.jpg"
            }
        ]
    },
    {
        "slug": "ash-archive",
        "title": "ASH ARCHIVE",
        "number": 2,
        "category": "Moda",
        "year": 2025,
        "context": "Introducción a proyectos de moda — 2º curso, ESD Madrid. 2025/26",
        "short": "Colección de moda que explora la resiliencia tras la pérdida, usando encaje como agente destructor y constructor.",
        "accent": "rgb(169, 90, 69)",
        "link": "/projects/ash-archive",
        "cover": "https://framerusercontent.com/images/YRSIlNmz7midD2pPfjeVXQfSj9c.jpg",
        "files": [
            {
                "src": "https://framerusercontent.com/images/YRSIlNmz7midD2pPfjeVXQfSj9c.jpg",
                "name": "ASH_ARCHIVE_01.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/JKB3uHu61zX91hbmaeGVKzVuS0.jpg",
                "name": "ASH_ARCHIVE_02.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/UGsFnCTNbiBWyVJEgJQwflEOMKE.jpg",
                "name": "ASH_ARCHIVE_03.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/bwXj17A2DJvz9XjDgMwbF5VubI.jpg",
                "name": "ASH_ARCHIVE_04.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/4DhKyxugIe0iVRGeL6uAmqp6CwA.jpg",
                "name": "ASH_ARCHIVE_05.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/8Xm2s7i5jbSz5BV3xqYwZo7rkI0.jpg",
                "name": "ASH_ARCHIVE_06.jpg"
            }
        ]
    },
    {
        "slug": "fragmentos-de-mi",
        "title": "FRAGMENTOS DE MÍ",
        "number": 3,
        "category": "Dirección de arte",
        "year": 2025,
        "context": "Fundamentos del diseño. Ideación — 1º curso, ESD Madrid. Con Fundación Reina Sofía y AFEAM",
        "short": "Kit de herramientas táctiles para conectar con pacientes de Alzheimer, usando símbolos y memoria sensorial.",
        "accent": "rgb(106, 32, 40)",
        "link": "/projects/fragmentos-de-mi",
        "cover": "https://framerusercontent.com/images/wL7PRvSSBo2vdCvV7xOutQWMr0.jpg",
        "files": [
            {
                "src": "https://framerusercontent.com/images/wL7PRvSSBo2vdCvV7xOutQWMr0.jpg",
                "name": "FRAGMENTOS_DE_MI_01.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/QZFyMv6mwT6e92uplNsoQuO9N7w.jpg",
                "name": "FRAGMENTOS_DE_MI_02.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/j5BKFtxHd3WETclByjQNHghPDQ.jpg",
                "name": "FRAGMENTOS_DE_MI_03.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/y2T8xeO8wmVbZwajwbSNisf0Va4.jpg",
                "name": "FRAGMENTOS_DE_MI_04.jpg"
            }
        ]
    },
    {
        "slug": "ex-corpo",
        "title": "EX_CORPO",
        "number": 4,
        "category": "Moda",
        "year": 2025,
        "context": "Técnicas de confección e introducción al patronaje — 1º curso, ESD Madrid. 2025",
        "short": "Conjunto que articula la tensión entre protección y vulnerabilidad, el silencio que carga y la espalda que se abre.",
        "accent": "rgb(36, 58, 45)",
        "link": "/projects/ex-corpo",
        "cover": "https://framerusercontent.com/images/tAfBzbrQKAdkJfw2yFZLwlLzdgo.jpg",
        "files": [
            {
                "src": "https://framerusercontent.com/images/tAfBzbrQKAdkJfw2yFZLwlLzdgo.jpg",
                "name": "EX_CORPO_01.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/31ssqygKX4hMxVRUgqGLebvJE.jpg",
                "name": "EX_CORPO_02.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/Yu7TyjepCunpiT0lA0ruuLuH9p0.jpg",
                "name": "EX_CORPO_03.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/gXE7Ysme4cOTfDeiN7Ht4eKfSaQ.jpg",
                "name": "EX_CORPO_04.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/xN7TaaVwM3s8RhYxz0lKvkT7c.jpg",
                "name": "EX_CORPO_05.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/T6AkGAtNFAB3rUr0KP6fmbHRQ.jpg",
                "name": "EX_CORPO_06.jpg"
            }
        ]
    },
    {
        "slug": "amman",
        "title": "AMMAN",
        "number": 5,
        "category": "Moda",
        "year": 2026,
        "context": "En colaboración con Ana Valle Ruiz (@a.valleey). 2026",
        "short": "Colección inspirada en la marquesa Luisa Casati y el Dior de Galliano de 1998: la estética de la bancarrota.",
        "accent": "rgb(106, 32, 40)",
        "link": "/projects/amman",
        "cover": "https://framerusercontent.com/images/e3twJmi8uu0OFd3vSCklTLJvD0.jpg",
        "files": [
            {
                "src": "https://framerusercontent.com/images/e3twJmi8uu0OFd3vSCklTLJvD0.jpg",
                "name": "AMMAN_01.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/fxzsjlZ2QzxNVdjcLV4ywD1T3L8.jpg",
                "name": "AMMAN_02.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/iVV2qBhWerlBNqej9O6N5nWX6mA.jpg",
                "name": "AMMAN_03.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/1x4unXLnt8cC06JMnigN7bBdxk.jpg",
                "name": "AMMAN_04.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/snZhdYvc8kq2IIlvZbzqrN0fc4.jpg",
                "name": "AMMAN_05.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/JuNJ2bnQkgtgTWrlW1nUSH8LMwc.jpg",
                "name": "AMMAN_06.jpg"
            },
            {
                "src": "https://framerusercontent.com/images/TK8xdr4bXDakI1ydqq2NY9qcfw.jpg",
                "name": "AMMAN_07.jpg"
            }
        ]
    }
]
// @archive-data-end

const INK = "#111111"
const PAPER = "#F4F2ED"
const SHEET = "#FBFAF7"
const FOG = "#D7D4CD"
const ASH = "#7C7973"
const MONO = `"IBM Plex Mono", Menlo, monospace`
const DISPLAY = `"Bodoni Moda", "Didot", Georgia, serif`
const UI = `"Inter", -apple-system, sans-serif`
const EASE = [0.22, 1, 0.36, 1] as const
const thumb = (src: string, w: number) => (src.includes("framerusercontent.com/images/") ? `${src}?scale-down-to=${w}` : src)

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
                            {!narrow && head("category", "Categoría", "0 0 112px")}
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
                                            padding: narrow ? "10px" : "12px 10px",
                                            borderBottom: `1px solid ${FOG}`,
                                            background: on ? p.accent : "transparent",
                                            color: on ? PAPER : INK,
                                            textDecoration: "none",
                                            transition: "background 250ms ease-out, color 250ms ease-out",
                                        }}
                                    >
                                        <span style={{ flex: "0 0 34px", fontFamily: MONO, fontSize: 11 }}>{String(p.number).padStart(2, "0")}</span>
                                        {narrow && <img src={thumb(p.cover, 160)} alt="" style={{ width: 44, height: 54, objectFit: "cover", display: "block" }} />}
                                        <span style={{ flex: "1 1 auto", fontFamily: DISPLAY, fontSize: narrow ? 17 : 20, lineHeight: 1.1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</span>
                                        {!narrow && (
                                            <span style={{ flex: "0 0 112px", fontFamily: MONO, fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase" }}>{p.category}</span>
                                        )}
                                        <span style={{ flex: "0 0 44px", textAlign: "right", fontFamily: MONO, fontSize: 11 }}>{p.year}</span>
                                        <span style={{ flex: "0 0 14px", display: "flex", justifyContent: "flex-end" }}>
                                            <span style={{ width: 9, height: 9, borderRadius: "50%", background: on ? PAPER : p.accent }} />
                                        </span>
                                    </a>
                                </Link>
                            )
                        })}
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
                                        <span style={{ fontFamily: DISPLAY, fontSize: 28, lineHeight: 1 }}>{cur.title}</span>
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
