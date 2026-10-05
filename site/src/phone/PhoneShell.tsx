// iPhone: pantalla de inicio fija y las apps (rutas) encima, abriéndose desde su icono.
import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useLocation } from "react-router-dom"
import PhoneHome from "./PhoneHome"
import PhoneApp from "./PhoneApp"
import PhoneProjects from "./PhoneProjects"
import Spotlight from "../components/Spotlight"
import AgSystem from "../components/AgSystem"
import BootScreen from "../components/BootScreen"
import { resolveRoute, clean } from "../routes"
import { ChromeCtx } from "../shell/Window"
import { PROJECTS } from "../content/generated"

const TITLES: Record<string, string> = { "/about": "Sobre mí", "/cv": "Currículum", "/fotos": "Fotos", "/papelera": "Papelera", "/contact": "Nuevo mensaje" }

export default function PhoneShell() {
    const { pathname } = useLocation()
    const path = clean(pathname)
    const [openN, setOpenN] = React.useState(0)
    const appOpen = openN > 0
    const onHome = React.useCallback((o: boolean) => setOpenN((n) => Math.max(0, n + (o ? 1 : -1))), [])
    const seg = path === "/" ? null : path.split("/")[1]
    const route = path === "/" ? null : resolveRoute(path)
    const projectsApp = seg === "projects" && (path === "/projects" || PROJECTS.some((p) => path === p.link))

    // Bloquea el scroll del documento (cada app desplaza su propio contenido)
    React.useEffect(() => {
        document.documentElement.classList.add("ag-phone")
        return () => document.documentElement.classList.remove("ag-phone")
    }, [])

    return (
        <ChromeCtx.Provider value="ios">
            <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#111" }}>
                {/* La pantalla de inicio se acerca un poco al abrir una app, como en iOS */}
                <motion.div animate={appOpen ? { scale: 1.08, opacity: 0.4 } : { scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 30 }} style={{ position: "absolute", inset: 0 }}>
                    <PhoneHome />
                </motion.div>
                <AnimatePresence>
                    {route &&
                        (projectsApp ? (
                            <PhoneApp key="projects" path={path} title="Proyectos" bare onHome={onHome}>
                                <PhoneProjects path={path} />
                            </PhoneApp>
                        ) : (
                            <PhoneApp key={route.key} path={path} title={TITLES[path] ?? route.title} onHome={onHome}>
                                {route.render()}
                            </PhoneApp>
                        ))}
                </AnimatePresence>
            </div>
            <Spotlight />
            <AgSystem idleSeconds={45} screensaver={false} nightMode coverTransition={false} stitches={false} loupe={false} />
            <BootScreen name="ANA GIL" line2="Portfolio 2026 · Fashion design" background="#F4F2ED" color="#111111" thread="#B23A2B" oncePerSession />
        </ChromeCtx.Provider>
    )
}
