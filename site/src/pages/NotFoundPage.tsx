import * as React from "react"
import { Link } from "framer"
import Window, { DISPLAY, ASH, MONO, INK, opsz } from "../shell/Window"

export default function NotFoundPage() {
    return (
        <Window label="No encontrado" title="Error — archivo no encontrado" status={<span>0 elementos</span>} bodyStyle={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h1 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 400, fontSize: 84, lineHeight: 1, fontVariationSettings: opsz(84) }}>
                404<span style={{ fontFamily: MONO, fontWeight: 500 }}>_</span>
            </h1>
            <p style={{ margin: "18px 0 28px", fontSize: 16, color: ASH, maxWidth: 460, lineHeight: 1.5 }}>Este archivo no está en el escritorio. Quizá se movió a la papelera, o nunca existió.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                    ["/", "Volver al escritorio"],
                    ["/projects", "Ver proyectos"],
                    ["/papelera", "Abrir la papelera"],
                ].map(([h, l]) => (
                    <Link key={h} href={h}>
                        <a style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", padding: "7px 12px", border: `1px solid ${INK}`, color: INK, textDecoration: "none" }}>{l}</a>
                    </Link>
                ))}
            </div>
        </Window>
    )
}
