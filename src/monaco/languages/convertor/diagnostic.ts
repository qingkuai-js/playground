import { convertRange } from "./struct"
import * as monaco from "monaco-editor-core"
import { vscodeLanguageServerTypes as lst } from "../../../util/loadpkg"

export function convertDiagnostic(from: lst.Diagnostic[] | null): monaco.editor.IMarkerData[] | null {
    if (!from) {
        return null
    }
    return from.map(item => {
        return {
            ...convertRange(item.range),
            source: item.source,
            message: item.message,
            code: item.code?.toString() ?? "",
            tags: item.tags?.map(convertDiagnosticTag),
            severity: convertDiagnosticServerity(item.severity!),
            relatedInformation: item.relatedInformation?.map(convertRelatedInformations)
        }
    })
}

function convertDiagnosticTag(from: lst.DiagnosticTag): monaco.MarkerTag {
    switch (from) {
        case lst.DiagnosticTag.Deprecated:
            return monaco.MarkerTag.Deprecated
        case lst.DiagnosticTag.Unnecessary:
            return monaco.MarkerTag.Unnecessary
    }
}

function convertDiagnosticServerity(from: lst.DiagnosticSeverity): monaco.MarkerSeverity {
    switch (from) {
        case lst.DiagnosticSeverity.Hint:
            return monaco.MarkerSeverity.Hint
        case lst.DiagnosticSeverity.Information:
            return monaco.MarkerSeverity.Info
        case lst.DiagnosticSeverity.Error:
            return monaco.MarkerSeverity.Error
        case lst.DiagnosticSeverity.Warning:
            return monaco.MarkerSeverity.Warning
    }
}

function convertRelatedInformations(from: lst.DiagnosticRelatedInformation): monaco.editor.IRelatedInformation {
    return {
        message: from.message,
        ...convertRange(from.location.range),
        resource: monaco.Uri.parse(from.location.uri)
    }
}
