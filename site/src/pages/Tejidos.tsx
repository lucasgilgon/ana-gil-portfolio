// Tejidos — muestrario de telas colgado de una barra.
// La muestra está hecha de tiras verticales que se pliegan y se mecen con el ratón o el dedo:
// cuanto más fluida es la tela (campo "caida" en content/tejidos.md), más se mueve.
import * as React from "react"
import { Link } from "framer"
import { motion } from "framer-motion"
import Window, { INK, ASH, SHEET, SIDE, FOG, MONO, DISPLAY, opsz, ChromeCtx } from "../shell/Window"
import { TEJIDOS, PROJECTS, type Tejido } from "../content/generated"
import { thumb } from "../lib/media"
import { typeset } from "./project/pages"

const N = 30 // tiras

function Drape({ t, w, h }: { t: Tejido; w: number; h: number }) {
    const box = React.useRef<HTMLDivElement>(null)
    const strips = React.useRef<(HTMLDivElement | null)[]>([])
    const shades = React.useRef<(HTMLDivElement | null)[]>([])
    const ptr = React.useRef({ x: -1, y: 0, vx: 0, active: 0, lastX: 0, lastT: 0 })

    React.useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        const fold = new Float32Array(N) // ángulo de pliegue (rotateY)
        const fv = new Float32Array(N)
        const sway = new Float32Array(N) // balanceo del bajo (rotateZ)
        const sv = new Float32Array(N)
        const flow = 0.25 + t.caida * 0.9
        let raf = 0
        const sw = w / N
        const loop = (now: number) => {
            const p = ptr.current
            p.active *= 0.97
            p.vx *= 0.9
            for (let i = 0; i < N; i++) {
                const cx = (i + 0.5) * sw
                const d = p.x < 0 ? 1e9 : (cx - p.x) / (w * (0.12 + t.caida * 0.12))
                const infl = Math.exp(-d * d) * p.active
                // pliegues: ondas suaves siempre + empuje donde está el puntero
                const idle = reduce ? 0 : Math.sin(now / (1400 - t.caida * 500) + i * 0.55) * (2 + t.caida * 5)
                const targetFold = idle + (i % 2 ? 1 : -1) * infl * 38 * flow
                const targetSway = reduce ? 0 : Math.sin(now / 1700 + i * 0.18) * 0.6 * flow + infl * p.vx * 0.9 * flow
                fv[i] += (targetFold - fold[i]) * (0.06 + (1 - t.caida) * 0.06)
                fv[i] *= 0.82 - (1 - t.caida) * 0.12
                fold[i] += fv[i]
                sv[i] += (targetSway - sway[i]) * 0.05
                sv[i] *= 0.86
                sway[i] += sv[i]
                const el = strips.current[i]
                if (el) el.style.transform = `rotateZ(${sway[i].toFixed(2)}deg) rotateY(${fold[i].toFixed(2)}deg)`
                const sh = shades.current[i]
                if (sh) sh.style.opacity = String(Math.min(0.55, Math.abs(fold[i]) / 70))
                if (sh) sh.style.background = fold[i] > 0 ? "linear-gradient(90deg, rgba(0,0,0,.6), rgba(0,0,0,0))" : "linear-gradient(270deg, rgba(0,0,0,.6), rgba(255,255,255,.08))"
            }
            raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(raf)
    }, [t, w])

    const onMove = (e: React.PointerEvent) => {
        const r = box.current!.getBoundingClientRect()
        const p = ptr.current
        const now = performance.now()
        const x = e.clientX - r.left
        p.vx = Math.max(-30, Math.min(30, ((x - p.lastX) / Math.max(1, now - p.lastT)) * 16))
        p.lastX = x
        p.lastT = now
        p.x = x
        p.y = e.clientY - r.top
        p.active = 1
    }

    const sw = w / N
    return (
        <div ref={box} onPointerMove={onMove} onPointerDown={onMove} style={{ position: "relative", width: w, height: h, perspective: 900, touchAction: "pan-y", cursor: "grab" }}>
            {/* fondo de la misma tela en sombra: rellena los huecos entre pliegues */}
            <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `url(${thumb(t.src, 600)})`, backgroundSize: `${w}px ${h}px`, filter: "brightness(.55)" }} />
            {Array.from({ length: N }, (_, i) => (
                <div
                    key={i}
                    ref={(el) => (strips.current[i] = el)}
                    style={{ position: "absolute", top: 0, left: i * sw, width: sw * 1.12, height: h, transformOrigin: "50% 0", backgroundImage: `url(${thumb(t.src, 1200)})`, backgroundSize: `${w}px ${h}px`, backgroundPosition: `${-i * sw}px 0`, willChange: "transform" }}
                >
                    <div ref={(el) => (shades.current[i] = el)} style={{ position: "absolute", inset: 0, opacity: 0 }} />
                </div>
            ))}
            {/* bajo con dobladillo */}
            <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: -2, height: 6, background: "linear-gradient(rgba(0,0,0,.18), transparent)", filter: "blur(2px)" }} />
        </div>
    )
}

