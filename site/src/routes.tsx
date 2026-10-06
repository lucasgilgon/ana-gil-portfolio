// Rutas del portfolio: qué ventana abre cada dirección y con qué tamaño.
import * as React from "react"
import type { WinSize } from "./shell/WindowFrame"
import { PROJECTS } from "./content/generated"
import IndexPage from "./pages/IndexPage"
import NotFoundPage from "./pages/NotFoundPage"

// Cada ventana se descarga solo cuando se abre (y en segundo plano cuando el navegador está libre)
const load = {
    about: () => import("./pages/AboutPage"),
    contact: () => import("./pages/ContactPage"),
    book: () => import("./pages/project/ProjectPage"),
    cv: () => import("./components/CVWindow"),
    photos: () => import("./components/PhotosApp"),
    trash: () => import("./components/TrashWindow"),
    probador: () => import("./pages/project/Probador"),
    moodboard: () => import("./pages/project/Moodboard"),
    tejidos: () => import("./pages/Tejidos"),
    visitas: () => import("./pages/Visitas"),
}
const AboutPage = React.lazy(load.about)
const ContactPage = React.lazy(load.contact)
const ProjectBook = React.lazy(load.book)
const CVWindow = React.lazy(load.cv)
const PhotosApp = React.lazy(load.photos)
const TrashWindow = React.lazy(load.trash)
const Probador = React.lazy(load.probador)
const Moodboard = React.lazy(load.moodboard)
const Tejidos = React.lazy(load.tejidos)
const Visitas = React.lazy(load.visitas)

// Prefetch only a destination the visitor is about to open.
export function prefetchRoute(path: string) {
    const key = path.startsWith("/projects/") ? "book" : ({ "/about": "about", "/contact": "contact", "/cv": "cv", "/fotos": "photos" } as const)[path]
    if (key) void load[key]().catch(() => {})
}

const Paper = () => <div style={{ width: "100%", height: "100%", minHeight: 320, background: "var(--ag-sheet, #FBFAF7)", border: "1px solid var(--ag-ink, #111)" }} />
const lazy = (el: React.ReactNode) => <React.Suspense fallback={<Paper />}>{el}</React.Suspense>

export type RouteDef = { key: string; size: WinSize; render: () => React.ReactNode; app: string; title: string }

export const clean = (p: string) => p.replace(/\/+$/, "") || "/"

export function resolveRoute(pathname: string): RouteDef | null {
    const p = clean(pathname)
    if (p === "/") return null
    if (p === "/projects") return { key: p, app: "Finder", title: "Índice", size: { w: 1040, h: "fill" }, render: () => <IndexPage /> }
    const m = p.match(/^\/projects\/([^/]+)$/)
    if (m) {
        const project = PROJECTS.find((x) => x.slug === m[1])
        if (project) return { key: p, app: "Vista previa", title: project.title, size: { w: 1380, h: "fill" }, render: () => lazy(<ProjectBook key={project.slug} project={project} />) }
    }
    const sub = p.match(/^\/projects\/([^/]+)\/(probador|moodboard)$/)
    if (sub) {
        const project = PROJECTS.find((x) => x.slug === sub[1])
        if (project && sub[2] === "moodboard") return { key: p, app: "Moodboard", title: `Moodboard — ${project.title}`, size: { w: 1280, h: "fill" }, render: () => lazy(<Moodboard key={project.slug} project={project} />) }
        if (project && sub[2] === "probador" && project.probador.length) return { key: p, app: "Probador", title: `Probador — ${project.title}`, size: { w: 1180, h: "fill" }, render: () => lazy(<Probador key={project.slug} project={project} />) }
    }
    if (p === "/tejidos") return { key: p, app: "Tejidos", title: "Tejidos", size: { w: 1100, h: "fill" }, render: () => lazy(<Tejidos />) }
    if (p === "/notas") return { key: p, app: "Notas", title: "Libro de visitas", size: { w: 1000, h: "fill" }, render: () => lazy(<Visitas />) }
    if (p === "/about") return { key: p, app: "TextEdit", title: "Sobre mí", size: { w: 900, h: "fill" }, render: () => lazy(<AboutPage />) }
    if (p === "/cv") return { key: p, app: "Contactos", title: "Currículum", size: { w: 1000, h: "fill" }, render: () => lazy(<CVWindow email="anagilgonzalez06@gmail.com" phone="+34 673 71 85 98" startView="info" />) }
    if (p === "/fotos") return { key: p, app: "Fotos", title: "Fotos", size: { w: 1160, h: "fill" }, render: () => lazy(<PhotosApp />) }
    if (p === "/papelera") return { key: p, app: "Finder", title: "Papelera", size: { w: 940, h: "fill" }, render: () => lazy(<TrashWindow title="Papelera" />) }
    if (p === "/contact") return { key: p, app: "Mail", title: "Contacto", size: { w: 800, h: "fill", maxH: 680 }, render: () => lazy(<ContactPage />) }
    return { key: "404", app: "Finder", title: "No encontrado", size: { w: 620, h: "auto" }, render: () => <NotFoundPage /> }
}
