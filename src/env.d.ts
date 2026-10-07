interface ImportMetaEnv {
    readonly VITE_LOCAL_PACKAGES?: string
}

interface Window {
    MonacoEnvironment?: import("monaco-editor-core").Environment
}

declare module "prettier-plugin-qingkuai" {
    import type { Plugin } from "prettier"
    const plugin: Plugin
    export default plugin
}

// 以下模块运行时从 CDN（esm.sh）动态导入，类型取自本地依赖；
// esm.sh 对 CJS 包的默认导出即模块导出对象本身，本地类型多为具名导出，故用 typeof import 建模默认导出
declare module "https://esm.sh/onigasm@2.2.5" {
    const onigasm: typeof import("onigasm")
    export default onigasm
}

declare module "https://esm.sh/css-tree@3.1.0" {
    export * from "css-tree"
}

declare module "https://esm.sh/monaco-textmate@3.0.1" {
    const monacoTextMate: typeof import("monaco-textmate")
    export default monacoTextMate
}

declare module "https://esm.sh/monaco-editor-textmate@4.0.0" {
    const monacoEditorTextMate: typeof import("monaco-editor-textmate")
    export default monacoEditorTextMate
}

declare module "https://esm.sh/qingkuai@*/compiler" {
    export * from "qingkuai/compiler"
}

declare module "https://esm.sh/prettier@3.5.3/standalone" {
    export * from "prettier/standalone"
}

declare module "https://esm.sh/prettier@3.5.3/plugins/acorn" {
    export * from "prettier/plugins/acorn"
}

declare module "https://esm.sh/prettier@3.5.3/plugins/babel" {
    export * from "prettier/plugins/babel"
}

declare module "https://esm.sh/prettier@3.5.3/plugins/estree" {
    export * from "prettier/plugins/estree"
}

declare module "https://esm.sh/prettier@3.5.3/plugins/postcss" {
    export * from "prettier/plugins/postcss"
}

declare module "https://esm.sh/prettier-plugin-qingkuai@1.0.46" {
    export * from "prettier-plugin-qingkuai"
}
