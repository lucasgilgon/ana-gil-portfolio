import { metadataFor } from '../../shared/metadata.mjs'
import { PROJECTS } from '../content/generated'
const base = ((import.meta as any).env?.VITE_SITE_URL || document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href || window.location.origin).replace(/\/$/, '')
const origin = new URL(base).origin
export function updateHead(path: string) {
    const meta = metadataFor(path, PROJECTS, origin)
    document.title = meta.title
    const set = (key: string, value: string, property = false) => {
        const attr = property ? 'property' : 'name'
        let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
        if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
        el.content = value
    }
    set('description', meta.desc)
    for (const [key, value] of Object.entries({ title: meta.title, description: meta.desc, url: meta.canonical, image: meta.image, type: meta.type })) set(`og:${key}`, String(value), true)
    set('twitter:title', meta.title); set('twitter:description', meta.desc); set('twitter:image', meta.image)
    set('robots', meta.known ? 'index,follow' : 'noindex,follow')
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = meta.canonical
    document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove())
    const project = PROJECTS.find(p => p.link === path)
    const data = project ? { '@context': 'https://schema.org', '@type': 'CreativeWork', name: project.title, description: project.short, url: meta.canonical, image: meta.image, creator: { '@type': 'Person', name: 'Ana Gil' } } : (path === '/' || path === '/about') ? { '@context': 'https://schema.org', '@type': 'Person', name: 'Ana Gil González', alternateName: 'Ana Gil', jobTitle: 'Diseñadora de moda (estudiante)', url: `${origin}/`, image: meta.image, affiliation: { '@type': 'CollegeOrUniversity', name: 'ESD Madrid — Escuela Superior de Diseño de Madrid' } } : { '@context': 'https://schema.org', '@type': 'WebPage', name: meta.title, description: meta.desc, url: meta.canonical }
    const script = document.createElement('script'); script.type = 'application/ld+json'; script.textContent = JSON.stringify(data); document.head.appendChild(script)
}
