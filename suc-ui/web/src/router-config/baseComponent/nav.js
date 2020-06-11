const baseRouter = "/main/baseComponent/nav";
export default {
    routers: [
        {
            path: 'nav',
            meta: {
                name: 'nav'
            },
            component: () => import('@/components/EmptyView.vue'),
            children: [
                {
                    path: '',
                    redirect: 'menu',
                },
                {
                    path: 'menu',
                    meta: {
                        name: 'menu'
                    },
                    component: () => import('@/views/baseComponent/nav/menu.vue')
                },
                {
                    path: 'tabs',
                    meta: {
                        name: 'tabs'
                    },
                    component: () => import('@/views/baseComponent/nav/tabs.vue')
                },
                {
                    path: 'dropdown',
                    meta: {
                        name: 'dropdown'
                    },
                    component: () => import('@/views/baseComponent/nav/dropdown.vue')
                },
                {
                    path: 'page',
                    meta: {
                        name: 'page'
                    },
                    component: () => import('@/views/baseComponent/nav/page.vue')
                },
                {
                    path: 'breadcrumb',
                    meta: {
                        name: 'breadcrumb'
                    },
                    component: () => import('@/views/baseComponent/nav/breadcrumb.vue')
                },
                {
                    path: 'steps',
                    meta: {
                        name: 'steps'
                    },
                    component: () => import('@/views/baseComponent/nav/steps.vue')
                },
                {
                    path: 'loadingbar',
                    meta: {
                        name: 'loadingbar'
                    },
                    component: () => import('@/views/baseComponent/nav/loadingbar.vue')
                },
                {
                    path: 'anchor',
                    meta: {
                        name: 'anchor'
                    },
                    component: () => import('@/views/baseComponent/nav/anchor.vue')
                }
            ]
        }
    ],
    menus: [
        {
            label: "Menu 导航菜单",
            router: `${baseRouter}/menu`
        },
        {
            label: "Tabs 标签页",
            router: `${baseRouter}/tabs`
        },
        {
            label: "Dropdown 下拉菜单",
            router: `${baseRouter}/dropdown`
        },
        {
            label: "Page 分页",
            router: `${baseRouter}/page`
        },
        {
            label: "Breadcrumb 面包屑",
            router: `${baseRouter}/breadcrumb`
        },
        {
            label: "Steps 步骤条",
            router: `${baseRouter}/steps`
        },
        {
            label: "Loadingbar 加载进度条",
            router: `${baseRouter}/loadingbar`
        },
        {
            label: "Anchor 锚点",
            router: `${baseRouter}/anchor`
        }
    ]
};
//# sourceMappingURL=nav.js.map