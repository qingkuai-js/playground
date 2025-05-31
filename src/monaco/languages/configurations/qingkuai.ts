import * as monaco from "monaco-editor-core"

const config: monaco.languages.LanguageConfiguration = {
    comments: {
        blockComment: ["<!--", "-->"]
    },
    brackets: [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"]
    ],
    autoClosingPairs: [
        {
            open: "{",
            close: "}"
        },
        {
            open: "[",
            close: "]"
        },
        {
            open: "(",
            close: ")"
        },
        {
            open: '"',
            close: '"',
            notIn: ["string"]
        },
        {
            open: "/**",
            close: " */",
            notIn: ["string"]
        },
        {
            open: "'",
            close: "'",
            notIn: ["string", "comment"]
        },
        {
            open: "`",
            close: "`",
            notIn: ["string", "comment"]
        }
    ],
    surroundingPairs: [
        {
            open: "{",
            close: "}"
        },
        {
            open: "[",
            close: "]"
        },
        {
            open: "(",
            close: ")"
        },
        {
            open: "'",
            close: "'"
        },
        {
            open: '"',
            close: '"'
        },
        {
            open: "`",
            close: "`"
        }
    ],
    autoCloseBefore: ";:.,=}])><`\n\t",
    folding: {
        markers: {
            start: new RegExp("^\\s*<!--\\s*#region\\b.*-->"),
            end: new RegExp("^\\s*<!--\\s*#endregion\\b.*-->")
        }
    },
    wordPattern: new RegExp(
        "(-?\\d*\\.\\d\\w*)|([^\\`\\~\\@\\$\\^\\*\\(\\)\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>\\/\\s]+)"
    ),
    onEnterRules: [
        {
            beforeText: new RegExp(
                "<(?!(?:br|img|input|meta|link|hr|base|area|col|keygen|menuitem|embed|param|source|track|wbr))([_:\\w][_:\\w-.\\d]*)(?:(?:[^'\"/>]|\"[^\"]*\"|'[^']*')*?(?!\\/)>)[^<]*$",
                "i"
            ),
            afterText: new RegExp("^<\\/([_:\\w][_:\\w-.\\d]*)\\s*>", "i"),
            action: {
                indentAction: monaco.languages.IndentAction.IndentOutdent
            }
        },
        {
            beforeText: new RegExp(
                "<(?!(?:br|img|input|meta|link|hr|base|area|col|keygen|menuitem|embed|param|source|track|wbr))([_:\\w][_:\\w-.\\d]*)(?:(?:[^'\"/>]|\"[^\"]*\"|'[^']*')*?(?!\\/)>)[^<]*$",
                "i"
            ),
            action: {
                indentAction: monaco.languages.IndentAction.Indent
            }
        }
    ],
    indentationRules: {
        increaseIndentPattern: new RegExp(
            "<(?!\\?|(?:area|base|br|col|frame|hr|html|img|input|keygen|link|menuitem|meta|param|source|track|wbr)\\b|[^>]*\\/>)([-_\\.A-Za-z0-9]+)(?=\\s|>)\\b[^>]*>(?!.*<\\/\\1>)|<!--(?!.*-->)|\\{[^}\"']*$"
        ),
        decreaseIndentPattern: new RegExp("^\\s*(<\\/(?!html)[-_\\.A-Za-z0-9]+\\b[^>]*>|-->|\\})")
    }
}

export default config
