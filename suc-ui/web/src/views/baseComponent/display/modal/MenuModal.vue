<template>
    <suc-modal :config="config" v-model="model" message="*此处是说明文字">
        <template slot="left">
            <suc-menu :config="menuConfig"
                      class="left-menu">
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
        </template>
        <template slot="right">
            <div class="content"></div>
        </template>
    </suc-modal>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import {
        SucButton,
        SucIcon,
        SucMenu,
        SucMenuItem,
        SucModal,
        SucSubmenu
    } from "@suc/ui";
    import { MenuConfig } from "@suc/ui/components/menu/interface";
    import { ModalConfig } from "@suc/ui/components/modal/interface";

    @Component({
        components: {
            SucModal,
            SucButton,
            SucMenu,
            SucMenuItem,
            SucSubmenu,
            SucIcon
        }
    })
    export default class MenuModal extends Vue {

        model: boolean = false;

        config: ModalConfig = {
            transfer: false,
            title: "标题",
            width: 960
        };

        menuConfig: MenuConfig = {
            activeName: '2-1',
            openNames: ['2'],
            width: 'auto'
        };

        openModal() {
            this.model = true;
        }

        closeModel() {
            this.model = false;
        }

        toggleModel() {
            this.model = !this.model;
        }
    }
</script>

<style lang="scss" scoped>
    .content {
        height: 322px;
        width: 100%;
        background-color: #eff6fc;
    }

    .left-menu {
        height: 386px;
    }
</style>
