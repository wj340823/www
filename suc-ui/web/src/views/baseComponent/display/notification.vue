<template>
    <view-page title="Notice 通知提醒">
        <template v-for="(part, index) in partsList">
            <demo-part :id="part.id" :title="part.title" :code="codes[index]">
                <component :is="part.component"></component>
            </demo-part>
        </template>

        <div class="demo-api msg-api" id="API">
            <div class="title">API</div>
            <div class="tbItem">
                <div class="header">SucNotice instance</div>
                <p>通过直接调用以下方法来使用组件：</p>
                <ul>
                    <li><code>this.$SucNotice.open(config)</code></li>
                    <li><code>this.$SucNotice.info(config)</code></li>
                    <li><code>this.$SucNotice.success(config)</code></li>
                    <li><code>this.$SucNotice.warning(config)</code></li>
                    <li><code>this.$SucNotice.error(config)</code></li>
                </ul>
                <p>
                    以上方法隐式的创建及维护 Vue 组件。参数 config 为对象，具体说明如下：
                </p>
                <suc-table :data="config" border style="width: 100%">
                    <suc-table-column prop="attr" label="属性" width="180"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                    <suc-table-column prop="type" label="类型" width="180"></suc-table-column>
                    <suc-table-column prop="default" label="默认值" width="180"></suc-table-column>
                </suc-table>
                <br/>
                <p>另外提供了全局配置、全局关闭某个通知和全局销毁的方法：</p>
                <ul>
                    <li><code>this.$SucNotice.config(options)</code></li>
                    <li><code>this.$SucNotice.close(name)</code></li>
                    <li><code>this.$SucNotice.destroy()</code></li>
                </ul>
                <br/>
                <div v-highlight>
                    <pre class="bg"><code class="javascript">
this.$SucNotice.config({
    top: 50,
    duration: 3
});
                    </code></pre>
                </div>
                <br/>
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
    import anchorSets from '@/utils/anchor';
    import components, {codes} from "./noticePages";
    import {SucTable, SucTableColumn} from "@suc/ui/components/table";

    @Component({
        components: {
            ...components,
            SucTable, SucTableColumn
        }
    })
    export default class DemoNotice extends Vue {
        codes: any[] = codes;
        partsList = anchorSets.notification.anchor;
        config = [
            {
                attr: 'title',
                desc: '通知提醒的标题',
                type: 'String',
                default: '-'
            }, {
                attr: 'desc',
                desc: '通知提醒的内容，为空或不填时，自动应用仅标题模式下的样式',
                type: 'String',
                default: '-'
            }, {
                attr: 'render',
                desc: '自定义描述内容，使用 Vue 的 Render 函数，如果同时设置了 render 和 desc，则只显示 render 的内容',
                type: 'Function',
                default: '-'
            }, {
                attr: 'duration',
                desc: '自动关闭的延时，单位秒，不关闭可以写 0',
                type: 'Number',
                default: '4.5'
            }, {
                attr: 'name',
                desc: '当前通知的唯一标识',
                type: 'String',
                default: '自动'
            }, {
                attr: 'onClose',
                desc: '关闭时的回调',
                type: 'Function',
                default: '-'
            }
        ];
        options = [
            {
                attr: 'top',
                desc: '通知组件距离顶端的距离，单位像素',
                type: 'Number',
                default: '24'
            },
            {
                attr: 'duration',
                desc: '默认自动关闭的延时，单位秒',
                type: 'Number',
                default: '4.5'
            }
        ];
    }
</script>
<style lang="scss">
    .notice-btns {
        >.suc-button {
            margin-right: 10px;
        }

        p {
            margin: 5px;
            font-size: 14px;
        }
    }
</style>
