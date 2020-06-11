<template>
    <suc-button :config="{type:'primary'}" @on-click="show('info', false)">
        打开提醒
    </suc-button>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucButton} from "@suc/ui";

    @Component({
        components: {
            SucButton
        }
    })
    export default class TimeNoticeDemo extends Vue {
        show() {
            this.$SucNotice.info({
                title: '这是通知标题',
                desc: '这条通知不会自动关闭，需要点击关闭按钮才可以关闭。',
                duration: 0
            });
        }
    }
</script>
<style lang="scss" scoped>

</style>
