import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"

export default defineConfig({
    plugins: [react()],
    resolve: { alias: { framer: path.resolve(import.meta.dirname, "src/lib/framer-shim.tsx") } },
    build: { target: "es2020", cssCodeSplit: true, chunkSizeWarningLimit: 900 },
})
