import Vue from "vue";
import VueRouter, {RouteConfig} from "vue-router";
import Home from "../views/Home.vue";
import Visual from "../../../sub/gnet-af/web/src/views/todo.vue";
import Data from '../views/dataManage/Main.vue'
import DataManage from './dataManage'

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "",
        redirect: "/main"
    },
    {
        path: "/login",
        component: resolve => require(["../views/Login.vue"], resolve)
    },
    {
        //懒加载
        path: "/main",
        component: resolve => require(["../layout/Main.vue"], resolve),
        children: [
            {
                path: "",
                redirect: "/home"
            },
            {
                path: "/home",
                name: "Home",
                component: Home
            },
            {
                path: "/doc",
                name: "Doc",
                component: Visual
            },
            {
                path: "/data",
                name: "data",
                redirect:'/data/dataMainView',
                component: Data,
                children: [
                    ...DataManage.routers
                ]
            }
        ]
    }
];

const router = new VueRouter({
    routes
});

export default router;
