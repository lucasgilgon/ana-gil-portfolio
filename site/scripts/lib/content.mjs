import { parse } from 'yaml'
import sanitizeHtml from 'sanitize-html'

export function matter(raw) {
    const match = raw.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
    if (!match) throw new Error('Falta la cabecera YAML delimitada por ---')
    const data = parse(match[1], { maxAliasCount: 50, uniqueKeys: true })
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('La cabecera debe ser un objeto')
    return { data, content: raw.replace(/^\uFEFF/, '').slice(match[0].length) }
}
export function safeHtml(html) {
    return sanitizeHtml(html, { allowedTags: sanitizeHtml.defaults.allowedTags,
        allowedAttributes: { a: ['href', 'title'], '*': ['lang'] }, allowedSchemes: ['http', 'https', 'mailto'],
        transformTags: { a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }) } })
}
export function validateProject(data, slug) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Slug inválido: ${slug}`)
    for (const key of ['titulo', 'categoria', 'rol', 'resumen']) {
        if (typeof data[key] !== 'string' || !data[key].trim()) throw new Error(`${slug}: falta ${key}`)
    }
    if (!Number.isInteger(data.año ?? data.anio) || (data.año ?? data.anio) < 1900) throw new Error(`${slug}: año inválido`)
    if (data.numero !== undefined && (!Number.isInteger(data.numero) || data.numero < 1)) throw new Error(`${slug}: número inválido`)
    if (data.acento && !/^#[0-9a-f]{6}$/i.test(data.acento)) throw new Error(`${slug}: acento debe ser un color hexadecimal de seis cifras`)
    if (data.enlace && !/^https?:\/\//.test(data.enlace)) throw new Error(`${slug}: enlace debe usar HTTPS o HTTP`)
    for (const key of ['proceso', 'probador', 'tejidos']) if (data[key] !== undefined && !Array.isArray(data[key])) throw new Error(`${slug}: ${key} debe ser una lista`)
    for (const garment of data.probador || []) if (!garment.prenda || !Array.isArray(garment.capas) || !garment.capas.length) throw new Error(`${slug}: prenda sin capas`)
}
