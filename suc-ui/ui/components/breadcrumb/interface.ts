export interface BreadcrumbItemData{
    /**
     * @description 标题
     */
    label?:string
    /**
     * @description 链接，不传则没有链接，支持 vue-router 对象
     */
    to?:string | object
     /**
     * @description 路由跳转时，开启 replace 将不会向 history 添加新记录
     */
    replace?:boolean
     /**
     * @description 相当于 a 链接的 target 属性
     */
    target?:string
     /**
     * @description 同 vue-router append
     */
    append?:boolean
}