// ProjectSequence — la secuencia de fotos de un proyecto como tira de contacto.
// · Película con perforaciones y número de fotograma; se arrastra en horizontal.
// · Clic en un fotograma → visor a pantalla completa (← → , Esc, deslizar en móvil).
// Las fotos vienen del bloque @archive-data (scripts/sync-archive-data.mjs).

import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { createPortal } from "react-dom"

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
const FOG = "var(--ag-fog, #D7D4CD)"
const ASH = "var(--ag-ash, #7C7973)"
const UI = `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
const MONO = `"IBM Plex Mono", Menlo, monospace`
const DISPLAY = `"AG Bodoni", "Bodoni Moda", "Didot", Georgia, serif`
const opsz = (px: number) => `"opsz" ${Math.max(6, Math.min(96, Math.round(px)))}`
const EASE = [0.22, 1, 0.36, 1] as const
const AG_BODONI_CSS = `@font-face{font-family:"AG Bodoni";font-style:normal;font-weight:400 900;font-display:swap;src:url(https://fonts.gstatic.com/s/bodonimoda/v28/aFTQ7PxzY382XsXX63LUYJSKSKjWXFBP.woff2) format("woff2")}@font-face{font-family:"AG Bodoni";font-style:italic;font-weight:400 900;font-display:swap;src:url(https://fonts.gstatic.com/s/bodonimoda/v28/aFTS7PxzY382XsXX63LUYJSPeKrcW3JNsao.woff2) format("woff2")}`
function useAgBodoni() {
    React.useEffect(() => {
        if (typeof document === "undefined" || document.getElementById("ag-bodoni-face")) return
        const s = document.createElement("style")
        s.id = "ag-bodoni-face"
        s.textContent = AG_BODONI_CSS
        document.head.appendChild(s)
    }, [])
}
function typeset(t: string): React.ReactNode {
    if (!t || !t.includes("_")) return t
    return t.split(/(_)/).map((part, i) => (part === "_" ? <span key={i} style={{ fontFamily: MONO, fontWeight: 500, fontVariationSettings: "normal" }}>_</span> : part))
}
const thumb = (src: string, w: number) => (src.includes("framerusercontent.com/images/") ? `${src}?scale-down-to=${w}` : src)

// Proyecto actual: el control (enlazado al título del CMS) o, si no, la URL /projects/<slug>
function useProject(hint: string): ArchiveProject | undefined {
    const byHint = (h: string) => {
        const k = (h || "").trim().toLowerCase()
        return PROJECTS.find((p) => p.slug === k || p.title.toLowerCase() === k)
    }
    const [p, setP] = React.useState<ArchiveProject | undefined>(() => byHint(hint))
    React.useEffect(() => {
        const fromHint = byHint(hint)
        if (fromHint) return setP(fromHint)
        const m = window.location.pathname.match(/\/projects\/([^/?#]+)/)
        setP((m && byHint(decodeURIComponent(m[1]))) || PROJECTS[0])
    }, [hint])
    return p
}


function Sprockets() {
    return <div aria-hidden style={{ height: 14, backgroundImage: "radial-gradient(ellipse 4px 3px at 50% 50%, rgba(244,242,237,.82) 98%, transparent 100%)", backgroundSize: "18px 14px", backgroundRepeat: "repeat-x", backgroundPosition: "6px 0" }} />
}

function Viewer({ p, start, onClose }: { p: ArchiveProject; start: number; onClose: () => void }) {
    const reduce = useReducedMotion()
    const [i, setI] = React.useState(start)
    const n = p.files.length
    const go = (d: number) => setI((x) => (x + d + n) % n)
    React.useEffect(() => {
        const on = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
            if (e.key === "ArrowRight") go(1)
            if (e.key === "ArrowLeft") go(-1)
        }
        window.addEventListener("keydown", on)
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            window.removeEventListener("keydown", on)
            document.body.style.overflow = prev
        }
    }, [])
    React.useEffect(() => {
        const nx = p.files[(i + 1) % n]
        if (nx) new Image().src = thumb(nx.src, 2048)
    }, [i])
    const f = p.files[i]
    return createPortal(
        <motion.div
            role="dialog"
            aria-label={`${p.title} — ${f.name}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ position: "fixed", inset: 0, zIndex: 2500, background: "#0B0B0B", color: "#F4F2ED", display: "flex", flexDirection: "column", fontFamily: UI }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 20px", fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.accent, flexShrink: 0 }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <span style={{ opacity: 0.6 }}>
                        {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                    </span>
                    <button type="button" onClick={onClose} aria-label="Cerrar" style={{ background: "none", border: "1px solid rgba(244,242,237,.5)", color: "inherit", fontFamily: MONO, fontSize: 11, padding: "3px 9px", cursor: "pointer" }}>
                        ESC ×
                    </button>
                </span>
            </div>
            <div style={{ position: "relative", flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 56px" }}>
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.img
                        key={f.src}
                        src={thumb(f.src, 2048)}
                        alt={`${p.title} — fotograma ${i + 1}`}
                        drag={reduce ? false : "x"}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.5}
                        onDragEnd={(_, info) => (info.offset.x < -60 ? go(1) : info.offset.x > 60 ? go(-1) : null)}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block", cursor: "grab", userSelect: "none" }}
                        draggable={false}
                    />
                </AnimatePresence>
                {n > 1 &&
                    [-1, 1].map((d) => (
                        <button key={d} type="button" aria-label={d < 0 ? "Anterior" : "Siguiente"} onClick={() => go(d)} style={{ position: "absolute", top: "50%", [d < 0 ? "left" : "right"]: 10, transform: "translateY(-50%)", width: 40, height: 40, border: "1px solid rgba(244,242,237,.4)", background: "rgba(11,11,11,.4)", color: "#F4F2ED", fontFamily: MONO, fontSize: 14, cursor: "pointer" }}>
                            {d < 0 ? "←" : "→"}
                        </button>
                    ))}
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "14px 16px 18px", overflowX: "auto" }}>
                {p.files.map((x, k) => (
                    <button key={x.src} type="button" onClick={() => setI(k)} aria-label={`Fotograma ${k + 1}`} style={{ flex: "0 0 auto", padding: 0, border: "none", background: "none", cursor: "pointer", outline: k === i ? `2px solid ${p.accent}` : "none", outlineOffset: 2, opacity: k === i ? 1 : 0.45, transition: "opacity .2s" }}>
                        <img src={thumb(x.src, 160)} alt="" style={{ height: 44, display: "block" }} />
                    </button>
                ))}
            </div>
        </motion.div>,
        document.body
    )
}

interface Props {
    project: string
    height: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1000
 * @framerIntrinsicHeight 330
 */
export default function ProjectSequence({ project, height: h0, style }: Props) {
    useAgBodoni()
    const height = Number(h0) || 230
    const p = useProject(project)
    const reduce = useReducedMotion()
    const [open, setOpen] = React.useState<number | null>(null)
    const wrap = React.useRef<HTMLDivElement>(null)
    const strip = React.useRef<HTMLDivElement>(null)
    const [limit, setLimit] = React.useState(0)
    const dragged = React.useRef(false)

    React.useLayoutEffect(() => {
        const m = () => setLimit(Math.min(0, (wrap.current?.clientWidth ?? 0) - (strip.current?.scrollWidth ?? 0)))
        m()
        const ro = new ResizeObserver(m)
        if (wrap.current) ro.observe(wrap.current)
        if (strip.current) ro.observe(strip.current)
        return () => ro.disconnect()
    }, [p, height])

    if (!p) return <div style={{ ...style, height }} />
    const code = p.title.replace(/[^A-Z0-9]/gi, "").slice(0, 4).toUpperCase()

    return (
        <div style={{ ...style, width: "100%", fontFamily: UI, color: INK }}>
            <div ref={wrap} style={{ position: "relative", overflow: "hidden", background: "#121212", padding: "0 0", cursor: limit < 0 ? "grab" : "default" }}>
                <Sprockets />
                <motion.div
                    ref={strip}
                    drag={limit < 0 ? "x" : false}
                    dragConstraints={{ left: limit, right: 0 }}
                    dragElastic={0.06}
                    dragTransition={{ power: 0.25, timeConstant: 260 }}
                    onDragStart={() => (dragged.current = true)}
                    onDragEnd={() => window.setTimeout(() => (dragged.current = false), 0)}
                    style={{ display: "flex", gap: 10, padding: "8px 12px", width: "max-content" }}
                >
                    {p.files.map((f, i) => (
                        <motion.button
                            key={f.src}
                            type="button"
                            onClick={() => !dragged.current && setOpen(i)}
                            aria-label={`Ver fotograma ${i + 1} de ${p.title}`}
                            initial={reduce ? false : { opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: EASE, delay: Math.min(i, 8) * 0.05 }}
                            whileHover={reduce ? undefined : { y: -3 }}
                            style={{ flex: "0 0 auto", padding: 0, border: "none", background: "none", cursor: "zoom-in", display: "flex", flexDirection: "column", gap: 6 }}
                        >
                            <img src={thumb(f.src, 768)} alt="" loading="lazy" draggable={false} style={{ height, display: "block", userSelect: "none" }} />
                            <span style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.12em", color: "rgba(244,242,237,.78)" }}>
                                <span>
                                    {code} ▸ {String(i + 1).padStart(2, "0")}A
                                </span>
                                <span style={{ color: p.accent === "#111111" ? "inherit" : p.accent, filter: "brightness(1.6)" }}>■</span>
                            </span>
                        </motion.button>
                    ))}
                </motion.div>
                <Sprockets />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 10, fontFamily: MONO, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: ASH }}>
                <span>
                    {p.files.length} fotogramas · {limit < 0 ? "arrastra la tira" : "clic para ampliar"}
                </span>
                <span>Clic = pantalla completa · ← →</span>
            </div>
            <AnimatePresence>{open !== null && typeof document !== "undefined" && <Viewer p={p} start={open} onClose={() => setOpen(null)} />}</AnimatePresence>
        </div>
    )
}

ProjectSequence.defaultProps = { project: "", height: 230 }

addPropertyControls(ProjectSequence, {
    project: { type: ControlType.String, title: "Proyecto", placeholder: "Título o slug (vacío = URL)" },
    height: { type: ControlType.Number, title: "Alto", min: 120, max: 420, step: 10, unit: "px" },
})
