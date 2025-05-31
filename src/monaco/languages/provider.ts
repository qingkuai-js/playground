import LanguageWorker from "./worker"
import * as monaco from "monaco-editor-core"
import { languages } from "./configurations"
import { isExternalFile } from "../../util/assert"
import { getClonableModel } from "../../util/sundary"
import { qingkuaiLanguageService } from "../../util/loadpkg"
import { setState, store, worker } from "../../util/state"

export function registerQingkuaiProviders() {
    setState({
        languageWorker: new LanguageWorker()
    })

    const languageWorker = worker
    const languageSelector = languages.map(lang => lang.id)

    // 加载typescript language service, qingkuai compiler
    languageWorker.loadCore(store.tsVersion, store.qingkuaiVersion).then(() => {
        store.resolving = false
    })

    monaco.languages.registerHoverProvider(languageSelector, {
        async provideHover(model, position, token) {
            if (token.isCancellationRequested || isExternalFile(model)) {
                return null
            }
            return languageWorker.getHoverTip(getClonableModel(model), model.getOffsetAt(position))
        }
    })

    monaco.languages.registerCompletionItemProvider(languageSelector, {
        triggerCharacters: qingkuaiLanguageService.COMPLETION_TRIGGER_CHARS,

        async provideCompletionItems(model, position, context, token) {
            if (token.isCancellationRequested || isExternalFile(model)) {
                return null
            }
            return languageWorker.getCompletions(
                getClonableModel(model),
                model.getOffsetAt(position),
                context.triggerCharacter ?? "",
                {
                    endColumn: position.column,
                    startColumn: position.column,
                    endLineNumber: position.lineNumber,
                    startLineNumber: position.lineNumber
                }
            )
        },

        async resolveCompletionItem(item, token) {
            if (token.isCancellationRequested) {
                return
            }
            return languageWorker.resolveCompletionItem(item as any)
        }
    })

    monaco.languages.registerRenameProvider(languageSelector, {
        async resolveRenameLocation(model, position, token) {
            if (token.isCancellationRequested || isExternalFile(model)) {
                return null
            }
            const range = await languageWorker.prepareRename(getClonableModel(model), model.getOffsetAt(position))
            return range && { range, text: model.getValueInRange(range) }
        },

        async provideRenameEdits(model, position, newName, token) {
            if (token.isCancellationRequested || isExternalFile(model)) {
                return null
            }
            return languageWorker.rename(getClonableModel(model), model.getOffsetAt(position), newName)
        }
    })

    monaco.languages.registerCodeLensProvider(languageSelector, {
        async provideCodeLenses(model, token) {
            if (!store.codeLens || token.isCancellationRequested || isExternalFile(model)) {
                return null
            }
            return languageWorker.codeLens(getClonableModel(model))
        },

        async resolveCodeLens(model, codeLens, token) {
            if (token.isCancellationRequested || isExternalFile(model)) {
                return null
            }
            return languageWorker.resolveCodeLens(codeLens as any)
        }
    })

    monaco.languages.registerDocumentFormattingEditProvider(languageSelector, {
        async provideDocumentFormattingEdits(model, _, token) {
            if (token.isCancellationRequested || isExternalFile(model)) {
                return null
            }
            return languageWorker.getDocumentFormattingEdits(getClonableModel(model))
        }
    })

    monaco.languages.registerColorProvider(languageSelector, {
        async provideDocumentColors(model, token) {
            if (token.isCancellationRequested || isExternalFile(model)) {
                return null
            }
            return languageWorker.getDocumentColors(getClonableModel(model))
        },

        async provideColorPresentations(model, colorInfo, token) {
            if (token.isCancellationRequested || isExternalFile(model)) {
                return null
            }
            return languageWorker.getColorPresentations(getClonableModel(model), colorInfo.range, colorInfo.color)
        }
    })

    monaco.languages.registerDefinitionProvider(languageSelector, {
        async provideDefinition(model, position, token) {
            if (token.isCancellationRequested || isExternalFile(model)) {
                return null
            }
            return languageWorker.findDefinitions(getClonableModel(model), model.getOffsetAt(position))
        }
    })

    monaco.languages.registerReferenceProvider(languageSelector, {
        async provideReferences(model, position, _, token) {
            if (token.isCancellationRequested || isExternalFile(model)) {
                return null
            }
            return languageWorker.findReferences(getClonableModel(model), model.getOffsetAt(position))
        }
    })

    monaco.languages.registerImplementationProvider(languageSelector, {
        async provideImplementation(model, position, token) {
            if (token.isCancellationRequested || isExternalFile(model)) {
                return null
            }
            return languageWorker.findImplementations(getClonableModel(model), model.getOffsetAt(position))
        }
    })

    return languageWorker
}
