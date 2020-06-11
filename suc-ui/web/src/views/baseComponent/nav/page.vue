<template>
    <view-page title="Page 分页">
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
        <demo-api type="SucPage"></demo-api>
    </view-page>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import anchorSets from "@/utils/anchor";
import components, { codes } from "./pagePages";
@Component({
    components: {
        ...components
    }
})
export default class page extends Vue {
    partsList = anchorSets.page.anchor;
    codes: any[] = codes;
}
</script>

