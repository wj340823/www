const baseRouter = "/main/baseComponent/base";
export default {
    routers: [
        {
            path: '',
            redirect: 'base',
        },
        {
            path: 'base',
            meta: {
                name: 'base'
            },
            component: () => import('@/components/EmptyView.vue'),
            children: [
                {
                    path: '',
                    redirect: 'color',
                },
                {
                    path: 'color',
                    meta: {
                        name: 'color'
                    },
                    component: () => import('@/views/baseComponent/base/color.vue')
                },
                {
                    path: 'font',
                    meta: {
                        name: 'font'
                    },
                    component: () => import('@/views/baseComponent/base/font.vue')
                },
                {
                    path: 'button',
                    meta: {
                        name: 'button'
                    },
                    component: () => import('@/views/baseComponent/base/button.vue')
                }
            ]
        }
    ],
    menus: [
        {
            label: "Color 色彩",
            router: `${baseRouter}/color`
        },
        {
            label: "Font 字体",
            router: `${baseRouter}/font`
        },
        {
            label: "Button 按钮",
            router: `${baseRouter}/button`
        }
    ]
};
//# sourceMappingURL=base.js.map