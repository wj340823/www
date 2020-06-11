<template>
    <suc-form @validate="onValidate" :config="formConfig">
        <suc-form-item :config="itemTopConfig"
                       error-position="top"
                       :validator="validator">
            <suc-input style="width: 100%" v-model="value"></suc-input>
        </suc-form-item>
        <template slot="buttons" slot-scope="{formRules}">
            <suc-form-item>
                <suc-button style="float: right"
                            :disabled="formRules.invalid">确定
                </suc-button>
            </suc-form-item>
        </template>
    </suc-form>
</template>
<script lang="ts">
    import { FormConfig, FormItemConfig, ValidateResult } from "@suc/ui/components/form/interfaces";
    import { Vue, Component } from "vue-property-decorator";
    import { SucButton, SucForm, SucFormItem, SucInput } from "@suc/ui";

    @Component({
        components: {
            SucForm,
            SucFormItem,
            SucButton,
            SucInput
        }
    })
    export default class FormPositionDemo extends Vue {

        value = "";

        formConfig: FormConfig = {
            "label-position": "top"
        };

        itemTopConfig: FormItemConfig = {
            label: 'Age',
            required: true,
        };


        validator(rule: any, value: any, callback: any) {
            if (!value) {
                return callback(new Error('age cannot be empty'));
            } else if (value > 18) {
                return callback(new Error("age must below 18"))
            } else if (value <= 18 && value > 0) {
                callback()
            } else {
                callback(new Error('input invalid'))
            }
        }

        onValidate(ev: ValidateResult) {
            console.log(ev);
        }
    }
</script>
