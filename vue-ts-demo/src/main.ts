import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'

import './utils/class-component-hooks'
import plugin from "./utils/suc-plugin";

import axios from 'axios';

import { utils } from "@suc/ui";
import authox from '@suc/authox/plugins/authox-vue';
import VueOl from '@suc/monch';

import './styles/index.scss';
import '@suc/authox/styles/authox.scss';
import 'iview/dist/styles/iview.css';

if (process.env.NODE_ENV === 'development') {
    //开发环境 do something
    axios.defaults.baseURL = "./api";
} else {
    //生产环境 do something
}

Vue.use(utils, router);

Vue.use(authox, store);

Vue.use(VueOl);

Vue.use(plugin);

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
                    query: {redirect: router.currentRoute.path}
                });
                break;
            case 403:
                router.replace({
                    path: '/login',
                    query: {redirect: router.currentRoute.path}
                });
                break;
            default:
                try {
                    if (error.response.request.responseURL.includes('authox/curUser')) {
                        router.replace({
                            path: '/login',
                            query: {redirect: router.currentRoute.path}
                        });
                    }
                } catch (e) {
                    console.log(e)
                }
        }
    }
    return Promise.reject(error.response)
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
