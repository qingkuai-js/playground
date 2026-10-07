import { USE_LOCAL_PACKAGES } from "../util/loadpkg"
import { fileInfos, iframe, store } from "../util/state"

function waitForController(timeout = 5000) {
    return Promise.race([
        (async () => {
            await navigator.serviceWorker.ready
            if (!navigator.serviceWorker.controller) {
                await new Promise<void>((resolve) => {
                    navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), {
                        once: true
                    })
                })
            }
        })(),
        new Promise<void>((resolve) => {
            setTimeout(resolve, timeout)
        })
    ])
}

// 空闲停止后 worker 不会再被后续请求自动启动，页面发出的请求会直接落到开发服务器上，
// 需要一条消息唤醒并等待回执（超时按原行为继续）
function wakeServiceWorker(controller: ServiceWorker, timeout = 1500) {
    return new Promise<void>((resolve) => {
        const finish = () => {
            clearTimeout(timer)
            navigator.serviceWorker.removeEventListener("message", onMessage)
            resolve()
        }
        const timer = setTimeout(finish, timeout)
        const onMessage = (event: MessageEvent) => {
            if (event.data?.name === "sw_pong") {
                finish()
            }
        }
        navigator.serviceWorker.addEventListener("message", onMessage)
        controller.postMessage({ name: "sw_ping", t: Date.now() })
    })
}

// 预览 iframe 的虚拟模块由 service worker 提供，导航 iframe 前需确保它已接管且已启动：
// 否则模块请求会落到开发服务器上（404），预览以
// "Failed to fetch dynamically imported module" 失败
async function ensureServiceWorkerReady() {
    if (!navigator.serviceWorker) {
        return
    }
    if (!navigator.serviceWorker.controller) {
        await waitForController()
    }
    const controller = navigator.serviceWorker.controller
    if (controller) {
        await wakeServiceWorker(controller)
    }
}

export async function render() {
    await ensureServiceWorkerReady()

    const styleParts: string[] = []
    const runtimeBase = USE_LOCAL_PACKAGES
        ? "/node_modules/qingkuai/dist/esm/runtime"
        : `https://cdn.jsdelivr.net/npm/qingkuai@${store.qingkuaiVersion}/dist/esm/runtime`
    const importmap: Record<string, string> = {
        qingkuai: `${runtimeBase}/index.js`,
        "qingkuai/internal": `${runtimeBase}/internal.js`
    }
    fileInfos.forEach((cr, fileName) => {
        if (fileName.startsWith("/compiled")) {
            return
        }
        styleParts.push(cr.style)

        const virtualModulePath = `/__virtual_module__/${fileName}?${Date.now()}`
        importmap[`./${fileName.slice(0, -3)}`] = virtualModulePath
        importmap[`./${fileName}`] = virtualModulePath
    })
    iframe.srcdoc = `
        <script type="importmap">{"imports": ${JSON.stringify(importmap)}}</script>
        <style type="text/css">body { margin: 0; } *[hidden] { display: none !important; }</style>
        <style type="text/css">${styleParts.join("\n")}</style>
        <script type="module">
            import { mountApp } from "qingkuai"

            const originalConsoleWarn = console.warn
            console.warn=(...params)=>{
                if(params.every(p=>typeof p==="string")){
                    window.parent.postMessage({
                        name:"runtime_msg",
                        type:"warning",
                        msg:params.join(" ")
                    })
                }else{
                    originalConsoleWarn(...params)
                }
            }

            window.__qk_max_schedule_depth = 300

            window.onerror=msg=>{
                window.parent.postMessage({
                    msg,
                    type:"error",
                    name:"runtime_msg",
                })
                return true
            }

            window.navigator.serviceWorker.onmessage = ({data})=>{
                window.parent.postMessage(data)
            }

            const component = (await import("./App")).default
            mountApp(component, "body")
        </script>
    `
}
