<template>
    <view-page title="Radio 单选框">
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
        <demo-api type="SucRadio"></demo-api>
        <demo-api type="SucRadioGroup" data-key="radioGroup" hide-title></demo-api>
    </view-page>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import anchorSets from "@/utils/anchor";
    import components, { codes } from "./radioPages";
    @Component({
        components: {
            ...components
        }
    })
    export default class DemoRadio extends Vue {
        partsList = anchorSets.radio.anchor;
        codes: any[] = codes;
    }
</script>
<style lang="scss" scoped>
    
</style>
