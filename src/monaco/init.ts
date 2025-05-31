import {
    tsVersionsPms,
    qingkuaiVersionsPms,
    initialComponentCode,
    defaultRuntimeCompileResult
} from "../util/constants"
import { render } from "../service/render"
import * as monaco from "monaco-editor-core"
import { qingkuaiLanguageService } from "../util/loadpkg"
import { wireLanguageTmGrammars } from "./languages/grammar"
import { registerQingkuaiProviders } from "./languages/provider"
import { fileUriToPath, getClonableModel } from "../util/sundary"
import { isExternalFile, isQingkuaiFile, isString } from "../util/assert"
import { cleanMessage, fileInfos, leftEditor, rightEditor, setState, store, worker } from "../util/state"

export async function initializeMonacoEditor() {
    await Promise.all([tsVersionsPms, qingkuaiVersionsPms])

    setState({
        leftEditor: monaco.editor.create(
            document.querySelector(".editors .left")!,
            {
                fontSize: 13,
                minimap: {
                    enabled: false
                },
                theme: "monokai-pro-spectrum"
            },
            {
                storageService: {
                    get() {},
                    remove() {},
                    getBoolean() {
                        return true
                    },
                    getNumber() {
                        return 0
                    },
                    store() {},
                    onWillSaveState() {},
                    onDidChangeStorage() {}
                }
            }
        ),
        rightEditor: monaco.editor.create(document.querySelector(".editors .right")!, {
            readOnly: true,
            fontSize: 13,
            overviewRulerLanes: 0,
            renderLineHighlight: "none",
            selectionHighlight: false,
            occurrencesHighlight: "off",
            theme: "monokai-pro-spectrum",
            minimap: {
                enabled: false
            }
        })
    })

    fileInfos.set("/compiled/_.css", {
        ...defaultRuntimeCompileResult,
        model: monaco.editor.createModel("", "css", monaco.Uri.file("/compiled/_.css"))
    })
    fileInfos.set("/compiled/_.ts", {
        ...defaultRuntimeCompileResult,
        model: monaco.editor.createModel("", "typescript", monaco.Uri.file("/compiled/_.ts"))
    })

    proxyOpenEditor()
    wireLanguageTmGrammars()
    registerQingkuaiProviders()
    registerPublishDiagnostic()

    leftEditor.setModel(monaco.editor.createModel(initialComponentCode, "qingkuai", monaco.Uri.file("/App.qk")))
    fileInfos.set("App.qk", { model: leftEditor.getModel()!, ...defaultRuntimeCompileResult })
    refreshCompiledCode(true)

    const removeEditListener = leftEditor.onDidChangeModelContent(() => {
        setState({ hasBeenEdited: true })
        removeEditListener.dispose()
    })
}

export async function refreshCompiledCode(rerender: boolean) {
    const model = leftEditor?.getModel()
    if (!worker || !rightEditor || !model) {
        return
    }

    const fileName = fileUriToPath(model.uri.toString()).slice(1)
    const compileResult = await worker.getCompileResult(getClonableModel(model), store.debug, store.comment)
    if (!isString(compileResult)) {
        const targetIsQingkuaiFile = isQingkuaiFile(fileName)
        store.rightFileTab.tabs = ["preview"].concat(targetIsQingkuaiFile ? ["script", "style"] : [])
        if (targetIsQingkuaiFile) {
            if (store.rightFileTab.activeIndex === 1) {
                const model = fileInfos.get("/compiled/_.ts")!.model
                model.setValue(compileResult.semiScript)
                rightEditor.setModel(model)
            } else if (store.rightFileTab.activeIndex === 2) {
                const model = fileInfos.get("/compiled/_.css")!.model
                model.setValue(compileResult.style || "/* no scoped style rule */")
                rightEditor.setModel(model)
            }
        }
        if (rerender && store.rightFileTab.activeIndex === 0) {
            const fileInfo = fileInfos.get(fileName)!
            fileInfos.set(fileName, {
                model: fileInfo.model,
                style: compileResult.style,
                script: compileResult.script,
                semiScript: compileResult.semiScript
            })
            render()
        }
    } else {
        store.message.right = {
            type: "error",
            value: `Compile failed with a fatal error: ${compileResult}`
        }
    }
}

export function addModel(languageId: string, fileName: string) {
    const model = monaco.editor.createModel("", languageId, monaco.Uri.file("/" + fileName))
    fileInfos.set(fileName, { ...defaultRuntimeCompileResult, model })
    return leftEditor.setModel(model), focusAndSetPosition(), model
}

export function changeModel(fileName: string) {
    const index = store.leftFileTab.tabs.findIndex(item => item === fileName)
    if (index !== -1) {
        const model = fileInfos.get(fileName)!.model
        leftEditor.setModel(model)
        focusAndSetPosition()
        publishDiagnostics(model, false)
        store.leftFileTab.activeIndex = index
        if (!isQingkuaiFile(fileName)) {
            store.rightFileTab.activeIndex = 0
        }
    }
    return index !== -1
}

const publishDiagnostics = qingkuaiLanguageService.util.debounce(
    async (model: monaco.editor.ITextModel, rerender: boolean) => {
        if ((cleanMessage(), model.isDisposed())) {
            return
        }

        const markers = await worker.getDiagnostics(getClonableModel(model))
        monaco.editor.setModelMarkers(model, "", markers || [])
        refreshCompiledCode(rerender)
    },
    350,
    m => m.uri
)

function proxyOpenEditor() {
    const editor = leftEditor as any
    const editorService = editor._codeEditorService
    const openEditorBase = editorService.openCodeEditor.bind(editorService)
    editorService.openCodeEditor = async (input: any, source: any) => {
        const result = await openEditorBase(input, source)
        if (result === null) {
            if (changeModel(fileUriToPath(input.resource.toString()).slice(1))) {
                editor.setPosition({
                    lineNumber: input.options.selection.startLineNumber,
                    column: input.options.selection.startColumn
                })
                editor.revealRangeInCenterIfOutsideViewport(input.options.selection)
            }
        }
        return result
    }
}

function registerPublishDiagnostic() {
    // 为model添加发布诊断功能
    monaco.editor.onDidCreateModel(model => {
        if (isExternalFile(model)) {
            return
        }
        publishDiagnostics(model, false)
        model.onDidChangeContent(() => publishDiagnostics(model, true))
    })
}

function focusAndSetPosition() {
    const model = leftEditor.getModel()!
    const line = model.getLineCount()
    const column = model.getLineMaxColumn(line)
    const position = new monaco.Position(line, column)
    leftEditor.focus()
    leftEditor.setPosition(position)
    leftEditor.revealPositionInCenter(position)
}
