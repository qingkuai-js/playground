import type TS from "typescript"

import type { NumNum } from "../types/common"
import type { AdapterTsProject, AdapterTsProjectService, TsPluginQingkuaiConfig } from "qingkuai-language-service"

import {
    loadTypeScript,
    loadQingkuaiCompiler,
    loadPrettierAndPlugins,
    qingkuaiLanguageServiceAdapter
} from "../util/loadpkg"
import { isQingkuaiFile } from "../util/assert"
import { fsImplementation, pathImplementation } from "./mock"
import { interCompileCache, fsMap, setState, handlerResolver, scriptVersion } from "./state"
import { Handlers, qingkuaiRuntimeDtsPath, typeDeclarationFilePath } from "../util/constants"
import { createDefaultMapFromCDN, createSystem, createVirtualLanguageServiceHost } from "@typescript/vfs"

const { TypescriptAdapter, QingkuaiFileInfo } = qingkuaiLanguageServiceAdapter

export async function loadTypescriptAndQingkuaiCompiler(tsVersion: string, qingkuaiVersion: string) {
    // 标记 typesript language service, qingkuai compiler 未加载完成
    setState({
        isReload: true
    })

    const [ts, qingkuaiCompiler] = await Promise.all([loadTypeScript(tsVersion), loadQingkuaiCompiler(qingkuaiVersion)])
    const userPreference: TS.UserPreferences = {
        allowIncompleteCompletions: true,
        allowRenameOfImportPath: true,
        allowTextChangesInNewFiles: true,
        autoImportSpecifierExcludeRegexes: [],
        disableLineTextInReferences: true,
        displayPartsForJSDoc: true,
        excludeLibrarySymbolsInNavTo: true,
        generateReturnInDocTemplate: true,
        importModuleSpecifierEnding: "js",
        includeAutomaticOptionalChainCompletions: true,
        includeCompletionsForImportStatements: true,
        includeCompletionsForModuleExports: true,
        includeCompletionsWithClassMemberSnippets: true,
        includeCompletionsWithObjectLiteralMethodSnippets: true,
        includeCompletionsWithSnippetText: true,
        includeInlayEnumMemberValueHints: false,
        includeInlayFunctionLikeReturnTypeHints: false,
        includeInlayFunctionParameterTypeHints: false,
        includeInlayParameterNameHints: "none",
        includeInlayParameterNameHintsWhenArgumentMatchesName: false,
        includeInlayPropertyDeclarationTypeHints: false,
        includeInlayVariableTypeHints: false,
        includeInlayVariableTypeHintsWhenTypeMatchesName: false,
        includePackageJsonAutoImports: "auto",
        interactiveInlayHints: true,
        jsxAttributeCompletionStyle: "auto",
        preferTypeOnlyAutoImports: false,
        providePrefixAndSuffixTextForRename: true,
        provideRefactorNotApplicableReason: true,
        includeCompletionsWithInsertText: true,
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
    const qingkuaiConfig: TsPluginQingkuaiConfig = {
        hoverTipReactiveStatus: true,
        resolveImportExtension: true
    }
    const formattingOptions: TS.FormatCodeSettings = {
        convertTabsToSpaces: true,
        indentSize: 4,
        indentStyle: 2,
        indentSwitchCase: true,
        insertSpaceAfterCommaDelimiter: true,
        insertSpaceAfterConstructor: false,
        insertSpaceAfterFunctionKeywordForAnonymousFunctions: true,
        insertSpaceAfterKeywordsInControlFlowStatements: true,
        insertSpaceAfterOpeningAndBeforeClosingEmptyBraces: true,
        insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces: false,
        insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
        insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: false,
        insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: false,
        insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces: false,
        insertSpaceAfterSemicolonInForStatements: true,
        insertSpaceAfterTypeAssertion: false,
        insertSpaceBeforeAndAfterBinaryOperators: true,
        insertSpaceBeforeFunctionParenthesis: false,
        newLineCharacter: "\n",
        placeOpenBraceOnNewLineForControlBlocks: false,
        placeOpenBraceOnNewLineForFunctions: false,
        semicolons: ts.SemicolonPreference.Remove,
        tabSize: 4,
        trimTrailingWhitespace: true
    }

    const ensureGetSourceFile = (fileName: string) => {
        const existing = tsLanguageService.getProgram()!.getSourceFile(fileName)
        if (existing) {
            return existing
        }
        const sourceFile = ts.createSourceFile(fileName, fsMap.get(fileName)!, ts.ScriptTarget.ESNext)
        updateFile(sourceFile)
        return sourceFile
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

    const libFileNames = Array.from(fsMap.keys())
    const system = createSystem(fsMap)
    const {
        deleteFile,
        updateFile,
        languageServiceHost: tsLanguageServiceHost
    } = createVirtualLanguageServiceHost(system, libFileNames, compilerOptions, ts)
    const tsLanguageService = ts.createLanguageService(tsLanguageServiceHost)

    const tsProject: AdapterTsProject = Object.assign(tsLanguageServiceHost, {
        getLanguageService: () => tsLanguageService
    })

    const tsProjectService: AdapterTsProjectService = {
        getDefaultProjectForFile() {
            return tsProject
        },
        openFiles: new Map(),
        toPath: fileName => fileName as TS.Path,
        serverMode: ts.LanguageServiceMode.Semantic
    }

    const adapter = new TypescriptAdapter(
        ts,
        fsImplementation,
        pathImplementation,
        typeDeclarationFilePath,
        tsProjectService,
        () => qingkuaiConfig,
        (fileInfo, newContent) => {
            const sourceFile = ensureGetSourceFile(fileInfo.path)
            sourceFile.text = newContent
            fileInfo.code = newContent
            fileInfo.version++
            updateFile(sourceFile)
        },
        () => userPreference,
        () => formattingOptions
    )

    const updateSourceFile = (fileName: string) => {
        const cr = interCompileCache.get(fileName)!
        const sourceFile = ensureGetSourceFile(fileName)
        const version = scriptVersion.get(fileName) ?? 0

        if (isQingkuaiFile(fileName)) {
            const exportValueSourceRange: NumNum | undefined = cr.scriptDescriptor
                ? [cr.scriptDescriptor.startTagOpenRange[0] + 1, cr.scriptDescriptor.startTagOpenRange[1]]
                : undefined
            const fileInfo = new QingkuaiFileInfo(
                cr.code,
                cr.scriptDescriptor.isTS,
                version + 1,
                adapter.getNormalizedPath(fileName),
                cr.getTypeDelayInterIndexes,
                cr.identifierStatusInfo,
                exportValueSourceRange,
                adapter,
                cr.indexMap.itos,
                cr.indexMap.stoi,
                cr.positions
            )
            adapter.qingkuaiFileInfos.set(fileInfo.path, fileInfo)
            fileInfo.confirmTypes()
            fsMap.set(fileName, (sourceFile.text = fileInfo.code))
        } else {
            fsMap.set(fileName, (sourceFile.text = cr.code))
        }
        scriptVersion.set(fileName, version + 1)
        updateFile(sourceFile)
    }

    setState({
        ts,
        system,
        adapter,
        qingkuaiCompiler,
        tsLanguageService,
        tsLanguageServiceHost,
        updateFile: updateSourceFile,
        prettierAndPlugins: await loadPrettierAndPlugins(),
        deleteFile: fileName => deleteFile(ensureGetSourceFile(fileName))
    })

    tsLanguageServiceHost.getScriptKind = fileName => {
        switch (adapter.path.ext(fileName)) {
            case "js": {
                return ts.ScriptKind.JS
            }
            case "ts": {
                return ts.ScriptKind.TS
            }
            default: {
                return ts.ScriptKind.Unknown
            }
        }
    }

    // 代理typescript语言服务
    tsLanguageServiceHost.resolveModuleNameLiterals = (moduleLiterals, containingFile) => {
        return moduleLiterals.map(literal => {
            return ts.resolveModuleName(literal.text, containingFile, compilerOptions, system)
        })
    }

    // 代理 typescript languageServiceHost
    adapter.proxyProject(tsProject)

    // 完成加载
    handlerResolver()
}
