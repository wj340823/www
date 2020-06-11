<template>
    <div class="side-menu-container">
        <suc-menu :config="option">
            <suc-menu-item name="1">
                <suc-icon type="ios-paper"/>
                导航一
            </suc-menu-item>
            <suc-submenu name="2">
                <template slot="title">
                    <suc-icon type="ios-paper"/>
                    导航二
                </template>
                <suc-menu-item name="2-1">操作1</suc-menu-item>
                <suc-menu-item name="2-2">操作2</suc-menu-item>
                <suc-menu-item name="2-3">操作3</suc-menu-item>
            </suc-submenu>
            <suc-menu-item name="3">
                <suc-icon type="ios-paper"/>
                导航三
            </suc-menu-item>
        </suc-menu>
    </div>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import { SucIcon, SucMenu, SucMenuItem, SucSubmenu } from "@suc/ui";
    import { MenuConfig } from "@suc/ui/components/menu/interface";
    @Component({
        components: {
            SucMenu,
            SucMenuItem,
            SucSubmenu,
            SucIcon
        }
    })
    export default class SideMenu extends Vue {
        option: MenuConfig = {
            activeName:'2-1',
            openNames:['2']
        };
    }
</script>
<style lang="scss" scoped>
    .side-menu-container {
        width: 240px;
        min-height: 225px;
        margin: 18px auto 25px auto;
        background-color: #ffffff;
        border: solid 1px #dde4eb;
    }
</style>
