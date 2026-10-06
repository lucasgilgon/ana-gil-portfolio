import * as React from 'react'
import { Link } from 'framer'
import { useSearchParams } from 'react-router-dom'
import Window, { ChromeCtx } from '../../shell/Window'
import { PROJECTS, type Project } from '../../content/generated'
import { thumb, srcSet } from '../../lib/media'
import { typeset } from './pages'

const Book = React.lazy(() => import('./ProjectBook'))
const PhoneBook = React.lazy(() => import('../../phone/PhoneProjects').then(m => ({ default: m.PhoneBook })))

export default function ProjectPage({ project }: { project: Project }) {
    const ios = React.useContext(ChromeCtx) === 'ios'
    const [params, setParams] = useSearchParams()
    const book = params.get('view') !== 'lectura'
    const read = () => setParams({ view: 'lectura' }, { replace: true })
    const next = PROJECTS[(PROJECTS.findIndex(p => p.slug === project.slug) + 1) % PROJECTS.length]
    if (book) return <React.Suspense fallback={<p role="status">Abriendo el libro…</p>}>
        {ios ? <PhoneBook key={project.slug} project={project} onRead={read} /> : <Book key={project.slug} project={project} onRead={read} />}
    </React.Suspense>
    return <Window title={project.title} label={project.title} bodyStyle={{ padding: 0 }}>
        <article className="ag-project-summary">
            <nav aria-label="Volver a proyectos" style={{ marginBottom: 24 }}><Link href="/projects"><a className="ag-button">← Proyectos</a></Link></nav>
            <header className="ag-project-hero">
                <div>
                    <p className="ag-eyebrow">Proyecto {String(project.number).padStart(2, '0')} · {project.category} · {project.year}</p>
                    <h1>{typeset(project.title)}</h1>
                    <p className="ag-project-intro">{project.short}</p>
                    <dl className="ag-project-facts"><div><dt>Rol</dt><dd>{project.role}</dd></div><div><dt>Contexto</dt><dd>{project.context}</dd></div></dl>
                    <div className="ag-actions">
                        <button className="ag-button ag-button-primary" onClick={() => setParams({}, { replace: true })}>Abrir libro editorial</button>
                        <a className="ag-button" href="#resultado">Ver resultado ↓</a>
                    </div>
                </div>
                <img src={thumb(project.cover, 960)} srcSet={srcSet(project.cover)} sizes="(max-width: 900px) 90vw, 45vw" alt={`${project.title} — portada`} />
            </header>
            {project.concepto && <section className="ag-project-copy"><h2>Concepto</h2><div className="ag-rich" dangerouslySetInnerHTML={{ __html: project.concepto }} /></section>}
            <section id="resultado"><p className="ag-eyebrow">Selección de imágenes</p><h2>El resultado</h2><div className="ag-project-gallery">
                {project.files.map((f, i) => <figure key={f.src}><img src={thumb(f.src, 960)} srcSet={srcSet(f.src)} sizes="(max-width: 900px) 90vw, 40vw" alt={`${project.title} — resultado ${i + 1}`} loading="lazy" /><figcaption>Fig. {String(i + 1).padStart(2, '0')}</figcaption></figure>)}
            </div></section>
            {!!project.proceso.length && <section><h2>Proceso</h2><div className="ag-project-gallery">{project.proceso.map(f => <figure key={f.src}><img src={thumb(f.src, 960)} srcSet={srcSet(f.src)} sizes="(max-width: 900px) 90vw, 40vw" alt={f.nota || `${project.title} — proceso`} loading="lazy" /><figcaption>{f.nota}</figcaption></figure>)}</div></section>}
            {!!project.tecnica.length && <section className="ag-project-copy"><h2>Técnica y materiales</h2>{project.tecnica.map((t, i) => <section key={i}><h3>{t.title.replace(/^>\s*/, '')}</h3><div className="ag-rich" dangerouslySetInnerHTML={{ __html: t.html }} /></section>)}</section>}
            <nav className="ag-actions" aria-label="Explorar el proyecto"><Link href={`${project.link}/moodboard`}><a className="ag-button">Moodboard</a></Link>{!!project.probador.length && <Link href={`${project.link}/probador`}><a className="ag-button">Probador</a></Link>}{project.external && <a className="ag-button" href={project.external} target="_blank" rel="noopener noreferrer">Ver publicación ↗</a>}</nav>
            <footer className="ag-project-footer"><div><p className="ag-eyebrow">Siguiente proyecto</p><Link href={next.link}><a>{typeset(next.title)} →</a></Link></div><nav className="ag-actions" aria-label="Contacto y currículum"><Link href="/cv"><a className="ag-button">Currículum</a></Link><Link href="/contact"><a className="ag-button ag-button-primary">Contactar con Ana</a></Link></nav></footer>
        </article>
    </Window>
}
