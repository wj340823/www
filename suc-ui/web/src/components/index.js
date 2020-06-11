import viewModule from "./ViewModule.vue";
import ViewPage from "./ViewPage.vue";
import DemoPannel from "./DemoPannel.vue";
import DemoPart from "./DemoPart.vue";
import DemoApi from "./DemoApi.vue";
const components = {
    viewModule,
    ViewPage,
    DemoPannel,
    DemoPart,
    DemoApi
};
const install = function (Vue, opts = {}) {
    if (install.installed)
        return;
    Object.keys(components).forEach((key) => {
        Vue.component(key, components[key]);
    });
};
const API = {
    install,
    ...components
};
export default API;
//# sourceMappingURL=index.js.map