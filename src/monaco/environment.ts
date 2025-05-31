import type { ShowReferencesCommandParams } from "qingkuai-language-service"

import * as monaco from "monaco-editor-core"
import EditorWoker from "monaco-editor-core/esm/vs/editor/editor.worker?worker"
import { convertLocations } from "./languages/convertor/location"
import { leftEditor } from "../util/state"

self.MonacoEnvironment = {
    getWorker: () => new EditorWoker()
}

window.addEventListener("unhandledrejection", event => {
    const reason = event.reason
    if ((reason && reason.name === "Canceled") || reason.message?.includes("Canceled")) {
        event.preventDefault()
    }
})

monaco.editor.registerCommand("_typescript.applyCompletionCodeAction", () => {})

monaco.editor.registerCommand("qingkuai.showReferences", (_, params: ShowReferencesCommandParams) => {
    const locations = convertLocations(params.locations)
    const position: monaco.IPosition = {
        lineNumber: params.position.line,
        column: params.position.character
    }
    ;(leftEditor as any)._commandService.executeCommand(
        "editor.action.showReferences",
        monaco.Uri.file(params.fileName),
        position,
        locations
    )
})
