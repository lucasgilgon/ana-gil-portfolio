// Imágenes locales optimizadas (generadas por scripts/build-content.mjs).
// thumb(base, w) → la versión WebP más pequeña que cubra w píxeles.
import { IMAGES, type Img } from "../content/generated"

export function imgInfo(src: string): Img | undefined {
    return IMAGES[src]
}

export function thumb(src: string, w: number): string {
    if (!src) return src
    const im = IMAGES[src]
    if (!im) return src
    const pick = im.sizes.find((s) => s >= w) ?? im.sizes[im.sizes.length - 1]
    return `${im.base}-${pick}.webp`
}

export function srcSet(src: string): string | undefined {
    const im = IMAGES[src]
    if (!im) return undefined
    return im.sizes.map((s) => `${im.base}-${s}.webp ${s}w`).join(", ")
}

export function blur(src: string): string | undefined {
    return IMAGES[src]?.blur
}
