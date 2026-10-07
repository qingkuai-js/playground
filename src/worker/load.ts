import TS from "typescript"

import type { CompileIntermediateResult } from "qingkuai/compiler"
import type {
    AdapterTsProject,
    AdapterTsProjectService,
    TsPluginQingkuaiConfig
} from "qingkuai-language-service"

import {
    loadTypeScript,
    USE_LOCAL_PACKAGES,
    loadQingkuaiCompiler,
    localQingkuaiCompiler,
    loadPrettierAndPlugins,
    qingkuaiLanguageServiceAdapter
} from "../util/loadpkg"
import { isQingkuaiFile } from "../util/assert"
import { FS_IMPLEMENTATION, PATH_IMPLEMENTATION } from "./mock"
import { fsMap, logger, setState, interCompileCache, handlerResolver, scriptVersion } from "./state"
import {
    createDefaultMapFromCDN,
    createSystem,
    createVirtualLanguageServiceHost
} from "@typescript/vfs"
import {
    Handlers,
    QINGKUAI_LS_DTS_PATH,
    QINGKUAI_BRAND_DTS_PATH,
    QINGKUAI_RUNTIME_DTS_PATH
} from "../util/constants"

const { TypescriptAdapter, QingkuaiFileInfo } = qingkuaiLanguageServiceAdapter

export async function loadTypescriptAndQingkuaiCompiler(
    tsVersion: string,
    qingkuaiVersion: string
) {
    // 标记 typesript language service, qingkuai compiler 未加载完成
    setState({
        isReload: true
    })

    const [ts, qingkuaiCompiler] = await Promise.all([
        loadTypeScript(tsVersion),
        loadQingkuaiCompiler(qingkuaiVersion)
    ])
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
        baseUrl: "/",
        lib: ["esnext", "dom"],
        allowNonTsExtensions: true,
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.ESNext,
        paths: {
            qingkuai: [QINGKUAI_RUNTIME_DTS_PATH],
            "qingkuai/language-service": [QINGKUAI_LS_DTS_PATH]
        },
        allowImportingTsExtensions: true,
        moduleResolution: ts.ModuleResolutionKind.Bundler
    }
    const qingkuaiConfig: TsPluginQingkuaiConfig = {
        allowConstReactive: true,
        requireReactivityMark: false,
        interpretiveComments: true,
        resolveImportExtension: true,
        reactivityMode: "reactive",
        whitespace: "trim-collapse",
        preserveHtmlComments: "always",
        hoverTipReactiveStatus: true
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

    const ensureGetSourceFile = (fileName: string, update = false) => {
        const existing = tsLanguageService.getProgram()!.getSourceFile(fileName)
        if (existing && !update) {
            return existing
        }
        const sourceFile = ts.createSourceFile(
            fileName,
            fsMap.get(fileName)!,
            ts.ScriptTarget.ESNext
        )
        updateFile(sourceFile)
        return sourceFile
    }

    // 本地包形态动态引入 local-libs，其余形态为 null，构建期随 USE_LOCAL_PACKAGES 的常量折叠整体剔除
    const localLibs = USE_LOCAL_PACKAGES ? await import("./local-libs") : null

    // 加载 qingkuai 的类型定义文件，虚拟目录结构与真实包内布局保持一致
    const dtsFiles = localLibs
        ? await localLibs.fetchLocalQingkuaiDtsFiles()
        : await fetchQingkuaiDtsFiles(qingkuaiVersion)
    for (const { content, fileName } of dtsFiles) {
        registerFile(fileName, content)
    }

    const defaultLibMap = localLibs
        ? await localLibs.createLocalDefaultLibMap(compilerOptions, ts)
        : await createDefaultMapFromCDN(compilerOptions, ts.version, false, ts)
    defaultLibMap.forEach((content, fileName) => {
        if (!content.startsWith("Couldn't find")) {
            registerFile(`/node_modules/typescript/lib${fileName}`, content)
        }
    })

    // 代理 typescript 的 sys，使用虚拟文件系统
    const tsWithSys = new Proxy(ts, {
        get(target, key, receiver) {
            if (key === "sys") {
                return system
            }
            return Reflect.get(target, key, receiver)
        }
    }) as typeof TS

    const system = createSystem(fsMap)
    const libFileNames = Array.from(fsMap.keys())
    const {
        deleteFile,
        updateFile,
        languageServiceHost: tsLanguageServiceHost
    } = createVirtualLanguageServiceHost(system, libFileNames, compilerOptions, tsWithSys)
    const tsLanguageService = tsWithSys.createLanguageService(tsLanguageServiceHost)

    const tsProject: AdapterTsProject = Object.assign(tsLanguageServiceHost, {
        getLanguageService: () => tsLanguageService
    })

    const tsProjectService: AdapterTsProjectService = {
        getDefaultProjectForFile() {
            return tsProject
        },
        openFiles: new Map(),
        toPath: (fileName) => fileName as TS.Path,
        serverMode: tsWithSys.LanguageServiceMode.Semantic
    }

    const adapter = new TypescriptAdapter(
        tsWithSys,
        logger,
        FS_IMPLEMENTATION,
        PATH_IMPLEMENTATION,
        (path) => interCompileCache.get(path)!,
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
        const sourceFile = ensureGetSourceFile(fileName, true)
        const version = scriptVersion.get(fileName) ?? 0

        if (isQingkuaiFile(fileName)) {
            const fileInfo = new QingkuaiFileInfo(
                cr.code,
                cr.scriptDescriptor.isTS,
                version + 1,
                filePathToComponentName(fileName),
                adapter.getNormalizedPath(fileName),
                cr.getTypeDelayInterIndexes,
                getIdentifierDescriptionsMap(cr),
                tsWithSys,
                cr.indexMap.itos,
                cr.indexMap.stoi,
                cr.positions,
                () => sourceFile
            )
            adapter.qingkuaiFileInfos.set(fileInfo.path, fileInfo)
            adapter.service.confirmTypes(fileInfo)
            cr.indexMap.itos = fileInfo.currentItos
            cr.indexMap.stoi = fileInfo.currentStoi
            fsMap.set(fileName, (sourceFile.text = fileInfo.code))
        } else {
            fsMap.set(fileName, (sourceFile.text = cr.code))
        }
        scriptVersion.set(fileName, version + 1)
        updateFile(sourceFile)
    }

    setState({
        ts: tsWithSys,
        system,
        adapter,
        qingkuaiCompiler,
        tsLanguageService,
        tsLanguageServiceHost,
        updateFile: updateSourceFile,
        prettierAndPlugins: await loadPrettierAndPlugins(),
        deleteFile: (fileName) => deleteFile(ensureGetSourceFile(fileName))
    })

    tsLanguageServiceHost.getScriptKind = (fileName) => {
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
        return moduleLiterals.map((literal) => {
            return ts.resolveModuleName(literal.text, containingFile, compilerOptions, system)
        })
    }

    // 代理 typescript languageServiceHost
    adapter.proxyProject(tsProject)

    // 完成加载
    handlerResolver()
}

