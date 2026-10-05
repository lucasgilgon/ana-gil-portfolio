// Escritorio macOS: fondo con enfoque, nube de archivos, iconos, firma, barra de menú y Dock.
// Las ventanas (rutas) se abren encima con WindowFrame y se recogen en el Dock al cerrarse.
import * as React from "react"
import { AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"
import FocusWallpaper from "../components/FocusWallpaper"
import ArchiveCloud from "../components/ArchiveCloud"
import DesktopIcon from "../components/DesktopIcon"
import MacMenuBar from "../components/MacMenuBar"
import MacDock from "../components/MacDock"
import Spotlight from "../components/Spotlight"
import AgSystem from "../components/AgSystem"
import BootScreen from "../components/BootScreen"
import WindowFrame from "./WindowFrame"
import { resolveRoute, clean } from "../routes"
import { thumb } from "../lib/media"
import { MONO, DISPLAY, INK } from "./Window"

const ICONS = [
    { label: "Sobre mí.txt", kind: "txt", link: "/about", top: 64 },
    { label: "Portfolio 2026.pdf", kind: "pdf", link: "/docs/Portfolio_Ana_Gil.pdf", top: 192 },
    { label: "Nuevo mensaje", kind: "mail", link: "/contact", top: 320 },
    { label: "Instagram", kind: "instagram", link: "https://www.instagram.com/byana_________/", top: 448 },
] as const

function Signature() {
    return (
        <div style={{ position: "absolute", left: 56, bottom: 112, display: "flex", flexDirection: "column", gap: 14, pointerEvents: "none", zIndex: 1 }}>
            <div aria-hidden style={{ fontFamily: DISPLAY, fontSize: 120, lineHeight: 0.9, letterSpacing: "-0.02em", fontVariationSettings: '"opsz" 96', color: INK }}>ANA GIL</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.06em", border: `1px solid ${INK}`, padding: "3px 8px" }}>FASHION DESIGN</span>
                <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.06em" }}>memoria · cuerpo · materia · archivo</span>
            </div>
        </div>
    )
}

export default function DesktopShell() {
    const location = useLocation()
    const path = clean(location.pathname)
    const route = resolveRoute(path)
    const wall = React.useMemo(() => thumb("/media/sistema/fondo-retrato", Math.min(2400, window.innerWidth * (window.devicePixelRatio || 1))), [])

    return (
        <>
            <h1 className="sr-only">Ana Gil — Fashion design. Portfolio 2026</h1>
            <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
                <FocusWallpaper image={{ src: wall, alt: "Retrato de EX_CORPO" }} blur={26} radius={240} tint="rgba(244,242,237,0.18)" position="center 30%" />
            </div>
            <main aria-label="Escritorio" style={{ position: "fixed", inset: 0, minHeight: 680, zIndex: 1 }}>
                <ArchiveCloud faceX={0.45} faceY={0.36} spread={1} style={{ position: "absolute", inset: 0 }} />
                {ICONS.map((ic) => (
                    <div key={ic.label} style={{ position: "absolute", right: 20, top: ic.top, zIndex: 2 }}>
                        <DesktopIcon label={ic.label} kind={ic.kind as any} link={ic.link} size={64} theme="desktop" draggable quickLook={false} number={0} meta="" year={2026} category="" accent="#111111" />
                    </div>
                ))}
                <Signature />
            </main>

            <AnimatePresence custom={path}>
                {route && (
                    <WindowFrame key={route.key} path={path} size={route.size}>
                        {route.render()}
                    </WindowFrame>
                )}
            </AnimatePresence>

            <MacMenuBar textColor="var(--ag-ink, #111111)" background="var(--ag-paper-94, rgba(244,242,237,0.94))" accent="var(--ag-ink, #111111)" style={{ position: "fixed", top: 0, left: 0, right: 0, height: 28, zIndex: 9 }} />
            <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "center", padding: "0 8px 6px", zIndex: 9, pointerEvents: "none" }}>
                <div style={{ pointerEvents: "auto" }}>
                    <MacDock magnify size={56} maxSize={88} mobileLift={0} />
                </div>
            </div>
            <Spotlight />
            <AgSystem idleSeconds={30} screensaver nightMode coverTransition={false} stitches loupe />
            <BootScreen name="ANA GIL" line2="Portfolio 2026 · Fashion design" background="#F4F2ED" color="#111111" thread="#B23A2B" oncePerSession />
        </>
    )
}
