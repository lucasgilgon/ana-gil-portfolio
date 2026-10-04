// ArchiveCloud — "nube de archivos" del escritorio de Ana Gil.
// Todas las fotos de los proyectos (desde ArchiveData, sincronizado con el CMS) se colocan
// como archivos agrupados por proyecto en un halo alrededor de la cara del retrato.
// · 3 tamaños: portada (con etiqueta), detalle y pequeño.
// · Al pasar el ratón por un archivo se ilumina todo su proyecto; el resto se atenúa.
// · Clic abre el proyecto; se pueden arrastrar.
// · Visualización → Ordenar (evento "ag:arrange") los lleva a columnas; Desordenar vuelve al halo.
// · En móvil: una pila deslizable por proyecto.

import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget, Link } from "framer"
import { motion, useReducedMotion } from "framer-motion"

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

// Texto sobre un acento: los acentos de proyecto son oscuros, así que el texto es papel claro
// también en modo noche; el acento "tinta" se invierte con el tema.
// Transición icono → portada: AgSystem hace crecer la foto pulsada hasta la portada del libro.
function openCover(root: Element | null, link?: string) {
    if (!root || !link || !link.startsWith("/projects/")) return
    const img = root.querySelector("img")
    if (!img) return
    const r = img.getBoundingClientRect()
    window.dispatchEvent(
        new CustomEvent("ag:open-cover", { detail: { src: img.currentSrc || img.src, rect: { x: r.left, y: r.top, w: r.width, h: r.height } } })
    )
}

const isInk = (a?: string) => !a || /--ag-ink|af4fc6f1|^#111111$/i.test(a.trim())
const acc = (a?: string) => (isInk(a) ? INK : (a as string))
const onAccent = (a?: string) => (isInk(a) ? PAPER : "#F4F2ED")

const MONO = `"IBM Plex Mono", Menlo, monospace`
const DISPLAY = `"Bodoni Moda", "Didot", Georgia, serif`
const EASE = [0.22, 1, 0.36, 1] as const

const thumb = (src: string, w: number) => (src.includes("framerusercontent.com/images/") ? `${src}?scale-down-to=${w}` : src)

// Pseudoaleatorio estable (misma composición en cada visita)
function rand(seed: number) {
    const x = Math.sin(seed * 9301 + 49297) * 233280
    return x - Math.floor(x)
}

type Placed = {
    key: string
    project: ArchiveProject
    index: number
    src: string
    name: string
    size: number
    x: number
    y: number
    rotate: number
    isCover: boolean
}

// Ángulo (grados, 0 = derecha, sentido horario en pantalla) de cada racimo alrededor de la cara
const ANGLES = [205, 262, 322, 28, 150, 95, 245, 350]

function layoutHalo(W: number, H: number, fx: number, fy: number, spread: number): Placed[] {
    const out: Placed[] = []
    const cx = W * fx
    const cy = H * fy
    const rx = W * 0.31 * spread
    const ry = H * 0.3 * spread
    PROJECTS.forEach((p, pi) => {
        const a = (ANGLES[pi % ANGLES.length] * Math.PI) / 180
        const ccx = cx + Math.cos(a) * rx
        const ccy = cy + Math.sin(a) * ry
        p.files.forEach((f, i) => {
            const size = i === 0 ? 116 : i < 3 ? 78 : 56
            const ga = i * 2.39996 + pi // ángulo áureo
            const r = i === 0 ? 0 : 58 + Math.sqrt(i) * 34
            let x = ccx + Math.cos(ga) * r - size / 2
            let y = ccy + Math.sin(ga) * r * 0.85 - size / 2
            x = Math.min(Math.max(x, 16), W - size - 16)
            y = Math.min(Math.max(y, 46), H - size - 150)
            // dejar libre la firma (abajo a la izquierda)
            if (x < 600 && y + size > H - 290) y = H - 290 - size
            out.push({
                key: `${p.slug}-${i}`,
                project: p,
                index: i,
                src: f.src,
                name: f.name,
                size,
                x,
                y,
                rotate: (rand(pi * 31 + i) - 0.5) * 6,
                isCover: i === 0,
            })
        })
    })
    return out
}

