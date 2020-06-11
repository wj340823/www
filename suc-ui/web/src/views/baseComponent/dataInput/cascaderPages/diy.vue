<template>
    <div>
        <div>{{ text }}</div>
        <suc-cascader :data="data" @on-change="handleChange">
            <a href="javascript:void(0)">选择</a>
        </suc-cascader>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucCascader} from "@suc/ui";
    import { CascaderDataItem } from "@suc/ui/components/cascader/interface";

    @Component({
        components: {
            SucCascader
        }
    })
    export default class DiyCascaderDemo extends Vue {
        text = '未选择';
        data:CascaderDataItem[] = [];

        init() {
            let data = [
                {
                    value: 'beijing',
                    label: '北京',
                    children: [
                        {
                            value: 'gugong',
                            label: '故宫'
                        },
                        {
                            value: 'tiantan',
                            label: '天坛'
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井'
                        }
                    ]
                },
                {
                    value: 'jiangsu',
                    label: '江苏',
                    children: [
                        {
                            value: 'nanjing',
                            label: '南京',
                            children: [
                                {
                                    value: 'fuzimiao',
                                    label: '夫子庙',
                                }
                            ]
                        },
                        {
                            value: 'suzhou',
                            label: '苏州',
                            children: [
                                {
                                    value: 'zhuozhengyuan',
                                    label: '拙政园',
                                },
                                {
                                    value: 'shizilin',
                                    label: '狮子林',
                                }
                            ]
                        }
                    ]
                }];
            this.data = data;
        }

        handleChange (value:string[], selectedData:any[]) {
            this.text = selectedData.map((o:any) => o.label).join(' / ');
        }

        created() {
            this.init();
        }
    }
</script>
<style lang="scss" scoped>

</style>
