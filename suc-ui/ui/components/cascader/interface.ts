export interface CascaderDataChild {
    label: string | number,
    value: string | number,
    [key:string]: any
}
export interface CascaderDataItem {
    label: string | number,
    value: string | number,
    children?: CascaderDataChild[],
    [key:string]: any
}
export interface CascaderConfig {
    /**
     *  @description 输入框占位符
     *  @type String
     *  @default 请选择
     */
    placeholder?: string,
    /**
     *  @description 输入框大小，可选值为large和small或者不填
     *  @type String
     *  @default -
     */
    size?: 'small'|'large'|'default',
    /**
     *  @description 选择后展示的函数，用于自定义显示格式
     *  @type Function
     *  @default label => label.join(' / ')
     */
    renderFormat?: (labels:string[]|number[], selectedData:any[])=>string,
    /**
     *  @description 动态获取数据，数据源需标识 loading
     *  @type Function
     *  @default -
     */
    loadData?: (item:any, callback:Function)=>void,
    /**
     *  @description 当搜索列表为空时显示的内容
     *  @type String
     *  @default 无匹配数据
     */
    notFoundText?: string,
    name?: string,
    /**
     *  @description 给表单元素设置 id，详见 Form 用法。
     *  @type String
     *  @default -
     */
    elementId?: string
}
