// Carta de presentación del CV: se escribe sola a máquina y Ana la firma a mano al terminar.
// Clic en la hoja para terminar de golpe. Con "reducir movimiento" aparece entera.
import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Link } from "framer"
import { thumb } from "../lib/media"
import type { Copy, Lang } from "./CVWindow"

const INK = "var(--ag-ink, #111111)"
const ASH = "var(--ag-ash, #625f59)"
const MONO = `"IBM Plex Mono", Menlo, monospace`
const DISPLAY = `"AG Bodoni", "Bodoni Moda", "Didot", Georgia, serif`
const PEN = "#1F2C4D" // tinta azul-negra de la firma

// Firma "Ana Gil" a mano alzada, trazo a trazo
const SIGNATURE = [
    "M8 74 C18 56 30 30 40 10 C45 30 50 54 58 74",
    "M20 52 C30 48 42 47 55 49",
    "M62 72 C64 62 66 55 70 55 C76 55 73 69 78 69 C83 68 84 58 90 57 C97 56 92 71 100 70 C106 69 108 62 112 59",
    "M152 30 C140 16 118 22 116 44 C114 66 134 76 148 64 C153 59 154 52 151 47 C146 51 140 52 134 51",
    "M164 52 C165 58 165 66 167 71",
    "M163 39 C164 40 165 40 166 39",
    "M182 10 C184 32 181 56 185 70 C190 76 200 70 208 62",
    "M44 86 C100 92 170 88 246 76",
]

function useTyping(total: number, run: number, reduce: boolean) {
    const [n, setN] = React.useState(reduce ? total : 0)
    const done = React.useRef(false)
    React.useEffect(() => {
        if (reduce) {
            setN(total)
            return
        }
        setN(0)
        done.current = false
        let i = 0
        let t = 0
        const tick = () => {
            if (done.current) return
            i += 1
            setN(i)
            if (i >= total) return
            // pausa más larga tras puntuación y saltos de línea, como una máquina de verdad
            const prev = (window as any).__agLetterChars?.[i - 1] as string | undefined
            const pause = prev === "\n" ? 260 : /[.,:;—]/.test(prev || "") ? 120 : 0
            t = window.setTimeout(tick, 11 + Math.random() * 16 + pause)
        }
        t = window.setTimeout(tick, 450)
        return () => {
            done.current = true
            window.clearTimeout(t)
        }
    }, [total, run, reduce])
    return [n, () => {
        done.current = true
        setN(total)
    }] as const
}

