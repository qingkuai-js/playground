import type TS from "typescript"
import type { QingkuaiCompiler } from "../types/common"
import type { PrettierAndPlugins } from "qingkuai-language-service"

import * as semver from "semver"
import { store } from "./state"
import { lastElem } from "./sundary"

export async function listVersions(name: "qingkuai" | "typescript") {
    const min = name === "qingkuai" ? "1.0.46" : "4.7.0"
    const res = await fetch(`https://registry.npmmirror.com/${name}`)
    const versions = (await res.json()).versions ?? {}
    const filtered = Object.keys(versions).filter(k => {
        return /^\d+\.\d+\.\d+$/.test(k) && semver.gte(k, min)
    })
    if (name === "typescript") {
        store.tsVersion = lastElem(filtered)
    } else {
        store.qingkuaiVersion = lastElem(filtered)
    }
    return filtered.reverse()
}

export async function loadTypeScript(version: string) {
    return (await import(/* @vite-ignore */ `https://esm.sh/typescript@${version}`)) as typeof TS
}

export async function loadQingkuaiCompiler(version: string) {
    return (await import(/* @vite-ignore */ `https://esm.sh/qingkuai@${version}/compiler`)) as typeof QingkuaiCompiler
}

export async function loadPrettierAndPlugins(): Promise<PrettierAndPlugins> {
    return (await Promise.all([
        import("https://esm.sh/prettier@3.5.3/standalone"),
        import("https://esm.sh/prettier@3.5.3/plugins/acorn"),
        import("https://esm.sh/prettier@3.5.3/plugins/babel"),
        import("https://esm.sh/prettier@3.5.3/plugins/estree"),
        import("https://esm.sh/prettier@3.5.3/plugins/postcss"),
        import("https://esm.sh/prettier-plugin-qingkuai@1.0.22")
    ])) as any
}

export async function loadTsVfs() {
    await fetch("https://esm.sh/@typescript/vfs@1.6.1")
}

export { default as onigasm } from "https://esm.sh/onigasm@2.2.5"
export { default as monacoTextMate } from "https://esm.sh/monaco-textmate@3.0.1"
export { default as monacoEditorTextMate } from "https://esm.sh/monaco-editor-textmate@4.0.0"

export * as csstree from "https://esm.sh/css-tree@3.1.0"
export * as qingkuaiLanguageService from "https://esm.sh/qingkuai-language-service"
export * as vscodeLanguageServerTypes from "https://esm.sh/vscode-languageserver-types@3.17.5"
export * as qingkuaiLanguageServiceAdapter from "https://esm.sh/qingkuai-language-service/adapters"
