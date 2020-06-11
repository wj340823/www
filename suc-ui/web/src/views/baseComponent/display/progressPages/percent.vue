<template>
    <div class="line-progress">
        <suc-progress text-inside :stroke-width="26" :percentage="50"></suc-progress>
        <suc-progress text-inside :stroke-width="26" :percentage="100" :format="format"></suc-progress>
        <suc-progress text-inside :stroke-width="26" :percentage="100" status="success"></suc-progress>
        <suc-progress text-inside :stroke-width="26" :percentage="100" status="warning"></suc-progress>
        <suc-progress text-inside :stroke-width="26" :percentage="100" status="exception"></suc-progress>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucProgress} from "@suc/ui";

    @Component({
        components: {
            SucProgress
        }
    })
    export default class PercentProgressDemo extends Vue {
        format(percentage: number) {
            return percentage === 100 ? '满' : `${percentage}%`;
        }
    }
</script>
<style lang="scss" scoped>
    .line-progress > div {
        margin-bottom: 15px;
    }
</style>
