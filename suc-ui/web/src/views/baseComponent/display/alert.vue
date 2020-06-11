<template>
    <view-page title="Alert 警告提示">
        <template v-for="(part, index) in partsList">
            <demo-part :id="part.id" :title="part.title" :code="codes[index]">
                <component :is="part.component"></component>
            </demo-part>
        </template>

        <demo-api type="SucAlert"></demo-api>
    </view-page>
</template>
<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import anchorSets from '@/utils/anchor';
    import components, { codes } from "./alertPages";

    @Component({
        components: {...components}
    })
    export default class DemoAlert extends Vue {
        codes: any[] = codes;
        partsList = anchorSets.alert.anchor;
    }
</script>
<style lang="scss" scoped>

</style>
