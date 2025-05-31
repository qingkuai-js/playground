import { fileInfos, store } from "../util/state"

window.onmessage = ({ data }) => {
    switch (data.name) {
        case "sw_getScriptContent": {
            for (const ext of [".qk", ".ts", ".js", ""]) {
                if (fileInfos.has(data.fileName + ext) || !ext) {
                    navigator.serviceWorker.controller?.postMessage({
                        id: data.id,
                        content: fileInfos.get(data.fileName + ext)?.script
                    })
                }
            }
            break
        }
        case "runtime_msg": {
            store.message.right = { type: data.type, value: data.msg }
            break
        }
    }
}
