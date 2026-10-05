// AgSystem — capa de sistema del escritorio de Ana Gil (va una vez en la plantilla, invisible).
// · Modo noche "INK": Visualización → Modo noche (evento "ag:theme") o ⌥⌘N. Invierte la paleta
//   (tinta ↔ papel) sobrescribiendo los tokens de color de Framer y las variables --ag-* de los
//   componentes; el retrato del fondo se oscurece. Se recuerda en localStorage.
// · Salvapantallas: tras 30 s sin actividad (o desde el menú, evento "ag:screensaver") las fotos
//   de Ana pasan a pantalla completa, lentas, con el título en Bodoni. Mover el ratón lo cierra.
// · Icono → portada: al abrir un proyecto desde una foto (evento "ag:open-cover"), la foto crece
//   desde el icono hasta la portada del libro de la página del proyecto.

import * as React from "react"
import { thumb } from "../lib/media"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, AnimatePresence } from "framer-motion"

import { PROJECTS as _PROJECTS } from "../content/generated"
type ArchiveFile = { src: string; name: string }
type ArchiveProject = (typeof _PROJECTS)[number]
const PROJECTS: ArchiveProject[] = _PROJECTS


// ——— Tema ————————————————————————————————————————————————————————————————
const T = (id: string) => `--token-${id}`
const DARK: Record<string, string> = {
    // AG
    [T("af4fc6f1-b3ea-4ad6-a961-bbf8e86ad48f")]: "#F4F2ED", // Ink
    [T("0292d0a9-8133-4a17-8c58-23545033d536")]: "#111111", // Paper
    [T("7a45afc5-50c8-4b1d-90c7-870618397b94")]: "#171716", // Sheet
    [T("603c40dd-84d8-4f2e-a2ff-237a33b1c6c1")]: "#1D1D1B", // Side
    [T("bf91ded1-89cd-4f26-83ca-9dfc9fce8a7e")]: "#34332F", // Fog
    [T("5412eeeb-0ab3-4c60-8f99-c77f823b6bef")]: "#9A968F", // Ash
    [T("b90302bb-1bac-49e4-8f1f-abca6054fc49")]: "#CFCBC3", // Graphite
    [T("ea2a8c23-790c-453d-b6c4-b860d02d3f59")]: "rgba(244, 242, 237, 0.16)", // Rule
    [T("58be7f5b-2e0c-4941-bd7d-9b51f540b74a")]: "rgba(244, 242, 237, 0.08)", // Tint
    // Tokens heredados de la v1
    [T("e7b5df4c-e1db-4a09-a0ec-b80dc03b71fb")]: "#111111", // white
    [T("dfe941ca-154d-4deb-8570-e19b89e9c780")]: "#F4F2ED", // black
    [T("ec41e27c-12f1-4a7d-a799-5990fdccf442")]: "#1D1D1B", // gray-light
    [T("92c644ac-0f62-4880-bfc1-7c03eac7c66a")]: "#9A968F", // gray-dark
    [T("8ce0426f-febe-462a-9207-35bcaa1da4b0")]: "#F4F2ED", // green-forest (ahora tinta: enlaces)
    // Componentes
    "--ag-ink": "#F4F2ED",
    "--ag-paper": "#111111",
    "--ag-sheet": "#171716",
    "--ag-side": "#1D1D1B",
    "--ag-fog": "#34332F",
    "--ag-ash": "#9A968F",
    "--ag-rule": "rgba(244, 242, 237, 0.16)",
    "--ag-graphite": "#CFCBC3",
    "--ag-dock": "rgba(30, 30, 30, 0.45)",
    "--ag-dock-edge": "rgba(255, 255, 255, 0.14)",
    "--ag-paper-90": "rgba(17, 17, 17, 0.86)",
    "--ag-paper-94": "rgba(17, 17, 17, 0.92)",
    "--ag-scrim": "rgba(0, 0, 0, 0.5)",
    "--ag-veil": "rgba(8, 8, 8, 0.58)",
}
const SEL = 'html[data-ag-theme="ink"]'
const THEME_CSS =
    `${SEL}, ${SEL} body, ${SEL} #main, ${SEL} [data-framer-root] {` +
    Object.entries(DARK).map(([k, v]) => `${k}: ${v} !important;`).join("") +
    `} ${SEL} { color-scheme: dark; background: #111111; } ${SEL} body { background: #111111; }` +
    // Las fotos no se invierten; sólo bajan un punto para no deslumbrar.
    ` ${SEL} img { filter: brightness(0.94); }` +
    // Transición suave sólo durante el cambio de tema
    ` html.ag-theme-switching *, html.ag-theme-switching *::before, html.ag-theme-switching *::after {` +
    ` transition: background-color .55s ease, color .55s ease, border-color .55s ease, fill .55s ease !important; }`

