<template>
    <view-page title="DatePicker 日期选择器">
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
        <demo-api type="datePicker"></demo-api>
    </view-page>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import anchorSets from "@/utils/anchor";
import components, { codes } from "./datePickerPages";
console.log(anchorSets);
@Component({
    components: {
        ...components
    }
})
export default class datePicker extends Vue {
    partsList = anchorSets.datePicker.anchor;
    codes: any[] = codes;
}
</script>
