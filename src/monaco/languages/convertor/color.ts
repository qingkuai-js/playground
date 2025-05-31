import * as monaco from "monaco-editor-core"
import { convertRange, convertTextEdit } from "./struct"
import { vscodeLanguageServerTypes as lst } from "../../../util/loadpkg"

export function convertDocumentColors(
    from: lst.ColorInformation[] | null
): monaco.languages.IColorInformation[] | null {
    if (!from) {
        return null
    }
    return from.map(item => {
        return {
            range: convertRange(item.range),
            color: item.color
        }
    })
}

export function convertColorPresentations(
    from: lst.ColorPresentation[] | null
): monaco.languages.IColorPresentation[] | null {
    if (!from) {
        return null
    }
    return from.map(item => {
        return {
            label: item.label,
            textEdit: item.textEdit && convertTextEdit(item.textEdit),
            additionalTextEdits: item.additionalTextEdits && item.additionalTextEdits.map(convertTextEdit)
        }
    })
}
