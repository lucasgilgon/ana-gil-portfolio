// DesktopIcon — icono de escritorio tipo macOS.
// Muestra la miniatura del proyecto (con marco blanco) o, si no hay imagen,
// una carpeta / nota / sobre dibujados en la paleta del portfolio.
// Se puede arrastrar; un clic (sin arrastrar) abre el enlace.

import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget, Link } from "framer"
import { motion, useReducedMotion } from "framer-motion"

type Kind = "folder" | "note" | "mail" | "pdf" | "instagram"
type ResponsiveImage = { src?: string; srcSet?: string; alt?: string }

interface Props {
    label: string
    image?: ResponsiveImage
    kind: Kind
    link?: string
    size: number
    theme: "desktop" | "finder"
    draggable: boolean
    selection: string
    style?: React.CSSProperties
}

function Glyph({ kind }: { kind: Kind }) {
    const uid = React.useId().replace(/:/g, "")
    const shadow = { filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.22)) drop-shadow(0 1px 1px rgba(0,0,0,0.12))" }
    if (kind === "folder")
        return (
            <svg viewBox="0 0 100 80" width="100%" height="100%" aria-hidden style={shadow}>
                <defs>
                    <linearGradient id={`fb${uid}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#4F7F6C" />
                        <stop offset="1" stopColor="#3A6655" />
                    </linearGradient>
                    <linearGradient id={`ff${uid}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#8DB5A5" />
                        <stop offset="0.08" stopColor="#77A392" />
                        <stop offset="1" stopColor="#4E7E6B" />
                    </linearGradient>
                </defs>
                <path d="M6 10a6 6 0 0 1 6-6h22a6 6 0 0 1 4.6 2.2L43 12h45a6 6 0 0 1 6 6v6H6z" fill={`url(#fb${uid})`} />
                <rect x="4" y="18" width="92" height="58" rx="6" fill={`url(#ff${uid})`} />
                <rect x="4.5" y="18.5" width="91" height="57" rx="5.5" fill="none" stroke="rgba(255,255,255,0.35)" />
                <path d="M30 50h40" stroke="rgba(30,60,50,0.28)" strokeWidth="2" strokeLinecap="round" />
                <path d="M30 51h40" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" />
            </svg>
        )
    if (kind === "instagram") {
        const squircle = "M50 0C87 0 100 13 100 50S87 100 50 100 0 87 0 50 13 0 50 0z"
        return (
            <svg viewBox="0 0 100 100" width="86%" height="86%" aria-hidden style={shadow}>
                <defs>
                    <radialGradient id={`ig${uid}`} cx="0.3" cy="1.07" r="1.35">
                        <stop offset="0" stopColor="#FFDD55" />
                        <stop offset="0.1" stopColor="#FFDD55" />
                        <stop offset="0.5" stopColor="#FF543E" />
                        <stop offset="1" stopColor="#C837AB" />
                    </radialGradient>
                    <radialGradient id={`ig2${uid}`} cx="-0.17" cy="0.07" r="0.75">
                        <stop offset="0" stopColor="#3771C8" />
                        <stop offset="0.13" stopColor="#3771C8" />
                        <stop offset="1" stopColor="#6600FF" stopOpacity="0" />
                    </radialGradient>
                </defs>
                <path d={squircle} fill={`url(#ig${uid})`} />
                <path d={squircle} fill={`url(#ig2${uid})`} />
                <rect x="24" y="24" width="52" height="52" rx="15" fill="none" stroke="#FFFFFF" strokeWidth="6" />
                    <circle cx="50" cy="50" r="12.5" fill="none" stroke="#FFFFFF" strokeWidth="6" />
                    <circle cx="65.5" cy="34.5" r="3.6" fill="#FFFFFF" />
            </svg>
        )
    }
    if (kind === "note" || kind === "pdf") {
        const isPdf = kind === "pdf"
        return (
            <svg viewBox="0 0 80 100" width="100%" height="100%" aria-hidden style={shadow}>
                <defs>
                    <linearGradient id={`pg${uid}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#FFFFFF" />
                        <stop offset="1" stopColor="#F3F1EC" />
                    </linearGradient>
                    <linearGradient id={`fold${uid}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#FFFFFF" />
                        <stop offset="1" stopColor="#D9D5CC" />
                    </linearGradient>
                </defs>
                <path d="M10 4h42l20 20v68a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z" fill={`url(#pg${uid})`} stroke="rgba(0,0,0,0.14)" />
                <path d="M52 4v16a4 4 0 0 0 4 4h16z" fill={`url(#fold${uid})`} stroke="rgba(0,0,0,0.14)" strokeLinejoin="round" />
                {isPdf ? (
                    <>
                        {[34, 41, 48].map((y) => (
                            <rect key={y} x="16" y={y} width={y === 48 ? 30 : 46} height="3" rx="1.5" fill="#D8D3C8" />
                        ))}
                        <rect x="6" y="62" width="66" height="18" fill="#7A2E33" />
                        <text x="39" y="75.5" textAnchor="middle" fontFamily="'Special Elite', 'Courier New', monospace" fontSize="13" fill="#FFFFFF" letterSpacing="1">PDF</text>
                    </>
                ) : (
                    <>
                        <text x="16" y="28" fontFamily="'Special Elite', 'Courier New', monospace" fontSize="10" fill="#C4876B">TXT</text>
                        {[38, 45, 52, 59, 66, 73].map((y) => (
                            <rect key={y} x="16" y={y} width={y === 73 ? 28 : 48} height="2.6" rx="1.3" fill="#CFC9BD" />
                        ))}
                    </>
                )}
            </svg>
        )
    }
    return (
        <svg viewBox="0 0 100 76" width="100%" height="100%" aria-hidden style={shadow}>
            <defs>
                <linearGradient id={`env${uid}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#FFFFFF" />
                    <stop offset="1" stopColor="#EEEBE4" />
                </linearGradient>
            </defs>
            <rect x="4" y="8" width="92" height="62" rx="6" fill={`url(#env${uid})`} stroke="rgba(0,0,0,0.14)" />
            <path d="M6 66l34-26M94 66L60 40" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
            <path d="M6 12l44 32 44-32" fill="none" stroke="#2D5A4A" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="82" cy="20" r="0" fill="none" />
        </svg>
    )
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function DesktopIcon(props: Props) {
    const { label, image, kind, link, size, theme, draggable, selection, style } = props
    const reduce = useReducedMotion()
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const [selected, setSelected] = React.useState(false)
    const dragged = React.useRef(false)
    const hasImage = Boolean(image?.src)
    const onDesktop = theme === "desktop"

    React.useEffect(() => {
        if (!selected) return
        const off = () => setSelected(false)
        const t = setTimeout(() => document.addEventListener("mousedown", off, { once: true }), 0)
        return () => {
            clearTimeout(t)
            document.removeEventListener("mousedown", off)
        }
    }, [selected])

    const icon = (
        <motion.a
            drag={draggable && !isCanvas}
            dragMomentum={false}
            onDragStart={() => {
                dragged.current = true
                setSelected(true)
            }}
            onPointerDown={() => {
                dragged.current = false
                setSelected(true)
            }}
            whileHover={reduce ? undefined : { scale: 1.04 }}
            whileDrag={{ scale: 1.06, zIndex: 50, cursor: "grabbing" }}
            draggable={false}
            style={{
                width: size + 48,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: 4,
                textDecoration: "none",
                cursor: "default",
                touchAction: "none",
                userSelect: "none",
                WebkitUserDrag: "none",
            } as React.CSSProperties}
        >
            <div
                style={{
                    width: size,
                    height: size,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 6,
                    padding: 3,
                    background: selected ? "rgba(0,0,0,0.12)" : "transparent",
                    boxSizing: "border-box",
                }}
            >
                {hasImage ? (
                    <img
                        src={image!.src}
                        srcSet={image!.srcSet}
                        alt={image!.alt || label}
                        draggable={false}
                        loading="lazy"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            border: "3px solid #FFFFFF",
                            borderRadius: 2,
                            boxShadow: "0 1px 1px rgba(0,0,0,0.12), 0 6px 14px rgba(0,0,0,0.22)",
                            background: "#fff",
                            display: "block",
                        }}
                    />
                ) : (
                    <Glyph kind={kind} />
                )}
            </div>
            <span
                style={{
                    maxWidth: size + 40,
                    padding: "1px 5px",
                    borderRadius: 4,
                    background: selected ? selection : onDesktop ? "rgba(255,255,255,0.66)" : "transparent",
                    backdropFilter: onDesktop && !selected ? "blur(8px)" : undefined,
                    WebkitBackdropFilter: onDesktop && !selected ? "blur(8px)" : undefined,
                    color: selected ? "#FFFFFF" : "#1A1A1A",
                    fontFamily: `"Inter", -apple-system, sans-serif`,
                    fontWeight: 500,
                    fontSize: 12,
                    lineHeight: 1.25,
                    textAlign: "center",
                    letterSpacing: 0,
                    wordBreak: "break-word",
                }}
            >
                {label}
            </span>
        </motion.a>
    )

    return (
        <div
            style={{ ...style, width: "auto", height: "auto" }}
            onClickCapture={(e) => {
                if (dragged.current) {
                    e.preventDefault()
                    e.stopPropagation()
                }
            }}
        >
            {link ? (
                <Link href={link} motionChild openInNewTab={link.startsWith("http") ? true : undefined}>
                    {icon}
                </Link>
            ) : (
                icon
            )}
        </div>
    )
}

DesktopIcon.defaultProps = {
    label: "ASH ARCHIVE",
    kind: "folder",
    size: 84,
    theme: "desktop",
    draggable: true,
    selection: "#2D5A4A",
}

addPropertyControls(DesktopIcon, {
    label: { type: ControlType.String, title: "Nombre" },
    image: { type: ControlType.ResponsiveImage, title: "Imagen" },
    kind: {
        type: ControlType.Enum,
        title: "Icono",
        options: ["folder", "note", "mail", "pdf", "instagram"],
        optionTitles: ["Carpeta", "Nota", "Mail", "PDF", "Instagram"],
    },
    link: { type: ControlType.Link, title: "Enlace" },
    size: { type: ControlType.Number, title: "Tamaño", min: 40, max: 160, unit: "px" },
    theme: { type: ControlType.Enum, title: "Estilo", options: ["desktop", "finder"], optionTitles: ["Escritorio", "Finder"] },
    draggable: { type: ControlType.Boolean, title: "Arrastrable" },
    selection: { type: ControlType.Color, title: "Selección" },
})
