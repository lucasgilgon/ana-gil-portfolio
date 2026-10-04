// TrashWindow — la Papelera del escritorio de Ana Gil.
// Una ventana de Finder con el material que no llegó al libro: bocetos, planos, tomas y pruebas.
// · Clic en un archivo → vista rápida grande con nota y enlace al proyecto.
// · "Vaciar…" pide confirmación como macOS; al vaciar, los archivos se van y aparece la sorpresa:
//   "El archivo no se borra: se transforma." Luego vuelven.
// · La barra de título arrastra la ventana (si la instancia lleva el override withWindow).

import * as React from "react"
import { addPropertyControls, ControlType, Link } from "framer"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

const INK = "var(--ag-ink, #111111)"
const PAPER = "var(--ag-paper, #F4F2ED)"
const SHEET = "var(--ag-sheet, #FBFAF7)"
const FOG = "var(--ag-fog, #D7D4CD)"
const ASH = "var(--ag-ash, #7C7973)"
const UI = `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
const MONO = `"IBM Plex Mono", Menlo, monospace`
const DISPLAY = `"AG Bodoni", "Bodoni Moda", "Didot", Georgia, serif`
// Tamaño óptico de la Bodoni ajustado al tamaño real (con opsz 96 en tamaños medianos los trazos finos desaparecen)
const opsz = (px: number) => `"opsz" ${Math.max(6, Math.min(96, Math.round(px)))}`

// Bodoni Moda variable (con eje de tamaño óptico) bajo un nombre propio, para no depender de la versión que cargue Framer
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

type TrashFile = { name: string; src: string; project: string; link: string; accent: string; note: string; kb: number }

const FILES: TrashFile[] = [
    { name: "ASH_boceto_A.png", src: "https://framerusercontent.com/images/39RAbHGX9w3h5lKnUxm0jRyafpM.jpg", project: "ASH ARCHIVE", link: "/projects/ash-archive", accent: "#A95A45", note: "Plano del vestido con volantes de gasa que caen como humo sobre el satén.", kb: 412 },
    { name: "EX_CORPO_plano_tecnico.jpg", src: "https://framerusercontent.com/images/iFuMndu9re5czgQgompZwXTjKj8.jpg", project: "EX_CORPO", link: "/projects/ex-corpo", accent: "#243A2D", note: "Plano técnico delantero y espalda: blusa de manga abullonada y falda con canesú.", kb: 1290 },
    { name: "FRAGMENTOS_sellos.jpg", src: "https://framerusercontent.com/images/vMwkTZUrgm49SQg4hzZT0jmw3bw.jpg", project: "FRAGMENTOS DE MÍ", link: "/projects/fragmentos-de-mi", accent: "#6A2028", note: "Pruebas de estampación de los sellos del kit: la casa, las tijeras, las gafas, YAYA.", kb: 846 },
    { name: "ASH_toma_02.jpg", src: "https://framerusercontent.com/images/gGBi0TXuVfvvx6cpWvVFWfWg.jpg", project: "ASH ARCHIVE", link: "/projects/ash-archive", accent: "#A95A45", note: "Una de las tres tomas casi idénticas: la sombra del encaje sobre la cara.", kb: 538 },
    { name: "AMMAN_acuarelas.jpg", src: "https://framerusercontent.com/images/bg6QtZJs9N5qk03RItyM24NXb4.jpg", project: "AMMAN", link: "/projects/amman", accent: "#6A2028", note: "Acuarelas de los figurines junto a las piezas ya montadas en el maniquí.", kb: 1104 },
    { name: "ASH_boceto_B.png", src: "https://framerusercontent.com/images/hjWJ0QGtp1Xiu9MCqTY2KcTKCk.jpg", project: "ASH ARCHIVE", link: "/projects/ash-archive", accent: "#A95A45", note: "Variante en satén con el bajo ondulado y la cola que arrastra.", kb: 398 },
    { name: "404_pliego.jpg", src: "https://framerusercontent.com/images/gsDA0e2dyWdyPUDrjWOVINsol8.jpg", project: "404:NOT FOUND_", link: "/projects/404-not-found", accent: "#6EA7CC", note: "Pliego abierto del libro: la retícula de iconos de error antes de imprimir.", kb: 972 },
    { name: "FRAGMENTOS_postal.jpg", src: "https://framerusercontent.com/images/6IwNrx76ju0dpBmWGdAsmc8AYQ.jpg", project: "FRAGMENTOS DE MÍ", link: "/projects/fragmentos-de-mi", accent: "#6A2028", note: "Postales escritas a mano: el tacto como forma de recordar.", kb: 655 },
    { name: "EX_CORPO_toma_vertical.jpg", src: "https://framerusercontent.com/images/ri0GYJ0FWBaylTl4f2UxPGZJR2g.jpg", project: "EX_CORPO", link: "/projects/ex-corpo", accent: "#243A2D", note: "Recorte vertical de la sesión, junto a la ventana.", kb: 301 },
]

const thumb = (src: string, w: number) => (src.includes("framerusercontent.com/images/") ? `${src}?scale-down-to=${w}` : src)
const fmtSize = (kb: number) => (kb >= 1000 ? `${(kb / 1000).toFixed(1).replace(".", ",")} MB` : `${kb} KB`)
// Inclinación fija por archivo (papeles tirados sin cuidado)
const tilt = (i: number) => [-4, 3, -2, 5, -3, 2, -5, 4, -1][i % 9]

function useNarrow(bp = 640) {
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

function TrashGlyph({ full }: { full: boolean }) {
    return (
        <svg width="14" height="15" viewBox="0 0 14 15" aria-hidden style={{ display: "block" }}>
            <path d="M1 3.5h12M5 3.5V2h4v1.5M2.5 3.5l.8 10h7.4l.8-10" fill="none" stroke="currentColor" strokeWidth="1.1" />
            {full && <path d="M5.2 6v5.5M7 6v5.5M8.8 6v5.5" stroke="currentColor" strokeWidth="1" />}
        </svg>
    )
}

interface Props {
    title: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 880
 * @framerIntrinsicHeight 640
 */
export default function TrashWindow({ title, style }: Props) {
    useAgBodoni()
    const reduce = useReducedMotion()
    const narrow = useNarrow()
    const [open, setOpen] = React.useState<number | null>(null)
    const [selected, setSelected] = React.useState<number | null>(null)
    const [confirm, setConfirm] = React.useState(false)
    const [phase, setPhase] = React.useState<"full" | "emptying" | "empty">("full")
    const total = FILES.reduce((n, f) => n + f.kb, 0)

    // Teclado: flechas para moverse, espacio/Enter para la vista rápida, Escape para cerrar
    React.useEffect(() => {
        const on = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(null)
                setConfirm(false)
                return
            }
            if (phase !== "full" || confirm) return
            if (open !== null && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
                e.preventDefault()
                setOpen((o) => ((o ?? 0) + (e.key === "ArrowRight" ? 1 : FILES.length - 1)) % FILES.length)
            } else if (open === null && selected !== null && (e.key === " " || e.key === "Enter")) {
                e.preventDefault()
                setOpen(selected)
            }
        }
        window.addEventListener("keydown", on)
        return () => window.removeEventListener("keydown", on)
    }, [open, selected, phase, confirm])

    const empty = () => {
        setConfirm(false)
        setSelected(null)
        setPhase("emptying")
        window.setTimeout(() => setPhase("empty"), reduce ? 0 : 900)
    }

    const startDrag = (e: React.PointerEvent) => {
        if ((e.target as HTMLElement).closest("a,button")) return
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
        window.dispatchEvent(new CustomEvent("ag:window-drag-start", { detail: e.nativeEvent }))
    }

    const cols = narrow ? 2 : 3

    return (
        <div
            style={{
                ...style,
                position: "relative",
                width: "100%",
                background: PAPER,
                border: `1px solid ${INK}`,
                color: INK,
                fontFamily: UI,
                boxSizing: "border-box",
                overflow: "hidden",
            }}
        >
            {/* Barra de título */}
            <div
                onPointerDown={startDrag}
                onDoubleClick={() => window.dispatchEvent(new CustomEvent("ag:window-drag-reset"))}
                style={{ height: 40, display: "flex", alignItems: "center", gap: 14, padding: "0 16px", borderBottom: `1px solid ${INK}`, cursor: "grab", userSelect: "none", touchAction: "none" }}
            >
                <div style={{ display: "flex", gap: 8 }}>
                    <Link href="/">
                        <a aria-label="Cerrar" style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57", display: "block" }} />
                    </Link>
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
                </div>
                <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: 12, letterSpacing: "0.04em", marginRight: 52 }}>
                    <TrashGlyph full={phase === "full"} />
                    {title}
                </div>
            </div>

            {/* Herramientas */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "8px 16px", borderBottom: `1px solid ${FOG}` }}>
                <span style={{ fontFamily: MONO, fontSize: 11, color: ASH, letterSpacing: "0.04em" }}>
                    {phase === "full" ? `${FILES.length} ítems · ${fmtSize(total)}` : "0 ítems"}
                </span>
                <button
                    type="button"
                    disabled={phase !== "full"}
                    onClick={() => setConfirm(true)}
                    style={{
                        fontFamily: MONO,
                        fontSize: 11,
                        letterSpacing: "0.04em",
                        padding: "3px 10px",
                        border: `1px solid ${INK}`,
                        background: "transparent",
                        color: INK,
                        cursor: phase === "full" ? "pointer" : "default",
                        opacity: phase === "full" ? 1 : 0.35,
                    }}
                >
                    Vaciar…
                </button>
            </div>

            {/* Contenido */}
            <div style={{ position: "relative", background: SHEET, minHeight: narrow ? 520 : 560, padding: narrow ? "18px 14px 28px" : "22px 28px 36px", boxSizing: "border-box" }}>
                <p style={{ margin: "0 0 22px", fontSize: 12.5, lineHeight: 1.5, color: ASH, maxWidth: 560 }}>
                    Lo que no llegó al libro también es el trabajo: bocetos, planos, tomas repetidas y pruebas de taller.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: narrow ? "22px 12px" : "30px 22px" }}>
                    {FILES.map((f, i) => {
                        const on = selected === i
                        return (
                            <motion.button
                                key={f.name}
                                type="button"
                                onClick={() => {
                                    setSelected(i)
                                    setOpen(i)
                                }}
                                onFocus={() => setSelected(i)}
                                initial={false}
                                animate={
                                    phase === "full"
                                        ? { opacity: 1, x: 0, y: 0, scale: 1, rotate: tilt(i) }
                                        : { opacity: 0, x: (1.5 - (i % cols)) * 60, y: -120 - (i % 3) * 30, scale: 0.15, rotate: tilt(i) * 6 }
                                }
                                transition={{ duration: reduce ? 0 : 0.7, ease: [0.55, 0, 0.3, 1], delay: reduce ? 0 : phase === "full" ? 0.05 * i : 0.04 * i }}
                                whileHover={phase === "full" && !reduce ? { rotate: 0, y: -4 } : undefined}
                                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 0, border: "none", background: "transparent", cursor: "default", font: "inherit", color: INK, pointerEvents: phase === "full" ? "auto" : "none" }}
                            >
                                <div style={{ height: narrow ? 120 : 132, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                                    <img
                                        src={thumb(f.src, 512)}
                                        alt={f.note}
                                        loading="lazy"
                                        draggable={false}
                                        style={{ maxHeight: narrow ? 120 : 132, maxWidth: "100%", display: "block", boxShadow: "0 1px 0 rgba(0,0,0,.08), 0 8px 18px rgba(0,0,0,.10)", outline: on ? `2px solid ${f.accent}` : "none", outlineOffset: 3 }}
                                    />
                                </div>
                                <span
                                    style={{
                                        maxWidth: "100%",
                                        fontFamily: MONO,
                                        fontSize: 10.5,
                                        lineHeight: 1.35,
                                        padding: "1px 5px",
                                        background: on ? f.accent : "transparent",
                                        color: on ? "#F4F2ED" : INK,
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {f.name}
                                </span>
                            </motion.button>
                        )
                    })}
                </div>

                {/* Sorpresa al vaciar */}
                <AnimatePresence>
                    {phase === "empty" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, padding: 28, textAlign: "center", background: SHEET }}
                        >
                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                                style={{ margin: 0, fontFamily: DISPLAY, fontVariationSettings: opsz(narrow ? 38 : 56), fontSize: narrow ? 38 : 56, lineHeight: 1.05, letterSpacing: "-0.01em", maxWidth: 620 }}
                            >
                                El archivo no se borra:
                                <br />
                                <em>se transforma.</em>
                            </motion.p>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ display: "flex", gap: 6 }}>
                                {["#6EA7CC", "#A95A45", "#6A2028", "#243A2D"].map((c) => (
                                    <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                                ))}
                            </motion.div>
                            <motion.button
                                type="button"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.4 }}
                                onClick={() => setPhase("full")}
                                style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.04em", padding: "4px 12px", border: `1px solid ${INK}`, background: "transparent", color: INK, cursor: "pointer" }}
                            >
                                Restaurar los {FILES.length} ítems
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Diálogo de confirmación */}
                <AnimatePresence>
                    {confirm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 60, background: "var(--ag-scrim, rgba(17,17,17,0.12))" }}
                            onClick={() => setConfirm(false)}
                        >
                            <motion.div
                                role="alertdialog"
                                aria-label="Vaciar la Papelera"
                                initial={{ y: -12, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -8, opacity: 0 }}
                                transition={{ duration: 0.22 }}
                                onClick={(e) => e.stopPropagation()}
                                style={{ width: "min(360px, 100%)", background: PAPER, border: `1px solid ${INK}`, padding: "20px 20px 16px", boxSizing: "border-box" }}
                            >
                                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>¿Vaciar la Papelera?</div>
                                <div style={{ fontSize: 12.5, lineHeight: 1.5, color: ASH, marginBottom: 18 }}>
                                    Se eliminarán {FILES.length} ítems del proceso de Ana. Esta acción no se puede deshacer… o quizá sí.
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                                    <button type="button" onClick={() => setConfirm(false)} style={{ fontFamily: MONO, fontSize: 11, padding: "4px 12px", border: `1px solid ${INK}`, background: "transparent", color: INK, cursor: "pointer" }}>
                                        Cancelar
                                    </button>
                                    <button type="button" autoFocus onClick={empty} style={{ fontFamily: MONO, fontSize: 11, padding: "4px 12px", border: `1px solid ${INK}`, background: INK, color: PAPER, cursor: "pointer" }}>
                                        Vaciar
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Barra de estado */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 16px", borderTop: `1px solid ${FOG}`, fontFamily: MONO, fontSize: 10.5, color: ASH, letterSpacing: "0.04em" }}>
                <span>Ana Gil / Archivo / Papelera</span>
                <span>{selected !== null && phase === "full" ? `${FILES[selected].name} · ${fmtSize(FILES[selected].kb)}` : "Espacio = vista rápida"}</span>
            </div>

            {/* Vista rápida */}
            <AnimatePresence>
                {open !== null && phase === "full" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        onClick={() => setOpen(null)}
                        style={{ position: "fixed", inset: 0, zIndex: 1500, background: "var(--ag-scrim, rgba(17,17,17,0.12))", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
                    >
                        <motion.div
                            key={open}
                            role="dialog"
                            aria-label={FILES[open].name}
                            initial={{ scale: 0.96, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: "min(720px, 100%)", maxHeight: "calc(100vh - 32px)", display: "flex", flexDirection: "column", background: PAPER, border: `1px solid ${INK}` }}
                        >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, height: 36, padding: "0 12px", borderBottom: `1px solid ${INK}`, fontFamily: MONO, fontSize: 11.5 }}>
                                <button type="button" aria-label="Cerrar vista rápida" onClick={() => setOpen(null)} style={{ border: "none", background: "transparent", color: INK, fontSize: 15, cursor: "pointer", padding: 0 }}>
                                    ×
                                </button>
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{FILES[open].name}</span>
                                <span style={{ color: ASH }}>
                                    {open + 1}/{FILES.length}
                                </span>
                            </div>
                            <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF", padding: 12 }}>
                                <img src={thumb(FILES[open].src, 1600)} alt={FILES[open].note} style={{ maxWidth: "100%", maxHeight: "min(62vh, 640px)", display: "block" }} />
                            </div>
                            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, padding: "12px 14px", borderTop: `1px solid ${FOG}` }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.06em", color: ASH, marginBottom: 4 }}>
                                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: FILES[open].accent }} />
                                        {FILES[open].project}
                                    </div>
                                    <div style={{ fontSize: 13, lineHeight: 1.45, maxWidth: 480 }}>{FILES[open].note}</div>
                                </div>
                                <Link href={FILES[open].link}>
                                    <a style={{ flexShrink: 0, fontFamily: MONO, fontSize: 11, padding: "5px 10px", background: INK, color: PAPER, textDecoration: "none", whiteSpace: "nowrap" }}>Ver proyecto →</a>
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

TrashWindow.defaultProps = { title: "Papelera" }

addPropertyControls(TrashWindow, {
    title: { type: ControlType.String, title: "Título" },
})
