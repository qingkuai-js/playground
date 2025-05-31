import type Monaco from "monaco-editor-core"
import type { Model } from "../../types/communication"
import type { MonacoCodeLensItemWithOriginal, MonacoCompletionItemWithOriginal } from "../../types/monaco"
import type { GeneralFunc, PromiseWithState, RuntimeCompileResult } from "../../types/common"

import * as monaco from "monaco-editor-core"
import { Handlers } from "../../util/constants"
import { convertHover } from "./convertor/hover"
import { leftEditor, store } from "../../util/state"
import { convertLocations } from "./convertor/location"
import { convertDiagnostic } from "./convertor/diagnostic"
import { qingkuaiLanguageService } from "../../util/loadpkg"
import LanguageWorker from "../../worker/handelr?worker&inline"
import { convertCodeLens, convertCodeLensList } from "./convertor/code-lens"
import { convertCompletionItem, convertCompletions } from "./convertor/completion"
import { convertColorPresentations, convertDocumentColors } from "./convertor/color"
import { convertRange, convertTextEdit, convertWorkspaceEdit } from "./convertor/struct"
import { isExternalFileName } from "../../util/assert"
import { fileUriToPath } from "../../util/sundary"

export default class {
    private reqid = 0
    private worker = new LanguageWorker()
    private promises: Record<string, readonly [PromiseWithState, GeneralFunc]> = {}

    constructor() {
        this.worker.onmessage = ({ data }) => {
            if (excuteClientHandler(data)) {
                return
            }
            if (this.promises[data.name + data.id]) {
                this.promises[data.name + data.id][1](data.arg)
            }
        }
    }

    private async request<R = any>(name: string, arg: any): Promise<R> {
        const [pms, res] = qingkuaiLanguageService.util.generatePromiseAndResolver()
        this.worker.postMessage({ id: ++this.reqid, name, arg })
        this.promises[name + this.reqid] = [pms, res]
        return await pms
    }

    public async getCompileResult(
        model: Model,
        debug: boolean,
        comment: boolean
    ): Promise<string | RuntimeCompileResult> {
        return await this.request(Handlers.GetCompileResult, { model, debug, comment })
    }

    public async deleteFile(fileName: string) {
        await this.request(Handlers.DeleteFile, fileName)
    }

    public async loadCore(tsVersion: string, qingkuaiVersion: string) {
        return await this.request(Handlers.LoadCore, { tsVersion, qingkuaiVersion })
    }

    public async codeLens(model: Model) {
        return convertCodeLensList(await this.request(Handlers.CodeLens, model))
    }

    public async resolveCodeLens(codeLens: MonacoCodeLensItemWithOriginal) {
        return convertCodeLens(await this.request(Handlers.ResolveCodeLens, codeLens))
    }

    public async prepareRename(model: Model, offset: number) {
        const lsRange = await this.request(Handlers.PrepareRename, { model, offset })
        return lsRange && convertRange(lsRange)
    }

    public async rename(model: Model, offset: number, newName: string) {
        const ret = await this.request(Handlers.Rename, { model, offset, newName })
        return ret && convertWorkspaceEdit(ret)
    }

    public async getDiagnostics(model: Model): Promise<Monaco.editor.IMarkerData[] | null> {
        return convertDiagnostic(await this.request(Handlers.GetDiagnostic, model))
    }

    public async getHoverTip(model: Model, offset: number): Promise<Monaco.languages.Hover | null> {
        return convertHover(await this.request(Handlers.Hover, { model, offset }))
    }

    public async getCompletions(
        model: Model,
        offset: number,
        trigger: string,
        defaultRange: Monaco.IRange
    ): Promise<Monaco.languages.CompletionList | null> {
        return convertCompletions(await this.request(Handlers.GetCompletions, { model, offset, trigger }), defaultRange)
    }

    public async resolveCompletionItem(
        item: MonacoCompletionItemWithOriginal
    ): Promise<MonacoCompletionItemWithOriginal> {
        const response = await this.request(Handlers.ResolveCompletionItem, item)
        if (response._ori) {
            return response
        }
        return convertCompletionItem(response, { range: item.range, commitChars: item.commitCharacters })
    }

    public async getDocumentFormattingEdits(model: Model) {
        return ((await this.request(Handlers.FormatDocument, model)) ?? []).map(convertTextEdit)
    }

    public async getDocumentColors(model: Model) {
        return convertDocumentColors(await this.request(Handlers.GetDocumentColors, model))
    }

    public async findReferences(model: Model, offset: number) {
        return convertLocations(await this.request(Handlers.FindReferences, { model, offset }))
    }

    public async findDefinitions(model: Model, offset: number) {
        const ret = convertLocations(await this.request(Handlers.FindDefinitions, { model, offset }))
        if (ret?.length === 1 && isExternalFileName(ret[0].uri.fsPath)) {
            return (store.showingExternalSingleDefinition = true), [ret[0], ret[0]]
        }
        return (store.showingExternalSingleDefinition = false), ret
    }

    public async findImplementations(model: Model, offset: number) {
        return convertLocations(await this.request(Handlers.FindImplementations, { model, offset }))
    }

    public async getColorPresentations(model: Model, range: Monaco.IRange, color: Monaco.languages.IColor) {
        return convertColorPresentations(await this.request(Handlers.GetColorPresentations, { model, range, color }))
    }
}

function excuteClientHandler(data: any) {
    switch (data.name) {
        case Handlers.ShowMessage: {
            return (store.message.left = data), true
        }
        case Handlers.FileLoaded: {
            return monaco.editor.createModel(data.content, "typescript", monaco.Uri.file(data.fileName))
        }
        case Handlers.insertSnippet: {
            const position = leftEditor.getPosition()
            if (!position) {
                return
            }

            ;(leftEditor.getContribution("snippetController2") as any)?.insert(data.text)
            return setTimeout(() => data.command && leftEditor.trigger("", data.command, 0), 20), true
        }
    }
    return false
}
