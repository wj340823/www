<template>
    <div class="main_view">
        <top-bar></top-bar>
        <app-main></app-main>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import { TopBar, AppMain } from "./components";
    import { Route } from "vue-router";
    import {Mutation} from "vuex-class";
    import {secondMenus} from '@/router-config';
    import axios from "axios";
    import store from "@/stores";

    @Component({
        components: {TopBar, AppMain}
    })
    export default class mainView extends Vue {
        @Mutation("setSecondMenus") setMenus:any;
        @Mutation("setAnchorData") setAnchorData:any;
        beforeRouteEnter(to: Route, from: Route, next: Function) {
            next((context:any) => {
                const indexLevel:any = to.path.split("/")[2];
                const matchMenus = secondMenus[indexLevel];
                context.setMenus(matchMenus);
                return true;
            });
            // axios
            //     .get("/rest/authox/curUser")
            //     .then(res => {
            //         //一般为获取用户信息，error则未登录
            //         if (res.status === 200) {
            //             store.commit("getUserInfo", res.data);
            //             next(true);
            //         } else {
            //             next(false);
            //         }
            //     })
            //     .catch(err => {
            //         next(false);
            //     });
        }
    }
</script>
