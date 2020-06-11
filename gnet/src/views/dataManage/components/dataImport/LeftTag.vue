<template>
    <div class="left-tag">
        <p>入库数据类型选择</p>
        <div
            v-for="(item, index) in list"
            :key="index"
            class="item"
            :class="item.val == active ? 'act' : ''"
            @click="changeDataType(item.val)"
        >
            <div>{{ item.label }}</div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop, Watch } from "vue-property-decorator";
    import { SucButton } from "@suc/ui";
    const DATALIST = [
        {
            label: "矢量数据",
            val: "vector"
        },
        {
            label: "栅格数据",
            val: "raster"
        },
        {
            label: "三维数据",
            val: "3D"
        }
    ];
    @Component({
        components: { SucButton }
    })
    export default class LeftTag extends Vue {
        list: any[] = [];
        active: string = "vector";
        changeDataType(val: string) {
            this.$emit("changeDataType", val);
            this.active = val;
        }
        created(): void {
            this.list = DATALIST;
        }
    }
</script>

<style scoped lang="scss">
    .left-tag {
        width: 200px;
        float: left;
        text-align: center;
        padding-left: 10px;
        padding-top: 10px;
        height: calc(100% - 16px);
        background-color: rgb(245, 245, 245);
        & > p {
            text-align: left;
            color: #a6a6a7;
        }
        .item {
            color: #e1eafe;
            background-color: rgba(#1f8ff0, 0.5);
            line-height: 50px;
            font-size: 16px;
            margin: 20px 0;
            width: 140px;
            border-radius: 5px;
            cursor: pointer;
        }
        .act {
            color: #fff;
            background-color: #1f8ff0;
        }
    }
</style>
