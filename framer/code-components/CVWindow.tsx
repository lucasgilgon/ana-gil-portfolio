// CVWindow — el currículum de Ana Gil como ventana "Obtener información" de macOS.
// Vistas: Información (ficha con apartados plegables), Trayectoria (cinta métrica arrastrable que
// cose estudios, trabajo y proyectos), Etiqueta (etiqueta de prenda + cartón colgante que se balancea
// y se gira) y Terminal (> cat ana_gil.cv, con comandos).
// Extras: ES / EN / IT, modo reclutador de 30 s, "Imprimir…" con impresora que descarga el PDF,
// archivo CV_Ana_Gil.pdf que vuela al Dock al descargarse y "Guardar contacto" (.vcf).

import * as React from "react"
import { addPropertyControls, ControlType, Link } from "framer"
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useSpring, useTransform, animate } from "framer-motion"

const INK = "var(--ag-ink, #111111)"
const PAPER = "var(--ag-paper, #F4F2ED)"
const SHEET = "var(--ag-sheet, #FBFAF7)"
const SIDE = "var(--ag-side, #ECE9E2)"
const FOG = "var(--ag-fog, #D7D4CD)"
const ASH = "var(--ag-ash, #7C7973)"
const UI = `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
const MONO = `"IBM Plex Mono", Menlo, monospace`
const DISPLAY = `"Bodoni Moda", "Didot", Georgia, serif`
const EASE = [0.22, 1, 0.36, 1] as const

const PDF_URL = "https://framerusercontent.com/assets/8dsD8AhmieWjjzHr4w7X0iWrzvk.pdf"
const PORTRAIT = "https://framerusercontent.com/images/0LSObXlRd6Lxm0oHNThbQEWxHJ8.jpg"
const PAGE_PREVIEW = "https://framerusercontent.com/images/fjcQXwaj9Papb4de7DObfDCG6z8.jpg"
const INSTAGRAM = "https://www.instagram.com/byana_________/"

type Lang = "es" | "en" | "it"
type View = "info" | "tape" | "label" | "term"

// ——— Contenido (del CV de Ana, con las erratas corregidas) ——————————————————
const PROJECTS = [
    { title: "404:NOT FOUND_", year: 2025, at: 2025.15, accent: "#6EA7CC", link: "/projects/404-not-found" },
    { title: "ASH ARCHIVE", year: 2025, at: 2025.38, accent: "#A95A45", link: "/projects/ash-archive" },
    { title: "FRAGMENTOS DE MÍ", year: 2025, at: 2025.6, accent: "#6A2028", link: "/projects/fragmentos-de-mi" },
    { title: "EX_CORPO", year: 2025, at: 2025.82, accent: "#243A2D", link: "/projects/ex-corpo" },
    { title: "AMMAN", year: 2026, at: 2026.3, accent: "#6A2028", link: "/projects/amman" },
]

const T = {
    es: {
        role: "Estudiante de Diseño de Moda · Sales & Showroom Assistant",
        place: "Madrid",
        views: { info: "Información", tape: "Trayectoria", label: "Etiqueta", term: "Terminal" },
        general: "General",
        kind: "Tipo",
        kindV: "Diseñadora de moda en formación",
        where: "Ubicación",
        now: "Ahora",
        nowV: "Grado en Diseño de Moda · ESD Madrid",
        langs: "Idiomas",
        langsV: "Español · Inglés B2 · Italiano B1",
        phone: "Teléfono",
        call: "Llamar",
        about: "Sobre mí",
        aboutP: [
            "La moda es mi vocación y mi forma de expresarme. Actualmente estudio Diseño de Moda y, a través de ello, me inspiro para conectar con las personas.",
            "A través de mi experiencia laboral he adquirido la capacidad de una atención al público excelente, implicándome en la importancia de escuchar, asesorar y ofrecer un servicio cercano y personalizado. No se trata de centrarse únicamente en la venta, sino de ayudar a cada persona a encontrar lo que realmente le hace sentir bien.",
            "Me adapto con rapidez, soy muy observadora y tengo una actitud siempre abierta a aprender. Aspiro a crecer profesionalmente dentro del mundo del retail, aportando mi entusiasmo, sensibilidad por el estilo y un trato humano en cada interacción.",
        ],
        experience: "Experiencia",
        jobs: [
            { when: "jul 2025 — ene 2026", from: 2025.5, to: 2026.05, org: "RENATTA & GO (El Corte Inglés)", role: "Dependienta", items: ["Atención al cliente en el córner.", "Gestión de la caja.", "Reposición y organización del producto en tienda (visual merchandising básico).", "Apoyo en la organización del almacén y control básico de inventario."] },
            { when: "sept 2024 — sept 2025", from: 2024.67, to: 2025.67, org: "KONECTA BPO", role: "Teleoperadora", items: ["Atención telefónica y resolución de incidencias de clientes.", "Gestión de consultas, reclamaciones y tramitación de expedientes.", "Uso de sistemas CRM y herramientas internas de soporte.", "Emisión y recepción de llamadas comerciales."] },
        ],
        education: "Estudios",
        studies: [
            { when: "2024 — actual", from: 2024.7, to: 2026.75, org: "Escuela Superior de Diseño, Madrid", role: "Grado universitario en Diseño de Moda" },
            { when: "2023 — 2024", from: 2023.7, to: 2024.5, org: "IES Puerta Bonita", role: "Grado Superior en Diseño Gráfico" },
            { when: "2021 — 2023", from: 2021.7, to: 2023.5, org: "IES Jorge Guillén", role: "Bachillerato" },
            { when: "2017 — 2021", from: 2017.7, to: 2021.5, org: "IES Jorge Guillén", role: "Educación Secundaria Obligatoria" },
        ],
        skills: "Habilidades",
        skillsL: ["Atención al cliente", "Visual merchandising", "Trabajo en equipo y tolerancia al estrés", "Comunicación efectiva", "Resolución de incidencias", "Gestión de inventarios", "Gestión multicanal", "Sistemas CRM y soporte telefónico", "Ofimática", "Estilo personal"],
        extra: "Formación adicional",
        extraL: ["Curso INSIDE LVMH", "Curso de iniciación al diseño gráfico", "Inglés — B2", "Italiano — B1"],
        projects: "Proyectos",
        download: "Descargar CV",
        print: "Imprimir…",
        contact: "Guardar contacto",
        recruiter: "30 s",
        recruiterTitle: "Ana en 30 segundos",
        recruiterLines: ["Estudiante de Diseño de Moda en ESD Madrid, con base en diseño gráfico.", "Experiencia real de cara al cliente: córner en El Corte Inglés y atención telefónica.", "Proyectos de autor sobre memoria, cuerpo y materia."],
        write: "Escribirle",
        tapeHint: "Arrastra la cinta",
        tapeStudies: "Estudios",
        tapeWork: "Trabajo",
        today: "HOY",
        labelComp: "Composición",
        labelCompV: ["Diseño de moda", "Diseño gráfico", "Atención al cliente", "Visual merchandising"],
        labelCare: "Instrucciones de cuidado",
        labelCareV: ["Trabaja bien en equipo", "Resiste la presión", "Escucha antes de vender", "Ordena el producto y el almacén", "Se adapta con rapidez"],
        labelSize: "Talla",
        labelMade: "Hecho en Madrid",
        tagFront: "Pieza única",
        tagBack: "No se trata de vender, sino de ayudar a cada persona a encontrar lo que de verdad le hace sentir bien.",
        tagHint: "Clic para girar",
        file: "CV_Ana_Gil.pdf",
        fileHint: "Arrastra el archivo al Dock o haz clic",
        printer: "Impresora",
        copies: "Copias",
        pages: "Páginas",
        pagesV: "Todas",
        paper: "Papel",
        cancel: "Cancelar",
        printing: "Imprimiendo…",
        done: "Listo. CV_Ana_Gil.pdf está en Descargas.",
        pdfNote: "",
        termHelp: "comandos: sobre · experiencia · estudios · habilidades · idiomas · proyectos · contacto · descargar · clear · exit",
        termHire: "Permiso concedido. Abriendo Nuevo mensaje…",
        termUnknown: "comando no encontrado:",
    },
    en: {
        role: "Fashion Design Student · Sales & Showroom Assistant",
        place: "Madrid",
        views: { info: "Info", tape: "Timeline", label: "Label", term: "Terminal" },
        general: "General",
        kind: "Kind",
        kindV: "Fashion designer in training",
        where: "Location",
        now: "Now",
        nowV: "BA Fashion Design · ESD Madrid",
        langs: "Languages",
        langsV: "Spanish · English B2 · Italian B1",
        phone: "Phone",
        call: "Call",
        about: "About me",
        aboutP: [
            "Fashion is my calling and my way of expressing myself. I'm currently studying Fashion Design, and it inspires me to connect with people.",
            "My work experience has taught me excellent customer care: listening, advising and offering a close, personal service. It isn't only about selling, but about helping each person find what truly makes them feel good.",
            "I adapt quickly, I'm very observant and always open to learning. I want to grow professionally in retail, bringing enthusiasm, a sensitivity for style and a human touch to every interaction.",
        ],
        experience: "Experience",
        jobs: [
            { when: "Jul 2025 — Jan 2026", from: 2025.5, to: 2026.05, org: "RENATTA & GO (El Corte Inglés)", role: "Sales assistant", items: ["Customer service at the corner.", "Till management.", "Restocking and in-store product organisation (basic visual merchandising).", "Stockroom organisation and basic inventory control."] },
            { when: "Sep 2024 — Sep 2025", from: 2024.67, to: 2025.67, org: "KONECTA BPO", role: "Call centre agent", items: ["Phone support and customer issue resolution.", "Handling enquiries, complaints and case files.", "CRM systems and internal support tools.", "Inbound and outbound sales calls."] },
        ],
        education: "Education",
        studies: [
            { when: "2024 — present", from: 2024.7, to: 2026.75, org: "Escuela Superior de Diseño, Madrid", role: "BA (Hons) Fashion Design" },
            { when: "2023 — 2024", from: 2023.7, to: 2024.5, org: "IES Puerta Bonita", role: "Higher National Diploma in Graphic Design" },
            { when: "2021 — 2023", from: 2021.7, to: 2023.5, org: "IES Jorge Guillén", role: "Baccalaureate" },
            { when: "2017 — 2021", from: 2017.7, to: 2021.5, org: "IES Jorge Guillén", role: "Secondary education" },
        ],
        skills: "Skills",
        skillsL: ["Customer service", "Visual merchandising", "Teamwork and working under pressure", "Clear communication", "Issue resolution", "Inventory management", "Omnichannel management", "CRM systems and phone support", "Office software", "Personal style"],
        extra: "Further training",
        extraL: ["INSIDE LVMH course", "Introduction to graphic design course", "English — B2", "Italian — B1"],
        projects: "Projects",
        download: "Download CV",
        print: "Print…",
        contact: "Save contact",
        recruiter: "30 s",
        recruiterTitle: "Ana in 30 seconds",
        recruiterLines: ["Fashion Design student at ESD Madrid, with a background in graphic design.", "Real customer-facing experience: an El Corte Inglés corner and phone support.", "Authorial projects on memory, body and matter."],
        write: "Write to her",
        tapeHint: "Drag the tape",
        tapeStudies: "Education",
        tapeWork: "Work",
        today: "TODAY",
        labelComp: "Composition",
        labelCompV: ["Fashion design", "Graphic design", "Customer care", "Visual merchandising"],
        labelCare: "Care instructions",
        labelCareV: ["Works well in a team", "Handles pressure", "Listens before selling", "Keeps product and stockroom in order", "Adapts quickly"],
        labelSize: "Size",
        labelMade: "Made in Madrid",
        tagFront: "One of a kind",
        tagBack: "It isn't about selling, but about helping each person find what truly makes them feel good.",
        tagHint: "Click to flip",
        file: "CV_Ana_Gil.pdf",
        fileHint: "Drag the file to the Dock or click",
        printer: "Printer",
        copies: "Copies",
        pages: "Pages",
        pagesV: "All",
        paper: "Paper",
        cancel: "Cancel",
        printing: "Printing…",
        done: "Done. CV_Ana_Gil.pdf is in Downloads.",
        pdfNote: "The PDF is in Spanish.",
        termHelp: "commands: about · experience · education · skills · languages · projects · contact · download · clear · exit",
        termHire: "Permission granted. Opening New message…",
        termUnknown: "command not found:",
    },
    it: {
        role: "Studentessa di Fashion Design · Sales & Showroom Assistant",
        place: "Madrid",
        views: { info: "Informazioni", tape: "Percorso", label: "Etichetta", term: "Terminale" },
        general: "Generale",
        kind: "Tipo",
        kindV: "Fashion designer in formazione",
        where: "Luogo",
        now: "Ora",
        nowV: "Laurea in Fashion Design · ESD Madrid",
        langs: "Lingue",
        langsV: "Spagnolo · Inglese B2 · Italiano B1",
        phone: "Telefono",
        call: "Chiama",
        about: "Chi sono",
        aboutP: [
            "La moda è la mia vocazione e il mio modo di esprimermi. Studio Fashion Design e da lì prendo ispirazione per entrare in contatto con le persone.",
            "Con l'esperienza lavorativa ho imparato a offrire un'ottima assistenza al pubblico: ascoltare, consigliare e dare un servizio vicino e personale. Non si tratta solo di vendere, ma di aiutare ogni persona a trovare ciò che la fa sentire davvero bene.",
            "Mi adatto in fretta, sono molto attenta e sempre pronta a imparare. Voglio crescere nel mondo del retail, portando entusiasmo, sensibilità per lo stile e un tocco umano in ogni interazione.",
        ],
        experience: "Esperienza",
        jobs: [
            { when: "lug 2025 — gen 2026", from: 2025.5, to: 2026.05, org: "RENATTA & GO (El Corte Inglés)", role: "Commessa", items: ["Assistenza clienti nel corner.", "Gestione della cassa.", "Riassortimento e organizzazione del prodotto in negozio (visual merchandising di base).", "Supporto in magazzino e controllo base dell'inventario."] },
            { when: "set 2024 — set 2025", from: 2024.67, to: 2025.67, org: "KONECTA BPO", role: "Operatrice telefonica", items: ["Assistenza telefonica e risoluzione dei problemi dei clienti.", "Gestione di richieste, reclami e pratiche.", "Sistemi CRM e strumenti interni di supporto.", "Chiamate commerciali in entrata e in uscita."] },
        ],
        education: "Formazione",
        studies: [
            { when: "2024 — oggi", from: 2024.7, to: 2026.75, org: "Escuela Superior de Diseño, Madrid", role: "Laurea in Fashion Design" },
            { when: "2023 — 2024", from: 2023.7, to: 2024.5, org: "IES Puerta Bonita", role: "Diploma superiore in Graphic Design" },
            { when: "2021 — 2023", from: 2021.7, to: 2023.5, org: "IES Jorge Guillén", role: "Maturità" },
            { when: "2017 — 2021", from: 2017.7, to: 2021.5, org: "IES Jorge Guillén", role: "Scuola secondaria" },
        ],
        skills: "Competenze",
        skillsL: ["Assistenza clienti", "Visual merchandising", "Lavoro di squadra e gestione dello stress", "Comunicazione efficace", "Risoluzione dei problemi", "Gestione dell'inventario", "Gestione multicanale", "Sistemi CRM e supporto telefonico", "Office", "Stile personale"],
        extra: "Altra formazione",
        extraL: ["Corso INSIDE LVMH", "Corso introduttivo di graphic design", "Inglese — B2", "Italiano — B1"],
        projects: "Progetti",
        download: "Scarica il CV",
        print: "Stampa…",
        contact: "Salva contatto",
        recruiter: "30 s",
        recruiterTitle: "Ana in 30 secondi",
        recruiterLines: ["Studentessa di Fashion Design all'ESD di Madrid, con una base in graphic design.", "Esperienza reale a contatto con il cliente: corner a El Corte Inglés e assistenza telefonica.", "Progetti d'autore su memoria, corpo e materia."],
        write: "Scrivile",
        tapeHint: "Trascina il metro",
        tapeStudies: "Studi",
        tapeWork: "Lavoro",
        today: "OGGI",
        labelComp: "Composizione",
        labelCompV: ["Fashion design", "Graphic design", "Assistenza clienti", "Visual merchandising"],
        labelCare: "Istruzioni di cura",
        labelCareV: ["Lavora bene in squadra", "Regge la pressione", "Ascolta prima di vendere", "Tiene in ordine prodotto e magazzino", "Si adatta in fretta"],
        labelSize: "Taglia",
        labelMade: "Fatto a Madrid",
        tagFront: "Pezzo unico",
        tagBack: "Non si tratta di vendere, ma di aiutare ogni persona a trovare ciò che la fa sentire davvero bene.",
        tagHint: "Clic per girare",
        file: "CV_Ana_Gil.pdf",
        fileHint: "Trascina il file nel Dock o fai clic",
        printer: "Stampante",
        copies: "Copie",
        pages: "Pagine",
        pagesV: "Tutte",
        paper: "Carta",
        cancel: "Annulla",
        printing: "Stampa in corso…",
        done: "Fatto. CV_Ana_Gil.pdf è in Download.",
        pdfNote: "Il PDF è in spagnolo.",
        termHelp: "comandi: chi · esperienza · studi · competenze · lingue · progetti · contatto · scarica · clear · exit",
        termHire: "Permesso concesso. Apro Nuovo messaggio…",
        termUnknown: "comando non trovato:",
    },
}
type Copy = (typeof T)["es"]

// ——— Utilidades ——————————————————————————————————————————————————————————
function useNarrow(bp = 700) {
    const [n, setN] = React.useState(false)
    React.useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${bp}px)`)
        const u = () => setN(mq.matches)
        u()
        mq.addEventListener?.("change", u)
        return () => mq.removeEventListener?.("change", u)
    }, [bp])
    return n
}

