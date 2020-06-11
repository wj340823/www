declare module 'vue-echarts' {
    export interface echartsOptions {
        options: object;
        autoresize: boolean;
    }
}

declare module '@suc/vue-ol' {
    import { PluginObject } from 'vue';
    const VueOl: PluginObject<any>;
    export default VueOl;
}

declare module 'vue-clipboard2' {
    const Clipboard: any;
    export default Clipboard;
}

declare module 'iview' {
    export { CollapsePanel as Panel } from "iview/types/iview.components";
    export * from "iview/types/iview.components";
    const Submenu: any;
    const Step: any;
    export { Submenu, Step };
}

declare module 'vue-hljs'{
    const hljs: any;
    export default hljs;
}
declare module 'vue-json-editor' {
    import { ComponentOptions } from 'vue';
    const app: ComponentOptions<any>;
    export default app;
}
