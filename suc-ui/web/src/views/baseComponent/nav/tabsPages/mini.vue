<template>
    <suc-tabs size="small">
        <suc-tab-pane label="macOS">标签一的内容</suc-tab-pane>
        <suc-tab-pane label="Windows">标签二的内容</suc-tab-pane>
        <suc-tab-pane label="Linux">标签三的内容</suc-tab-pane>
    </suc-tabs>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucTabs, SucTabPane} from "@suc/ui";

    @Component({
        components: {
            SucTabs, SucTabPane
        }
    })
    export default class MiniTabsDemo extends Vue {

    }
</script>
<style lang="scss" scoped>

</style>
