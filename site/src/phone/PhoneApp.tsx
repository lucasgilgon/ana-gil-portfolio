// PhoneApp — una app a pantalla completa, como en iOS:
// · Se abre desde su icono (recorte que crece con muelle) y se cierra volviendo a él.
// · Barra de navegación con título grande que se compacta al hacer scroll y "‹ Inicio".
// · Indicador de inicio abajo: deslizar hacia arriba (o tocar) vuelve a la pantalla de inicio.
import * as React from "react"
import { motion, useReducedMotion, useMotionValue, useTransform, animate, usePresence, type MotionValue } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { takeOrigin, type Rect } from "../lib/origin"
import { DISPLAY, INK, SHEET, FOG, opsz } from "../shell/Window"
import { SF } from "./PhoneHome"

const SPRING_OPEN = { type: "spring", stiffness: 210, damping: 28, mass: 1 } as const
const SPRING_CLOSE = { type: "spring", stiffness: 260, damping: 32, mass: 0.9 } as const

function iconRect(path: string): Rect | null {
    const sel = `[data-phone-app="${path}"]`
    const el = (document.querySelector(sel)?.firstElementChild as HTMLElement | null) ?? null
    let r = el?.getBoundingClientRect()
    // un proyecto sin icono propio (o la papelera…) vuelve al de Proyectos
    if (!r || !r.width) r = (document.querySelector('[data-phone-app="/projects"]') as HTMLElement | null)?.getBoundingClientRect()
    return r && r.width ? { x: r.left, y: r.top, w: r.width, h: r.height } : null
}

function useClip(t: MotionValue<number>, o: () => Rect | null) {
    return useTransform(t, (k) => {
        const r = o()
        if (!r) return `inset(0px 0px 0px 0px round ${(1 - k) * 40}px)`
        const W = window.innerWidth
        const H = window.innerHeight
        const l = (a: number) => a * (1 - k)
        return `inset(${l(r.y)}px ${l(W - r.x - r.w)}px ${l(H - r.y - r.h)}px ${l(r.x)}px round ${14 * (1 - k)}px)`
    })
}

interface Props {
    path: string
    title: string
    back?: { href: string; label: string }
    children: React.ReactNode
    /** sin barra grande (p. ej. el libro, que tiene la suya) */
    bare?: boolean
    tint?: string
}

