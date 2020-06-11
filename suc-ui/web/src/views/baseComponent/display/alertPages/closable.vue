<template>
    <div>
        <suc-alert closable>
            指南文本
        </suc-alert>
        <suc-alert type="success" show-icon closable>
            成功文本
            <span slot="desc">描述信息</span>
        </suc-alert>
        <suc-alert type="warning" show-icon closable>
            警示文本
            <span slot="close">关闭</span>
        </suc-alert>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {SucAlert} from "@suc/ui";

    @Component({
        components: {
            SucAlert
        }
    })
    export default class ClosableAlertDemo extends Vue {

    }
</script>
