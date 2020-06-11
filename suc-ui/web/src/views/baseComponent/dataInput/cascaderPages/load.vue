<template>
    <suc-cascader :data="data" :config="config"></suc-cascader>
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
    export default class LoadCascaderDemo extends Vue {
        data:CascaderDataItem[] = [];
        config = {
            loadData : this.loadData
        }

        init() {
            let data = [
                {
                    value: 'beijing',
                    label: '北京',
                    children: [],
                    loading:false
                },
                {
                    value: 'hangzhou',
                    label: '杭州',
                    children: [],
                    loading:false
                }];
            this.data = data;
        }

        loadData(item:CascaderDataItem, callback:Function) {
            item.loading = true;
            setTimeout(() => {
                if (item.value === 'beijing') {
                    item.children = [
                        {
                            value: 'talkingdata',
                            label: 'TalkingData'
                        },
                        {
                            value: 'baidu',
                            label: '百度'
                        },
                        {
                            value: 'sina',
                            label: '新浪'
                        }
                    ];
                } else if (item.value === 'hangzhou') {
                    item.children = [
                        {
                            value: 'ali',
                            label: '阿里巴巴'
                        },
                        {
                            value: '163',
                            label: '网易'
                        }
                    ];
                }
                item.loading = false;
                callback();
            }, 1000);
        }

        created() {
            this.init();
        }
    }
</script>
