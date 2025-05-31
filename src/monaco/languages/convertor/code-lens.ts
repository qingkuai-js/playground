import type Monaco from "monaco-editor-core"
import type { CodeLens } from "vscode-languageserver-types"
import type { MonacoCodeLensListWithOriginal } from "../../../types/monaco"

import { convertRange } from "./struct"

export function convertCodeLens(from: CodeLens): Monaco.languages.CodeLens {
    const originalCommand = from.command!
    return {
        command: {
            id: originalCommand.command,
            title: originalCommand.title,
            arguments: originalCommand.arguments
        },
        range: convertRange(from.range)
    }
}

export function convertCodeLensList(from: CodeLens[] | null): MonacoCodeLensListWithOriginal | null {
    if (!from) {
        return null
    }

    return {
        dispose: () => {},
        lenses: from.map(item => {
            return {
                _ori: item,
                range: convertRange(item.range)
            }
        })
    }
}
