<template>
    <view-page title="Steps 步骤条">
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
        <demo-api type="SucSteps"></demo-api>
        <demo-api type="SucStep" data-key="step" hide-title></demo-api>
    </view-page>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import anchorSets from "@/utils/anchor";
    import components, { codes } from "./stepsPages";
    @Component({
        components: {
            ...components
        }
    })
    export default class DemoDrawer extends Vue {
        partsList = anchorSets.steps.anchor;
        codes: any[] = codes;
    }
</script>
<style lang="scss" scoped>
    
</style>