function saveBlob(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 4000)
}

async function downloadPdf() {
    try {
        const r = await fetch(PDF_URL)
        if (!r.ok) throw new Error()
        saveBlob(await r.blob(), "CV_Ana_Gil.pdf")
    } catch {
        window.open(PDF_URL, "_blank", "noopener")
    }
}

const telHref = (p: string) => `tel:${p.replace(/[^+\d]/g, "")}`

function saveVCard(email: string, phone: string) {
    const site = typeof location !== "undefined" ? location.origin : ""
    const v = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "N:Gil;Ana;;;",
        "FN:Ana Gil",
        "TITLE:Fashion Design Student",
        "ORG:Escuela Superior de Diseño de Madrid",
        `EMAIL;TYPE=INTERNET:${email}`,
        phone && `TEL;TYPE=CELL:${phone.replace(/\s+/g, "")}`,
        site && `URL:${site}`,
        `URL;TYPE=Instagram:${INSTAGRAM}`,
        "ADR;TYPE=HOME:;;;Madrid;;;España",
        "END:VCARD",
    ]
        .filter(Boolean)
        .join("\r\n")
    saveBlob(new Blob([v], { type: "text/vcard" }), "Ana_Gil.vcf")
}

// El icono del PDF vuela hasta el Dock (abajo, centro) como una descarga de Safari
function flyToDock(from: DOMRect) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const el = document.createElement("div")
    const dock = document.querySelector('nav[aria-label="Dock"]')?.getBoundingClientRect()
    const tx = dock ? dock.right - 40 : window.innerWidth / 2
    const ty = dock ? dock.top + 10 : window.innerHeight - 60
    Object.assign(el.style, {
        position: "fixed",
        left: `${from.left}px`,
        top: `${from.top}px`,
        width: `${from.width}px`,
        height: `${from.height}px`,
        zIndex: "3000",
        pointerEvents: "none",
        background: `#FBFAF7 url(${PAGE_PREVIEW}) center/cover`,
        border: "1px solid #111",
        boxShadow: "0 10px 30px rgba(0,0,0,.2)",
    } as CSSStyleDeclaration)
    document.body.appendChild(el)
    const dx = tx - (from.left + from.width / 2)
    const dy = ty - (from.top + from.height / 2)
    const a = el.animate(
        [
            { transform: "translate(0,0) scale(1)", opacity: 1 },
            { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 140}px) scale(.7)`, opacity: 1, offset: 0.45 },
            { transform: `translate(${dx}px, ${dy}px) scale(.18)`, opacity: 0.2 },
        ],
        { duration: 900, easing: "cubic-bezier(.45,0,.25,1)", fill: "forwards" }
    )
    a.onfinish = () => el.remove()
}

// ——— Piezas comunes ——————————————————————————————————————————————————————
const btn: React.CSSProperties = { fontFamily: MONO, fontSize: 11, letterSpacing: "0.04em", padding: "4px 10px", border: `1px solid ${INK}`, background: "transparent", color: INK, cursor: "pointer", whiteSpace: "nowrap" }
const btnSolid: React.CSSProperties = { ...btn, background: INK, color: PAPER }
const eyebrow: React.CSSProperties = { fontFamily: MONO, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: ASH }

function Disclosure({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
    return (
        <div style={{ borderTop: `1px solid ${FOG}` }}>
            <button type="button" onClick={onToggle} aria-expanded={open} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "11px 0", border: "none", background: "transparent", color: INK, font: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
                <motion.svg width="9" height="9" viewBox="0 0 9 9" aria-hidden animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.18 }} style={{ flexShrink: 0 }}>
                    <path d="M2 1l5 3.5L2 8z" fill="currentColor" />
                </motion.svg>
                {title}
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: EASE }} style={{ overflow: "hidden" }}>
                        <div style={{ padding: "0 0 16px 18px" }}>{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "92px 1fr", gap: 12, padding: "3px 0", fontSize: 12.5, lineHeight: 1.45 }}>
            <span style={{ color: ASH, textAlign: "right" }}>{k}:</span>
            <span>{v}</span>
        </div>
    )
}

function PdfFile({ c, onDownload }: { c: Copy; onDownload: (r: DOMRect) => void }) {
    const ref = React.useRef<HTMLDivElement>(null)
    const dragged = React.useRef(false)
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <motion.div
                ref={ref}
                drag
                dragSnapToOrigin
                dragElastic={0.6}
                whileDrag={{ scale: 1.08, rotate: -3, zIndex: 50 }}
                onDragStart={() => (dragged.current = true)}
                onDragEnd={(_, info) => {
                    // Soltar cerca del borde inferior (el Dock) = descargar
                    if (info.point.y > window.innerHeight - 160 || Math.hypot(info.offset.x, info.offset.y) > 140) onDownload(ref.current!.getBoundingClientRect())
                    window.setTimeout(() => (dragged.current = false), 0)
                }}
                onClick={() => !dragged.current && onDownload(ref.current!.getBoundingClientRect())}
                role="button"
                tabIndex={0}
                aria-label={`${c.download} — ${c.file}`}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onDownload(ref.current!.getBoundingClientRect())}
                style={{ position: "relative", width: 54, height: 72, flexShrink: 0, cursor: "grab", touchAction: "none", background: `${"#FBFAF7"} url(${PAGE_PREVIEW}?scale-down-to=256) center/cover`, border: `1px solid ${INK}`, boxShadow: "0 6px 14px rgba(0,0,0,.12)" }}
            >
                <span style={{ position: "absolute", left: -1, bottom: 6, padding: "1px 4px", background: "#A95A45", color: "#F4F2ED", fontFamily: MONO, fontSize: 8, letterSpacing: "0.06em" }}>PDF</span>
            </motion.div>
            <div>
                <div style={{ fontFamily: MONO, fontSize: 11.5 }}>{c.file}</div>
                <div style={{ fontSize: 11.5, color: ASH, marginTop: 2 }}>{c.fileHint}</div>
            </div>
        </div>
    )
}

// ——— Vista: Información ——————————————————————————————————————————————————
function InfoView({ c, narrow, onDownload, email, phone }: { c: Copy; narrow: boolean; onDownload: (r: DOMRect) => void; email: string; phone: string }) {
    const [open, setOpen] = React.useState<Record<string, boolean>>({ general: true, about: true, exp: true, edu: false, skills: false, extra: false })
    const tog = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }))
    return (
        <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "240px 1fr", gap: narrow ? 24 : 40, padding: narrow ? "22px 16px 28px" : "32px 36px 36px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ position: "relative", width: narrow ? 160 : "100%", aspectRatio: "512 / 611", background: SIDE, border: `1px solid ${INK}` }}>
                    <img src={`${PORTRAIT}?scale-down-to=1024`} alt="Ana Gil" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "grayscale(1) contrast(1.02)" }} />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {PROJECTS.map((p) => (
                        <Link key={p.title} href={p.link}>
                            <a title={p.title} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.04em", color: INK, textDecoration: "none", padding: "2px 6px", border: `1px solid ${FOG}` }}>
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: p.accent }} />
                                {p.title}
                            </a>
                        </Link>
                    ))}
                </div>
                <PdfFile c={c} onDownload={onDownload} />
            </div>

            <div style={{ minWidth: 0 }}>
                <div style={{ ...eyebrow, marginBottom: 10 }}>Ana Gil — {c.place}</div>
                <h1 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 400, fontSize: narrow ? 56 : 84, lineHeight: 0.92, letterSpacing: "-0.02em", fontVariationSettings: '"opsz" 96' }}>Ana Gil</h1>
                <div style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: "0.04em", margin: "12px 0 24px" }}>{c.role}</div>

                <Disclosure title={c.general} open={open.general} onToggle={() => tog("general")}>
                    <Row k={c.kind} v={c.kindV} />
                    <Row k={c.where} v={c.place} />
                    <Row k={c.now} v={c.nowV} />
                    <Row k={c.langs} v={c.langsV} />
                    <Row k="Email" v={<a href={`mailto:${email}`} style={{ color: INK }}>{email}</a>} />
                    {phone && <Row k={c.phone} v={<a href={telHref(phone)} style={{ color: INK }}>{phone}</a>} />}
                </Disclosure>
                <Disclosure title={c.about} open={open.about} onToggle={() => tog("about")}>
                    {c.aboutP.map((p, i) => (
                        <p key={i} style={{ margin: "0 0 10px", fontSize: 13.5, lineHeight: 1.6, maxWidth: 560 }}>
                            {p}
                        </p>
                    ))}
                </Disclosure>
                <Disclosure title={c.experience} open={open.exp} onToggle={() => tog("exp")}>
                    {c.jobs.map((j) => (
                        <div key={j.org} style={{ marginBottom: 16 }}>
                            <div style={eyebrow}>{j.when}</div>
                            <div style={{ fontSize: 13.5, fontWeight: 600, margin: "3px 0 6px" }}>
                                {j.org} <span style={{ fontWeight: 400, color: ASH }}>· {j.role}</span>
                            </div>
                            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, lineHeight: 1.6 }}>
                                {j.items.map((it) => (
                                    <li key={it}>{it}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </Disclosure>
                <Disclosure title={c.education} open={open.edu} onToggle={() => tog("edu")}>
                    {c.studies.map((s) => (
                        <div key={s.when} style={{ marginBottom: 12 }}>
                            <div style={eyebrow}>{s.when}</div>
                            <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 3 }}>{s.org}</div>
                            <div style={{ fontSize: 12.5, color: ASH }}>{s.role}</div>
                        </div>
                    ))}
                </Disclosure>
                <Disclosure title={c.skills} open={open.skills} onToggle={() => tog("skills")}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {c.skillsL.map((s) => (
                            <span key={s} style={{ fontSize: 12, padding: "3px 8px", border: `1px solid ${INK}`, borderRadius: 999 }}>
                                {s}
                            </span>
                        ))}
                    </div>
                </Disclosure>
                <Disclosure title={c.extra} open={open.extra} onToggle={() => tog("extra")}>
                    {c.extraL.map((s) => (
                        <div key={s} style={{ fontSize: 13, lineHeight: 1.7 }}>
                            {s}
                        </div>
                    ))}
                </Disclosure>
            </div>
        </div>
    )
}

// ——— Vista: Trayectoria (cinta métrica) ——————————————————————————————————
const Y0 = 2017
const Y1 = 2027
const NOW = 2026.76

function TapeView({ c, narrow }: { c: Copy; narrow: boolean }) {
    const reduce = useReducedMotion()
    const PX = narrow ? 150 : 230 // px por año
    const W = (Y1 - Y0) * PX
    const wrap = React.useRef<HTMLDivElement>(null)
    const [vw, setVw] = React.useState(800)
    const x = useMotionValue(0)
    const [sel, setSel] = React.useState<string | null>("esd")

    const pos = (y: number) => (y - Y0) * PX

    React.useLayoutEffect(() => {
        const w = wrap.current?.clientWidth ?? 800
        setVw(w)
        // Empieza enseñando los últimos años (ESD, trabajo, proyectos)
        const target = w - pos(NOW) - (w < 500 ? 40 : 90)
        x.set(Math.max(Math.min(target, 0), w - W))
    }, [PX, W, x])
    type Seg = { id: string; from: number; to: number; title: string; sub: string; when: string; lane: "top" | "bottom" }
    const segs: Seg[] = [
        ...c.studies.map((s, i) => ({ id: i === 0 ? "esd" : `s${i}`, from: s.from, to: s.to, title: s.org, sub: s.role, when: s.when, lane: "top" as const })),
        ...c.jobs.map((j, i) => ({ id: `j${i}`, from: j.from, to: j.to, title: j.org, sub: j.role, when: j.when, lane: "bottom" as const })),
    ]
    // Los trabajos se solapan: dos carriles inferiores
    const lane2 = (s: Seg) => (s.id === "j1" ? 1 : 0)
    const selected = segs.find((s) => s.id === sel)
    const selProject = PROJECTS.find((p) => p.title === sel)

    const go = (yr: number) => {
        const target = Math.max(Math.min(-(pos(yr) - vw / 2), 0), vw - W)
        animate(x, target, { duration: reduce ? 0 : 0.7, ease: EASE })
    }

    return (
        <div style={{ padding: narrow ? "20px 0 24px" : "28px 0 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, padding: narrow ? "0 16px 14px" : "0 36px 18px" }}>
                <div style={{ fontFamily: DISPLAY, fontSize: narrow ? 30 : 40, lineHeight: 1 }}>2017 — {new Date().getFullYear()}</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {[2017, 2021, 2023, 2024, 2025, 2026].map((yy) => (
                        <button key={yy} type="button" onClick={() => go(yy + 0.5)} style={{ ...btn, padding: "2px 6px", fontSize: 10 }}>
                            {yy}
                        </button>
                    ))}
                </div>
            </div>

            <div ref={wrap} style={{ position: "relative", overflow: "hidden", height: 300, cursor: "grab", touchAction: "pan-y" }}>
                <motion.div
                    drag="x"
                    dragConstraints={{ left: Math.min(vw - W, 0), right: 0 }}
                    dragElastic={0.08}
                    dragTransition={{ power: 0.25, timeConstant: 260 }}
                    whileDrag={{ cursor: "grabbing" }}
                    style={{ x, position: "absolute", top: 0, left: 0, width: W, height: 300 }}
                >
                    {/* Carril superior: estudios */}
                    <div style={{ position: "absolute", left: 8, top: 6, ...eyebrow }}>{c.tapeStudies}</div>
                    {segs
                        .filter((s) => s.lane === "top")
                        .map((s) => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => setSel(s.id)}
                                style={{ position: "absolute", left: pos(s.from), width: pos(s.to) - pos(s.from), top: 28, height: 56, padding: "6px 8px", textAlign: "left", border: `1px solid ${INK}`, background: sel === s.id ? INK : SHEET, color: sel === s.id ? PAPER : INK, font: "inherit", cursor: "pointer", overflow: "hidden" }}
                            >
                                <div style={{ fontSize: 11.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
                                <div style={{ fontSize: 10.5, opacity: 0.7, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.sub}</div>
                            </button>
                        ))}

                    {/* La cinta */}
                    <div style={{ position: "absolute", left: 0, right: 0, top: 104, height: 54, background: "#E9D9A6", borderTop: "1px solid rgba(0,0,0,.35)", borderBottom: "1px solid rgba(0,0,0,.35)", boxShadow: "0 6px 16px rgba(0,0,0,.08)" }}>
                        {Array.from({ length: (Y1 - Y0) * 12 + 1 }).map((_, i) => {
                            const year = i % 12 === 0
                            const half = i % 6 === 0
                            return <span key={i} style={{ position: "absolute", left: (i / 12) * PX, top: 0, width: 1, height: year ? 26 : half ? 16 : 9, background: "#1A1A1A", opacity: year ? 0.9 : 0.55 }} />
                        })}
                        {Array.from({ length: Y1 - Y0 + 1 }).map((_, i) => (
                            <span key={i} style={{ position: "absolute", left: i * PX + 5, bottom: 4, fontFamily: MONO, fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}>
                                {Y0 + i}
                            </span>
                        ))}
                        {/* Proyectos: puntos de color sobre la cinta */}
                        {PROJECTS.map((p) => (
                            <button
                                key={p.title}
                                type="button"
                                title={p.title}
                                onClick={() => setSel(p.title)}
                                style={{ position: "absolute", left: pos(p.at) - 7, top: -7, width: 14, height: 14, borderRadius: "50%", background: p.accent, border: "2px solid #FBFAF7", boxShadow: sel === p.title ? `0 0 0 3px ${p.accent}55, 0 0 14px ${p.accent}` : "none", cursor: "pointer", padding: 0 }}
                            />
                        ))}
                        {/* Hoy */}
                        <span style={{ position: "absolute", left: pos(NOW), top: -10, bottom: -10, width: 2, background: "#C0392B" }} />
                        <span style={{ position: "absolute", left: pos(NOW) + 6, top: -2, fontFamily: MONO, fontSize: 9, color: "#C0392B", letterSpacing: "0.08em" }}>{c.today}</span>
                    </div>

                    {/* Carriles inferiores: trabajo */}
                    <div style={{ position: "absolute", left: 8, top: 172, ...eyebrow }}>{c.tapeWork}</div>
                    {segs
                        .filter((s) => s.lane === "bottom")
                        .map((s) => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => setSel(s.id)}
                                style={{ position: "absolute", left: pos(s.from), width: pos(s.to) - pos(s.from), top: 194 + lane2(s) * 50, height: 44, padding: "5px 8px", textAlign: "left", border: `1px solid ${INK}`, background: sel === s.id ? INK : SIDE, color: sel === s.id ? PAPER : INK, font: "inherit", cursor: "pointer", overflow: "hidden" }}
                            >
                                <div style={{ fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
                                <div style={{ fontSize: 10.5, opacity: 0.7, whiteSpace: "nowrap" }}>{s.sub}</div>
                            </button>
                        ))}
                </motion.div>
            </div>
            <div style={{ ...eyebrow, padding: narrow ? "8px 16px 0" : "8px 36px 0" }}>← {c.tapeHint} →</div>

            {/* Ficha del elemento seleccionado */}
            <div style={{ margin: narrow ? "16px 16px 0" : "18px 36px 0", minHeight: 96, borderTop: `1px solid ${FOG}`, paddingTop: 16 }}>
                <AnimatePresence mode="wait">
                    {selected && (
                        <motion.div key={selected.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                            <div style={eyebrow}>{selected.when}</div>
                            <div style={{ fontFamily: DISPLAY, fontSize: 28, lineHeight: 1.1, margin: "4px 0" }}>{selected.title}</div>
                            <div style={{ fontSize: 13 }}>{selected.sub}</div>
                            {selected.lane === "bottom" && (
                                <ul style={{ margin: "8px 0 0", paddingLeft: 16, fontSize: 12.5, lineHeight: 1.6 }}>
                                    {c.jobs.find((j) => j.org === selected.title)?.items.map((it) => (
                                        <li key={it}>{it}</li>
                                    ))}
                                </ul>
                            )}
                        </motion.div>
                    )}
                    {selProject && (
                        <motion.div key={selProject.title} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
                            <div>
                                <div style={{ ...eyebrow, display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: selProject.accent }} />
                                    {c.projects} · {selProject.year}
                                </div>
                                <div style={{ fontFamily: DISPLAY, fontSize: 32, lineHeight: 1.1, marginTop: 4 }}>{selProject.title}</div>
                            </div>
                            <Link href={selProject.link}>
                                <a style={{ ...btnSolid, textDecoration: "none" }}>→</a>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

// ——— Vista: Etiqueta de prenda ——————————————————————————————————————————
function CareIcon({ i }: { i: number }) {
    const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.4 }
    return (
        <svg width="26" height="22" viewBox="0 0 26 22" aria-hidden style={{ flexShrink: 0 }}>
            {i === 0 && (
                <>
                    <path d="M2 5l2.5 14h17L24 5" {...s} />
                    <path d="M2 5c3 3 6 3 8 0 2 3 4 3 6 0 2 3 5 3 8 0" {...s} />
                    <circle cx="10" cy="13" r="2" {...s} />
                    <circle cx="16" cy="13" r="2" {...s} />
                </>
            )}
            {i === 1 && (
                <>
                    <path d="M5 17h14l3-6c0-2-2-3-4-3H8L5 4" {...s} />
                    <path d="M3 17h20" {...s} />
                </>
            )}
            {i === 2 && (
                <>
                    <rect x="3" y="2" width="20" height="18" {...s} />
                    <circle cx="13" cy="11" r="6" {...s} />
                </>
            )}
            {i === 3 && <path d="M13 2L24 20H2z" {...s} />}
            {i === 4 && (
                <>
                    <circle cx="13" cy="11" r="8.5" {...s} />
                    <path d="M8 11h10M13 6v10" {...s} />
                </>
            )}
        </svg>
    )
}

function LabelView({ c, narrow }: { c: Copy; narrow: boolean }) {
    const reduce = useReducedMotion()
    const [flip, setFlip] = React.useState(false)
    const swing = useMotionValue(0)
    const rot = useSpring(swing, { stiffness: 60, damping: 6, mass: 0.8 })
    const last = React.useRef<{ x: number; t: number } | null>(null)
    const settle = React.useRef(0)

    // El cartón se balancea con la velocidad del ratón
    const onMove = (e: React.PointerEvent) => {
        if (reduce) return
        const now = performance.now()
        if (last.current) {
            const v = (e.clientX - last.current.x) / Math.max(now - last.current.t, 1)
            swing.set(Math.max(-22, Math.min(22, v * 14)))
            window.clearTimeout(settle.current)
            settle.current = window.setTimeout(() => swing.set(0), 60)
        }
        last.current = { x: e.clientX, t: now }
    }
    const tagRotY = useTransform(rot, (r) => r * 0.6)

    return (
        <div onPointerMove={onMove} style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr", gap: narrow ? 36 : 48, padding: narrow ? "28px 16px 36px" : "40px 48px 48px", alignItems: "start" }}>
            {/* Etiqueta cosida + etiqueta de composición */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
                <div style={{ position: "relative", width: "min(320px, 100%)", padding: "18px 20px 16px", background: "#111111", color: "#F4F2ED", textAlign: "center", boxShadow: "0 8px 20px rgba(0,0,0,.18)" }}>
                    <div style={{ position: "absolute", inset: 5, border: "1px dashed rgba(244,242,237,.45)", pointerEvents: "none" }} />
                    <div style={{ fontFamily: DISPLAY, fontSize: 40, lineHeight: 1, letterSpacing: "0.04em" }}>ANA GIL</div>
                    <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.22em", marginTop: 8, opacity: 0.8 }}>FASHION DESIGN · MADRID</div>
                </div>

                <div style={{ position: "relative", width: "min(250px, 100%)", padding: "26px 20px 22px", background: "#FFFFFF", color: "#111111", boxShadow: "0 1px 0 rgba(0,0,0,.06), 0 10px 24px rgba(0,0,0,.10)", fontFamily: MONO, fontSize: 10.5, lineHeight: 1.6, letterSpacing: "0.03em" }}>
                    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 10, background: "repeating-linear-gradient(90deg, #ddd 0 4px, transparent 4px 8px)", opacity: 0.6 }} />
                    <div style={{ fontWeight: 500, marginBottom: 6 }}>{c.labelComp.toUpperCase()}</div>
                    {c.labelCompV.map((s) => (
                        <div key={s}>{s}</div>
                    ))}
                    <div style={{ height: 1, background: "#111", opacity: 0.2, margin: "12px 0" }} />
                    <div style={{ fontWeight: 500, marginBottom: 8 }}>{c.labelCare.toUpperCase()}</div>
                    {c.labelCareV.map((s, i) => (
                        <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                            <CareIcon i={i} />
                            <span>{s}</span>
                        </div>
                    ))}
                    <div style={{ height: 1, background: "#111", opacity: 0.2, margin: "12px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{c.labelSize.toUpperCase()}</span>
                        <span>ES · EN B2 · IT B1</span>
                    </div>
                    <div style={{ marginTop: 10, textAlign: "center", letterSpacing: "0.16em" }}>{c.labelMade.toUpperCase()}</div>
                </div>
            </div>

            {/* Cartón colgante */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", perspective: 900 }}>
                <svg width="2" height="70" aria-hidden style={{ display: "block" }}>
                    <line x1="1" y1="0" x2="1" y2="70" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" style={{ color: INK }} />
                </svg>
                <motion.button
                    type="button"
                    onClick={() => setFlip((f) => !f)}
                    aria-label={c.tagHint}
                    style={{ rotate: rot, rotateY: tagRotY, transformOrigin: "50% -70px", border: "none", padding: 0, background: "transparent", cursor: "pointer", font: "inherit" }}
                >
                    <motion.div animate={{ rotateY: flip ? 180 : 0 }} transition={{ duration: reduce ? 0 : 0.7, ease: EASE }} style={{ position: "relative", width: 230, height: 340, transformStyle: "preserve-3d" }}>
                        {[false, true].map((back) => (
                            <div
                                key={String(back)}
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    backfaceVisibility: "hidden",
                                    WebkitBackfaceVisibility: "hidden",
                                    transform: back ? "rotateY(180deg)" : undefined,
                                    background: back ? "#111111" : "#FBFAF7",
                                    color: back ? "#F4F2ED" : "#111111",
                                    border: "1px solid #111111",
                                    borderRadius: "18px 18px 4px 4px",
                                    boxShadow: "0 18px 40px rgba(0,0,0,.18)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    padding: "38px 22px 22px",
                                    boxSizing: "border-box",
                                    textAlign: "center",
                                }}
                            >
                                <span style={{ position: "absolute", top: 14, width: 12, height: 12, borderRadius: "50%", border: "1px solid currentColor", background: back ? "#F4F2ED" : "#111111", opacity: 0.85 }} />
                                {!back ? (
                                    <>
                                        <img src={`${PORTRAIT}?scale-down-to=512`} alt="" style={{ width: 120, height: 143, objectFit: "cover", filter: "grayscale(1)", border: "1px solid #111" }} />
                                        <div style={{ fontFamily: DISPLAY, fontSize: 34, lineHeight: 1, marginTop: 16 }}>Ana Gil</div>
                                        <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.14em", marginTop: 8 }}>{c.tagFront.toUpperCase()} · Nº 001</div>
                                        <div style={{ marginTop: "auto", width: "100%", height: 34, background: "repeating-linear-gradient(90deg,#111 0 2px,transparent 2px 4px,#111 4px 5px,transparent 5px 8px,#111 8px 11px,transparent 11px 13px)" }} />
                                        <div style={{ fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.2em", marginTop: 4 }}>ESD · MADRID · 2024—</div>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.14em", opacity: 0.7, marginTop: 10 }}>{c.about.toUpperCase()}</div>
                                        <p style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 22, lineHeight: 1.25, margin: "auto 0" }}>“{c.tagBack}”</p>
                                        <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.14em", opacity: 0.7 }}>— ANA GIL</div>
                                    </>
                                )}
                            </div>
                        ))}
                    </motion.div>
                </motion.button>
                <div style={{ ...eyebrow, marginTop: 18 }}>{c.tagHint}</div>
            </div>
        </div>
    )
}

// ——— Vista: Terminal ——————————————————————————————————————————————————————
function TerminalView({ c, lang, email, phone, onDownload }: { c: Copy; lang: Lang; email: string; phone: string; onDownload: () => void }) {
    const [lines, setLines] = React.useState<string[]>([])
    const [input, setInput] = React.useState("")
    const [typing, setTyping] = React.useState(true)
    const box = React.useRef<HTMLDivElement>(null)
    const inp = React.useRef<HTMLInputElement>(null)

    const sections = React.useMemo(() => {
        const s: Record<string, string[]> = {}
        s.about = c.aboutP.map((p) => "  " + p)
        s.exp = c.jobs.flatMap((j) => [`  [${j.when}] ${j.org} — ${j.role}`, ...j.items.map((i) => `    · ${i}`)])
        s.edu = c.studies.map((x) => `  [${x.when}] ${x.org} — ${x.role}`)
        s.skills = c.skillsL.map((x) => `  + ${x}`)
        s.langs = ["  ES ██████████  nativo", "  EN ████████░░  B2", "  IT ██████░░░░  B1"]
        s.projects = PROJECTS.map((p) => `  ${p.year}  ${p.title}`)
        s.contact = [`  email     ${email}`, ...(phone ? [`  tel       ${phone}`] : []), `  instagram @byana_________`]
        return s
    }, [c, email, phone])

    // Arranque: "> cat ana_gil.cv" tecleado y salida por bloques
    React.useEffect(() => {
        let alive = true
        setLines([])
        setTyping(true)
        const cmd = "cat ana_gil.cv"
        const out = [
            "",
            "ANA GIL",
            c.role,
            "",
            `## ${c.about}`,
            ...sections.about,
            "",
            `## ${c.experience}`,
            ...sections.exp,
            "",
            `## ${c.education}`,
            ...sections.edu,
            "",
            `## ${c.langs}`,
            ...sections.langs,
            "",
            c.termHelp,
        ]
        ;(async () => {
            const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms))
            let typed = ""
            for (const ch of cmd) {
                if (!alive) return
                typed += ch
                setLines([`> ${typed}`])
                await wait(45)
            }
            await wait(250)
            for (let i = 0; i < out.length; i++) {
                if (!alive) return
                setLines((l) => [...l, out[i]])
                await wait(out[i] === "" ? 60 : 22)
            }
            setTyping(false)
        })()
        return () => {
            alive = false
        }
    }, [lang, c, sections])

    React.useEffect(() => {
        box.current?.scrollTo({ top: box.current.scrollHeight })
    }, [lines])

    const run = (raw: string) => {
        const cmd = raw.trim().toLowerCase()
        const echo = `> ${raw}`
        const map: Record<string, string[] | (() => string[])> = {
            help: [c.termHelp],
            ayuda: [c.termHelp],
            aiuto: [c.termHelp],
            sobre: sections.about,
            about: sections.about,
            chi: sections.about,
            experiencia: sections.exp,
            experience: sections.exp,
            esperienza: sections.exp,
            estudios: sections.edu,
            education: sections.edu,
            studi: sections.edu,
            habilidades: sections.skills,
            skills: sections.skills,
            competenze: sections.skills,
            idiomas: sections.langs,
            languages: sections.langs,
            lingue: sections.langs,
            proyectos: sections.projects,
            projects: sections.projects,
            progetti: sections.projects,
            contacto: sections.contact,
            contact: sections.contact,
            contatto: sections.contact,
            whoami: ["  ana_gil"],
            ls: ["  ana_gil.cv   CV_Ana_Gil.pdf   proyectos/   papelera/"],
        }
        if (!cmd) return setLines((l) => [...l, ">"])
        if (cmd === "clear") return setLines([])
        if (["descargar", "download", "scarica"].includes(cmd)) {
            onDownload()
            return setLines((l) => [...l, echo, "  ↓ CV_Ana_Gil.pdf"])
        }
        if (cmd === "exit") {
            setLines((l) => [...l, echo, "  logout"])
            window.setTimeout(() => window.dispatchEvent(new CustomEvent("ag:cv-view", { detail: "info" })), 500)
            return
        }
        if (cmd.startsWith("sudo")) {
            setLines((l) => [...l, echo, `  ${c.termHire}`])
            window.setTimeout(() => window.location.assign("/contact"), 1100)
            return
        }
        const r = map[cmd]
        setLines((l) => [...l, echo, ...(r ? (typeof r === "function" ? r() : r) : [`  ${c.termUnknown} ${cmd}`])])
    }

    return (
        <div onClick={() => inp.current?.focus()} style={{ background: "#0E0E0E", color: "#E8E5DE", fontFamily: MONO, fontSize: 12.5, lineHeight: 1.6 }}>
            <div ref={box} style={{ height: 470, overflowY: "auto", padding: "18px 22px 8px", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {lines.map((l, i) => (
                    <div key={i} style={{ color: l.startsWith(">") ? "#F4F2ED" : l.startsWith("##") ? "#6EA7CC" : l === "ANA GIL" ? "#F4F2ED" : undefined, fontWeight: l === "ANA GIL" ? 500 : 400, minHeight: "1.6em" }}>
                        {l}
                    </div>
                ))}
                {!typing && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            run(input)
                            setInput("")
                        }}
                        style={{ display: "flex", gap: 8 }}
                    >
                        <span>{">"}</span>
                        <input
                            ref={inp}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            autoFocus
                            spellCheck={false}
                            autoCapitalize="off"
                            aria-label="Terminal"
                            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#F4F2ED", font: "inherit", caretColor: "#A95A45" }}
                        />
                    </form>
                )}
            </div>
        </div>
    )
}

