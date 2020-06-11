export default {
    routers: [
        {
            path: "dataMainView", //数据主页
            name: "dataMainView",
            component: () => import("@/views/dataManage/pages/MainView.vue")
        },
        {
            path: "dataImport", //数据导入
            name: "dataImport",
            component: () => import("@/views/dataManage/pages/DataImport.vue")
        },
        {
            path: "dataCheckConfig", //数据质检配置
            name: "dataCheckConfig",
            component: () => import("@/views/dataManage/pages/DataCheck.vue")
        }
    ]
};
