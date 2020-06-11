<template>
    <div style="height: 100%">
        <v-chart
                :options="options"
                :autoresize="true"
                @click="handlerClick"
                style="width:50%;height:100%;display: inline-block">
        </v-chart>
        <v-chart
                :options="liquidFill"
                :autoresize="true"
                @click="handlerClick"
                style="width:50%;height:100%;display: inline-block">
        </v-chart>
    </div>
</template>
<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    // import { Injectable, Service } from "@suc/module";
    // import { TestService } from "@/utils/TestService";

    @Component
    export default class echarts extends Vue {

        // @Service(TestService)
        // private test!: TestService;

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

        liquidFill = {
            title: {
                text: '基本水球图'
            },
            series: [{
                type: 'liquidFill',
                data: [0.6]
            }]
        };

        handlerClick(params: EchartMouseEvent) {
            console.log(params)
        }
    }
</script>
<style lang="scss" scoped>
</style>
