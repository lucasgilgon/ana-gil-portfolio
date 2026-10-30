// Gama cromática — el recorrido de color de la colección con sus bocetos colocados encima.
// Seis maneras de verla (anillo, pasarela, línea, muestrario, tendedero, pincel): se pasa el cursor
// (o se arrastra con el dedo) y el boceto cambia solo; ← → saltan de look en look.
// Datos: campo "gama" de content/proyectos/<slug>/proyecto.md. Con ?editar en la dirección,
// los bocetos se pueden arrastrar y sale el texto listo para pegar en el proyecto.md.
import * as React from "react"
import { Link } from "framer"
import Window, { INK, ASH, PAPER, MONO, UI, DISPLAY, opsz } from "../../shell/Window"
import type { Project } from "../../content/generated"
import { thumb } from "../../lib/media"

type View = "A" | "B" | "C" | "D" | "E" | "F"
const VIEWS: { v: View; label: string; desc: string }[] = [
    { v: "A", label: "Anillo", desc: "La gama empieza y acaba en el mismo azul marino, así que se cierra en un círculo. Gira el cursor alrededor: cada look cuelga en su sitio del anillo, como las horas de un reloj, y el del centro cambia." },
    { v: "B", label: "Pasarela", desc: "La colección entera en fila, de pie sobre la línea de color. El look que tocas da un paso al frente y el resto se queda en segundo plano." },
    { v: "C", label: "Línea", desc: "Miniaturas fijas sobre la línea de color y el boceto grande debajo, que cambia según mueves el cursor." },
    { v: "D", label: "Muestrario", desc: "Cada look es una carta de color, como un muestrario Pantone abierto en abanico: la carta que tocas sale del mazo, con su color arriba y el boceto debajo." },
    { v: "E", label: "Tendedero", desc: "La línea de color es un hilo con puntadas y los bocetos cuelgan de él con pinzas. El que tocas crece y se balancea." },
    { v: "F", label: "Pincel", desc: "El boceto aparece primero a lápiz y el color lo va rellenando de abajo arriba según te acercas a su sitio en la línea." },
]

