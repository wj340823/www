<template>
    <suc-transfer :config="config" disabled></suc-transfer>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucTransfer} from "@suc/ui";
    import {TransferConfig} from "@suc/ui/components/transfer/interface";

    @Component({
        components: {
            SucTransfer
        }
    })
    export default class DisabledTransferDemo extends Vue {
        config:TransferConfig = {
            data: [],
            targetKeys: []
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

        created() {
            this.config.data = this.getMockData();
            this.config.targetKeys = this.getTargetKeys(this.config.data);
        }
    }
</script>
