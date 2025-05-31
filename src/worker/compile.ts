import type { Model } from "../types/communication"
import type { Position } from "vscode-languageserver-types"
import type { RuntimeCompileResult } from "../types/common"
import type { CompileResult } from "qingkuai-language-service"
import type { ASTLocation, ASTPositionWithFlag, CompileResult as OriginalCompileResult } from "qingkuai/compiler"

import {
    ts,
    fsMap,
    setState,
    updateFile,
    projectKind,
    compileCache,
    typeRefStatement,
    qingkuaiCompiler,
    prettierAndPlugins
} from "./state"
import { pathImplementation } from "./mock"
import { isQingkuaiFile } from "../util/assert"
import { fileUriToPath, getLineStarts } from "../util/sundary"
import { qingkuaiLanguageService, csstree } from "../util/loadpkg"

const config: CompileResult["config"] = {
    workspacePath: "/",
    extensionConfig: {
        typescriptDiagnosticsExplain: true,
        insertSpaceAroundInterpolation: false,
        componentTagFormatPreference: "camel",
        additionalCodeLens: ["component", "slot"],
        componentAttributeFormatPreference: "camel",
        htmlHoverTip: ["tag", "entity", "attribute"]
    },
    prettierConfig: {
        tabWidth: 4,
        semi: false,
        arrowParens: "avoid",
        trailingComma: "all",
        singleAttributePerLine: true,
        qingkuai: {
            spaceAroundInterpolation: false,
            componentTagFormatPreference: "camel",
            componentAttributeFormatPreference: "camel"
        }
    }
}
const runtimeCompileResultCache: Record<string, RuntimeCompileResult> = {}

export function getInterCompileResultByPath(path: string) {
    return compileCache.get(path)!
}

