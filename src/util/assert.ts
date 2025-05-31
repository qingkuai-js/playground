import type Monaco from "monaco-editor-core"
import { externalFileRE } from "./constants"

export function isArray(v: any): v is any[] {
    return Array.isArray(v)
}

export function isString(v: any): v is string {
    return typeof v === "string"
}

export function isQingkuaiFile(fileName: string) {
    return fileName.endsWith(".qk")
}

export function isUndefined(v: any): v is undefined {
    return v === undefined
}

export function isExternalFileName(fileName: string) {
    return externalFileRE.test(fileName)
}

export function isExternalFile(model: Monaco.editor.ITextModel) {
    return externalFileRE.test(model.uri.fsPath)
}
