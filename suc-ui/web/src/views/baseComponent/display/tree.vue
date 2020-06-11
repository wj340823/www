<template>
    <view-page title="Tree 树形控件">
        <template v-for="(part, index) in partsList">
            <demo-part :id="part.id" :title="part.title" :code="codes[index]" :desc="part.desc">
                <component :is="part.component"></component>
            </demo-part>
        </template>

        <demo-api type="SucTree"></demo-api>
    </view-page>
</template>
<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import anchorSets from '@/utils/anchor';
    import components, { codes } from "./treePages";

    @Component({
        components: {...components}
    })
    export default class DemoTree extends Vue {
        codes: any[] = codes;
        partsList = anchorSets.tree.anchor;
    }
</script>
<style lang="scss" scoped>

</style>
