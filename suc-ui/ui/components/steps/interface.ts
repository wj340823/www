export interface StepsConfig {
    /**
     * @description 步骤条的尺寸，可选值为small或者不写
     */
    size?:"small"
    /**
     * @description 步骤条的方向，可选值为horizontal（水平）或vertical（垂直）
     */
    derection?:"horizontal" | "vertical"
     /**
     * @description 指定是否最后一个节点为幽灵节点
     */
    pending?:boolean
     /**
     * @description 标题和内容是否居中对齐
     */
    center?:boolean
     /**
     * @description 是否为简单模式
     */
    simple?:boolean
}

export interface StepItem{
    /**
     * @description 步骤的状态，可选值为wait、process、finish、error，不设置时自动判断
     */
    status?:string
     /**
     * @description 标题
     */
    title?:string
     /**
     * @description 步骤的详细描述，可选
     */
    content?:string
     /**
     * @description 步骤的图标，可选
     */
    icon?:string
}