const KEY = "ag-theme"
type Theme = "paper" | "ink"

function readTheme(): Theme {
    try {
        return localStorage.getItem(KEY) === "ink" ? "ink" : "paper"
    } catch {
        return "paper"
    }
}

function applyTheme(t: Theme, animate: boolean) {
    const html = document.documentElement
    if (animate) {
        html.classList.add("ag-theme-switching")
        window.setTimeout(() => html.classList.remove("ag-theme-switching"), 700)
    }
    if (t === "ink") html.dataset.agTheme = "ink"
    else delete html.dataset.agTheme
    try {
        localStorage.setItem(KEY, t)
    } catch {}
    window.dispatchEvent(new CustomEvent("ag:theme-changed", { detail: { theme: t } }))
}

function useThemeController(enabled: boolean) {
    React.useEffect(() => {
        if (!enabled) return
        if (!document.getElementById("ag-theme-css")) {
            const s = document.createElement("style")
            s.id = "ag-theme-css"
            s.textContent = THEME_CSS + PIN_CSS
            document.head.appendChild(s)
        }
        applyTheme(readTheme(), false)
        const onTheme = (e: Event) => {
            const mode = (e as CustomEvent).detail?.mode
            const cur: Theme = document.documentElement.dataset.agTheme === "ink" ? "ink" : "paper"
            const next: Theme = mode === "ink" || mode === "paper" ? mode : cur === "ink" ? "paper" : "ink"
            applyTheme(next, true)
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.altKey && (e.metaKey || e.ctrlKey) && e.code === "KeyN") {
                e.preventDefault()
                onTheme(new CustomEvent("ag:theme"))
            }
        }
        window.addEventListener("ag:theme", onTheme)
        window.addEventListener("keydown", onKey)
        return () => {
            window.removeEventListener("ag:theme", onTheme)
            window.removeEventListener("keydown", onKey)
        }
    }, [enabled])
}

// ——— Cursor de alfiler sobre las fotos (solo ratón) ————————————————————————————
const PIN = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"><line x1="4" y1="22" x2="16" y2="10" stroke="#111" stroke-width="1.6" stroke-linecap="round"/><circle cx="18.5" cy="7.5" r="5" fill="#A95A45" stroke="#111" stroke-width="1"/><circle cx="17" cy="6" r="1.4" fill="#fff" opacity=".7"/></svg>')}") 3 23, pointer`
const PIN_CSS = `@media (hover: hover) and (pointer: fine){ a img, button img { cursor: ${PIN}; } }`

// ——— Sonidos del sistema (opcionales, sintetizados: sin archivos) ————————————————
let audio: AudioContext | null = null
function tick(kind: "click" | "open" = "click") {
    try {
        audio = audio || new (window.AudioContext || (window as any).webkitAudioContext)()
        const t = audio.currentTime
        const len = kind === "open" ? 0.09 : 0.035
        const buf = audio.createBuffer(1, Math.floor(audio.sampleRate * len), audio.sampleRate)
        const d = buf.getChannelData(0)
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, kind === "open" ? 2 : 4)
        const src = audio.createBufferSource()
        src.buffer = buf
        const f = audio.createBiquadFilter()
        f.type = "bandpass"
        f.frequency.value = kind === "open" ? 900 : 2400
        f.Q.value = 1.2
        const g = audio.createGain()
        g.gain.setValueAtTime(kind === "open" ? 0.12 : 0.08, t)
        src.connect(f).connect(g).connect(audio.destination)
        src.start(t)
    } catch {}
}
function useSounds(enabled: boolean) {
    React.useEffect(() => {
        if (!enabled) return
        let on = false
        try {
            on = localStorage.getItem("ag-sound") === "on"
        } catch {}
        const onClick = (e: Event) => {
            if (!on) return
            const el = (e.target as HTMLElement).closest("a,button,[role=button],[role=menuitem]")
            if (el) tick(el.closest('nav[aria-label="Dock"]') ? "open" : "click")
        }
        const onToggle = () => {
            on = !on
            try {
                localStorage.setItem("ag-sound", on ? "on" : "off")
            } catch {}
            if (on) tick("open")
            window.dispatchEvent(new CustomEvent("ag:sound-changed", { detail: { on } }))
        }
        window.addEventListener("click", onClick, true)
        window.addEventListener("ag:sound", onToggle)
        return () => {
            window.removeEventListener("click", onClick, true)
            window.removeEventListener("ag:sound", onToggle)
        }
    }, [enabled])
}


