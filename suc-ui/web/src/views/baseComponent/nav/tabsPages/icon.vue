<template>
    <suc-tabs>
        <suc-tab-pane label="macOS" icon="logo-apple">标签一的内容</suc-tab-pane>
        <suc-tab-pane label="Windows" icon="logo-windows">标签二的内容</suc-tab-pane>
        <suc-tab-pane label="Linux" icon="logo-tux">标签三的内容</suc-tab-pane>
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
    export default class IconTabsDemo extends Vue {

    }
</script>
<style lang="scss" scoped>

</style>
