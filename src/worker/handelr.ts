import type Monaco from "monaco-editor-core"
import type { Color } from "vscode-languageserver-types"
import type { MessageBoxProps } from "../types/component"
import type { InsertSnippetParam } from "qingkuai-language-service"
import type { Model, WorkerHandlerBaseParam } from "../types/communication"
import type { MonacoCodeLensItemWithOriginal, MonacoCompletionItemWithOriginal } from "../types/monaco"

import {
    fsMap,
    handlerPms,
    deleteFile,
    projectKind,
    compileCache,
    scriptVersion,
    tsLanguageService,
    prettierAndPlugins
} from "./state"
import { Handlers } from "../util/constants"
import { isQingkuaiFile, isString } from "../util/assert"
import { loadTypescriptAndQingkuaiCompiler } from "./load"
import { createLsTextDocument, pathImplementation } from "./mock"
import { qingkuaiLanguageService, qingkuaiLanguageServiceAdapter } from "../util/loadpkg"
import { compileToInterCode, compileToRuntime, getInterCompileResultByPath } from "./compile"

const {
    rename,
    format,
    doHover,
    codeLens,
    doComplete,
    prepareRename,
    getDiagnostic,
    findReferences,
    findDefinitions,
    resolveCodeLens,
    getDocumentColors,
    findImplementations,
    getColorPresentations,
    resolveEmmetCompletion,
    resolveScriptBlockCompletion
} = qingkuaiLanguageService
const { convertor } = qingkuaiLanguageServiceAdapter

self.onmessage = async ({ data: { id, name, arg } }: { data: WorkerHandlerBaseParam }) => {
    const response = (arg: any) => {
        self.postMessage({ id, name, arg })
    }

    // 等待typescript语言服务创建完成
    if (name === Handlers.LoadCore) {
        return await loadTypescriptAndQingkuaiCompiler(arg.tsVersion, arg.qingkuaiVersion), response(null)
    }
    if (handlerPms.state === "pending") {
        await handlerPms
    }
    switch (name) {
        case Handlers.DeleteFile: {
            return response(await _deleteFile(arg))
        }
        case Handlers.CodeLens: {
            return response(await _codeLens(arg))
        }
        case Handlers.GetDocumentColors: {
            return response(_getDocumentColors(arg))
        }
        case Handlers.FormatDocument: {
            return response(await _formatDocument(arg))
        }
        case Handlers.GetDiagnostic: {
            return response(await _getDiagnostics(arg))
        }
        case Handlers.ResolveCodeLens: {
            return response(await _resolveCodeLens(arg))
        }
        case Handlers.ResolveCompletionItem: {
            return response(await _resolveCompletionItem(arg))
        }
        case Handlers.Hover: {
            return response(await _doHover(arg.model, arg.offset))
        }
        case Handlers.PrepareRename: {
            return response(await _prepareRename(arg.model, arg.offset))
        }
        case Handlers.FindReferences: {
            return response(await _findReferences(arg.model, arg.offset))
        }
        case Handlers.FindDefinitions: {
            return response(await _findDefinitions(arg.model, arg.offset))
        }
        case Handlers.Rename: {
            return response(await _rename(arg.model, arg.offset, arg.newName))
        }
        case Handlers.FindImplementations: {
            return response(await _findImplementations(arg.model, arg.offset))
        }
        case Handlers.GetCompletions: {
            return response(await _doComplete(arg.model, arg.offset, arg.trigger))
        }
        case Handlers.GetCompileResult: {
            return response(await _getCompileResult(arg.model, arg.debug, arg.comment))
        }
        case Handlers.GetColorPresentations: {
            return response(await _getColorPresentations(arg.model, arg.range, arg.color))
        }
    }
}

async function _deleteFile(fileName: string) {
    deleteFile(fileName)
    fsMap.delete(fileName)
    compileCache.delete(fileName)
    scriptVersion.delete(fileName)
}

async function _getCompileResult(model: Model, debug: boolean, comment: boolean) {
    return await compileToRuntime(model, debug, comment)
}

async function _codeLens(model: Model) {
    return await codeLens(
        compileToInterCode(model),
        pathImplementation,
        fileName => {
            return tsLanguageService.getNavigationTree(fileName)
        },
        () => {
            return {
                referencesCodeLens: {
                    enabled: true,
                    showOnAllFunctions: true
                },
                implementationsCodeLens: {
                    enabled: true,
                    showOnInterfaceMethods: true
                }
            }
        }
    )
}

async function _resolveCodeLens(codeLens: MonacoCodeLensItemWithOriginal) {
    return await resolveCodeLens(codeLens._ori, getInterCompileResultByPath, (fileName, pos, type) => {
        if (type === "implementation") {
            return convertor.findAndConvertImplementations(tsLanguageService, { fileName, pos })
        }
        return convertor.findAndConvertReferences(tsLanguageService, getInterCompileResultByPath, { fileName, pos })
    })
}

