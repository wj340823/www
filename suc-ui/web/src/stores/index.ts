import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userInfo: null,
        secondMenus:[],
    },
    mutations: {
        getUserInfo(state:any, userInfo:any) {
            state.userInfo = userInfo;
        },
        setSecondMenus(state:any, menus:any[]){
            state.secondMenus = menus;
        }
    },
    actions: {

    }
})
