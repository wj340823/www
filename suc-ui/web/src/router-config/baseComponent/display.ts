const baseRouter:string = "/main/baseComponent/display";
export default {
    routers:[
        {
            path: 'display',
            meta: {
                name: 'display'
            },
            component: () => import('@/components/EmptyView.vue'),
            children:[
                {
                    path: '',
                    redirect: 'alert',
                },
                {
                    path: 'alert',
                    meta: {
                        name: 'alert'
                    },
                    component: () => import('@/views/baseComponent/display/alert.vue')
                },
                {
                    path: 'message',
                    meta: {
                        name: 'message'
                    },
                    component: () => import('@/views/baseComponent/display/message.vue')
                },
                {
                    path: 'notification',
                    meta: {
                        name: 'notification'
                    },
                    component: () => import('@/views/baseComponent/display/notification.vue')
                },
                {
                    path: 'modal',
                    meta: {
                        name: 'modal'
                    },
                    component: () => import('@/views/baseComponent/display/modal.vue')
                },
                {
                    path: 'drawer',
                    meta: {
                        name: 'drawer'
                    },
                    component: () => import('@/views/baseComponent/display/drawer.vue')
                },
                {
                    path: 'timeline',
                    meta: {
                        name: 'timeline'
                    },
                    component: () => import('@/views/baseComponent/display/timeline.vue')
                },
                {
                    path: 'table',
                    meta: {
                        name: 'table'
                    },
                    component: () => import('@/views/baseComponent/display/table.vue')
                },
                {
                    path: 'progress',
                    meta: {
                        name: 'progress'
                    },
                    component: () => import('@/views/baseComponent/display/progress.vue')
                },
                {
                    path: 'tree',
                    meta: {
                        name: 'tree'
                    },
                    component: () => import('@/views/baseComponent/display/tree.vue')
                }
            ]
        }
    ],
    menus:[
        {
            label:"Alert 警告提示",
            router:`${baseRouter}/alert`
        },
        {
            label:"Message 全局提示",
            router:`${baseRouter}/message`
        },
        {
            label:"Notification 通知提醒",
            router:`${baseRouter}/notification`
        },
        {
            label:"Modal 模态弹框",
            router:`${baseRouter}/modal`
        },
        {
            label:"Drawer 抽屉",
            router:`${baseRouter}/drawer`
        },
        {
            label:"Timeline 时间轴",
            router:`${baseRouter}/timeline`
        },
        {
            label:"Table 表格",
            router:`${baseRouter}/table`
        },
        {
            label:"Progress 进度条",
            router:`${baseRouter}/progress`
        },
        {
            label:"Tree 树形控件",
            router:`${baseRouter}/tree`
        }
    ]
}