// ═══════════════════════════ COSTURA ═══════════════════════════════════════════
const THREAD = "#B23A2B"
const fineHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches
const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
const isInk = () => document.documentElement.dataset.agTheme === "ink"

// 1 · Pespunte: al abrir una ventana, una aguja la recorre cosiendo su borde
function stitchWindow(el: HTMLElement) {
    const r = el.getBoundingClientRect()
    if (r.width < 200 || r.height < 120) return
    const ns = "http://www.w3.org/2000/svg"
    const svg = document.createElementNS(ns, "svg")
    svg.setAttribute("width", String(r.width))
    svg.setAttribute("height", String(r.height))
    Object.assign(svg.style, { position: "absolute", left: "0", top: "0", pointerEvents: "none", zIndex: "50", overflow: "visible" } as CSSStyleDeclaration)
    const inset = 5
    const d = `M ${inset} ${inset} H ${r.width - inset} V ${r.height - inset} H ${inset} Z`
    const id = "agst" + Math.random().toString(36).slice(2, 8)
    svg.innerHTML = `<defs><mask id="${id}"><path d="${d}" fill="none" stroke="#fff" stroke-width="8" class="m"/></mask></defs>
        <path d="${d}" fill="none" stroke="${THREAD}" stroke-width="1.3" stroke-dasharray="6 4" mask="url(#${id})"/>`
    const needle = document.createElementNS(ns, "g")
    needle.innerHTML = `<line x1="0" y1="-16" x2="0" y2="2" stroke="#8C8C88" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="0" cy="-13" rx="1" ry="2.2" fill="none" stroke="#5C5C58" stroke-width=".8"/>`
    svg.appendChild(needle)
    const pos = getComputedStyle(el).position
    if (pos === "static") el.style.position = "relative"
    el.appendChild(svg)
    const m = svg.querySelector(".m") as SVGPathElement
    const len = m.getTotalLength()
    m.style.strokeDasharray = `${len}`
    m.style.strokeDashoffset = `${len}`
    const dur = Math.min(1600, 600 + len * 0.25)
    const t0 = performance.now()
    let raf = 0
    const step = (now: number) => {
        const k = Math.min(1, (now - t0) / dur)
        const e = 1 - Math.pow(1 - k, 2)
        m.style.strokeDashoffset = `${len * (1 - e)}`
        const p = m.getPointAtLength(len * e)
        const bob = Math.sin(now / 28) * 3
        needle.setAttribute("transform", `translate(${p.x} ${p.y + bob})`)
        if (k < 1) raf = requestAnimationFrame(step)
        else {
            needle.remove()
            svg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 900, delay: 900, fill: "forwards" }).onfinish = () => svg.remove()
        }
    }
    raf = requestAnimationFrame(step)
}
function useWindowStitch(enabled: boolean) {
    React.useEffect(() => {
        if (!enabled || reducedMotion()) return
        const seen = new WeakSet<Element>()
        const scan = () =>
            document.querySelectorAll<HTMLElement>('[data-framer-name="Ventana"], [data-ag-window]').forEach((el) => {
                if (seen.has(el)) return
                seen.add(el)
                // Si está el arranque, espera a que termine para que se vea la costura
                const go = () => (document.querySelector("[data-ag-boot]") ? window.setTimeout(go, 250) : window.setTimeout(() => stitchWindow(el), 380))
                go()
            })
        // pequeño margen para que el arranque (si lo hay) ya esté en pantalla
        const first = window.setTimeout(scan, 150)
        const mo = new MutationObserver(() => scan())
        window.setTimeout(() => mo.observe(document.body, { childList: true, subtree: true }), 150)
        return () => {
            window.clearTimeout(first)
            mo.disconnect()
        }
    }, [enabled])
}

