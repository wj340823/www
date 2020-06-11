<template>
    <suc-button :config="{type:'default'}" @on-click="show()">可手动关闭</suc-button>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucButton} from "@suc/ui";

    @Component({
        components: {
            SucButton
        }
    })
    export default class ClosableMessageDemo extends Vue {
        show(){
            this.$SucMessage.info({
                content: '我是一个可手动关闭的提示',
                duration: 20,
                closable: true
            });
        }
    }
</script>
<style lang="scss" scoped>

</style>
