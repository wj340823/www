<template>
    <suc-cascader :data="data" :config="config" v-model="selectModel"></suc-cascader>
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
    export default class CustomCascaderDemo extends Vue {
        selectModel: string[] = ['beijing', 'tiantan'];
        data:CascaderDataItem[] = [];
        config = {
            renderFormat: this.format
        }

        init() {
            let data = [
                {
                    value: 'beijing',
                    label: '北京',
                    children: [
                        {
                            value: 'gugong',
                            label: '故宫',
                            code: 310000
                        },
                        {
                            value: 'tiantan',
                            label: '天坛',
                            code: 210000
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井',
                            code: 110000
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
                                    code: 320000
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
                                    code: 220000
                                },
                                {
                                    value: 'shizilin',
                                    label: '狮子林',
                                   code: 120000
                                }
                            ]
                        }
                    ]
                }];
            this.data = data;
        }

        format(labels:string[], selectedData:any[]) {
            const index = labels.length - 1;
            const data = selectedData[index] || false;
            if (data && data.code) {
                return labels[index] + ' - ' + data.code;
            }
            return labels[index];
        }

        created() {
            this.init();
        }
    }
</script>
<style lang="scss" scoped>

</style>
