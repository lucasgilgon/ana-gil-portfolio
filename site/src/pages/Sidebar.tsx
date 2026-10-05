// Barra lateral tipo Finder: Favoritos y la lista de proyectos.
import * as React from "react"
import { Link } from "framer"
import { useLocation } from "react-router-dom"
import { PROJECTS } from "../content/generated"
import { INK, SIDE, ASH, MONO, UI } from "../shell/Window"

const ICON: Record<string, React.ReactNode> = {
    home: <path d="M2.5 7.5 8 3l5.5 4.5V13a.5.5 0 0 1-.5.5H9.5V10h-3v3.5H3a.5.5 0 0 1-.5-.5z" />,
    folder: <path d="M1.8 4.2c0-.6.4-1 1-1h3.4l1.3 1.4h5.7c.6 0 1 .4 1 1v6.8c0 .6-.4 1-1 1H2.8c-.6 0-1-.4-1-1z" />,
    doc: <path d="M3.5 1.8h6.3l2.7 2.7v9.7H3.5zM6 6.5h5M6 8.8h5M6 11h3.4" />,
    mail: <path d="M1.8 3.8h12.4v8.4H1.8zM1.8 4.2 8 9l6.2-4.8" />,
}

function Item({ href, icon, label, on, dot }: { href: string; icon: keyof typeof ICON; label: string; on: boolean; dot?: string }) {
    return (
        <Link href={href}>
            <a style={{ display: "flex", alignItems: "center", gap: 9, padding: "5px 10px", borderRadius: 2, background: on ? "rgba(17,17,17,.08)" : "transparent", color: INK, textDecoration: "none", fontSize: 13, fontFamily: UI, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0, opacity: 0.75 }}>
                    {ICON[icon]}
                </svg>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
                {dot && <span aria-hidden style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: dot, flexShrink: 0 }} />}
            </a>
        </Link>
    )
}

export default function Sidebar() {
    const { pathname } = useLocation()
    const h = (t: string) => <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: ASH, padding: "16px 10px 6px" }}>{t}</div>
    return (
        <nav aria-label="Barra lateral" className="ag-sidebar" style={{ width: 208, flexShrink: 0, background: SIDE, borderRight: `1px solid ${INK}`, padding: "0 8px 20px", overflow: "auto" }}>
            {h("Favoritos")}
            <Item href="/" icon="home" label="Escritorio" on={pathname === "/"} />
            <Item href="/projects" icon="folder" label="Proyectos" on={pathname === "/projects"} />
            <Item href="/about" icon="doc" label="Sobre mí" on={pathname === "/about"} />
            <Item href="/contact" icon="mail" label="Contacto" on={pathname === "/contact"} />
            {h("Proyectos")}
            {PROJECTS.map((p) => (
                <Item key={p.slug} href={p.link} icon="folder" label={p.title} on={pathname === p.link} dot={p.accent} />
            ))}
        </nav>
    )
}