const CSS = `
.gm{--gm-mute:var(--ag-ash,#7C7973);--gm-line:rgba(17,17,17,.12);font-family:inherit}
.gm img.sk{position:absolute;pointer-events:none;-webkit-user-drag:none;user-select:none}
.gm .edit .mk{cursor:grab;pointer-events:auto}
.gm .edit .mk:active{cursor:grabbing}
.gm .kn{position:absolute;width:28px;height:28px;margin-left:-14px;border-radius:50%;background:#fff;box-shadow:0 3px 12px #0005;display:grid;place-items:center;pointer-events:none;z-index:60}
.gm .kn i{width:16px;height:16px;border-radius:50%;display:block}
.gm .rail{position:absolute;left:0;right:0;border-radius:99px;box-shadow:inset 0 0 0 .5px #0003}
/* A · anillo */
.gm .ring{position:relative;width:min(500px,100%);aspect-ratio:1;margin:6px auto 0;cursor:crosshair}
.gm .ring .band{position:absolute;inset:14%;border-radius:50%;-webkit-mask:radial-gradient(closest-side,transparent calc(100% - 16px),#000 calc(100% - 15px));mask:radial-gradient(closest-side,transparent calc(100% - 16px),#000 calc(100% - 15px))}
.gm .ring .dot{position:absolute;width:12px;height:12px;margin:-6px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 3px #0004;pointer-events:none}
.gm .ring .th{height:12.5%;width:auto;transform:translate(-50%,-50%);opacity:.45;transition:opacity .25s,transform .25s;filter:drop-shadow(0 2px 3px #0002)}
.gm .ring .th.on{opacity:1;transform:translate(-50%,-50%) scale(1.35)}
.gm .ring .kn{width:30px;height:30px;margin:-15px}
.gm .ring .kn i{width:18px;height:18px}
.gm .ring .ctr{position:absolute;inset:24%}
.gm .ring .ctr img{bottom:12%;left:50%;height:76%;transform:translate(-50%,8px);opacity:0;transition:opacity .35s ease,transform .45s cubic-bezier(.3,.9,.3,1);filter:drop-shadow(0 10px 14px #0003)}
.gm .ring .ctr img.on{opacity:1;transform:translate(-50%,0)}
.gm .ring .cap{position:absolute;left:0;right:0;bottom:-2%;text-align:center;font:10px var(--gm-mono);letter-spacing:.08em;color:var(--gm-mute)}
.gm .ring .cap b{display:block;color:var(--ag-ink,#111);font:400 22px var(--gm-display);letter-spacing:0;margin-bottom:2px}
/* B · pasarela */
.gm .run{position:relative;height:clamp(250px,40vw,380px);margin-top:4px;cursor:crosshair}
.gm .run img.sk{bottom:46px;height:clamp(110px,22vw,230px);transform-origin:50% 100%;transition:transform .35s cubic-bezier(.3,.9,.3,1),opacity .3s,filter .3s}
.gm .run .rail{bottom:22px;height:10px}
.gm .run .kn{bottom:13px}
.gm .run .tick{position:absolute;bottom:18px;width:1.5px;height:18px;margin-left:-.75px;background:var(--ag-ink,#111);opacity:.25;pointer-events:none}
/* C · línea + escenario */
.gm .lin{position:relative;height:92px;margin-top:4px;cursor:crosshair}
.gm .lin .mini{bottom:40px;height:46px;transform:translateX(-50%);opacity:.5;transition:opacity .2s,transform .25s;filter:drop-shadow(0 2px 2px #0002)}
.gm .lin .mini.on{opacity:1;transform:translateX(-50%) scale(1.25) translateY(-3px)}
.gm .lin .rail{bottom:16px;height:12px}
.gm .lin .kn{bottom:8px}
.gm .lin .dot{position:absolute;bottom:19px;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:#fff;opacity:.9;pointer-events:none}
.gm .big{position:relative;height:clamp(240px,38vw,340px);margin-top:10px;overflow:hidden}
.gm .big img.sk{left:50%;bottom:30px;height:calc(100% - 40px);transform:translate(-50%,0) scale(.96);opacity:0;transition:opacity .3s,transform .45s cubic-bezier(.3,.9,.3,1);filter:drop-shadow(0 10px 14px #0003)}
.gm .big img.sk.on{opacity:1;transform:translate(-50%,0) scale(1)}
.gm .big img.sk.prev{opacity:.22;transform:translate(-185%,0) scale(.6);filter:blur(1px)}
.gm .big img.sk.next{opacity:.22;transform:translate(85%,0) scale(.6);filter:blur(1px)}
.gm .cnt{position:absolute;left:0;right:0;bottom:0;text-align:center;font:10px var(--gm-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--gm-mute)}
/* D · muestrario */
.gm .fan{position:relative;width:min(760px,100%);aspect-ratio:1.9;margin:0 auto;cursor:crosshair;overflow:hidden}
.gm .chip{position:absolute;left:50%;bottom:-2%;width:clamp(64px,12%,104px);height:84%;margin-left:calc(clamp(64px,12%,104px)/-2);transform-origin:50% 100%;border-radius:6px;background:#fbfaf7;color:#141012;box-shadow:0 2px 10px #00000026,0 0 0 .5px #0000001f;transition:transform .4s cubic-bezier(.3,.9,.3,1);display:flex;flex-direction:column;overflow:hidden;pointer-events:none}
.gm .chip .cb{height:24%;flex:none;transition:background .3s}
.gm .chip .ct{padding:5px 6px 0;font:700 8.5px/1.25 var(--gm-ui);letter-spacing:.02em}
.gm .chip .ct small{display:block;font:500 7.5px var(--gm-mono);opacity:.6}
.gm .chip img{position:static;display:block;height:56%;width:auto;max-width:90%;margin:6px auto 0;object-fit:contain;-webkit-user-drag:none;pointer-events:none}
.gm .chip.on{box-shadow:0 14px 34px #0000004d,0 0 0 .5px #0000001f}
.gm .edit .chip{pointer-events:auto;cursor:grab}
/* E · tendedero */
.gm .tend{position:relative;height:clamp(260px,38vw,400px);cursor:crosshair}
.gm .tend svg{position:absolute;left:0;top:0;width:100%;height:80px;overflow:visible}
.gm .tend .th1{fill:none;stroke-width:4;vector-effect:non-scaling-stroke;stroke-linecap:round}
.gm .tend .th2{fill:none;stroke:#ffffffb3;stroke-width:1.2;stroke-dasharray:5 6;vector-effect:non-scaling-stroke}
.gm .hang{position:absolute;display:flex;flex-direction:column;align-items:center;transform-origin:50% 0;transition:transform .4s cubic-bezier(.3,.9,.3,1),opacity .3s,filter .3s;pointer-events:none}
.gm .hang .pin{width:7px;height:16px;border-radius:2px;background:#b89b74;box-shadow:inset 0 0 0 .5px #0004;flex:none;margin-bottom:-6px;position:relative;z-index:2}
.gm .hang img{position:static;height:clamp(110px,19vw,210px);width:auto;-webkit-user-drag:none;pointer-events:none;filter:drop-shadow(0 6px 8px #0002)}
.gm .hang.on{animation:gm-sw 2.4s ease-in-out infinite}
@keyframes gm-sw{0%,100%{rotate:-2.5deg}50%{rotate:2.5deg}}
.gm .tend .kn{width:24px;height:24px;margin:-12px}
.gm .tend .kn i{width:14px;height:14px}
/* F · pincel */
.gm .pf{position:relative;height:clamp(260px,40vw,380px)}
.gm .pf .pair{position:absolute;inset:0 0 26px;opacity:0;transition:opacity .25s}
.gm .pf .pair.on{opacity:1}
.gm .pf .pair img.sk{left:50%;bottom:0;height:100%;transform:translateX(-50%)}
.gm .pf .pc{filter:grayscale(1) brightness(1.05);opacity:.45}
.gm .pf .cl{filter:drop-shadow(0 10px 14px #0003)}
.gm .pfr{position:relative;height:56px;cursor:crosshair}
.gm .pfr .rail{top:22px;height:12px}
.gm .pfr .nb{position:absolute;top:28px;width:22px;height:22px;margin:-11px;border-radius:50%;background:var(--ag-sheet,#FBFAF7);color:var(--ag-ink,#111);font:600 10px var(--gm-ui);display:grid;place-items:center;box-shadow:0 1px 4px #0003;pointer-events:none;transition:transform .2s}
.gm .pfr .nb.on{transform:scale(1.3);background:var(--ag-ink,#111);color:var(--ag-sheet,#FBFAF7)}
.gm .edit .pfr .nb{pointer-events:auto;cursor:grab}
.gm .pfr .knb{position:absolute;top:28px;width:6px;height:40px;margin:-20px -3px;border-radius:3px;background:var(--ag-ink,#111);pointer-events:none;z-index:5}
@media (prefers-reduced-motion:reduce){.gm *{transition:none!important;animation:none!important}}
`

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16))
const pad2 = (n: number) => String(n).padStart(2, "0")
const rad = (p: number) => (p * 3.6 * Math.PI) / 180

