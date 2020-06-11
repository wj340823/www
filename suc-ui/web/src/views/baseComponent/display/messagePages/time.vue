<template>
    <suc-button :config="{type:'default'}" @on-click="show()">显示一个10秒的提示</suc-button>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucButton} from "@suc/ui";

    @Component({
        components: {
            SucButton
        }
    })
    export default class TimeMessageDemo extends Vue {
        show(){
            this.$SucMessage.info({
                content: '10秒后消失',
                duration: 10
            });
        }
    }
</script>
<style lang="scss" scoped>

</style>
