export interface DrawerConfig {
    /**
     * @description 抽屉是否显示，可使用 v-model 双向绑定数据
     */
    value?: boolean;
    /**
     * @description 抽屉标题，如果使用 slot 自定义了页头，则 title 无效
     */
    title?:string
    /**
     * @description 抽屉宽度。当其值不大于 100 时以百分比显示，大于 100 时为像素
     */
    width?:number | string
    /**
     * @description 是否显示右上角的关闭按钮
     */
    closable?:boolean
    /**
     * @description 是否允许点击遮罩层关闭
     */
    maskClosable?:boolean
    /**
     * @description 是否显示遮罩层
     */
    mask?:boolean
    /**
     * @description 遮罩层样式
     */
    maskStyle?:object
    /**
     * @description 抽屉中间层的样式
     */
    styles?:object
    /**
     * @description 页面是否可以滚动
     */
    scrollable?:boolean
    /**
     * @description 抽屉的方向，可选值为 left 或 right
     */
    placement?:'left' | 'right'
    /**
     * @description 是否将抽屉放置于 body 内
     */
    transfer?:boolean
    /**
     * @description 设置抽屉容器.ivu-drawer-wrap的类名
     */
    className?:string
    /**
     * @description 是否设置抽屉在某个元素内打开，开启此属性时，应当关闭 transfer 属性
     */
    inner?:boolean
    /**
     * @description 是否开启拖拽调整宽度(3.3.0)
     */
    draggable ?:boolean
    /**
     * @description 返回 Promise 可以阻止关闭(3.3.0)
     */
    beforeClose  ?:Function
   
}
