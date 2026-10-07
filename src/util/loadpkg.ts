import type TS from "typescript"
import type { QingkuaiCompiler } from "../types/common"
import type { PrettierAndPlugins } from "qingkuai-language-service"

import * as semver from "semver"

import { store } from "./state"
import { lastElem } from "./sundary"

export async function listVersions(name: "qingkuai" | "typescript") {
    const min = name === "qingkuai" ? "1.0.101" : "5.6.0"
    const res = await fetch(`https://registry.npmmirror.com/${name}`)
    const versions = (await res.json()).versions ?? {}
    const filtered = Object.keys(versions).filter((k) => {
        return (
            /^\d+\.\d+\.\d+$/.test(k) &&
            semver.gte(k, min) &&
            (name !== "typescript" || semver.major(k) < 7)
        )
    })
    if (name === "typescript") {
        store.tsVersion = lastElem(filtered)
    } else {
        store.qingkuaiVersion = lastElem(filtered)
    }
    return filtered.reverse()
}

// 包加载来源开关（VITE_LOCAL_PACKAGES 环境变量
export const USE_LOCAL_PACKAGES = import.meta.env.VITE_LOCAL_PACKAGES === "true"

export async function loadTypeScript(version: string) {
    const mod = USE_LOCAL_PACKAGES
        ? await import("typescript")
        : await import(/* @vite-ignore */ `https://esm.sh/typescript@${version}`)

    // 取 default（CJS 互操作下的原始导出对象）：模块命名空间不可扩展，
    // 而 worker 侧需要往 ts 上挂载虚拟文件系统（ts.sys）
    return ((mod as { default?: typeof TS }).default ?? mod) as typeof TS
}

export async function loadQingkuaiCompiler(version: string) {
    if (USE_LOCAL_PACKAGES) {
        return (await import("qingkuai/compiler")) as typeof QingkuaiCompiler
    }
    return (await import(
        /* @vite-ignore */ `https://esm.sh/qingkuai@${version}/compiler`
    )) as typeof QingkuaiCompiler
}

export * as localQingkuaiCompiler from "qingkuai/compiler"

export async function loadPrettierAndPlugins(): Promise<PrettierAndPlugins> {
    if (USE_LOCAL_PACKAGES) {
        return (await Promise.all([
            import("prettier/standalone"),
            import("prettier-plugin-qingkuai"),
            import("prettier/plugins/acorn"),
            import("prettier/plugins/babel"),
            import("prettier/plugins/estree"),
            import("prettier/plugins/postcss")
        ])) as any
    }
    return (await Promise.all([
        import(/* @vite-ignore */ "https://esm.sh/prettier@3.5.3/standalone"),
        import(/* @vite-ignore */ "https://esm.sh/prettier-plugin-qingkuai@1.0.46"),
        import(/* @vite-ignore */ "https://esm.sh/prettier@3.5.3/plugins/acorn"),
        import(/* @vite-ignore */ "https://esm.sh/prettier@3.5.3/plugins/babel"),
        import(/* @vite-ignore */ "https://esm.sh/prettier@3.5.3/plugins/estree"),
        import(/* @vite-ignore */ "https://esm.sh/prettier@3.5.3/plugins/postcss")
    ])) as any
}

export { default as onigasm } from "https://esm.sh/onigasm@2.2.5"
export { default as monacoTextMate } from "https://esm.sh/monaco-textmate@3.0.1"
export { default as monacoEditorTextMate } from "https://esm.sh/monaco-editor-textmate@4.0.0"

export * as csstree from "https://esm.sh/css-tree@3.1.0"
export * as vscodeLanguageServerTypes from "vscode-languageserver-types"

// language-service 直接打包本地链接的最新实现（node_modules/qingkuai-language-service -> language-features 仓库），
// 保证运行时行为与类型检查基于同一份代码；若改回 CDN 需注意已发布版本的 API 可能落后于本地实现
export * as qingkuaiLanguageService from "qingkuai-language-service"
export * as qingkuaiLanguageServiceAdapter from "qingkuai-language-service/adapters"
export { default as qingkuaiGrammar } from "qingkuai-language-service/grammars/qingkuai"
export { default as qingkuaiEmmetGrammar } from "qingkuai-language-service/grammars/qingkuai-emmet"
