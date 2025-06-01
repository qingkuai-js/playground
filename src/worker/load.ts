import type TS from "typescript"
import type { QingkuaiConfiguration } from "qingkuai-language-service"

import {
    loadTypeScript,
    loadQingkuaiCompiler,
    loadPrettierAndPlugins,
    qingkuaiLanguageServiceAdapter
} from "../util/loadpkg"
import { isQingkuaiFile } from "../util/assert"
import { fsImplementation, pathImplementation } from "./mock"
import { Handlers, qingkuaiRuntimeDtsPath, typeDeclarationFilePath } from "../util/constants"
import { createDefaultMapFromCDN, createSystem, createVirtualLanguageServiceHost } from "@typescript/vfs"
import { compileCache, fsMap, setState, handlerResolver, scriptVersion, componentAttributeInfos } from "./state"

const { proxies, init, convertor } = qingkuaiLanguageServiceAdapter

export async function loadTypescriptAndQingkuaiCompiler(tsVersion: string, qingkuaiVersion: string) {
    // 标记typesript language service, qingkuai compiler未加载完成
    setState({ isReload: true })

    const [ts, qingkuaiCompiler] = await Promise.all([loadTypeScript(tsVersion), loadQingkuaiCompiler(qingkuaiVersion)])
    const userPreference: TS.UserPreferences = {
        includeCompletionsWithInsertText: true,
        includeCompletionsForModuleExports: true,
        includeCompletionsForImportStatements: true,
        includeCompletionsWithClassMemberSnippets: true,
        includeCompletionsWithObjectLiteralMethodSnippets: true,
        includeCompletionsWithSnippetText: true,
        includeInlayEnumMemberValueHints: true,
        includeInlayFunctionLikeReturnTypeHints: true,
        includeInlayFunctionParameterTypeHints: true,
        includeInlayParameterNameHints: "all",
        includeInlayParameterNameHintsWhenArgumentMatchesName: true,
        includeInlayPropertyDeclarationTypeHints: true,
        includeInlayVariableTypeHints: true,
        includeInlayVariableTypeHintsWhenTypeMatchesName: true,
        includePackageJsonAutoImports: "auto",
        interactiveInlayHints: true,
        preferTypeOnlyAutoImports: false,
        providePrefixAndSuffixTextForRename: true,
        provideRefactorNotApplicableReason: true,
        quotePreference: "double",
        useLabelDetailsInCompletionEntries: true
    }
    const compilerOptions: TS.CompilerOptions = {
        lib: ["esnext", "dom"],
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.ESNext,
        allowNonTsExtensions: true,
        paths: {
            qingkuai: [qingkuaiRuntimeDtsPath]
        },
        allowImportingTsExtensions: true,
        moduleResolution: ts.ModuleResolutionKind.Bundler
    }
    const qingkuaiConfig: QingkuaiConfiguration = {
        resolveImportExtension: true,
        convenientDerivedDeclaration: true
    }
    const formattingOptions: TS.FormatCodeSettings = {
        semicolons: ts.SemicolonPreference.Ignore
    }

    const ensureGetSourceFile = (fileName: string) => {
        return (
            tsLanguageService.getProgram()!.getSourceFile(fileName) ||
            ts.createSourceFile(fileName, fsMap.get(fileName)!, ts.ScriptTarget.ESNext)
        )
    }

    // 加载qingkuai/runtime类型定义文件
    const qingkuaiRuntimeDtsRes = await fetch(
        `https://unpkg.com/qingkuai@${qingkuaiVersion}/dist/types/runtime/index.d.ts`
    )
    const qingkuaiRuntimeDtsContent = await qingkuaiRuntimeDtsRes.text()
    fsMap.set(qingkuaiRuntimeDtsPath, qingkuaiRuntimeDtsContent)
    self.postMessage({
        name: Handlers.FileLoaded,
        fileName: qingkuaiRuntimeDtsPath,
        content: qingkuaiRuntimeDtsContent
    })

    // 使用@typescript/vsf从cdn加载需要的lib类型声明文件并存入fsMap
    ;(await createDefaultMapFromCDN(compilerOptions, ts.version, false, ts)).forEach((content, fileName) => {
        if (!content.startsWith("Couldn't find")) {
            const libFileName = `/node_modules/typescript/lib${fileName}`
            fsMap.set(libFileName, content)
            self.postMessage({ name: Handlers.FileLoaded, content, fileName: libFileName })
        }
    })

    // 初始化qingkuai-language-service/adapter
    init({
        ts,
        fs: fsImplementation,
        typeDeclarationFilePath,
        path: pathImplementation,
        getCompileInfo: fileName => {
            const cr = compileCache.get(fileName)!
            const isTS = cr.inputDescriptor.script.isTS
            return {
                content: cr.code,
                itos: cr.interIndexMap.itos,
                slotInfo: cr.inputDescriptor.slotInfo,
                positions: cr.inputDescriptor.positions,
                scriptKind: ts.ScriptKind[isTS ? "TS" : "JS"],
                attributeInfos: componentAttributeInfos.get(fileName)!,
                refAttrValueStartIndexes: new Set(cr.inputDescriptor.refAttrValueStartIndexes)
            }
        },
        getConfig: () => qingkuaiConfig,
        getUserPreferences: () => userPreference,
        getFormattingOptions: () => formattingOptions,
        getTsLanguageService: () => tsLanguageService,
        getFullFileNames: () => Array.from(fsMap.keys()),
        getLineAndCharacter(fileName, pos) {
            return ensureGetSourceFile(fileName).getLineAndCharacterOfPosition(pos)
        },
        getInterIndexByLineAndCharacter(fileName, { line, character }) {
            return ensureGetSourceFile(fileName).getPositionOfLineAndCharacter(line, character)
        }
    })

    const libFileNames = Array.from(fsMap.keys())
    const system = createSystem(fsMap)
    const {
        deleteFile,
        updateFile,
        languageServiceHost: tsLanguageServiceHost
    } = createVirtualLanguageServiceHost(system, libFileNames, compilerOptions, ts)
    const tsLanguageService = ts.createLanguageService(tsLanguageServiceHost)

    const updateSourceFile = (fileName: string, content: string) => {
        const sourceFile = ensureGetSourceFile(fileName)
        ;(sourceFile.text = content), updateFile(sourceFile)
        scriptVersion.set(fileName, scriptVersion.get(fileName)! + 1)
    }

    const ensureExportAndUpdate = (fileName: string) => {
        const cr = compileCache.get(fileName)!
        const program = tsLanguageService.getProgram()!
        if (!program.getSourceFile(fileName)) {
            updateFile(ensureGetSourceFile(fileName))
            scriptVersion.set(fileName, 1)
        }

        let content = cr.code
        if ((updateSourceFile(fileName, content), isQingkuaiFile(fileName))) {
            updateSourceFile(
                fileName,
                (content = convertor.ensureExport(tsLanguageService, cr.filePath, cr.code, cr.typeDeclarationLen))
            )
            componentAttributeInfos.set(fileName, convertor.getComponentAttributes(tsLanguageService, fileName))
        }
        fsMap.set(fileName, content)
    }

    setState({
        ts,
        system,
        qingkuaiCompiler,
        tsLanguageService,
        tsLanguageServiceHost,
        updateFile: ensureExportAndUpdate,
        prettierAndPlugins: await loadPrettierAndPlugins(),
        deleteFile: fileName => deleteFile(ensureGetSourceFile(fileName))
    })

    // 代理typescript语言服务
    tsLanguageServiceHost.resolveModuleNameLiterals = (moduleLiterals, containingFile) => {
        return moduleLiterals.map(literal => {
            return ts.resolveModuleName(literal.text, containingFile, compilerOptions, system)
        })
    }
    proxies.proxyGetCompletionsAtPosition(tsLanguageService)
    proxies.proxyResolveModuleNameLiterals(tsLanguageServiceHost, () => true)

    const getScriptKind = tsLanguageServiceHost.getScriptKind!
    tsLanguageServiceHost.getScriptKind = fileName => {
        const cr = compileCache.get(fileName)
        if (cr) {
            return ts.ScriptKind[cr.inputDescriptor.script.isTS ? "TS" : "JS"]
        }
        return getScriptKind?.call(tsLanguageServiceHost, fileName)
    }

    tsLanguageServiceHost.getScriptVersion = fileName => {
        return (scriptVersion.get(fileName) ?? 1).toString()
    }

    const getScriptSnapstot = tsLanguageServiceHost.getScriptSnapshot
    tsLanguageServiceHost.getScriptSnapshot = fileName => {
        const content = fsMap.get(fileName)
        if (content !== undefined) {
            return ts.ScriptSnapshot.fromString(content)
        }
        return getScriptSnapstot.call(tsLanguageServiceHost, fileName)
    }

    // 完成加载
    handlerResolver()
}