// 文件登记进虚拟文件系统并同步给主线程
function registerFile(fileName: string, content: string) {
    self.postMessage({
        name: Handlers.FileLoaded,
        fileName,
        content
    })
    fsMap.set(fileName, content)
}

async function fetchQingkuaiDtsFiles(version: string) {
    const files = [
        {
            path: QINGKUAI_RUNTIME_DTS_PATH,
            url: `https://unpkg.com/qingkuai@${version}/dist/types/runtime/index.d.ts`
        },
        {
            path: QINGKUAI_BRAND_DTS_PATH,
            url: `https://unpkg.com/qingkuai@${version}/dist/types/language-service/brand.d.ts`
        },
        {
            path: QINGKUAI_LS_DTS_PATH,
            url: `https://unpkg.com/qingkuai@${version}/dist/types/language-service/qingkuai.d.ts`
        }
    ]
    const ret: { fileName: string; content: string }[] = []
    for (const { url, path } of files) {
        ret.push({ fileName: path, content: await (await fetch(url)).text() })
    }
    return ret
}

// 与 language-service 内部逻辑保持一致：由文件路径推导组件名
function filePathToComponentName(fileName: string) {
    const ext = PATH_IMPLEMENTATION.ext(fileName)
    const base = PATH_IMPLEMENTATION.base(fileName)
        .slice(0, -ext.length)
        .replace(/[^a-zA-Z\d]/g, "")
    return base ? localQingkuaiCompiler.util.kebab2Camel(base, true) : "Anonymous"
}

// 顶层标识符名称到其描述文本的映射（language-service 旧版本未导出同名工具，此处内联等价实现）
function getIdentifierDescriptionsMap(cr: CompileIntermediateResult) {
    const idDescriptions: Record<string, string> = {}
    for (const key in cr.identifierStatusInfo) {
        idDescriptions[key] = cr.identifierStatusInfo[key].description
    }
    return idDescriptions
}