export default function LetterView({ c, lang, email, phone, narrow }: { c: Copy; lang: Lang; email: string; phone: string; narrow: boolean }) {
    const reduce = !!useReducedMotion()
    const [run, setRun] = React.useState(0)
    const [copied, setCopied] = React.useState(false)
    const date = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : lang === "it" ? "it-IT" : "es-ES", { day: "numeric", month: "long", year: "numeric" }).format(new Date())
    const blocks = [`${c.letterPlace}, ${date}`, c.letterTo, ...c.letterP, c.letterBye]
    const full = blocks.join("\n")
    ;(window as any).__agLetterChars = full
    const [n, finish] = useTyping(full.length, run, reduce)
    const typed = n >= full.length

    // Reparte los caracteres escritos entre los bloques
    let left = n
    const parts = blocks.map((b) => {
        const v = Math.max(0, Math.min(b.length, left))
        left -= b.length + 1
        return { shown: b.slice(0, v), rest: b.slice(v), active: v > 0 && v < b.length }
    })
    const lastActive = parts.findIndex((p) => p.rest.length > 0)

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(`${full}\n\nAna Gil\n${email} · ${phone}`)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1800)
        } catch {}
    }

    const btn: React.CSSProperties = { fontFamily: MONO, fontSize: 11, letterSpacing: "0.04em", padding: "6px 12px", border: `1px solid ${INK}`, background: "transparent", color: INK, cursor: "pointer", textDecoration: "none" }

    return (
        <div style={{ position: "relative", padding: narrow ? "22px 12px 36px" : "38px 24px 48px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <article
                onClick={() => !typed && finish()}
                aria-label={c.views.letter}
                style={{ position: "relative", width: "100%", maxWidth: 660, background: "#FFFEFA", boxShadow: "0 1px 0 rgba(0,0,0,.06), 0 18px 40px rgba(0,0,0,.12)", padding: narrow ? "30px 22px 36px" : "54px 64px 56px", cursor: typed ? "default" : "pointer", color: INK }}
            >
                <div aria-hidden style={{ position: "absolute", inset: 0, background: `url(${thumb("/media/sistema/papel", 1024)}) center / 700px`, opacity: 0.35, mixBlendMode: "multiply", pointerEvents: "none" }} />
                {/* Membrete */}
                <header style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap", paddingBottom: 14, marginBottom: 28 }}>
                    <div style={{ fontFamily: DISPLAY, fontSize: 30, lineHeight: 1, letterSpacing: "0.02em", fontVariationSettings: '"opsz" 30' }}>ANA GIL</div>
                    <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.06em", color: ASH, textAlign: "right", lineHeight: 1.6 }}>
                        {email}
                        <br />
                        {phone} · Madrid
                    </div>
                    <svg aria-hidden width="100%" height="4" style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
                        <line x1="0" y1="2" x2="100%" y2="2" stroke="#B23A2B" strokeWidth="1.4" strokeDasharray="7 5" strokeLinecap="round" />
                    </svg>
                </header>

                {/* Texto a máquina */}
                <div style={{ position: "relative", fontFamily: MONO, fontSize: narrow ? 12.5 : 13.5, lineHeight: 1.78, letterSpacing: "0.005em", textShadow: "0 0 .7px rgba(17,17,17,.45)" }}>
                    {parts.map((p, i) => (
                        <p key={i} style={{ margin: i === 0 ? "0 0 22px" : i === 1 ? "0 0 16px" : "0 0 14px", textAlign: i === 0 ? "right" : "left", hyphens: "auto" }} lang={lang}>
                            {p.shown}
                            {i === lastActive && !typed && <span className="ag-caret" aria-hidden />}
                            <span style={{ visibility: "hidden" }}>{p.rest}</span>
                        </p>
                    ))}
                </div>

                {/* Firma */}
                <div style={{ position: "relative", height: 96, marginTop: 4 }}>
                    <svg viewBox="0 0 260 96" width="220" height="82" aria-label="Firma de Ana Gil" style={{ overflow: "visible" }}>
                        {SIGNATURE.map((d, i) => (
                            <motion.path
                                key={`${run}-${i}`}
                                d={d}
                                fill="none"
                                stroke={PEN}
                                strokeWidth={i === SIGNATURE.length - 1 ? 1.4 : 2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
                                animate={typed ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                                transition={{ pathLength: { duration: reduce ? 0 : 0.42, delay: reduce ? 0 : 0.25 + i * 0.36, ease: "easeInOut" }, opacity: { duration: 0.01, delay: reduce ? 0 : 0.25 + i * 0.36 } }}
                            />
                        ))}
                    </svg>
                </div>
                <div style={{ position: "relative", fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", color: ASH, opacity: typed ? 1 : 0, transition: "opacity .6s 2.8s" }}>ANA GIL GONZÁLEZ · ESD MADRID</div>

                {!typed && (
                    <div style={{ position: "absolute", right: 16, bottom: 12, fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.08em", color: ASH, textTransform: "uppercase" }}>{c.letterSkip}</div>
                )}
            </article>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                <Link href="/contact">
                    <a style={{ ...btn, background: INK, color: "var(--ag-paper, #F4F2ED)" }}>{c.letterWrite} →</a>
                </Link>
                <button type="button" onClick={copy} style={btn}>
                    {copied ? `✓ ${c.letterCopied}` : c.letterCopy}
                </button>
                <button type="button" onClick={() => setRun((r) => r + 1)} style={btn}>
                    ↺ {c.letterAgain}
                </button>
            </div>
            <style>{`.ag-caret{display:inline-block;width:.55em;height:1.05em;margin-left:1px;vertical-align:-.15em;background:${INK};animation:agCaret 1s steps(1) infinite}@keyframes agCaret{50%{opacity:0}}`}</style>
        </div>
    )
}
