// Pantalla de inicio del iPhone: fecha y firma, widgets, apps (cada proyecto es una app) y Dock.
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "framer"
import { PROJECTS } from "../content/generated"
import { AppIcon, APPS, type AppId } from "../components/MacDock"
import { thumb } from "../lib/media"
import { DISPLAY, MONO, opsz } from "../shell/Window"

export const SF = `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", sans-serif`
const app = (id: AppId) => APPS.find((a) => a.id === id)!

// "ASH ARCHIVE" → "Ash Archive"; "404:NOT FOUND_" → "404"; nombres largos → primera palabra
const shortName = (t: string) => {
    const base = t.split(":")[0].replace(/_+$/, "")
    const nice = base.toLowerCase().replace(/(^|[\s_])(\S)/g, (_m, sep, c) => sep + c.toUpperCase())
    return nice.length > 11 ? nice.split(/\s/)[0] : nice
}

function Label({ children }: { children: React.ReactNode }) {
    return <span style={{ display: "block", marginTop: 5, fontFamily: SF, fontSize: 11.5, fontWeight: 500, color: "#fff", textAlign: "center", textShadow: "0 1px 3px rgba(0,0,0,.5)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-0.01em" }}>{children}</span>
}

// Icono de app: un enlace normal (la ventana sale de aquí) o externo
function Icon({ href, label, children, ext, hideLabel }: { href: string; label: string; children: React.ReactNode; ext?: boolean; hideLabel?: boolean }) {
    const inner = (
        <motion.a whileTap={{ scale: 0.9, filter: "brightness(.8)" }} transition={{ duration: 0.12 }} data-phone-app={ext ? undefined : href} aria-label={label} href={href} style={{ display: "block", textDecoration: "none", WebkitTapHighlightColor: "transparent" }}>
            <div style={{ width: "var(--ic)", height: "var(--ic)", margin: "0 auto", borderRadius: "23%", overflow: "hidden", boxShadow: "0 2px 6px rgba(0,0,0,.18)" }}>{children}</div>
            {!hideLabel && <Label>{label}</Label>}
        </motion.a>
    )
    return ext ? React.cloneElement(inner, { target: "_blank", rel: "noopener" }) : <Link href={href}>{inner}</Link>
}

function ProjectIcon({ p }: { p: (typeof PROJECTS)[number] }) {
    return (
        <Icon href={p.link} label={shortName(p.title)}>
            <div style={{ position: "relative", width: "100%", height: "100%", background: p.accent }}>
                <img src={thumb(p.cover, 180)} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <span style={{ position: "absolute", left: 5, bottom: 5, fontFamily: MONO, fontSize: 8.5, fontWeight: 500, lineHeight: 1, padding: "2px 3px", background: "rgba(251,250,247,.92)", color: "#111" }}>{String(p.number).padStart(2, "0")}</span>
            </div>
        </Icon>
    )
}

// Widget de fotos de los proyectos (cambia solo, como "Destacado")
function ProjectsWidget() {
    const [i, setI] = React.useState(0)
    React.useEffect(() => {
        const t = window.setInterval(() => setI((x) => (x + 1) % PROJECTS.length), 3800)
        return () => window.clearInterval(t)
    }, [])
    const p = PROJECTS[i]
    return (
        <Link href="/projects">
            <motion.a data-phone-app="/projects" whileTap={{ scale: 0.96 }} aria-label="Proyectos" style={{ position: "relative", display: "block", aspectRatio: "1", borderRadius: 22, overflow: "hidden", background: "#222", textDecoration: "none", boxShadow: "0 6px 20px rgba(0,0,0,.2)" }}>
                <AnimatePresence initial={false}>
                    <motion.img key={p.slug} src={thumb(p.cover, 480)} alt="" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.1, ease: "easeOut" }} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </AnimatePresence>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 45%, rgba(0,0,0,.55))" }} />
                <div style={{ position: "absolute", left: 12, right: 12, bottom: 11, color: "#fff" }}>
                    <div style={{ fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.12em", opacity: 0.85 }}>PROYECTOS · {String(i + 1).padStart(2, "0")}/{String(PROJECTS.length).padStart(2, "0")}</div>
                    <div style={{ fontFamily: DISPLAY, fontSize: 20, lineHeight: 1.05, marginTop: 3, fontVariationSettings: opsz(20) }}>{p.title}</div>
                </div>
            </motion.a>
        </Link>
    )
}

function CVWidget() {
    return (
        <Link href="/cv">
            <motion.a data-phone-app="/cv" whileTap={{ scale: 0.96 }} aria-label="Currículum" style={{ position: "relative", display: "flex", flexDirection: "column", aspectRatio: "1", borderRadius: 22, overflow: "hidden", background: "rgba(251,250,247,.86)", backdropFilter: "blur(20px) saturate(1.4)", WebkitBackdropFilter: "blur(20px) saturate(1.4)", color: "#111", textDecoration: "none", padding: 13, boxShadow: "0 6px 20px rgba(0,0,0,.16)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <img src={thumb("/media/sistema/retrato", 160)} alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", filter: "grayscale(1)" }} />
                    <span style={{ fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.1em", color: "#7C7973" }}>CV · 2026</span>
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ fontFamily: DISPLAY, fontSize: 25, lineHeight: 1, fontVariationSettings: opsz(25) }}>Ana Gil</div>
                <div style={{ fontFamily: SF, fontSize: 11.5, lineHeight: 1.3, color: "#3B3A38", marginTop: 4 }}>Fashion Design Student · ESD Madrid</div>
                <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.08em", marginTop: 8 }}>VER CURRÍCULUM →</div>
            </motion.a>
        </Link>
    )
}

