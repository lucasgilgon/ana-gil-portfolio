// ProjectCard — fila del índice de proyectos con preview flotante que sigue al cursor.
// Pensado para usarse dentro de una Collection List del CMS "Projects":
// cada propiedad se vincula a un campo del CMS desde el panel derecho de Framer.
//
// - Desktop (ratón): la imagen destacada aparece flotando junto al cursor en hover.
// - Táctil / móvil: la imagen se muestra dentro de la tarjeta (no flotante).
// - Respeta prefers-reduced-motion.

import * as React from "react"
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useSpring,
    useReducedMotion,
} from "framer-motion"

const TOKENS = {
    black: "#1A1A1A",
    grayDark: "#555555",
    grayLight: "#F5F5F5",
    bg: "#FAFAFA",
    accent: "#2D5A4A",
    easeOut: [0.215, 0.61, 0.355, 1] as const,
}

const FONT_TITLE = `"Prata", Georgia, serif`
const FONT_BODY = `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
const FONT_MONO = `"IBM Plex Mono", "Courier New", monospace`
const FONTS_HREF =
    "https://fonts.googleapis.com/css2?family=Prata&family=Inter:wght@400;500;700&family=IBM+Plex+Mono&display=swap"

function useGoogleFonts() {
    React.useEffect(() => {
        if (typeof document === "undefined") return
        if (document.querySelector(`link[data-ag-fonts]`)) return
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = FONTS_HREF
        link.setAttribute("data-ag-fonts", "")
        document.head.appendChild(link)
    }, [])
}

function useCanHover() {
    const [canHover, setCanHover] = React.useState(false)
    React.useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return
        const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
        const update = () => setCanHover(mq.matches)
        update()
        mq.addEventListener?.("change", update)
        return () => mq.removeEventListener?.("change", update)
    }, [])
    return canHover
}

type ResponsiveImage = { src?: string; srcSet?: string; alt?: string }

interface Props {
    number: string
    title: string
    category: string
    year: string
    description: string
    image?: ResponsiveImage
    link?: string
    previewWidth: number
    accent: string
    showDivider: boolean
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1200
 */
export default function ProjectCard(props: Props) {
    const {
        number,
        title,
        category,
        year,
        description,
        image,
        link,
        previewWidth,
        accent,
        showDivider,
        style,
    } = props

    useGoogleFonts()
    const canHover = useCanHover()
    const reduceMotion = useReducedMotion()
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const [hovered, setHovered] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])

    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const spring = { stiffness: 300, damping: 30, mass: 0.6 }
    const sx = useSpring(x, spring)
    const sy = useSpring(y, spring)

    const hasImage = Boolean(image?.src)
    const showFloating = canHover && hasImage && !isCanvas
    const showInline = !canHover && hasImage

    const onMove = (e: React.PointerEvent) => {
        // La imagen se coloca a la derecha y algo por debajo del cursor.
        const offset = 24
        const px = e.clientX + offset
        const py = e.clientY + offset
        const maxX = window.innerWidth - previewWidth - 16
        const nx = Math.min(px, maxX)
        if (reduceMotion) {
            sx.jump(nx)
            sy.jump(py)
        }
        x.set(nx)
        y.set(py)
    }

    const meta = [category, year].filter(Boolean).join(" · ")
    const Wrapper: any = link ? "a" : "div"

    return (
        <Wrapper
            href={link || undefined}
            onPointerEnter={(e: React.PointerEvent) => {
                if (e.pointerType !== "mouse") return
                // Coloca la preview en el cursor antes de mostrarla (sin "salto").
                onMove(e)
                sx.jump(x.get())
                sy.jump(y.get())
                setHovered(true)
            }}
            onPointerLeave={() => setHovered(false)}
            onPointerMove={showFloating ? onMove : undefined}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            style={{
                ...style,
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                columnGap: 24,
                alignItems: "start",
                padding: "32px 0",
                borderBottom: showDivider
                    ? `1px solid ${TOKENS.grayLight}`
                    : "none",
                background: hovered ? TOKENS.bg : "transparent",
                transition: `background 200ms cubic-bezier(${TOKENS.easeOut.join(",")})`,
                color: TOKENS.black,
                textDecoration: "none",
                cursor: link ? "pointer" : "default",
                boxSizing: "border-box",
                outlineOffset: 4,
            }}
        >
            <span
                style={{
                    fontFamily: FONT_MONO,
                    fontSize: 12,
                    lineHeight: 1.4,
                    color: TOKENS.grayDark,
                    paddingTop: 10,
                }}
            >
                {number}
            </span>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <h2
                    style={{
                        margin: 0,
                        fontFamily: FONT_TITLE,
                        fontWeight: 400,
                        fontSize: "clamp(28px, 4vw, 40px)",
                        lineHeight: 1.3,
                        letterSpacing: "-0.5px",
                        color: hovered ? accent : TOKENS.black,
                        transition: "color 200ms ease-out",
                    }}
                >
                    {title}
                </h2>
                {meta && (
                    <span
                        style={{
                            fontFamily: FONT_BODY,
                            fontSize: 12,
                            fontWeight: 500,
                            lineHeight: 1.4,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            color: TOKENS.grayDark,
                        }}
                    >
                        {meta}
                    </span>
                )}
                {description && (
                    <p
                        style={{
                            margin: 0,
                            maxWidth: 640,
                            fontFamily: FONT_BODY,
                            fontSize: 16,
                            lineHeight: 1.6,
                            color: TOKENS.grayDark,
                        }}
                    >
                        {description}
                    </p>
                )}
                {showInline && (
                    <img
                        src={image!.src}
                        srcSet={image!.srcSet}
                        alt={image!.alt || title}
                        loading="lazy"
                        style={{
                            width: "100%",
                            aspectRatio: "3 / 2",
                            objectFit: "cover",
                            marginTop: 8,
                            display: "block",
                        }}
                    />
                )}
            </div>

            <span
                aria-hidden
                style={{
                    fontFamily: FONT_MONO,
                    fontSize: 16,
                    paddingTop: 8,
                    color: hovered ? accent : TOKENS.grayDark,
                    transform: hovered && !reduceMotion ? "translateX(4px)" : "none",
                    transition: "color 200ms ease-out, transform 200ms ease-out",
                }}
            >
                →
            </span>

            {showFloating &&
                mounted &&
                createPortal(
                    <AnimatePresence>
                        {hovered && (
                            <motion.img
                                key="preview"
                                src={image!.src}
                                srcSet={image!.srcSet}
                                alt=""
                                aria-hidden
                                initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
                                transition={{ duration: 0.3, ease: TOKENS.easeOut }}
                                style={{
                                    position: "fixed",
                                    top: 0,
                                    left: 0,
                                    x: sx,
                                    y: sy,
                                    width: previewWidth,
                                    aspectRatio: "2 / 3",
                                    objectFit: "cover",
                                    pointerEvents: "none",
                                    zIndex: 1000,
                                    boxShadow: "0 4px 16px rgba(26, 26, 26, 0.12)",
                                }}
                            />
                        )}
                    </AnimatePresence>,
                    document.body
                )}
        </Wrapper>
    )
}

ProjectCard.defaultProps = {
    number: "01",
    title: "ASH ARCHIVE",
    category: "Moda",
    year: "2025",
    description:
        "Colección que explora la resiliencia tras la pérdida, usando encaje como agente destructor y constructor.",
    previewWidth: 220,
    accent: TOKENS.accent,
    showDivider: true,
}

addPropertyControls(ProjectCard, {
    number: { type: ControlType.String, title: "Número" },
    title: { type: ControlType.String, title: "Título" },
    category: { type: ControlType.String, title: "Categoría" },
    year: { type: ControlType.String, title: "Año" },
    description: {
        type: ControlType.String,
        title: "Descripción",
        displayTextArea: true,
    },
    image: { type: ControlType.ResponsiveImage, title: "Imagen" },
    link: { type: ControlType.Link, title: "Enlace" },
    previewWidth: {
        type: ControlType.Number,
        title: "Ancho preview",
        min: 120,
        max: 480,
        step: 10,
        unit: "px",
    },
    accent: { type: ControlType.Color, title: "Acento" },
    showDivider: { type: ControlType.Boolean, title: "Divisor" },
})
