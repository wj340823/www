<template>
    <view-page class="collapse-demo" title="Collapse 折叠面板">
        <template v-for="(part, index) in partsList">
            <demo-part :id="part.id" :title="part.title" :desc="part.desc" :code="codes[index]">
                <component :is="part.component"></component>
            </demo-part>
        </template>

        <demo-api type="SucCollapse" subtype="SucPanel"></demo-api>
    </view-page>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import anchorSets from '@/utils/anchor';
    import components, {codes} from "./collapsePages";

    @Component({
        components: {...components}
    })
    export default class DemoCollapse extends Vue {
        codes: any[] = [];
        partsList = anchorSets.collapse.anchor;

        created() {
            this.codes = codes;
        }
    }
</script>
<style lang="scss" scoped>

</style>