function layoutColumns(W: number, mode: string): Placed[] {
    const sorted = [...PROJECTS].sort((a, b) => {
        if (mode === "year") return b.year - a.year || a.number - b.number
        if (mode === "category") return a.category.localeCompare(b.category) || a.number - b.number
        return a.number - b.number
    })
    const colW = Math.min(170, (W - 96) / sorted.length)
    const out: Placed[] = []
    sorted.forEach((p, ci) => {
        p.files.forEach((f, i) => {
            const size = i === 0 ? Math.min(110, colW - 20) : 52
            const x = 48 + ci * colW + (i === 0 ? 0 : ((i - 1) % 2) * 58)
            const y = 96 + (i === 0 ? 0 : 150 + Math.floor((i - 1) / 2) * 60)
            out.push({ key: `${p.slug}-${i}`, project: p, index: i, src: f.src, name: f.name, size, x, y, rotate: 0, isCover: i === 0 })
        })
    })
    return out
}

function useSize(ref: React.RefObject<HTMLDivElement>) {
    const [s, setS] = React.useState({ w: 1200, h: 800 })
    React.useEffect(() => {
        const el = ref.current
        if (!el) return
        const ro = new ResizeObserver(([e]) => setS({ w: e.contentRect.width, h: e.contentRect.height }))
        ro.observe(el)
        return () => ro.disconnect()
    }, [ref])
    return s
}

function FileItem({
    p,
    active,
    dimmed,
    onHover,
    reduce,
    canvas,
    order,
    resetKey,
}: {
    p: Placed
    active: boolean
    dimmed: boolean
    onHover: (slug: string | null) => void
    reduce: boolean
    canvas: boolean
    order: number
    resetKey: number
}) {
    const dragged = React.useRef(false)
    const [hover, setHover] = React.useState(false)
    const accent = p.project.accent
    const label = p.isCover ? `${String(p.project.number).padStart(2, "0")} / ${p.project.title}` : p.name

    return (
        <motion.div
            initial={reduce || canvas ? false : { opacity: 0, scale: 0.6 }}
            animate={{ x: p.x, y: p.y, rotate: p.rotate, opacity: dimmed ? 0.22 : 1, scale: 1 }}
            transition={{
                x: { duration: reduce ? 0 : 0.7, ease: EASE, delay: reduce ? 0 : order * 0.018 },
                y: { duration: reduce ? 0 : 0.7, ease: EASE, delay: reduce ? 0 : order * 0.018 },
                rotate: { duration: 0.5, ease: EASE },
                opacity: { duration: 0.3, ease: "easeOut" },
                scale: { duration: reduce ? 0 : 0.6, ease: EASE, delay: reduce ? 0 : order * 0.018 },
            }}
            style={{ position: "absolute", left: 0, top: 0, zIndex: hover ? 20 : p.isCover ? 3 : 2 }}
        >
            <div
                onClickCapture={(e) => {
                    if (dragged.current) {
                        e.preventDefault()
                        e.stopPropagation()
                    } else openCover(e.currentTarget, p.project.link)
                }}
            >
                <Link href={p.project.link} motionChild>
                    <motion.a
                        key={resetKey}
                        drag={!canvas}
                        dragMomentum
                        dragTransition={{ power: 0.18, timeConstant: 220 }}
                        onPointerDown={() => (dragged.current = false)}
                        onDragStart={() => (dragged.current = true)}
                        onPointerEnter={(e) => {
                            if (e.pointerType !== "mouse") return
                            setHover(true)
                            onHover(p.project.slug)
                        }}
                        onPointerLeave={() => {
                            setHover(false)
                            onHover(null)
                        }}
                        whileHover={reduce ? undefined : { scale: 1.06 }}
                        whileDrag={{ scale: 1.08, rotate: 0, cursor: "grabbing" }}
                        draggable={false}
                        aria-label={`${p.project.title} — ${p.name}`}
                        style={
                            {
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 6,
                                width: Math.max(p.size, 96),
                                textDecoration: "none",
                                cursor: "default",
                                touchAction: "none",
                                userSelect: "none",
                                WebkitUserDrag: "none",
                            } as any
                        }
                    >
                        <img
                            src={thumb(p.src, p.size > 90 ? 512 : 256)}
                            alt={p.isCover ? p.project.title : ""}
                            draggable={false}
                            loading="lazy"
                            style={{
                                maxWidth: p.size,
                                maxHeight: p.size,
                                display: "block",
                                outline: active && hover ? `1px solid ${INK}` : "none",
                                outlineOffset: 3,
                            }}
                        />
                        {(p.isCover || hover) && (
                            <span
                                style={{
                                    padding: "2px 6px",
                                    background: active ? accent : "var(--ag-paper-90, rgba(244,242,237,0.9))",
                                    color: active ? onAccent(accent) : INK,
                                    fontFamily: MONO,
                                    fontSize: p.isCover ? 10.5 : 9.5,
                                    letterSpacing: "0.04em",
                                    textTransform: "uppercase",
                                    whiteSpace: "nowrap",
                                    transition: "background 250ms ease-out, color 250ms ease-out",
                                }}
                            >
                                {label}
                            </span>
                        )}
                    </motion.a>
                </Link>
            </div>
        </motion.div>
    )
}

