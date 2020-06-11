declare module 'vue-echarts' {
    export interface echartsOptions {
        options: object;
        autoresize: boolean;
    }
}
declare module '@suc/vue-ol' {
    import { PluginObject } from 'vue';
    const VueOl: PluginObject<any>
    export default VueOl;
}
