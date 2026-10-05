import * as React from "react"
import Window, { DISPLAY, ASH, opsz } from "../shell/Window"
import Sidebar from "./Sidebar"
import ArchiveIndex from "../components/ArchiveIndex"
import { PROJECTS } from "../content/generated"

export default function IndexPage() {
    return (
        <Window
            label="Índice de proyectos"
            title="Index / Proyectos"
            sidebar={<Sidebar />}
            status={
                <>
                    <span>{PROJECTS.length} elementos · archivo vivo · portfolio 2026</span>
                    <span className="ag-hide-narrow">ESD Madrid</span>
                </>
            }
            bodyStyle={{ padding: "34px 32px 48px" }}
        >
            <h1 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 400, fontSize: 92, lineHeight: 1, letterSpacing: "-0.02em", fontVariationSettings: opsz(92) }}>Índice</h1>
            <p style={{ margin: "14px 0 36px", fontSize: 17, lineHeight: 1.45, color: ASH, maxWidth: 680 }}>
                Una selección de trabajos sobre trauma, memoria y transformación. ESD Madrid, 2025–26.
            </p>
            <ArchiveIndex defaultView="list" />
        </Window>
    )
}
