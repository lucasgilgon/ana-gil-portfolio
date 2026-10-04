// BootScreen v3 — arranque "a máquina de coser".
// La aguja de una máquina recorre la pantalla y cose "ANA GIL" en hilo rojo (pespunte);
// al terminar, el nombre se rellena en tinta y aparece la línea del portfolio.
// Solo en la primera visita de la sesión; clic o tecla para saltar. No se muestra en el canvas.
// Con "reducir movimiento" aparece el nombre sin animar.

import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

interface Props {
    name: string
    line2: string
    background: string
    color: string
    thread: string
    oncePerSession: boolean
}

const KEY = "ag-booted-v3"
const MONO = `"IBM Plex Mono", Menlo, monospace`
const AG_BODONI_CSS = `@font-face{font-family:"AG Bodoni";font-style:normal;font-weight:400 900;font-display:swap;src:url(https://fonts.gstatic.com/s/bodonimoda/v28/aFTQ7PxzY382XsXX63LUYJSKSKjWXFBP.woff2) format("woff2")}@font-face{font-family:"AG Bodoni";font-style:italic;font-weight:400 900;font-display:swap;src:url(https://fonts.gstatic.com/s/bodonimoda/v28/aFTS7PxzY382XsXX63LUYJSPeKrcW3JNsao.woff2) format("woff2")}`
const PAPER_TEX = "https://framerusercontent.com/images/QGFCBKJHDgtFUNQS5r0mAspNHk.jpg?scale-down-to=1024"

