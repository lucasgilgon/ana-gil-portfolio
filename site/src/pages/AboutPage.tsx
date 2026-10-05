import * as React from "react"
import Window, { INK, MONO, DISPLAY, ChromeCtx } from "../shell/Window"
import AboutSpread from "../components/AboutSpread"

// Barra de TextEdit (decorativa, como en el original)
function TextEditBar() {
    const box: React.CSSProperties = { border: `1px solid ${INK}`, padding: "2px 8px", fontSize: 11, fontFamily: MONO, lineHeight: "16px", background: "transparent", color: INK }
    return (
        <div aria-hidden style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ ...box, fontFamily: DISPLAY, fontSize: 15, padding: "1px 8px", fontVariationSettings: '"opsz" 14' }}>Bodoni Moda ▾</span>
            <span style={box}>16 ▾</span>
            <span style={{ ...box, fontWeight: 700 }}>B</span>
            <span style={{ ...box, fontStyle: "italic" }}>I</span>
            <span style={{ ...box, textDecoration: "underline" }}>U</span>
            <span style={box}>≡</span>
        </div>
    )
}

export default function AboutPage() {
    const ios = React.useContext(ChromeCtx) === "ios"
    return (
        <Window
            label="Sobre mí"
            title="Sobre mí.txt — Editado"
            toolbar={ios ? undefined : <TextEditBar />}
            status={
                <>
                    <span>Texto sin formato · UTF-8</span>
                    <span className="ag-hide-narrow">ESD Madrid · 2025/26</span>
                </>
            }
        >
            <AboutSpread email="anagilgonzalez06@gmail.com" instagram="https://www.instagram.com/byana_________/" />
        </Window>
    )
}
