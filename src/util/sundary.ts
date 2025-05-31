import type Monaco from "monaco-editor-core"
import type { Model } from "../types/communication"
import type { RealPath } from "qingkuai-language-service"

import { isQingkuaiFile } from "./assert"

export function lastElem<T>(arr: T[]): T {
    return arr[arr.length - 1]
}

export function fileUriToPath(uri: string) {
    return uri.replace(/^file:\/\//, "") as RealPath
}

// 获取内容每行开始处的索引列表
export function getLineStarts(content: string) {
    const ret: number[] = content ? [0] : []
    for (let i = 0; i < content.length; i++) {
        if (content[i] !== "\n") {
            continue
        }
        ret.push(i)
    }
    return ret
}

export function getLanguageId(fileName: string) {
    if (isQingkuaiFile(fileName)) {
        return "qingkuai"
    }
    if (/\.[tj]s$/.test(fileName)) {
        return "typescript"
    }
    return "css"
}

export function getClonableModel(model: Monaco.editor.ITextModel): Model {
    return {
        source: model.getValue(),
        uri: model.uri.toString(),
        version: model.getVersionId()
    }
}
