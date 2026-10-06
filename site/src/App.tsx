import * as React from "react"
import { useLocation } from "react-router-dom"
import { clean } from "./routes"
import { updateHead } from "./lib/head"
import { startAnalytics, pageview } from "./lib/analytics"

const DesktopShell = React.lazy(() => import("./shell/DesktopShell"))
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
    }, [])
    React.useEffect(() => {
        updateHead(clean(pathname))
        pageview(pathname)
    }, [pathname])

    return phone ? (
        <React.Suspense fallback={<p role="status">Cargando el archivo…</p>}>
            <PhoneShell />
        </React.Suspense>
    ) : (
        <React.Suspense fallback={<p role="status">Cargando el archivo…</p>}><DesktopShell /></React.Suspense>
    )
}
