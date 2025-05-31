import type TS from "typescript"
import type { SetStateOptions } from "../types/worker"
import type { QingkuaiCompiler } from "../types/common"
import type { CompileResult, ComponentAttributeItem, PrettierAndPlugins } from "qingkuai-language-service"

import qingkuaiEnvDts from "./dts/qingkuai.d.ts?raw"
import { qingkuaiLanguageService } from "../util/loadpkg"
import { typeDeclarationFilePath } from "../util/constants"

export let updateFile: (fileName: string) => void
export let deleteFile: (fileName: string) => void

export let ts: typeof TS
export let system: TS.System
export let tsLanguageService: TS.LanguageService
export let prettierAndPlugins: PrettierAndPlugins
export let qingkuaiCompiler: typeof QingkuaiCompiler
export let tsLanguageServiceHost: TS.LanguageServiceHost
export let projectKind = qingkuaiLanguageService.ProjectKind.JS
export let [handlerPms, handlerResolver] = qingkuaiLanguageService.util.generatePromiseAndResolver()

export const scriptVersion = new Map<string, number>()
export const compileCache = new Map<string, CompileResult>()
export const componentAttributeInfos = new Map<string, ComponentAttributeItem[]>()
export const fsMap = new Map<string, string>([[typeDeclarationFilePath, qingkuaiEnvDts]])

export function setState(options: SetStateOptions) {
    if (options.ts) {
        ts = options.ts
    }
    if (options.system) {
        system = options.system
    }
    if (options.updateFile) {
        updateFile = options.updateFile
    }
    if (options.deleteFile) {
        deleteFile = options.deleteFile
    }
    if (options.projectKind) {
        projectKind = options.projectKind
    }
    if (options.qingkuaiCompiler) {
        qingkuaiCompiler = options.qingkuaiCompiler
    }
    if (options.tsLanguageService) {
        tsLanguageService = options.tsLanguageService
    }
    if (options.prettierAndPlugins) {
        prettierAndPlugins = options.prettierAndPlugins
    }
    if (options.tsLanguageServiceHost) {
        tsLanguageServiceHost = options.tsLanguageServiceHost
    }
    if (options.isReload) {
        ;[handlerPms, handlerResolver] = qingkuaiLanguageService.util.generatePromiseAndResolver()
    }
}

export const typeRefStatement = `import {__c__,rea,der,wat,Wat,waT} from "${typeDeclarationFilePath.slice(0, -5)}"\n`
