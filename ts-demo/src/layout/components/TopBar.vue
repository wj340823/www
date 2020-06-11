<template>
    <div class="header_bar">
        <Menu
            mode="horizontal"
            theme="primary"
            :active-name="activeNav"
        >
            <MenuItem
                name="echarts"
                to="/main/echarts"
            >
            <Icon type="ios-map" />
            <span>echartsDemo</span>
            </MenuItem>
            <MenuItem
                name="map"
                to="/main/map"
            >
            <Icon type="ios-map" />
            <span>地图模块</span>
            </MenuItem>
            <MenuItem
                name="authox"
                to="authox"
            >
            <Icon type="md-settings" />
            <span>系统设置</span>
            </MenuItem>
            <Submenu name="3">
                <template slot="title">
                    <Icon type="md-person" />
                    <span>admin</span>
                </template>
                <MenuItem name="3-1">
                <span @click="logout">注销登录</span>
                </MenuItem>
            </Submenu>
        </Menu>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component
export default class topBar extends Vue {
    activeNav: string = "";
    mounted() {
        this.activeNav = this.$route.matched[1].meta.name;
    }
    logout() {
        this.$http
            .get("/logout")
            .then(res => {
                this.$router.push("/login");
            })
            .catch(err => {
                console.log(err);
            });
    }
}
</script>