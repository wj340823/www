const baseRouter: string = "/main/baseComponent/layout";
export default {
    routers: [
        {
            path: 'layout',
            meta: {
                name: 'layout'
            },
            component: () => import('@/components/EmptyView.vue'),
            children: [
                {
                    path: '',
                    redirect: 'grid',
                },
                {
                    path: 'grid',
                    meta: {
                        name: 'grid'
                    },
                    component: () => import('@/views/baseComponent/layout/grid.vue'),
                },
                {
                    path: 'collapse',
                    meta: {
                        name: 'collapse'
                    },
                    component: () => import('@/views/baseComponent/layout/collapse.vue'),
                },
                {
                    path: 'divider',
                    meta: {
                        name: 'divider'
                    },
                    component: () => import('@/views/baseComponent/layout/divider.vue'),
                }
            ]
        }
    ],
    menus: [
        {
            label: "Grid 栅格",
            router: `${baseRouter}/grid`
        },
        {
            label: "Collapse 折叠面板",
            router: `${baseRouter}/collapse`
        },
        {
            label: "Divider 分割线",
            router: `${baseRouter}/divider`
        },
    ]
}
