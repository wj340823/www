export interface CheckboxConfig {
    /**
     * @description 设置 indeterminate 状态，只负责样式控制
     */
    indeterminate?:boolean
    /**
     * @description 单选框的尺寸，可选值为 large、small、default 或者不设置
     */
    size?:'large' | 'small' | 'default'
    /**
     * @description 选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用
     */
    trueValue?:string | number | boolean
    /**
     * @description 没有选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用
     */
    falseValue?:string | number | boolean

}

export interface CheckboxGroupConfig{
    /**
     * @description 单选框的尺寸，可选值为 large、small、default 或者不设置
     */
    size?:'large' | 'small' | 'default'
}
