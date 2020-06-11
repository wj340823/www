export interface ButtonConfig{
    /**
     * @description 按钮类型，可选值为 default、primary、dashed、text、info、success、warning、error或者不设置
     */
    type?:string
    /**
     * @description 幽灵属性，使按钮背景透明
     */
    ghost?:boolean
     /**
     * @description 按钮大小，可选值为large、small、default或者不设置
     */
    size?:string
     /**
     * @description 按钮形状，可选值为circle或者不设置
     */
    shape?:string
     /**
     * @description 开启后，按钮的长度为 100%
     */
    long?:boolean
     /**
     * @description 设置button原生的type，可选值为button、submit、reset,默认值：button
     */
    htmlType?:boolean
     /**
     * @description 设置按钮为加载中状态
     */
    loading?:boolean
     /**
     * @description 设置按钮的图标类型
     */
    icon?:string
     /**
     * @description 设置按钮的自定义图标
     */
    customIcon?:string
     /**
     * @description 跳转的链接，支持 vue-router 对象
     */
    to?:string | object
    /**
     * @description 路由跳转时，开启 replace 将不会向 history 添加新记录 默认值:false
     */
    replace?:string | object
    /**
     * @description 相当于 a 链接的 target 属性
     */
    target?:string
    /**
     * @description 同 vue-router append(3.4.0) 默认值:false
     */
    append?:boolean
}