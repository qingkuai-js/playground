import * as monaco from "monaco-editor-core"

import {
    store,
    worker,
    setState,
    fileInfos,
    leftEditor,
    rightEditor,
    cleanMessage
} from "../util/state"
import {
    tsVersionsPms,
    INITIAL_STYLE_CODE,
    qingkuaiVersionsPms,
    INITIAL_COMPONENT_CODE,
    DEFAULT_RUNTIME_COMPILE_RESULT
} from "../util/constants"
import { render } from "../service/render"
import { qingkuaiLanguageService } from "../util/loadpkg"
import { wireLanguageTmGrammars } from "./languages/grammar"
import { registerQingkuaiProviders } from "./languages/provider"
import { monacoThemeName } from "./themes/monakai-spectrum-light"
import { fileUriToPath, getClonableModel } from "../util/sundary"
import { isCssFile, isExternalFile, isQingkuaiFile, isString } from "../util/assert"

let renderPending = false

const EDITOR_FONT_FAMILY =
    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace'

export async function initializeMonacoEditor() {
    await Promise.all([tsVersionsPms, qingkuaiVersionsPms])

    setState({
        leftEditor: monaco.editor.create(
            document.querySelector(".editors .left .editor-host")!,
            {
                fontSize: 12,
                lineHeight: 20,
                automaticLayout: true,
                inlayHints: {
                    fontSize: 11,
                    padding: true
                },
                minimap: {
                    enabled: false
                },
                theme: monacoThemeName(store.theme),
                fontFamily: EDITOR_FONT_FAMILY
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
        rightEditor: monaco.editor.create(document.querySelector(".editors .right .editor-host")!, {
            minimap: {
                enabled: false
            },
            automaticLayout: true,
            readOnly: true,
            fontSize: 12,
            lineHeight: 20,
            inlayHints: {
                fontSize: 11,
                padding: true
            },
            overviewRulerLanes: 0,
            renderLineHighlight: "none",
            selectionHighlight: false,
            occurrencesHighlight: "off",
            theme: monacoThemeName(store.theme),
            fontFamily: EDITOR_FONT_FAMILY
        })
    })

    fileInfos.set("/compiled/_.css", {
        ...DEFAULT_RUNTIME_COMPILE_RESULT,
        model: monaco.editor.createModel("", "css", monaco.Uri.file("/compiled/_.css"))
    })
    fileInfos.set("/compiled/_.ts", {
        ...DEFAULT_RUNTIME_COMPILE_RESULT,
        model: monaco.editor.createModel("", "typescript", monaco.Uri.file("/compiled/_.ts"))
    })

    proxyOpenEditor()
    wireLanguageTmGrammars()
    registerQingkuaiProviders()
    registerPublishDiagnostic()

    fileInfos.set("style.css", {
        ...DEFAULT_RUNTIME_COMPILE_RESULT,
        model: monaco.editor.createModel(INITIAL_STYLE_CODE, "css", monaco.Uri.file("/style.css"))
    })
    leftEditor.setModel(
        monaco.editor.createModel(INITIAL_COMPONENT_CODE, "qingkuai", monaco.Uri.file("/App.qk"))
    )
    fileInfos.set("App.qk", {
        model: leftEditor.getModel()!,
        ...DEFAULT_RUNTIME_COMPILE_RESULT
    })
    await worker.getDiagnostics(getClonableModel(fileInfos.get("style.css")!.model))
    refreshCompiledCode(true)

    const removeEditListener = leftEditor.onDidChangeModelContent(() => {
        setState({ hasBeenEdited: true })
        removeEditListener.dispose()
    })
}

// monaco 的 setValue 无同内容短路（全量刷写会闪一帧并重置滚动位置）：
// 内容未变时跳过；真变化时保存/恢复视口，让编译视图跟随编辑时不跳动
function showCompiledCode(model: monaco.editor.ITextModel, content: string) {
    if (model.getValue() !== content) {
        const viewState = rightEditor.saveViewState()
        model.setValue(content)
        rightEditor.restoreViewState(viewState)
    }
    rightEditor.setModel(model)
}

// 右侧标签布局由左侧文件类型唯一决定；切文件时须与 activeIndex 映射同步重排，
// 否则新索引配旧数组会出现中间态（如 style 高亮瞬移到 script 位上）
function syncRightTabs(fileName: string) {
    store.rightFileTab.tabs = ["preview"].concat(
        isQingkuaiFile(fileName) ? ["script", "style"] : isCssFile(fileName) ? ["style"] : []
    )
}

export async function refreshCompiledCode(rerender: boolean) {
    const model = leftEditor?.getModel()
    if (!worker || !rightEditor || !model) {
        return
    }

    const fileName = fileUriToPath(model.uri.toString()).slice(1)
    const compileResult = await worker.getCompileResult(
        getClonableModel(model),
        store.debug,
        store.comment
    )
    if (isString(compileResult)) {
        store.message.right = {
            type: "error",
            value: `Compile failed with a fatal error: ${compileResult}`
        }
        return
    }

    const targetIsQingkuaiFile = isQingkuaiFile(fileName)
    const targetIsCssFile = isCssFile(fileName)
    syncRightTabs(fileName)

    if (targetIsQingkuaiFile) {
        if (store.rightFileTab.activeIndex === 1) {
            showCompiledCode(fileInfos.get("/compiled/_.ts")!.model, compileResult.semiScript)
        } else if (store.rightFileTab.activeIndex === 2) {
            showCompiledCode(
                fileInfos.get("/compiled/_.css")!.model,
                compileResult.style || "/* no scoped style rule */"
            )
        }
    } else {
        // 纯 css 文件没有自己的运行时样式，它的“编译产物”是引用它的入口组件 scoped 后的样式
        if (rerender) {
            await refreshEntryCompileResult(fileName)
        }
        if (targetIsCssFile && store.rightFileTab.activeIndex === 1) {
            const entryInfo = getEntryInfo(fileName)
            showCompiledCode(
                fileInfos.get("/compiled/_.css")!.model,
                entryInfo?.style || "/* no scoped style rule */"
            )
        }
    }

    // 编辑发生在非 preview 标签下时先记欠账，切回 preview 时补一次渲染
    if (rerender && store.rightFileTab.activeIndex !== 0) {
        renderPending = true
    }
    if (store.rightFileTab.activeIndex === 0 && (rerender || renderPending)) {
        const fileInfo = fileInfos.get(fileName)!
        fileInfos.set(fileName, {
            model: fileInfo.model,
            style: compileResult.style,
            script: compileResult.script,
            semiScript: compileResult.semiScript
        })
        renderPending = false
        render()
    }
}

// 除 excludedFileName 外的入口组件文件（.qk）信息
function getEntryInfo(excludedFileName: string) {
    const entryName = store.leftFileTab.tabs.find(
        (item) => isQingkuaiFile(item) && item !== excludedFileName
    )
    return entryName === undefined ? undefined : fileInfos.get(entryName)
}

async function refreshEntryCompileResult(excludedFileName: string) {
    const entryInfo = getEntryInfo(excludedFileName)
    if (!entryInfo) {
        return
    }

    const entryResult = await worker.getCompileResult(
        getClonableModel(entryInfo.model),
        store.debug,
        store.comment
    )
    if (!isString(entryResult)) {
        fileInfos.set(fileUriToPath(entryInfo.model.uri.toString()).slice(1), {
            model: entryInfo.model,
            style: entryResult.style,
            script: entryResult.script,
            semiScript: entryResult.semiScript
        })
    }
}

export function addModel(languageId: string, fileName: string) {
    const model = monaco.editor.createModel("", languageId, monaco.Uri.file("/" + fileName))
    fileInfos.set(fileName, { ...DEFAULT_RUNTIME_COMPILE_RESULT, model })
    return leftEditor.setModel(model), focusAndSetPosition(), model
}

export function changeModel(fileName: string) {
    const index = store.leftFileTab.tabs.findIndex((item) => item === fileName)
    if (index !== -1) {
        const model = fileInfos.get(fileName)!.model
        leftEditor.setModel(model)
        focusAndSetPosition()
        publishDiagnostics(model, false)
        store.leftFileTab.activeIndex = index

        // 右侧尽量保持当前视图：视图在新文件类型下仍可用则保留位置，否则回退 preview。
        // 视图名须从旧布局读取，标签布局与索引再同步重排，避免中间态高亮错位
        const currentView = store.rightFileTab.tabs[store.rightFileTab.activeIndex] || "preview"
        syncRightTabs(fileName)
        if (isQingkuaiFile(fileName)) {
            store.rightFileTab.activeIndex =
                currentView === "script" ? 1 : currentView === "style" ? 2 : 0
        } else if (isCssFile(fileName)) {
            store.rightFileTab.activeIndex = currentView === "style" ? 1 : 0
        } else {
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
    (m) => m.uri
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
    // 为 model 添加发布诊断功能
    monaco.editor.onDidCreateModel((model) => {
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
