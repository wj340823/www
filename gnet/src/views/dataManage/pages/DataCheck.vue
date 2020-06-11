<template>
    <div>
        <top-nav :config="config" @searchEvent="searchResult" />
        <check-form></check-form>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import { TopNav } from "../components";
    import { TopParamConfig } from "../components/interface";
    import { CheckForm } from "../components/dataCheck";
    import AutoHeight from "@/mixins/autoHeight";

    @Component({
        components: { TopNav, CheckForm }
    })
    export default class DataCheck extends AutoHeight {
        config: TopParamConfig = {
            label: "数据质检配置",
            searchable: false,
            importable: false,
            operate: false,
            back: true
        };

        searchResult() {}

        gotoItem() {}

        created(): void {
            this.autoHeightMixin(180);
        }
    }
</script>

<style scoped lang="scss"></style>