// 2 · Cuentahílos: lupa de sastre sobre las fotos grandes de los proyectos
function useLoupe(enabled: boolean) {
    React.useEffect(() => {
        if (!enabled || !fineHover()) return
        const Z = 2.4
        const R = 84
        const lens = document.createElement("div")
        Object.assign(lens.style, { position: "fixed", left: "0", top: "0", width: `${R * 2}px`, height: `${R * 2}px`, borderRadius: "50%", zIndex: "2900", pointerEvents: "none", opacity: "0", transition: "opacity .18s", boxShadow: "0 0 0 2px #111, 0 0 0 6px rgba(244,242,237,.9), 0 0 0 7px #111, 0 18px 40px rgba(0,0,0,.35)", backgroundRepeat: "no-repeat", backgroundColor: "#ddd" } as CSSStyleDeclaration)
        lens.innerHTML = `<svg width="${R * 2}" height="${R * 2}" viewBox="0 0 ${R * 2} ${R * 2}" style="position:absolute;inset:0">
            <g stroke="rgba(17,17,17,.55)" stroke-width="1">
              <line x1="${R}" y1="${R - 14}" x2="${R}" y2="${R + 14}"/><line x1="${R - 14}" y1="${R}" x2="${R + 14}" y2="${R}"/>
              ${Array.from({ length: 13 }, (_, i) => { const x = R - 60 + i * 10; return `<line x1="${x}" y1="${R * 2 - 22}" x2="${x}" y2="${R * 2 - (i % 5 === 0 ? 34 : 28)}"/>` }).join("")}
            </g></svg>
            <span style="position:absolute;left:50%;top:${R * 2 + 12}px;transform:translateX(-50%);white-space:nowrap;font:500 9px 'IBM Plex Mono',monospace;letter-spacing:.1em;color:#111;background:rgba(244,242,237,.92);padding:2px 6px">CUENTAHÍLOS ×${Z}</span>`
        document.body.appendChild(lens)
        let current: HTMLImageElement | null = null
        const onMove = (e: PointerEvent) => {
            const okPage = /^\/(projects\/[^/]+|fotos)/.test(location.pathname)
            const img = okPage ? ((e.target as HTMLElement).closest("img") as HTMLImageElement | null) : null
            const r = img?.getBoundingClientRect()
            if (!img || !r || r.width < 260 || img.closest('nav[aria-label="Dock"]')) {
                if (current) lens.style.opacity = "0"
                current = null
                return
            }
            if (current !== img) {
                current = img
                lens.style.backgroundImage = `url("${img.currentSrc || img.src}")`
            }
            const nw = img.naturalWidth || r.width
            const nh = img.naturalHeight || r.height
            const fit = getComputedStyle(img).objectFit
            const sc = fit === "cover" ? Math.max(r.width / nw, r.height / nh) : fit === "contain" ? Math.min(r.width / nw, r.height / nh) : r.width / nw
            const dw = nw * sc
            const dh = nh * sc
            const ox = (r.width - dw) / 2
            const oy = (r.height - dh) / 2
            const rx = e.clientX - r.left - ox
            const ry = e.clientY - r.top - oy
            lens.style.backgroundSize = `${dw * Z}px ${dh * Z}px`
            lens.style.backgroundPosition = `${-(rx * Z - R)}px ${-(ry * Z - R)}px`
            lens.style.transform = `translate(${e.clientX - R}px, ${e.clientY - R}px)`
            lens.style.opacity = "1"
        }
        window.addEventListener("pointermove", onMove, { passive: true })
        return () => {
            window.removeEventListener("pointermove", onMove)
            lens.remove()
        }
    }, [enabled])
}

