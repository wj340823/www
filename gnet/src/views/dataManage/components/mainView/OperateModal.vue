<template>
    <div>
        <suc-form v-if="operate.configType == 'kind'">
            <suc-form-item
                :config="{ label: '类别名称' }"
                v-if="operate.type != 'del'"
            >
                <suc-input v-model="operate.data.categoryName"></suc-input>
            </suc-form-item>
            <suc-form-item
                :config="{ label: '类别名称' }"
                v-if="operate.type == 'del'"
            >
                <p>确认删除</p>
                <suc-button type="primary">确认</suc-button>
                <suc-button type="primary">取消</suc-button>
            </suc-form-item>
        </suc-form>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop, Watch } from "vue-property-decorator";
    import {
        SucModal,
        SucForm,
        SucFormItem,
        SucSelect,
        SucInput,
        SucButton
    } from "@suc/ui";
    import { ModalConfig } from "@suc/ui/interfaces";
    import { Operate } from "../interface";

    const OP = {
        add: "新增",
        edit: "修改",
        del: "删除"
    };
    @Component({
        components: {
            SucModal,
            SucForm,
            SucFormItem,
            SucSelect,
            SucInput,
            SucButton
        }
    })
    export default class OperateModal extends Vue {
        @Prop() operate!: Operate;
        model: boolean = false;
        current: number = Date.now();
        config: ModalConfig = {
            title: "",
            width: 600,
            "footer-hide": true,
            closable: true
        };

        open: boolean = true;

        closeOperateModal() {
            //this.open = false
            //this.operate.show = false
            this.$emit("closeOperateModal");
        }
        @Watch("operate", { deep: true })
        changeModalStatus(n: Operate) {
            debugger;
            this.current = Date.now();
        }
        created(): void {
            this.config.title = OP[this.operate.type] + this.operate.title;
        }
    }
</script>

<style scoped></style>
