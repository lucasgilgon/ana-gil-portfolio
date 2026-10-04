// PhotosApp — la app Fotos de macOS con TODAS las fotos del archivo de Ana.
// · Barra lateral: Biblioteca, Proceso (lo que está en la Papelera) y un álbum por proyecto.
// · Vistas: Años / Proyectos / Todas las fotos, con control de tamaño de miniaturas.
// · Clic en una foto → visor con tira de miniaturas, ← → y panel de información (ⓘ).
// Las fotos de proyectos vienen del bloque @archive-data (scripts/sync-archive-data.mjs).

import * as React from "react"
import { addPropertyControls, ControlType, Link } from "framer"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

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


const INK = "var(--ag-ink, #111111)"
const PAPER = "var(--ag-paper, #F4F2ED)"
const SHEET = "var(--ag-sheet, #FBFAF7)"
const SIDE = "var(--ag-side, #ECE9E2)"
const FOG = "var(--ag-fog, #D7D4CD)"
const ASH = "var(--ag-ash, #7C7973)"
const UI = `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", sans-serif`
const MONO = `"IBM Plex Mono", Menlo, monospace`
const EASE = [0.22, 1, 0.36, 1] as const
const thumb = (src: string, w: number) => (src.includes("framerusercontent.com/images/") ? `${src}?scale-down-to=${w}` : src)

// Material de proceso (el mismo que la Papelera)
const PROCESS: { name: string; src: string; project: string; link: string }[] = [
    { name: "ASH_boceto_A.png", src: "https://framerusercontent.com/images/39RAbHGX9w3h5lKnUxm0jRyafpM.jpg", project: "ASH ARCHIVE", link: "/projects/ash-archive" },
    { name: "ASH_boceto_B.png", src: "https://framerusercontent.com/images/hjWJ0QGtp1Xiu9MCqTY2KcTKCk.jpg", project: "ASH ARCHIVE", link: "/projects/ash-archive" },
    { name: "ASH_toma_02.jpg", src: "https://framerusercontent.com/images/gGBi0TXuVfvvx6cpWvVFWfWg.jpg", project: "ASH ARCHIVE", link: "/projects/ash-archive" },
    { name: "EX_CORPO_plano_tecnico.jpg", src: "https://framerusercontent.com/images/iFuMndu9re5czgQgompZwXTjKj8.jpg", project: "EX_CORPO", link: "/projects/ex-corpo" },
    { name: "EX_CORPO_toma_vertical.jpg", src: "https://framerusercontent.com/images/ri0GYJ0FWBaylTl4f2UxPGZJR2g.jpg", project: "EX_CORPO", link: "/projects/ex-corpo" },
    { name: "AMMAN_acuarelas.jpg", src: "https://framerusercontent.com/images/bg6QtZJs9N5qk03RItyM24NXb4.jpg", project: "AMMAN", link: "/projects/amman" },
    { name: "FRAGMENTOS_sellos.jpg", src: "https://framerusercontent.com/images/vMwkTZUrgm49SQg4hzZT0jmw3bw.jpg", project: "FRAGMENTOS DE MÍ", link: "/projects/fragmentos-de-mi" },
    { name: "FRAGMENTOS_postal.jpg", src: "https://framerusercontent.com/images/6IwNrx76ju0dpBmWGdAsmc8AYQ.jpg", project: "FRAGMENTOS DE MÍ", link: "/projects/fragmentos-de-mi" },
    { name: "404_pliego.jpg", src: "https://framerusercontent.com/images/gsDA0e2dyWdyPUDrjWOVINsol8.jpg", project: "404:NOT FOUND_", link: "/projects/404-not-found" },
]

type Photo = { src: string; name: string; project: string; slug: string; year: number; accent: string; link: string; process?: boolean }
type View = "years" | "projects" | "all"
type Album = "library" | "process" | string // slug

function buildPhotos(): Photo[] {
    const ps = [...PROJECTS].sort((a, b) => a.number - b.number)
    const out: Photo[] = []
    for (const p of ps) for (const f of p.files) out.push({ src: f.src, name: f.name, project: p.title, slug: p.slug, year: p.year, accent: p.accent, link: p.link })
    for (const f of PROCESS) {
        const p = ps.find((x) => x.title === f.project)
        out.push({ src: f.src, name: f.name, project: f.project, slug: p?.slug ?? "", year: p?.year ?? 2025, accent: p?.accent ?? "#7C7973", link: f.link, process: true })
    }
    return out
}

