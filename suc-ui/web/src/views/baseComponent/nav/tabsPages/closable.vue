<template>
    <suc-tabs type="card" closable @on-tab-remove="handleTabRemove">
        <suc-tab-pane label="标签一" v-if="tab0">标签一的内容</suc-tab-pane>
        <suc-tab-pane label="标签二" v-if="tab1">标签二的内容</suc-tab-pane>
        <suc-tab-pane label="标签三" v-if="tab2">标签三的内容</suc-tab-pane>
    </suc-tabs>
</template>
<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import { SucTabs, SucTabPane } from "@suc/ui";

    @Component({
        components: {
            SucTabs, SucTabPane
        }
    })
    export default class ClosableTabsDemo extends Vue {
        tab0 = true;
        tab1 = true;
        tab2 = true;

        handleTabRemove(name: '0' | '1' | '2') {
            (this as any)[`tab${name}`] = false;
        }
    }
</script>
