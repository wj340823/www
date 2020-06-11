<template>
    <view-page title="Checkbox 多选框">
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
        <demo-api type="SucCheckbox"></demo-api>
        <demo-api type="SucCheckboxGroup" data-key="checkboxGroup" hide-title></demo-api>
    </view-page>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import anchorSets from "@/utils/anchor";
    import components, { codes } from "./checkboxPages";
    @Component({
        components: {
            ...components
        }
    })
    export default class DemoAlert extends Vue {
        partsList = anchorSets.checkbox.anchor;
        codes: any[] = codes;
    }
</script>
<style lang="scss" scoped>
   
</style>
