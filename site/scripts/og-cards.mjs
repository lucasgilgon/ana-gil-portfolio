// (Opcional, en local) Genera tarjetas para compartir con tipografía: content/og/<nombre>.jpg
// Uso: node scripts/og-cards.mjs   (necesita playwright-core y Chromium instalados)
// Si una tarjeta no existe, prerender.mjs usa un recorte de la portada.
import { readFile, writeFile, mkdir, rm } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const OUT = path.resolve(SITE, "../content/og")
const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright-core")
const { projects, images } = JSON.parse(await readFile(path.join(SITE, ".content.json"), "utf8"))
const pub = (p) => pathToFileURL(path.join(SITE, "public", p)).href
const big = (base) => pub(`${base}-${images[base].sizes[images[base].sizes.length - 1]}.webp`)
const font = pub("/fonts/bodoni-moda.woff2")
const mono = pub("/fonts/plex-mono-400.woff2")

const card = ({ kicker, title, sub, img, accent, pos = "center" }) => `<!doctype html><html><head><style>
@font-face{font-family:B;src:url(${font}) format("woff2");font-weight:400 900}
@font-face{font-family:M;src:url(${mono}) format("woff2")}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#F4F2ED;display:flex;font-family:M;color:#111}
.l{flex:1;padding:58px 56px 54px 64px;display:flex;flex-direction:column}
.k{font-size:15px;letter-spacing:.14em}.t{font-family:B;font-size:${title.length > 12 ? 92 : 118}px;line-height:.92;letter-spacing:-.02em;font-variation-settings:"opsz" 96;margin-top:auto}
.u{font-family:M;font-weight:500;font-variation-settings:normal}
.s{margin-top:22px;font-size:15px;letter-spacing:.1em;text-transform:uppercase;color:#3B3A38}
.st{margin-top:26px;width:260px;border-top:2.5px dashed #B23A2B}
.r{width:500px;height:630px;position:relative}.r img{width:100%;height:100%;object-fit:cover;object-position:${pos};display:block}
.r:before{content:"";position:absolute;left:0;top:0;bottom:0;width:12px;background:${accent}}
</style></head><body><div class="l"><div class="k">${kicker}</div><div class="t">${title.replace(/_/g, '<span class="u">_</span>')}</div><div class="st"></div><div class="s">${sub}</div></div><div class="r"><img src="${img}"></div></body></html>`

const cards = [
    { name: "ana-gil", kicker: "PORTFOLIO 2026", title: "ANA GIL", sub: "Fashion design · ESD Madrid", img: big("/media/sistema/fondo-retrato"), accent: "#243A2D", pos: "42% 30%" },
    { name: "sobre-mi", kicker: "SOBRE MÍ", title: "Ana Gil", sub: "El cuerpo como documento", img: big("/media/sistema/retrato"), accent: "#111", pos: "50% 20%" },
    { name: "cv", kicker: "CURRÍCULUM", title: "Ana Gil", sub: "Fashion Design Student · Madrid", img: big("/media/sistema/retrato"), accent: "#111", pos: "50% 20%" },
    ...projects.map((p) => ({ name: p.slug, kicker: `PROJECT / ${String(p.number).padStart(2, "0")} · ANA GIL`, title: p.title, sub: `${p.category} · ${p.year}`, img: big(p.cover), accent: p.accent })),
]

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium", args: ["--allow-file-access-from-files"] })
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
for (const c of cards) {
    const tmp = path.join(os.tmpdir(), `ag-og-${c.name}.html`)
    await writeFile(tmp, card(c))
    await page.goto(pathToFileURL(tmp).href, { waitUntil: "load" })
    await rm(tmp)
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: path.join(OUT, `${c.name}.jpg`), type: "jpeg", quality: 86 })
    console.log("og", c.name)
}
await browser.close()