function useNarrow(bp = 760) {
    const [n, setN] = React.useState(false)
    React.useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${bp}px)`)
        const u = () => setN(mq.matches)
        u()
        mq.addEventListener?.("change", u)
        return () => mq.removeEventListener?.("change", u)
    }, [bp])
    return n
}

// ——— Iconos de la barra lateral (estilo SF Symbols, a línea) ————————————————
const Ico = ({ d }: { d: string }) => (
    <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden style={{ flexShrink: 0, color: "#1A73E8" }}>
        <path d={d} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)
const I_LIB = "M2 4.5h12v9H2zM4 2.5h8M3 11l3.2-3.2 2.3 2.3 1.5-1.5L14 12.6"
const I_TRASH = "M3 4h10M6 4V2.5h4V4M4 4l.7 9.5h6.6L12 4"
const I_ALBUM = "M2.5 3.5h11v9h-11zM2.5 6h11"

function SideItem({ icon, label, count, on, onClick, dot }: { icon?: string; label: string; count: number; on: boolean; onClick: () => void; dot?: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={on}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", border: "none", borderRadius: 6, background: on ? "rgba(0,0,0,.08)" : "transparent", color: INK, font: "inherit", fontSize: 13, textAlign: "left", cursor: "default" }}
        >
            {dot ? <span style={{ width: 9, height: 9, borderRadius: "50%", background: dot, margin: "0 3px", flexShrink: 0 }} /> : icon ? <Ico d={icon} /> : null}
            <span style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
            <span style={{ fontSize: 11, color: ASH, fontVariantNumeric: "tabular-nums" }}>{count}</span>
        </button>
    )
}

// ——— Visor —————————————————————————————————————————————————————————————
function Viewer({ list, start, onClose }: { list: Photo[]; start: number; onClose: () => void }) {
    const reduce = useReducedMotion()
    const [i, setI] = React.useState(start)
    const [info, setInfo] = React.useState(false)
    const n = list.length
    const go = (d: number) => setI((x) => (x + d + n) % n)
    React.useEffect(() => {
        const on = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
            if (e.key === "ArrowRight") go(1)
            if (e.key === "ArrowLeft") go(-1)
            if (e.key.toLowerCase() === "i") setInfo((v) => !v)
        }
        window.addEventListener("keydown", on)
        return () => window.removeEventListener("keydown", on)
    }, [])
    React.useEffect(() => {
        const nx = list[(i + 1) % n]
        if (nx) new Image().src = thumb(nx.src, 2048)
    }, [i])
    const f = list[i]
    const strip = React.useRef<HTMLDivElement>(null)
    React.useEffect(() => {
        const el = strip.current?.children[i] as HTMLElement | undefined
        el?.scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" })
    }, [i])
    return (
        <motion.div
            role="dialog"
            aria-label={f.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: "fixed", inset: 0, zIndex: 2500, background: "#141414", color: "#F2F2F2", display: "flex", flexDirection: "column", fontFamily: UI }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                <button type="button" onClick={onClose} style={{ border: "none", background: "rgba(255,255,255,.1)", color: "inherit", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer", fontFamily: UI }}>
                    ‹ Volver
                </button>
                <div style={{ textAlign: "center", minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.project}</div>
                    <div style={{ fontSize: 11, opacity: 0.6 }}>
                        {f.name} · {i + 1} de {n}
                    </div>
                </div>
                <button type="button" onClick={() => setInfo((v) => !v)} aria-pressed={info} aria-label="Información" style={{ border: "none", background: info ? "#1A73E8" : "rgba(255,255,255,.1)", color: "inherit", borderRadius: 999, width: 26, height: 26, fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                    i
                </button>
            </div>
            <div style={{ position: "relative", flex: 1, minHeight: 0, display: "flex" }}>
                <div style={{ position: "relative", flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 52px" }}>
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.img
                            key={f.src}
                            src={thumb(f.src, 2048)}
                            alt={`${f.project} — ${f.name}`}
                            drag={reduce ? false : "x"}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.5}
                            onDragEnd={(_, d) => (d.offset.x < -60 ? go(1) : d.offset.x > 60 ? go(-1) : null)}
                            initial={{ opacity: 0, scale: reduce ? 1 : 0.985 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: EASE }}
                            draggable={false}
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block", userSelect: "none" }}
                        />
                    </AnimatePresence>
                    {[-1, 1].map((d) => (
                        <button key={d} type="button" aria-label={d < 0 ? "Anterior" : "Siguiente"} onClick={() => go(d)} style={{ position: "absolute", top: "50%", [d < 0 ? "left" : "right"]: 10, transform: "translateY(-50%)", width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(255,255,255,.12)", color: "#fff", fontSize: 16, cursor: "pointer" }}>
                            {d < 0 ? "‹" : "›"}
                        </button>
                    ))}
                </div>
                <AnimatePresence>
                    {info && (
                        <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 240, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.25, ease: EASE }} style={{ overflow: "hidden", borderLeft: "1px solid rgba(255,255,255,.08)", background: "#1C1C1C" }}>
                            <div style={{ width: 240, padding: 16, boxSizing: "border-box", fontSize: 12.5, lineHeight: 1.5 }}>
                                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Información</div>
                                {[
                                    ["Archivo", f.name],
                                    ["Proyecto", f.project],
                                    ["Año", String(f.year)],
                                    ["Álbum", f.process ? "Proceso" : "Proyecto"],
                                    ["Autora", "Ana Gil"],
                                ].map(([k, v]) => (
                                    <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                                        <span style={{ opacity: 0.55 }}>{k}</span>
                                        <span style={{ textAlign: "right", overflowWrap: "anywhere" }}>{v}</span>
                                    </div>
                                ))}
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: f.accent }} />
                                    <Link href={f.link}>
                                        <a style={{ color: "#6AB0FF", textDecoration: "none" }}>Abrir el proyecto →</a>
                                    </Link>
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>
            </div>
            <div ref={strip} style={{ display: "flex", gap: 3, padding: "10px 14px 12px", overflowX: "auto", justifyContent: "flex-start" }}>
                {list.map((x, k) => (
                    <button key={x.src + k} type="button" onClick={() => setI(k)} aria-label={x.name} style={{ flex: "0 0 auto", padding: 0, border: "none", background: "none", cursor: "pointer", opacity: k === i ? 1 : 0.5, outline: k === i ? "2px solid #fff" : "none", outlineOffset: 1, transition: "opacity .2s" }}>
                        <img src={thumb(x.src, 160)} alt="" style={{ width: 38, height: 38, objectFit: "cover", display: "block" }} />
                    </button>
                ))}
            </div>
        </motion.div>
    )
}

// ——— Rejilla ——————————————————————————————————————————————————————————————
function Grid({ photos, cols, onOpen, all }: { photos: Photo[]; cols: number; onOpen: (p: Photo) => void; all: Photo[] }) {
    const reduce = useReducedMotion()
    return (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 2 }}>
            {photos.map((p, k) => (
                <motion.button
                    key={p.src}
                    type="button"
                    onClick={() => onOpen(p)}
                    aria-label={`${p.project} — ${p.name}`}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: Math.min(k, 24) * 0.015 }}
                    className="ag-ph-cell"
                    style={{ position: "relative", padding: 0, border: "none", background: "#E8E6E1", aspectRatio: "1 / 1", overflow: "hidden", cursor: "default" }}
                >
                    <img src={thumb(p.src, cols <= 3 ? 768 : 512)} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .5s cubic-bezier(.22,1,.36,1)" }} />
                    {p.process && (
                        <span style={{ position: "absolute", left: 5, bottom: 5, padding: "1px 5px", borderRadius: 4, background: "rgba(0,0,0,.55)", color: "#fff", fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.06em" }}>PROCESO</span>
                    )}
                </motion.button>
            ))}
        </div>
    )
}

interface Props {
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1100
 * @framerIntrinsicHeight 760
 */
export default function PhotosApp({ style }: Props) {
    const narrow = useNarrow()
    const all = React.useMemo(buildPhotos, [])
    const projects = React.useMemo(() => [...PROJECTS].sort((a, b) => a.number - b.number), [])
    const [view, setView] = React.useState<View>("all")
    const [album, setAlbum] = React.useState<Album>("library")
    const [year, setYear] = React.useState<number | null>(null)
    const [zoom, setZoom] = React.useState(3) // 1..5
    const [open, setOpen] = React.useState<{ list: Photo[]; i: number } | null>(null)

    const scoped = all.filter((p) => (album === "library" ? true : album === "process" ? p.process : p.slug === album && !p.process)).filter((p) => (year ? p.year === year : true))
    const cols = narrow ? 3 : [8, 7, 6, 5, 4][zoom - 1] ?? 6
    const years = Array.from(new Set(all.map((p) => p.year))).sort()
    const title = album === "library" ? "Biblioteca" : album === "process" ? "Proceso" : projects.find((p) => p.slug === album)?.title ?? ""
    const openPhoto = (list: Photo[]) => (p: Photo) => setOpen({ list, i: Math.max(0, list.indexOf(p)) })

    const startDrag = (e: React.PointerEvent) => {
        if ((e.target as HTMLElement).closest("a,button,input")) return
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
        window.dispatchEvent(new CustomEvent("ag:window-drag-start", { detail: e.nativeEvent }))
    }

    const seg = (v: View, label: string) => (
        <button
            key={v}
            type="button"
            onClick={() => {
                setView(v)
                if (v !== "all") setYear(null)
            }}
            aria-pressed={view === v}
            style={{ padding: "3px 12px", border: "none", borderRadius: 5, background: view === v ? "#FFFFFF" : "transparent", boxShadow: view === v ? "0 1px 2px rgba(0,0,0,.18)" : "none", color: "#1D1D1F", fontFamily: UI, fontSize: 12, cursor: "default", whiteSpace: "nowrap" }}
        >
            {label}
        </button>
    )

    return (
        <div data-ag-window="" style={{ ...style, position: "relative", width: "100%", background: SHEET, color: INK, fontFamily: UI, border: `1px solid ${INK}`, boxSizing: "border-box", overflow: "hidden" }}>
            <style>{`.ag-ph-cell:hover img{transform:scale(1.04)}`}</style>
            {/* Barra de título + herramientas (como Fotos) */}
            <div onPointerDown={startDrag} onDoubleClick={() => window.dispatchEvent(new CustomEvent("ag:window-drag-reset"))} style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 14px", height: 46, background: PAPER, borderBottom: `1px solid ${FOG}`, cursor: "grab", userSelect: "none", touchAction: "none" }}>
                <div style={{ display: "flex", gap: 8, width: narrow ? "auto" : 186 }}>
                    <Link href="/">
                        <a aria-label="Cerrar" style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57", display: "block" }} />
                    </Link>
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
                </div>
                {!narrow && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{title}</span>
                    </div>
                )}
                <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                    <div style={{ display: "flex", padding: 2, borderRadius: 7, background: "rgba(0,0,0,.07)" }}>
                        {seg("years", "Años")}
                        {seg("projects", "Proyectos")}
                        {seg("all", narrow ? "Todas" : "Todas las fotos")}
                    </div>
                </div>
                {!narrow && (
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: ASH }}>
                        <span aria-hidden>−</span>
                        <input type="range" min={1} max={5} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} aria-label="Tamaño de las miniaturas" style={{ width: 90, accentColor: "#1A73E8" }} />
                        <span aria-hidden>+</span>
                    </label>
                )}
            </div>

            <div style={{ display: "flex", minHeight: narrow ? 560 : 640 }}>
                {/* Barra lateral */}
                {!narrow && (
                    <aside style={{ width: 200, flexShrink: 0, padding: "12px 8px", background: SIDE, borderRight: `1px solid ${FOG}`, boxSizing: "border-box" }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: ASH, padding: "4px 8px" }}>Fotos</div>
                        <SideItem icon={I_LIB} label="Biblioteca" count={all.length} on={album === "library"} onClick={() => (setAlbum("library"), setYear(null))} />
                        <SideItem icon={I_TRASH} label="Proceso" count={all.filter((p) => p.process).length} on={album === "process"} onClick={() => (setAlbum("process"), setView("all"), setYear(null))} />
                        <div style={{ fontSize: 11, fontWeight: 600, color: ASH, padding: "16px 8px 4px" }}>Álbumes</div>
                        {projects.map((p) => (
                            <SideItem key={p.slug} dot={p.accent} label={p.title} count={p.files.length} on={album === p.slug} onClick={() => (setAlbum(p.slug), setView("all"), setYear(null))} />
                        ))}
                        <div style={{ margin: "18px 8px 0", paddingTop: 12, borderTop: `1px solid ${FOG}`, fontSize: 11, color: ASH, lineHeight: 1.5 }}>
                            Todas las fotos del archivo de Ana Gil. Clic para ampliar · ← → para pasar.
                        </div>
                    </aside>
                )}

                {/* Contenido */}
                <main style={{ flex: 1, minWidth: 0, padding: narrow ? "14px 10px 24px" : "18px 20px 28px", boxSizing: "border-box" }}>
                    {narrow && (
                        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12 }}>
                            {[{ id: "library", t: "Biblioteca" }, { id: "process", t: "Proceso" }, ...projects.map((p) => ({ id: p.slug, t: p.title }))].map((a) => (
                                <button key={a.id} type="button" onClick={() => (setAlbum(a.id), setView("all"), setYear(null))} style={{ flex: "0 0 auto", padding: "5px 11px", borderRadius: 999, border: `1px solid ${album === a.id ? INK : FOG}`, background: album === a.id ? INK : "transparent", color: album === a.id ? PAPER : INK, fontFamily: UI, fontSize: 12 }}>
                                    {a.t}
                                </button>
                            ))}
                        </div>
                    )}

                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
                        <div>
                            <div style={{ fontSize: narrow ? 22 : 28, fontWeight: 700, letterSpacing: "-0.02em" }}>{view === "years" ? "Años" : view === "projects" ? "Proyectos" : year ? String(year) : title}</div>
                            <div style={{ fontSize: 12, color: ASH, marginTop: 2 }}>
                                {view === "years" ? `${years.length} años` : view === "projects" ? `${projects.length} proyectos` : `${scoped.length} fotos`}
                                {year && view === "all" && (
                                    <button type="button" onClick={() => setYear(null)} style={{ marginLeft: 8, border: "none", background: "none", color: "#1A73E8", fontSize: 12, padding: 0, cursor: "pointer" }}>
                                        Ver todo
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div key={view + album + year} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                            {view === "years" && (
                                <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "repeat(2, 1fr)", gap: 14 }}>
                                    {years.map((y) => {
                                        const ys = all.filter((p) => p.year === y && !p.process)
                                        return (
                                            <button key={y} type="button" onClick={() => (setYear(y), setAlbum("library"), setView("all"))} style={{ position: "relative", padding: 0, border: "none", borderRadius: 12, overflow: "hidden", aspectRatio: "4 / 3", cursor: "default", background: "#222" }}>
                                                <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "2fr 1fr", gridTemplateRows: "1fr 1fr", gap: 2 }}>
                                                    {ys.slice(0, 3).map((p, k) => (
                                                        <img key={p.src} src={thumb(p.src, 768)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", gridRow: k === 0 ? "1 / 3" : undefined }} />
                                                    ))}
                                                </div>
                                                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.45), rgba(0,0,0,0) 40%)" }} />
                                                <div style={{ position: "absolute", left: 16, top: 12, color: "#fff", textAlign: "left" }}>
                                                    <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em" }}>{y}</div>
                                                    <div style={{ fontSize: 12, opacity: 0.85 }}>{ys.length} fotos</div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            )}

                            {view === "projects" &&
                                projects.map((p) => {
                                    const ps = all.filter((x) => x.slug === p.slug && !x.process)
                                    return (
                                        <section key={p.slug} style={{ marginBottom: 26 }}>
                                            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                                                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: p.accent, flexShrink: 0 }} />
                                                    <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em" }}>{p.title}</span>
                                                    <span style={{ fontSize: 12, color: ASH, whiteSpace: "nowrap" }}>
                                                        {p.category} · {p.year} · {ps.length} fotos
                                                    </span>
                                                </div>
                                                <Link href={p.link}>
                                                    <a style={{ fontSize: 12, color: "#1A73E8", textDecoration: "none", whiteSpace: "nowrap" }}>Ver proyecto</a>
                                                </Link>
                                            </div>
                                            <Grid photos={ps.slice(0, cols * 2)} cols={cols} onOpen={openPhoto(ps)} all={all} />
                                        </section>
                                    )
                                })}

                            {view === "all" && <Grid photos={scoped} cols={cols} onOpen={openPhoto(scoped)} all={all} />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            <AnimatePresence>{open && <Viewer list={open.list} start={open.i} onClose={() => setOpen(null)} />}</AnimatePresence>
        </div>
    )
}

addPropertyControls(PhotosApp, {})
