import type Monaco from "monaco-editor-core"
import type { Store } from "../types/component"
import type LanguageWorker from "../monaco/languages/worker"
import type { FileInfo, SetStateOptions } from "../types/common"

import { createStore } from "qingkuai"
import { defaultMessage } from "./constants"

export let worker: LanguageWorker
export let iframe: HTMLIFrameElement
export let leftEditor: Monaco.editor.IStandaloneCodeEditor
export let rightEditor: Monaco.editor.IStandaloneCodeEditor

export const fileInfos = new Map<string, FileInfo>()

export const store = createStore<Store>({
    resolving: true,
    codeLens: true,
    debug: true,
    comment: true,
    leftFileTab: {
        activeIndex: 0,
        tabs: ["App.qk"]
    },
    rightFileTab: {
        activeIndex: 0,
        tabs: ["preview", "script", "style"]
    },
    tsVersion: "loading...",
    qingkuaiVersion: "loading",
    message: { ...defaultMessage },
    showingExternalSingleDefinition: false
})

export function cleanMessage() {
    store.message = { ...defaultMessage }
}

export function setState(options: SetStateOptions) {
    if (options.iframe) {
        iframe = options.iframe
    }
    if (options.leftEditor) {
        leftEditor = options.leftEditor
    }
    if (options.rightEditor) {
        rightEditor = options.rightEditor
    }
    if (options.languageWorker) {
        worker = options.languageWorker
    }
}
