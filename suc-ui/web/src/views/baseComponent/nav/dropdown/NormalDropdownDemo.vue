<template>
    <div>
        <suc-dropdown class="demo-dropdown" :transfer="true">
            <a href="javascript:void(0)">
                默认
                <suc-icon type="ios-arrow-down"></suc-icon>
            </a>
            <suc-dropdown-menu slot="list">
                <suc-dropdown-item>操作一</suc-dropdown-item>
                <suc-dropdown-item>操作二</suc-dropdown-item>
                <suc-dropdown-item disabled>操作三</suc-dropdown-item>
            </suc-dropdown-menu>
        </suc-dropdown>
        <suc-dropdown class="demo-dropdown"
                      :transfer="true"
                      trigger="click" type="bubble">
            <suc-button :config="{type:'primary'}">
                气泡样式
                <suc-icon type="ios-arrow-down"></suc-icon>
            </suc-button>
            <suc-dropdown-menu slot="list">
                <suc-dropdown-item>操作一</suc-dropdown-item>
                <suc-dropdown-item>操作二</suc-dropdown-item>
                <suc-dropdown-item disabled>操作三</suc-dropdown-item>
            </suc-dropdown-menu>
        </suc-dropdown>
    </div>
</template>
<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import { SucDropdown, SucIcon, SucDropdownItem, SucDropdownMenu, SucButton } from "@suc/ui";

    @Component({
        components: {
            SucDropdown,
            SucDropdownItem,
            SucDropdownMenu,
            SucIcon,
            SucButton
        }
    })
    export default class NormalDropdownDemo extends Vue {

    }
</script>
<style lang="scss" scoped>
    .demo-dropdown {
        margin-right: 20px;
    }
</style>
