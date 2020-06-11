export interface InputConfig {
    /**
     * @description 绑定的值，可使用 v-model 双向绑定
     */
    size?:"large" | "small" | "default"
    /**
     * @description 是否显示清空按钮
     */
    clearable?:boolean
    /**
     * @description 最大输入长度
     */
    maxlength?:number
    /**
     * @description 是否显示输入字数统计，可以配合 maxlength 使用(4.0.0以上版本)
     */
    showWordLimit?:boolean
    /**
     * @description 是否显示切换密码图标(4.0.0以上版本)
     */
    password?:boolean
    /**
     * @description 输入框尾部图标，仅在 text 类型下有效
     */
    icon?:string
    /**
     * @description 输入框头部图标
     */
    prefix?:string
    /**
     * @description 输入框尾部图标
     */
    suffix?:string
    /**
     * @description 是否显示为搜索型输入框
     */
    search?:boolean
    /**
     * @description 是否有确认按钮，可设为按钮文字(开启时会自动将search设为ture)
     */
    enterButton?:boolean | string
    /**
     * @description 文本域默认行数，设置之后会自动将type设置为textarea
     */
    rows?:number
    /**
     * @description 自适应内容高度，可传入对象，如 { minRows: 2, maxRows: 6 }，设置之后会自动将type设置为textarea
     */
    autosize?:boolean | object
    /**
     * @description 将用户的输入转换为 Number 类型
     */
    number?:boolean
    /**
     * @description 自动获取焦点
     */
    autofocus?:boolean
    /**
     * @description 自动获取焦点
     */
    autocomplete?:boolean
    /**
     * @description 给表单元素设置 id，详见 Form 用法。
     */
    elementId?:string
    /**
     * @description 原生的 spellcheck 属性
     */
    spellcheck?:boolean
    /**
     * @description 原生的 wrap 属性，可选值为 hard 和 soft，仅在 textarea 下生效
     */
    wrap?:"hard" | "soft"
    
}
