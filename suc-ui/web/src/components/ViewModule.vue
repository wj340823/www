<template>
    <suc-row class="module-view">
        <suc-col span="3" class="sidebar">
            <suc-menu ref="sidebar" :config="menuConfig" style="height:100%">
                <suc-submenu v-for="(menu,index) in menus" :key="index" :name="menu.router">
                    <template slot="title">
                        {{menu.label}}
                    </template>
                    <suc-menu-item v-for="(sub,index) in menu.children" :key="index"
                                   :name="sub.router"
                                   :to="sub.router">{{sub.label}}
                    </suc-menu-item>
                </suc-submenu>
            </suc-menu>
        </suc-col>
        <suc-col span="21" class="view">
            <router-view></router-view>
        </suc-col>
    </suc-row>
</template>
<script lang="ts">
    import { Vue, Component, Watch } from "vue-property-decorator";
    import { State } from "vuex-class";
    import { SucMenu, SucMenuItem, SucSubmenu, SucRow, SucCol } from "@suc/ui";

    @Component({
        components: {
            SucRow,
            SucCol,
            SucMenu,
            SucSubmenu,
            SucMenuItem
        }
    })
    export default class ViewModule extends Vue {
        @State("secondMenus") menus: any;
        isfirst: boolean = false;
        menuConfig: any = {
            width: 'auto',
            accordion: true,
            activeName: "",
            openNames: []
        }

        menuClick(path: string) {
            this.menuConfig.activeName = path;
            this.$router.push(path);
        }

        @Watch("menus", {immediate: false})
        menuUpdate(n: any, o: any) {
            if(!n||!n.length){
                return false;
            }
            if (this.isfirst) {
                const routerPath: string = n[0] && n[0].router;
                this.initMenus(routerPath);
                return
            }
            this.isfirst = true;
        }

        @Watch("$route.path")
        activeMenu(val:string){
            this.initMenus(val);
        }

        initMenus(routerPath: string) {
            const splits: string[] = routerPath.split("/");
            this.menuConfig.activeName = routerPath;
            this.menuConfig.openNames = [splits.slice(0, splits.length - 1).join("/")];
            setTimeout(() => {
                const menuRef: any = this.$refs.sidebar;
                menuRef.updateOpened();
                menuRef.updateActiveName();
            }, 0);

        }

        mounted() {
            const routerPath: string = this.$route.path;
            this.initMenus(routerPath);
        }
    }
</script>
<style lang="scss">
    .module-view {
        /*display: flex;*/
        height: 100%;
        background: #ffffff;


        .menu-item {
            height: 48px;
            line-height: 48px;
            padding-left: 32px;
            color: #182b51;
            cursor: pointer;
            user-select: none;

            &.active {
                background-color: rgba(88, 183, 246, 0.12);
            }
        }

        .ivu-menu-item {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .ivu-row {
            height: 100%;

            > .sidebar {
                /*float: left;*/
                min-height: 100%;
                height: 100%;
                background-color: #ffffff;
                box-shadow: 0px 0px 10px 0px rgba(36, 36, 38, 0.16);
                z-index: 2;
            }

            > .view {
                height: 100%;
                overflow: hidden;
                background: #ffffff;
            }
        }
    }
</style>
