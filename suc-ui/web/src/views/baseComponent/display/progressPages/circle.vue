<template>
    <div class="circle-progress">
        <div>
            <div>
                <suc-progress type="circle" :percentage="10" :width="63"></suc-progress>
            </div>
            <div>
                <suc-progress type="circle" :percentage="25" :stroke-width="20"></suc-progress>
            </div>
        </div>
        <div class="scdline">
            <div>
                <suc-progress type="circle" :percentage="70" status="success"></suc-progress>
            </div>
            <div>
                <suc-progress type="circle" :percentage="100" status="warning"></suc-progress>
            </div>
            <div>
                <suc-progress type="circle" :percentage="60" status="exception"></suc-progress>
            </div>
        </div>
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
    export default class CircleProgressDemo extends Vue {

    }
</script>
<style lang="scss" scoped>
    .circle-progress {
        .scdline {
            margin-top: 15px;
        }

        > div > div {
            display: inline-block;
            width: 126px;
            margin-left: 20px;
            text-align: center;
        }
    }
</style>
