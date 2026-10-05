// Recuerda desde dónde se abrió la última ventana (icono del Dock, del escritorio, una foto…)
// para que la ventana nueva "salga" de ese punto, como en macOS.
export type Rect = { x: number; y: number; w: number; h: number }
let last: { rect: Rect; href: string; t: number } | null = null

export function setOrigin(el: Element | null, href: string) {
    if (!el) return
    const r = el.getBoundingClientRect()
    if (!r.width) return
    last = { rect: { x: r.left, y: r.top, w: r.width, h: r.height }, href, t: performance.now() }
}

export function takeOrigin(href: string): Rect | null {
    if (!last) return null
    const ok = performance.now() - last.t < 1500 && samePath(last.href, href)
    const r = ok ? last.rect : null
    last = null
    return r
}

const clean = (p: string) => (p.replace(/[?#].*$/, "").replace(/\/$/, "") || "/")
function samePath(a: string, b: string) {
    try {
        return clean(new URL(a, location.href).pathname) === clean(b)
    } catch {
        return false
    }
}

// Rectángulo del icono del Dock correspondiente a una ruta (para cerrar "hacia" él)
export function dockRectFor(pathname: string): Rect | null {
    const id = appForPath(pathname)
    const el = id ? document.querySelector(`[data-dock-app="${id}"]`) : null
    const r = el?.getBoundingClientRect()
    return r && r.width ? { x: r.left, y: r.top, w: r.width, h: r.height } : null
}

export function appForPath(p: string): string | null {
    if (p.startsWith("/projects/404-not-found")) return "warning"
    if (p.startsWith("/projects")) return "finder"
    if (p.startsWith("/about")) return "notes"
    if (p.startsWith("/fotos")) return "photos"
    if (p.startsWith("/cv")) return "contacts"
    if (p.startsWith("/contact")) return "mail"
    if (p.startsWith("/papelera")) return "trash"
    return null
}
