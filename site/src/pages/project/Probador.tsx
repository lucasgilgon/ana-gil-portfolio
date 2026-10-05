// Probador — las prendas de un proyecto en un burro de perchas.
// Al elegir una, el boceto (o plano técnico) y la foto final se superponen:
// · Cortina: se arrastra la línea para pasar del dibujo a la prenda real.
// · Calco: el dibujo se imprime encima de la foto, con su transparencia.
import * as React from "react"
import { motion, animate, useMotionValue, useTransform } from "framer-motion"
import { Link } from "framer"
import Window, { INK, ASH, PAPER, SHEET, SIDE, FOG, MONO, DISPLAY, opsz, ChromeCtx } from "../../shell/Window"
import type { Project } from "../../content/generated"
import { thumb, srcSet, imgInfo } from "../../lib/media"
import { typeset } from "./pages"

type Mode = "cortina" | "calco"

function Hanger({ label, on, accent, onClick }: { label: string; on: boolean; accent: string; onClick: () => void }) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            aria-pressed={on}
            animate={on ? { rotate: [0, -7, 5, -2, 0], y: 0 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.9 }}
            whileHover={{ rotate: -4 }}
            style={{ transformOrigin: "50% 0", border: "none", background: "transparent", padding: 0, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}
        >
            <svg width="86" height="44" viewBox="0 0 86 44" aria-hidden>
                <path d="M43 2 C49 2 49 10 43 12 L43 15 L6 36 C2 38 3 42 8 42 L78 42 C83 42 84 38 80 36 L43 15" fill="none" stroke={on ? INK : "#8E8A82"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ marginTop: -2, padding: "5px 9px 6px", background: on ? INK : "#FFFEFA", color: on ? PAPER : INK, border: `1px solid ${INK}`, fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.06em", textTransform: "uppercase", maxWidth: 150, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", boxShadow: "0 3px 8px rgba(0,0,0,.08)", position: "relative" }}>
                <span aria-hidden style={{ position: "absolute", left: 4, top: 4, width: 4, height: 4, borderRadius: "50%", background: accent }} />
                &nbsp;&nbsp;{label}
            </span>
        </motion.button>
    )
}

