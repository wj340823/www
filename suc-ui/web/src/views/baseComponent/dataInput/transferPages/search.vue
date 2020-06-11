<template>
    <suc-transfer :config="config" @on-change="handleChange"></suc-transfer>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucTransfer} from "@suc/ui";
    import {TransferDataItem, TransferConfig} from "@suc/ui/components/transfer/interface";

    @Component({
        components: {
            SucTransfer
        }
    })
    export default class SearchTransferDemo extends Vue {
        config:TransferConfig = {
            data: [],
            targetKeys: [],
            renderFormat: this.render1,
            filterable: true,
            filterPlaceholder: '请输入关键字',
            notFoundText: '无数据'
        }

        getMockData () {
            let mockData = [];
            for (let i = 1; i <= 20; i++) {
                mockData.push({
                    key: i.toString(),
                    label: '条目' + i,
                    description: '条目' + i + '的描述',
                    disabled: Math.random() * 3 < 1
                });
            }
            return mockData;
        }
        getTargetKeys (data:any[]) {
            return data
                .filter(() => Math.random() * 2 > 1)
                .map(item => item.key);
        }
        render1 (item:TransferDataItem) {
            return '条目' + item.key + '<a> - </a>' + item.description;
        }
        handleChange (newTargetKeys:string[]|number[], direction:'right'|'left', moveKeys:string[]|number[]) {
            console.log(newTargetKeys, direction, moveKeys);
            this.config.targetKeys = newTargetKeys;
        }

        created() {
            this.config.data = this.getMockData();
            this.config.targetKeys = this.getTargetKeys(this.config.data);
        }
    }
</script>
