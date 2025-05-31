import type { MonacoCompletionListWithOriginal, MonacoCompletionItemWithOriginal } from "../../../types/monaco"

import { convertRange } from "./struct"
import * as monaco from "monaco-editor-core"
import { isArray } from "../../../util/assert"
import { vscodeLanguageServerTypes as lst } from "../../../util/loadpkg"

export function convertCompletions(
    from: lst.CompletionList | lst.CompletionItem[] | null,
    defaultRange: monaco.IRange | monaco.languages.CompletionItemRanges
): MonacoCompletionListWithOriginal | null {
    if (!from) {
        return null
    }

    const suggestions: MonacoCompletionItemWithOriginal[] = []
    const itemDefaults = convertItemDefaults(from, defaultRange)
    ;(isArray(from) ? from : from.items).forEach(item => {
        suggestions.push(convertCompletionItem(item, itemDefaults))
    })
    return { incomplete: isArray(from) ? false : from.isIncomplete, suggestions }
}

export function convertCompletionItem(
    from: lst.CompletionItem,
    itemDefaults: ReturnType<typeof convertItemDefaults>
): MonacoCompletionItemWithOriginal {
    return {
        _ori: from,
        label: from.label,
        detail: from.detail,
        sortText: from.sortText,
        preselect: from.preselect,
        filterText: from.filterText,
        documentation: from.documentation,
        kind: convertCompletionKind(from.kind),
        insertText: from.textEdit?.newText ?? from.label,
        command: from.command && convertCommand(from.command),
        insertTextRules: convertInsertTextFormat(from.insertTextFormat),
        commitCharacters: from.commitCharacters || itemDefaults?.commitChars,
        range: from.textEdit ? convertTextEdit(from.textEdit) : itemDefaults.range,
        additionalTextEdits: from.additionalTextEdits?.map(convertAdditionalTextEditItem),
        tags: from.tags?.length ? [monaco.languages.CompletionItemTag.Deprecated] : undefined
    }
}

function convertCommand(from: lst.Command): monaco.languages.Command {
    return {
        id: from.command,
        title: from.title,
        arguments: from.arguments
    }
}

function convertItemDefaults(
    from: lst.CompletionItem[] | lst.CompletionList,
    defaultRange: monaco.IRange | monaco.languages.CompletionItemRanges
) {
    const ret: {
        commitChars: string[] | undefined
        range: monaco.IRange | monaco.languages.CompletionItemRanges
    } = {
        range: defaultRange,
        commitChars: undefined
    }
    if (!isArray(from)) {
        if (from.itemDefaults?.commitCharacters) {
            ret.commitChars = from.itemDefaults?.commitCharacters
        }
        if (from.itemDefaults?.editRange) {
            if ("insert" in from.itemDefaults.editRange) {
                ret.range = {
                    insert: convertRange(from.itemDefaults.editRange.insert),
                    replace: convertRange(from.itemDefaults.editRange.replace)
                }
            } else {
                ret.range = convertRange(from.itemDefaults.editRange)
            }
        }
    }
    return ret
}

function convertAdditionalTextEditItem(from: lst.TextEdit): monaco.editor.ISingleEditOperation {
    return {
        text: from.newText,
        range: convertRange(from.range)
    }
}

function convertCompletionKind(from: lst.CompletionItemKind | undefined): monaco.languages.CompletionItemKind {
    const monacoKind = monaco.languages.CompletionItemKind
    switch (from) {
        case lst.CompletionItemKind.Class:
            return monacoKind.Class
        case lst.CompletionItemKind.Color:
            return monacoKind.Color
        case lst.CompletionItemKind.Constant:
            return monacoKind.Constant
        case lst.CompletionItemKind.Enum:
            return monacoKind.Enum
        case lst.CompletionItemKind.Text:
            return monacoKind.Text
        case lst.CompletionItemKind.EnumMember:
            return monacoKind.EnumMember
        case lst.CompletionItemKind.Event:
            return monacoKind.Event
        case lst.CompletionItemKind.Field:
            return monacoKind.Field
        case lst.CompletionItemKind.File:
            return monacoKind.File
        case lst.CompletionItemKind.Folder:
            return monacoKind.Folder
        case lst.CompletionItemKind.Function:
            return monacoKind.Function
        case lst.CompletionItemKind.Interface:
            return monacoKind.Interface
        case lst.CompletionItemKind.Keyword:
            return monacoKind.Keyword
        case lst.CompletionItemKind.Method:
            return monacoKind.Method
        case lst.CompletionItemKind.Module:
            return monacoKind.Module
        case lst.CompletionItemKind.Operator:
            return monacoKind.Operator
        case lst.CompletionItemKind.Reference:
            return monacoKind.Reference
        case lst.CompletionItemKind.Snippet:
            return monacoKind.Snippet
        case lst.CompletionItemKind.Struct:
            return monacoKind.Struct
        case lst.CompletionItemKind.TypeParameter:
            return monacoKind.TypeParameter
        case lst.CompletionItemKind.Unit:
            return monacoKind.Unit
        case lst.CompletionItemKind.Value:
            return monacoKind.Value
        case lst.CompletionItemKind.Variable:
            return monacoKind.Variable
        default:
            return monacoKind.Property
    }
}

function convertTextEdit(
    from: lst.TextEdit | lst.InsertReplaceEdit
): monaco.IRange | monaco.languages.CompletionItemRanges {
    if ("range" in from) {
        return convertRange(from.range)
    }
    return {
        insert: convertRange(from.insert),
        replace: convertRange(from.replace)
    }
}

function convertInsertTextFormat(
    from: lst.InsertTextFormat | undefined
): monaco.languages.CompletionItemInsertTextRule {
    return monaco.languages.CompletionItemInsertTextRule[
        from === lst.InsertTextFormat.Snippet ? "InsertAsSnippet" : "KeepWhitespace"
    ]
}
