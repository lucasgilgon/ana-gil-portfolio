// WindowDrag — overrides para arrastrar las ventanas como en macOS.
// · withWindow: aplicar a la ventana (se mueve, pero no se arrastra desde el contenido).
// · withTitleBar: aplicar a la barra de título (al pulsarla empieza el arrastre de la ventana).
// Doble clic en la barra devuelve la ventana a su sitio. Desactivado en pantallas táctiles.

import * as React from "react"
import type { ComponentType } from "react"
import { useDragControls, useMotionValue, animate, useReducedMotion } from "framer-motion"

const START = "ag:window-drag-start"
const RESET = "ag:window-drag-reset"

function canDrag() {
    return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

export function withWindow(Component: ComponentType<any>): ComponentType {
    return (props: any) => {
        const controls = useDragControls()
        const x = useMotionValue(0)
        const y = useMotionValue(0)
        const [enabled, setEnabled] = React.useState(false)
        const reduce = useReducedMotion()

        React.useEffect(() => {
            setEnabled(canDrag())
            const onStart = (e: Event) => controls.start((e as CustomEvent).detail)
            const onReset = () => {
                const t = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }
                animate(x, 0, t)
                animate(y, 0, t)
            }
            window.addEventListener(START, onStart)
            window.addEventListener(RESET, onReset)
            return () => {
                window.removeEventListener(START, onStart)
                window.removeEventListener(RESET, onReset)
            }
        }, [controls, x, y])

        // Apertura como en macOS: la ventana crece y aparece
        const open = reduce ? {} : { initial: { opacity: 0, scale: 0.965, y: 14 }, animate: { opacity: 1, scale: 1, y: 0 }, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } }
        if (!enabled) return <Component {...props} {...open} />
        return (
            <Component
                {...props}
                {...open}
                drag
                dragListener={false}
                dragControls={controls}
                dragMomentum={false}
                dragElastic={0}
                style={{ ...props.style, x, y }}
            />
        )
    }
}

export function withTitleBar(Component: ComponentType<any>): ComponentType {
    return (props: any) => (
        <Component
            {...props}
            onPointerDown={(e: React.PointerEvent) => {
                props.onPointerDown?.(e)
                const target = e.target as HTMLElement
                if (!canDrag() || target.closest("a,button,input,textarea")) return
                window.dispatchEvent(new CustomEvent(START, { detail: e.nativeEvent }))
            }}
            onDoubleClick={() => window.dispatchEvent(new CustomEvent(RESET))}
            style={{ ...props.style, cursor: "grab", touchAction: "none", userSelect: "none" }}
        />
    )
}