const STITCH_MS = 1900

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function BootScreen({ name, line2, background, color, thread, oncePerSession }: Props) {
    const reduce = useReducedMotion()
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const [show, setShow] = React.useState(false)
    const [phase, setPhase] = React.useState<"wait" | "stitch" | "fill">("wait")
    const textRef = React.useRef<SVGTextElement>(null)
    const clipRef = React.useRef<SVGRectElement>(null)
    const needleRef = React.useRef<SVGGElement>(null)
    const threadRef = React.useRef<SVGPathElement>(null)
    const done = React.useRef<() => void>(() => {})

    React.useEffect(() => {
        if (isCanvas) return
        let seen = false
        try {
            seen = oncePerSession && sessionStorage.getItem(KEY) === "1"
        } catch {}
        if (seen) return
        if (!document.getElementById("ag-bodoni-face")) {
            const s = document.createElement("style")
            s.id = "ag-bodoni-face"
            s.textContent = AG_BODONI_CSS
            document.head.appendChild(s)
        }
        setShow(true)
        let alive = true
        const timers: number[] = []
        const finish = () => {
            if (!alive) return
            alive = false
            setShow(false)
            try {
                sessionStorage.setItem(KEY, "1")
            } catch {}
        }
        done.current = finish
        // Espera a la fuente (máx. 700 ms) para medir el nombre
        const fontReady = (document as any).fonts?.load?.('400 200px "AG Bodoni"') ?? Promise.resolve()
        // Seguridad: pase lo que pase, el arranque no dura más de 6 s
        timers.push(window.setTimeout(finish, 6000))
        Promise.race([Promise.resolve(fontReady).catch(() => null), new Promise((r) => setTimeout(r, 700))]).then(() => {
            if (!alive) return
            if (reduce) {
                setPhase("fill")
                timers.push(window.setTimeout(finish, 900))
                return
            }
            setPhase("stitch")
        })
        const skip = () => finish()
        window.addEventListener("keydown", skip)
        return () => {
            alive = false
            timers.forEach(clearTimeout)
            window.removeEventListener("keydown", skip)
        }
    }, [isCanvas, oncePerSession, reduce])

    // Costura: la aguja recorre el nombre y el pespunte aparece detrás
    React.useEffect(() => {
        if (phase !== "stitch") return
        const t = textRef.current
        if (!t) return
        const b = t.getBBox()
        let raf = 0
        const t0 = performance.now()
        const step = (now: number) => {
            const k = Math.min(1, (now - t0) / STITCH_MS)
            const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
            const x = b.x - 6 + e * (b.width + 12)
            clipRef.current?.setAttribute("width", String(Math.max(0, x - b.x + 6)))
            const bob = Math.abs(Math.sin(now / 22)) * 14
            needleRef.current?.setAttribute("transform", `translate(${x} ${bob})`)
            threadRef.current?.setAttribute("d", `M 980 -40 Q ${(x + 980) / 2} ${-10 + bob} ${x} ${-6 + bob}`)
            if (k < 1) raf = requestAnimationFrame(step)
            else {
                setPhase("fill")
                window.setTimeout(() => done.current(), 1300)
            }
        }
        raf = requestAnimationFrame(step)
        return () => cancelAnimationFrame(raf)
    }, [phase])

    if (isCanvas)
        return <div style={{ padding: 8, fontFamily: MONO, fontSize: 10, color: "#918E88", background: "#F4F2ED" }}>Arranque (solo en la web)</div>

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="boot"
                    data-ag-boot=""
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    role="status"
                    aria-label={`${name} — ${line2}`}
                    onClick={() => done.current()}
                    style={{ position: "fixed", inset: 0, zIndex: 10000, background, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" }}
                >
                    <div aria-hidden style={{ position: "absolute", inset: 0, background: `url(${PAPER_TEX}) center/900px`, opacity: 0.35, mixBlendMode: "multiply", pointerEvents: "none" }} />
                    <svg viewBox="0 -60 1000 330" width="min(88vw, 980px)" aria-hidden style={{ overflow: "visible", opacity: phase === "wait" ? 0 : 1, transition: "opacity .2s" }}>
                        <defs>
                            <clipPath id="ag-boot-clip">
                                <rect ref={clipRef} x="0" y="-80" width={phase === "fill" ? 2000 : 0} height="400" />
                            </clipPath>
                        </defs>
                        {/* Pespunte: contorno del nombre en hilo, con puntadas */}
                        <text
                            ref={textRef}
                            x="500"
                            y="200"
                            textAnchor="middle"
                            fontFamily={`"AG Bodoni", "Bodoni Moda", Didot, Georgia, serif`}
                            fontSize="230"
                            letterSpacing="4"
                            style={{ fontVariationSettings: '"opsz" 96' }}
                            fill="none"
                            stroke={thread}
                            strokeWidth="2.2"
                            strokeDasharray="7 5"
                            strokeLinecap="round"
                            clipPath="url(#ag-boot-clip)"
                        >
                            {name}
                        </text>
                        {/* Relleno en tinta al terminar */}
                        <motion.text
                            x="500"
                            y="200"
                            textAnchor="middle"
                            fontFamily={`"AG Bodoni", "Bodoni Moda", Didot, Georgia, serif`}
                            fontSize="230"
                            letterSpacing="4"
                            style={{ fontVariationSettings: '"opsz" 96' }}
                            fill={color}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: phase === "fill" ? 1 : 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            {name}
                        </motion.text>
                        {/* Máquina: carrete, hilo, barra de aguja y prensatelas */}
                        {phase === "stitch" && (
                            <>
                                <g transform="translate(980 -52)">
                                    <rect x="-10" y="-4" width="20" height="26" rx="3" fill="#D8D4CC" stroke="#111" strokeWidth="1.2" />
                                    <rect x="-8" y="2" width="16" height="14" fill={thread} />
                                </g>
                                <path ref={threadRef} d="" fill="none" stroke={thread} strokeWidth="1.4" />
                                <g ref={needleRef}>
                                    <rect x="-7" y="-60" width="14" height="40" rx="2" fill="#B9B6AF" stroke="#111" strokeWidth="1.2" />
                                    <line x1="0" y1="-20" x2="0" y2="120" stroke="#6E6E6A" strokeWidth="3" strokeLinecap="round" />
                                    <ellipse cx="0" cy="102" rx="1.4" ry="4" fill="none" stroke="#3C3C3A" strokeWidth="1" />
                                </g>
                            </>
                        )}
                    </svg>
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: phase === "fill" ? 1 : 0, y: phase === "fill" ? 0 : 8 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{ marginTop: 18, fontFamily: MONO, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color }}
                    >
                        {line2}
                    </motion.div>
                    <div style={{ position: "absolute", bottom: 22, fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.12em", color, opacity: 0.4 }}>CLIC PARA ENTRAR</div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

BootScreen.defaultProps = {
    name: "ANA GIL",
    line2: "Portfolio 2026 · Fashion design",
    background: "#F4F2ED",
    color: "#111111",
    thread: "#B23A2B",
    oncePerSession: true,
}

addPropertyControls(BootScreen, {
    name: { type: ControlType.String, title: "Nombre" },
    line2: { type: ControlType.String, title: "Línea 2" },
    background: { type: ControlType.Color, title: "Fondo" },
    color: { type: ControlType.Color, title: "Tinta" },
    thread: { type: ControlType.Color, title: "Hilo" },
    oncePerSession: { type: ControlType.Boolean, title: "1 vez/sesión" },
})
