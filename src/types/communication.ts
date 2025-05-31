export interface Model {
    uri: string
    source: string
    version: number
}

export interface WorkerHandlerBaseParam<T = any> {
    name: string
    id: number
    arg: T
}
