export interface ApiTableData {
    attr: string
    desc: string
    type: 'Boolean' | 'String' | 'Array' | 'Object' | 'Element' | 'Function' | string
    default: string
}

export interface ApiTableEvent {
    name: string
    desc: string
    returnValue: string
}

export interface ApiTableSlot {
    name: string
    desc: string
}