// ——— Diálogo de imprimir ————————————————————————————————————————————————————
function PrintSheet({ c, onClose, onDone }: { c: Copy; onClose: () => void; onDone: () => void }) {
    const reduce = useReducedMotion()
    const [stage, setStage] = React.useState<"setup" | "printing" | "done">("setup")
    const print = () => {
        setStage("printing")
        window.setTimeout(
            () => {
                onDone()
                setStage("done")
            },
            reduce ? 0 : 2200
        )
    }
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 40, background: "var(--ag-scrim, rgba(17,17,17,0.12))", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
            <motion.div
                role="dialog"
                aria-label={c.print}
                initial={{ y: -30 }}
                animate={{ y: 0 }}
                exit={{ y: -30 }}
                transition={{ duration: 0.3, ease: EASE }}
                onClick={(e) => e.stopPropagation()}
                style={{ width: "min(640px, calc(100% - 24px))", background: PAPER, border: `1px solid ${INK}`, borderTop: "none", display: "grid", gridTemplateColumns: "minmax(0, 220px) 1fr", gap: 20, padding: 20, boxSizing: "border-box" }}
            >
                {/* Impresora con la hoja */}
                <div style={{ position: "relative", height: 330, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ position: "relative", zIndex: 2, width: 200, height: 46, background: SIDE, border: `1px solid ${INK}`, borderRadius: "6px 6px 2px 2px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", boxSizing: "border-box" }}>
                        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.1em" }}>AG · LASERWRITER</span>
                        <motion.span animate={stage === "printing" ? { opacity: [1, 0.2, 1] } : { opacity: 1 }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ width: 7, height: 7, borderRadius: "50%", background: stage === "setup" ? "#28C840" : "#FEBC2E" }} />
                    </div>
                    <div style={{ position: "relative", zIndex: 3, width: 170, height: 6, background: INK, marginTop: -2 }} />
                    <div style={{ position: "relative", width: 160, height: 270, overflow: "hidden" }}>
                        <motion.img
                            src={`${PAGE_PREVIEW}?scale-down-to=512`}
                            alt=""
                            initial={false}
                            animate={{ y: stage === "setup" ? 0 : stage === "printing" ? [0, -250, 0] : 0 }}
                            transition={stage === "printing" ? { duration: 2.1, times: [0, 0.15, 1], ease: "easeInOut" } : { duration: 0 }}
                            style={{ width: 160, display: "block", boxShadow: "0 6px 16px rgba(0,0,0,.15)", border: "1px solid rgba(0,0,0,.15)" }}
                        />
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", fontSize: 12.5 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 14 }}>{c.print.replace("…", "")}</div>
                    {[
                        [c.printer, "AG · LaserWriter"],
                        [c.copies, "1"],
                        [c.pages, c.pagesV],
                        [c.paper, "A4"],
                    ].map(([k, v]) => (
                        <div key={k} style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: 10, alignItems: "center", marginBottom: 8 }}>
                            <span style={{ color: ASH, textAlign: "right" }}>{k}:</span>
                            <span style={{ border: `1px solid ${FOG}`, padding: "3px 8px", background: SHEET }}>{v}</span>
                        </div>
                    ))}
                    {c.pdfNote && <div style={{ color: ASH, fontSize: 11.5, marginTop: 4 }}>{c.pdfNote}</div>}
                    <div style={{ marginTop: "auto", minHeight: 20, fontFamily: MONO, fontSize: 11, color: ASH }}>{stage === "printing" ? c.printing : stage === "done" ? c.done : ""}</div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
                        <button type="button" onClick={onClose} style={btn}>
                            {stage === "done" ? "OK" : c.cancel}
                        </button>
                        {stage !== "done" && (
                            <button type="button" onClick={print} disabled={stage === "printing"} style={{ ...btnSolid, opacity: stage === "printing" ? 0.5 : 1 }}>
                                {c.print.replace("…", "")}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

// ——— Modo reclutador ——————————————————————————————————————————————————————
function Recruiter({ c, phone, onClose, onDownload }: { c: Copy; phone: string; onClose: () => void; onDownload: () => void }) {
    const reduce = useReducedMotion()
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 40, background: "var(--ag-scrim, rgba(17,17,17,0.12))", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} role="dialog" aria-label={c.recruiterTitle} style={{ width: "min(560px, 100%)", background: PAPER, border: `1px solid ${INK}`, overflow: "hidden" }}>
                <motion.div initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: reduce ? 0 : 30, ease: "linear" }} style={{ height: 3, background: "#A95A45", transformOrigin: "0 50%" }} />
                <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 20, padding: 22 }}>
                    <img src={`${PORTRAIT}?scale-down-to=512`} alt="Ana Gil" style={{ width: 110, height: 131, objectFit: "cover", filter: "grayscale(1)", border: `1px solid ${INK}` }} />
                    <div>
                        <div style={eyebrow}>{c.recruiterTitle}</div>
                        <div style={{ fontFamily: DISPLAY, fontSize: 40, lineHeight: 1, margin: "6px 0 12px" }}>Ana Gil</div>
                        {c.recruiterLines.map((l, i) => (
                            <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, lineHeight: 1.5, marginBottom: 6 }}>
                                <span style={{ fontFamily: MONO, color: ASH }}>{i + 1}</span>
                                <span>{l}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 22px 16px" }}>
                    {PROJECTS.slice(1, 4).map((p) => (
                        <Link key={p.title} href={p.link}>
                            <a style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: MONO, fontSize: 10.5, color: INK, textDecoration: "none", padding: "3px 8px", border: `1px solid ${INK}` }}>
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: p.accent }} />
                                {p.title}
                            </a>
                        </Link>
                    ))}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "12px 22px", borderTop: `1px solid ${FOG}` }}>
                    {phone && (
                        <a href={telHref(phone)} style={{ ...btn, textDecoration: "none" }}>
                            {c.call}
                        </a>
                    )}
                    <Link href="/contact">
                        <a style={{ ...btn, textDecoration: "none" }}>{c.write}</a>
                    </Link>
                    <button type="button" onClick={onDownload} style={btnSolid}>
                        ↓ {c.download}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

