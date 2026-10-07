import type { MessageBoxProps } from "../types/component"

import { listVersions } from "./loadpkg"

const DEFAULT_MESSAGE_ITEM: MessageBoxProps = {
    type: "error",
    value: ""
}

export const DEFAULT_RUNTIME_COMPILE_RESULT = {
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
    GetInlayHints = "getInlayHints",
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
    GetSignatureHelp = "getSignatureHelp",
    GetDocumentColors = "getDocumentColors",
    FindTypeDefinitions = "findTypeDefinitions",
    FindImplementations = "findImplementations",
    LoadCore = "loadTypescriptAndQingkuaiCompiler",
    GetColorPresentations = "getColorPresentations",
    ResolveCompletionItem = "resolveCompletionItem"
}

export const DEFAULT_MESSAGE = {
    left: DEFAULT_MESSAGE_ITEM,
    right: DEFAULT_MESSAGE_ITEM
}

// prettier-ignore
export const INITIAL_COMPONENT_CODE = `\
<lang-js>
    let count = 0
    let name = "World"

    setTimeout(() => {
        name = "Qingkuai"
    }, 1000)
</lang-js>

<div class="frame">
    <div class="doc">
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
    </div>
</div>

<lang-css src="./style.css" />
`

// prettier-ignore
export const INITIAL_STYLE_CODE = `\
.frame {
    height: 100vh;
    box-sizing: border-box;
    padding: 16px;
    background-color: #0a0a0a;
}
.doc {
    height: 100%;
    box-sizing: border-box;
    padding: 30px 34px;
    overflow: auto;
    color: #111;
    font-family: -apple-system, "SF Pro Text", "PingFang SC", "Segoe UI", sans-serif;
    border: 1px solid #262626;
    border-radius: 12px;
    background-color: #fff;
}
h1 {
    font-size: 30px;
    font-weight: 700;
    color: #2296f3;
    margin: 0 0 20px;
    letter-spacing: -0.4px;
}
input {
    display: block;
    width: 230px;
    margin-bottom: 18px;
    padding: 9px 13px;
    font: inherit;
    font-size: 14px;
    color: #18181b;
    outline: none;
    border: 1px solid #d4d4d8;
    border-radius: 8px;
    transition: 0.15s;
}
input:focus {
    border-color: #a1a1aa;
}
.btn {
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 10px 18px;
    font: inherit;
    font-size: 13.5px;
    font-weight: 500;
    border-radius: 8px;
    background-color: #18181b;
    transition: 0.15s;
}
.btn:hover {
    background-color: #3f3f46;
}
`

export const tsVersionsPms = listVersions("typescript")
export const qingkuaiVersionsPms = listVersions("qingkuai")
export const EXTERNAL_FILE_RE = /^\/(?:node_modules|compiled)/

export const LIB_FILE_RE = /lib\.\w+\.d\.ts/
export const STYLE_IMPORT_STATEMENT_RE = /@(?:import|use)\s+(['"])([^'"]+)\1\s*;/g

// 虚拟路径与 qingkuai 包内的真实布局保持一致，确保 d.ts 之间的相对导入可正确解析
export const QINGKUAI_RUNTIME_DTS_PATH = "/node_modules/qingkuai/dist/types/runtime/index.d.ts"
export const QINGKUAI_BRAND_DTS_PATH =
    "/node_modules/qingkuai/dist/types/language-service/brand.d.ts"
export const QINGKUAI_LS_DTS_PATH =
    "/node_modules/qingkuai/dist/types/language-service/qingkuai.d.ts"
