<template>
    <div class="echarts-edit-outer">
        <div class="left-code">
            <vue-json-editor v-model="afterOptions" mode="code" style="height: 100%"/>
        </div>
        <div class="right-result">
            <v-chart :options="afterOptions" auto-resize style="width: 100%;height: 100%;"></v-chart>
            <template v-if="info">
                <div class="more-info" v-html="info"></div>
            </template>
        </div>

        <div class="toggle-menu" @click="isShow=true" v-if="!isShow">
            <i class="iconfont iconlist" title="打开列表"></i>
        </div>
        <suc-drawer :config="drawerConfig" v-model="isShow">
            <template v-for="item in list">
                <div :key="item.name" class="demo-list drawer-item" :class="{active:path==item.options}" @click="go(item.options)">
                    {{item.name}}
                </div>
            </template>
        </suc-drawer>
    </div>

</template>
<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator';
    import {LIST, ListItem, OPTIONS} from '@/utils/echarts';
    import vueJsonEditor from 'vue-json-editor';
    import {SucDrawer} from '@suc/ui';

    @Component({
        components: {
            vueJsonEditor,
            SucDrawer
        }
    })
    export default class EchartsEdit extends Vue {
        @Prop() id!: string;
        afterOptions = OPTIONS[this.id].config;
        info = OPTIONS[this.id].moreInfo;
        isShow = false;
        drawerConfig = {
            title: '列表',
            placement: 'left',
            closable: false
        }
        list: ListItem[] = LIST;

        go(params: string) {
            this.$router.replace({path: `/main/echarts/edit`, query: {id: params}});
            this.isShow = false;
        }

        get path() {
            this.afterOptions = OPTIONS[this.id].config;
            this.info = OPTIONS[this.id].moreInfo;
            return this.$route.query.id;
        }

    }
</script>
<style lang="scss">
    @import "~@suc/ui/styles/index";

    .echarts-edit-outer {
        position: relative;
        height: 100%;

        .left-code, .right-result {
            display: inline-block;
            height: 100%;
            vertical-align: top;
        }

        .left-code {
            width: 40%;
        }

        .right-result {
            width: 60%;
            padding: 10px 20px 60px;
            background: #f3f3f3;

            .more-info {
                font-size: 14px;
            }
        }

        .toggle-menu {
            position: absolute;
            top: 20px;
            left: 0;
            z-index: 5;
            line-height: 30px;
            padding-left: 4px;
            cursor: pointer;

            &:before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 20px;
                height: 30px;
                border: 1px solid $theme-border-color;
                border-right: 0 transparent;
                background: white;
                z-index: 2;
            }

            &:after {
                content: '';
                position: absolute;
                top: 0;
                right: -15px;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 1px solid $theme-border-color;
                background: white;
                z-index: 1;
            }

            i {
                position: relative;
                color: $theme-text-primary;
                font-size: 20px;
                z-index: 3;
            }
        }
    }

    .jsoneditor-vue {
        height: 100%;

        .jsoneditor-menu {
            display: none;
        }

        .jsoneditor-outer {
            margin: 0;
            padding: 0;
        }
    }

    .ace_scrollbar-v {
        @include scrollbar-diy;
    }

    .demo-list.drawer-item {
        line-height: 30px;
        font-size: 14px;
        cursor: pointer;
        &.active {
            color: $theme-primary;
        }
    }
</style>