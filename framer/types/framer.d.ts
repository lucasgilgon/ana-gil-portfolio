// Stub mínimo del módulo "framer" (lo provee Framer en el editor).
// Solo existe para poder hacer typecheck de /code fuera de Framer.
declare module "framer" {
    import type { ComponentType } from "react"

    export const ControlType: {
        readonly String: "string"
        readonly Number: "number"
        readonly Boolean: "boolean"
        readonly Color: "color"
        readonly Enum: "enum"
        readonly Link: "link"
        readonly ResponsiveImage: "responsiveimage"
        readonly Image: "image"
        readonly Array: "array"
        readonly Object: "object"
        readonly Font: "font"
        readonly Transition: "transition"
        readonly ComponentInstance: "componentinstance"
    }

    export function addPropertyControls(
        component: ComponentType<any>,
        controls: Record<string, any>
    ): void

    export const RenderTarget: {
        current(): "CANVAS" | "PREVIEW" | "EXPORT" | "THUMBNAIL"
        readonly canvas: "CANVAS"
        readonly preview: "PREVIEW"
        readonly export: "EXPORT"
        readonly thumbnail: "THUMBNAIL"
    }

    export type Override = Record<string, unknown>
}
