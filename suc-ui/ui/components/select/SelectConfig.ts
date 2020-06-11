export interface SelectConfig {
    /**
     * @description 是否支持多选
     * @default false
     */
    multiple?: boolean;
    /**
     * @description 是否禁用
     * @default false
     */
    disabled?: boolean;
    /**
     * @description 是否可以清空选项，只在单选时有效
     * @default false
     */
    clearable?: boolean;
    /**
     * @description 是否支持搜索
     * @default false
     */
    filterable?: boolean;
    /**
     * @description 是否使用远程搜索
     * @default false
     */
    remote?: boolean;
    /**
     * @description 远程搜索的方法
     */
    'remote-method'?: (query: any) => void;
    /**
     * @description 当前是否正在远程搜索
     * @default false
     */
    loading?: boolean;
    /**
     * @description 远程搜索中的文字提示
     * @default 加载中
     */
    'loading-text'?: string;
    /**
     * @description 仅在 remote 模式下，初始化时使用。因为仅通过 value 无法得知选项的 label，需手动设置。默认值空
     */
    label?: string | number | string[] | number[];
    /**
     * @description 选择框大小，可选值为large、small、default或者不填
     */
    size?: '' | 'large' | 'small' | 'default';
    /**
     * @description 选择框默认文字
     * @default 请选择
     */
    placeholder?: string;
    /**
     * @description 当下拉列表为空时显示的内容
     * @default 无匹配数据
     */
    'not-found-text'?: string;
    /**
     * @description 在返回选项时，是否将 label 和 value 一并返回，默认只返回
     * @default false
     */
    'label-in-value'?: boolean;
    /**
     * @description 弹窗的展开方向，可选值为 top、bottom、top-start、bottom-start、top-end、bottom-end
     * @default bottom-start
     */
    placement?: 'bottom' | 'top' | 'top-start' | 'bottom-start' | 'top-end' | 'bottom-end';
    /**
     * @description 是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，
     * @description 建议添加此属性，它将不受父级样式影响，从而达到更好的效果
     * @default false
     */
    transfer?: boolean;
    /**
     * @description 给表单元素设置 id，详见 Form 用法。
     */
    'element-id'?: string;
    /**
     * @description 开启 transfer 时，给浮层添加额外的 class 名称
     */
    'transfer-class-name'?: string;
    /**
     * @description 在 Select 内显示图标
     */
    prefix?: string;
    /**
     * @description 多选时最多显示多少个 tag
     */
    'max-tag-count'?: number;
    /**
     * @description 隐藏 tag 时显示的内容，参数是剩余项数量
     */
    'max-tag-placeholder'?: (num: number) => any;
}
