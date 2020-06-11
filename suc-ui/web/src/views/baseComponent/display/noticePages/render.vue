<template>
    <suc-button :config="{type:'primary'}" @on-click="show()">
        打开提醒
    </suc-button>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucButton} from "@suc/ui";
    import {CreateElement, VNode} from "vue";

    @Component({
        components: {
            SucButton
        }
    })
    export default class RenderNoticeDemo extends Vue {
        show() {
            this.$SucNotice.info({
                title: '这是通知标题',
                desc: '这里是通知描述这里是通知描述',
                render: (h?:CreateElement) => {
                    if(!h){
                        return {} as VNode;
                    }
                    return h('span', [
                        'This is created by ',
                        h('a', 'render'),
                        ' function'
                    ])
                }
            });
        }
    }
</script>
<style lang="scss" scoped>

</style>
