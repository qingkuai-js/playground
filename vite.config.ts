import type { Plugin } from "@qingkuai/cli/vite"

import fs from "node:fs"
import path from "node:path"
import { defineConfig, transformWithOxc } from "@qingkuai/cli/vite"

const LANGUAGE_SERVICE_EXTERNALIZED_WARNING_RE =
    /has been externalized for browser compatibility, imported by "[^"]*language-service\/dist\//

export default defineConfig({
    worker: {
        format: "es"
    },
    build: {
        rollupOptions: {
            onLog(level, log, defaultHandler) {
                if (LANGUAGE_SERVICE_EXTERNALIZED_WARNING_RE.test(log.message)) {
                    return
                }
                defaultHandler(level, log)
            },
            external: ["vscode"]
        }
    },
    css: {
        devSourcemap: true
    },
    resolve: {
        dedupe: ["vscode-languageserver-types"]
    },
    optimizeDeps: {
        exclude: ["qingkuai", "qingkuai/compiler", "qingkuai/internal"]
    },
    plugins: [transpileServiceWorker(), serveRawDtsOutsideRoot()]
})

function transpileServiceWorker(): Plugin {
    const targetPath = path.resolve(import.meta.dirname, "./public/sw.js")
    const swPath = path.resolve(import.meta.dirname, "./src/service/sw.ts")
    const transpile = async () => {
        const transpileRes = await transformWithOxc(fs.readFileSync(swPath, "utf-8"), swPath, {
            target: "esnext",
            lang: "ts"
        })
        fs.writeFileSync(targetPath, transpileRes.code)
    }
    return {
        name: "transpile-service-worker",
        async buildStart() {
            await transpile()
        },
        configureServer(server) {
            server.watcher.add(swPath)
            server.watcher.on("change", async (file) => {
                if (swPath !== file) {
                    return
                }
                try {
                    await transpile()
                } catch (err) {
                    console.error("[transpile-service-worker]", err)
                }
                server.ws.send({ type: "full-reload" })
            })
        }
    }
}

// vite 8 dev 下真实路径位于 root 外的文件不经过转换管线：`?raw` 导入会拿到原文而非字符串模块；
function serveRawDtsOutsideRoot(): Plugin {
    const QINGKUAI_TYPES_ROOT = "/dist/types/"
    return {
        name: "serve-raw-dts-outside-root",
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                const url = req.url ?? ""
                if (!url.startsWith("/@fs/") || !url.includes(".d.ts?raw")) {
                    return next()
                }
                const filePath = decodeURIComponent(url.slice("/@fs".length).split("?")[0])
                const allowed =
                    filePath.includes(QINGKUAI_TYPES_ROOT) &&
                    filePath.endsWith(".d.ts") &&
                    fs.existsSync(filePath)
                if (!allowed) {
                    return next()
                }
                const content = fs.readFileSync(filePath, "utf-8")
                res.setHeader("Content-Type", "text/javascript")
                res.end(`export default ${JSON.stringify(content)}`)
            })
        }
    }
}
