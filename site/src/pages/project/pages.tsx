// Páginas del libro de cada proyecto, generadas a partir de content/proyectos/<slug>/proyecto.md.
// Portada · ficha · cita · concepto · técnica · fotos · proceso · siguiente proyecto · contraportada.
import * as React from "react"
import { Link } from "framer"
import { PROJECTS, type Project } from "../../content/generated"
import { imgInfo, thumb, srcSet, blur } from "../../lib/media"
import { INK, ASH, SHEET, SIDE, MONO, UI, DISPLAY, opsz } from "../../shell/Window"

export type PageKind = "cover" | "ficha" | "cita" | "text" | "photo" | "proceso" | "next" | "blank" | "back"
export type PageDef = { kind: PageKind; key: string; label: string; thumb?: string; render: (pw: number, side: "l" | "r", n: number) => React.ReactNode }

export function typeset(t: string): React.ReactNode {
    if (!t || !t.includes("_")) return t
    return t.split(/(_)/).map((part, i) => (part === "_" ? <span key={i} style={{ fontFamily: MONO, fontWeight: 500, fontVariationSettings: "normal" }}>_</span> : part))
}

const words = (html: string) => html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length
const pad2 = (n: number) => String(n).padStart(2, "0")

// ——— Piezas comunes ————————————————————————————————————————————————
function Folio({ p, n, side, light }: { p: Project; n: number; side: "l" | "r"; light?: boolean }) {
    return (
        <div style={{ position: "absolute", left: "7%", right: "7%", bottom: "3.2%", display: "flex", justifyContent: side === "l" ? "flex-start" : "flex-end", gap: 14, fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.1em", textTransform: "uppercase", color: light ? "rgba(255,255,255,.8)" : ASH, pointerEvents: "none" }}>
            {side === "l" ? (
                <>
                    <span>{pad2(n)}</span>
                    <span>{p.title}</span>
                </>
            ) : (
                <>
                    <span>Ana Gil · Portfolio 2026</span>
                    <span>{pad2(n)}</span>
                </>
            )}
        </div>
    )
}

function Running({ children, accent }: { children: React.ReactNode; accent: string }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: ASH }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} />
            {children}
        </div>
    )
}

function Img({ src, w, alt, style, fit = "cover" }: { src: string; w: number; alt: string; style?: React.CSSProperties; fit?: "cover" | "contain" }) {
    const b = blur(src)
    return (
        <img
            src={thumb(src, w)}
            srcSet={srcSet(src)}
            sizes={`${Math.round(w / (window.devicePixelRatio || 1))}px`}
            alt={alt}
            draggable={false}
            decoding="async"
            style={{ display: "block", width: "100%", height: "100%", objectFit: fit, backgroundImage: b && fit === "cover" ? `url(${b})` : undefined, backgroundSize: "cover", ...style }}
        />
    )
}

const pageBase: React.CSSProperties = { position: "absolute", inset: 0, background: SHEET, color: INK, fontFamily: UI, overflow: "hidden" }

