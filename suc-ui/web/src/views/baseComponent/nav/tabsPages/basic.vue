<template>
    <suc-tabs value="name2">
        <suc-tab-pane label="标签一" name="name1">标签一的内容</suc-tab-pane>
        <suc-tab-pane label="标签二" name="name2">标签二的内容</suc-tab-pane>
        <suc-tab-pane label="标签三" name="name3">标签三的内容</suc-tab-pane>
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
    export default class BasicTabsDemo extends Vue {

    }
</script>
