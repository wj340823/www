<template>
    <suc-form class="form-content" :config="{'label-width':80}">
        <suc-form-item class="form-content-item"
                       :config="{label:'人员类型:'}">
            <suc-select v-model="selectModel"
                        :options="options"
                        :config="config"
                        @on-change="onChange"></suc-select>
        </suc-form-item>
        <suc-form-item class="form-content-item"
                       :config="{label:'人员类型:'}"
                       :disabled="true">
            <suc-select v-model="selectModel2"
                        :options="options"
                        :config="config2"></suc-select>
        </suc-form-item>
    </suc-form>
</template>
<script lang="ts">
    import { Prop, Vue, Component } from "vue-property-decorator";
    import { SucSelect, SucForm, SucFormItem } from "@suc/ui";
    import { SelectConfig, SelectOptions } from "@suc/ui/components/select/interface";

    @Component({
        components: {
            SucSelect,
            SucForm,
            SucFormItem
        }
    })
    export default class SelectDemo extends Vue {

        selectModel: any = "";

        selectModel2: any = "";

        options: SelectOptions = [
            {
                label: "在职人员",
                value: 1
            },
            {
                label: "实习生",
                value: 2
            },
            {
                label: "已离职人员",
                value: 3
            }
        ];

        config: SelectConfig = {
            placeholder: "请选择",
            clearable: true
        };

        config2: SelectConfig = {
            placeholder: "请选择",
            clearable: true,
            disabled: true
        };

        onChange() {
        }
    }
</script>
<style lang="scss" scoped>
    .form-content {
        width: 370px;

        .form-content-item.ivu-form-item {
            margin-bottom: 16px;
        }
    }
</style>
