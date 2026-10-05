// WindowFrame — coloca una ventana sobre el escritorio y la anima como en macOS:
// · Al abrirse "sale" del elemento pulsado (icono del Dock, del escritorio, una foto…).
// · Al cerrarse vuelve a su icono del Dock; al pasar a otra ventana, se funde.
// · Se arrastra por la barra de título (evento "ag:window-drag-start"); doble clic
//   en la barra o el botón verde la maximizan; el amarillo la manda al Dock.
import * as React from "react"
import { motion, useMotionValue, animate, type Variants } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { takeOrigin, dockRectFor, type Rect } from "../lib/origin"

export type WinSize = { w: number; h: "fill" | "auto"; minH?: number; maxH?: number }

const MENU = 28
const PAD_TOP = 18
const DOCK_SPACE = 92

const OPEN_EASE = [0.2, 0.85, 0.25, 1] as const
const CLOSE_EASE = [0.5, 0, 0.75, 0.2] as const

function toTransform(from: Rect, to: DOMRect) {
    const scale = Math.max(0.04, Math.min(1, from.w / to.width, from.h / to.height || 1))
    return {
        x: from.x + from.w / 2 - (to.left + to.width / 2),
        y: from.y + from.h / 2 - (to.top + to.height / 2),
        scale,
    }
}

export default function WindowFrame({ path, size, children }: { path: string; size: WinSize; children: React.ReactNode }) {
    const navigate = useNavigate()
    const inner = React.useRef<HTMLDivElement>(null)
    const dx = useMotionValue(0)
    const dy = useMotionValue(0)
    const [max, setMax] = React.useState(false)
    const zx = useMotionValue(0)
    const zy = useMotionValue(0)
    const zs = useMotionValue(1)
    const zo = useMotionValue(0)
    const from = React.useRef<Rect | null>(null)

    // Origen: el elemento pulsado (si lo hay). Se mide antes de pintar y se anima hasta su sitio.
    React.useLayoutEffect(() => {
        const el = inner.current
        if (!el) return
        const o = takeOrigin(path)
        from.current = o
        const start = o ? toTransform(o, el.getBoundingClientRect()) : { x: 0, y: 10, scale: 0.97 }
        zx.set(start.x)
        zy.set(start.y)
        zs.set(start.scale)
        const t = { duration: o ? 0.52 : 0.32, ease: OPEN_EASE }
        animate(zx, 0, t)
        animate(zy, 0, t)
        animate(zs, 1, t)
        animate(zo, 1, { duration: o ? 0.16 : 0.24, ease: "easeOut" })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Arrastre por la barra de título (lo piden los componentes con un evento)
    React.useEffect(() => {
        const onStart = (ev: Event) => {
            const pe = (ev as CustomEvent).detail as PointerEvent
            if (!pe || max) return
            const sx = pe.clientX
            const sy = pe.clientY
            const ox = dx.get()
            const oy = dy.get()
            const r = inner.current?.getBoundingClientRect()
            document.body.style.cursor = "grabbing"
            const move = (e: PointerEvent) => {
                let nx = ox + e.clientX - sx
                let ny = oy + e.clientY - sy
                if (r) {
                    // la barra de título nunca se pierde por arriba ni del todo por los lados
                    ny = Math.max(MENU + 2 - (r.top - oy), ny)
                    ny = Math.min(window.innerHeight - 60 - (r.top - oy), ny)
                    nx = Math.max(120 - (r.right - ox), Math.min(window.innerWidth - 120 - (r.left - ox), nx))
                }
                dx.set(nx)
                dy.set(ny)
            }
            const up = () => {
                document.body.style.cursor = ""
                window.removeEventListener("pointermove", move)
                window.removeEventListener("pointerup", up)
            }
            window.addEventListener("pointermove", move)
            window.addEventListener("pointerup", up)
        }
        const onReset = () => toggleMax()
        window.addEventListener("ag:window-drag-start", onStart)
        window.addEventListener("ag:window-drag-reset", onReset)
        return () => {
            window.removeEventListener("ag:window-drag-start", onStart)
            window.removeEventListener("ag:window-drag-reset", onReset)
        }
    })

    const toggleMax = () => {
        animate(dx, 0, { duration: 0.3, ease: OPEN_EASE })
        animate(dy, 0, { duration: 0.3, ease: OPEN_EASE })
        setMax((m) => !m)
    }

    // Botones amarillo y verde (marcados con data-ag-min / data-ag-max)
    const onClickCapture = (e: React.MouseEvent) => {
        const t = e.target as HTMLElement
        if (t.closest("[data-ag-min]")) {
            e.preventDefault()
            navigate("/")
        } else if (t.closest("[data-ag-max]")) {
            e.preventDefault()
            toggleMax()
        }
    }

    const variants: Variants = {
        exit: (next: string) => {
            const el = inner.current
            const r = el?.getBoundingClientRect()
            // Cerrar (vuelta al escritorio): la ventana se recoge en su icono del Dock
            if ((next === "/" || next === "") && r) {
                const dock = dockRectFor(path) ?? from.current
                if (dock) {
                    const t = toTransform(dock, r)
                    return { ...t, opacity: 0, transition: { duration: 0.34, ease: CLOSE_EASE, opacity: { duration: 0.34, ease: [0.7, 0, 1, 0.6] } } }
                }
            }
            return { scale: 0.985, opacity: 0, transition: { duration: 0.16, ease: "easeOut" } }
        },
    }

    const area: React.CSSProperties = max
        ? { top: MENU, left: 0, right: 0, bottom: 0 }
        : { top: MENU + PAD_TOP, left: 24, right: 24, bottom: DOCK_SPACE }

    return (
        <div style={{ position: "fixed", ...area, zIndex: 5, display: "flex", justifyContent: "center", alignItems: size.h === "fill" || max ? "stretch" : "flex-start", pointerEvents: "none", transition: "inset .3s cubic-bezier(.2,.85,.25,1)" }}>
            <motion.div style={{ x: dx, y: dy, width: max ? "100%" : size.w, maxWidth: "100%", maxHeight: !max && size.maxH ? `min(100%, ${size.maxH}px)` : "100%", height: size.h === "fill" || max ? "100%" : "auto", display: "flex", pointerEvents: "auto" }}>
                <motion.div
                    ref={inner}
                    data-ag-frame=""
                    className="ag-fill"
                    variants={variants}
                    initial={false}
                    exit="exit"
                    onClickCapture={onClickCapture}
                    style={{ x: zx, y: zy, scale: zs, opacity: zo, width: "100%", height: "100%", minHeight: size.minH, display: "flex", flexDirection: "column", transformOrigin: "50% 50%", boxShadow: "0 30px 80px rgba(0,0,0,.22), 0 8px 24px rgba(0,0,0,.12)", willChange: "transform" }}
                >
                    {children}
                </motion.div>
            </motion.div>
        </div>
    )
}
