<template>
    <suc-button :config="{type:'default'}" @on-click="show()">
        显示加载中...
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
    export default class LoadingMessageDemo extends Vue {
        show(){
            let msg = this.$SucMessage.loading({
                content: '加载中...',
                duration: 0
            });
            setTimeout(msg, 3000);
        }
    }
</script>
<style lang="scss" scoped>

</style>
