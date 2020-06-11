<template>
    <view-page title="Form 表单验证">
        <demo-part title="基本用法" :code="code[0]">
            <form-demo></form-demo>
        </demo-part>
        <demo-part title="错误信息/标签位置" :code="code[1]">
            <form-position-demo></form-position-demo>
        </demo-part>
        <div class="demo-api msg-api" id="API">
            <div class="title">API</div>
            <div class="tbItem">
                <div class="header">SucForm props</div>
                <suc-table :data="config" border style="width: 100%">
                    <suc-table-column prop="attr" label="属性" width="180"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                    <suc-table-column prop="type" label="类型" width="180"></suc-table-column>
                    <suc-table-column prop="default" label="默认值" width="180"></suc-table-column>
                </suc-table>
            </div>
            <div class="tbItem">
                <div class="header">SucFormItem props</div>
                <suc-table :data="props" border style="width: 100%">
                    <suc-table-column prop="attr" label="属性" width="180"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                    <suc-table-column prop="type" label="类型" width="180"></suc-table-column>
                    <suc-table-column prop="default" label="默认值" width="180"></suc-table-column>
                </suc-table>
            </div>
            <div class="tbItem">
                <div class="interface" v-highlight>
                    <pre><code class="typescript">{{FormConfig}}</code></pre>
                </div>
            </div>
            <div class="tbItem">
                <div class="header">SucForm events</div>
                <suc-table :data="events" border style="width: 100%">
                    <suc-table-column prop="name" label="事件名"></suc-table-column>
                    <suc-table-column prop="desc" label="说明"></suc-table-column>
                    <suc-table-column prop="returnValue" label="返回值"></suc-table-column>
                </suc-table>
            </div>

        </div>
    </view-page>
</template>

<script lang="ts">
    import { Vue, Component, Watch } from "vue-property-decorator";
    import FormDemo from "./form/FormDemo.vue";
    import FormDemoCode from "!!raw-loader!./form/FormDemo.vue";
    import FormPositionDemoCode from "!!raw-loader!./form/FormPositionDemo.vue";
    import { SucTable, SucTableColumn } from "@suc/ui";
    // @ts-ignore
    import FormConfig from '!!raw-loader!@suc/ui/components/form/interfaces'
    import { ApiTableData, ApiTableEvent } from "@/utils/interfaces";
    import FormPositionDemo from "./form/FormPositionDemo.vue";

    @Component({
        components: {
            FormDemo,
            SucTable,
            SucTableColumn,
            FormPositionDemo
        }
    })
    export default class FormPage extends Vue {

        code = [FormDemoCode, FormPositionDemoCode];

        FormConfig = FormConfig;

        config: ApiTableData[] = [
            {
                attr: 'config',
                type: 'FormConfig',
                desc: 'SucForm的配置项,详细参见interface FormConfig',
                default: '{}'
            }
        ];

        events: ApiTableEvent[] = [
            {
                name: 'validate',
                desc: '使用@validate,在每次验证之后出发,参数类型interface ValidateResult',
                returnValue: 'ValidateResult'
            }
        ];

        props: ApiTableData[] = [
            {
                attr: 'config',
                type: 'FormItemConfig',
                desc: 'SucFormItem的配置项,详细参见interface FormItemConfig',
                default: '{}'
            }
        ]

    }
</script>

