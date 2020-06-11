declare module 'vue-echarts' {
    export interface echartsOptions {
        options: object;
        autoresize: boolean;
    }
}
declare module '@suc/monch' {
    import { PluginObject } from 'vue';
    const VueOl: PluginObject<any>;
    export default VueOl;
}
declare module 'iview' {
    export { CollapsePanel as Panel } from "iview/types/iview.components";
    export * from "iview/types/iview.components";
    const Submenu: any;
    const Step: any;
    export { Submenu, Step };
}
