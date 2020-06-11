<template>
    <div class="notice-btns">
        <suc-button type="primary" @on-click="open(false)">打开提醒</suc-button>
        <suc-button @on-click="open(true)">打开提醒(仅标题)</suc-button>
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
    export default class BasicNoticeDemo extends Vue {
        open (nodesc:boolean) {
            this.$SucNotice.open({
                title: '这是通知标题',
                desc: nodesc ? '' : '这里是通知描述这里是通知描述'
            });
        }
    }
</script>
<style lang="scss" scoped>

</style>
