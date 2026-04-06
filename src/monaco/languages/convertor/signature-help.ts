import type { SignatureHelp } from "vscode-languageserver-types"

import * as monaco from "monaco-editor-core"

export function convertSignatureHelp(from: SignatureHelp | null): monaco.languages.SignatureHelp | null {
    if (!from) {
        return null
    }
}
