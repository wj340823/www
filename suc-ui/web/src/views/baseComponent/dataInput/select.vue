<template>
    <view-page title="Select 选择器">
        <demo-part title="基本用法" id="SELECTDEMO" :code="code">
            <div class="form-demo">
                <select-demo></select-demo>
            </div>
        </demo-part>
        <div class="demo-api msg-api" id="API">
            <div class="title">API</div>
            <div class="tbItem">
                <div class="header">SucSelect props</div>
                <suc-table :data="config" border style="width: 100%">
                    <suc-table-column prop="attr" label="属性" width="180"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                    <suc-table-column prop="type" label="类型" width="180"></suc-table-column>
                    <suc-table-column prop="default" label="默认值" width="180"></suc-table-column>
                </suc-table>
                <div class="interface" v-highlight>
                    <pre><code class="typescript">{{SelectConfig}}</code></pre>
                </div>
                <div class="interface" v-highlight>
                    <pre><code class="typescript">{{SelectOption}}</code></pre>
                </div>
            </div>
            <div class="tbItem">
                <div class="header">SucSelect events</div>
                <suc-table :data="events" border style="width: 100%">
                    <suc-table-column prop="name" label="事件名"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                    <suc-table-column prop="returnValue" label="返回值"></suc-table-column>
                </suc-table>
            </div>
            <div class="tbItem">
                <div class="header">SucSelect methods</div>
                <suc-table :data="methods" border style="width: 100%">
                    <suc-table-column prop="name" label="名称"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                    <suc-table-column prop="arg" label="参数"></suc-table-column>
                </suc-table>
            </div>
        </div>
    </view-page>
</template>
<script lang="ts">
    import { Prop, Vue, Component } from "vue-property-decorator";
    import SelectDemo from "./select/SelectDemo.vue";
    import SelectDemoCode from "!!raw-loader!./select/SelectDemo.vue";
    import { SucTable, SucTableColumn } from "@suc/ui";
    import { ApiTableData, ApiTableEvent, ApiTableSlot } from "@/utils/interfaces";
    //@ts-ignore
    import SelectConfig from '!!raw-loader!@suc/ui/components/select/SelectConfig';
    //@ts-ignore
    import SelectOption from '!!raw-loader!@suc/ui/components/select/SelectOption';

    @Component({
        components: {
            SelectDemo,
            SucTable,
            SucTableColumn
        }
    })
    export default class Select extends Vue {
        SelectOption = SelectOption;
        SelectConfig = SelectConfig;
        code = SelectDemoCode;
        config: ApiTableData[] = [
            {
                attr: 'value',
                desc: '指定选中项目的 value 值，可以使用 v-model 双向绑定数据。单选时只接受 String 或 Number，多选时只接受 Array',
                default: '空',
                type: 'String | Number | Array'
            },
            {
                attr: 'config',
                default: '{}',
                type: 'SelectConfig',
                desc: 'select组件的配置项具体参考interface SelectConfig'
            },
            {
                attr: 'options',
                desc: 'option的配置项,不使用插槽.配置项参考interface SelectOption',
                default: '[]',
                type: "SelectOption[] | SelectOptions"
            }
        ];
        slots: ApiTableSlot[] = [];
        events: ApiTableEvent[] = [
            {
                name: "on-change",
                desc: `选中的Option变化时触发，默认返回 value，如需返回 label，详见 config['label-in-value'] 属性`,
                returnValue: '当前选中项'
            },
            {
                name: "on-query-change",
                desc: "搜索词改变时触发",
                returnValue: "query"
            },
            {
                name: "on-clear",
                desc: "点击清空按钮时触发",
                returnValue: "无"
            },
            {
                name: "on-open-change",
                desc: "下拉框展开或收起时触发",
                returnValue: "true / false"
            },
        ];
        methods = [
            {
                name: 'setQuery',
                desc: '设置搜索词，为空时清空，仅在 config.filterable="true" 时有效',
                arg: 'query'
            },
            {
                name: 'clearSingleSelect',
                desc: '清空单选项，仅在 config.clearable="true" 时有效',
                arg: '无'
            },
        ]
    }
</script>
<style lang="scss" scoped>
    .form-demo {
        width: 100%;
        height: 245px;
        position: relative;
    }
</style>
