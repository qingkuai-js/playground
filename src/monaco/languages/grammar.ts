import * as monaco from "monaco-editor-core"
import { languages } from "./configurations"
import { leftEditor } from "../../util/state"
import { monacoTextMate, monacoEditorTextMate, onigasm } from "../../util/loadpkg"

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
            if (!languageId) {
                throw new Error("unknown language: " + scopeName)
            }
            return {
                format: "json",
                content: await (await fetch(`/grammars/${languageId}.tmLanguage.json`)).text()
            }
        }
    })

    // @ts-ignore
    await monacoEditorTextMate.wireTmGrammars(monaco, registry, grammars, leftEditor)
}
