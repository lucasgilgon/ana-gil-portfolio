# Publicar la web (gratis, sin marca de agua)

La web nueva está en `site/` y su contenido en `content/` (ver `content/LEEME.md`).

## 1 · Vercel (recomendado, gratis)

1. Entra en <https://vercel.com> → *Sign up* con tu cuenta de GitHub.
2. *Add New… → Project* → elige el repositorio `ana-gil-portfolio` (funciona aunque sea privado).
3. En **Root Directory** pon `site`. Lo demás lo detecta solo (Vite, `npm run build`, carpeta `dist`).
4. *Deploy*. En 1–2 minutos tendrás una dirección tipo `ana-gil-portfolio.vercel.app`.
5. Cada vez que subas un cambio a GitHub (por ejemplo un proyecto nuevo), se vuelve a publicar sola.

**Dominio propio** (opcional, ~10 €/año, p. ej. `anagil.com`): *Project → Settings → Domains*.
Cuando lo tengas, añade la variable `SITE_URL` = `https://anagil.com` (ver abajo).

> Alternativa equivalente: Cloudflare Pages (*Workers & Pages → Create → Pages → Connect to Git*,
> Root directory `site`, Build command `npm run build`, Output `dist`).

## 2 · Variables (todas opcionales)

En Vercel: *Project → Settings → Environment Variables*. Después, *Deployments → Redeploy*.

| Variable | Para qué | Dónde se consigue |
|---|---|---|
| `SITE_URL` | Dirección final de la web (para Google y las vistas previas al compartir) | Tu dominio, p. ej. `https://anagil.com` |
| `VITE_WEB3FORMS_KEY` | Que el formulario de contacto te llegue al correo | <https://web3forms.com> → pon tu email → te mandan la clave (gratis) |
| `VITE_CF_BEACON_TOKEN` | Estadísticas: visitas, países, móvil/ordenador | <https://dash.cloudflare.com> → *Web Analytics* → *Add a site* (gratis, sin cookies) |
| `VITE_GOATCOUNTER` | Estadísticas con eventos (CV descargado, mensajes) | <https://www.goatcounter.com> → crea un sitio, p. ej. `anagil` (gratis) |

Sin `VITE_WEB3FORMS_KEY`, el botón ENVIAR abre el correo del visitante con el mensaje ya escrito.
Vercel también tiene estadísticas gratis: *Project → Analytics → Enable*.

## 3 · Google

Cuando esté publicada: <https://search.google.com/search-console> → añade la web →
*Sitemaps* → envía `sitemap.xml`. Cada página ya lleva su título, descripción, imagen para
compartir y datos de "persona" para que Google muestre tu nombre bien.

## Trabajar en local

```bash
cd site
npm install
npm run dev      # http://localhost:5173
npm run build    # versión final en site/dist
```

Tarjetas para compartir con tipografía (opcional, en un ordenador con Chromium):
`node scripts/og-cards.mjs` → guarda las imágenes en `content/og/`.
