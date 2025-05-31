import type { Plugin } from "vite"

import fs from "node:fs"
import path from "node:path"
import qingkuai from "vite-plugin-qingkuai"
import { defineConfig, transformWithEsbuild } from "vite"

export default defineConfig({
    worker: {
        format: "es"
    },
    css: {
        devSourcemap: true
    },
    resolve: {
        dedupe: ["vscode-languageserver-types"]
    },
    plugins: [qingkuai(), transpileServiceWorker()]
})

function transpileServiceWorker(): Plugin {
    const targetPath = path.resolve(__dirname, "./public/sw.js")
    const swPath = path.resolve(__dirname, "./src/service/sw.ts")
    return {
        name: "transpile-service-worker",
        configureServer(server) {
            server.watcher.add(swPath)
            server.watcher.on("change", async file => {
                if (swPath === file) {
                    const transpileRes = await transformWithEsbuild(fs.readFileSync(swPath, "utf-8"), swPath, {
                        sourcemap: false
                    })
                    fs.writeFileSync(targetPath, transpileRes.code)
                    server.ws.send({ type: "full-reload" })
                }
            })
        }
    }
}
