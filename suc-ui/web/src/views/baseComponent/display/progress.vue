<template>
    <view-page title="Progress 进度条">
        <template v-for="(part, index) in partsList">
            <demo-part :id="part.id" :title="part.title" :code="codes[index]">
                <component :is="part.component"></component>
            </demo-part>
        </template>

        <demo-api type="SucProgress"></demo-api>
    </view-page>
</template>
<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import anchorSets from '@/utils/anchor';
    import components, { codes } from "./progressPages";

    @Component({
        components: {...components}
    })
    export default class DemoProgress extends Vue {
        codes: any[] = codes;
        partsList = anchorSets.progress.anchor;
    }
</script>
<style lang="scss" scoped>

</style>
