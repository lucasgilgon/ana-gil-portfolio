// BootScreen v2 — arranque "a máquina": ANA GIL — PORTFOLIO 2026.
// Se escribe en mono en menos de un segundo, solo en la primera visita de la sesión.
// No se muestra en el canvas de Framer. Con "reducir movimiento" aparece sin animar.

import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

interface Props {
    line1: string
    line2: string
    background: string
    color: string
    oncePerSession: boolean
}

const KEY = "ag-booted-v2"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function BootScreen({ line1, line2, background, color, oncePerSession }: Props) {
    const reduce = useReducedMotion()
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const [show, setShow] = React.useState(false)
    const [typed, setTyped] = React.useState("")

    React.useEffect(() => {
        if (isCanvas) return
        let seen = false
        try {
            seen = oncePerSession && sessionStorage.getItem(KEY) === "1"
        } catch {}
        if (seen) return
        setShow(true)
        const full = line1
        const per = reduce ? 0 : 38
        let i = 0
        const id = setInterval(() => {
            i++
            setTyped(full.slice(0, i))
            if (i >= full.length) clearInterval(id)
        }, per || 1)
        const total = reduce ? 500 : full.length * per + 650
        const t = setTimeout(() => {
            setShow(false)
            try {
                sessionStorage.setItem(KEY, "1")
            } catch {}
        }, total)
        return () => {
            clearInterval(id)
            clearTimeout(t)
        }
    }, [isCanvas, oncePerSession, line1, reduce])

    if (isCanvas)
        return <div style={{ padding: 8, fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "#918E88", background: "#F4F2ED" }}>Arranque (solo en la web)</div>

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="boot"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    role="status"
                    aria-label={`${line1} ${line2}`}
                    style={{ position: "fixed", inset: 0, zIndex: 10000, background, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                    <div style={{ fontFamily: `"IBM Plex Mono", Menlo, monospace`, color, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        <div style={{ fontSize: 13 }}>
                            {typed}
                            <span style={{ display: "inline-block", width: 8, height: 14, marginLeft: 3, background: color, verticalAlign: "-2px", animation: "agblink 0.9s steps(1) infinite" }} />
                        </div>
                        <div style={{ fontSize: 10, opacity: 0.5, marginTop: 10 }}>{line2}</div>
                    </div>
                    <style>{`@keyframes agblink{50%{opacity:0}}`}</style>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

BootScreen.defaultProps = {
    line1: "ANA GIL — PORTFOLIO 2026",
    line2: "Fashion design · memoria · cuerpo · materia · archivo",
    background: "#F4F2ED",
    color: "#111111",
    oncePerSession: true,
}

addPropertyControls(BootScreen, {
    line1: { type: ControlType.String, title: "Línea 1" },
    line2: { type: ControlType.String, title: "Línea 2" },
    background: { type: ControlType.Color, title: "Fondo" },
    color: { type: ControlType.Color, title: "Color" },
    oncePerSession: { type: ControlType.Boolean, title: "1 vez/sesión" },
})
