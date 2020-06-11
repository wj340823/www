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
    import axios from "axios";
    import store from "@/stores";

    @Component({
        components: {TopBar, AppMain}
    })
    export default class mainView extends Vue {
        // beforeRouteEnter(to: Route, from: Route, next: Function) {
        //     axios
        //         .get("/rest/authox/curUser")
        //         .then(res => {
        //             //一般为获取用户信息，error则未登录
        //             if (res.status === 200) {
        //                 store.commit("setUserInfo", res.data);
        //                 next(true);
        //             } else {
        //                 next(false);
        //             }
        //         })
        //         .catch(err => {
        //             next(false);
        //         });
        // }
    }
</script>
