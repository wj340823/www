<template>
    <view-page title="Cascader 级联选择">
        <template v-for="(part, index) in partsList">
            <demo-part :id="part.id" :title="part.title" :desc="part.desc" :code="codes[index]">
                <component :is="part.component"></component>
            </demo-part>
        </template>

        <div class="demo-api msg-api" id="API">
            <div class="title">API</div>
            <div class="tbItem">
                <div class="header">SucCascader props</div>
                <suc-table :data="config" border style="width: 100%">
                    <suc-table-column prop="attr" label="属性" width="180"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                    <suc-table-column prop="type" label="类型" width="180"></suc-table-column>
                    <suc-table-column prop="default" label="默认值" width="180"></suc-table-column>
                </suc-table>
                <div class="interface" v-highlight>
                    <pre><code class="typescript">{{CascaderConfigCode}}</code></pre>
                </div>
            </div>
            <div class="tbItem">
                <div class="header">SucCascader events</div>
                <suc-table :data="events" border style="width: 100%">
                    <suc-table-column prop="name" label="事件名" width="180"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                    <suc-table-column prop="returnValue" label="返回值"></suc-table-column>
                </suc-table>
            </div>
            <div class="tbItem">
                <div class="header">SucCascader slot</div>
                <suc-table :data="slot" border style="width: 100%">
                    <suc-table-column prop="name" label="名称"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                </suc-table>
            </div>
        </div>
    </view-page>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import anchorSets from '@/utils/anchor';
    import components, { codes } from "./cascaderPages";
    import { SucTable, SucTableColumn } from "@suc/ui";
    //@ts-ignore
    import CascaderConfigCode from "!!raw-loader!@suc/ui/components/cascader/interface";

    @Component({
        components: {
            ...components,
            SucTable,
            SucTableColumn
        }
    })
    export default class Select extends Vue {
        codes: any[] = codes;
        partsList = anchorSets.cascader.anchor;
        CascaderConfigCode = CascaderConfigCode;
        config = [
            {
                attr: 'value',
                desc: '当前已选项的数据，格式参照示例说明',
                default: '[]',
                type: 'Array'
            },
            {
                attr: 'data',
                desc: '可选项的数据源，格式参照示例说明',
                default: '[]',
                type: 'Array'
            },
            {
                attr: 'disabled',
                desc: '是否禁用选择器',
                default: 'false',
                type: 'Boolean'
            },
            {
                attr: 'clearable',
                desc: '是否支持清除',
                default: 'true',
                type: 'Boolean'
            },
            {
                attr: 'trigger',
                desc: '次级菜单展开方式，可选值为 click 或 hover',
                default: 'click',
                type: 'String'
            },
            {
                attr: 'change-on-select',
                desc: '当此项为 true 时，点选每级菜单选项值都会发生变化，具体见上面的示例',
                default: 'false',
                type: 'Boolean'
            },
            {
                attr: 'transfer',
                desc: '是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果',
                default: 'false',
                type: 'Boolean'
            },
            {
                attr: 'filterable',
                desc: '是否支持搜索',
                default: 'false',
                type: 'Boolean'
            },
            {
                attr: 'config',
                desc: 'cascader组件的配置项具体参考interface CascaderConfig',
                default: '{}',
                type: 'CascaderConfig'
            },
        ];
        events = [{
            name: "on-change",
            desc: '选择完成后的回调，返回值 value 即已选值 value，selectedData 为已选项的具体数据\t',
            returnValue: 'value, selectedData'
        },{
            name: "on-visible-change",
            desc: '展开和关闭弹窗时触发',
            returnValue: '显示状态，Boolean'
        }]
        slot = [{
            name: "无",
            desc: "自定义显示内容，不局限于输入框"
        }]
    }

</script>
<style lang="scss">

</style>
