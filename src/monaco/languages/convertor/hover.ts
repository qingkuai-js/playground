import { convertRange } from "./struct"
import * as monaco from "monaco-editor-core"
import { vscodeLanguageServerTypes as lst } from "../../../util/loadpkg"

export function convertHover(from: lst.Hover | null): monaco.languages.Hover | null {
    if (!from) {
        return null
    }
    const assertedContents = from.contents as lst.MarkupContent
    return {
        contents: [
            {
                isTrusted: true,
                supportHtml: true,
                value: assertedContents.value
            }
        ],
        range: convertRange(from.range!)
    }
}
