import type { SignatureHelp } from "vscode-languageserver-types"

import * as monaco from "monaco-editor-core"

import type { Documentation } from "../../../types/monaco"

export function convertSignatureHelp(
    from: SignatureHelp | null
): monaco.languages.SignatureHelp | null {
    if (!from) {
        return null
    }
    return {
        activeSignature: from.activeSignature ?? 0,
        activeParameter: from.activeParameter ?? 0,
        signatures: from.signatures.map((signature) => {
            return {
                label: signature.label,
                documentation: convertDocumentation(signature.documentation),
                parameters: (signature.parameters ?? []).map((parameter) => {
                    return {
                        label: parameter.label,
                        documentation: convertDocumentation(parameter.documentation)
                    }
                })
            }
        })
    }
}

function convertDocumentation(from: Documentation): string | monaco.IMarkdownString | undefined {
    if (!from || typeof from === "string") {
        return from
    }
    return { value: from.value }
}
