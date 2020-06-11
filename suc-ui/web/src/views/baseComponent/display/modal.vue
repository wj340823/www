<template>
    <view-page title="Modal 模态弹窗">
        <demo-part id="NORMALMODAL" title="基本用法" subTitle="使用时配合底层遮罩" :code="code[0]">
            <div class="form-demo">
                <suc-button :config="{type:'primary'}" @on-click="openModel">打开模态框</suc-button>
            </div>
        </demo-part>
        <demo-part id="MENUMODAL" title="带有侧边栏的弹窗" subTitle="使用时配合底层遮罩" :code="code[1]">
            <div class="form-demo">
                <suc-button :config="{type:'primary'}" @on-click="openModel2">打开模态框</suc-button>
            </div>
        </demo-part>
        <normal-modal ref="normal"></normal-modal>
        <menu-modal ref="menu"></menu-modal>
        <div class="demo-api msg-api" id="API">
            <div class="title">API</div>
            <div class="tbItem">
                <div class="header">SucModal props</div>
                <suc-table :data="config" border style="width: 100%">
                    <suc-table-column prop="attr" label="属性" width="180"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                    <suc-table-column prop="type" label="类型" width="180"></suc-table-column>
                    <suc-table-column prop="default" label="默认值" width="180"></suc-table-column>
                </suc-table>
                <div class="interface" v-highlight>
                    <pre><code class="typescript">{{ModalConfig}}</code></pre>
                </div>
            </div>
            <div class="tbItem">
                <div class="header">SucModal events</div>
                <suc-table :data="events" border style="width: 100%">
                    <suc-table-column prop="name" label="事件名"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                    <suc-table-column prop="returnValue" label="返回值"></suc-table-column>
                </suc-table>
            </div>
            <div class="tbItem">
                <div class="header">SucModal slot</div>
                <suc-table :data="slots" border style="width: 100%">
                    <suc-table-column prop="name" label="名称"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                </suc-table>
            </div>
        </div>
    </view-page>
</template>
<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import NormalModal from "./modal/NormalModal.vue";
    import NormalModalCode from "!!raw-loader!./modal/NormalModal.vue";
    import MenuModal from "./modal/MenuModal.vue";
    import MenuModalCode from "!!raw-loader!./modal/MenuModal.vue";
    import { SucButton, SucTable, SucTableColumn } from "@suc/ui";
    //@ts-ignore
    import ModalConfig from "!!raw-loader!@suc/ui/components/modal/interface";
    import { ApiTableData, ApiTableEvent, ApiTableSlot } from "@/utils/interfaces";

    @Component({
        components: {
            NormalModal,
            MenuModal,
            SucButton,
            SucTable,
            SucTableColumn
        }
    })
    export default class modal extends Vue {

        ModalConfig = ModalConfig;

        code = [
            NormalModalCode,
            MenuModalCode
        ];

        openModel2() {
            (this.$refs['menu'] as any).openModal();
        }

        openModel() {
            (this.$refs['normal'] as any).openModal();
        }

        copyHandler() {
            this.$Copy("text");
        }

        detailHandler() {

        }

        config: ApiTableData[] = [
            {
                attr: 'value',
                desc: '模态框是否显示，可使用 v-model 双向绑定数据。',
                type: 'Boolean',
                default: 'false'
            },
            {
                attr: "message",
                desc: "模态框左下角说明问题",
                type: "String",
                default: ''
            },
            {
                attr: "leftSpan",
                type: "Number",
                desc: "模态框左侧插槽的宽度,按照栅格24布局",
                default: "4"
            },
            {
                attr: "rightSpan",
                type: "Number",
                desc: "模态框右侧插槽的宽度,按照栅格24布局",
                default: "20"
            },
            {
                attr: "config",
                type: "ModalConfig",
                desc: "模态框详细配置,更详细可以参考interface ModalConfig",
                default: "{}"
            }
        ];

        events: ApiTableEvent[] = [
            {
                name: "on-ok",
                desc: "点击确定的回调",
                returnValue: "无"
            },
            {
                name: "on-cancel",
                desc: "点击取消的回调",
                returnValue: "无"
            },
            {
                name: "on-visible-change",
                desc: "显示状态发生变化时触发",
                returnValue: "true / false"
            }
        ];

        slots: ApiTableSlot[] = [
            {
                name: '无',
                desc: '对话框主体内容'
            },
            {
                name: "header",
                desc: "自定义页头"
            },
            {
                name: 'footer',
                desc: '自定义页脚内容'
            },
            {
                name: 'close',
                desc: '自定义右上角关闭内容'
            },
            {
                name: 'left',
                desc: '对话框左侧部分,需搭配slot right使用'
            },
            {
                name: 'right',
                desc: '对话框右侧部分,需搭配slot left使用'
            }
        ]

    }
</script>
<style lang="scss" scoped>
    .form-demo > div {
        margin: 20px 0;
    }
</style>
