// PostStamp — sello de correo de Ana Gil para la ventana "Nuevo mensaje".
// Sello perforado con su retrato y "AG"; al enviar el formulario de la página, un matasellos
// circular "MADRID · ESD · <año>" golpea el sello y aparece la hora de envío.
// Escucha el evento submit de cualquier formulario de la página (no necesita conexión en Framer).

import * as React from "react"
import { thumb } from "../lib/media"
import { addPropertyControls, ControlType } from "framer"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

const INK = "var(--ag-ink, #111111)"
const ASH = "var(--ag-ash, #7C7973)"
const MONO = `"IBM Plex Mono", Menlo, monospace`
const DISPLAY = `"AG Bodoni", "Bodoni Moda", "Didot", Georgia, serif`
const PORTRAIT = thumb("/media/sistema/retrato", 512)

// Borde dentado del sello: círculos recortados a lo largo del perímetro
// (capa 1: rectángulo interior sólido; capa 2: rejilla de agujeros que solo queda visible en el borde)
const PERF = (r: number) =>
    `linear-gradient(#000 0 0) center / calc(100% - ${r * 4}px) calc(100% - ${r * 4}px) no-repeat, radial-gradient(circle at center, transparent ${r}px, #000 ${r + 0.5}px) ${-r * 1.5}px ${-r * 1.5}px / ${r * 3}px ${r * 3}px round`

function Postmark({ year, color }: { year: number; color: string }) {
    const id = React.useId().replace(/:/g, "")
    return (
        <svg width="104" height="104" viewBox="0 0 104 104" aria-hidden style={{ display: "block", color }}>
            <defs>
                <path id={`pm${id}`} d="M52,52 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
            </defs>
            <circle cx="52" cy="52" r="46" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="52" cy="52" r="27" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <text fontFamily={MONO} fontSize="8.6" letterSpacing="2.2" fill="currentColor">
                <textPath href={`#pm${id}`} startOffset="0">
                    MADRID · ESD · {year} · MADRID · ESD ·
                </textPath>
            </text>
            <text x="52" y="49" textAnchor="middle" fontFamily={DISPLAY} fontSize="15" fill="currentColor">
                AG
            </text>
            <text x="52" y="61" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="1" fill="currentColor">
                ENVIADO
            </text>
        </svg>
    )
}

interface Props {
    color: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicWidth 150
 * @framerIntrinsicHeight 116
 */
export default function PostStamp({ color, style }: Props) {
    const reduce = useReducedMotion()
    const ref = React.useRef<HTMLDivElement>(null)
    const [sent, setSent] = React.useState<string | null>(null)
    const year = new Date().getFullYear()

    React.useEffect(() => {
        const onSubmit = (e: Event) => {
            const form = e.target as HTMLFormElement
            // Solo cuenta si los campos obligatorios son válidos (si no, el navegador no envía)
            if (form?.checkValidity && !form.checkValidity()) return
            const t = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(new Date())
            setSent(t)
        }
        document.addEventListener("submit", onSubmit, true)
        return () => document.removeEventListener("submit", onSubmit, true)
    }, [])

    return (
        <div ref={ref} style={{ ...style, position: "relative", width: 150, height: 116, userSelect: "none" }}>
            <h1 style={{ position: "absolute", width: 1, height: 1, margin: -1, padding: 0, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0 }}>Contacto — Ana Gil</h1>
            {/* Sello: la sombra va en un contenedor aparte para que la máscara del perforado no la recorte */}
            <motion.div
                whileHover={reduce ? undefined : { rotate: 0, y: -2 }}
                initial={false}
                animate={{ rotate: 3 }}
                style={{ position: "absolute", right: 6, top: 4, width: 82, height: 102, filter: "drop-shadow(0 1px 0 rgba(0,0,0,.18)) drop-shadow(0 4px 6px rgba(0,0,0,.12))" }}
            >
                <div style={{ width: "100%", height: "100%", padding: 7, boxSizing: "border-box", background: "#FFFFFF", WebkitMask: PERF(3), mask: PERF(3) }}>
                    <div style={{ position: "relative", width: "100%", height: "100%", border: `1px solid ${color}`, boxSizing: "border-box", overflow: "hidden", background: "#ECE9E2" }}>
                        <img src={PORTRAIT} alt="" draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", filter: "grayscale(1) contrast(1.05)", mixBlendMode: "multiply" }} />
                        <span style={{ position: "absolute", left: 4, top: 3, fontFamily: DISPLAY, fontSize: 15, lineHeight: 1, color: "#111111", fontVariationSettings: '"opsz" 15' }}>AG</span>
                        <span style={{ position: "absolute", right: 4, bottom: 3, fontFamily: MONO, fontSize: 7.5, letterSpacing: "0.06em", color: "#111111", background: "rgba(251,250,247,.85)", padding: "0 2px" }}>
                            {year}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Matasellos: golpea al enviar */}
            <AnimatePresence>
                {sent && (
                    <motion.div
                        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.8, rotate: -28 }}
                        animate={{ opacity: 0.88, scale: 1, rotate: -14 }}
                        transition={reduce ? { duration: 0.2 } : { type: "spring", stiffness: 520, damping: 22, mass: 0.7 }}
                        style={{ position: "absolute", left: 0, top: 4, mixBlendMode: "multiply", pointerEvents: "none" }}
                    >
                        <Postmark year={year} color={color} />
                        {/* Líneas onduladas de cancelación */}
                        <svg width="78" height="40" viewBox="0 0 78 40" aria-hidden style={{ position: "absolute", left: 66, top: 30, color }}>
                            {[8, 18, 28].map((y) => (
                                <path key={y} d={`M0 ${y} q9.5 -6 19 0 t19 0 t19 0 t19 0`} fill="none" stroke="currentColor" strokeWidth="1.6" />
                            ))}
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {sent && (
                    <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        style={{ position: "absolute", right: 6, bottom: -14, fontFamily: MONO, fontSize: 9, letterSpacing: "0.06em", color: ASH, whiteSpace: "nowrap" }}
                    >
                        MATASELLADO {sent}
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    )
}

PostStamp.defaultProps = { color: "#6A2028" }

addPropertyControls(PostStamp, {
    color: { type: ControlType.Color, title: "Tinta" },
})