export default function Tejidos() {
    const ios = React.useContext(ChromeCtx) === "ios"
    const [sel, setSel] = React.useState(TEJIDOS[0]?.id)
    const t = TEJIDOS.find((x) => x.id === sel) ?? TEJIDOS[0]
    const stage = React.useRef<HTMLDivElement>(null)
    const [box, setBox] = React.useState({ w: 600, h: 500 })
    React.useLayoutEffect(() => {
        const el = stage.current
        if (!el) return
        const u = () => setBox({ w: el.clientWidth, h: el.clientHeight })
        u()
        const ro = new ResizeObserver(u)
        ro.observe(el)
        return () => ro.disconnect()
    }, [])
    if (!t) return null
    const usados = PROJECTS.filter((p) => p.tejidos.includes(t.id))
    const dw = Math.min(box.w - 60, ios ? 320 : 420)
    const dh = Math.min(box.h - 90, dw * 1.35)

    return (
        <Window label="Tejidos" title="Tejidos — muestrario" status={<><span>{TEJIDOS.length} tejidos</span><span className="ag-hide-narrow">Pasa el ratón por la tela</span></>} bodyStyle={{ display: "flex", flexDirection: ios ? "column" : "row", background: SHEET }}>
            {/* Muestras */}
            <nav aria-label="Tejidos" style={{ display: "flex", flexDirection: ios ? "row" : "column", gap: 10, padding: 14, width: ios ? "auto" : 150, flexShrink: 0, background: SIDE, borderRight: ios ? "none" : `1px solid ${INK}`, borderBottom: ios ? `1px solid ${FOG}` : "none", overflowX: "auto" }}>
                {TEJIDOS.map((x) => (
                    <button key={x.id} type="button" onClick={() => setSel(x.id)} aria-pressed={x.id === t.id} style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", textAlign: "left", flexShrink: 0 }}>
                        <div style={{ width: ios ? 64 : "100%", aspectRatio: "4 / 3", backgroundImage: `url(${thumb(x.src, 300)})`, backgroundSize: "cover", outline: x.id === t.id ? `2px solid ${INK}` : "none", outlineOffset: 2, clipPath: "polygon(0 6%,6% 0,12% 6%,18% 0,24% 6%,30% 0,36% 6%,42% 0,48% 6%,54% 0,60% 6%,66% 0,72% 6%,78% 0,84% 6%,90% 0,96% 6%,100% 0,100% 100%,0 100%)" }} />
                        <div style={{ marginTop: 5, fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.06em", textTransform: "uppercase", color: x.id === t.id ? INK : ASH }}>{x.nombre}</div>
                    </button>
                ))}
            </nav>

            {/* Tela colgada */}
            <div ref={stage} style={{ flex: 1, minWidth: 0, minHeight: ios ? 480 : 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `radial-gradient(ellipse at 50% 30%, #FFFEFA, ${SIDE})`, overflow: "hidden" }}>
                <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {/* barra de madera */}
                    <div aria-hidden style={{ width: dw + 40, height: 12, borderRadius: 6, background: "linear-gradient(#B98B5E, #7C5434)", boxShadow: "0 3px 6px rgba(0,0,0,.25)", position: "relative", zIndex: 2 }} />
                    <motion.div key={t.id} initial={{ y: -20, opacity: 0 }} animate={{ y: -3, opacity: 1 }} transition={{ type: "spring", stiffness: 120, damping: 12 }} style={{ filter: "drop-shadow(0 16px 18px rgba(0,0,0,.2))" }}>
                        <Drape t={t} w={Math.round(dw)} h={Math.round(dh)} />
                    </motion.div>
                </div>
            </div>

            {/* Ficha */}
            <aside style={{ width: ios ? "auto" : 270, flexShrink: 0, padding: "22px 20px", borderLeft: ios ? "none" : `1px solid ${FOG}`, overflow: "auto" }}>
                <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: ASH }}>Muestra · {String(TEJIDOS.indexOf(t) + 1).padStart(2, "0")}</div>
                <h2 style={{ margin: "6px 0 6px", fontFamily: DISPLAY, fontWeight: 400, fontSize: 40, lineHeight: 1, fontVariationSettings: opsz(40) }}>{t.nombre}</h2>
                <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>{t.tacto}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <span style={{ fontFamily: MONO, fontSize: 9.5, color: ASH, letterSpacing: "0.06em" }}>CAÍDA</span>
                    <span style={{ flex: 1, height: 3, background: FOG, position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${t.caida * 100}%`, background: INK }} />
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 9.5, color: ASH }}>{t.caida < 0.5 ? "RÍGIDA" : t.caida < 0.8 ? "MEDIA" : "FLUIDA"}</span>
                </div>
                <p style={{ margin: "0 0 22px", fontSize: 14, lineHeight: 1.55, color: "#3B3A38" }}>{t.texto}</p>
                {usados.length > 0 && (
                    <>
                        <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: ASH, marginBottom: 8 }}>Se usa en</div>
                        <div style={{ display: "grid", gap: 10 }}>
                            {usados.map((p) => (
                                <Link key={p.slug} href={p.link}>
                                    <a style={{ display: "flex", gap: 10, alignItems: "center", color: INK, textDecoration: "none", border: `1px solid ${FOG}`, padding: 6, background: "#FFFEFA" }}>
                                        <img src={thumb(p.cover, 160)} alt="" style={{ width: 46, height: 58, objectFit: "cover" }} />
                                        <span>
                                            <span style={{ display: "block", fontFamily: DISPLAY, fontSize: 19, lineHeight: 1.05, fontVariationSettings: opsz(19) }}>{typeset(p.title)}</span>
                                            <span style={{ fontFamily: MONO, fontSize: 9, color: ASH, letterSpacing: "0.06em" }}>
                                                {p.category.toUpperCase()} · {p.year} →
                                            </span>
                                        </span>
                                    </a>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </aside>
        </Window>
    )
}
