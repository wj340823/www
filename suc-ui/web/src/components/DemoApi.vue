<template>
    <div class="demo-api" id="API">
        <div class="title" v-show="!hideTitle">API</div>
        <div class="tbItem" v-if="apiData.props&&apiData.props.length">
            <div class="header" id="component_props">{{type}} props</div>
            <suc-table :data="apiData.props" border style="width: 100%">
                <suc-table-column prop="attr" label="属性" width="180"></suc-table-column>
                <suc-table-column prop="desc" label="说明"></suc-table-column>
                <suc-table-column prop="type" label="类型" width="180"></suc-table-column>
                <suc-table-column prop="default" label="默认值" width="180"></suc-table-column>
            </suc-table>
            <div class="interface" v-highlight v-for="(item,index) in apiData.interfaces" :key="index">
                <pre><code class="typescript">{{item.text}}</code></pre>
            </div>
        </div>
        <div class="tbItem" v-if="apiData.events&&apiData.events.length">
            <div class="header" id="component_events">{{type}} events</div>
            <suc-table :data="apiData.events" border style="width: 100%">
                <suc-table-column prop="name" label="事件名" width="180"></suc-table-column>
                <suc-table-column prop="desc" label="说明"></suc-table-column>
                <suc-table-column prop="returnValue" label="返回值" width="180" v-if="apiData.events[0].returnValue"></suc-table-column>
                <suc-table-column prop="params" label="回调参数" width="600" v-else></suc-table-column>
            </suc-table>
        </div>
        <div class="tbItem" v-if="apiData.slot&&apiData.slot.length">
            <div class="header" id="component_slot">{{type}} slot</div>
            <suc-table :data="apiData.slot" border style="width: 100%">
                <suc-table-column prop="name" label="名称"></suc-table-column>
                <suc-table-column prop="desc" label="说明"></suc-table-column>
            </suc-table>
        </div>
        <div class="tbItem" v-if="apiData.methods&&apiData.methods.length">
            <div class="header" id="component_methods">{{type}} methods</div>
            <suc-table :data="apiData.methods" border style="width: 100%">
                <suc-table-column prop="name" label="名称" width="180"></suc-table-column>
                <suc-table-column prop="desc" label="说明"></suc-table-column>
                <suc-table-column prop="params" label="参数" width="180"></suc-table-column>
            </suc-table>
        </div>
        <div class="tbItem" v-if="apiData.subProps&&apiData.subProps.length">
            <div class="header" id="component_subprops">{{subtype}} props</div>
            <suc-table :data="apiData.subProps" border style="width: 100%">
                <suc-table-column prop="attr" label="属性" width="180"></suc-table-column>
                <suc-table-column prop="desc" label="说明"></suc-table-column>
                <suc-table-column prop="type" label="类型" width="180"></suc-table-column>
                <suc-table-column prop="default" label="默认值" width="180"></suc-table-column>
            </suc-table>
        </div>
        <div class="tbItem" v-if="apiData.subSlot&&apiData.subSlot.length">
            <div class="header" id="component_subslot">{{subtype}} slot</div>
            <suc-table :data="apiData.subSlot" border style="width: 100%">
                <suc-table-column prop="name" label="名称"></suc-table-column>
                <suc-table-column prop="desc" label="说明"></suc-table-column>
            </suc-table>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {State} from "vuex-class";
    import anchorSets from '@/utils/anchor';
    import {SucTable, SucTableColumn} from "@suc/ui/components/table";

    @Component({
        components: {
            SucTable,
            SucTableColumn
        }
    })
    export default class DemoApi extends Vue {
        @State anchorData!: any;
        @Prop(String) type!: string;
        @Prop(String) subtype?: string;
        @Prop(String) dataKey!: string;
        @Prop(Boolean) hideTitle!: boolean;
        get apiData() {
            let dataKey:string = this.dataKey || this.$route.path.split("/")[4];
            let result = anchorSets[dataKey];
            if (!result) {
                return {};
            }
            return result.api;
        }
    }
</script>
<style lang="scss">
    .demo-api {
        color: #182b51;
        .title {
            position: relative;
            padding: 10px 0;
            font-size: 20px;
            font-weight: bold;
        }

        .tbItem {
            margin-bottom: 40px;
            .header {
                padding-bottom: 10px;
                font-size: 16px;
            }
        }
    }
</style>