export default function PhoneApp({ path, title, back = { href: "/", label: "Inicio" }, children, bare, tint = SHEET }: Props) {
    const navigate = useNavigate()
    const reduce = useReducedMotion()
    const [isPresent, safeToRemove] = usePresence()
    const t = useMotionValue(0) // 0 = icono, 1 = pantalla completa
    const drag = useMotionValue(0) // arrastre del indicador de inicio
    const origin = React.useRef<Rect | null>(null)

    const clipPath = useClip(t, () => origin.current)
    const scale = useTransform([t, drag] as any, ([k, d]: number[]) => (0.9 + 0.1 * k) * (1 - Math.min(0.35, d / 900)))
    const y = useTransform(drag, (d) => -d * 0.35)
    const radius = useTransform(drag, (d) => Math.min(40, d / 3))
    const contentOpacity = useTransform(t, [0, 0.35, 1], [0, 1, 1])

    React.useLayoutEffect(() => {
        origin.current = iconRect(path) ?? takeOrigin(path)
        animate(t, 1, reduce ? { duration: 0 } : SPRING_OPEN)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Al salir: vuelve a su icono
    React.useEffect(() => {
        if (isPresent) return
        origin.current = iconRect(path) ?? origin.current
        animate(drag, 0, reduce ? { duration: 0 } : SPRING_CLOSE)
        animate(t, 0, reduce ? { duration: 0 } : SPRING_CLOSE).then(() => safeToRemove?.())
        const failsafe = window.setTimeout(() => safeToRemove?.(), 900)
        return () => window.clearTimeout(failsafe)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPresent])

    // Indicador de inicio: arrastrar hacia arriba
    const start = React.useRef<number | null>(null)
    const onPD = (e: React.PointerEvent) => {
        start.current = e.clientY
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }
    const onPM = (e: React.PointerEvent) => {
        if (start.current == null) return
        drag.set(Math.max(0, start.current - e.clientY))
    }
    const onPU = (e: React.PointerEvent) => {
        if (start.current == null) return
        const d = start.current - e.clientY
        start.current = null
        if (d > 70 || Math.abs(d) < 6) navigate("/")
        else animate(drag, 0, reduce ? { duration: 0 } : SPRING_CLOSE)
    }

    return (
        <motion.div
            role="dialog"
            aria-label={title}
            style={{ position: "fixed", inset: 0, zIndex: 20, clipPath, WebkitClipPath: clipPath as any, pointerEvents: isPresent ? "auto" : "none" }}
        >
            <motion.div style={{ position: "absolute", inset: 0, background: tint, scale, y, borderRadius: radius, overflow: "hidden", transformOrigin: "50% 40%" }}>
                <motion.div style={{ position: "absolute", inset: 0, opacity: contentOpacity }}>
                    {bare ? <div style={{ position: "absolute", inset: 0, overflowY: "auto", paddingBottom: 32 }}>{children}</div> : <NavScroll title={title} back={back}>{children}</NavScroll>}
                </motion.div>

                {/* Indicador de inicio */}
                <div onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU} onPointerCancel={() => { start.current = null; animate(drag, 0, reduce ? { duration: 0 } : SPRING_CLOSE) }} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate("/") } }} aria-label="Volver al inicio" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "calc(env(safe-area-inset-bottom, 0px) + 26px)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)", touchAction: "none", zIndex: 30 }}>
                    <span style={{ width: 134, height: 5, borderRadius: 3, background: bare ? "rgba(17,17,17,.55)" : "rgba(17,17,17,.75)" }} />
                </div>
            </motion.div>
        </motion.div>
    )
}

export function BackButton({ href, label, light }: { href: string; label: string; light?: boolean }) {
    const navigate = useNavigate()
    return (
        <button type="button" onClick={() => navigate(href)} style={{ display: "flex", alignItems: "center", gap: 2, border: "none", background: "transparent", padding: "6px 8px", fontFamily: SF, fontSize: 16.5, color: light ? "#fff" : INK, cursor: "pointer" }}>
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M10 2 2 10l8 8" />
            </svg>
            <span style={{ marginLeft: 4 }}>{label}</span>
        </button>
    )
}

// Contenedor con scroll + barra de navegación de iOS (título grande que se compacta)
export function NavScroll({ title, back, children, right }: { title: string; back: { href: string; label: string }; children: React.ReactNode; right?: React.ReactNode }) {
    const [scrolled, setScrolled] = React.useState(false)
    return (
        <div onScroll={(e) => setScrolled((e.currentTarget as HTMLDivElement).scrollTop > 36)} style={{ position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain", background: SHEET }}>
            <header style={{ position: "sticky", top: 0, zIndex: 5, paddingTop: "env(safe-area-inset-top, 0px)", background: scrolled ? "rgba(244,242,237,.82)" : SHEET, backdropFilter: scrolled ? "blur(20px) saturate(1.5)" : undefined, WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.5)" : undefined, borderBottom: `0.5px solid ${scrolled ? FOG : "transparent"}`, transition: "background .2s, border-color .2s" }}>
                <div style={{ position: "relative", height: 46, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px" }}>
                    <BackButton {...back} />
                    <div style={{ position: "absolute", left: 96, right: 96, textAlign: "center", fontFamily: SF, fontSize: 16, fontWeight: 600, color: INK, opacity: scrolled ? 1 : 0, transition: "opacity .2s", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", pointerEvents: "none" }}>{title}</div>
                    {right}
                </div>
            </header>
            <h1 style={{ margin: "2px 18px 12px", fontFamily: DISPLAY, fontWeight: 400, fontSize: 40, lineHeight: 1.02, letterSpacing: "-0.015em", color: INK, fontVariationSettings: opsz(40) }}>{title}</h1>
            {children}
            <div style={{ height: "calc(env(safe-area-inset-bottom, 0px) + 44px)" }} />
        </div>
    )
}
