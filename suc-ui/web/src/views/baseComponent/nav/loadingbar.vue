<template>
    <view-page title="LoadingBar 加载进度条">
        <template v-for="(part, index) in partsList">
            <demo-part :id="part.id" :title="part.title" :desc="part.desc" :code="codes[index]">
                <component :is="part.component"></component>
            </demo-part>
        </template>

        <div class="demo-api msg-api" id="API">
            <div class="title">API</div>
            <div class="tbItem">
                <div class="header">LoadingBar instance</div>
                <p>通过直接调用以下方法来使用组件：</p>
                <ul>
                    <li><code>LoadingBar.start()</code></li>
                    <li><code>LoadingBar.finish()</code></li>
                    <li><code>LoadingBar.error()</code></li>
                    <li><code>LoadingBar.update(percent)</code></li>
                </ul>
                <p>
                    以上方法隐式的创建及维护 Vue 组件。函数及参数说明如下：
                </p>
                <suc-table :data="config" border style="width: 100%">
                    <suc-table-column prop="name" label="函数名" width="180"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                    <suc-table-column prop="attr" label="参数"></suc-table-column>
                </suc-table>
                <p>另外提供了全局配置和全局销毁的方法，全局配置方法在第一次 start 之前：</p>
                <ul>
                    <li><code>LoadingBar.config(options)</code></li>
                    <li><code>LoadingBar.destroy()</code></li>
                </ul>
                <br/>
                <div v-highlight>
                    <pre class="bg"><code class="javascript">
LoadingBar.config({
    color: '#5cb85c',
    failedColor: '#f0ad4e',
    height: 5
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
    import { Vue, Component} from "vue-property-decorator";
    import anchorSets from "@/utils/anchor";
    import {SucTable, SucTableColumn} from "@suc/ui/components/table";
    import components, {codes} from "./loadingPages";

    @Component({
        components:{
            ...components,
            SucTable, SucTableColumn
        }
    })
    export default class DemoLoadingbar extends Vue {
        codes: any[] = codes;
        partsList = anchorSets.loadingbar.anchor;

        config = [{
            name: 'start',
            desc: '开始从 0 显示进度条，并自动加载进度',
            attr: '无'
        }, {
            name: 'finish',
            desc: '结束进度条，自动补全剩余进度',
            attr: '无'
        }, {
            name: 'error',
            desc: '以错误的类型结束进度条，自动补全剩余进度',
            attr: '无'
        }, {
            name: 'update',
            desc: '精确加载到指定的进度',
            attr: 'percent，指定的进度百分比'
        }]
        options = [{
            attr: 'color',
            desc: '进度条的颜色，默认为 iView 主色',
            type: 'String',
            default: 'primary'
        }, {
            attr: 'failedColor',
            desc: '失败时的进度条颜色，默认为 iView 主色',
            type: 'String',
            default: 'error'
        }, {
            attr: 'height',
            desc: '进度条高度，单位 px',
            type: 'Number',
            default: '2'
        }, {
            attr: 'duration',
            desc: '隐藏时的持续时间，单位 ms',
            type: 'Number',
            default: '800'
        }]
    }
</script>
<style lang="scss" scoped>
</style>
