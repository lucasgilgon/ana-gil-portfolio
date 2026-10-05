// Sustituto mínimo del módulo "framer" para usar los componentes fuera de Framer.
import * as React from "react"
import { useNavigate } from "react-router-dom"
import { setOrigin } from "./origin"

export const addPropertyControls = (..._args: any[]) => {}
export const ControlType: any = new Proxy({}, { get: (_t, k) => String(k) })
export const RenderTarget = {
    canvas: "CANVAS",
    preview: "PREVIEW",
    export: "EXPORT",
    thumbnail: "THUMBNAIL",
    current: () => "PREVIEW",
}
export type ResponsiveImage = { src: string; srcSet?: string; alt?: string }

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href) || /\.(pdf|vcf)$/i.test(href)

// <Link href> de Framer: navega sin recargar y recuerda el elemento pulsado como origen de la ventana
export function Link({ href, children, openInNewTab }: { href: string; children: React.ReactElement; openInNewTab?: boolean; motionChild?: boolean }) {
    const navigate = useNavigate()
    const child = React.Children.only(children) as React.ReactElement<any>
    const ext = isExternal(href || "")
    return React.cloneElement(child, {
        href,
        target: openInNewTab || (ext && !href.startsWith("mailto:") && !href.startsWith("tel:")) ? "_blank" : child.props.target,
        rel: ext ? "noopener" : child.props.rel,
        onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
            child.props.onClick?.(e)
            if (e.defaultPrevented || ext || openInNewTab) return
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
            e.preventDefault()
            setOrigin(e.currentTarget, href)
            navigate(href)
        },
    })
}
