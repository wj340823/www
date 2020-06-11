<template>
    <suc-tabs value="name1">
        <suc-tab-pane :label="label" name="name1">标签一的内容</suc-tab-pane>
        <suc-tab-pane label="标签二" name="name2">标签二的内容</suc-tab-pane>
        <suc-tab-pane label="标签三" name="name3">标签三的内容</suc-tab-pane>
    </suc-tabs>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucTabs, SucTabPane} from "@suc/ui";
    import {CreateElement, VNode} from "vue";

    @Component({
        components: {
            SucTabs, SucTabPane
        }
    })
    export default class RenderTabsDemo extends Vue {
        label = (h?:CreateElement) => {
            if(!h){
                return {} as VNode;
            }
            return h('div', [
                h('span', '标签一 '),
                h('i', {
                    class: 'iconfont iconbiaoji'
                })
            ])
        }
    }
</script>
