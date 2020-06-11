export default {
    routers: [
        {
            path: 'echarts',
            meta: {
                name: 'echarts'
            },
            component: () => import('@/components/EmptyView.vue'),
            children: [
                {
                    path: '',
                    redirect: 'index',
                },
                {
                    path: 'index',
                    meta: {
                        name: 'echartsIndex'
                    },
                    component: () => import('@/views/echarts/EchartsDemo.vue')
                },
                {
                    path: 'edit',
                    meta: {
                        name: 'echartsEdit'
                    },
                    component: () => import('@/views/echarts/EchartsEdit.vue'),
                    props: (route) => ({ id: route.query.id })
                }
            ]
        }
    ]
};
//# sourceMappingURL=echarts.js.map