export default function Gama({ project }: { project: Project }) {
    const g = project.gama!
    const C = g.colores
    const n = C.length
    const stop = (k: number) => (k / (n - 1)) * 100
    const [view, setView] = React.useState<View>("A")
    const [P, setP] = React.useState(() => g.bocetos.map((b) => b.pos))
    const [pos, setPos] = React.useState(() => g.bocetos[0]?.pos ?? 0)
    const editable = React.useMemo(() => typeof window !== "undefined" && /[?&]editar\b/.test(window.location.search), [])
    const [edit, setEdit] = React.useState(false)
    const [msg, setMsg] = React.useState("")
    const drag = React.useRef(-1)
    const down = React.useRef(false)
    const area = React.useRef<HTMLDivElement>(null)

    const colorAt = (p: number) => {
        p = Math.max(0, Math.min(100, p))
        const s = (p / 100) * (n - 1)
        const k = Math.min(n - 2, Math.floor(s))
        const t = s - k
        const a = hex(C[k].color)
        const b = hex(C[k + 1].color)
        return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`
    }
    const grad = (conic?: boolean) => C.map((c, k) => `${c.color} ${conic ? (stop(k) * 3.6).toFixed(1) + "deg" : stop(k).toFixed(1) + "%"}`).join(",")
    const colLabel = (p: number) => {
        const s = (p / 100) * (n - 1)
        const k = Math.round(s)
        if (Math.abs(s - k) < 0.18) return C[k].nombre
        const a = Math.floor(s)
        return `${C[a].nombre} → ${C[a + 1].nombre}`
    }
    const dist = (a: number, b: number) => {
        const d = Math.abs(a - b)
        return view === "A" ? Math.min(d, 100 - d) : d
    }
    const nearest = (p: number) => {
        let bi = 0
        let bd = 1e9
        P.forEach((q, i) => {
            const d = dist(p, q)
            if (d < bd) {
                bd = d
                bi = i
            }
        })
        return bi
    }
    const order = P.map((_, i) => i).sort((a, b) => P[a] - P[b])
    const ai = nearest(pos)
    const rk = order.indexOf(ai)
    const col = colorAt(pos)
    const N = g.bocetos.length
    const src = (i: number) => thumb(g.bocetos[i].src, 400)
    const look = (i: number) => g.bocetos[i].look
    const sk = (i: number, cls = "", style?: React.CSSProperties) => <img key={i} className={`sk ${cls}`} src={src(i)} alt={look(i)} draggable={false} data-i={i} style={style} />
    const knob = (style: React.CSSProperties, cls = "kn") => (
        <div className={cls} style={style}>
            {cls === "kn" && <i style={{ background: col }} />}
        </div>
    )

    // ——— puntero: posición 0–100 según la vista ———
    const pAt = (e: React.PointerEvent) => {
        const r = area.current!.getBoundingClientRect()
        if (view === "A") {
            let a = (Math.atan2(e.clientX - r.left - r.width / 2, -(e.clientY - r.top - r.height / 2)) * 180) / Math.PI
            if (a < 0) a += 360
            return a / 3.6
        }
        if (view === "D") {
            const a = (Math.atan2(e.clientX - r.left - r.width / 2, -(e.clientY - r.bottom)) * 180) / Math.PI
            return Math.max(0, Math.min(100, (a + 72) / 1.44))
        }
        const [o, k] = view === "B" ? [4, 0.92] : [3, 0.94]
        return Math.max(0, Math.min(100, (((e.clientX - r.left) / r.width) * 100 - o) / k))
    }
    const place = (i: number, p: number) => setP((q) => q.map((v, k) => (k === i ? Math.round(p) : v)))
    const handlers = {
        onPointerDown: (e: React.PointerEvent) => {
            const mk = (e.target as HTMLElement).closest?.(".mk") as HTMLElement | null
            drag.current = edit && mk ? Number(mk.dataset.i) : -1
            down.current = true
            try {
                ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
            } catch {}
            const p = pAt(e)
            if (drag.current >= 0) place(drag.current, p)
            setPos(p)
        },
        onPointerMove: (e: React.PointerEvent) => {
            if (!(down.current || e.pointerType === "mouse")) return
            const p = pAt(e)
            if (drag.current >= 0 && down.current) place(drag.current, p)
            setPos(p)
        },
        onPointerUp: () => {
            down.current = false
            drag.current = -1
        },
        onPointerCancel: () => {
            down.current = false
            drag.current = -1
        },
    }
    const onKey = (e: React.KeyboardEvent) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
        e.preventDefault()
        setPos(P[order[(rk + (e.key === "ArrowRight" ? 1 : -1) + N) % N]])
    }

    // ——— vistas ———
    const sag = (t: number) => 8 + 240 * t * (1 - t) // forma del hilo del tendedero (px, como el SVG)
    const x3 = (p: number) => 3 + p * 0.94
    let stage: React.ReactNode
    if (view === "A") {
        stage = (
            <div className="ring" ref={area} {...handlers}>
                <div className="band" style={{ background: `conic-gradient(${grad(true)})` }} />
                <div className="ctr">{g.bocetos.map((_, i) => sk(i, i === ai ? "on" : ""))}</div>
                <div className="cap">
                    <b>{look(ai)}</b>
                    {pad2(rk + 1)} / {pad2(N)}
                </div>
                {C.slice(0, n - 1).map((c, k) => (
                    <i key={k} className="dot" style={{ left: `${50 + 36 * Math.sin(rad(stop(k)))}%`, top: `${50 - 36 * Math.cos(rad(stop(k)))}%`, background: c.color }} />
                ))}
                {g.bocetos.map((_, i) => sk(i, `th mk${i === ai ? " on" : ""}`, { left: `${50 + 45 * Math.sin(rad(P[i]))}%`, top: `${50 - 45 * Math.cos(rad(P[i]))}%` }))}
                {knob({ left: `${50 + 36 * Math.sin(rad(pos))}%`, top: `${50 - 36 * Math.cos(rad(pos))}%` })}
            </div>
        )
    } else if (view === "B") {
        stage = (
            <div className="run" ref={area} {...handlers}>
                <div className="rail" style={{ background: `linear-gradient(90deg,${grad()})` }} />
                {g.bocetos.map((_, i) => {
                    const d = (Math.abs(P[i] - pos) / 100) * N
                    const on = i === ai
                    const x = `${4 + P[i] * 0.92}%`
                    return (
                        <React.Fragment key={i}>
                            {sk(i, "mk", { left: x, transform: `translateX(-50%) scale(${on ? 1.28 : Math.max(0.62, 1 - d * 0.12)})`, opacity: on ? 1 : Math.max(0.18, 0.75 - d * 0.16), zIndex: on ? 50 : 20 - Math.round(d), filter: on ? "drop-shadow(0 12px 14px #0003)" : "grayscale(.7)" })}
                            <i className="tick" style={{ left: x }} />
                        </React.Fragment>
                    )
                })}
                {knob({ left: `${4 + pos * 0.92}%` })}
            </div>
        )
    } else if (view === "C") {
        stage = (
            <>
                <div className="lin" ref={area} {...handlers}>
                    <div className="rail" style={{ background: `linear-gradient(90deg,${grad()})` }} />
                    {C.map((_, k) => (
                        <i key={k} className="dot" style={{ left: `${x3(stop(k))}%` }} />
                    ))}
                    {g.bocetos.map((_, i) => sk(i, `mini mk${i === ai ? " on" : ""}`, { left: `${x3(P[i])}%` }))}
                    {knob({ left: `${x3(pos)}%` })}
                </div>
                <div className="big">
                    {g.bocetos.map((_, i) => sk(i, i === ai ? "on" : i === order[rk - 1] ? "prev" : i === order[rk + 1] ? "next" : ""))}
                    <div className="cnt">
                        {pad2(rk + 1)} / {pad2(N)} · {look(ai)}
                    </div>
                </div>
            </>
        )
    } else if (view === "D") {
        stage = (
            <div className="fan" ref={area} {...handlers}>
                {g.bocetos.map((_, i) => {
                    const d = order.indexOf(i) - rk
                    const ang = -72 + P[i] * 1.44 + (d === 0 ? 0 : Math.sign(d) * Math.max(0, 7 - Math.abs(d) * 1.5))
                    return (
                        <div key={i} className={`chip mk${d === 0 ? " on" : ""}`} data-i={i} style={{ transform: `rotate(${ang}deg)${d === 0 ? " translateY(-7%)" : ""}`, zIndex: d === 0 ? 100 : 50 - Math.abs(d) }}>
                            <div className="cb" style={{ background: colorAt(P[i]) }} />
                            <div className="ct">
                                <span>{colLabel(P[i]).split(" → ")[0]}</span>
                                <small>{look(i)}</small>
                            </div>
                            <img src={src(i)} alt={look(i)} draggable={false} />
                        </div>
                    )
                })}
            </div>
        )
    } else if (view === "E") {
        const te = x3(pos) / 100
        stage = (
            <div className="tend" ref={area} {...handlers}>
                <svg viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden>
                    <defs>
                        <linearGradient id={`gm-hilo-${project.slug}`} x1="0" x2="1">
                            {C.map((c, k) => (
                                <stop key={k} offset={`${stop(k)}%`} stopColor={c.color} />
                            ))}
                        </linearGradient>
                    </defs>
                    <path className="th1" d="M0,8 Q500,128 1000,8" stroke={`url(#gm-hilo-${project.slug})`} />
                    <path className="th2" d="M0,8 Q500,128 1000,8" />
                </svg>
                {g.bocetos.map((_, i) => {
                    const t = x3(P[i]) / 100
                    const d = Math.abs(P[i] - pos)
                    const on = i === ai
                    return (
                        <div key={i} className={`hang mk${on ? " on" : ""}`} data-i={i} style={{ left: `${t * 100}%`, top: sag(t) - 4, transform: `translateX(-50%) scale(${on ? 1.3 : Math.max(0.75, 1 - d * 0.012)})`, opacity: on ? 1 : Math.max(0.25, 0.8 - d * 0.02), filter: on ? "none" : "grayscale(.6)", zIndex: on ? 50 : 10, pointerEvents: edit ? "auto" : "none" }}>
                            <span className="pin" />
                            <img src={src(i)} alt={look(i)} draggable={false} />
                        </div>
                    )
                })}
                {knob({ left: `${te * 100}%`, top: sag(te) })}
            </div>
        )
    } else {
        // F · el color se "pinta" a medida que el cursor se acerca al sitio del boceto
        const prevP = rk > 0 ? P[order[rk - 1]] : 0
        const nextP = rk < N - 1 ? P[order[rk + 1]] : 100
        const half = Math.max(2, (pos < P[ai] ? P[ai] - prevP : nextP - P[ai]) / 2)
        const rv = Math.max(0, Math.min(1, 1 - Math.abs(pos - P[ai]) / (half * 0.85))) * 100
        const mask = `linear-gradient(to top,#000 ${rv - 8}%,transparent ${rv + 8}%)`
        stage = (
            <>
                <div className="pf">
                    {g.bocetos.map((_, i) => (
                        <div key={i} className={`pair${i === ai ? " on" : ""}`}>
                            {sk(i, "pc")}
                            {i === ai && sk(i, "cl", { WebkitMaskImage: mask, maskImage: mask })}
                        </div>
                    ))}
                    <div className="cnt">
                        {look(ai)} · pintado {Math.round(rv)} %
                    </div>
                </div>
                <div className="pfr" ref={area} {...handlers}>
                    <div className="rail" style={{ background: `linear-gradient(90deg,${grad()})` }} />
                    {g.bocetos.map((_, i) => (
                        <span key={i} className={`nb mk${i === ai ? " on" : ""}`} data-i={i} style={{ left: `${x3(P[i])}%` }}>
                            {i + 1}
                        </span>
                    ))}
                    {knob({ left: `${x3(pos)}%` }, "knb")}
                </div>
            </>
        )
    }

    const yaml = g.bocetos.map((b, i) => `    - { foto: "${b.foto}", look: "${b.look}", posicion: ${P[i]} }`).join("\n")
    const copy = () => {
        const done = () => {
            setMsg("Copiado")
            window.setTimeout(() => setMsg(""), 1600)
        }
        navigator.clipboard?.writeText(yaml).then(done, () => setMsg("Selecciona y copia (⌘C)")) ?? setMsg("Selecciona y copia (⌘C)")
    }
    const desc = VIEWS.find((x) => x.v === view)!.desc
    const seg = (v: View, label: string, k: number) => (
        <button key={v} type="button" onClick={() => setView(v)} aria-pressed={view === v} style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 11px", border: "none", borderLeft: k ? `1px solid ${INK}` : "none", background: view === v ? INK : "transparent", color: view === v ? PAPER : INK, cursor: "pointer", whiteSpace: "nowrap" }}>
            {label}
        </button>
    )
    const small: React.CSSProperties = { fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 10px", border: `1px solid ${INK}`, background: "transparent", color: INK, cursor: "pointer" }

    return (
        <Window
            label={`Gama cromática de ${project.title}`}
            title={
                <>
                    Gama cromática <span style={{ color: ASH }}>— {project.title}</span>
                </>
            }
            toolbar={
                <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
                    <div role="group" aria-label="Vista" style={{ display: "flex", border: `1px solid ${INK}`, flexShrink: 0 }}>
                        {VIEWS.map((x, k) => seg(x.v, x.label, k))}
                    </div>
                    {editable && (
                        <label style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: MONO, fontSize: 10, color: ASH, whiteSpace: "nowrap" }}>
                            <input type="checkbox" checked={edit} onChange={(e) => setEdit(e.target.checked)} style={{ accentColor: project.accent }} />
                            COLOCAR BOCETOS
                        </label>
                    )}
                    <span style={{ flex: 1 }} />
                    <Link href={project.link}>
                        <a style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", color: INK, whiteSpace: "nowrap" }}>← Libro</a>
                    </Link>
                </div>
            }
            status={
                <>
                    <span>
                        {N} bocetos · {n - (C[0].color === C[n - 1].color ? 1 : 0)} colores
                    </span>
                    <span className="ag-hide-narrow">Pasa el cursor o arrastra · ← → de look en look</span>
                </>
            }
            bodyStyle={{ background: `radial-gradient(ellipse at 50% 30%, #FFFEFA, var(--ag-side, #ECE9E2))` }}
        >
            <style>{CSS}</style>
            <div className="gm" style={{ ["--gm-mono" as any]: MONO, ["--gm-display" as any]: DISPLAY, ["--gm-ui" as any]: UI, maxWidth: 1040, margin: "0 auto", padding: "22px clamp(14px, 3vw, 28px) 34px" }}>
                <p style={{ margin: "0 0 14px", maxWidth: "70ch", fontSize: 13.5, lineHeight: 1.5, color: "#3B3A38" }}>
                    <span style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 17, fontVariationSettings: opsz(17), color: INK }}>{VIEWS.find((x) => x.v === view)!.label}.</span> {desc}
                </p>
                <div tabIndex={0} onKeyDown={onKey} aria-label="Gama cromática: usa las flechas para recorrerla" className={edit ? "edit" : ""} style={{ position: "relative", outline: "none", touchAction: "pan-y", userSelect: "none", WebkitUserSelect: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 40 }}>
                        <i style={{ width: 26, height: 26, borderRadius: "50%", flex: "none", background: col, boxShadow: "inset 0 0 0 .5px #0003" }} />
                        <div>
                            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                {look(ai)} · {colLabel(P[ai])}
                            </div>
                            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.04em", color: ASH, fontVariantNumeric: "tabular-nums" }}>
                                {Math.round(pos)} % del recorrido · {colLabel(pos)}
                            </div>
                        </div>
                    </div>
                    {stage}
                </div>

                {editable && (
                    <section style={{ marginTop: 26, paddingTop: 18, borderTop: "1px solid var(--ag-fog, #D7D4CD)" }}>
                        <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: ASH, marginBottom: 8 }}>Para pegar en proyecto.md, debajo de «bocetos:»</div>
                        <textarea readOnly value={yaml} spellCheck={false} onFocus={(e) => e.currentTarget.select()} style={{ width: "100%", height: 230, resize: "vertical", border: `1px solid ${INK}`, padding: 12, fontFamily: MONO, fontSize: 11.5, lineHeight: 1.6, background: "#FFFEFA", color: INK }} />
                        <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <button type="button" style={{ ...small, background: INK, color: PAPER }} onClick={copy}>
                                Copiar
                            </button>
                            <button type="button" style={small} onClick={() => setP((q) => q.map((_, i) => Math.round(4 + order.indexOf(i) * (92 / Math.max(1, N - 1)))))}>
                                Repartir por igual
                            </button>
                            <button type="button" style={small} onClick={() => setP(g.bocetos.map((b) => b.pos))}>
                                Deshacer
                            </button>
                            <span style={{ fontFamily: MONO, fontSize: 10, color: ASH }}>{msg}</span>
                        </div>
                    </section>
                )}
            </div>
        </Window>
    )
}