function useNow() {
    const [d, setD] = React.useState(() => new Date())
    React.useEffect(() => {
        const t = window.setInterval(() => setD(new Date()), 30000)
        return () => window.clearInterval(t)
    }, [])
    return d
}

export default function PhoneHome() {
    const now = useNow()
    const d0 = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }).format(now)
    const date = d0.charAt(0).toUpperCase() + d0.slice(1)
    const time = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(now)
    const wall = thumb("/media/sistema/fondo-retrato", 1600)

    return (
        <div className="ag-phone-home" style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#2a2622", ["--ic" as any]: "min(62px, 15.5vw)" }}>
            <h1 className="sr-only">Ana Gil — Fashion design. Portfolio 2026</h1>
            {/* fondo: el retrato, como fondo de pantalla */}
            <div aria-hidden style={{ position: "absolute", inset: -20, background: `url(${wall}) 46% 30% / cover`, transform: "scale(1.04)" }} />
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(0,0,0,.28), rgba(0,0,0,0) 28%, rgba(0,0,0,0) 55%, rgba(0,0,0,.35))" }} />
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "var(--ag-veil, transparent)", transition: "background .6s" }} />

            <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", padding: "calc(env(safe-area-inset-top, 0px) + 18px) 22px calc(env(safe-area-inset-bottom, 0px) + 10px)" }}>
                {/* Fecha y firma, como la pantalla de bloqueo */}
                <Link href="/about">
                    <a aria-label="Sobre Ana Gil" data-phone-app="/about-sig" style={{ display: "block", textAlign: "center", color: "#fff", textDecoration: "none", textShadow: "0 1px 12px rgba(0,0,0,.25)" }}>
                        <div style={{ fontFamily: SF, fontSize: 16, fontWeight: 600, opacity: 0.92 }}>
                            {date} · {time}
                        </div>
                        <div style={{ fontFamily: DISPLAY, fontSize: "min(78px, 19vw)", lineHeight: 0.92, letterSpacing: "-0.02em", fontVariationSettings: '"opsz" 96', marginTop: 4 }}>ANA GIL</div>
                        <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.14em", marginTop: 8, opacity: 0.9 }}>FASHION DESIGN · ESD MADRID</div>
                    </a>
                </Link>

                <div className="ag-phone-scroll" style={{ flex: 1, minHeight: 0, overflowY: "auto", margin: "0 -22px", padding: "22px 22px 8px", scrollbarWidth: "none" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                        <div>
                            <ProjectsWidget />
                            <Label>Proyectos</Label>
                        </div>
                        <div>
                            <CVWidget />
                            <Label>Currículum</Label>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px 12px", marginTop: 20 }}>
                        {PROJECTS.map((p) => (
                            <ProjectIcon key={p.slug} p={p} />
                        ))}
                        <Icon href="/fotos" label="Fotos">
                            <AppIcon app={app("photos")} />
                        </Icon>
                        <Icon href="/docs/Portfolio_Ana_Gil.pdf" label="Portfolio" ext>
                            <AppIcon app={app("preview")} />
                        </Icon>
                        <Icon href="https://www.instagram.com/byana_________/" label="Instagram" ext>
                            <AppIcon app={app("instagram")} />
                        </Icon>
                        <Icon href="/papelera" label="Papelera">
                            <AppIcon app={app("trash")} />
                        </Icon>
                    </div>
                </div>

                {/* Buscar (abre Spotlight) */}
                <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("ag:spotlight"))} style={{ alignSelf: "center", margin: "10px 0 12px", display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, border: "none", background: "rgba(255,255,255,.22)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", color: "#fff", fontFamily: SF, fontSize: 13, fontWeight: 500 }}>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <circle cx="7" cy="7" r="5" />
                        <path d="m11 11 3.5 3.5" strokeLinecap="round" />
                    </svg>
                    Buscar
                </button>

                {/* Dock */}
                <nav aria-label="Dock" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, padding: 14, borderRadius: 32, background: "rgba(255,255,255,.24)", backdropFilter: "blur(26px) saturate(1.6)", WebkitBackdropFilter: "blur(26px) saturate(1.6)" }}>
                    <Icon href="/projects" label="Proyectos" hideLabel>
                        <AppIcon app={app("finder")} />
                    </Icon>
                    <Icon href="/about" label="Sobre mí" hideLabel>
                        <AppIcon app={app("notes")} />
                    </Icon>
                    <Icon href="/cv" label="Currículum" hideLabel>
                        <AppIcon app={app("contacts")} />
                    </Icon>
                    <Icon href="/contact" label="Mail" hideLabel>
                        <AppIcon app={app("mail")} />
                    </Icon>
                </nav>
            </div>
            <style>{`.ag-phone-scroll::-webkit-scrollbar{display:none}`}</style>
        </div>
    )
}
