import type { InlayHint } from "vscode-languageserver-types"

import * as monaco from "monaco-editor-core"

import type { Documentation } from "../../../types/monaco"

export function convertInlayHints(from: InlayHint[] | null): monaco.languages.InlayHint[] {
    if (!from) {
        return []
    }
    return from.map((hint) => {
        return {
            position: {
                lineNumber: hint.position.line + 1,
                column: hint.position.character + 1
            },
            label: convertInlayHintLabel(hint.label),
            kind: convertInlayHintKind(hint.kind),
            paddingLeft: hint.paddingLeft,
            paddingRight: hint.paddingRight
        }
    })
}

function convertInlayHintLabel(
    from: InlayHint["label"]
): monaco.languages.InlayHintLabelPart[] | string {
    if (typeof from === "string") {
        return from
    }
    return from.map((part) => {
        return {
            label: part.value,
            tooltip: convertDocumentation(part.tooltip)
        }
    })
}

function convertDocumentation(from: Documentation): string | monaco.IMarkdownString | undefined {
    if (!from || typeof from === "string") {
        return from
    }
    return { value: from.value }
}

function convertInlayHintKind(from: InlayHint["kind"]): monaco.languages.InlayHintKind | undefined {
    switch (from) {
        case 1: {
            return monaco.languages.InlayHintKind.Type
        }
        case 2: {
            return monaco.languages.InlayHintKind.Parameter
        }
    }
}
