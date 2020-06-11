// @ts-ignore
import 'core-js/modules/es6.array.find-index.js';
import {VueRouter} from "vue-router/types/router";
import {LoadingBar, SucConfirm, SucMessage} from "./components";
import * as components from "./components";
import {Loading} from "element-ui";
import "./assets/iconfont/iconfont.css";

const sucsoft: any = {
    ...components
};

const install: any = function (Vue: any, opts: any = {}) {
    if (install.installed) return;
    Object.keys(sucsoft).forEach((key: string) => {
        Vue.component(key, sucsoft[key]);
    });
};

if (typeof window !== 'undefined' && (<any>window).Vue) {
    install((<any>window).Vue);
}

const API = {
    version: process.env.VERSION,
    install,
};

export const version = process.env.VERSION;
export * from './components';
export default API;

export function utils(Vue: any, {router}: { router?: VueRouter }) {
    Vue.use(Loading);
    Vue.prototype.$SucConfirm = SucConfirm;
    Vue.prototype.$SucMessage = SucMessage;
    if (router && router.beforeEach && router.afterEach) {
        router.beforeEach((to, from, next) => {
            LoadingBar.start();
            next();
        });
        router.afterEach(route => {
            LoadingBar.finish();
        });
    }

}
