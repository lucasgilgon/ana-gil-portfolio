// Rutas del portfolio: qué ventana abre cada dirección y con qué tamaño.
import * as React from "react"
import type { WinSize } from "./shell/WindowFrame"
import { PROJECTS } from "./content/generated"
import IndexPage from "./pages/IndexPage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import NotFoundPage from "./pages/NotFoundPage"
import ProjectBook from "./pages/project/ProjectBook"
import CVWindow from "./components/CVWindow"
import PhotosApp from "./components/PhotosApp"
import TrashWindow from "./components/TrashWindow"

export type RouteDef = { key: string; size: WinSize; render: () => React.ReactNode; app: string; title: string }

export const clean = (p: string) => p.replace(/\/+$/, "") || "/"

export function resolveRoute(pathname: string): RouteDef | null {
    const p = clean(pathname)
    if (p === "/") return null
    if (p === "/projects") return { key: p, app: "Finder", title: "Índice", size: { w: 1040, h: "fill" }, render: () => <IndexPage /> }
    const m = p.match(/^\/projects\/([^/]+)$/)
    if (m) {
        const project = PROJECTS.find((x) => x.slug === m[1])
        if (project) return { key: p, app: "Vista previa", title: project.title, size: { w: 1380, h: "fill" }, render: () => <ProjectBook key={project.slug} project={project} /> }
    }
    if (p === "/about") return { key: p, app: "TextEdit", title: "Sobre mí", size: { w: 900, h: "fill" }, render: () => <AboutPage /> }
    if (p === "/cv") return { key: p, app: "Contactos", title: "Currículum", size: { w: 1000, h: "fill" }, render: () => <CVWindow email="anagilgonzalez06@gmail.com" phone="+34 673 71 85 98" startView="info" /> }
    if (p === "/fotos") return { key: p, app: "Fotos", title: "Fotos", size: { w: 1160, h: "fill" }, render: () => <PhotosApp /> }
    if (p === "/papelera") return { key: p, app: "Finder", title: "Papelera", size: { w: 940, h: "fill" }, render: () => <TrashWindow title="Papelera" /> }
    if (p === "/contact") return { key: p, app: "Mail", title: "Contacto", size: { w: 800, h: "fill", maxH: 680 }, render: () => <ContactPage /> }
    return { key: "404", app: "Finder", title: "No encontrado", size: { w: 620, h: "auto" }, render: () => <NotFoundPage /> }
}
