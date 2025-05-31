import * as monaco from "monaco-editor-core"

const config: monaco.languages.LanguageConfiguration = {
    comments: {
        lineComment: "//",
        blockComment: ["/*", "*/"]
    },
    brackets: [
        ["${", "}"],
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
            open: "'",
            close: "'",
            notIn: ["string", "comment"]
        },
        {
            open: '"',
            close: '"',
            notIn: ["string"]
        },
        {
            open: "`",
            close: "`",
            notIn: ["string", "comment"]
        },
        {
            open: "/**",
            close: " */",
            notIn: ["string"]
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
        },
        {
            open: "<",
            close: ">"
        }
    ],
    colorizedBracketPairs: [
        ["(", ")"],
        ["[", "]"],
        ["{", "}"],
        ["<", ">"]
    ],
    autoCloseBefore: ";:.,=}])>` \n\t",
    folding: {
        markers: {
            start: new RegExp("^\\s*//\\s*#?region\\b"),
            end: new RegExp("^\\s*//\\s*#?endregion\\b")
        }
    },
    wordPattern: new RegExp(
        "(-?\\d*\\.\\d\\w*)|([^\\`\\@\\~\\!\\%\\^\\&\\*\\(\\)\\-\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>/\\?\\s]+)"
    ),
    indentationRules: {
        decreaseIndentPattern: new RegExp("^\\s*[\\}\\]\\)].*$"),
        increaseIndentPattern: new RegExp("^.*(\\{[^}]*|\\([^)]*|\\[[^\\]]*)$"),
        indentNextLinePattern: new RegExp("^((.*=>\\s*)|((.*[^\\w]+|\\s*)(if|while|for)\\s*\\(.*\\)\\s*))$"),
        unIndentedLinePattern: new RegExp(
            "^(\\t|[ ])*[ ]\\*[^/]*\\*/\\s*$|^(\\t|[ ])*[ ]\\*/\\s*$|^(\\t|[ ])*\\*([ ]([^\\*]|\\*(?!/))*)?$"
        )
    },
    onEnterRules: [
        {
            beforeText: new RegExp("^\\s*/\\*\\*(?!/)([^\\*]|\\*(?!/))*$"),
            afterText: new RegExp("^\\s*\\*/$"),
            action: {
                indentAction: monaco.languages.IndentAction.IndentOutdent,
                appendText: " * "
            }
        },
        {
            beforeText: new RegExp("^\\s*/\\*\\*(?!/)([^\\*]|\\*(?!/))*$"),
            action: {
                indentAction: monaco.languages.IndentAction.None,
                appendText: " * "
            }
        },
        {
            beforeText: new RegExp("^(\\t|[ ])*\\*([ ]([^\\*]|\\*(?!/))*)?$"),
            previousLineText: new RegExp("(?=^(\\s*(/\\*\\*|\\*)).*)(?=(?!(\\s*\\*/)))"),
            action: {
                indentAction: monaco.languages.IndentAction.None,
                appendText: "* "
            }
        },
        {
            beforeText: new RegExp("^(\\t|[ ])*[ ]\\*/\\s*$"),
            action: {
                indentAction: monaco.languages.IndentAction.None,
                removeText: 1
            }
        },
        {
            beforeText: new RegExp("^(\\t|[ ])*[ ]\\*[^/]*\\*/\\s*$"),
            action: {
                indentAction: monaco.languages.IndentAction.None,
                removeText: 1
            }
        },
        {
            beforeText: new RegExp("^\\s*(\\bcase\\s.+:|\\bdefault:)$"),
            afterText: new RegExp("^(?!\\s*(\\bcase\\b|\\bdefault\\b))"),
            action: {
                indentAction: monaco.languages.IndentAction.Indent
            }
        },
        {
            previousLineText: new RegExp("^\\s*(((else ?)?if|for|while)\\s*\\(.*\\)\\s*|else\\s*)$"),
            beforeText: new RegExp("^\\s+([^{i\\s]|i(?!f\\b))"),
            action: {
                indentAction: monaco.languages.IndentAction.Outdent
            }
        },
        {
            beforeText: new RegExp("^.*\\([^\\)]*$"),
            afterText: new RegExp("^\\s*\\).*$"),
            action: {
                indentAction: monaco.languages.IndentAction.IndentOutdent,
                appendText: "\t"
            }
        },
        {
            beforeText: new RegExp("^.*\\{[^\\}]*$"),
            afterText: new RegExp("^\\s*\\}.*$"),
            action: {
                indentAction: monaco.languages.IndentAction.IndentOutdent,
                appendText: "\t"
            }
        },
        {
            beforeText: new RegExp("^.*\\[[^\\]]*$"),
            afterText: new RegExp("^\\s*\\].*$"),
            action: {
                indentAction: monaco.languages.IndentAction.IndentOutdent,
                appendText: "\t"
            }
        }
    ]
}

export default config
