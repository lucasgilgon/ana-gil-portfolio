// AboutSpread — "Sobre mí.txt" como pliego editorial.
// Retrato real, la frase de la práctica en Bodoni, cada proyecto como "herida → objeto",
// formación real (del CV) y accesos a Currículum, PDF, Contacto e Instagram.
// Los proyectos vienen del bloque @archive-data (scripts/sync-archive-data.mjs).

import * as React from "react"
import { thumb } from "../lib/media"
import { addPropertyControls, ControlType, Link } from "framer"
import { motion, useReducedMotion } from "framer-motion"

import { PROJECTS as _PROJECTS } from "../content/generated"
type ArchiveFile = { src: string; name: string }
type ArchiveProject = (typeof _PROJECTS)[number]
const PROJECTS: ArchiveProject[] = _PROJECTS


const INK = "var(--ag-ink, #111111)"
const PAPER = "var(--ag-paper, #F4F2ED)"
const SHEET = "var(--ag-sheet, #FBFAF7)"
const FOG = "var(--ag-fog, #D7D4CD)"
const ASH = "var(--ag-ash, #625f59)"
const UI = `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
const MONO = `"IBM Plex Mono", Menlo, monospace`
const DISPLAY = `"AG Bodoni", "Bodoni Moda", "Didot", Georgia, serif`
const opsz = (px: number) => `"opsz" ${Math.max(6, Math.min(96, Math.round(px)))}`
const EASE = [0.22, 1, 0.36, 1] as const

const AG_BODONI_CSS = `@font-face{font-family:"AG Bodoni";font-style:normal;font-weight:400 900;font-display:swap;src:url(/fonts/bodoni-moda.woff2) format("woff2")}@font-face{font-family:"AG Bodoni";font-style:italic;font-weight:400 900;font-display:swap;src:url(/fonts/bodoni-moda-italic.woff2) format("woff2")}`
function useAgBodoni() {
    React.useEffect(() => {
        if (typeof document === "undefined" || document.getElementById("ag-bodoni-face")) return
        const s = document.createElement("style")
        s.id = "ag-bodoni-face"
        s.textContent = AG_BODONI_CSS
        document.head.appendChild(s)
    }, [])
}
function typeset(t: string): React.ReactNode {
    if (!t || !t.includes("_")) return t
    return t.split(/(_)/).map((part, i) => (part === "_" ? <span key={i} style={{ fontFamily: MONO, fontWeight: 500, fontVariationSettings: "normal" }}>_</span> : part))
}

const PORTRAIT = "/media/sistema/retrato"
const PDF_URL = "/docs/CV_Ana_Gil.pdf"

// De su propio texto: "cada proyecto empieza en una herida y termina convertido en objeto"
const ORIGIN: Record<string, { wound: string; object: string; note?: string }> = {
    "404-not-found": { wound: "una ausencia", object: "un libro" },
    "ash-archive": { wound: "un incendio", object: "una colección" },
    "fragmentos-de-mi": { wound: "una memoria que se borra", object: "un kit de sellos" },
    "ex-corpo": { wound: "un silencio que carga", object: "una prenda" },
    amman: { wound: "una ruina", object: "una subasta", note: "con Ana Valle Ruiz" },
}

// Subrayado con hilo que se cose solo (puntadas que aparecen de izquierda a derecha + aguja)
function StitchUnderline({ width = 220, color = "#B23A2B", delay = 0.4 }: { width?: number; color?: string; delay?: number }) {
    const reduce = useReducedMotion()
    return (
        <svg width={width} height="14" viewBox={`0 0 ${width} 14`} aria-hidden style={{ display: "block", overflow: "visible", marginTop: 10 }}>
            <defs>
                <clipPath id={`su${width}`}>
                    <motion.rect x="0" y="-6" height="26" initial={{ width: reduce ? width : 0 }} whileInView={{ width }} viewport={{ once: true }} transition={{ duration: reduce ? 0 : 1.1, delay, ease: "linear" }} />
                </clipPath>
            </defs>
            <line x1="0" y1="7" x2={width} y2="7" stroke={color} strokeWidth="1.6" strokeDasharray="7 5" strokeLinecap="round" clipPath={`url(#su${width})`} />
            {!reduce && (
                <motion.g initial={{ x: 0, opacity: 1 }} whileInView={{ x: width, opacity: [1, 1, 0] }} viewport={{ once: true }} transition={{ duration: 1.1, delay, ease: "linear", opacity: { times: [0, 0.92, 1], duration: 1.2, delay } }}>
                    <motion.g animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.12 }}>
                        <line x1="0" y1="-10" x2="0" y2="8" stroke="#8C8C88" strokeWidth="1.6" strokeLinecap="round" />
                        <ellipse cx="0" cy="-7" rx="1" ry="2.2" fill="none" stroke="#5C5C58" strokeWidth=".8" />
                    </motion.g>
                </motion.g>
            )}
        </svg>
    )
}

