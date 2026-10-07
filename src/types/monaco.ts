import type Monaco from "monaco-editor-core"
import type * as Lst from "vscode-languageserver-types"

/** LSP 协议中的文档文本：纯文本或 MarkupContent（折叠了 undefined 的入参形状） */
export type Documentation = string | Lst.MarkupContent | undefined

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

export type MonacoCompletionListWithOriginal = Omit<
    Monaco.languages.CompletionList,
    "suggestions"
> & {
    suggestions: MonacoCompletionItemWithOriginal[]
}
