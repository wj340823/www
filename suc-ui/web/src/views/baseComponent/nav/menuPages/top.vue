<template>
    <div class="menu-container">
        <suc-menu :config="option">
            <suc-menu-item name="1">
                类型一
            </suc-menu-item>
            <suc-submenu name="2">
                <template slot="title">
                    类型二
                </template>
                <suc-menu-item name="2-1">操作1</suc-menu-item>
                <suc-menu-item name="2-2">操作2</suc-menu-item>
                <suc-menu-item name="2-3">操作3</suc-menu-item>
            </suc-submenu>
            <suc-menu-item name="3">
                类型三
            </suc-menu-item>
            <suc-menu-item name="4">
                类型四
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
    export default class TopMenu extends Vue {
        option: MenuConfig = {
            mode:'horizontal',
            activeName:'2-1'
        };
    }
</script>
<style lang="scss" scoped>
    .menu-container {
        width: 420px;
        height: 56px;
        margin: 20px auto 70px auto;
        background-color: #ffffff;
        box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.16);
    }
</style>
