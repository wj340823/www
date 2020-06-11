<template>
    <suc-tabs type="card">
        <suc-tab-pane v-for="tab in tabs" :key="tab" :label="'标签' + tab">标签{{ tab }}</suc-tab-pane>
        <suc-button @on-click="handleTabsAdd" :config="{size:'small'}" slot="extra">增加</suc-button>
    </suc-tabs>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucTabs, SucTabPane, SucButton} from "@suc/ui";

    @Component({
        components: {
            SucTabs,
            SucTabPane,
            SucButton
        }
    })
    export default class ExtraTabsDemo extends Vue {
        tabs = 2;
        handleTabsAdd () {
            this.tabs ++;
        }
    }
</script>
