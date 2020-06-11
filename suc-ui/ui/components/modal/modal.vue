<template>
    <i-modal :value="value"
             v-bind="config"
             v-on="$listeners"
             class-name="suc-modal">
        <i-row>
            <i-col v-if="$slots.default" span="24">
                <div class="suc-modal-content">
                    <slot></slot>
                </div>
            </i-col>
            <i-col v-if="$slots.left" :span="leftSpan">
                <div class="suc-modal-left">
                    <slot name="left"></slot>
                </div>
            </i-col>
            <i-col v-if="$slots.right" :span="rightSpan">
                <div class="suc-modal-content">
                    <slot name="right"></slot>
                </div>
            </i-col>
        </i-row>
        <template slot="footer">
            <div class="suc-modal-footer">
                <span class="suc-model-message">{{message}}</span>
                <div class="suc-model-buttons">
                    <slot name="buttons">
                        <suc-button type="primary" :config="{ghost:true}" @click="onCancel">取消</suc-button>
                        <suc-button type="primary" @click="onOk">确定</suc-button>
                    </slot>
                </div>
            </div>
        </template>
    </i-modal>
</template>
<script lang="ts">
    import { Vue, Component, Watch, Prop, Emit } from "vue-property-decorator";
    import { Modal, Row, Col } from 'iview';
    import { SucButton } from '../button'
    import { ModalConfig } from "./interface";

    @Component({
        components: {
            IModal: Modal,
            SucButton,
            IRow: Row,
            ICol: Col
        }
    })
    export default class SucModal extends Vue {

        @Prop({required: true}) value!: any;
        @Prop() message!: "";
        @Prop({default: 4}) leftSpan!: number;
        @Prop({default: 20}) rightSpan!: number;

        @Prop({default: () => ({})}) config!: ModalConfig;

        onCancel() {
            this.$emit('input', false);
            this.$emit('on-cancel')
        }

        onOk() {
            this.$emit('on-ok')
        }

    }
</script>
