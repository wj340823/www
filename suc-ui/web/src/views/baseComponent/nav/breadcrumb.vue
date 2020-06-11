<template>
    <view-page title="Breadcrumb 面包屑">
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
        <demo-api type="SucBreadcrumb"></demo-api>
        <demo-api type="SucBreadcrumbItem" data-key="breadcrumbItem" hide-title></demo-api>
    </view-page>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import anchorSets from "@/utils/anchor";
    import components, { codes } from "./breadcrumbPages";
    @Component({
        components: {
            ...components
        }
    })
    export default class DemoDrawer extends Vue {
        partsList = anchorSets.breadcrumb.anchor;
        codes: any[] = codes;
    }
</script>
<style lang="scss" scoped>
   
</style>