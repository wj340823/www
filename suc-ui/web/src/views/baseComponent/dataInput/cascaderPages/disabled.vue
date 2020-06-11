<template>
    <div class="cascader-demo">
        <suc-cascader :data="data" disabled></suc-cascader>
        <suc-cascader :data="data"></suc-cascader>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucCascader} from "@suc/ui";
    import {CascaderDataItem} from "@suc/ui/components/cascader/interface";

    @Component({
        components: {
            SucCascader
        }
    })
    export default class DisabledCascaderDemo extends Vue {
        data:CascaderDataItem[] = [];

        init() {
            let data = [
                {
                    value: 'beijing',
                    label: '北京',
                    disabled: true,
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

        created() {
            this.init();
        }
    }
</script>
<style lang="scss" scoped>
    .cascader-demo .suc-cascader {
        vertical-align: middle;
        &+.suc-cascader{
            margin-left: 10px;
        }
    }
</style>
