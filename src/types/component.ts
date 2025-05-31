export interface FileTabProps {
    showIcon: boolean
    showNewTab: boolean
}

export interface MessageBoxProps {
    value: string
    type: "error" | "warning"
}

export interface Store {
    debug: boolean
    comment: boolean
    codeLens: boolean
    tsVersion: string
    resolving: boolean
    leftFileTab: {
        tabs: string[]
        activeIndex: number
    }
    rightFileTab: {
        tabs: string[]
        activeIndex: number
    }
    qingkuaiVersion: string
    message: {
        left: MessageBoxProps
        right: MessageBoxProps
    }
    showingExternalSingleDefinition: boolean
}