async function _doHover(model: Model, offset: number) {
    const cr = compileToInterCode(model)
    const languageServiceRet = await doHover(
        cr,
        offset,
        false,
        () => {
            return {
                references: true,
                documentation: true
            }
        },
        (fileName, pos) => convertor.getAndConvertHoverTip(tsLanguageService, { fileName, pos }),
        _getComponentInfos
    )
    return languageServiceRet
}

async function _getDiagnostics(model: Model) {
    const cr = compileToInterCode(model)
    const ret = await getDiagnostic(cr, fileName => {
        return convertor.getAndConvertDiagnostics(tsLanguageService, fileName, true)
    })
    cr.inputDescriptor.styles.forEach(item => {
        if (item.lang !== "css") {
            ret.push({
                message: `The ${item.lang} pre-processor is not supported in playground for the moment.`,
                range: cr.getRange(...item.startTagNameRange)
            })
        }
    })
    return ret
}

async function _doComplete(model: Model, offset: number, trigger: string) {
    const cr = compileToInterCode(model)
    return await doComplete(
        cr,
        offset,
        trigger,
        createLsTextDocument(model.uri, model.version, model.source, "html"),
        false,
        projectKind,
        _insertSnippet,
        _getComponentInfos,
        (fileName, pos) => convertor.getAndConvertCompletionInfo(tsLanguageService, { fileName, pos })
    )
}

async function _resolveCompletionItem(item: MonacoCompletionItemWithOriginal) {
    switch (item._ori.data?.kind) {
        case "emmet":
            return resolveEmmetCompletion(item._ori)
        case "script":
            return resolveScriptBlockCompletion(item._ori, getInterCompileResultByPath, item =>
                convertor.getAndConvertCompletionDetail(tsLanguageService, item.data)
            )
    }
    return item
}

async function _prepareRename(model: Model, offset: number) {
    return await prepareRename(compileToInterCode(model), offset, (cr, pos) => {
        return convertor.prepareRenameAndConvert(tsLanguageService, { fileName: cr.filePath, pos })
    })
}

async function _rename(model: Model, offset: number, newName: string) {
    return await rename(compileToInterCode(model), offset, newName, getInterCompileResultByPath, (fileName, pos) => {
        return convertor.renameAndConvert(tsLanguageService, { fileName, pos })
    })
}

async function _formatDocument(model: Model) {
    if (!isQingkuaiFile(model.uri)) {
        const cr = compileToInterCode(model)
        const isTS = cr.inputDescriptor.script.isTS
        const isCSS = !!cr.inputDescriptor.styles[0]
        const [prettier, ...plugins] = prettierAndPlugins
        return [
            {
                newText: await prettier.format(model.source, {
                    plugins,
                    ...cr.config.prettierConfig,
                    parser: isCSS ? "css" : isTS ? "babel-ts" : "babel"
                }),
                range: cr.getRange(0, cr.inputDescriptor.source.length)
            }
        ]
    }
    return await format(prettierAndPlugins, compileToInterCode(model), msg => _showMessage("error", msg))
}

async function _findDefinitions(model: Model, offset: number) {
    return await findDefinitions(
        compileToInterCode(model),
        offset,
        pathImplementation,
        getInterCompileResultByPath,
        _getComponentInfos,
        (cr, pos) => convertor.getAndConvertDefinitions(tsLanguageService, { fileName: cr.filePath, pos })
    )
}

async function _findImplementations(model: Model, offset: number) {
    return await findImplementations(compileToInterCode(model), offset, (fileName, pos) => {
        return convertor.findAndConvertImplementations(tsLanguageService, { fileName, pos })
    })
}

async function _findReferences(model: Model, offset: number) {
    return await findReferences(
        compileToInterCode(model),
        offset,
        pathImplementation,
        getInterCompileResultByPath,
        (fileName, pos) => {
            return convertor.findAndConvertReferences(tsLanguageService, getInterCompileResultByPath, { fileName, pos })
        }
    )
}

function _getDocumentColors(model: Model) {
    return getDocumentColors(compileToInterCode(model))
}

function _insertSnippet(param: string | InsertSnippetParam) {
    const paramIsString = isString(param)
    self.postMessage({
        name: Handlers.insertSnippet,
        text: paramIsString ? param : param.text,
        command: paramIsString ? undefined : param.command
    })
}

function _getComponentInfos(fileName: string) {
    return convertor.getComponentInfos(tsLanguageService, fileName)
}

function _showMessage(type: MessageBoxProps["type"], value: string) {
    self.postMessage({ value, type, name: Handlers.ShowMessage })
}

function _getColorPresentations(model: Model, range: Monaco.IRange, color: Color) {
    return getColorPresentations(
        compileToInterCode(model),
        {
            end: { line: range.endLineNumber - 1, character: range.endColumn - 1 },
            start: { line: range.startLineNumber - 1, character: range.startColumn - 1 }
        },
        color
    )
}
