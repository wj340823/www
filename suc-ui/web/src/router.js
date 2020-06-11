import Vue from 'vue';
import Router from 'vue-router';
import { routers } from './router-config';
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '',
            redirect: '/main',
        },
        {
            path: '/main',
            component: () => import('./layout/Main.vue'),
            children: [...routers]
        }
    ]
});
//# sourceMappingURL=router.js.map