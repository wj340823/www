<template>
    <suc-transfer :config="config" @on-change="handleChange">
        <div :style="{float: 'right', margin: '5px'}">
            <suc-button size="small" @click="reloadMockData">刷新</suc-button>
        </div>
    </suc-transfer>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucTransfer, SucButton} from "@suc/ui";
    import {TransferConfig} from "@suc/ui/components/transfer/interface";

    @Component({
        components: {
            SucTransfer,
            SucButton
        }
    })
    export default class MoreTransferDemo extends Vue {
        config:TransferConfig = {
            data: [],
            targetKeys: [],
            listStyle: {
                width: '250px',
                height: '300px'
            },
            operations: ['向左','向右']
        }

        getMockData () {
            let mockData = [];
            for (let i = 1; i <= 20; i++) {
                mockData.push({
                    key: i.toString(),
                    label: 'Content ' + i,
                    description: 'The desc of content  ' + i,
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
        handleChange (newTargetKeys:string[]|number[], direction:'right'|'left', moveKeys:string[]|number[]) {
            this.config.targetKeys = newTargetKeys;
        }
        reloadMockData() {
            this.config.data = this.getMockData();
            this.config.targetKeys = this.getTargetKeys(this.config.data);
        }

        created() {
            this.reloadMockData();
        }
    }
</script>
