export interface ValidateResult {
    invalid: boolean,
    valid: boolean,

    [k: string]: boolean
}

export interface FormItemConfig {
    /**
     * @description 对应表单域 model 里的字段
     * 不建议使用,除非必须搭配rules
     */
    prop?: string;
    /**
     * @description 标签文本
     */
    label?: string;
    /**
     * @description 表单域标签的的宽度
     */
    'label-width'?: number;
    /**
     * @description 指定原生的 label 标签的 for 属性，配合控件的 element-id 属性，可以点击 label 时聚焦控件。
     */
    'label-for'?: string;
    /**
     * @description 是否必填，如不设置，则会根据校验规则自动生成
     */
    required?: boolean;
    /**
     * @description 表单验证规则
     * 不建议使用
     */
    rules?: object | Array<any>;
    /**
     * @description 表单域验证错误信息, 设置该值会使表单验证状态变为error，并显示该错误信息
     */
    error?: string;
    /**
     * @description 是否显示校验错误信息
     * @default true
     */
    'show-message'?: boolean;
}

export interface FormConfig {
    /**
     * @description 表单数据对象
     * 除非使用rules 否则不需要
     */
    model?: object;
    /**
     * @description 表单验证规则，具体配置查看 async-validator
     * 不建议使用,建议使用SucFormItem重新封装的props validator
     */
    rules?: object;
    /**
     * @description 是否开启行内表单模式
     * @default false
     */
    inline?: boolean;
    /**
     * @description 表单域标签的位置，可选值为 left、right、top
     * @default right
     */
    'label-position'?: 'left' | 'right' | 'top';
    /**
     * @description 表单域标签的宽度，所有的 FormItem 都会继承 Form 组件的 label-width 的值
     */
    'label-width'?: number;
    /**
     * @description 是否显示校验错误信息
     * @default true
     */
    'show-message'?: boolean;
}

