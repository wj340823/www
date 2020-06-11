<template>
    <suc-tabs>
        <suc-tab-pane label="标签一">标签一的内容</suc-tab-pane>
        <suc-tab-pane label="标签二" disabled>标签二的内容</suc-tab-pane>
        <suc-tab-pane label="标签三">标签三的内容</suc-tab-pane>
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
    export default class DisabledTabsDemo extends Vue {

    }
</script>
