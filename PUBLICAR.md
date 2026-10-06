# Desarrollo y publicación

La aplicación React está en `site/`, el contenido editable en `content/` y la API del libro de visitas en `functions/api/notas.js`.

## Entorno local

Usa Node 24 LTS (mínimo 22.12 para la compilación).

```bash
npm ci
npm ci --prefix site
npm test
npm run typecheck
npm run build
```

Para editar la interfaz: `npm --prefix site run dev -- --host 0.0.0.0`. Vite no ejecuta la API de Cloudflare.
Para comprobar la aplicación completa después de compilar: `npm run dev:full`. Wrangler sirve `site/dist` en el puerto 8788 y crea una D1 local; no modifica la base publicada.

Pruebas de navegador:

```bash
cd site
npx playwright install chromium
npm run test:browser
```

Si Chromium ya está instalado, usa `CHROMIUM_PATH=/usr/bin/chromium npm run test:browser`. Las pruebas arrancan y detienen su propio servidor en el puerto 8790.

## Cloudflare Pages: aplicación completa

Configura el repositorio con **directorio raíz del repositorio**, comando de compilación `npm ci && npm ci --prefix site && npm run build` y salida `site/dist`. La raíz permite descubrir `functions/` y `wrangler.jsonc`.

Vincula D1 con el nombre `DB`. `wrangler.jsonc` identifica la base del proyecto existente: para otra cuenta debes crear su propia base y actualizar ese identificador. La API crea sus tablas e índices al usarse.

Añade `ADMIN_KEY` como secreto de Pages si necesitas moderar notas. No lo pongas en variables `VITE_*`, archivos versionados ni código del navegador. La moderación requiere la cabecera `x-clave`.

Publicar es una acción separada de compilar y probar en local. Estos comandos de desarrollo no publican cambios.

## Variables opcionales

| Variable | Uso |
|---|---|
| `SITE_URL` | URL pública definitiva para canonical, sitemap y tarjetas; la navegación reutiliza el origen del canonical generado. |
| `VITE_WEB3FORMS_KEY` | Envío del formulario mediante Web3Forms. Es una clave pública del formulario, no una credencial privada. |
| `VITE_CF_BEACON_TOKEN` | Cloudflare Web Analytics. |
| `VITE_GOATCOUNTER` | Identificador de estadísticas de GoatCounter. |

Sin Web3Forms, **Abrir mi correo** prepara un borrador y conserva el mensaje: el visitante completa el envío en su correo.

## Vercel: versión estática

Vercel puede publicar la interfaz con raíz `site`, compilación `npm run build` y salida `dist`, pero no ejecuta Pages Functions ni D1. El libro de visitas necesita Cloudflare o una API alternativa; ambas plataformas no son equivalentes para este repositorio.

## Contenido y Framer

`content/LEEME.md` explica cómo editar los proyectos. La compilación valida YAML, enlaces, tejidos e imágenes y falla si falta contenido obligatorio. Las imágenes generadas incorporan una huella de contenido en su URL para renovar la caché cuando cambian.

Los componentes independientes de `framer/` y los scripts de sincronización son un flujo separado. No se actualiza ni publica Framer al compilar la aplicación. La exportación no sobrescribe archivos existentes sin `--overwrite`; haz una copia antes de utilizar esa opción.
