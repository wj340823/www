<template>
    <div class="echarts-outer">
        <suc-row :gutter="16">
            <template v-for="item in list">
                <suc-col span="6" :key="item.name">
                    <div class="demo-list" @click="go(item.options)">
                        <div class="demo-img"><img :src="item.img"/></div>
                        <div class="demo-name"><span>{{item.name}}</span></div>
                    </div>
                </suc-col>
            </template>
        </suc-row>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucRow, SucCol} from "@suc/ui";
    import {LIST, ListItem} from "@/utils/echarts";

    @Component({
        components: {
            SucRow, SucCol
        }
    })
    export default class DemoEcharts extends Vue {
        list: ListItem[] = [];

        go(params: string) {
            this.$router.push({path: `/main/echarts/edit`, query: {id: params}})
        }

        created() {
            this.list = LIST.map((l: ListItem) => {
                let item = Object.assign({}, l);
                item.img = require('@/assets/echarts/' + l.img);
                return item;
            })
        }
    }

</script>
<style lang="scss" scoped>
    @import "~@suc/ui/styles/variables";

    .echarts-outer {
        padding: 20px;
        height: 100%;

        .demo-list {
            position: relative;
            height: 392px;
            padding: 10px;
            background: #f3f3f3;
            border: 1px solid $theme-border-color;
            cursor: pointer;

            .demo-img {
                background: white;

                img {
                    width: 100%;
                }
            }

            .demo-name {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 30px;
                text-align: center;
                font-size: 16px;
                color: $theme-text-primary;
            }
        }
    }
</style>