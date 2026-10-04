// ScrollIndicator — chevron "↓" animado para la parte inferior del Hero.
// Al hacer clic desplaza suavemente hasta el ancla indicada (p. ej. "#proyectos").
// Respeta prefers-reduced-motion (sin animación en bucle).

import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion, useReducedMotion } from "framer-motion"

interface Props {
    label: string
    target: string
    color: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function ScrollIndicator({ label, target, color, style }: Props) {
    const reduceMotion = useReducedMotion()

    const onClick = (e: React.MouseEvent) => {
        if (!target || typeof document === "undefined") return
        const el = document.querySelector(target)
        if (!el) return
        e.preventDefault()
        el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" })
    }

    return (
        <a
            href={target || undefined}
            onClick={onClick}
            aria-label={label}
            style={{
                ...style,
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                color,
                textDecoration: "none",
                fontFamily: `"IBM Plex Mono", "Courier New", monospace`,
                fontSize: 12,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
            }}
        >
            <span>{label}</span>
            <motion.span
                aria-hidden
                style={{ fontSize: 20, lineHeight: 1, display: "block" }}
                animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
                transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: [0.645, 0.045, 0.355, 1],
                }}
            >
                ↓
            </motion.span>
        </a>
    )
}

ScrollIndicator.defaultProps = {
    label: "Proyectos",
    target: "#proyectos",
    color: "#555555",
}

addPropertyControls(ScrollIndicator, {
    label: { type: ControlType.String, title: "Texto" },
    target: {
        type: ControlType.String,
        title: "Ancla",
        placeholder: "#proyectos",
    },
    color: { type: ControlType.Color, title: "Color" },
})