// ——— Constructor ————————————————————————————————————————————————————
export function buildPages(p: Project): PageDef[] {
    const idx = PROJECTS.findIndex((x) => x.slug === p.slug)
    const next = PROJECTS[(idx + 1) % PROJECTS.length]
    const photos = p.files.filter((f) => f.src !== p.cover)
    let photoI = 0
    const takePhoto = () => photos[photoI++]
    const pages: PageDef[] = []

    // 1 · Portada (página derecha, libro cerrado)
    pages.push({
        kind: "cover",
        key: "cover",
        label: "Portada",
        thumb: p.cover,
        render: (pw) => (
            <div style={{ ...pageBase, display: "flex", flexDirection: "column" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3.2%", background: p.accent }} />
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6% 8% 0 11%", fontFamily: MONO, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    <span>Project / {pad2(p.number)}</span>
                    <span style={{ color: ASH }}>ESD Madrid · {p.year}</span>
                </div>
                <div style={{ position: "relative", flex: 1, margin: "5% 8% 0 11%", minHeight: 0 }}>
                    <Img src={p.cover} w={pw * 2} alt={`${p.title} — portada`} />
                </div>
                <div style={{ padding: "6% 8% 9% 11%" }}>
                    <h1 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 400, fontSize: Math.min(64, pw * 0.105), lineHeight: 0.95, letterSpacing: "-0.02em", fontVariationSettings: opsz(Math.min(64, pw * 0.105) * 0.8), overflowWrap: "anywhere" }}>{typeset(p.title)}</h1>
                    <svg width="100%" height="10" aria-hidden style={{ display: "block", marginTop: 10, maxWidth: 200 }}>
                        <line className="ag-stitch-draw" x1="0" y1="5" x2="200" y2="5" stroke="#B23A2B" strokeWidth="1.5" strokeDasharray="7 5" strokeLinecap="round" />
                    </svg>
                    <div style={{ marginTop: 12, fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase", color: ASH }}>
                        {p.category} · {p.role}
                    </div>
                </div>
            </div>
        ),
    })

    // 2 · Ficha (izquierda) y 3 · cita (derecha)
    pages.push({
        kind: "ficha",
        key: "ficha",
        label: "Ficha",
        render: (pw, side, n) => {
            const rows: [string, React.ReactNode][] = [
                ["Proyecto", typeset(p.title)],
                ["Número", pad2(p.number)],
                ["Año", p.year],
                ["Categoría", p.category],
                ["Rol", p.role],
                ["Contexto", p.context],
            ]
            return (
                <div style={{ ...pageBase, padding: "9% 9% 12%" }}>
                    <Running accent={p.accent}>Ficha técnica</Running>
                    <p style={{ margin: "14% 0 9%", fontFamily: DISPLAY, fontSize: Math.min(26, pw * 0.05), lineHeight: 1.25, fontVariationSettings: opsz(22) }}>{p.short}</p>
                    <dl style={{ margin: 0, borderTop: `1px solid ${INK}` }}>
                        {rows.map(([k, v]) => (
                            <div key={k} style={{ display: "flex", gap: 14, padding: "8px 0", borderBottom: `1px solid rgba(17,17,17,.14)`, fontSize: 12 }}>
                                <dt style={{ flex: "0 0 30%", fontFamily: MONO, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: ASH, paddingTop: 2 }}>{k}</dt>
                                <dd style={{ margin: 0, flex: 1, lineHeight: 1.4 }}>{v}</dd>
                            </div>
                        ))}
                    </dl>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 16 }}>
                        {p.keywords
                            .split(/\s+/)
                            .filter(Boolean)
                            .slice(0, 9)
                            .map((k) => (
                                <span key={k} style={{ fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.06em", textTransform: "uppercase", border: `1px solid rgba(17,17,17,.25)`, padding: "2px 6px" }}>
                                    {k}
                                </span>
                            ))}
                    </div>
                    <Folio p={p} n={n} side={side} />
                </div>
            )
        },
    })
    pages.push({
        kind: "cita",
        key: "cita",
        label: "Cita",
        render: (pw, side, n) => (
            <div style={{ ...pageBase, display: "flex", flexDirection: "column", justifyContent: "center", padding: "12% 12%" }}>
                <span aria-hidden style={{ fontFamily: DISPLAY, fontSize: pw * 0.28, lineHeight: 0.6, color: p.accent, fontVariationSettings: opsz(96), height: pw * 0.12 }}>“</span>
                <blockquote style={{ margin: 0, fontFamily: DISPLAY, fontStyle: "italic", fontSize: Math.min(40, pw * 0.072), lineHeight: 1.18, letterSpacing: "-0.01em", fontVariationSettings: opsz(36) }}>{p.cita}</blockquote>
                <div style={{ marginTop: "9%", fontFamily: MONO, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: ASH }}>— Ana Gil, {p.year}</div>
                <Folio p={p} n={n} side={side} />
            </div>
        ),
    })

    // Página de texto
    const textPage = (key: string, label: string, kicker: string, blocks: { title?: string; html: string }[]): PageDef => ({
        kind: "text",
        key,
        label,
        render: (pw, side, n) => (
            <div className="ag-book-text" style={{ ...pageBase, padding: "9% 10% 12%", overflowY: "auto", userSelect: "text" }}>
                <Running accent={p.accent}>{kicker}</Running>
                <div style={{ marginTop: "10%" }}>
                    {blocks.map((b, i) => {
                        const mono = b.title?.startsWith(">")
                        return (
                            <section key={i} style={{ marginTop: i ? "8%" : 0 }}>
                                {b.title &&
                                    (mono ? (
                                        <h3 style={{ margin: "0 0 10px", fontFamily: MONO, fontWeight: 500, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>{b.title}</h3>
                                    ) : (
                                        <h2 style={{ margin: "0 0 14px", fontFamily: DISPLAY, fontWeight: 400, fontSize: Math.min(38, pw * 0.07), lineHeight: 1, letterSpacing: "-0.01em", fontVariationSettings: opsz(34) }}>{typeset(b.title)}</h2>
                                    ))}
                                <div className="ag-rich" style={{ fontSize: Math.max(11.5, Math.min(14, pw * 0.026)), lineHeight: 1.62, hyphens: "auto" }} lang="es" dangerouslySetInnerHTML={{ __html: b.html }} />
                            </section>
                        )
                    })}
                </div>
                <p className="ag-eyebrow" style={{ marginTop: 24 }}>{p.title} · {n}</p>
            </div>
        ),
    })

    // Página de foto: a sangre si es vertical; con márgenes y pie si es horizontal
    const photoPage = (f: { src: string; name: string }, fig: number): PageDef => {
        const info = imgInfo(f.src)
        const tall = info ? info.h / info.w >= 1.12 : false
        return {
            kind: "photo",
            key: `ph-${f.src}`,
            label: `Fig. ${pad2(fig)}`,
            thumb: f.src,
            render: (pw, side, n) =>
                tall ? (
                    <div style={{ ...pageBase }}>
                        <Img src={f.src} w={pw * 2} alt={`${p.title} — figura ${fig}`} />
                        <Folio p={p} n={n} side={side} light />
                    </div>
                ) : (
                    <div style={{ ...pageBase, display: "flex", flexDirection: "column", justifyContent: "center", padding: "10% 9% 14%" }}>
                        <div style={{ aspectRatio: info ? `${info.w} / ${info.h}` : "4 / 3", width: "100%" }}>
                            <Img src={f.src} w={pw * 2} alt={`${p.title} — figura ${fig}`} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.08em", textTransform: "uppercase", color: ASH }}>
                            <span>Fig. {pad2(fig)}</span>
                            <span>{f.name}</span>
                        </div>
                        <Folio p={p} n={n} side={side} />
                    </div>
                ),
        }
    }
    let fig = 1

    // 4 · Concepto + foto
    if (p.concepto) {
        pages.push(textPage("concepto", "Concepto", "§ Concepto", [{ title: "Concepto", html: p.concepto }]))
        const f = takePhoto()
        if (f) pages.push(photoPage(f, fig++))
    }

    // 5 · Técnica: secciones cortas se agrupan de dos en dos; cada página de texto lleva una foto enfrente
    const tec = p.tecnica.filter((t) => t.html || t.title)
    for (let i = 0; i < tec.length; ) {
        const group = [tec[i]]
        if (tec[i + 1] && words(tec[i].html) + words(tec[i + 1].html) < 170) group.push(tec[i + 1])
        i += group.length
        pages.push(textPage(`tec-${i}`, group[0].title || "Técnica", "§ Técnica", group))
        const f = takePhoto()
        if (f) pages.push(photoPage(f, fig++))
    }

    // 6 · Resto de fotos
    for (let f = takePhoto(); f; f = takePhoto()) pages.push(photoPage(f, fig++))

    // 7 · Proceso: cuaderno de taller con alfiler
    p.proceso.forEach((pr, i) =>
        pages.push({
            kind: "proceso",
            key: `pr-${pr.src}`,
            label: `Proceso ${i + 1}`,
            thumb: pr.src,
            render: (pw, side, n) => {
                const info = imgInfo(pr.src)
                const rot = (i % 2 ? 1 : -1) * 1.6
                return (
                    <div style={{ ...pageBase, background: `${SHEET} url(${thumb("/media/sistema/papel", 1024)}) center / 700px`, padding: "9% 10% 12%", display: "flex", flexDirection: "column" }}>
                        <Running accent={p.accent}>
                            Proceso · {pad2(i + 1)} / {pad2(p.proceso.length)}
                        </Running>
                        <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "8% 2% 4%" }}>
                            <div style={{ position: "relative", background: "#fff", padding: "4%", boxShadow: "0 1px 0 rgba(0,0,0,.08), 0 10px 26px rgba(0,0,0,.14)", transform: `rotate(${rot}deg)`, width: info && info.w < info.h ? "72%" : "100%" }}>
                                <div style={{ aspectRatio: info ? `${info.w} / ${info.h}` : "4 / 3" }}>
                                    <Img src={pr.src} w={pw * 1.6} alt={pr.nota || `Proceso ${i + 1}`} />
                                </div>
                                <img src={thumb("/media/sistema/alfiler", 160)} alt="" aria-hidden draggable={false} style={{ position: "absolute", top: -22, left: "50%", width: 46, transform: "translateX(-50%) rotate(18deg)", filter: "drop-shadow(2px 4px 3px rgba(0,0,0,.25))" }} />
                            </div>
                        </div>
                        {pr.nota && <p style={{ margin: 0, fontFamily: DISPLAY, fontStyle: "italic", fontSize: Math.min(19, pw * 0.036), lineHeight: 1.35, fontVariationSettings: opsz(18) }}>{pr.nota}</p>}
                        <Folio p={p} n={n} side={side} />
                    </div>
                )
            },
        })
    )

    // 8 · Siguiente proyecto (+ libro completo si existe)
    const nextPage: PageDef = {
        kind: "next",
        key: "next",
        label: "Siguiente",
        thumb: next.cover,
        render: (pw, side, n) => (
            <div style={{ ...pageBase, padding: "9% 10% 12%", display: "flex", flexDirection: "column" }}>
                <Running accent={next.accent}>Fin de {p.title}</Running>
                {p.external && (
                    <a href={p.external} target="_blank" rel="noopener" data-book-ui="" style={{ marginTop: "9%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", border: `1px solid ${INK}`, color: INK, textDecoration: "none", fontFamily: MONO, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        <span>Ver el libro completo</span>
                        <span>↗</span>
                    </a>
                )}
                <div style={{ flex: 1 }} />
                <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: ASH, marginBottom: 10 }}>Siguiente proyecto</div>
                <Link href={next.link}>
                    <a data-book-ui="" style={{ display: "block", color: INK, textDecoration: "none" }}>
                        <div style={{ aspectRatio: "4 / 3", overflow: "hidden" }}>
                            <Img src={next.cover} w={pw * 1.6} alt={next.title} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginTop: 12 }}>
                            <span style={{ fontFamily: DISPLAY, fontSize: Math.min(40, pw * 0.075), lineHeight: 1, fontVariationSettings: opsz(36) }}>{typeset(next.title)}</span>
                            <span style={{ fontFamily: MONO, fontSize: 14 }}>→</span>
                        </div>
                    </a>
                </Link>
                <div style={{ display: "flex", gap: 16, marginTop: 18, fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    <Link href="/projects">
                        <a data-book-ui="" style={{ color: INK }}>← Índice</a>
                    </Link>
                    <Link href="/contact">
                        <a data-book-ui="" style={{ color: INK }}>Escribir a Ana</a>
                    </Link>
                </div>
                <Folio p={p} n={n} side={side} />
            </div>
        ),
    }

    // Contraportada; si hace falta, una página de notas para cuadrar el pliego
    const back: PageDef = {
        kind: "back",
        key: "back",
        label: "Contraportada",
        render: () => (
            <div style={{ ...pageBase, background: SIDE, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
                <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "3.2%", background: p.accent }} />
                <span style={{ fontFamily: DISPLAY, fontSize: 54, lineHeight: 1, fontVariationSettings: opsz(54) }}>AG</span>
                <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: ASH }}>Ana Gil · Fashion design · {p.year}</span>
            </div>
        ),
    }
    const blank: PageDef = {
        kind: "blank",
        key: "notes",
        label: "Notas",
        render: (_pw, side, n) => (
            <div style={{ ...pageBase, backgroundImage: "repeating-linear-gradient(transparent 0 27px, rgba(17,17,17,.08) 27px 28px)", backgroundPosition: "0 18%" }}>
                <div style={{ position: "absolute", top: "8%", left: "10%", fontFamily: MONO, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: ASH }}>Notas</div>
                <Folio p={p} n={n} side={side} />
            </div>
        ),
    }

    // "next" debe caer en página izquierda o derecha indistintamente; la contraportada, siempre a la izquierda (cara final)
    pages.push(nextPage)
    if (pages.length % 2 === 0) pages.push(blank)
    pages.push(back)
    return pages
}
