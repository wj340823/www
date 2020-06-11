export interface RadioConfig {
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


export interface RadioGroupConfig{
    /**
     * @description 可选值为 button 或不填，为 button 时使用按钮样式
     */
    type?:string
    /**
     * @description 尺寸，可选值为large、small、default或者不设置
     */
    size?:'large' | 'small' | 'default'
    /**
     * @description 是否垂直排列，按钮样式下无效
     */
    vertical?:boolean
}