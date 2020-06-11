<template>
    <div>
        <suc-alert>
            指南文本
            <span slot="desc">描述信息描述信息描述信息描述信息描述信息</span>
        </suc-alert>
        <suc-alert type="success">
            成功文本
            <span slot="desc">描述信息</span>
        </suc-alert>
        <suc-alert type="warning">
            警示文本
            <span slot="desc">描述信息</span>
        </suc-alert>
        <suc-alert type="error">
            失败文本
            <span slot="desc">描述信息</span>
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
    export default class DescAlertDemo extends Vue {

    }
</script>
