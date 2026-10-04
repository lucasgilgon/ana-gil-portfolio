// CursorCoords — coordenadas en mono que acompañan al cursor ("x 412 · y 230").
// Detalle de "archivo técnico". Solo con ratón; no intercepta clics.

import * as React from "react"
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

interface Props {
    color: string
    background: string
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function CursorCoords({ color, background }: Props) {
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const ref = React.useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = React.useState(false)
    const [enabled, setEnabled] = React.useState(false)
    React.useEffect(() => {
        setMounted(true)
        setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches)
    }, [])
    React.useEffect(() => {
        if (!enabled || isCanvas) return
        const el = ref.current
        const onMove = (e: PointerEvent) => {
            if (!el) return
            el.style.opacity = "1"
            el.style.transform = `translate(${e.clientX + 16}px, ${e.clientY + 18}px)`
            el.textContent = `x ${Math.round(e.clientX)} · y ${Math.round(e.clientY)}`
        }
        const onLeave = () => el && (el.style.opacity = "0")
        window.addEventListener("pointermove", onMove, { passive: true })
        document.addEventListener("pointerleave", onLeave)
        return () => {
            window.removeEventListener("pointermove", onMove)
            document.removeEventListener("pointerleave", onLeave)
        }
    }, [enabled, isCanvas])

    if (isCanvas) return <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color }}>x 412 · y 230</div>
    if (!mounted || !enabled) return null
    return createPortal(
        <div
            ref={ref}
            aria-hidden
            style={{
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: 3000,
                pointerEvents: "none",
                opacity: 0,
                padding: "1px 4px",
                background,
                color,
                fontFamily: `"IBM Plex Mono", Menlo, monospace`,
                fontSize: 9.5,
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
                transition: "opacity 200ms ease-out",
                willChange: "transform",
            }}
        />,
        document.body
    )
}

CursorCoords.defaultProps = { color: "var(--ag-ink, #111111)", background: "var(--ag-paper-90, rgba(244,242,237,0.85))" }

addPropertyControls(CursorCoords, {
    color: { type: ControlType.Color, title: "Texto" },
    background: { type: ControlType.Color, title: "Fondo" },
})