// ——— Icono → portada ——————————————————————————————————————————————————
// Se hace con DOM directo (no React) para que sobreviva al cambio de página.
function flyToCover(src: string, from: { x: number; y: number; w: number; h: number }) {
    ;(window as any).__agCoverAt = performance.now()
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    document.getElementById("ag-cover-flight")?.remove()
    const el = document.createElement("img")
    el.id = "ag-cover-flight"
    el.src = src
    el.alt = ""
    Object.assign(el.style, {
        position: "fixed",
        left: "0px",
        top: "0px",
        width: `${from.w}px`,
        height: `${from.h}px`,
        transform: `translate(${from.x}px, ${from.y}px)`,
        objectFit: "cover",
        zIndex: "3000",
        pointerEvents: "none",
        boxShadow: "0 30px 80px rgba(0,0,0,.25)",
        willChange: "transform, width, height",
    } as CSSStyleDeclaration)
    document.body.appendChild(el)

    const ease = "cubic-bezier(0.22, 1, 0.36, 1)"
    // 1) Crece hacia el centro de la pantalla con proporción de portada mientras carga la página
    const vw = window.innerWidth
    const vh = window.innerHeight
    const h1 = Math.min(vh * 0.72, 760)
    const w1 = Math.min(h1 * 0.78, vw * 0.86)
    const mid = { x: (vw - w1) / 2, y: (vh - h1) / 2 + 14, w: w1, h: h1 }
    const frame = (r: typeof from) => ({ transform: `translate(${r.x}px, ${r.y}px)`, width: `${r.w}px`, height: `${r.h}px` })
    el.animate([frame(from), frame(mid)], { duration: 520, easing: ease, fill: "forwards" })

    // 2) Cuando aparece la portada del libro, se posa sobre ella y se funde
    const started = performance.now()
    const settle = () => {
        const target = document.querySelector('[data-framer-name="Foto principal"]') as HTMLElement | null
        const r = target?.getBoundingClientRect()
        if (r && r.width > 40 && r.height > 40 && r.top < vh) {
            const to = { x: r.left, y: r.top, w: r.width, h: r.height }
            const a = el.animate([frame(mid), frame(to)], { duration: 560, easing: ease, fill: "forwards" })
            a.onfinish = () => {
                const f = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, easing: "ease-out", fill: "forwards" })
                f.onfinish = () => el.remove()
            }
            return
        }
        if (performance.now() - started > 2600) {
            const f = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" })
            f.onfinish = () => el.remove()
            return
        }
        window.setTimeout(settle, 60)
    }
    window.setTimeout(settle, 560)
}

function useCoverFlight(enabled: boolean) {
    React.useEffect(() => {
        if (!enabled) return
        const on = (e: Event) => {
            const d = (e as CustomEvent).detail
            if (d?.src && d?.rect) flyToCover(d.src, d.rect)
        }
        window.addEventListener("ag:open-cover", on)
        return () => window.removeEventListener("ag:open-cover", on)
    }, [enabled])
}

// ——— Salvapantallas ——————————————————————————————————————————————————————
type Slide = { src: string; title: string; name: string; year: number; accent: string }

function buildSlides(): Slide[] {
    const out: Slide[] = []
    for (const p of PROJECTS) {
        const picks = p.files.slice(0, 4)
        for (const f of picks) out.push({ src: f.src, title: p.title, name: f.name, year: p.year, accent: p.accent })
    }
    // Barajado estable (intercala proyectos)
    return out.sort((a, b) => (hash(a.src) % 997) - (hash(b.src) % 997))
}
function hash(s: string) {
    let h = 0
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
    return Math.abs(h)
}
const big = (src: string) => thumb(src, 2048)

