export interface ModalConfig {
    /**
     * @description 对话框标题，如果使用 slot 自定义了页头，则 title 无效
     */
    title?: string;
    /**
     * @description 是否显示右上角的关闭按钮，关闭后 Esc 按键也将关闭,
     * @default true
     */
    closable?: boolean;
    /**
     * @description 是否允许点击遮罩层关闭
     * @default true
     */
    "mask-closable"?: boolean;
    /**
     * @description 点击确定按钮时，确定按钮是否显示 loading 状态，开启则需手动设置visible来关闭对话框,
     * @default false
     */
    loading?: boolean;
    /**
     * @description 页面是否可以滚动
     * @default false
     */
    scrollable?: boolean;
    /**
     * @description 是否全屏显示
     * @default false
     */
    fullscreen?: boolean;
    /**
     * @description 是否可以拖拽移动
     * @default false
     */
    draggable?: boolean;
    /**
     * @description 是否显示遮罩层，开启 draggable 时，强制不显示
     * @default true
     */
    mask?: boolean;
    /**
     * @description 确定按钮文字
     * @default 确定
     */
    "ok-text"?: string;
    /**
     * @description 取消按钮文字
     * @default 取消
     */
    "cancel-text"?: string;
    /**
     * @description 对话框宽度，单位 px。对话框的宽度是响应式的，当屏幕尺寸小于 768px 时，宽度会变为自动auto,
     * @default 	520
     */
    width?: number | string;
    /**
     * @description 不显示底部
     * @default false
     */
    "footer-hide"?: boolean;
    /**
     * @description 设置浮层样式，调整浮层位置等，该属性设置的是.ivu-modal的样式
     */
    style?: object;
    /**
     * @description 设置对话框容器.ivu-modal-wrap的类名，可辅助实现垂直居中等自定义效果
     */
    "class-name"?: string;
    /**
     * @description 层级
     * @default 1000
     */
    "z-index"?: number;
    /**
     * @description 自定义显示动画，第一项是模态框，第二项是背景,
     * @default ['ease', 'fade']
     */
    "transition-names"?: Array<string>;
    /**
     * @description 是否将弹层放置于 body 内，默认值true
     * @default true
     */
    transfer?: boolean;
}
