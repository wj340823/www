<template>
    <div class="notice-btns">
        <p>带描述信息</p>
        <suc-button :config="{type:'default'}" @on-click="show('info', false)">
            消息
        </suc-button>
        <suc-button :config="{type:'success'}" @on-click="show('success', false)">
            成功
        </suc-button>
        <suc-button :config="{type:'warning'}" @on-click="show('warning', false)">
            警示
        </suc-button>
        <suc-button :config="{type:'error'}" @on-click="show('error', false)">
            错误
        </suc-button>
        <p>仅标题</p>
        <suc-button :config="{type:'default'}" @on-click="show('info', true)">
            消息
        </suc-button>
        <suc-button :config="{type:'success'}" @on-click="show('success', true)">
            成功
        </suc-button>
        <suc-button :config="{type:'warning'}" @on-click="show('warning', true)">
            警示
        </suc-button>
        <suc-button :config="{type:'error'}" @on-click="show('error', true)">
            错误
        </suc-button>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucButton} from "@suc/ui";

    @Component({
        components: {
            SucButton
        }
    })
    export default class TypeNoticeDemo extends Vue {
        show(type: 'info' | 'success' | 'warning' | 'error', nodesc:boolean) {
            this.$SucNotice[type]({
                title: '这是通知标题',
                desc: nodesc ? '' : '这里是通知描述这里是通知描述'
            });
        }
    }
</script>
<style lang="scss" scoped>

</style>
