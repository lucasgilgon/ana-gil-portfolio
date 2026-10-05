// ProjectBook — el proyecto como libro que se lee pasando páginas (ventana "Vista previa").
// · Hojas en 3D: clic en la página derecha/izquierda, flechas ← →, o arrastrar la esquina.
// · Barra lateral con miniaturas de los pliegos (como Vista previa de macOS).
// · El libro cerrado se centra sobre su portada; al abrirlo se desplaza al centro.
import * as React from "react"
import { motion, motionValue, useMotionValue, useTransform, animate, type MotionValue } from "framer-motion"
import { Link } from "framer"
import Window, { INK, ASH, PAPER, SIDE, MONO } from "../../shell/Window"
import { buildPages, type PageDef } from "./pages"
import { thumb } from "../../lib/media"
import type { Project } from "../../content/generated"
import { PROJECTS } from "../../content/generated"

const RATIO = 0.72 // ancho / alto de una página
const TURN = { duration: 0.85, ease: [0.3, 0.1, 0.2, 1] as const }

// ——— Hoja: anverso (página derecha) y reverso (página izquierda al girar) ———————————
function Leaf({ k, front, back, pw, ph, z, rot, near, nFront }: { k: number; front: PageDef; back?: PageDef; pw: number; ph: number; z: number; rot: MotionValue<number>; near: boolean; nFront: number }) {
    const shadeF = useTransform(rot, [0, -90], [0, 0.32])
    const shadeB = useTransform(rot, [-90, -180], [0.32, 0])
    const lift = useTransform(rot, [0, -90, -180], [0, 1, 0])
    const shadow = useTransform(lift, (l) => `0 ${l * 18}px ${l * 40}px rgba(0,0,0,${0.08 + l * 0.18})`)
    const face: React.CSSProperties = { position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", overflow: "hidden" }
    return (
        <motion.div data-leaf={k} style={{ position: "absolute", left: pw, top: 0, width: pw, height: ph, transformOrigin: "0% 50%", transformStyle: "preserve-3d", rotateY: rot, zIndex: z }}>
            <motion.div style={{ ...face, boxShadow: shadow }}>
                {near ? front.render(pw, "r", nFront) : <div style={{ position: "absolute", inset: 0, background: PAPER }} />}
                {/* lomo y sombra de giro */}
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(90deg, rgba(0,0,0,.16), rgba(0,0,0,.04) 4%, transparent 9%)" }} />
                <motion.div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(90deg, rgba(0,0,0,.5), rgba(0,0,0,.15))", opacity: shadeF }} />
            </motion.div>
            <motion.div style={{ ...face, transform: "rotateY(180deg)", boxShadow: shadow }}>
                {back && near ? back.render(pw, "l", nFront + 1) : <div style={{ position: "absolute", inset: 0, background: PAPER }} />}
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(270deg, rgba(0,0,0,.16), rgba(0,0,0,.04) 4%, transparent 9%)" }} />
                <motion.div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(270deg, rgba(0,0,0,.5), rgba(0,0,0,.15))", opacity: shadeB }} />
            </motion.div>
        </motion.div>
    )
}

function useLeafRotations(n: number) {
    // Un MotionValue por hoja (n es fijo para cada proyecto)
    const ref = React.useRef<MotionValue<number>[]>([])
    if (ref.current.length !== n) ref.current = Array.from({ length: n }, () => motionValue(0))
    return ref.current
}

export default function ProjectBook({ project }: { project: Project }) {
    const pages = React.useMemo(() => buildPages(project), [project])
    const L = pages.length / 2
    const rots = useLeafRotations(L)
    const [flipped, setFlipped] = React.useState(0)
    const [moving, setMoving] = React.useState<number | null>(null)
    const queue = React.useRef(Promise.resolve())
    const stage = React.useRef<HTMLDivElement>(null)
    const [box, setBox] = React.useState({ w: 900, h: 600 })
    const bookX = useMotionValue(0)
    const flippedRef = React.useRef(0)
    flippedRef.current = flipped

    // Tamaño de página según el espacio disponible
    React.useLayoutEffect(() => {
        const el = stage.current
        if (!el) return
        const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight }))
        ro.observe(el)
        setBox({ w: el.clientWidth, h: el.clientHeight })
        return () => ro.disconnect()
    }, [])
    const ph = Math.max(240, Math.min(box.h - 56, (box.w - 48) / 2 / RATIO))
    const pw = Math.round(ph * RATIO)

    // Libro cerrado (portada) → centrado sobre la página derecha; contraportada → sobre la izquierda
    React.useEffect(() => {
        const x = flipped === 0 ? -pw / 2 : flipped === L ? pw / 2 : 0
        animate(bookX, x, { duration: 0.7, ease: [0.3, 0.1, 0.2, 1] })
    }, [flipped, pw, L, bookX])

    const turnTo = React.useCallback(
        (target: number) => {
            target = Math.max(0, Math.min(L, target))
            queue.current = queue.current.then(async () => {
                let cur = flippedRef.current
                const steps = Math.abs(target - cur)
                const dur = steps > 1 ? Math.max(0.32, 0.85 - steps * 0.08) : TURN.duration
                while (cur !== target) {
                    const fwd = target > cur
                    const leaf = fwd ? cur : cur - 1
                    setMoving(leaf)
                    cur = fwd ? cur + 1 : cur - 1
                    flippedRef.current = cur
                    setFlipped(cur)
                    const a = animate(rots[leaf], fwd ? -180 : 0, { ...TURN, duration: dur })
                    // con varias hojas, la siguiente sale antes de que acabe la anterior (efecto hojear)
                    if (cur !== target) await new Promise((r) => setTimeout(r, dur * 1000 * 0.35))
                    else await a
                }
                setMoving(null)
            })
        },
        [L, rots]
    )

    // Teclado
    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const t = e.target as HTMLElement
            if (t?.closest?.("input,textarea,[contenteditable]")) return
            if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
                e.preventDefault()
                turnTo(flippedRef.current + 1)
            } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
                e.preventDefault()
                turnTo(flippedRef.current - 1)
            } else if (e.key === "Home") turnTo(0)
            else if (e.key === "End") turnTo(L)
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [turnTo, L])

    // Arrastrar la esquina para pasar página (o clic)
    const drag = React.useRef<{ x: number; side: "l" | "r"; leaf: number; started: boolean; t: number } | null>(null)
    const onPointerDown = (e: React.PointerEvent) => {
        if ((e.target as HTMLElement).closest("a,button,[data-book-ui]")) return
        if (moving !== null) return
        const r = stage.current!.getBoundingClientRect()
        const cx = r.left + r.width / 2 + bookX.get()
        const side = e.clientX >= cx ? "r" : "l"
        const leaf = side === "r" ? flipped : flipped - 1
        if (leaf < 0 || leaf >= L) return
        drag.current = { x: e.clientX, side, leaf, started: false, t: performance.now() }
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }
    const onPointerMove = (e: React.PointerEvent) => {
        const d = drag.current
        if (!d) return
        const dx = e.clientX - d.x
        if (!d.started && Math.abs(dx) < 6) return
        if (!d.started) {
            d.started = true
            setMoving(d.leaf)
        }
        const k = Math.max(0, Math.min(1, (d.side === "r" ? -dx : dx) / (pw * 1.6)))
        rots[d.leaf].set(d.side === "r" ? -180 * k : -180 + 180 * k)
    }
    const onPointerUp = (e: React.PointerEvent) => {
        const d = drag.current
        drag.current = null
        if (!d) return
        if (!d.started) {
            turnTo(d.side === "r" ? flipped + 1 : flipped - 1)
            return
        }
        const v = rots[d.leaf].get()
        const fast = performance.now() - d.t < 260
        const done = d.side === "r" ? v < -70 || (fast && v < -12) : v > -110 || (fast && v > -168)
        const target = d.side === "r" ? (done ? -180 : 0) : done ? 0 : -180
        if (done) {
            const nf = d.side === "r" ? flipped + 1 : flipped - 1
            flippedRef.current = nf
            setFlipped(nf)
        }
        animate(rots[d.leaf], target, { duration: 0.45, ease: [0.2, 0.8, 0.3, 1] }).then(() => setMoving(null))
        void e
    }

    // z-index de cada hoja: las no giradas, la primera encima; las giradas, la última encima
    const zFor = (k: number) => (k === moving ? 500 : k < flipped ? k + 1 : L - k + 1)

    const leftPage = flipped > 0 ? 2 * flipped - 1 : -1
    const rightPage = flipped < L ? 2 * flipped : -1
    const counter = [leftPage, rightPage].filter((i) => i >= 0).map((i) => i + 1)
    const idx = PROJECTS.findIndex((x) => x.slug === project.slug)

    const btn: React.CSSProperties = { fontFamily: MONO, fontSize: 11, padding: "3px 10px", border: `1px solid ${INK}`, background: "transparent", color: INK, cursor: "pointer" }

    return (
        <Window
            label={`${project.title} — libro del proyecto`}
            title={
                <>
                    {project.title}.pdf <span style={{ color: ASH }}>— Vista previa</span>
                </>
            }
            toolbar={
                <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                    <button type="button" style={btn} onClick={() => turnTo(flipped - 1)} disabled={flipped === 0} aria-label="Página anterior">
                        ←
                    </button>
                    <button type="button" style={btn} onClick={() => turnTo(flipped + 1)} disabled={flipped === L} aria-label="Página siguiente">
                        →
                    </button>
                    <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.06em", color: ASH, marginLeft: 6 }}>
                        {counter.length === 2 ? `Págs. ${counter[0]}–${counter[1]}` : `Pág. ${counter[0]}`} de {pages.length}
                    </span>
                    <span style={{ flex: 1 }} />
                    <Link href={`${project.link}/moodboard`}>
                        <a style={{ ...btn, textDecoration: "none", fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase" }}>Moodboard</a>
                    </Link>
                    {project.probador.length > 0 && (
                        <Link href={`${project.link}/probador`}>
                            <a style={{ ...btn, textDecoration: "none", fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase" }}>Probador</a>
                        </Link>
                    )}
                    {project.external && (
                        <a href={project.external} target="_blank" rel="noopener" style={{ ...btn, textDecoration: "none", fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                            Libro completo ↗
                        </a>
                    )}
                </div>
            }
            status={
                <>
                    <span>
                        Proyecto {String(project.number).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")} · {project.category} · {project.year}
                    </span>
                    <span className="ag-hide-narrow">← → para pasar · arrastra la esquina</span>
                </>
            }
            sidebar={
                <nav aria-label="Páginas" className="ag-sidebar ag-book-thumbs" style={{ width: 132, flexShrink: 0, background: SIDE, borderRight: `1px solid ${INK}`, overflow: "auto", padding: "14px 12px 30px" }}>
                    {Array.from({ length: L + 1 }, (_, s) => {
                        const l = s > 0 ? pages[2 * s - 1] : null
                        const r = s < L ? pages[2 * s] : null
                        const on = s === flipped
                        return (
                            <button key={s} type="button" onClick={() => turnTo(s)} aria-current={on || undefined} aria-label={`Ir a ${[l?.label, r?.label].filter(Boolean).join(" y ")}`} style={{ display: "block", width: "100%", border: "none", background: "transparent", padding: 0, margin: "0 0 14px", cursor: "pointer" }}>
                                <div style={{ display: "flex", justifyContent: "center", gap: 1, outline: on ? `2px solid ${INK}` : "none", outlineOffset: 3 }}>
                                    {[l, r].map((pg, i) =>
                                        pg ? (
                                            <div key={i} style={{ width: 46, height: 46 / RATIO, background: "#FBFAF7", boxShadow: "0 1px 3px rgba(0,0,0,.15)", overflow: "hidden" }}>
                                                {pg.thumb ? <img src={thumb(pg.thumb, 160)} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <ThumbLines kind={pg.kind} />}
                                            </div>
                                        ) : (
                                            <div key={i} style={{ width: 46 }} />
                                        )
                                    )}
                                </div>
                                <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.06em", color: on ? INK : ASH, textTransform: "uppercase", textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r?.label ?? l?.label}</div>
                            </button>
                        )
                    })}
                </nav>
            }
            bodyStyle={{ overflow: "hidden", background: `radial-gradient(ellipse at 50% 40%, ${PAPER}, ${SIDE})` }}
        >
            <div
                ref={stage}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", touchAction: "pan-y", userSelect: "none", cursor: "default" }}
            >
                <motion.div style={{ x: bookX, position: "relative", width: pw * 2, height: ph, perspective: 2600, perspectiveOrigin: "50% 40%" }}>
                    {/* sombra del libro sobre la mesa */}
                    <div aria-hidden style={{ position: "absolute", left: flipped === 0 ? pw : 0, right: flipped === L ? pw : 0, top: 0, bottom: 0, boxShadow: "0 24px 60px rgba(0,0,0,.22), 0 4px 14px rgba(0,0,0,.12)", transition: "left .6s, right .6s" }} />
                    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
                        {Array.from({ length: L }, (_, k) => (
                            <Leaf key={k} k={k} front={pages[2 * k]} back={pages[2 * k + 1]} pw={pw} ph={ph} z={zFor(k)} rot={rots[k]} near={Math.abs(k - flipped) <= 2 || k === moving} nFront={2 * k + 1} />
                        ))}
                    </div>
                </motion.div>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, textAlign: "center", fontFamily: MONO, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: ASH, pointerEvents: "none" }}>
                    {flipped === 0 ? "Clic o → para abrir el libro" : idx >= 0 ? `${String(idx + 1).padStart(2, "0")} — ${project.title}` : ""}
                </div>
            </div>
        </Window>
    )
}

function ThumbLines({ kind }: { kind: string }) {
    if (kind === "back") return <div style={{ width: "100%", height: "100%", background: SIDE }} />
    return (
        <div style={{ padding: "18% 14%", display: "flex", flexDirection: "column", gap: 3 }}>
            {(kind === "cita" ? [70, 90, 60] : [40, 92, 88, 94, 80, 90, 60]).map((w, i) => (
                <span key={i} style={{ height: kind === "cita" ? 3 : 1.5, width: `${w}%`, background: "rgba(17,17,17,.35)" }} />
            ))}
        </div>
    )
}
