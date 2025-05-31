import type { CustomFS, CustomPath } from "qingkuai-language-service"
import type { TextDocument } from "vscode-languageserver-textdocument"

import { fsMap } from "./state"
import { getLineStarts } from "../util/sundary"

export const fsImplementation: CustomFS = {
    exist(path) {
        return fsMap.has(path)
    },
    read(path) {
        return fsMap.get(path) ?? ""
    }
}

export const pathImplementation: CustomPath = {
    resolve(...segments) {
        const resultParts: string[] = []

        const extendResultParts = (s: string) => {
            if (s || resultParts[resultParts.length - 1] !== "") {
                resultParts.push(s)
            }
        }

        for (const segment of segments) {
            if (segment === "/") {
                extendResultParts("")
                continue
            }
            for (const item of segment.split("/")) {
                if (item === ".") {
                    continue
                }
                if (item === "..") {
                    resultParts.pop()
                } else {
                    extendResultParts(item)
                }
            }
        }
        return resultParts.join("/")
    },
    relative(from, to) {
        let commonLength = 0
        const toParts = to.split("/").filter(Boolean)
        const fromParts = from.split("/").filter(Boolean)
        while (
            commonLength < toParts.length &&
            commonLength < fromParts.length &&
            fromParts[commonLength] === toParts[commonLength]
        ) {
            commonLength++
        }

        const upMoves = fromParts.length - commonLength
        const downMoves = toParts.slice(commonLength)
        return [...Array(upMoves).fill(".."), ...downMoves].join("/") || "."
    },
    ext(path) {
        const lastDotIndex = path.lastIndexOf(".")
        const lastSlashIndex = path.lastIndexOf("/")
        if (lastDotIndex < lastSlashIndex) {
            return ""
        }
        return lastDotIndex === -1 ? "" : path.slice(lastDotIndex)
    },
    dir(path) {
        const lastSlashIndex = path.lastIndexOf("/")
        return lastSlashIndex <= 0 ? "/" : path.slice(0, lastSlashIndex)
    },
    base(path) {
        const extname = this.ext(path)
        const subStartIndex = path.lastIndexOf("/") + 1
        return path.slice(subStartIndex, extname ? -extname.length : undefined)
    }
}

export const createLsTextDocument = (
    uri: string,
    version: number,
    content: string,
    languageId: string
): TextDocument => {
    const lineStarts = getLineStarts(content)
    return {
        uri,
        version,
        languageId,
        lineCount: lineStarts.length,
        offsetAt(position) {
            for (let i = 0; i < lineStarts.length; i++) {
                if (position.line === i) {
                    return lineStarts[i] + position.character
                }
            }
            return -1
        },
        positionAt(offset) {
            for (let i = 0; i < lineStarts.length; i++) {
                if (offset >= lineStarts[i] && (i === lineStarts.length - 1 || offset < lineStarts[i + 1])) {
                    return {
                        line: i,
                        character: offset - i
                    }
                }
            }
            throw "never"
        },
        getText(range) {
            if (!range) {
                return content
            }
            return content.slice(this.offsetAt(range.start) || 0, this.offsetAt(range.end) || content.length)
        }
    }
}
