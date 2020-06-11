<template>
    <view-page title="Message 全局提示">
        <template v-for="(part, index) in partsList">
            <demo-part :id="part.id" :title="part.title" :desc="part.desc" :code="codes[index]">
                <component :is="part.component"></component>
            </demo-part>
        </template>

        <div class="demo-api msg-api" id="API">
            <div class="title">API</div>
            <div class="tbItem">
                <div class="header">SucMessage instance</div>
                <p>通过直接调用以下方法来使用组件：</p>
                <ul>
                    <li><code>this.$SucMessage.info(config)</code></li>
                    <li><code>this.$SucMessage.success(config)</code></li>
                    <li><code>this.$SucMessage.warning(config)</code></li>
                    <li><code>this.$SucMessage.error(config)</code></li>
                    <li><code>this.$SucMessage.loading(config)</code></li>
                </ul>
                <p>
                    以上方法隐式的创建及维护 Vue 组件。参数 config 可以是字符串或对象，当为字符串时，直接显示内容，当为对象时，
                    具体说明如下：
                </p>
                <suc-table :data="config" border style="width: 100%">
                    <suc-table-column prop="attr" label="属性" width="180"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                    <suc-table-column prop="type" label="类型" width="180"></suc-table-column>
                    <suc-table-column prop="default" label="默认值" width="180"></suc-table-column>
                </suc-table>
                <p>另外提供了全局配置和全局销毁的方法：</p>
                <ul>
                    <li><code>this.$SucMessage.config(options)</code></li>
                    <li><code>this.$SucMessage.destroy()</code></li>
                </ul>
                <br/>
                <div v-highlight>
                    <pre class="bg"><code class="javascript">
this.$SucMessage.config({
    top: 50,
    duration: 3
});
                    </code></pre>
                </div><br/>
                <suc-table :data="options" border style="width: 100%">
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
    import {Vue, Component} from "vue-property-decorator";
    import anchorSets from "@/utils/anchor";
    import {SucTable, SucTableColumn} from "@suc/ui/components/table";
    import components, {codes} from "./messagePages";

    @Component({
        components: {
            ...components,
            SucTable, SucTableColumn
        }
    })
    export default class DemoMessage extends Vue {
        codes: any[] = codes;
        partsList = anchorSets.message.anchor;
        config = [
            {
                attr: 'content',
                desc: '提示内容',
                type: 'String',
                default: '-'
            }, {
                attr: 'desc',
                desc: '辅助性文字',
                type: 'String',
                default: '-'
            }, {
                attr: 'render',
                desc: '自定义描述内容，使用 Vue 的 Render 函数',
                type: 'Function',
                default: '-'
            }, {
                attr: 'duration',
                desc: '自动关闭的延时，单位秒，不关闭可以写 0',
                type: 'Number',
                default: '1.5'
            }, {
                attr: 'onClose',
                desc: '关闭时的回调',
                type: 'Function',
                default: '-'
            }, {
                attr: 'closable',
                desc: '是否显示关闭按钮',
                type: 'Boolean',
                default: 'false'
            }
        ];
        options = [
            {
                attr: 'top',
                desc: '提示组件距离顶端的距离，单位像素',
                type: 'Number',
                default: '24'
            },
            {
                attr: 'duration',
                desc: '默认自动关闭的延时，单位秒',
                type: 'Number',
                default: '1.5'
            }
        ];
    }
</script>
<style lang="scss" scoped>

</style>
