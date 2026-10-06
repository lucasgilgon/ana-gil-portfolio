// Window — cromo de ventana del portfolio (el mismo que en Framer):
// barra de título con semáforo, título en mono y "CERRAR ×", barra de herramientas opcional,
// cuerpo con scroll propio y barra de estado.
import * as React from "react"
import { Link } from "framer"

export const INK = "var(--ag-ink, #111111)"
export const PAPER = "var(--ag-paper, #F4F2ED)"
export const SHEET = "var(--ag-sheet, #FBFAF7)"
export const SIDE = "var(--ag-side, #ECE9E2)"
export const FOG = "var(--ag-fog, #D7D4CD)"
export const ASH = "var(--ag-ash, #625f59)"
export const UI = `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
export const MONO = `"IBM Plex Mono", Menlo, monospace`
export const DISPLAY = `"AG Bodoni", "Bodoni Moda", "Didot", Georgia, serif`
export const opsz = (px: number) => `"opsz" ${Math.max(6, Math.min(96, Math.round(px)))}`

export function TrafficLights() {
    const dot = (bg: string): React.CSSProperties => ({ width: 12, height: 12, borderRadius: "50%", background: bg, display: "block", boxShadow: "inset 0 0 0 .5px rgba(0,0,0,.18)" })
    return (
        <div className="ag-lights" style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <Link href="/">
                <a aria-label="Cerrar" style={dot("#FF5F57")} />
            </Link>
            <button type="button" data-ag-min="" aria-label="Minimizar" style={{ ...dot("#FEBC2E"), border: "none", padding: 0, cursor: "default" }} />
            <button type="button" data-ag-max="" aria-label="Pantalla completa" style={{ ...dot("#28C840"), border: "none", padding: 0, cursor: "default" }} />
        </div>
    )
}

export const startDrag = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("a,button,input,select,textarea")) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    window.dispatchEvent(new CustomEvent("ag:window-drag-start", { detail: e.nativeEvent }))
}

interface Props {
    title: React.ReactNode
    toolbar?: React.ReactNode
    status?: React.ReactNode
    sidebar?: React.ReactNode
    children: React.ReactNode
    bodyStyle?: React.CSSProperties
    bodyRef?: React.Ref<HTMLDivElement>
    label?: string
}

// En el iPhone las ventanas pierden el cromo de Mac: la app ya pone su barra de navegación
export const ChromeCtx = React.createContext<"mac" | "ios">("mac")

export default function Window({ title, toolbar, status, sidebar, children, bodyStyle, bodyRef, label }: Props) {
    const chrome = React.useContext(ChromeCtx)
    if (chrome === "ios")
        return (
            <section data-ag-window="" aria-label={label} style={{ position: "relative", width: "100%", minHeight: "100%", display: "flex", flexDirection: "column", background: SHEET, color: INK, fontFamily: UI }}>
                {toolbar && <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderBottom: `1px solid ${FOG}`, overflowX: "auto" }}>{toolbar}</div>}
                <div ref={bodyRef} data-ag-body="" style={{ flex: 1, ...bodyStyle, overflow: "visible", padding: bodyStyle?.padding ? "20px 18px 40px" : undefined }}>
                    {children}
                </div>
            </section>
        )
    return (
        <section data-ag-window="" aria-label={label} style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", background: SHEET, color: INK, border: `1px solid ${INK}`, fontFamily: UI, overflow: "hidden" }}>
            <header
                onPointerDown={startDrag}
                onDoubleClick={() => window.dispatchEvent(new CustomEvent("ag:window-drag-reset"))}
                style={{ height: 40, flexShrink: 0, display: "flex", alignItems: "center", gap: 14, padding: "0 16px", background: PAPER, borderBottom: `1px solid ${INK}`, cursor: "grab", userSelect: "none", touchAction: "none" }}
            >
                <TrafficLights />
                <div className="ag-wtitle" style={{ flex: 1, minWidth: 0, textAlign: "center", fontFamily: MONO, fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {title}
                </div>
                <Link href="/">
                    <a className="ag-wclose" style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.08em", color: INK, textDecoration: "none", flexShrink: 0 }}>
                        CERRAR ×
                    </a>
                </Link>
            </header>
            {toolbar && <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: PAPER, borderBottom: `1px solid ${INK}` }}>{toolbar}</div>}
            <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
                {sidebar}
                <div ref={bodyRef} data-ag-body="" style={{ flex: 1, minWidth: 0, overflow: "auto", overscrollBehavior: "contain", ...bodyStyle }}>
                    {children}
                </div>
            </div>
            {status && (
                <footer style={{ flexShrink: 0, display: "flex", justifyContent: "space-between", gap: 12, padding: "6px 16px", background: PAPER, borderTop: `1px solid ${INK}`, fontFamily: MONO, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: ASH }}>
                    {status}
                </footer>
            )}
        </section>
    )
}
