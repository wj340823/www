<template>
    <div class="drawer-inner">
        <div style="width:100%;height:100%" @click="openDrawer"></div>
        <suc-drawer v-model="drawerShow" :config="drawerConfig" hideheader>
            <div slot="header"></div>
            <div class="drawer-content">
                操作区域
            </div>
        </suc-drawer>
    </div>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import {SucDrawer } from "@suc/ui";
    import { DrawerConfig } from "@suc/ui/components/drawer/interface";
    @Component({
        components: {
            SucDrawer
        }
    })
    export default class BaseRadio extends Vue {
        drawerShow: boolean = true;
        drawerConfig: DrawerConfig = {
            inner: true,
            closable: false
        };
        openDrawer() {
            this.drawerShow = true;
        }
        
        
    }
</script>
<style lang="scss" scoped>
   .drawer-inner {
        width: 552px;
        height: 343px;
        margin: 40px auto;
        background: #eee;
        border: solid 1px #dde4eb;
        position: relative;
    }

    .drawer-content {
        font-size: 16px;
        color: #182b51;
        height: 100%;
        line-height: 300px;
        text-align: center;
    }
</style>
