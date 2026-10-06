import { defineConfig } from '@playwright/test'
export default defineConfig({
    testDir: './tests', timeout: 30000, workers: 2,
    use: { baseURL: 'http://127.0.0.1:8790', headless: true, reducedMotion: 'reduce', launchOptions: { executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] } },
    webServer: { command: 'cd .. && node_modules/.bin/wrangler pages dev site/dist --ip 127.0.0.1 --port 8790 --persist-to /tmp/ana-gil-browser-d1', url: 'http://127.0.0.1:8790', timeout: 60000, reuseExistingServer: false, env: { WRANGLER_SEND_METRICS: 'false', XDG_CONFIG_HOME: '/tmp/ana-gil-browser-config' } },
})
