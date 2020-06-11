export interface TransferDataItem {
    key: string | number,
    label: string | number,
    disabled?: boolean,
    [key:string]: any
}
export interface TransferConfig {
    /**
     *  @description 数据源，其中的数据将会被渲染到左边一栏中，targetKeys 中指定的除外。
     *  @type Array
     *  @default  []
    */
    data?: TransferDataItem[],
    /**
     *  @description 每行数据渲染函数，该函数的入参为 data 中的项
     *  @type Function
     *  @default  默认显示label，没有时显示key
     */
    renderFormat?:(item:any)=>any,
    /**
     *  @description 显示在右侧框数据的key集合
     *  @type Array
     *  @default  []
     */
    targetKeys?: any[],
    /**
     *  @description 设置哪些项应该被选中
     *  @type Array
     *  @default  []
     */
    selectedKeys?: any[],
    /**
     *  @description 两个穿梭框的自定义样式
     *  @type Object
     *  @default  {}
     */
    listStyle?: {[key:string]:any},
    /**
     *  @description 标题集合，顺序从左至右
     *  @type Array
     *  @default  ['源列表', '目的列表']
     */
    titles?: any[],
    /**
     *  @description 操作文案集合，顺序从上至下
     *  @type Array
     *  @default  []
     */
    operations?: any[],
    /**
     *  @description 是否显示搜索框
     *  @type Boolean
     *  @default  false
     */
    filterable?: boolean,
    /**
     *  @description 搜索框的占位
     *  @type String
     *  @default  请输入搜索内容
     */
    filterPlaceholder?: string,
    /**
     *  @description 自定义搜索函数，入参为 data 和 query，data 为项，query 为当前输入的搜索词
     *  @type Function
     *  @default  默认搜索label
     */
    filterMethod?: (data:any, query:string)=>boolean,
    /**
     *  @description 当列表为空时显示的内容
     *  @type String
     *  @default  列表为空
     */
    notFoundText?: string
}
