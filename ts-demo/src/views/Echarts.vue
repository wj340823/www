<template>
    <v-chart
        :options="options"
        :autoresize="true"
        style="width:100%;height:100%;"
    />
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component
export default class echarts extends Vue {
    options = {
        title: {
            text: "ECharts 入门示例"
        },
        tooltip: {},
        xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [
            {
                name: "销量",
                type: "bar",
                data: [5, 20, 36, 10, 10, 20]
            }
        ]
    };
}
</script>
<style lang="scss" scoped>
</style>