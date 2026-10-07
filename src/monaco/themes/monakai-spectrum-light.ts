import type { QingkuaiTheme } from "../../util/theme"

import * as monaco from "monaco-editor-core"

import { getInitialTheme, THEME_STORAGE_KEY } from "../../util/theme"

const LIGHT_SYNTAX = {
    fg: "#2b2637",
    kw: "#c9105f",
    str: "#8a7a10",
    num: "#5a48d1",
    fn: "#1f7a32",
    tag: "#c9105f",
    attr: "#177482",
    param: "#c25a0a",
    dir: "#c9105f",
    punc: "#767281",
    com: "#8a8492"
}

export function applyQingkuaiTheme(theme: QingkuaiTheme) {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
    document.documentElement.dataset.theme = theme
    monaco.editor.setTheme(
        theme === "light" ? "monokai-pro-spectrum-light" : "monokai-pro-spectrum"
    )
}

export function monacoThemeName(theme: QingkuaiTheme) {
    return theme === "light" ? "monokai-pro-spectrum-light" : "monokai-pro-spectrum"
}

function buildRules(c: typeof LIGHT_SYNTAX): monaco.editor.ITokenThemeRule[] {
    const rule = (
        token: string,
        color: keyof typeof c,
        italic = false
    ): monaco.editor.ITokenThemeRule =>
        italic
            ? { token, foreground: c[color], fontStyle: "italic" }
            : { token, foreground: c[color] }
    return [
        rule("comment", "com", true),
        rule("punctuation.definition.comment", "com"),
        rule("string", "str"),
        rule("string.quoted.docstring", "com"),
        rule("constant", "num"),
        rule("constant.numeric", "num"),
        rule("constant.language", "num"),
        rule("constant.character.escape", "num"),
        rule("keyword", "kw"),
        rule("keyword.control", "kw"),
        rule("keyword.control.directive", "dir"),
        rule("keyword.operator", "kw"),
        rule("storage", "kw"),
        rule("storage.type", "kw"),
        rule("storage.modifier", "kw"),
        rule("entity.name.function", "fn"),
        rule("entity.name.function.member", "fn"),
        rule("support.function", "fn"),
        rule("support.function.component", "fn"),
        rule("variable.function", "fn"),
        rule("entity.name.type", "fn"),
        rule("entity.name.type.class", "fn"),
        rule("entity.name.class", "fn"),
        rule("support.type", "fn"),
        rule("support.class", "fn"),
        rule("entity.name.tag", "tag"),
        rule("punctuation.definition.tag", "punc"),
        rule("entity.other.attribute-name.directive", "dir"),
        rule("entity.other.attribute-name.directive.qk", "dir"),
        rule("punctuation.mark-directive", "dir"),
        rule("entity.other.attribute-name", "attr", true),
        rule("entity.other.attribute-name.event", "attr", true),
        rule("entity.other.attribute-name.dynamic", "attr", true),
        rule("punctuation.definition.string", "punc"),
        rule("punctuation.definition.type-parameters", "punc"),
        rule("punctuation.section.embedded", "punc"),
        rule("punctuation", "punc"),
        rule("variable", "fg"),
        rule("variable.other", "fg"),
        rule("variable.other.readwrite", "fg"),
        rule("variable.other.property", "fg"),
        rule("variable.parameter", "param", true),
        rule("variable.language", "fg"),
        rule("support.variable", "fg"),
        rule("meta.template.expression", "fg"),
        rule("meta.object.member", "fg"),
        rule("markup.underline.link", "attr"),
        rule("entity.name.section", "str"),
        rule("source", "fg"),
        // 无 textmate 接线时 monaco 内建分词的兜底
        rule("identifier", "fg"),
        rule("type.identifier", "fn"),
        rule("delimiter", "punc"),
        rule("delimiter.html", "punc"),
        rule("tag", "tag"),
        rule("attribute.name", "attr"),
        rule("attribute.value", "str"),
        rule("attribute.value.html", "str"),
        rule("metatag", "kw"),
        rule("annotation", "fn"),
        rule("string.key.json", "attr"),
        rule("string.value.json", "str"),
        rule("string.key", "attr"),
        rule("string.value", "str"),
        rule("string.html", "str"),
        rule("attribute.value", "str"),
        rule("keyword.flow", "kw"),
        rule("variable.predefined", "fg"),
        rule("number.hex", "num"),
        rule("type", "fn"),
        rule("key", "attr"),
        rule("number", "num"),
        rule("regexp", "str")
    ]
}