// ——— Ventana ————————————————————————————————————————————————————————————————
interface Props {
    email: string
    phone: string
    startView: View
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 980
 * @framerIntrinsicHeight 760
 */
export default function CVWindow({ email, phone, startView, style }: Props) {
    const narrow = useNarrow()
    const [lang, setLang] = React.useState<Lang>("es")
    const [view, setView] = React.useState<View>(startView || "info")
    const [printOpen, setPrintOpen] = React.useState(false)
    const [rec, setRec] = React.useState(false)
    const c = T[lang] as Copy
    const winRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        try {
            const saved = localStorage.getItem("ag-cv-lang") as Lang | null
            const nav = (navigator.language || "es").slice(0, 2)
            setLang(saved && T[saved] ? saved : nav === "it" ? "it" : nav === "es" ? "es" : "en")
        } catch {}
        const onView = (e: Event) => setView((e as CustomEvent).detail)
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return
            setPrintOpen(false)
            setRec(false)
        }
        window.addEventListener("ag:cv-view", onView)
        window.addEventListener("keydown", onKey)
        return () => {
            window.removeEventListener("ag:cv-view", onView)
            window.removeEventListener("keydown", onKey)
        }
    }, [])
    const pickLang = (l: Lang) => {
        setLang(l)
        try {
            localStorage.setItem("ag-cv-lang", l)
        } catch {}
    }

    const download = (from?: DOMRect) => {
        const r = from ?? winRef.current?.querySelector("[data-ag-dl]")?.getBoundingClientRect()
        if (r) flyToDock(r)
        downloadPdf()
    }

    const startDrag = (e: React.PointerEvent) => {
        if ((e.target as HTMLElement).closest("a,button,input")) return
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
        window.dispatchEvent(new CustomEvent("ag:window-drag-start", { detail: e.nativeEvent }))
    }

    const views: View[] = ["info", "tape", "label", "term"]

    return (
        <div ref={winRef} style={{ ...style, position: "relative", width: "100%", background: PAPER, border: `1px solid ${INK}`, color: INK, fontFamily: UI, boxSizing: "border-box", overflow: "hidden" }}>
            {/* Barra de título */}
            <div onPointerDown={startDrag} onDoubleClick={() => window.dispatchEvent(new CustomEvent("ag:window-drag-reset"))} style={{ height: 40, display: "flex", alignItems: "center", gap: 14, padding: "0 16px", borderBottom: `1px solid ${INK}`, cursor: "grab", userSelect: "none", touchAction: "none" }}>
                <div style={{ display: "flex", gap: 8 }}>
                    <Link href="/">
                        <a aria-label="Cerrar" style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57", display: "block" }} />
                    </Link>
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
                </div>
                <div style={{ flex: 1, textAlign: "center", fontFamily: MONO, fontSize: 12, letterSpacing: "0.04em", marginRight: narrow ? 0 : 52, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    Ana Gil — {c.views.info}
                </div>
            </div>

            {/* Herramientas */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "8px 12px", borderBottom: `1px solid ${FOG}`, flexWrap: "wrap" }}>
                <div role="tablist" style={{ display: "flex", border: `1px solid ${INK}`, overflowX: "auto", maxWidth: "100%" }}>
                    {views.map((v, i) => (
                        <button key={v} role="tab" aria-selected={view === v} type="button" onClick={() => setView(v)} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.04em", padding: "4px 11px", border: "none", borderLeft: i ? `1px solid ${INK}` : "none", background: view === v ? INK : "transparent", color: view === v ? PAPER : INK, cursor: "pointer", whiteSpace: "nowrap" }}>
                            {c.views[v]}
                        </button>
                    ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", border: `1px solid ${FOG}` }}>
                        {(["es", "en", "it"] as Lang[]).map((l) => (
                            <button key={l} type="button" onClick={() => pickLang(l)} aria-pressed={lang === l} style={{ fontFamily: MONO, fontSize: 10.5, padding: "3px 7px", border: "none", background: lang === l ? SIDE : "transparent", color: lang === l ? INK : ASH, cursor: "pointer", textTransform: "uppercase" }}>
                                {l}
                            </button>
                        ))}
                    </div>
                    <button type="button" onClick={() => setRec(true)} title={c.recruiterTitle} style={btn}>
                        ⏱ {c.recruiter}
                    </button>
                    <button type="button" onClick={() => saveVCard(email, phone)} style={btn}>
                        {c.contact}
                    </button>
                    <button type="button" onClick={() => setPrintOpen(true)} style={btn}>
                        {c.print}
                    </button>
                    <button type="button" data-ag-dl onClick={(e) => download((e.currentTarget as HTMLElement).getBoundingClientRect())} style={btnSolid}>
                        ↓ PDF
                    </button>
                </div>
            </div>

            {/* Contenido */}
            <div style={{ background: SHEET, minHeight: 470 }}>
                <AnimatePresence mode="wait">
                    <motion.div key={view + lang} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                        {view === "info" && <InfoView c={c} narrow={narrow} onDownload={download} email={email} phone={phone} />}
                        {view === "tape" && <TapeView c={c} narrow={narrow} />}
                        {view === "label" && <LabelView c={c} narrow={narrow} />}
                        {view === "term" && <TerminalView c={c} lang={lang} email={email} phone={phone} onDownload={() => download()} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Barra de estado */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "6px 16px", borderTop: `1px solid ${FOG}`, fontFamily: MONO, fontSize: 10.5, color: ASH, letterSpacing: "0.04em" }}>
                <span>Ana Gil / Currículum</span>
                <span>{c.file} · 852 KB</span>
            </div>

            <AnimatePresence>
                {printOpen && <PrintSheet c={c} onClose={() => setPrintOpen(false)} onDone={() => download()} />}
                {rec && <Recruiter c={c} phone={phone} onClose={() => setRec(false)} onDownload={() => download()} />}
            </AnimatePresence>
        </div>
    )
}

CVWindow.defaultProps = { email: "anagilgonzalez06@gmail.com", phone: "+34 673 71 85 98", startView: "info" }

addPropertyControls(CVWindow, {
    email: { type: ControlType.String, title: "Email" },
    phone: { type: ControlType.String, title: "Teléfono" },
    startView: {
        type: ControlType.Enum,
        title: "Vista inicial",
        options: ["info", "tape", "label", "term"],
        optionTitles: ["Información", "Trayectoria", "Etiqueta", "Terminal"],
    },
})
