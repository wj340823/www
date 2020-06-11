<template>
    <view-page title="Button 按钮">
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
        <demo-api type="SucButton"></demo-api>
        <demo-api type="SucButtonGroup" data-key="buttonGroup" hide-title></demo-api>
    </view-page>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import anchorSets from "@/utils/anchor";
    import components, { codes } from "./buttonPages";
    @Component({
        components: {
            ...components
        }
    })
    export default class DemoDrawer extends Vue {
        partsList = anchorSets.button.anchor;
        codes: any[] = codes;
    }
</script>
<style lang="scss" scoped>
    
</style>
