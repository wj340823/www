<template>
    <view-page title="Divider 分割线">
        <demo-part title="实线分割线(边框同)" :code="code[0]">
            <divider-demo></divider-demo>
        </demo-part>
        <demo-part title="虚线分割线" :code="code[1]">
            <dashed-demo></dashed-demo>
        </demo-part>
    </view-page>
</template>
<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import DividerDemo from "./divider/DividerDemo.vue";
    import DividerDemoCode from "!!raw-loader!./divider/DividerDemo.vue";
    import DashedDemo from "./divider/DashedDemo.vue";
    import DashedDemoCode from "!!raw-loader!./divider/DashedDemo.vue";

    @Component({
        components: {
            DividerDemo,
            DashedDemo
        }
    })
    export default class divider extends Vue {
        code = [DividerDemoCode, DashedDemoCode]
    }
</script>
<style lang="scss" scoped>
</style>