function MobileStacks() {
    return (
        <div style={{ position: "absolute", inset: "52px 0 0 0", overflowY: "auto", paddingBottom: 260 }}>
            {PROJECTS.map((p) => (
                <div key={p.slug} style={{ marginBottom: 18 }}>
                    <Link href={p.link}>
                        <a style={{ display: "flex", alignItems: "baseline", gap: 8, padding: "0 16px 8px", textDecoration: "none", color: INK }}>
                            <span style={{ fontFamily: MONO, fontSize: 10, background: p.accent, color: onAccent(p.accent), padding: "1px 5px" }}>
                                {String(p.number).padStart(2, "0")}
                            </span>
                            <span style={{ fontFamily: DISPLAY, fontSize: 21, color: INK, background: "var(--ag-paper-90, rgba(244,242,237,0.92))", padding: "0 6px" }}>{p.title}</span>
                        </a>
                    </Link>
                    <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 16px", scrollSnapType: "x mandatory" }}>
                        {p.files.map((f, i) => (
                            <Link key={f.src} href={p.link}>
                                <a style={{ flex: "0 0 auto", scrollSnapAlign: "start" }} aria-label={`${p.title} — ${f.name}`}>
                                    <img src={thumb(f.src, 384)} alt={i === 0 ? p.title : ""} loading="lazy" style={{ height: i === 0 ? 150 : 110, display: "block" }} />
                                </a>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

interface Props {
    faceX: number
    faceY: number
    spread: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 800
 */
export default function ArchiveCloud({ faceX, faceY, spread, style }: Props) {
    const ref = React.useRef<HTMLDivElement>(null)
    const { w, h } = useSize(ref)
    const reduce = useReducedMotion() ?? false
    const canvas = RenderTarget.current() === RenderTarget.canvas
    const [mode, setMode] = React.useState("scatter")
    const [hovered, setHovered] = React.useState<string | null>(null)
    const [resetKey, setResetKey] = React.useState(0)

    React.useEffect(() => {
        const on = (e: Event) => {
            setMode((e as CustomEvent).detail?.mode ?? "number")
            setResetKey((k) => k + 1)
        }
        window.addEventListener("ag:arrange", on)
        return () => window.removeEventListener("ag:arrange", on)
    }, [])

    const mobile = w < 600
    const placed = React.useMemo(
        () => (mode === "scatter" ? layoutHalo(w, h, faceX, faceY, spread) : layoutColumns(w, mode)),
        [w, h, faceX, faceY, spread, mode]
    )

    return (
        <div ref={ref} style={{ ...style, position: "relative", width: "100%", height: "100%" }}>
            {mobile ? (
                <MobileStacks />
            ) : (
                placed.map((p, i) => (
                    <FileItem
                        key={p.key}
                        p={p}
                        order={i}
                        active={hovered === p.project.slug}
                        dimmed={hovered !== null && hovered !== p.project.slug}
                        onHover={setHovered}
                        reduce={reduce}
                        canvas={canvas}
                        resetKey={resetKey}
                    />
                ))
            )}
        </div>
    )
}

ArchiveCloud.defaultProps = { faceX: 0.5, faceY: 0.42, spread: 1 }

addPropertyControls(ArchiveCloud, {
    faceX: { type: ControlType.Number, title: "Cara X", min: 0, max: 1, step: 0.01 },
    faceY: { type: ControlType.Number, title: "Cara Y", min: 0, max: 1, step: 0.01 },
    spread: { type: ControlType.Number, title: "Apertura", min: 0.5, max: 1.6, step: 0.05 },
})
