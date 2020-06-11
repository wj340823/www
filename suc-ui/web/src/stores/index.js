import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        userInfo: null,
        secondMenus: [],
    },
    mutations: {
        getUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
        setSecondMenus(state, menus) {
            state.secondMenus = menus;
        }
    },
    actions: {}
});
//# sourceMappingURL=index.js.map