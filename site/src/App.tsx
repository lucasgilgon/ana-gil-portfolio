import * as React from "react"
import { useLocation } from "react-router-dom"
import DesktopShell from "./shell/DesktopShell"
import { resolveRoute, clean, prefetchWindows } from "./routes"
import { startAnalytics, pageview } from "./lib/analytics"

const PhoneShell = React.lazy(() => import("./phone/PhoneShell"))

const PHONE_MQ = "(max-width: 700px)"

function usePhone() {
    const [phone, setPhone] = React.useState(() => typeof window !== "undefined" && window.matchMedia(PHONE_MQ).matches)
    React.useEffect(() => {
        const mq = window.matchMedia(PHONE_MQ)
        const u = () => setPhone(mq.matches)
        mq.addEventListener?.("change", u)
        return () => mq.removeEventListener?.("change", u)
    }, [])
    return phone
}

export default function App() {
    const phone = usePhone()
    const { pathname } = useLocation()

    React.useEffect(() => {
        startAnalytics()
        prefetchWindows()
    }, [])
    React.useEffect(() => {
        const r = resolveRoute(clean(pathname))
        document.title = r ? `${r.title} — Ana Gil` : "Ana Gil — Fashion design · Portfolio 2026"
        pageview(pathname)
    }, [pathname])

    return phone ? (
        <React.Suspense fallback={null}>
            <PhoneShell />
        </React.Suspense>
    ) : (
        <DesktopShell />
    )
}
