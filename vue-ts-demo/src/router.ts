import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '',
            redirect: '/main',
        },
        {
            path: '/login',
            component: () => import('./views/Login.vue'),
        },
        { //懒加载
            path: '/main',
            component: () => import('./layout/Main.vue'),
            children: [
                {
                    path: '',
                    redirect: 'authox',
                },
                {
                    path: 'authox',
                    meta: {
                        name: 'authox'
                    },
                    component: () => import('@suc/authox/authox.vue'),
                    children: [
                        {
                            path: '',
                            redirect: 'user',
                        },
                        {
                            path: 'user',
                            meta: {
                                name: 'user'
                            },
                            component: () => import('@suc/authox/pages/user.vue'),
                            children: [
                                {
                                    path: '',
                                    redirect: 'userList',
                                },
                                {
                                    path: 'userList',
                                    component: () => import('@suc/authox/pages/user/userList.vue')
                                },
                                {
                                    path: 'userEdit',
                                    component: () => import('@suc/authox/pages/user/userEdit.vue')
                                }
                            ]
                        },
                        {
                            path: 'group',
                            meta: {
                                name: 'group'
                            },
                            component: () => import('@suc/authox/pages/group.vue'),
                            children: [
                                {
                                    path: '',
                                    redirect: 'groupList',
                                },
                                {
                                    path: 'groupList',
                                    component: () => import('@suc/authox/pages/group/groupList.vue')
                                },
                                {
                                    path: 'groupEdit',
                                    component: () => import('@suc/authox/pages/group/groupEdit.vue')
                                }
                            ]
                        },
                        {
                            path: 'role',
                            meta: {
                                name: 'role'
                            },
                            component: () => import('@suc/authox/pages/role.vue'),
                            children: [
                                {
                                    path: '',
                                    redirect: 'roleList',
                                },
                                {
                                    path: 'roleList',
                                    component: () => import('@suc/authox/pages/role/roleList.vue')
                                },
                                {
                                    path: 'roleEdit',
                                    component: () => import('@suc/authox/pages/role/roleEdit.vue')
                                }
                            ]
                        }
                    ]
                },
                {
                    path: 'map',
                    meta: {
                        name: 'map'
                    },
                    component: () => import('./views/Map.vue'),
                },
                {
                    path: 'echarts',
                    meta: {
                        name: 'echarts'
                    },
                    component: () => import('./views/Echarts.vue'),
                },
                {
                    path: 'vuex',
                    name: 'vuex',
                    meta: {
                        name: 'vuex'
                    },
                    component: () => import('./views/Vuex.vue')
                }
            ]
        }
    ]
});
