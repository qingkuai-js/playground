import type { MessageBoxProps } from "../types/component"

import { listVersions } from "./loadpkg"

const defaultMessageItem: MessageBoxProps = {
    type: "error",
    value: ""
}

export const defaultRuntimeCompileResult = {
    style: "",
    script: "",
    semiScript: ""
}

export enum Handlers {
    Hover = "hover",
    Rename = "rename",
    CodeLens = "codeLens",
    DeleteFile = "deleteFile",
    FileLoaded = "fileLoaded",
    ShowMessage = "showMessage",
    insertSnippet = "insertSnippet",
    PrepareRename = "prepareRename",
    GetDiagnostic = "getDiagnostics",
    GetCompletions = "getCompletions",
    FormatDocument = "formatDocument",
    FindReferences = "findReferences",
    ResolveCodeLens = "resolveCodeLens",
    FindDefinitions = "findDefinitions",
    GetCompileResult = "getCompileResult",
    GetDocumentColors = "getDocumentColors",
    FindImplementations = "findImplementations",
    LoadCore = "loadTypescriptAndQingkuaiCompiler",
    GetColorPresentations = "getColorPresentations",
    ResolveCompletionItem = "resolveCompletionItem"
}

export const defaultMessage = {
    left: defaultMessageItem,
    right: defaultMessageItem
}

// prettier-ignore
export const initialComponentCode = `\
<lang-ts>
    let target = "World"

    setTimeout(() => {
        target = "Qingkuai"
    }, 1000)
</lang-ts>

<h1>Hello {target}!</h1>
<label>
    Say hello to:
    <input
        &value={target}
        spellcheck="false"
    />
</label>

<lang-css>
    h1 {
        color: #2296f3;
    }
    input {
        margin-left: 8px;
    }
</lang-css>
`

export const libFileRE = /lib\.\w+\.d\.ts/
export const tsVersionsPms = listVersions("typescript")
export const qingkuaiVersionsPms = listVersions("qingkuai")
export const externalFileRE = /^\/(?:node_modules|compiled)/
export const qingkuaiRuntimeDtsPath = "/node_modules/qingkuai/dist/runtime/index.d.ts"
export const typeDeclarationFilePath = "/____qingkuai-intermidiate-code-environment____.d.ts"
