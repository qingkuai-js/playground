import type Monaco from "monaco-editor-core"

const config: Monaco.languages.LanguageConfiguration = {
    comments: {
        blockComment: ["/*", "*/"]
    },
    brackets: [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"]
    ],
    autoClosingPairs: [
        {
            open: "{",
            close: "}",
            notIn: ["string", "comment"]
        },
        {
            open: "[",
            close: "]",
            notIn: ["string", "comment"]
        },
        {
            open: "(",
            close: ")",
            notIn: ["string", "comment"]
        },
        {
            open: '"',
            close: '"',
            notIn: ["string", "comment"]
        },
        {
            open: "'",
            close: "'",
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
            open: '"',
            close: '"'
        },
        {
            open: "'",
            close: "'"
        }
    ],
    folding: {
        markers: {
            start: new RegExp("^\\s*\\/\\*\\s*#region\\b\\s*(.*?)\\s*\\*\\/"),
            end: new RegExp("^\\s*\\/\\*\\s*#endregion\\b.*\\*\\/")
        }
    },
    indentationRules: {
        increaseIndentPattern: new RegExp("(^.*\\{[^}]*$)"),
        decreaseIndentPattern: new RegExp("^\\s*\\}")
    },
    wordPattern: new RegExp("(#?-?\\d*\\.\\d\\w*%?)|(::?[\\w-]*(?=[^,{;]*[,{]))|(([@#.!])?[\\w-?]+%?|[@#!.])")
}

export default config
