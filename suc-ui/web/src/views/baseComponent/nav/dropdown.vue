<template>
    <view-page title="Dropdown 下拉菜单">
        <demo-part title="基本用法" :code="DropDownDemoCode" id="DROPDOWN">
            <normal-dropdown-demo></normal-dropdown-demo>
        </demo-part>
        <div class="demo-api msg-api" id="API">
            <div class="title">API</div>
            <div class="tbItem">
                <div class="header">
                    SucDropdown props
                </div>
                <suc-table :data="options" border style="width: 100%">
                    <suc-table-column prop="attr" label="属性" width="180"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                    <suc-table-column prop="type" label="类型" width="180"></suc-table-column>
                    <suc-table-column prop="default" label="默认值" width="180"></suc-table-column>
                </suc-table>
            </div>
            <div class="tbItem">
                <div class="header">SucDropdown events</div>
                <suc-table :data="events" border style="width: 100%">
                    <suc-table-column prop="name" label="事件名"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                    <suc-table-column prop="returnValue" label="返回值"></suc-table-column>
                </suc-table>
            </div>
            <div class="tbItem">
                <div class="header">SucDropdown slot</div>
                <suc-table :data="slots" border style="width: 100%">
                    <suc-table-column prop="name" label="名称"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                </suc-table>
            </div>
            <div class="tbItem">
                <div class="header">
                    SucDropdownItem props
                </div>
                <suc-table :data="props" border style="width: 100%">
                    <suc-table-column prop="attr" label="属性" width="180"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                    <suc-table-column prop="type" label="类型" width="180"></suc-table-column>
                    <suc-table-column prop="default" label="默认值" width="180"></suc-table-column>
                </suc-table>
            </div>
        </div>
    </view-page>
</template>
<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import NormalDropdownDemo from "./dropdown/NormalDropdownDemo.vue";
    import DropDownDemoCode from "!!raw-loader!./dropdown/NormalDropdownDemo.vue";
    import { SucTable, SucTableColumn } from "@suc/ui";
    import { ApiTableData, ApiTableEvent, ApiTableSlot } from "@/utils/interfaces";

    @Component({
        components: {
            NormalDropdownDemo,
            SucTable,
            SucTableColumn
        }
    })
    export default class dropdown extends Vue {
        DropDownDemoCode = DropDownDemoCode;
        options: ApiTableData[] = [
            {
                attr: "trigger",
                desc: '触发方式，可选值为 hover（悬停 / click（点击）/ contextMenu（右键）/ ' +
                    'custom（自定义），使用 custom 时，需配合 visible 一起使用',
                type: 'String',
                default: 'hover'
            },
            {
                attr: 'visible',
                desc: '手动控制下拉框的显示，在 trigger = \'custom\' 时使用',
                type: 'Boolean',
                default: 'false'
            },
            {
                attr: 'placement',
                desc: '下拉菜单出现的位置，可选值为top / top-start / top-end / bottom / bottom-start / ' +
                    'bottom-end / left / left-start / left-end / right / right-start / right-end,' +
                    ' 2.12.0 版本开始支持自动识别',
                type: 'String',
                default: 'bottom'
            },
            {
                attr: 'transfer',
                desc: '是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，' +
                    '它将不受父级样式影响，从而达到更好的效果',
                type: 'Boolean',
                default: 'false'
            },
            {
                attr: 'transfer-class-name',
                desc: '开启 transfer 时，给浮层添加额外的 class 名称',
                type: 'String',
                default: '-'
            },
            {
                attr: 'stop-propagation',
                desc: '是否开启 stop-propagation',
                type: 'Boolean',
                default: 'false'
            },
        ];
        events: ApiTableEvent[] = [
            {
                name: 'on-click',
                desc: '点击菜单项时触发',
                returnValue: 'DropdownItem 的 name 值'
            },
            {
                name: 'on-visible-change',
                desc: '菜单显示状态改变时调用',
                returnValue: 'visible'
            },
            {
                name: 'on-clickoutside',
                desc: '点击外部关闭下拉菜单时触发',
                returnValue: 'event'
            },
        ];
        slots: ApiTableSlot[] = [
            {
                name: '无',
                desc: '主体内容'
            },
            {
                name: 'list',
                desc: '列表内容，一般由 DropdownMenu 承担'
            }
        ];
        props: ApiTableData[] = [
            {
                attr: 'name',
                default: '用来标识这一项',
                desc: 'String',
                type: '-'
            },
            {
                attr: 'disabled',
                desc: '禁用该项',
                default: 'Boolean',
                type: 'false'
            },
            {
                attr: 'divided',
                desc: '显示分割线',
                default: 'Boolean',
                type: 'false'
            },
            {
                attr: 'selected',
                desc: '标记该项为选中状态',
                default: 'Boolean',
                type: 'false'
            },
        ]
    }
</script>
<style lang="scss" scoped>
</style>