monaco.editor.defineTheme("monokai-pro-spectrum-light", {
    inherit: false,
    base: "vs",
    colors: {
        "editor.background": "#ffffff",
        "editor.foreground": "#2b2637",
        "editorLineNumber.foreground": "#8c959f",
        "editorLineNumber.activeForeground": "#656d76",
        "editorCursor.foreground": "#2b2637",
        "editor.selectionBackground": "#0969da26",
        "editor.inactiveSelectionBackground": "#0969da14",
        "editor.selectionHighlightBackground": "#0969da1a",
        "editor.lineHighlightBackground": "#eaeef2",
        "editor.lineHighlightBorder": "#00000000",
        "editor.findMatchBackground": "#0969da33",
        "editor.findMatchBorder": "#0969da",
        "editor.findMatchHighlightBackground": "#0969da1a",
        "editorBracketMatch.background": "#00000000",
        "editorBracketMatch.border": "#8c959f",
        "editorBracketHighlight.foreground1": "#c9105f",
        "editorBracketHighlight.foreground2": "#c25a0a",
        "editorBracketHighlight.foreground3": "#1f7a32",
        "editorBracketHighlight.foreground4": "#177482",
        "editorBracketHighlight.foreground5": "#5a48d1",
        "editorBracketHighlight.foreground6": "#8a7a10",
        "editorBracketHighlight.unexpectedBracket.foreground": "#c9105f",
        "editorWhitespace.foreground": "#eaeef2",
        "editorIndentGuide.background": "#eaeef2",
        "editorIndentGuide.background1": "#eaeef2",
        "editorIndentGuide.activeBackground1": "#d0d7de",
        "editorOverviewRuler.border": "#00000000",
        "editorWidget.background": "#ffffff",
        "editorWidget.border": "#d0d7de",
        "editorHoverWidget.background": "#ffffff",
        "editorHoverWidget.border": "#d0d7de",
        "editorSuggestWidget.background": "#ffffff",
        "editorSuggestWidget.border": "#d0d7de",
        "editorSuggestWidget.foreground": "#656d76",
        "editorSuggestWidget.selectedBackground": "#eaeef2",
        "editorSuggestWidget.selectedForeground": "#1f2328",
        "editorSuggestWidget.highlightForeground": "#0969da",
        "editorError.foreground": "#cf222e",
        "editorWarning.foreground": "#9a6700",
        "editorInfo.foreground": "#0969da",
        "editorCodeLens.foreground": "#8c959f",
        "editorInlayHint.background": "#f6f8fa",
        "editorInlayHint.foreground": "#8c959f",
        "editorGhostText.foreground": "#8c959f",
        "editorStickyScroll.background": "#ffffff",
        "editorStickyScroll.border": "#eaeef2",
        "scrollbarSlider.background": "#d0d7deaa",
        "scrollbarSlider.hoverBackground": "#afb8c1cc",
        "scrollbarSlider.activeBackground": "#8c959f",
        "input.background": "#f6f8fa",
        "input.foreground": "#1f2328",
        "input.border": "#d0d7de",
        focusBorder: "#0969da",
        "list.hoverBackground": "#f6f8fa",
        "list.focusBackground": "#eaeef2",
        "list.activeSelectionBackground": "#eaeef2",
        "list.activeSelectionForeground": "#1f2328",
        "list.highlightForeground": "#0969da",
        "list.inactiveSelectionBackground": "#f6f8fa",
        "peekView.border": "#d0d7de",
        "peekViewEditor.background": "#f6f8fa",
        "peekViewResult.background": "#f6f8fa",
        "peekViewTitle.background": "#f6f8fa",
        "widget.shadow": "#8c959f33"
    },
    rules: buildRules(LIGHT_SYNTAX)
})

// 首次导入即应用持久化的主题，避免闪色
document.documentElement.dataset.theme = getInitialTheme()
