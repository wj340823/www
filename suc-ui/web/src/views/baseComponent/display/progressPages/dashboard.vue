<template>
    <div class="line-progress">
        <suc-progress type="dashboard" :percentage="percentage" :color="colors"></suc-progress>
        <div>
            <suc-button-group>
                <suc-button :config="{icon:'ios-add'}" @on-click="increase"></suc-button>
                <suc-button :config="{icon:'ios-remove'}" @on-click="decrease"></suc-button>
            </suc-button-group>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucProgress, SucButton, SucButtonGroup} from "@suc/ui";

    @Component({
        components: {
            SucProgress,
            SucButton,
            SucButtonGroup
        }
    })
    export default class DashboardProgressDemo extends Vue {
        percentage = 60;
        colors = [
            {color: '#f56c6c', percentage: 20},
            {color: '#e6a23c', percentage: 40},
            {color: '#5cb87a', percentage: 60},
            {color: '#1989fa', percentage: 80},
            {color: '#6f7ad3', percentage: 100}
        ]

        increase() {
            this.percentage += 10;
            if (this.percentage > 100) {
                this.percentage = 100;
            }
        }

        decrease() {
            this.percentage -= 10;
            if (this.percentage < 0) {
                this.percentage = 0;
            }
        }
    }
</script>
<style lang="scss" scoped>
    .line-progress > div {
        margin-bottom: 15px;
    }
</style>
