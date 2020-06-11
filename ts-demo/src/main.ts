import Vue from 'vue'
import App from './App.vue'
import router from './router'
//import router from './rout'
import store from './stores'

import './utils/class-component-hooks'
import plugin from "./utils/suc-plugin";

import iView, { LoadingBar } from 'iview';
import axios from 'axios';

//import authox from '@suc/authox/plugins/authox-vue';
//import VueOl from '@suc/vue-ol';

import './styles/index.scss';
import '@suc/authox/styles/authox.scss';
import 'iview/dist/styles/iview.css';

if (process.env.NODE_ENV === 'development') {
    //开发环境 do something
    axios.defaults.baseURL = "./api";
} else {
    //生产环境 do something
}

Vue.use(iView);

//Vue.use(authox, store);

//Vue.use(VueOl);

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
                });
                break;
            case 403:
                router.replace({
                    path: '/login',
                });
                break;
        }
    }
    return Promise.reject(error.response)
});

router.beforeEach((to, from, next) => {
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
}).$mount('#app')
