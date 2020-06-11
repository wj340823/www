//顶部参数配置
export interface TopParamConfig {
    label: string;
    searchable?: boolean;
    importable?: boolean;
    operate?: boolean;
    operateType?: string;
    back?: boolean;
}

//mainView页面主对象属性
export interface MainViewConfig {
    loading?: boolean;
    data: any[];
    name?: string;
    categoryId?: string | number;
    groupId?: string | number;
}
//dataImport 页面主对象属性
export interface DataImportConfig {
    type: string;
}
//矢量图数据类型
export interface VectorDataConfig {
    dataName: string;
    wkid: number;
    file: string;
    fileLists: any[];
    desription: string;
    importType: string;
    typeList: any;
    kindSelected: string;
    kinds: any[];
    groupId: string;
    groups: any[];
    check: boolean;
}
//栅格图和3d图三维类型
export interface RasterDataConfig {
    type?: string;
    typeList?: any[];
    serviceId?: string;
    serviceAdd?: string;
    serviceType?: string;
    serviceTypeList?: any[];
    wkid?: string;
    zoom?: any[];
    desription?: string;
    kindSelected: string;
    kinds: any[];
    groupId: string;
    three?: string;
    threeList: any[];
}
//数据质检主对像
export interface DataCheckConfig {
    type: string;
    typeList: any[];
    checkSel: string;
    checkOptions: any[];
    title?: string;
    shipe: any[];
    regular: [];
}
// 表格数据配置
export interface TbItem {
    label: string;
    value?: string;
    width?: number;
    fixed?: string;
}
export type TableDate = TbItem[];
//Page
export interface Page {
    no: number;
    size: number;
}
export interface Operate {
    show: boolean;
    type: "add" | "edit" | "del";
    data: any;
    title: string;
    configType?:string
}
