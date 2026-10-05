// App "Proyectos" del iPhone: lista de proyectos y, al tocar uno, su libro (página a página).
import * as React from "react"
import { AnimatePresence, motion, motionValue, useTransform, animate, type MotionValue } from "framer-motion"
import { Link } from "framer"
import { PROJECTS, type Project } from "../content/generated"
import { thumb, blur } from "../lib/media"
import { buildPages, typeset, type PageDef } from "../pages/project/pages"
import { NavScroll, BackButton } from "./PhoneApp"
import { SF } from "./PhoneHome"
import { INK, ASH, SHEET, SIDE, MONO, DISPLAY, PAPER, opsz } from "../shell/Window"

// ——— Lista ————————————————————————————————————————————————————————————————
function ProjectList() {
    return (
        <NavScroll title="Proyectos" back={{ href: "/", label: "Inicio" }}>
            <p style={{ margin: "0 18px 22px", fontFamily: SF, fontSize: 15, lineHeight: 1.45, color: ASH }}>Una selección de trabajos sobre trauma, memoria y transformación. ESD Madrid, 2025–26.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 34, padding: "0 18px" }}>
                {PROJECTS.map((p) => (
                    <Link key={p.slug} href={p.link}>
                        <motion.a whileTap={{ scale: 0.98 }} style={{ display: "block", color: INK, textDecoration: "none" }}>
                            <div style={{ position: "relative", aspectRatio: "4 / 5", overflow: "hidden", background: `url(${blur(p.cover)}) center / cover` }}>
                                <img src={thumb(p.cover, 900)} alt={p.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: p.accent }} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: ASH }}>
                                <span>Project / {String(p.number).padStart(2, "0")}</span>
                                <span>
                                    {p.category} · {p.year}
                                </span>
                            </div>
                            <div style={{ fontFamily: DISPLAY, fontSize: 36, lineHeight: 1, letterSpacing: "-0.015em", marginTop: 6, fontVariationSettings: opsz(36) }}>{typeset(p.title)}</div>
                            <p style={{ margin: "8px 0 0", fontFamily: SF, fontSize: 15, lineHeight: 1.45, color: "#3B3A38" }}>{p.short}</p>
                        </motion.a>
                    </Link>
                ))}
            </div>
        </NavScroll>
    )
}

// ——— Libro página a página ———————————————————————————————————————————————————
const RATIO = 0.72

function Page({ def, n, w, h, rot, z, near }: { def: PageDef; n: number; w: number; h: number; rot: MotionValue<number>; z: number; near: boolean }) {
    const shade = useTransform(rot, [0, -90], [0, 0.35])
    const vis = useTransform(rot, (r) => (r < -178 ? "hidden" : "visible"))
    const face: React.CSSProperties = { position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", overflow: "hidden" }
    return (
        <motion.div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transformOrigin: "0% 50%", transformStyle: "preserve-3d", rotateY: rot, zIndex: z, visibility: vis as any }}>
            <div style={{ ...face, boxShadow: "0 10px 30px rgba(0,0,0,.18)" }}>
                {near ? def.render(w, n % 2 ? "r" : "l", n) : <div style={{ position: "absolute", inset: 0, background: PAPER }} />}
                <motion.div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,.45), rgba(0,0,0,.1))", opacity: shade, pointerEvents: "none" }} />
            </div>
            <div style={{ ...face, transform: "rotateY(180deg)", background: "#EFEDE7" }} />
        </motion.div>
    )
}

