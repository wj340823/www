<template>
    <div class="top-nav">
        <suc-button
            type="primary"
            v-if="config.back"
            class="back"
            @on-click="goback"
            >返回</suc-button
        >
        <span class="label">{{ config.label }}</span>
        <div class="operate" v-if="config.operate">
            <suc-button
                type="primary"
                :debounce="800"
                v-if="config.operateType == 'kind'"
                @on-click="addKinds('类别')"
                >添加类别
            </suc-button>
            <suc-button
                type="primary"
                :debounce="800"
                v-if="config.operateType != 'kind'"
                @on-click="addKinds('分组')"
                >添加分组
            </suc-button>
        </div>
        <div class="operate" v-if="config.importable">
            <suc-button type="primary" :debounce="800" @on-click="dataImport"
                >数据导入
            </suc-button>
        </div>
        <div class="operate" v-if="config.searchable">
            <suc-input v-model="name" class="operate-input" placeholder="搜索">
            </suc-input>
            <suc-button type="primary" :debounce="800" @on-click="search"
                >搜索
            </suc-button>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";
    import { SucInput, SucButton } from "@suc/ui";
    import { TopParamConfig } from "./interface";

    @Component({
        components: { SucInput, SucButton }
    })
    export default class TopNav extends Vue {
        @Prop() config!: TopParamConfig;
        @Prop() name!: string;
        dataImport() {
            this.$router.push("/data/dataImport");
        }
        addKinds(kind: string) {
            this.$emit("openAddModal", kind);
        }
        search() {
            this.$emit("searchEvent", this.name);
        }
        goback() {
            this.$router.go(-1);
        }
    }
</script>

<style scoped lang="scss">
    .top-nav {
        width: 100%;
        height: 50px;
        background-color: rgb(239, 245, 253);
        line-height: 50px;
        padding: 0 10px;
        .back {
            margin-right: 15px;
        }
        .label {
            font-size: 16px;
        }
        .operate {
            float: right;
            margin-right: 10px;

            &-input {
                vertical-align: middle;
                margin-right: 5px;
            }
        }
    }
</style>
