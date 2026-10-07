import type TS from "typescript"

import { knownLibFilesForCompilerOptions } from "@typescript/vfs"

const libLoaders = import.meta.glob("../../node_modules/typescript/lib/lib.*.d.ts", {
    query: "?raw",
    import: "default"
}) as Record<string, () => Promise<string>>

export async function createLocalDefaultLibMap(
    compilerOptions: TS.CompilerOptions,
    ts: typeof TS
): Promise<Map<string, string>> {
    const fileNames = knownLibFilesForCompilerOptions(compilerOptions, ts)
    const fsMap = new Map<string, string>()
    await Promise.all(
        fileNames.map(async (fileName) => {
            const key = Object.keys(libLoaders).find((k) => k.endsWith("/" + fileName))
            if (key) {
                fsMap.set("/" + fileName, await libLoaders[key]())
            }
        })
    )
    return fsMap
}

export async function fetchLocalQingkuaiDtsFiles(): Promise<
    { fileName: string; content: string }[]
> {
    const [runtime, brand, languageService] = await Promise.all([
        import("../../node_modules/qingkuai/dist/types/runtime/index.d.ts?raw"),
        import("../../node_modules/qingkuai/dist/types/language-service/brand.d.ts?raw"),
        import("../../node_modules/qingkuai/dist/types/language-service/qingkuai.d.ts?raw")
    ])
    return [
        {
            fileName: "/node_modules/qingkuai/dist/types/runtime/index.d.ts",
            content: runtime.default
        },
        {
            fileName: "/node_modules/qingkuai/dist/types/language-service/brand.d.ts",
            content: brand.default
        },
        {
            fileName: "/node_modules/qingkuai/dist/types/language-service/qingkuai.d.ts",
            content: languageService.default
        }
    ]
}
