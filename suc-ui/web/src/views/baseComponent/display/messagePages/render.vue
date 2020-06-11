<template>
    <suc-button :config="{type:'default'}" @on-click="show()">render函数自定义内容</suc-button>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {CreateElement, VNode} from "vue";
    import {SucButton} from "@suc/ui";

    @Component({
        components: {
            SucButton
        }
    })
    export default class RenderMessageDemo extends Vue {
        show(){
            this.$SucMessage.info({
                content: '这是一条信息提示',
                duration: 0,
                closable: true,
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
