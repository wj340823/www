export interface MenuConfig {
    /**
     * @description 菜单类型，可选值为 horizontal（水平） 和 vertical（垂直）
     */
    mode?: "horizontal" | "vertical";
    /**
     * @description 主题，可选值为 light、dark、primary，其中 primary 只适用于 mode="horizontal"
     */
    theme?:"light" | "dark" | "primary"
    /**
     * @description 激活菜单的 name 值
     */
    activeName?:number | string
    /**
     * @description 展开的 Submenu 的 name 集合
     */
    openNames?:[string | number]
    /**
     * @description 是否开启手风琴模式，开启后每次至多展开一个子菜单
     */
    accordion?:boolean
    /**
     * @description 导航菜单的宽度，只在 mode="vertical" 时有效，如果使用 Col 等布局，建议设置为 auto
     */
    width?:string
   
}
