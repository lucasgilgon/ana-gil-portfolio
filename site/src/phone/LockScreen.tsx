// Pantalla de bloqueo del iPhone: foto de Ana, hora en Bodoni, una notificación del portfolio
// y "desliza hacia arriba para entrar". Solo la primera vez en cada visita.
import * as React from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { thumb } from "../lib/media"
import { PROJECTS } from "../content/generated"
import { SF } from "./PhoneHome"

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
    const y = useMotionValue(0)
    const fade = useTransform(y, [-260, 0], [0, 1])
    const blurOut = useTransform(y, [-260, 0], [12, 0])
    const filter = useTransform(blurOut, (b) => `blur(${b}px)`)
    const [now, setNow] = React.useState(() => new Date())
    React.useEffect(() => {
        const t = window.setInterval(() => setNow(new Date()), 15000)
        return () => window.clearInterval(t)
    }, [])
    const d0 = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }).format(now)
    const date = d0.charAt(0).toUpperCase() + d0.slice(1)
    const time = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(now)

    const unlock = () => {
        animate(y, -window.innerHeight, { type: "spring", stiffness: 260, damping: 32 }).then(onUnlock)
    }

    return (
        <motion.div
            role="dialog"
            aria-label="Pantalla de bloqueo. Desliza hacia arriba para entrar."
            drag="y"
            dragConstraints={{ top: -window.innerHeight, bottom: 0 }}
            dragElastic={{ top: 0.9, bottom: 0.05 }}
            onDragEnd={(_, info) => (info.offset.y < -110 || info.velocity.y < -500 ? unlock() : animate(y, 0, { type: "spring", stiffness: 300, damping: 30 }))}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && unlock()}
            tabIndex={0}
            style={{ position: "fixed", inset: 0, zIndex: 50, y, touchAction: "none", overflow: "hidden", background: "#111", color: "#fff", fontFamily: SF, userSelect: "none" }}
        >
            <motion.div style={{ position: "absolute", inset: 0, opacity: fade, filter }}>
                <div aria-hidden style={{ position: "absolute", inset: 0, background: `url(${thumb("/media/sistema/fondo-retrato", 1600)}) 46% 30% / cover` }} />
                <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.05) 35%, rgba(0,0,0,.1) 60%, rgba(0,0,0,.55))" }} />

                <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "calc(env(safe-area-inset-top, 0px) + 26px) 18px calc(env(safe-area-inset-bottom, 0px) + 14px)" }}>
                    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" stroke="#fff" strokeWidth="1.8" aria-hidden style={{ opacity: 0.9 }}>
                        <rect x="1.5" y="8" width="11" height="9" rx="2" fill="#fff" stroke="none" />
                        <path d="M4 8V5.5a3 3 0 0 1 6 0V8" />
                    </svg>
                    <div style={{ marginTop: 10, fontSize: 18, fontWeight: 600, textShadow: "0 1px 8px rgba(0,0,0,.3)" }}>{date}</div>
                    <div style={{ fontFamily: `"AG Bodoni", "Bodoni Moda", Didot, serif`, fontSize: "min(104px, 27vw)", lineHeight: 0.95, letterSpacing: "-0.02em", fontVariationSettings: '"opsz" 96', textShadow: "0 2px 20px rgba(0,0,0,.25)" }}>{time}</div>

                    <div style={{ flex: 1 }} />

                    {/* Notificación */}
                    <motion.button
                        type="button"
                        onClick={unlock}
                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.9, type: "spring", stiffness: 200, damping: 22 }}
                        style={{ width: "100%", maxWidth: 400, display: "flex", gap: 11, alignItems: "flex-start", padding: "12px 13px", borderRadius: 20, border: "none", textAlign: "left", background: "rgba(245,245,245,.32)", backdropFilter: "blur(24px) saturate(1.6)", WebkitBackdropFilter: "blur(24px) saturate(1.6)", color: "#fff", fontFamily: SF, cursor: "pointer" }}
                    >
                        <img src={thumb("/media/sistema/retrato", 120)} alt="" style={{ width: 38, height: 38, borderRadius: 9, objectFit: "cover", filter: "grayscale(1)", flexShrink: 0 }} />
                        <span style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, fontWeight: 600 }}>
                                Ana Gil <span style={{ fontWeight: 400, opacity: 0.75, fontSize: 12.5 }}>ahora</span>
                            </span>
                            <span style={{ display: "block", fontSize: 13.5, lineHeight: 1.3, marginTop: 1 }}>
                                Portfolio 2026 · {PROJECTS.length} proyectos de moda, editorial y dirección de arte. Desliza para entrar.
                            </span>
                        </span>
                    </motion.button>

                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }} style={{ marginTop: 26, fontSize: 14, fontWeight: 500, opacity: 0.9, textShadow: "0 1px 6px rgba(0,0,0,.4)" }}>
                        Desliza hacia arriba para entrar
                    </motion.div>
                    <span aria-hidden style={{ width: 134, height: 5, borderRadius: 3, background: "#fff", marginTop: 12 }} />
                </div>
            </motion.div>
        </motion.div>
    )
}
