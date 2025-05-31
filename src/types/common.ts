import type Monaco from "monaco-editor-core"
import type LanguageWorker from "../monaco/languages/worker"

export type NumNum = [number, number]
export type CacheFunc<T> = (value: T) => void
export type GeneralFunc = (...args: any[]) => any

export interface FileInfo {
    style: string
    script: string
    semiScript: string
    model: Monaco.editor.ITextModel
}

export interface RuntimeCompileResult {
    hashId: string
    style: string
    script: string
    source: string
    debug: boolean
    comment: boolean
    semiScript: string
}

export type PromiseWithState<T = any> = Promise<T> & {
    state: "fullfilled" | "pending"
}

export type SetStateOptions = Partial<{
    iframe: HTMLIFrameElement
    languageWorker: LanguageWorker
    leftEditor: Monaco.editor.IStandaloneCodeEditor
    rightEditor: Monaco.editor.IStandaloneCodeEditor
}>

export type * as QingkuaiCompiler from "qingkuai/compiler"
