<template>
    <view-page title="Tabs 标签页">
        <template v-for="(part, index) in partsList">
            <demo-part :id="part.id" :title="part.title" :desc="part.desc" :code="codes[index]">
                <component :is="part.component"></component>
            </demo-part>
        </template>

        <demo-api type="SucTabs" subtype="SucTabPane"></demo-api>
    </view-page>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import anchorSets from '@/utils/anchor';
    import components, {codes} from "./tabsPages";

    @Component({
        components: {...components}
    })
    export default class DemoTabs extends Vue {
        codes: any[] = codes;
        partsList = anchorSets.tabs.anchor;
    }
</script>
<style lang="scss" scoped>

</style>
