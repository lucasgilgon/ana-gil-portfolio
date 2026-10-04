// BookTitle — título de proyecto en Bodoni con el tamaño óptico correcto y el guion bajo en mono.
// Se enlaza al campo "Title" del CMS. Sustituye al texto con el estilo Doc/Título en la portada del libro.

import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

const MONO = `"IBM Plex Mono", Menlo, monospace`
const DISPLAY = `"AG Bodoni", "Bodoni Moda", "Didot", Georgia, serif`
const AG_BODONI_CSS = `@font-face{font-family:"AG Bodoni";font-style:normal;font-weight:400 900;font-display:swap;src:url(https://fonts.gstatic.com/s/bodonimoda/v28/aFTQ7PxzY382XsXX63LUYJSKSKjWXFBP.woff2) format("woff2")}@font-face{font-family:"AG Bodoni";font-style:italic;font-weight:400 900;font-display:swap;src:url(https://fonts.gstatic.com/s/bodonimoda/v28/aFTS7PxzY382XsXX63LUYJSPeKrcW3JNsao.woff2) format("woff2")}`

function useAgBodoni() {
    React.useEffect(() => {
        if (typeof document === "undefined" || document.getElementById("ag-bodoni-face")) return
        const s = document.createElement("style")
        s.id = "ag-bodoni-face"
        s.textContent = AG_BODONI_CSS
        document.head.appendChild(s)
    }, [])
}

function typeset(t: string): React.ReactNode {
    if (!t || !t.includes("_")) return t
    return t.split(/(_)/).map((part, i) => (part === "_" ? <span key={i} style={{ fontFamily: MONO, fontWeight: 500, fontVariationSettings: "normal" }}>_</span> : part))
}

interface Props {
    text: string
    size: number
    color: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 420
 * @framerIntrinsicHeight 160
 */
export default function BookTitle({ text, size: s0, color, style }: Props) {
    useAgBodoni()
    const size = Number(s0) || 78
    return (
        <h1
            style={{
                ...style,
                margin: 0,
                width: "100%",
                fontFamily: DISPLAY,
                fontWeight: 400,
                fontSize: size,
                fontVariationSettings: `"opsz" ${Math.max(6, Math.min(96, Math.round(size * 0.72)))}`,
                lineHeight: 0.96,
                letterSpacing: "-0.02em",
                color,
                overflowWrap: "anywhere",
                paddingBottom: "0.05em",
            }}
        >
            {typeset(text)}
        </h1>
    )
}

BookTitle.defaultProps = { text: "404:NOT FOUND_", size: 78, color: "var(--token-af4fc6f1-b3ea-4ad6-a961-bbf8e86ad48f, #111111)" }

addPropertyControls(BookTitle, {
    text: { type: ControlType.String, title: "Texto" },
    size: { type: ControlType.Number, title: "Tamaño", min: 24, max: 160, unit: "px" },
    color: { type: ControlType.Color, title: "Color" },
})
