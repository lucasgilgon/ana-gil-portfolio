// BootScreen — pantalla de arranque tipo Mac (monograma + barra de progreso).
// Solo aparece la primera vez por sesión. No se muestra en el canvas de Framer.

import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

interface Props {
    title: string
    duration: number
    background: string
    color: string
    oncePerSession: boolean
}

const KEY = "ag-booted"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function BootScreen({ title, duration, background, color, oncePerSession }: Props) {
    const reduce = useReducedMotion()
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const [show, setShow] = React.useState(false)

    React.useEffect(() => {
        if (isCanvas) return
        let seen = false
        try {
            seen = oncePerSession && sessionStorage.getItem(KEY) === "1"
        } catch {}
        if (seen) return
        setShow(true)
        const ms = reduce ? 400 : duration * 1000
        const t = setTimeout(() => {
            setShow(false)
            try {
                sessionStorage.setItem(KEY, "1")
            } catch {}
        }, ms)
        return () => clearTimeout(t)
    }, [isCanvas, oncePerSession, duration, reduce])

    if (isCanvas)
        return (
            <div style={{ padding: 8, fontFamily: "Inter, sans-serif", fontSize: 11, color: "#555", background: "#F5F5F5" }}>
                Pantalla de arranque (solo en la web publicada)
            </div>
        )

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="boot"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    role="status"
                    aria-label="Cargando"
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 10000,
                        background,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 36,
                    }}
                >
                    <span style={{ fontFamily: `"Special Elite", "Courier New", monospace`, fontSize: 64, color, letterSpacing: "0.08em" }}>
                        {title}
                    </span>
                    <div style={{ width: 180, height: 5, borderRadius: 3, background: "rgba(127,127,127,0.25)", overflow: "hidden" }}>
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: reduce ? 0.3 : duration * 0.9, ease: [0.4, 0, 0.2, 1] }}
                            style={{ height: "100%", background: color, borderRadius: 3 }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

BootScreen.defaultProps = {
    title: "AG",
    duration: 1.6,
    background: "#FAFAF8",
    color: "#1A1A1A",
    oncePerSession: true,
}

addPropertyControls(BootScreen, {
    title: { type: ControlType.String, title: "Texto" },
    duration: { type: ControlType.Number, title: "Duración", min: 0.5, max: 5, step: 0.1, unit: "s" },
    background: { type: ControlType.Color, title: "Fondo" },
    color: { type: ControlType.Color, title: "Color" },
    oncePerSession: { type: ControlType.Boolean, title: "1 vez/sesión" },
})
