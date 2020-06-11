import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '',
        redirect: '/main',
    }, {
        path: '/login',
        component: () =>
            import('./views/Login.vue'),
    }, { //懒加载
        path: '/main',
        component: () =>
            import('./layout/Main.vue'),
        children: [{
            path: '',
            redirect: 'map',
        }, {
            path: 'map',
            meta: {
                name: 'map'
            },
            component: () =>
                import('./views/Map.vue'),
        }, {
            path: 'echarts',
            meta: {
                name: 'echarts'
            },
            component: () =>
                import('./views/Echarts.vue'),
        }]
    }]
})
