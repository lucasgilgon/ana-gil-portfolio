// MobileMenu — botón hamburguesa + menú a pantalla completa para < 768px.
// Colócalo en la variante Mobile del componente Navigation (oculto en Desktop/Tablet).
// Cierra con Escape, al pulsar un enlace o el botón; bloquea el scroll del body mientras está abierto.

import * as React from "react"
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType } from "framer"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

interface NavLink {
    label: string
    href: string
}

interface Props {
    links: NavLink[]
    color: string
    background: string
    accent: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function MobileMenu({ links, color, background, accent, style }: Props) {
    const [open, setOpen] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)
    const reduceMotion = useReducedMotion()
    React.useEffect(() => setMounted(true), [])

    React.useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        window.addEventListener("keydown", onKey)
        return () => {
            document.body.style.overflow = prevOverflow
            window.removeEventListener("keydown", onKey)
        }
    }, [open])

    const bar = (rotate: number, y: number, opacity = 1): React.CSSProperties => ({
        position: "absolute",
        left: 0,
        width: 22,
        height: 1.5,
        background: color,
        transform: `translateY(${y}px) rotate(${rotate}deg)`,
        opacity,
        transition: reduceMotion ? "none" : "transform 200ms ease-out, opacity 200ms ease-out",
    })

    return (
        <>
            <button
                type="button"
                aria-label={open ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                style={{
                    ...style,
                    position: "relative",
                    zIndex: 1001,
                    width: 40,
                    height: 40,
                    padding: 9,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                }}
            >
                <span style={{ position: "relative", display: "block", width: 22, height: 22 }}>
                    <span style={bar(open ? 45 : 0, open ? 10 : 5)} />
                    <span style={bar(0, 10, open ? 0 : 1)} />
                    <span style={bar(open ? -45 : 0, open ? 10 : 15)} />
                </span>
            </button>

            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {open && (
                            <motion.nav
                                aria-label="Menú principal"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: reduceMotion ? 0 : 0.3 }}
                                style={{
                                    position: "fixed",
                                    inset: 0,
                                    zIndex: 1000,
                                    background,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    gap: 24,
                                    padding: 32,
                                }}
                            >
                                {links.map((link, i) => (
                                    <motion.a
                                        key={link.href + i}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: reduceMotion ? 0 : 0.6,
                                            delay: reduceMotion ? 0 : 0.1 + i * 0.1,
                                            ease: [0.215, 0.61, 0.355, 1],
                                        }}
                                        whileHover={{ color: accent }}
                                        style={{
                                            fontFamily: `"Prata", Georgia, serif`,
                                            fontSize: "clamp(32px, 8vw, 48px)",
                                            lineHeight: 1.2,
                                            color,
                                            textDecoration: "none",
                                        }}
                                    >
                                        {link.label}
                                    </motion.a>
                                ))}
                            </motion.nav>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
        </>
    )
}

MobileMenu.defaultProps = {
    links: [
        { label: "Proyectos", href: "/projects" },
        { label: "Sobre", href: "/about" },
        { label: "Contacto", href: "/contact" },
    ],
    color: "#1A1A1A",
    background: "#FFFFFF",
    accent: "#2D5A4A",
}

addPropertyControls(MobileMenu, {
    links: {
        type: ControlType.Array,
        title: "Enlaces",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Texto" },
                href: { type: ControlType.Link, title: "Enlace" },
            },
        },
    },
    color: { type: ControlType.Color, title: "Texto" },
    background: { type: ControlType.Color, title: "Fondo" },
    accent: { type: ControlType.Color, title: "Hover" },
})
