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
<lang-js>
    let count = 1
    let name = "World"

    setTimeout(() => {
        name = "Qingkuai"
    }, 1000)
</lang-js>

<h1>Hello {name}!</h1>

<input
    &value={name}
    spellcheck="false"
/>

<button
    class="btn"
    @click={count++}
>
    You have clicked {count} times.
</button>

<lang-css>
    h1 {
        color: #2296f3;
    }
    input {
        margin-right: 8px;
    }
    .btn {
        border: none;
        color: white;
        cursor: pointer;
        padding: 3px 5px;
        border-radius: 3px;
        background-color: black;
    }
</lang-css>
`

export const libFileRE = /lib\.\w+\.d\.ts/
export const tsVersionsPms = listVersions("typescript")
export const qingkuaiVersionsPms = listVersions("qingkuai")
export const externalFileRE = /^\/(?:node_modules|compiled)/
export const qingkuaiRuntimeDtsPath = "/node_modules/qingkuai/dist/runtime/index.d.ts"
export const typeDeclarationFilePath = "/____qingkuai-intermidiate-code-environment____.d.ts"
