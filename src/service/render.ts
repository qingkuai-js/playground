import { fileInfos, iframe, store } from "../util/state"

export function render() {
    const styleParts: string[] = []
    const importmap: Record<string, string> = {
        qingkuai: `https://cdn.jsdelivr.net/npm/qingkuai@${store.qingkuaiVersion}/dist/esm/runtime/index.js`,
        "qingkuai/internal": `https://cdn.jsdelivr.net/npm/qingkuai@${store.qingkuaiVersion}/dist/esm/runtime/internal.js`
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

            window.__qk_expose_dependencies__=false
            window.__qk_expose_destructions__=false

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

            mountApp("body", (await import("./App")).default)
        </script>
    `
}
