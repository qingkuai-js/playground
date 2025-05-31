import type Monaco from "monaco-editor-core"
import type * as Lst from "vscode-languageserver-types"

export interface LanguageItem {
    id: string
    scope: string
    configuration?: Monaco.languages.LanguageConfiguration
}

export type MonacoCodeLensItemWithOriginal = Monaco.languages.CodeLens & {
    _ori: Lst.CodeLens
}

export type MonacoCodeLensListWithOriginal = Omit<Monaco.languages.CodeLensList, "lenses"> & {
    lenses: MonacoCodeLensItemWithOriginal[]
}

export type MonacoCompletionItemWithOriginal = Monaco.languages.CompletionItem & {
    _ori: Lst.CompletionItem
}

export type MonacoCompletionListWithOriginal = Omit<Monaco.languages.CompletionList, "suggestions"> & {
    suggestions: MonacoCompletionItemWithOriginal[]
}