function useNarrow(bp = 760) {
    const [n, setN] = React.useState(false)
    React.useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${bp}px)`)
        const u = () => setN(mq.matches)
        u()
        mq.addEventListener?.("change", u)
        return () => mq.removeEventListener?.("change", u)
    }, [bp])
    return n
}

const eyebrow: React.CSSProperties = { fontFamily: MONO, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: ASH }

function Section({ label, children, narrow }: { label: string; children: React.ReactNode; narrow?: boolean }) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "minmax(0, 150px) 1fr", gap: narrow ? 8 : 20, padding: "18px 0", borderTop: `1px solid ${FOG}` }}>
            <div style={{ ...eyebrow, paddingTop: 3 }}>{label}</div>
            <div>{children}</div>
        </div>
    )
}

interface Props {
    email: string
    instagram: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1040
 * @framerIntrinsicHeight 1400
 */
export default function AboutSpread({ email, instagram, style }: Props) {
    useAgBodoni()
    const narrow = useNarrow()
    const reduce = useReducedMotion()
    const [hover, setHover] = React.useState<string | null>(null)
    const projects = [...PROJECTS].sort((a, b) => a.number - b.number)
    const hovered = projects.find((p) => p.slug === hover)
    const igHandle = "@" + (instagram.split("instagram.com/")[1] || "").replace(/\/.*$/, "")

    const reveal = (i: number) =>
        reduce ? {} : { initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" }, transition: { duration: 0.7, ease: EASE, delay: i * 0.06 } }

    return (
        <article style={{ ...style, width: "100%", position: "relative", background: SHEET, color: INK, fontFamily: UI, boxSizing: "border-box", padding: narrow ? "28px 20px 40px" : "56px 64px 64px" }}>
            <div aria-hidden style={{ position: "absolute", inset: 0, background: `url(${thumb("/media/sistema/papel", 1024)}) center / 900px`, opacity: 0.3, mixBlendMode: "multiply", pointerEvents: "none" }} />
            {/* Cabecera del pliego */}
            <div style={{ display: "flex", justifyContent: "space-between", ...eyebrow, marginBottom: narrow ? 22 : 34 }}>
                <span>Sobre mí</span>
                <span>Madrid — {new Date().getFullYear()}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "minmax(0, 5fr) minmax(0, 7fr)", gap: narrow ? 44 : 56, alignItems: "start" }}>
                {/* Retrato (cambia por la portada del proyecto al pasar por la lista) */}
                <motion.figure {...reveal(0)} style={{ margin: 0, position: narrow ? "relative" : "sticky", top: narrow ? undefined : 64 }}>
                    <div style={{ position: "relative", aspectRatio: "512 / 611", background: "#E6E3DC", overflow: "hidden", border: `1px solid ${INK}` }}>
                        <img src={thumb(PORTRAIT, 1024)} alt="Retrato de Ana Gil" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1)", opacity: hovered ? 0 : 1, transition: "opacity .45s ease" }} />
                        {projects.map((p) => (
                            <img key={p.slug} src={thumb(p.cover, 1024)} alt="" aria-hidden loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: hover === p.slug ? 1 : 0, transition: "opacity .45s ease" }} />
                        ))}
                    </div>
                    <figcaption style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 10, ...eyebrow }}>
                        <span>{hovered ? <>Fig. {String(hovered.number).padStart(2, "0")} — {typeset(hovered.title)}</> : "Fig. 00 — Ana Gil"}</span>
                        <span>{hovered ? hovered.year : "ESD Madrid"}</span>
                    </figcaption>
                </motion.figure>

                <div style={{ minWidth: 0 }}>
                    <motion.h1
                        {...reveal(1)}
                        style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 400, fontVariationSettings: opsz(narrow ? 44 : 68), fontSize: narrow ? 44 : 68, lineHeight: 1.02, letterSpacing: "-0.015em" }}
                    >
                        El cuerpo como documento,
                        <br />
                        <em>la tela como archivo.</em>
                    </motion.h1>
                    <StitchUnderline width={narrow ? 180 : 260} delay={0.6} />

                    <motion.p {...reveal(2)} style={{ margin: narrow ? "24px 0 0" : "34px 0 0", fontSize: narrow ? 17 : 19, lineHeight: 1.55, letterSpacing: "-0.005em", maxWidth: 560 }}>
                        Soy Ana Gil González, estudiante de 2º de Diseño de Moda en la ESD Madrid. Mi práctica explora la intersección entre trauma, materialidad y narrativa visual.
                    </motion.p>
                    <motion.p {...reveal(3)} style={{ margin: "16px 0 0", fontSize: 15, lineHeight: 1.65, maxWidth: 560, color: "var(--ag-graphite, #3B3A38)" }}>
                        Trabajo con diseño editorial, dirección de arte y confección conceptual. Cada proyecto empieza en una herida —un incendio, una ausencia, una memoria que se borra— y termina convertido en objeto.
                    </motion.p>

                    {/* Herida → objeto */}
                    <motion.div {...reveal(4)} style={{ marginTop: narrow ? 30 : 44, borderTop: `1px solid ${INK}` }}>
                        <div style={{ display: "grid", gridTemplateColumns: narrow ? "22px 1fr" : "26px 1fr auto", gap: 12, padding: "9px 0", borderBottom: `1px solid ${INK}`, ...eyebrow, color: INK }}>
                            <span>Nº</span>
                            <span>Proyecto</span>
                            {!narrow && <span>Herida → objeto</span>}
                        </div>
                        {projects.map((p) => {
                            const o = ORIGIN[p.slug] ?? { wound: "—", object: p.category.toLowerCase() }
                            const on = hover === p.slug
                            return (
                                <Link key={p.slug} href={p.link}>
                                    <a
                                        onMouseEnter={() => setHover(p.slug)}
                                        onMouseLeave={() => setHover(null)}
                                        onFocus={() => setHover(p.slug)}
                                        onBlur={() => setHover(null)}
                                        style={{ display: "grid", gridTemplateColumns: narrow ? "22px 1fr" : "26px 1fr auto", gap: 12, alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${FOG}`, color: INK, textDecoration: "none" }}
                                    >
                                        <span style={{ fontFamily: MONO, fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}>
                                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: p.accent, transform: on ? "scale(1.5)" : "none", transition: "transform .25s" }} />
                                        </span>
                                        <span style={{ minWidth: 0 }}>
                                            <span style={{ fontFamily: DISPLAY, fontVariationSettings: opsz(22), fontSize: 22, lineHeight: 1.15, whiteSpace: "nowrap", display: "inline-block", transform: on && !reduce ? "translateX(6px)" : "none", transition: "transform .3s cubic-bezier(.22,1,.36,1)" }}>
                                                {typeset(p.title)}
                                            </span>
                                            {o.note && <span style={{ display: "block", ...eyebrow, marginTop: 3 }}>{o.note}</span>}
                                            {(
                                                <span style={{ display: "block", fontSize: 13, color: ASH, marginTop: 4 }}>
                                                    {narrow ? (
                                                        <>
                                                            {o.wound} → <em style={{ color: INK }}>{o.object}</em>
                                                        </>
                                                    ) : (
                                                        <>empieza en {o.wound}</>
                                                    )}
                                                </span>
                                            )}
                                        </span>
                                        {!narrow && (
                                            <span style={{ fontFamily: DISPLAY, fontStyle: "italic", fontVariationSettings: opsz(24), fontSize: 24, display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
                                                {o.object}
                                                <span style={{ fontFamily: MONO, fontStyle: "normal", fontSize: 12, opacity: on ? 1 : 0, transition: "opacity .25s" }}>→</span>
                                            </span>
                                        )}
                                    </a>
                                </Link>
                            )
                        })}
                    </motion.div>

                    <motion.div {...reveal(5)} style={{ marginTop: narrow ? 26 : 40 }}>
                        <Section narrow={narrow} label="Disciplinas">
                            <div style={{ fontSize: 15, lineHeight: 1.7 }}>Diseño de moda · Diseño editorial · Dirección de arte · Investigación conceptual · Confección</div>
                        </Section>
                        <Section narrow={narrow} label="Formación">
                            {[
                                ["2024 —", "Grado en Diseño de Moda", "Escuela Superior de Diseño de Madrid"],
                                ["2023 — 24", "Grado Superior en Diseño Gráfico", "IES Puerta Bonita"],
                                ["", "Curso INSIDE LVMH", ""],
                            ].map(([y, t, w]) => (
                                <div key={t} style={{ display: "grid", gridTemplateColumns: "76px 1fr", gap: 12, fontSize: 14.5, lineHeight: 1.55, marginBottom: 6 }}>
                                    <span style={{ fontFamily: MONO, fontSize: 11, color: ASH, paddingTop: 3 }}>{y}</span>
                                    <span>
                                        {t}
                                        {w && <span style={{ color: ASH }}> — {w}</span>}
                                    </span>
                                </div>
                            ))}
                        </Section>
                        <Section narrow={narrow} label="Idiomas">
                            <div style={{ fontSize: 15, lineHeight: 1.7 }}>Español · Inglés B2 · Italiano B1</div>
                        </Section>
                        <Section narrow={narrow} label="Archivo">
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                <Link href="/cv">
                                    <a style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.04em", padding: "6px 12px", background: INK, color: PAPER, textDecoration: "none" }}>Currículum →</a>
                                </Link>
                                <a href={PDF_URL} target="_blank" rel="noopener" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.04em", padding: "5px 12px", border: `1px solid ${INK}`, color: INK, textDecoration: "none" }}>
                                    ↓ CV en PDF
                                </a>
                                <Link href="/papelera">
                                    <a style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.04em", padding: "5px 12px", border: `1px solid ${INK}`, color: INK, textDecoration: "none" }}>Papelera — proceso</a>
                                </Link>
                            </div>
                        </Section>
                        <Section narrow={narrow} label="Contacto">
                            <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 15 }}>
                                <a href={`mailto:${email}`} style={{ color: INK, textDecoration: "none", borderBottom: `1px solid ${FOG}`, alignSelf: "flex-start" }}>
                                    {email}
                                </a>
                                <a href={instagram} target="_blank" rel="noopener" style={{ color: INK, textDecoration: "none", borderBottom: `1px solid ${FOG}`, alignSelf: "flex-start" }}>
                                    Instagram {igHandle}
                                </a>
                            </div>
                        </Section>
                    </motion.div>

                    {/* Firma */}
                    <motion.div {...reveal(6)} style={{ marginTop: narrow ? 28 : 40, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16 }}>
                        <span style={{ fontFamily: DISPLAY, fontStyle: "italic", fontVariationSettings: opsz(40), fontSize: 40, lineHeight: 1 }}>Ana Gil</span>
                        <Link href="/contact">
                            <a style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.04em", color: INK, textDecoration: "none", borderBottom: `1px solid ${INK}` }}>Escribirme →</a>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </article>
    )
}

AboutSpread.defaultProps = { email: "anagilgonzalez06@gmail.com", instagram: "https://www.instagram.com/byana_________/" }

addPropertyControls(AboutSpread, {
    email: { type: ControlType.String, title: "Email" },
    instagram: { type: ControlType.String, title: "Instagram" },
})
