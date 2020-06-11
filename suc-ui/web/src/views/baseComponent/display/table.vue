<template>
    <view-page title="Table 表格">
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
        <demo-api
            type="SucTable"
            subtype="SucTableColumn"
        ></demo-api>
    </view-page>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import anchorSets from "@/utils/anchor";
import components, { codes } from "./tablePages";
@Component({
    components: {
        ...components
    }
})
export default class DemoTable extends Vue {
    partsList = anchorSets.table.anchor;
    codes: any[] = codes;
}
</script>