function Screensaver({ onClose }: { onClose: () => void }) {
    const slides = React.useMemo(buildSlides, [])
    const [i, setI] = React.useState(0)
    const [now, setNow] = React.useState(() => new Date())
    const DUR = 7000

    React.useEffect(() => {
        const id = window.setInterval(() => setI((n) => (n + 1) % Math.max(slides.length, 1)), DUR)
        const clock = window.setInterval(() => setNow(new Date()), 10000)
        return () => {
            window.clearInterval(id)
            window.clearInterval(clock)
        }
    }, [slides.length])

    // Precarga la siguiente
    React.useEffect(() => {
        const n = slides[(i + 1) % slides.length]
        if (n) new Image().src = big(n.src)
    }, [i, slides])

    // Cualquier gesto devuelve al escritorio (con un pequeño margen para no cerrarse solo)
    React.useEffect(() => {
        const t0 = performance.now()
        let origin: { x: number; y: number } | null = null
        const close = () => performance.now() - t0 > 500 && onClose()
        const move = (e: PointerEvent) => {
            if (!origin) origin = { x: e.clientX, y: e.clientY }
            else if (Math.hypot(e.clientX - origin.x, e.clientY - origin.y) > 8) close()
        }
        window.addEventListener("pointermove", move)
        window.addEventListener("pointerdown", close)
        window.addEventListener("keydown", close)
        window.addEventListener("wheel", close)
        window.addEventListener("touchstart", close)
        return () => {
            window.removeEventListener("pointermove", move)
            window.removeEventListener("pointerdown", close)
            window.removeEventListener("keydown", close)
            window.removeEventListener("wheel", close)
            window.removeEventListener("touchstart", close)
        }
    }, [onClose])

    const s = slides[i]
    if (!s) return null
    const time = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(now)
    const k = i % 2 === 0

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45 } }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            aria-hidden
            style={{ position: "fixed", inset: 0, zIndex: 4000, background: "#0B0B0B", overflow: "hidden", cursor: "none" }}
        >
            <AnimatePresence>
                <motion.img
                    key={s.src}
                    src={big(s.src)}
                    alt=""
                    initial={{ opacity: 0, scale: k ? 1.02 : 1.1, x: k ? -12 : 12 }}
                    animate={{ opacity: 1, scale: k ? 1.1 : 1.02, x: k ? 12 : -12 }}
                    exit={{ opacity: 0 }}
                    transition={{ opacity: { duration: 1.8, ease: "easeInOut" }, scale: { duration: DUR / 1000 + 2, ease: "linear" }, x: { duration: DUR / 1000 + 2, ease: "linear" } }}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.82)" }}
                />
            </AnimatePresence>
            {/* Viñeta para que el título respire */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.28) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)" }} />

            <div style={{ position: "absolute", top: 22, left: 28, right: 28, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 11, letterSpacing: "0.08em", color: "rgba(244,242,237,.78)", textTransform: "uppercase" }}>
                <span>Ana Gil — Archivo en reposo</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{time}</span>
            </div>

            <div style={{ position: "absolute", left: 28, right: 28, bottom: 26, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, color: "#F4F2ED" }}>
                <div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={s.title}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                            style={{ fontFamily: DISPLAY, fontVariationSettings: '"opsz" 96', fontSize: "clamp(56px, 11vw, 168px)", lineHeight: 1, paddingBottom: "0.06em", letterSpacing: "-0.02em" }}
                        >
                            {typeset(s.title)}
                        </motion.div>
                    </AnimatePresence>
                    <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em" }}>
                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: s.accent, boxShadow: `0 0 14px ${s.accent}` }} />
                        <span>{s.name}</span>
                        <span style={{ opacity: 0.6 }}>· {s.year}</span>
                    </div>
                </div>
                <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.08em", color: "rgba(244,242,237,.7)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    Mueve el ratón para volver
                </span>
            </div>
            {/* Barra de progreso del pase */}
            <motion.div
                key={`bar-${i}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: DUR / 1000, ease: "linear" }}
                style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: s.accent, transformOrigin: "0 50%" }}
            />
        </motion.div>
    )
}

function useIdle(ms: number, enabled: boolean, onIdle: () => void) {
    React.useEffect(() => {
        if (!enabled || ms <= 0) return
        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
        if (!fine) return
        let t = 0
        const reset = () => {
            window.clearTimeout(t)
            if (document.visibilityState === "visible") t = window.setTimeout(onIdle, ms)
        }
        const evs = ["pointermove", "pointerdown", "keydown", "wheel", "scroll", "touchstart", "visibilitychange"]
        evs.forEach((e) => window.addEventListener(e, reset, { passive: true, capture: true }))
        reset()
        return () => {
            window.clearTimeout(t)
            evs.forEach((e) => window.removeEventListener(e, reset, { capture: true } as any))
        }
    }, [ms, enabled, onIdle])
}

const DISPLAY = `"AG Bodoni", "Bodoni Moda", "Didot", Georgia, serif`
// Tamaño óptico de la Bodoni ajustado al tamaño real (con opsz 96 en tamaños medianos los trazos finos desaparecen)
const opsz = (px: number) => `"opsz" ${Math.max(6, Math.min(96, Math.round(px)))}`

// Bodoni Moda variable (con eje de tamaño óptico) bajo un nombre propio, para no depender de la versión que cargue Framer
const AG_BODONI_CSS = `@font-face{font-family:"AG Bodoni";font-style:normal;font-weight:400 900;font-display:swap;src:url(/fonts/bodoni-moda.woff2) format("woff2")}@font-face{font-family:"AG Bodoni";font-style:italic;font-weight:400 900;font-display:swap;src:url(/fonts/bodoni-moda-italic.woff2) format("woff2")}`
// La Bodoni Moda apenas dibuja el guion bajo: lo componemos en mono (encaja con 404:NOT FOUND_ y EX_CORPO)
function typeset(t: string): React.ReactNode {
    if (!t || !t.includes("_")) return t
    return t.split(/(_)/).map((part, i) =>
        part === "_" ? (
            <span key={i} style={{ fontFamily: `"IBM Plex Mono", Menlo, monospace`, fontWeight: 500, fontVariationSettings: "normal", letterSpacing: 0 }}>
                _
            </span>
        ) : (
            part
        )
    )
}

function useAgBodoni() {
    React.useEffect(() => {
        if (typeof document === "undefined" || document.getElementById("ag-bodoni-face")) return
        const s = document.createElement("style")
        s.id = "ag-bodoni-face"
        s.textContent = AG_BODONI_CSS
        document.head.appendChild(s)
    }, [])
}
const MONO = `"IBM Plex Mono", Menlo, monospace`
const FONTS_HREF = "" // las fuentes se sirven desde /fonts (ver styles.css)

interface Props {
    idleSeconds: number
    screensaver: boolean
    nightMode: boolean
    coverTransition: boolean
    stitches: boolean
    loupe: boolean
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicWidth 40
 * @framerIntrinsicHeight 40
 */
export default function AgSystem(props: Props) {
    useAgBodoni()
    const { idleSeconds, screensaver, nightMode, coverTransition, style } = props
    const live = RenderTarget.current() === RenderTarget.preview || RenderTarget.current() === RenderTarget.export
    const [saver, setSaver] = React.useState(false)

    useThemeController(live && nightMode)
    useCoverFlight(live && coverTransition)
    useSounds(live)
    useWindowStitch(live && props.stitches !== false)
    useLoupe(live && props.loupe !== false)

    const start = React.useCallback(() => {
        if (document.querySelector("[data-ag-boot]")) return
        setSaver(true)
    }, [])
    const stop = React.useCallback(() => setSaver(false), [])
    useIdle(idleSeconds * 1000, live && screensaver && !saver, start)

    React.useEffect(() => {
        if (!live) return
        if (FONTS_HREF && !document.querySelector("link[data-ag-system-fonts]")) {
            const l = document.createElement("link")
            l.rel = "stylesheet"
            l.href = FONTS_HREF
            l.setAttribute("data-ag-system-fonts", "")
            document.head.appendChild(l)
        }
        const on = () => setSaver(true)
        window.addEventListener("ag:screensaver", on)
        return () => window.removeEventListener("ag:screensaver", on)
    }, [live])

    if (!live) {
        return (
            <div style={{ ...style, width: 40, height: 40, display: "grid", placeItems: "center", border: "1px dashed #918E88", fontFamily: MONO, fontSize: 9, color: "#918E88" }}>
                SYS
            </div>
        )
    }
    return <AnimatePresence>{saver && <Screensaver onClose={stop} />}</AnimatePresence>
}

AgSystem.defaultProps = { idleSeconds: 30, screensaver: true, nightMode: true, coverTransition: true, stitches: true, loupe: true }

addPropertyControls(AgSystem, {
    idleSeconds: { type: ControlType.Number, title: "Reposo (s)", min: 10, max: 300, step: 5, defaultValue: 30 },
    screensaver: { type: ControlType.Boolean, title: "Salvapantallas", defaultValue: true },
    nightMode: { type: ControlType.Boolean, title: "Modo noche", defaultValue: true },
    coverTransition: { type: ControlType.Boolean, title: "Icono → portada", defaultValue: true },
    stitches: { type: ControlType.Boolean, title: "Pespuntes", defaultValue: true },
    loupe: { type: ControlType.Boolean, title: "Cuentahílos", defaultValue: true },
})
