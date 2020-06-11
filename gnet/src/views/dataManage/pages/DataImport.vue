<template>
    <div class="data-import">
        <top-nav :config="config" />
        <div class="main_view">
            <left-tag @changeDataType="changeDataType"></left-tag>
            <right-form :type="dataImpot.type"></right-form>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import { TopNav, OperateModal } from "../components";
    import { LeftTag, RightForm } from "../components/dataImport";
    import { TopParamConfig, DataImportConfig } from "../components/interface";
    import { SucTable, SucTableColumn, SucPage } from "@suc/ui";
    import AutoHeight from "@/mixins/autoHeight";

    @Component({
        components: {
            TopNav,
            OperateModal,
            SucTable,
            SucTableColumn,
            SucPage,
            LeftTag,
            RightForm
        }
    })
    export default class DataImport extends AutoHeight {
        config: TopParamConfig = {
            label: "数据导入",
            searchable: false,
            importable: false,
            operate: false
        };
        dataImpot: DataImportConfig = {
            type: "vector"
        };
        changeDataType(type: string) {
            this.dataImpot.type = type;
        }

        created(): void {}
    }
</script>

<style scoped lang="scss">
    .data-import {
        .main_view {
            margin: 16px;
            border: 1px solid #eee;
            padding: 20px 16px 0;
            background-color: #fff;
            height: calc(100% - 85px);
            width: calc(100% - 32px);
        }
    }
</style>
