// Contacto — ventana "Nuevo mensaje" de Mail.
// Envío real con Web3Forms (gratis): basta con poner la clave en VITE_WEB3FORMS_KEY.
// Sin clave, el botón abre el correo del visitante con el mensaje ya escrito.
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Window, { INK, ASH, MONO, UI, PAPER, DISPLAY, opsz } from "../shell/Window"
import PostStamp from "../components/PostStamp"
import { track } from "../lib/analytics"

const EMAIL = "anagilgonzalez06@gmail.com"
const KEY = (import.meta as any).env?.VITE_WEB3FORMS_KEY as string | undefined

type State = "idle" | "sending" | "sent" | "error"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="ag-mail-row" style={{ display: "flex", alignItems: "center", gap: 18, minHeight: 48, padding: "0 20px", borderBottom: `1px solid ${INK}` }}>
            <span style={{ flex: "0 0 62px", fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: ASH }}>{label}</span>
            {children}
        </label>
    )
}

const input: React.CSSProperties = { flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", fontFamily: UI, fontSize: 14, color: INK, padding: "14px 0" }

export default function ContactPage() {
    const [state, setState] = React.useState<State>("idle")
    const formRef = React.useRef<HTMLFormElement>(null)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const f = new FormData(e.currentTarget)
        if (f.get("botcheck")) return
        const name = String(f.get("name") || "")
        const from = String(f.get("email") || "")
        const subject = String(f.get("subject") || "") || "Mensaje desde el portfolio"
        const message = String(f.get("message") || "")
        track("contacto")
        if (!KEY) {
            const body = `${message}\n\n— ${name} <${from}>`
            window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
            setState("sent")
            return
        }
        setState("sending")
        try {
            const r = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ access_key: KEY, from_name: "Portfolio Ana Gil", subject: `Portfolio · ${subject}`, name, email: from, replyto: from, message }),
            })
            const j = await r.json().catch(() => ({}))
            setState(r.ok && j.success !== false ? "sent" : "error")
            if (r.ok) formRef.current?.reset()
        } catch {
            setState("error")
        }
    }

    return (
        <Window
            label="Nuevo mensaje"
            title="Nuevo mensaje"
            bodyStyle={{ display: "flex", flexDirection: "column" }}
        >
            <form ref={formRef} onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
                <div style={{ position: "absolute", right: 14, top: 10, zIndex: 2 }}>
                    <PostStamp color="#6A2028" />
                </div>
                <Row label="Para:">
                    <span style={{ fontFamily: MONO, fontSize: 11.5, border: `1px solid ${INK}`, padding: "2px 9px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "calc(100% - 150px)" }}>Ana Gil &lt;{EMAIL}&gt;</span>
                </Row>
                <Row label="Nombre:">
                    <input name="name" required autoComplete="name" placeholder="Tu nombre" style={input} />
                </Row>
                <Row label="De:">
                    <input name="email" type="email" required autoComplete="email" placeholder="tu@email.com" style={input} />
                </Row>
                <Row label="Asunto:">
                    <input name="subject" placeholder="Colaboración, prácticas, encargo…" style={input} />
                </Row>
                <input type="checkbox" name="botcheck" tabIndex={-1} aria-hidden style={{ display: "none" }} />
                <textarea name="message" required aria-label="Mensaje" placeholder="Escribe tu mensaje…" style={{ ...input, flex: 1, minHeight: 240, padding: "20px", resize: "none", lineHeight: 1.55, fontSize: 15 }} />

                <AnimatePresence>
                    {state === "sent" && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status" style={{ position: "absolute", left: 20, right: 20, bottom: 86, padding: "16px 18px", background: PAPER, border: `1px solid ${INK}`, display: "flex", alignItems: "baseline", gap: 14 }}>
                            <span style={{ fontFamily: DISPLAY, fontSize: 26, fontVariationSettings: opsz(26) }}>Enviado.</span>
                            <span style={{ fontSize: 13, color: ASH }}>{KEY ? "Gracias — Ana te responderá pronto." : "Se ha abierto tu correo con el mensaje listo para enviar."}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <footer className="ag-mail-foot" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 20px", borderTop: `1px solid ${INK}`, background: PAPER, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", fontSize: 13 }}>
                        <a href={`mailto:${EMAIL}`} style={{ color: INK }}>{EMAIL}</a>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {["byana_________", "anagilgon"].map((h) => (
                                <a key={h} href={`https://www.instagram.com/${h}/`} target="_blank" rel="noopener" style={{ color: INK, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                                        <rect x="3" y="3" width="18" height="18" rx="5" />
                                        <circle cx="12" cy="12" r="4.2" />
                                        <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
                                    </svg>
                                    @{h}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {state === "error" && <span style={{ fontSize: 12, color: "#B23A2B" }}>No se pudo enviar. Escribe a {EMAIL}</span>}
                        <button type="submit" disabled={state === "sending"} style={{ fontFamily: MONO, fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", padding: "9px 16px", border: "none", background: INK, color: PAPER, cursor: "pointer", opacity: state === "sending" ? 0.5 : 1 }}>
                            {state === "sending" ? "ENVIANDO…" : "ENVIAR"}
                        </button>
                    </div>
                </footer>
            </form>
            <style>{`.ag-mail-row input::placeholder,.ag-mail-row textarea::placeholder,form textarea::placeholder{color:${ASH};opacity:.85}.ag-mail-row:focus-within{background:rgba(17,17,17,.025)}`}</style>
        </Window>
    )
}
