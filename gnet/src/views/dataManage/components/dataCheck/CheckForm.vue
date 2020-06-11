<template>
    <div class="check-form">
        <suc-form :config="{ 'label-width': 100 }" class="form-content">
            <suc-form-item class="item" :config="{ label: '校验类别选择' }">
                <suc-select
                    class="w250"
                    v-model="dataCheck.type"
                    :options="dataCheck.typeList"
                ></suc-select>
            </suc-form-item>
            <suc-form-item class="item" :config="{ label: '校验选择' }">
                <suc-select
                    class="w250"
                    v-model="dataCheck.checkSel"
                    :options="dataCheck.checkOptions"
                ></suc-select>
            </suc-form-item>
            <suc-form-item class="item" :config="{ label: '校验标题' }">
                <suc-input v-model="dataCheck.title" class="w250" />
            </suc-form-item>
        </suc-form>
        <suc-form
            :config="{ 'label-position': 'top' }"
            class="form-content check-con"
        >
            <suc-form-item class="item" :config="{ label: '形状' }">
                <suc-checkbox-group v-model="dataCheck.shipe">
                    <suc-checkbox
                        v-for="(item, index) in shapeList"
                        :key="index"
                        :label="item.value"
                        class="check-item"
                        >{{ item.label }}</suc-checkbox
                    >
                </suc-checkbox-group>
            </suc-form-item>
        </suc-form>
        <suc-form
            :config="{ 'label-position': 'top' }"
            class="form-content check-con"
        >
            <suc-form-item class="item" :config="{ label: '拓扑规则' }">
                <suc-checkbox-group v-model="dataCheck.regular">
                    <suc-checkbox
                        v-for="(item, index) in regularList"
                        :label="item.value"
                        class="check-item"
                        >{{ item.label }}</suc-checkbox
                    >
                </suc-checkbox-group>
            </suc-form-item>
        </suc-form>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";
    import { REGULARS, SINGLE_REGULAR } from "../regular";
    import {
        SucForm,
        SucFormItem,
        SucSelect,
        SucInput,
        SucCheckbox,
        SucCheckboxGroup
    } from "@suc/ui";
    import { TopParamConfig, DataCheckConfig } from "../interface";
    const SHAPELIST = [
        {
            label: "点",
            value: "point"
        },
        {
            label: "线",
            value: "line"
        },
        {
            label: "面",
            value: "area"
        }
    ];
    @Component({
        components: {
            SucForm,
            SucFormItem,
            SucSelect,
            SucInput,
            SucCheckbox,
            SucCheckboxGroup
        }
    })
    export default class CheckForm extends Vue {
        dataCheck: DataCheckConfig = {
            type: "",
            typeList: [],
            checkSel: "",
            checkOptions: [],
            title: "",
            shipe: [],
            regular: []
        };
        shapeList = SHAPELIST;
        regularList = SINGLE_REGULAR;
    }
</script>

<style scoped lang="scss">
    .check-form {
        width: 100%;
        height: calc(100% - 50px);
        .form-content {
            width: 720px;
            padding: 10px;
            margin: 0 auto;
            .w250 {
                width: 250px;
            }
        }
        .item {
            width: 100%;
            display: inline-block;
        }
        .check-item {
            width: 180px;
            display: inline-block;
            .suc-checkbox .ivu-checkbox {
                margin-right: 10px !important;
            }
        }
        .check-con {
            border: 1px solid #dedede;
            background-color: #fff;
            border-radius: 10px;
        }
    }
</style>
