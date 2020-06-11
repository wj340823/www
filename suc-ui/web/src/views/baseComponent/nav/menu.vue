<template>
    <view-page title="Menu 导航菜单">
        <template v-for="(part, index) in partsList">
            <demo-part
                :id="part.id"
                :title="part.title"
                :desc="part.desc"
                :code="codes[index]"
                :key="index"
            >
                <component :is="part.component"></component>
            </demo-part>
        </template>
        <demo-api type="SucMenu"></demo-api>
        <demo-api type="SucMenuItem" data-key="menuItem" hide-title></demo-api>
        <demo-api type="SucSubmenu" data-key="submenu" hide-title></demo-api>
        <demo-api type="SucMenuGroup" data-key="menuGroup" hide-title></demo-api>
    </view-page>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import anchorSets from "@/utils/anchor";
    import components, { codes } from "./menuPages";
    @Component({
        components: {
            ...components
        }
    })
    export default class DemoDrawer extends Vue {
        partsList = anchorSets.menu.anchor;
        codes: any[] = codes;
    }
</script>
<style lang="scss" scoped>
   
</style>
