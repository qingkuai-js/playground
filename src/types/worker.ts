import type TS from "typescript"
import type { QingkuaiCompiler } from "./common"
import type { PrettierAndPlugins, ProjectKind } from "qingkuai-language-service"

export type SetStateOptions = Partial<{
    ts: typeof TS
    system: TS.System
    isReload: boolean
    projectKind: ProjectKind
    tsLanguageService: TS.LanguageService
    prettierAndPlugins: PrettierAndPlugins
    updateFile: (fileName: string) => void
    deleteFile: (fileName: string) => void
    qingkuaiCompiler: typeof QingkuaiCompiler
    tsLanguageServiceHost: TS.LanguageServiceHost
}>
