import viewModule from "./ViewModule.vue";
import ViewPage from "./ViewPage.vue";
import DemoPannel from "./DemoPannel.vue";
import DemoPart from "./DemoPart.vue";
import DemoApi from "./DemoApi.vue";

const components:any = {
    viewModule,
    ViewPage,
    DemoPannel,
    DemoPart,
    DemoApi
};

const install:any = function(Vue:any,opts:any = {}){
    if (install.installed) return;
    Object.keys(components).forEach((key:string) => {
        Vue.component(key, components[key]);
    });
};

const API = {
    install,
    ...components
};

export default API;
