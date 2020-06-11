<template>
    <div class="message-types">
        <suc-button :config="{type:'default'}" @on-click="show('info')">显示普通提示</suc-button>
        <suc-button :config="{type:'default'}" @on-click="show('success')">显示成功提示</suc-button>
        <suc-button :config="{type:'default'}" @on-click="show('warning')">显示警示提示</suc-button>
        <suc-button :config="{type:'default'}" @on-click="show('error')">显示错误提示</suc-button>
        <suc-button :config="{type:'default'}" @on-click="show('loading')">加载中</suc-button>
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
    export default class DescMessageDemo extends Vue {
        show(type: 'info' | 'success' | 'warning' | 'error' | 'loading') {
            this.$SucMessage[type]({
                content: '这是一条信息提示',
                desc: '这是补充情况说明'
            });
        }
    }
</script>
