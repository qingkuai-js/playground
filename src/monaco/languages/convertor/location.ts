import type { Location, LocationLink } from "vscode-languageserver-types"

import { convertRange } from "./struct"
import * as monaco from "monaco-editor-core"

export function convertLocations(
    from: Location[] | LocationLink[] | null
): monaco.languages.Location[] | monaco.languages.LocationLink[] | null {
    if (!from) {
        return null
    }
    return from.map(convertLocationItem)
}

 function convertLocationItem(from: Location | LocationLink): monaco.languages.Location | monaco.languages.LocationLink {
    if ("targetUri" in from) {
        return {
            uri: monaco.Uri.parse(from.targetUri),
            range: convertRange(from.targetRange),
            targetSelectionRange: from.targetSelectionRange && convertRange(from.targetSelectionRange),
            originSelectionRange: from.originSelectionRange && convertRange(from.originSelectionRange)
        }
    }
    return {
        uri: monaco.Uri.parse(from.uri),
        range: convertRange(from.range)
    }
}
