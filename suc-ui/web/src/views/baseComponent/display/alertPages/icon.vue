<template>
    <div>
        <suc-alert show-icon>
            指南文本
        </suc-alert>
        <suc-alert type="success" show-icon>
            成功文本
        </suc-alert>
        <suc-alert type="warning" show-icon>
            警示文本
        </suc-alert>
        <suc-alert type="error" show-icon>
            失败文本
        </suc-alert>
        <suc-alert show-icon>
            指南文本
            <span slot="desc">描述信息描述信息描述信息描述信息描述信息</span>
        </suc-alert>
        <suc-alert type="success" show-icon>
            成功文本
            <span slot="desc">描述信息</span>
        </suc-alert>
        <suc-alert type="warning" show-icon>
            警示文本
            <span slot="desc">描述信息</span>
        </suc-alert>
        <suc-alert type="error" show-icon>
            失败文本
            <span slot="desc">描述信息</span>
        </suc-alert>
        <suc-alert show-icon>
            自定义图标
            <span slot="icon"><i class="iconfont iconicon-"></i></span>
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
    export default class IconAlertDemo extends Vue {

    }
</script>
