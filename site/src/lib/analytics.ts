// Estadísticas gratuitas y sin cookies (opcionales, se activan con variables de entorno):
// · Cloudflare Web Analytics → VITE_CF_BEACON_TOKEN (visitas, páginas, países, dispositivos)
// · GoatCounter → VITE_GOATCOUNTER (p. ej. "anagil"), además cuenta eventos: CV descargado, contacto…
const env = (import.meta as any).env || {}

let started = false
export function startAnalytics() {
    if (started || typeof document === "undefined") return
    started = true
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") return
    const cf = env.VITE_CF_BEACON_TOKEN as string | undefined
    if (cf) {
        const s = document.createElement("script")
        s.defer = true
        s.src = "https://static.cloudflareinsights.com/beacon.min.js"
        s.setAttribute("data-cf-beacon", JSON.stringify({ token: cf, spa: true }))
        document.head.appendChild(s)
    }
    const gc = env.VITE_GOATCOUNTER as string | undefined
    if (gc) {
        ;(window as any).goatcounter = { no_onload: true }
        const s = document.createElement("script")
        s.async = true
        s.src = "https://gc.zgo.at/count.js"
        s.setAttribute("data-goatcounter", `https://${gc}.goatcounter.com/count`)
        s.onload = () => pageview(location.pathname)
        document.head.appendChild(s)
    }
}

export function pageview(path: string) {
    const gc = (window as any).goatcounter
    if (gc?.count) gc.count({ path })
}

export function track(event: string) {
    const gc = (window as any).goatcounter
    if (gc?.count) gc.count({ path: `evento/${event}`, title: event, event: true })
}
