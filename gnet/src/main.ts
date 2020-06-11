import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import { utils } from "@suc/ui/index";

import "iview/dist/styles/iview.css";
import "element-ui/lib/theme-chalk/index.css";
import "@suc/ui/assets/iconfont/iconfont.css";
import "@suc/ui/styles/index.scss";
import "./styles/index.scss";

if (process.env.NODE_ENV === "development") {
    //开发环境 do something
    axios.defaults.baseURL = "./api";
} else {
    //生产环境 do something
}
Vue.config.productionTip = false;
Vue.use(utils, { router });

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