function PhoneBook({ project }: { project: Project }) {
    const pages = React.useMemo(() => buildPages(project), [project])
    const N = pages.length
    const rots = React.useMemo(() => pages.map(() => motionValue(0)), [pages])
    const [cur, setCur] = React.useState(0)
    const curRef = React.useRef(0)
    curRef.current = cur
    const stage = React.useRef<HTMLDivElement>(null)
    const [box, setBox] = React.useState({ w: 360, h: 640 })

    React.useLayoutEffect(() => {
        const el = stage.current
        if (!el) return
        const u = () => setBox({ w: el.clientWidth, h: el.clientHeight })
        u()
        const ro = new ResizeObserver(u)
        ro.observe(el)
        return () => ro.disconnect()
    }, [])
    const w = Math.min(box.w - 28, (box.h - 12) * RATIO)
    const h = w / RATIO

    const go = (to: number) => {
        to = Math.max(0, Math.min(N - 1, to))
        const from = curRef.current
        if (to === from) return
        if (to > from) for (let i = from; i < to; i++) animate(rots[i], -180, { duration: 0.7, ease: [0.3, 0.1, 0.2, 1], delay: (i - from) * 0.06 })
        else for (let i = from - 1; i >= to; i--) animate(rots[i], 0, { duration: 0.7, ease: [0.3, 0.1, 0.2, 1], delay: (from - 1 - i) * 0.06 })
        setCur(to)
    }

    // Deslizar con el dedo: la página sigue al dedo y se pasa (o vuelve) al soltar
    const d = React.useRef<{ x: number; y: number; leaf: number; dir: 1 | -1; on: boolean; t: number } | null>(null)
    const onPD = (e: React.PointerEvent) => {
        if ((e.target as HTMLElement).closest("a,button")) return
        d.current = { x: e.clientX, y: e.clientY, leaf: -1, dir: 1, on: false, t: performance.now() }
    }
    const onPM = (e: React.PointerEvent) => {
        const s = d.current
        if (!s) return
        const dx = e.clientX - s.x
        if (!s.on) {
            if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(e.clientY - s.y)) return
            s.dir = dx < 0 ? 1 : -1
            s.leaf = s.dir === 1 ? curRef.current : curRef.current - 1
            if (s.leaf < 0 || s.leaf >= N - 1) {
                d.current = null
                return
            }
            s.on = true
            ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
        }
        const k = Math.max(0, Math.min(1, Math.abs(dx) / (w * 0.95)))
        rots[s.leaf].set(s.dir === 1 ? -180 * k : -180 * (1 - k))
    }
    const onPU = (e: React.PointerEvent) => {
        const s = d.current
        d.current = null
        if (!s) return
        if (!s.on) {
            // toque: mitad derecha avanza, izquierda retrocede
            const r = stage.current!.getBoundingClientRect()
            go(curRef.current + (e.clientX > r.left + r.width / 2 ? 1 : -1))
            return
        }
        const v = rots[s.leaf].get()
        const fast = performance.now() - s.t < 280
        const done = s.dir === 1 ? v < -60 || fast : v > -120 || fast
        if (done) setCur(curRef.current + s.dir)
        animate(rots[s.leaf], s.dir === 1 ? (done ? -180 : 0) : done ? 0 : -180, { duration: 0.42, ease: [0.2, 0.8, 0.3, 1] })
    }

    const idx = PROJECTS.findIndex((p) => p.slug === project.slug)
    return (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: `radial-gradient(ellipse at 50% 35%, ${PAPER}, ${SIDE})` }}>
            <header style={{ paddingTop: "env(safe-area-inset-top, 0px)", flexShrink: 0 }}>
                <div style={{ height: 46, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px" }}>
                    <BackButton href="/projects" label="Proyectos" />
                    <span style={{ display: "flex", gap: 6, paddingRight: 10 }}>
                        <Link href={`${project.link}/moodboard`}>
                            <a style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.08em", color: INK, border: `1px solid ${INK}`, padding: "4px 7px", textDecoration: "none" }}>MOODBOARD</a>
                        </Link>
                        {project.probador.length > 0 && (
                            <Link href={`${project.link}/probador`}>
                                <a style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.08em", color: INK, border: `1px solid ${INK}`, padding: "4px 7px", textDecoration: "none" }}>PROBADOR</a>
                            </Link>
                        )}
                    </span>
                </div>
            </header>
            <div ref={stage} onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU} onPointerCancel={onPU} style={{ flex: 1, minHeight: 0, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", touchAction: "pan-y", userSelect: "none" }}>
                <div style={{ position: "relative", width: w, height: h, perspective: 1500, perspectiveOrigin: "0% 50%" }}>
                    {pages.map((pg, i) => (
                        <Page key={pg.key} def={pg} n={i + 1} w={w} h={h} rot={rots[i]} z={N - i} near={Math.abs(i - cur) <= 2} />
                    ))}
                </div>
            </div>
            <footer style={{ flexShrink: 0, padding: "8px 22px calc(env(safe-area-inset-bottom, 0px) + 30px)" }}>
                <div style={{ height: 2, background: "rgba(17,17,17,.12)", position: "relative" }}>
                    <motion.div animate={{ width: `${((cur + 1) / N) * 100}%` }} transition={{ duration: 0.4 }} style={{ position: "absolute", left: 0, top: 0, bottom: 0, background: project.accent }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: ASH }}>
                    <span>{pages[cur]?.label}</span>
                    <span>
                        {cur + 1} / {N}
                    </span>
                </div>
            </footer>
        </div>
    )
}

// ——— Pila con transición "push" de iOS ————————————————————————————————————————
export default function PhoneProjects({ path }: { path: string }) {
    const m = path.match(/^\/projects\/([^/]+)/)
    const project = m ? PROJECTS.find((p) => p.slug === m[1]) : undefined
    const key = project ? project.slug : "list"
    return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: SHEET }}>
            <AnimatePresence initial={false} custom={!!project}>
                <motion.div
                    key={key}
                    custom={!!project}
                    variants={{
                        enter: (deeper: boolean) => ({ x: deeper ? "100%" : "-30%", opacity: deeper ? 1 : 0.6 }),
                        center: { x: 0, opacity: 1 },
                        exit: (deeper: boolean) => ({ x: deeper ? "-30%" : "100%", opacity: deeper ? 0.6 : 1 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 320, damping: 36 }}
                    style={{ position: "absolute", inset: 0, zIndex: project ? 2 : 1, boxShadow: project ? "-10px 0 30px rgba(0,0,0,.12)" : undefined }}
                >
                    {project ? <PhoneBook project={project} /> : <ProjectList />}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
