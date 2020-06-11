import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import VueClipboard from 'vue-clipboard2'
import GlobalComponents from './components'

import './utils/class-component-hooks'
import plugin from "./utils/suc-plugin";

import {SucMessage, SucNotice, LoadingBar} from "@suc/ui";
import axios from 'axios';

import vueHljs from "vue-hljs";
//if you want to use default color, import this css file
import "highlight.js/scss/a11y-light.scss"

import './assets/iconfont/iconfont.css';
import '@suc/ui/styles/index.scss';
import './styles/index.scss';

if (process.env.NODE_ENV === 'development') {
    //开发环境 do something
    axios.defaults.baseURL = "./api";
} else {
    //生产环境 do something
}

Vue.use(GlobalComponents);

Vue.use(plugin);

Vue.use(VueClipboard);

Vue.use(vueHljs);

Vue.prototype.$SucMessage = SucMessage;
Vue.prototype.$SucNotice = SucNotice;

Vue.prototype.$Copy = function (text: string) {
    const that = this;
    that.$copyText(text).then(() => {
        that.$SucMessage.info("已复制!");
    }, () => {
        that.$SucMessage.error("复制失败!");
    });
};

Vue.prototype.$http = axios;

Vue.config.productionTip = false;

// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页
axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response) {
        switch (error.response.status) {
            case 401:
                router.replace({
                    path: '/login',
                });
                break;
            case 403:
                router.replace({
                    path: '/login',
                });
                break;
            default:
                try {
                    if (error.response.request.responseURL.includes('authox/curUser')) {
                        router.replace({
                            path: '/login',
                        });
                    }
                } catch (e) {
                    console.log(e)
                }
        }
    }
    return Promise.reject(error.response)
});

router.beforeEach((to, from, next) => {
    LoadingBar.config({
        color: '#fff'
    });
    LoadingBar.start();
    next();
});

router.afterEach(route => {
    LoadingBar.finish();
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
