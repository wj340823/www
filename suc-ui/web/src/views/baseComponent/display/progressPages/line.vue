<template>
    <div class="line-progress">
        <suc-progress :percentage="50"></suc-progress>
        <suc-progress :percentage="100" :format="format"></suc-progress>
        <suc-progress :percentage="100" status="success"></suc-progress>
        <suc-progress :percentage="100" status="warning"></suc-progress>
        <suc-progress :percentage="100" status="exception"></suc-progress>
        <suc-progress :percentage="70" :show-text="false"></suc-progress>
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
    export default class LineProgressDemo extends Vue {
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
