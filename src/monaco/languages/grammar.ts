import * as monaco from "monaco-editor-core"

import {
    onigasm,
    monacoTextMate,
    qingkuaiGrammar,
    monacoEditorTextMate,
    qingkuaiEmmetGrammar
} from "../../util/loadpkg"
import { languages } from "./configurations"
import { leftEditor } from "../../util/state"

export async function wireLanguageTmGrammars() {
    const grammars = new Map<string, string>()
    const grammarsMap = new Map<string, string>()
    for (const { id, scope, configuration } of languages) {
        grammars.set(id, scope)
        grammarsMap.set(scope, id)
        monaco.languages.register({ id })
        if (configuration) {
            monaco.languages.setLanguageConfiguration(id, configuration)
        }
    }

    await onigasm.loadWASM("/lib/onigasm.wasm")

    const registry = new monacoTextMate.Registry({
        getGrammarDefinition: async scopeName => {
            const languageId = grammarsMap.get(scopeName)
            switch (languageId) {
                case undefined: {
                    throw new Error("unknown language: " + scopeName)
                }
                case "qingkuai": {
                    return {
                        format: "json",
                        content: stripNotSupportedLangs(qingkuaiGrammar)
                    }
                }
                case "qingkuai-emmet": {
                    return {
                        format: "json",
                        content: stripNotSupportedLangs(qingkuaiEmmetGrammar)
                    }
                }
                default: {
                    return {
                        format: "json",
                        content: await (await fetch(`/grammars/${languageId}.tmLanguage.json`)).text()
                    }
                }
            }
        }
    })

    // @ts-ignore
    await monacoEditorTextMate.wireTmGrammars(monaco, registry, grammars, leftEditor)
}

function stripNotSupportedLangs(grammar: any) {
    return JSON.stringify(grammar).replace(
        /"include":\s?"source\.(?:css\.)?(sass|scss|less|stylus|postcss|js)"/g,
        (_, g) => {
            if(g === "js"){
                return '"include":"source.ts"'
            }
            return '"include":"source.css"'
        }
    )
}