function Layer({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
    return <img src={thumb(src, 1200)} srcSet={srcSet(src)} sizes="700px" alt={alt} draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", ...style }} />
}

export default function Probador({ project }: { project: Project }) {
    const ios = React.useContext(ChromeCtx) === "ios"
    const items = project.probador
    const [i, setI] = React.useState(0)
    const [mode, setMode] = React.useState<Mode>("cortina")
    const g = items[i]
    const drawIdx = Math.max(0, g?.capas.findIndex((c) => /boceto|plano|dibujo/i.test(c.tipo)) ?? 0)
    const fotoIdx = Math.max(0, g?.capas.findIndex((c) => /^foto/i.test(c.tipo)) ?? 1)
    const [under, setUnder] = React.useState(drawIdx)
    const [over, setOver] = React.useState(fotoIdx)
    const split = useMotionValue(70) // % de la cortina
    const clip = useTransform(split, (v) => `inset(0 0 0 ${v}%)`)
    const left = useTransform(split, (v) => `${v}%`)
    const [alpha, setAlpha] = React.useState(0.55)
    const stage = React.useRef<HTMLDivElement>(null)

    // Al cambiar de prenda: dibujo debajo, foto encima y la cortina hace un barrido
    React.useEffect(() => {
        setUnder(drawIdx)
        setOver(fotoIdx)
        split.set(92)
        animate(split, 50, { duration: 1.1, ease: [0.3, 0.1, 0.2, 1], delay: 0.15 })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i])

    const drag = (e: React.PointerEvent) => {
        const r = stage.current?.getBoundingClientRect()
        if (!r) return
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
        const move = (ev: PointerEvent) => split.set(Math.max(0, Math.min(100, ((ev.clientX - r.left) / r.width) * 100)))
        move(e.nativeEvent)
        const up = () => {
            window.removeEventListener("pointermove", move)
            window.removeEventListener("pointerup", up)
        }
        window.addEventListener("pointermove", move)
        window.addEventListener("pointerup", up)
    }

    if (!g)
        return (
            <Window label="Probador" title={`Probador — ${project.title}`}>
                <p style={{ padding: 30, color: ASH }}>Este proyecto todavía no tiene prendas en el probador.</p>
            </Window>
        )

    const A = g.capas[under]
    const B = g.capas[over]
    const info = imgInfo(B?.src || "") || imgInfo(A?.src || "")
    const seg = (m: Mode, label: string) => (
        <button key={m} type="button" onClick={() => setMode(m)} aria-pressed={mode === m} style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 11px", border: "none", borderLeft: m === "calco" ? `1px solid ${INK}` : "none", background: mode === m ? INK : "transparent", color: mode === m ? PAPER : INK, cursor: "pointer" }}>
            {label}
        </button>
    )
    const chip = (k: number, on: boolean, set: (k: number) => void) => (
        <button key={k} type="button" onClick={() => set(k)} aria-pressed={on} style={{ display: "flex", alignItems: "center", gap: 7, width: "100%", padding: 5, border: `1px solid ${on ? INK : FOG}`, background: on ? "#FFFEFA" : "transparent", cursor: "pointer", textAlign: "left" }}>
            <img src={thumb(g.capas[k].src, 120)} alt="" style={{ width: 30, height: 38, objectFit: "cover", background: "#fff" }} />
            <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase", color: INK }}>{g.capas[k].tipo}</span>
        </button>
    )

    return (
        <Window
            label={`Probador de ${project.title}`}
            title={
                <>
                    Probador <span style={{ color: ASH }}>— {project.title}</span>
                </>
            }
            toolbar={
                <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
                    <div style={{ display: "flex", border: `1px solid ${INK}` }}>
                        {seg("cortina", "Cortina")}
                        {seg("calco", "Calco")}
                    </div>
                    {mode === "calco" && (
                        <label style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: MONO, fontSize: 10, color: ASH }}>
                            DIBUJO
                            <input type="range" min={0} max={1} step={0.01} value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} style={{ width: 110, accentColor: project.accent }} />
                        </label>
                    )}
                    <span style={{ flex: 1 }} />
                    <Link href={project.link}>
                        <a style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", color: INK }}>← Libro</a>
                    </Link>
                </div>
            }
            status={
                <>
                    <span>
                        {items.length} prendas · {g.capas.length} capas
                    </span>
                    <span className="ag-hide-narrow">Arrastra la línea · cambia de percha</span>
                </>
            }
            bodyStyle={{ display: "flex", flexDirection: "column", background: SHEET }}
        >
            {/* Burro de perchas */}
            <div style={{ position: "relative", flexShrink: 0, padding: "14px 24px 10px", borderBottom: `1px solid ${FOG}`, background: `linear-gradient(${PAPER}, ${SHEET})` }}>
                <div aria-hidden style={{ position: "absolute", left: 16, right: 16, top: 16, height: 4, borderRadius: 2, background: "linear-gradient(#C9C5BC, #8E8A82)" }} />
                <div style={{ position: "relative", display: "flex", gap: 22, overflowX: "auto", paddingTop: 0, scrollbarWidth: "none" }}>
                    {items.map((it, k) => (
                        <Hanger key={k} label={it.prenda} on={k === i} accent={project.accent} onClick={() => setI(k)} />
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, minHeight: ios ? 520 : 0, display: "flex", flexDirection: ios ? "column" : "row" }}>
                {/* Escenario */}
                <div style={{ flex: 1, minWidth: 0, minHeight: ios ? 460 : 0, display: "flex", alignItems: "center", justifyContent: "center", padding: ios ? 14 : 22, background: `radial-gradient(ellipse at 50% 45%, #FFFEFA, ${SIDE})` }}>
                    <div ref={stage} style={{ position: "relative", height: ios ? "auto" : "100%", width: ios ? "100%" : "auto", maxWidth: "100%", aspectRatio: info ? `${info.w} / ${info.h}` : "3 / 4", maxHeight: "100%", background: "#fff", boxShadow: "0 16px 40px rgba(0,0,0,.14)", overflow: "hidden", touchAction: "none", userSelect: "none" }}>
                        {A && <Layer src={A.src} alt={`${g.prenda} — ${A.tipo}`} />}
                        {B &&
                            (mode === "cortina" ? (
                                <motion.div style={{ position: "absolute", inset: 0, clipPath: clip, WebkitClipPath: clip as any }}>
                                    <Layer src={B.src} alt={`${g.prenda} — ${B.tipo}`} style={{ background: "#fff" }} />
                                </motion.div>
                            ) : (
                                // Calco: la foto se aclara como papel vegetal y el dibujo queda impreso encima
                                <Layer src={B.src} alt={`${g.prenda} — ${B.tipo}`} style={{ background: "#fff", opacity: 1 - alpha * 0.62 }} />
                            ))}
                        {mode === "calco" && A && <Layer src={A.src} alt="" style={{ mixBlendMode: "multiply", opacity: Math.min(1, 0.35 + alpha), filter: "contrast(1.6)" }} />}
                        {mode === "cortina" && (
                            <motion.div onPointerDown={drag} role="slider" aria-label="Cortina entre capas" aria-valuemin={0} aria-valuemax={100} tabIndex={0} style={{ position: "absolute", top: 0, bottom: 0, left, width: 40, marginLeft: -20, cursor: "ew-resize", display: "flex", justifyContent: "center" }}>
                                <span style={{ width: 1.5, height: "100%", background: "#fff", boxShadow: "0 0 0 .5px rgba(0,0,0,.4)" }} />
                                <span style={{ position: "absolute", top: "50%", width: 34, height: 34, marginTop: -17, borderRadius: "50%", background: "#fff", border: `1px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 12, color: INK, boxShadow: "0 4px 10px rgba(0,0,0,.2)" }}>⟷</span>
                            </motion.div>
                        )}
                        {mode === "cortina" && (
                            <>
                                <span style={{ position: "absolute", left: 10, top: 10, fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase", background: "rgba(255,254,250,.92)", padding: "3px 6px" }}>{A?.tipo}</span>
                                <span style={{ position: "absolute", right: 10, top: 10, fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase", background: "rgba(17,17,17,.82)", color: "#fff", padding: "3px 6px" }}>{B?.tipo}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Ficha de la prenda */}
                <aside style={{ width: ios ? "auto" : 250, flexShrink: 0, borderLeft: ios ? "none" : `1px solid ${FOG}`, borderTop: ios ? `1px solid ${FOG}` : "none", padding: "20px 18px", overflow: "auto", background: SHEET }}>
                    <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: ASH }}>
                        {project.title} · {String(i + 1).padStart(2, "0")}/{String(items.length).padStart(2, "0")}
                    </div>
                    <h2 style={{ margin: "8px 0 8px", fontFamily: DISPLAY, fontWeight: 400, fontSize: 28, lineHeight: 1.02, fontVariationSettings: opsz(28) }}>{typeset(g.prenda)}</h2>
                    {g.nota && <p style={{ margin: "0 0 18px", fontSize: 13, lineHeight: 1.5, color: "#3B3A38" }}>{g.nota}</p>}
                    <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: ASH, margin: "0 0 6px" }}>{mode === "cortina" ? "Izquierda" : "Dibujo"}</div>
                    <div style={{ display: "grid", gap: 5 }}>{g.capas.map((_, k) => chip(k, k === under, setUnder))}</div>
                    <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: ASH, margin: "16px 0 6px" }}>{mode === "cortina" ? "Derecha" : "Foto"}</div>
                    <div style={{ display: "grid", gap: 5 }}>{g.capas.map((_, k) => chip(k, k === over, setOver))}</div>
                </aside>
            </div>
        </Window>
    )
}
