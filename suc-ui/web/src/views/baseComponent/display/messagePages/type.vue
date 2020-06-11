<template>
    <div class="message-types">
        <suc-button :config="{type:'success'}" @on-click="show('success')">
            显示成功提示
        </suc-button>
        <suc-button :config="{type:'warning'}" @on-click="show('warning')">
            显示警示提示
        </suc-button>
        <suc-button :config="{type:'error'}" @on-click="show('error')">
            显示错误提示
        </suc-button>
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
    export default class TypeMessageDemo extends Vue {
        show(type: 'info' | 'success' | 'warning' | 'error' | 'loading') {
            if(type==='success'){
                this.$SucMessage.success({content:'这是一条成功信息提示',duration:0});
            }else if(type==='warning'){
                this.$SucMessage.warning('这是一条警示信息提示');
            }else{
                this.$SucMessage.error('抛出了一个异常');
            }
        }
    }
</script>
