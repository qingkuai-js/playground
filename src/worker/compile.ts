import type { Model } from "../types/communication"
import type { RuntimeCompileResult } from "../types/common"
import type { CompileResult } from "qingkuai-language-service"
import type { ASTLocation, ASTPositionWithFlag, CompileIntermediateResult } from "qingkuai/compiler"

import {
    ts,
    fsMap,
    adapter,
    setState,
    updateFile,
    projectKind,
    qingkuaiCompiler,
    interCompileCache,
    prettierAndPlugins
} from "./state"
import { pathImplementation } from "./mock"
import { isQingkuaiFile } from "../util/assert"
import { fileUriToPath } from "../util/sundary"
import { TextDocument } from "vscode-languageserver-textdocument"
import { qingkuaiLanguageService, csstree } from "../util/loadpkg"

const runtimeCompileResultCache: Record<string, RuntimeCompileResult> = {}

export function getInterCompileResultByPath(path: string) {
    return interCompileCache.get(path)!
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
        const baseResult = {
            debug,
            source,
            comment
        }
        if (targetIsQingkuaiFile) {
            const cr = qingkuaiCompiler.compile(source, {
                debug,
                sourcemap: false,
                hashId: cached?.hashId,
                interpretiveComments: comment,
                shorthandDerivedDeclaration: true
            })
            const scopedStyleCodes = cr.styleDescriptors.map(item => {
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
                    ...getConfig(filePath).prettierConfig
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
    const cached = interCompileCache.get(filePath)
    const document = TextDocument.create(uri, "", version, source)
    if (cached?.version === version) {
        return cached
    }

    let cr: CompileIntermediateResult
    if (isQingkuaiFile(uri)) {
        cr = qingkuaiCompiler.compileIntermediate(source, {
            shorthandDerivedDeclaration: true
        })
    } else {
        cr = mockCompileNonQingkuaiFile({ uri, version, source })
    }

    const isTS = cr.scriptDescriptor.isTS
    const scriptLanguageId = isTS ? "typescript" : "javascript"
    if (isTS && projectKind !== qingkuaiLanguageService.ProjectKind.TS) {
        setState({
            projectKind: qingkuaiLanguageService.ProjectKind.TS
        })
    }

    const ret = Object.assign(cr, {
        uri,
        version,
        filePath,
        document,
        scriptLanguageId,
        isSynchronized: true,
        config: getConfig(filePath),
        getVscodeRange(startOrLoc: number | ASTLocation, end?: number) {
            if (typeof startOrLoc === "number") {
                return {
                    start: document.positionAt(startOrLoc),
                    end: document.positionAt(end ?? startOrLoc)
                }
            }
            return {
                start: document.positionAt(startOrLoc.start.index),
                end: document.positionAt(startOrLoc.end.index)
            }
        }
    }) as CompileResult
    return interCompileCache.set(filePath, ret), fsMap.set(filePath, cr.code), updateFile(filePath), ret
}

function getConfig(filePath: string) {
    return {
        dirPath: "/",
        qingkuaiConfig: {
            whitespace: "trim-collapse",
            preserveHtmlComments: "all",
            reactivityMode: "reactive",
            interpretiveComments: true,
            resolveImportExtension: true,
            shorthandDerivedDeclaration: true
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
        },
        extensionConfig: {
            hoverTipReactiveStatus: true,
            typescriptDiagnosticsExplain: true,
            insertSpaceAroundInterpolation: false,
            componentTagFormatPreference: "camel",
            additionalCodeLens: ["component", "slot"],
            componentAttributeFormatPreference: "camel",
            htmlHoverTip: ["attribute", "entity", "tag"]
        },
        typescriptConfig: {
            preference: adapter.getUserPreferences(filePath),
            formatCodeSettings: adapter.getFormattingOptions(filePath)
        }
    } satisfies CompileResult["config"]
}

function mockCompileNonQingkuaiFile({ source, uri }: Model): CompileIntermediateResult {
    const positions: ASTPositionWithFlag[] = []
    const extension = pathImplementation.ext(uri).slice(1)
    const isCss = extension === "css"
    const interIndexMap = Array.from({ length: source.length }, (_, i) => i)
    for (let i = 0, line = 1, column = 0; i <= source.length; i++) {
        positions.push({
            line,
            column,
            index: i,
            flag: qingkuaiCompiler.PositionFlag[isCss ? "InStyle" : "InScript"]
        })
        source[i] === "\n" ? (line++, (column = 0)) : column++
    }

    const sourceLoc: ASTLocation = {
        start: positions[0],
        end: positions[positions.length - 1]
    }
    return {
        indexMap: {
            itos: interIndexMap,
            stoi: interIndexMap
        },
        scriptDescriptor: {
            existing: !isCss,
            code: isCss ? "" : source,
            startTagOpenRange: [0, 0],
            isTS: uri.endsWith(".ts"),
            lineCount: sourceLoc.end.line,
            loc: {
                start: positions[0],
                end: positions[positions.length - 1]
            }
        },
        styleDescriptors: isCss
            ? [
                  {
                      code: source,
                      loc: sourceLoc,
                      lang: "css",
                      startTagOpenRange: [0, 0]
                  }
              ]
            : [],
        positions,
        messages: [],
        slotNames: [],
        templateNodes: [],
        identifierStatusInfo: {},
        code: isCss ? "" : source,
        getTypeDelayInterIndexes: [],

        // @ts-ignore
        constructor: (() => 0) as any,
        getInterIndex: i => i,
        getSourceIndex: i => i,
        getSlotTemplateNode: () => 0 as any,
        getTemplateNodeContext: () => 0 as any,
        isPositionFlagSetAtIndex: (flag, index) => !!(flag & positions[index].flag)
    } satisfies CompileIntermediateResult
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
        enter(node: csstree.Rule) {
            if (node.prelude.type !== "SelectorList" || (this as csstree.WalkContext).atrule?.name === "keyframes") {
                return
            }
            for (const selector of node.prelude.children.toArray()) {
                if (selector.type !== "Selector") {
                    continue
                }

                let hasBeenScoped = false
                const hasScopeAttribute = !!selector.children.toArray().find(isScopeAttribute)
                selector.children.forEachRight((node: csstree.CssNode, item: csstree.ListItem<csstree.CssNode>) => {
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
