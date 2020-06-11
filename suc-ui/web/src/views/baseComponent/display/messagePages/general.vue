<template>
    <suc-button :config="{type:'primary'}" @on-click="show">显示普通提示</suc-button>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucButton} from "@suc/ui";

    @Component({
        components: {
            SucButton
        }
    })
    export default class GeneralMessageDemo extends Vue {
        show() {
            this.$SucMessage.info('这是一条普通的提示');
        }
    }
</script>
