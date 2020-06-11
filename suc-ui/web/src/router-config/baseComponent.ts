import {routers,menus} from "./baseComponent/index"
export default {
    routers:[
        {
            path: '',
            redirect: 'baseComponent',
        },
        {
            path: 'baseComponent',
            meta: {
                name: 'baseComponent'
            },
            component: () => import('@/components/ViewModule.vue'),
            children:[...routers]
        }
    ],
    menus:[
        {
            label:"通用",
            router:"/main/baseComponent/base",
            children:[...menus.base]
        },
        {
            label:"布局",
            router:"/main/baseComponent/layout",
            children:[...menus.layout]
        },
        {
            label:"导航",
            router:"/main/baseComponent/nav",
            children:[...menus.nav]
        },
        {
            label:"数据录入",
            router:"/main/baseComponent/dataInput",
            children:[...menus.dataInput]
        },
        {
            label:"数据展示",
            router:"/main/baseComponent/display",
            children:[...menus.display]
        }
    ]
}