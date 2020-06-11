<template>
    <suc-transfer :config="config" @on-change="handleChange1"></suc-transfer>
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
    export default class BasicTransferDemo extends Vue {
        config:TransferConfig = {
            data: [],
            targetKeys: [],
            renderFormat: this.render1
        }

        getMockData () {
            let mockData = [];
            for (let i = 1; i <= 20; i++) {
                mockData.push({
                    key: i.toString(),
                    label: '条目 ' + i,
                    description: 'The desc of content  ' + i
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
            return item.label;
        }
        handleChange1 (newTargetKeys:string[]|number[], direction:'right'|'left', moveKeys:string[]|number[]) {
            console.log(newTargetKeys);
            console.log(direction);
            console.log(moveKeys);
            this.config.targetKeys = newTargetKeys;
        }

        created() {
            this.config.data = this.getMockData();
            this.config.targetKeys = this.getTargetKeys(this.config.data);
        }
    }
</script>
