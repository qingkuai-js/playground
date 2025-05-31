import type { LanguageItem } from "../../../types/monaco"

import cssLangConfig from "./css"
import qingkuaiLangConfig from "./qingkuai"
import typescriptLangConfig from "./typescript"

export const languages: LanguageItem[] = [
    {
        id: "ts",
        scope: "source.ts"
    },
    {
        id: "qk",
        scope: "source.qk"
    },
    {
        id: "qke",
        scope: "source.qke"
    },
    {
        id: "qingkuai-emmet",
        scope: "source.qke"
    },
    {
        id: "css",
        scope: "source.css",
        configuration: cssLangConfig
    },
    {
        id: "qingkuai",
        scope: "source.qk",
        configuration: qingkuaiLangConfig
    },
    {
        id: "typescript",
        scope: "source.ts",
        configuration: typescriptLangConfig
    }
]
