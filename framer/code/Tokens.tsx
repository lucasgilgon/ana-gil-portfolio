// Tokens compartidos por todos los componentes de código.
// En Framer: Assets > Code > New file "Tokens" y pega este archivo.
// Los demás archivos lo importan con `import { ... } from "./Tokens.tsx"`.
import { useEffect, useState } from "react"

export const colors = {
    white: "#FFFFFF",
    bg: "#FAFAFA",
    grayLight: "#F5F5F5",
    grayMedium: "#D0D0D0",
    grayDark: "#555555",
    black: "#1A1A1A",
    greenForest: "#2D5A4A",
    terra: "#C4876B",
} as const

// Prata solo existe en peso 400: nunca forzar bold (el navegador lo falsea).
export const fonts = {
    title: '"Prata", Georgia, "Times New Roman", serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"IBM Plex Mono", "Courier New", monospace',
} as const

export const ease = {
    out: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
    in: [0.55, 0.055, 0.675, 0.19] as [number, number, number, number],
    inOut: [0.645, 0.045, 0.355, 1] as [number, number, number, number],
    // Curva "editorial": salida lenta y suave para reveals de texto/imagen.
    expo: [0.16, 1, 0.3, 1] as [number, number, number, number],
}

export const duration = {
    hover: 0.2,
    fade: 0.35,
    enter: 0.8,
}

export const breakpoints = {
    tablet: 768,
    desktop: 1200,
}

export const labelStyle = {
    fontFamily: fonts.mono,
    fontSize: 12,
    lineHeight: 1.4,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
}

export function useMediaQuery(query: string, fallback = false) {
    const [matches, setMatches] = useState(fallback)
    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return
        const mql = window.matchMedia(query)
        const update = () => setMatches(mql.matches)
        update()
        mql.addEventListener("change", update)
        return () => mql.removeEventListener("change", update)
    }, [query])
    return matches
}

// true en dispositivos sin cursor fino (móvil/tablet táctil).
export function useIsTouch() {
    return useMediaQuery("(hover: none), (pointer: coarse)")
}

export function pad2(n: number | string) {
    const value = typeof n === "number" ? Math.max(0, Math.round(n)) : n
    return String(value).padStart(2, "0")
}
