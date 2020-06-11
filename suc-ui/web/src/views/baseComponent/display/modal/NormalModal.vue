<template>
    <suc-modal :config="config" v-model="model" message="*此处是说明文字">
        <div class="content"></div>
    </suc-modal>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import { SucModal } from "@suc/ui";
    import { ModalConfig } from "@suc/ui/components/modal/interface";

    @Component({
        components: {
            SucModal
        }
    })
    export default class NormalModal extends Vue {

        model: boolean = false;

        config: ModalConfig = {
            transfer: false,
            title: "标题",
            width: 960
        };

        openModal() {
            this.model = true;
        }

        closeModel() {
            this.model = false;
        }

        toggleModel() {
            this.model = !this.model;
        }

    }
</script>

<style lang="scss" scoped>
    .content {
        height: 322px;
        width: 100%;
        background-color: #eff6fc;
    }
</style>
