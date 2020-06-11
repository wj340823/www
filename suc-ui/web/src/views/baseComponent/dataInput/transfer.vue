<template>
    <view-page title="Transfer 穿梭框">
        <template v-for="(part, index) in partsList">
            <demo-part :id="part.id" :title="part.title" :desc="part.desc" :code="codes[index]">
                <component :is="part.component"></component>
            </demo-part>
        </template>

        <div class="demo-api msg-api" id="API">
            <div class="title">API</div>
            <div class="tbItem">
                <div class="header">SucTransfer props</div>
                <suc-table :data="config" border style="width: 100%">
                    <suc-table-column prop="attr" label="属性" width="180"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                    <suc-table-column prop="type" label="类型" width="180"></suc-table-column>
                    <suc-table-column prop="default" label="默认值" width="180"></suc-table-column>
                </suc-table>
                <div class="interface" v-highlight>
                    <pre><code class="typescript">{{TransferConfigCode}}</code></pre>
                </div>
            </div>
            <div class="tbItem">
                <div class="header">SucTransfer events</div>
                <suc-table :data="events" border style="width: 100%">
                    <suc-table-column prop="name" label="事件名" width="180"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                    <suc-table-column prop="returnValue" label="返回值"></suc-table-column>
                </suc-table>
            </div>
            <div class="tbItem">
                <div class="header">SucTransfer slot</div>
                <suc-table :data="slot" border style="width: 100%">
                    <suc-table-column prop="name" label="名称"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                </suc-table>
            </div>
        </div>
    </view-page>
</template>
<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import anchorSets from '@/utils/anchor';
    import components, { codes } from "./transferPages";
    import { SucTable, SucTableColumn } from "@suc/ui";
    //@ts-ignore
    import TransferConfigCode from "!!raw-loader!@suc/ui/components/transfer/interface";

    @Component({
        components: {
            ...components,
            SucTable,
            SucTableColumn
        }
    })
    export default class DemoTransfer extends Vue {
        codes: any[] = codes;
        partsList = anchorSets.transfer.anchor;
        TransferConfigCode = TransferConfigCode;
        config = [
            {
                attr: 'config',
                desc: 'transfer组件的配置项具体参考interface TransferConfig',
                default: '{}',
                type: 'TransferConfig'
            },
            {
                attr: 'disabled',
                desc: '组件的禁用状态',
                default: 'false',
                type: 'Boolean'
            },
        ];
        events = [{
            name: "on-change",
            desc: '选项在两栏之间转移时的回调函数',
            returnValue: 'targetKeys, direction, moveKeys'
        },{
            name: "on-selected-change",
            desc: '选中项发生变化时触发',
            returnValue: 'sourceSelectedKeys, targetSelectedKeys'
        }]
        slot = [{
            name: "无",
            desc: "自定义底部内容"
        }]
    }
</script>
<style lang="scss" scoped>

</style>
