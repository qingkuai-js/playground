import * as monaco from "monaco-editor-core"
import { vscodeLanguageServerTypes as lst } from "../../../util/loadpkg"

export function convertRange(from: lst.Range): monaco.IRange {
    return {
        endLineNumber: from.end.line + 1,
        endColumn: from.end.character + 1,
        startLineNumber: from.start.line + 1,
        startColumn: from.start.character + 1
    }
}

export function convertTextEdit(from: lst.TextEdit): monaco.languages.TextEdit {
    return {
        text: from.newText,
        range: convertRange(from.range)
    }
}

export function convertWorkspaceEdit(from: lst.WorkspaceEdit): monaco.languages.WorkspaceEdit {
    if (!from.changes) {
        return { edits: [] }
    }

    const edits: monaco.languages.IWorkspaceTextEdit[] = []
    for (const key of Object.keys(from.changes)) {
        for (const item of from.changes[key]) {
            edits.push({
                versionId: undefined,
                resource: monaco.Uri.parse(key),
                textEdit: convertTextEdit(item)
            })
        }
    }
    return { edits }
}
