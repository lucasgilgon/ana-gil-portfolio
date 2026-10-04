// FocusWallpaper — fondo de escritorio "memoria que se enfoca".
// El retrato aparece desenfocado y, alrededor del cursor, se revela nítido.
// Sin ratón (móvil) la lente deriva lentamente sola. Respeta "reducir movimiento".

import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

type ResponsiveImage = { src?: string; srcSet?: string; alt?: string }

interface Props {
    image?: ResponsiveImage
    blur: number
    radius: number
    tint: string
    position: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 800
 */
export default function FocusWallpaper({ image, blur, radius, tint, position, style }: Props) {
    const ref = React.useRef<HTMLDivElement>(null)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    React.useEffect(() => {
        const el = ref.current
        if (!el || isCanvas) return
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
        let raf = 0
        let tx = window.innerWidth * 0.5
        let ty = window.innerHeight * 0.45
        let cx = tx
        let cy = ty
        let lastMove = 0
        const set = () => {
            el.style.setProperty("--fx", `${cx}px`)
            el.style.setProperty("--fy", `${cy}px`)
        }
        const onMove = (e: PointerEvent) => {
            tx = e.clientX
            ty = e.clientY
            lastMove = performance.now()
        }
        const loop = (t: number) => {
            if (!fine || t - lastMove > 4000) {
                // deriva lenta cuando no hay ratón
                const w = window.innerWidth
                const h = window.innerHeight
                tx = w * (0.5 + 0.18 * Math.sin(t / 5200))
                ty = h * (0.45 + 0.14 * Math.sin(t / 3700))
            }
            cx += (tx - cx) * 0.12
            cy += (ty - cy) * 0.12
            set()
            raf = requestAnimationFrame(loop)
        }
        set()
        if (reduce) return
        window.addEventListener("pointermove", onMove, { passive: true })
        raf = requestAnimationFrame(loop)
        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener("pointermove", onMove)
        }
    }, [isCanvas])

    const src = image?.src
    const layer: React.CSSProperties = {
        position: "absolute",
        inset: 0,
        backgroundImage: src ? `url("${src}")` : undefined,
        backgroundSize: "cover",
        backgroundPosition: position,
    }
    const mask = `radial-gradient(circle ${radius}px at var(--fx, 50%) var(--fy, 45%), #000 0%, #000 45%, transparent 100%)`

    return (
        <div ref={ref} aria-hidden style={{ ...style, position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "var(--ag-paper, #F4F2ED)" }}>
            <div style={{ ...layer, inset: -blur * 2, filter: `blur(${blur}px)`, transform: "translateZ(0)" }} />
            <div style={{ position: "absolute", inset: 0, background: tint }} />
            {!isCanvas && <div style={{ ...layer, WebkitMaskImage: mask, maskImage: mask }} />}
            {/* Modo noche: el retrato se oscurece (AgSystem define --ag-veil) */}
            <div style={{ position: "absolute", inset: 0, background: "var(--ag-veil, transparent)", transition: "background .6s ease" }} />
        </div>
    )
}

FocusWallpaper.defaultProps = {
    blur: 28,
    radius: 260,
    tint: "rgba(244,242,237,0.18)",
    position: "center 30%",
}

addPropertyControls(FocusWallpaper, {
    image: { type: ControlType.ResponsiveImage, title: "Retrato" },
    blur: { type: ControlType.Number, title: "Desenfoque", min: 0, max: 80, unit: "px" },
    radius: { type: ControlType.Number, title: "Lente", min: 80, max: 600, unit: "px" },
    tint: { type: ControlType.Color, title: "Velo" },
    position: { type: ControlType.String, title: "Posición" },
})