export async function compileToRuntime({ uri, source }: Model, debug: boolean, comment: boolean) {
    const filePath = uri.replace(/^file:\/\//, "")
    const cached = runtimeCompileResultCache[filePath]
    const [prettier, ...plugins] = prettierAndPlugins
    const targetIsQingkuaiFile = isQingkuaiFile(filePath)
    if (
        cached &&
        cached.source === source &&
        (!targetIsQingkuaiFile || (cached.debug === debug && cached.comment === comment))
    ) {
        return cached
    }
    try {
        const baseResult = { debug, source, comment }
        if (targetIsQingkuaiFile) {
            const cr = qingkuaiCompiler.compile(source, {
                debug,
                comment,
                sourcemap: false,
                hashId: cached?.hashId,
                reserveTemplateComment: true,
                convenientDerivedDeclaration: true,
                componentName: qingkuaiLanguageService.util.filePathToComponentName(pathImplementation, filePath)
            })
            const scopedStyleCodes = cr.inputDescriptor.styles.map(item => {
                return addScopeToSelectors(item.code, cr.hashId)
            })
            runtimeCompileResultCache[filePath] = {
                ...baseResult,
                hashId: cr.hashId,
                semiScript: cr.code,
                script: ts.transpile(cr.code, {
                    target: ts.ScriptTarget.ESNext
                }),
                style: await prettier.format(scopedStyleCodes.join("\n"), {
                    plugins,
                    parser: "css",
                    ...config.prettierConfig
                })
            }
        } else {
            runtimeCompileResultCache[filePath] = {
                ...baseResult,
                style: "",
                hashId: "",
                semiScript: "",
                script: ts.transpile(source, {
                    target: ts.ScriptTarget.ESNext
                })
            }
        }
        return runtimeCompileResultCache[filePath]
    } catch (err: any) {
        return err.message ?? ""
    }
}

export function compileToInterCode({ uri, version, source }: Model) {
    const filePath = fileUriToPath(uri)
    const cached = compileCache.get(filePath)
    if (cached?.version === version) {
        return cached
    }

    let cr: OriginalCompileResult
    if (isQingkuaiFile(uri)) {
        cr = qingkuaiCompiler.compile(source, { check: true, typeRefStatement })
    } else {
        cr = mockCompileNonQingkuaiFile({ uri, version, source })
    }

    const lineStarts = getLineStarts(source)
    const isTS = cr.inputDescriptor.script.isTS
    const positions = cr.inputDescriptor.positions
    const getPosition = qingkuaiLanguageService.util.getPositionGen(positions)
    if (isTS && projectKind !== qingkuaiLanguageService.ProjectKind.TS) {
        setState({
            projectKind: qingkuaiLanguageService.ProjectKind.TS
        })
    }

    const getOffset = (position: Position) => {
        return lineStarts[position.line] + position.character
    }

    const ret: CompileResult = {
        ...cr,
        uri,
        config,
        version,
        filePath,
        getOffset,
        getPosition,
        code: cr.code,
        isSynchronized: true,
        scriptLanguageId: isTS ? "typescript" : "javascript",
        getRange: qingkuaiLanguageService.util.getRangeGen(getPosition),
        isPositionFlagSet: qingkuaiLanguageService.util.isPositionFlagSetGen(positions),
        getInterIndex: qingkuaiLanguageService.util.getInterIndexGen(cr.interIndexMap.stoi),
        getSourceIndex: qingkuaiLanguageService.util.getSourceIndexGen(cr.interIndexMap.itos),
        builtInTypeDeclarationEndIndex: cr.typeDeclarationLen + typeRefStatement.length
    }
    return compileCache.set(filePath, ret), fsMap.set(filePath, cr.code), updateFile(filePath), ret
}

function mockCompileNonQingkuaiFile({ source, uri }: Model): OriginalCompileResult {
    const positions: ASTPositionWithFlag[] = []
    const extension = pathImplementation.ext(uri).slice(1)
    const isCss = extension === "css"
    const interIndexMap = Array.from({ length: source.length }, (_, i) => i)
    for (let i = 0, line = 1, column = 0; i <= source.length; i++) {
        positions.push({
            line,
            column,
            index: i,
            flag: qingkuaiCompiler.PositionFlag[isCss ? "inStyle" : "inScript"]
        })
        source[i] === "\n" ? (line++, (column = 0)) : column++
    }

    const sourceLoc: ASTLocation = {
        start: positions[0],
        end: positions[positions.length - 1]
    }
    return {
        code: isCss ? "" : source,
        hashId: "",
        mappings: "",
        interIndexMap: {
            itos: interIndexMap,
            stoi: interIndexMap
        },
        messages: [],
        typeDeclarationLen: 0,
        templateNodes: [],
        inputDescriptor: {
            source,
            positions,
            options: {
                componentName: "",
                hashId: "",
                check: false,
                debug: false,
                comment: false,
                sourcemap: false,
                typeRefStatement: "",
                reserveTemplateComment: false,
                convenientDerivedDeclaration: false
            },
            slotInfo: {},
            indentSpaceCount: 0,
            script: {
                isTS: extension === "ts",
                code: source,
                existing: true,
                generatedOffset: [0, 0],
                lineCount: 0,
                loc: sourceLoc,
                startTagNameRange: [0, 0]
            },
            styles: isCss
                ? [
                      {
                          code: source,
                          lang: "css",
                          loc: sourceLoc,
                          startTagNameRange: [0, 0]
                      }
                  ]
                : [],
            stringConstantCount: 0,
            refAttrValueStartIndexes: []
        }
    }
}
function addScopeToSelectors(css: string, hash: string): string {
    const ast = csstree.parse(css)
    const hashAttribute: csstree.AttributeSelector = {
        flags: null,
        value: null,
        matcher: null,
        name: {
            name: `qk-${hash}`,
            type: "Identifier"
        },
        type: "AttributeSelector"
    }
    const isScopeAttribute = (node: csstree.CssNode) => {
        return node.type === "AttributeSelector" && node.name.name === "qk-scope"
    }
    csstree.walk(ast, {
        visit: "Rule",
        enter(node) {
            if (node.prelude.type !== "SelectorList" || this.atrule?.name === "keyframes") {
                return
            }
            for (const selector of node.prelude.children.toArray()) {
                if (selector.type !== "Selector") {
                    continue
                }

                let hasBeenScoped = false
                const hasScopeAttribute = !!selector.children.toArray().find(isScopeAttribute)
                selector.children.forEachRight((node, item) => {
                    if (isScopeAttribute(node)) {
                        selector.children.replace(item, selector.children.createItem(hashAttribute))
                    }
                    if (hasBeenScoped || hasScopeAttribute) {
                        return
                    }
                    if (
                        node.type === "IdSelector" ||
                        node.type === "TypeSelector" ||
                        node.type === "ClassSelector" ||
                        node.type === "AttributeSelector"
                    ) {
                        selector.children.insert(selector.children.createItem(hashAttribute), item.next as any)
                        return (hasBeenScoped = true)
                    }
                })
            }
        }
    })
    return csstree.generate(ast)
}
