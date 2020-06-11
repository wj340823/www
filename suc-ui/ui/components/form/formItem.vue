<template>
    <form-item ref="item"
               :class="styles"
               v-bind="config"
               :error="error"
               :show-message="show"
               v-on="$listeners">
        <slot></slot>
    </form-item>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Inject, Watch} from "vue-property-decorator";
    import {FormItem} from "iview";
    //@ts-ignore
    import AsyncValidator from 'async-validator/dist-web/index.js';
    //@ts-ignore
    import uuid from 'uuid';

    @Component({
        components: {
            FormItem
        }
    })
    export default class SucFormItem extends Vue {

        @Prop({default: false}) disabled!: boolean;

        @Prop({default: () => ({})}) config!: any;

        @Prop({default: () => []}) rules!: any;

        @Prop() validator!: any;

        @Inject() formRules!: any;

        @Prop({
            default: 'bottom',
            validator(value: any): boolean {
                return ['bottom', 'top'].includes(value)
            }
        })
        errorPosition!: string;

        get styles() {
            return {
                disabled: this.disabled,
                'error-top': this.errorPosition === 'top'
            }
        }

        id = uuid();

        error = '';

        @Prop({default: true}) showMessage!: boolean;

        show = false;

        @Watch('showMessage', {immediate: true})
        onShowMessageChange() {
            this.show = this.showMessage;
        }

        checkValid() {
            let valid = true;
            for (const k in this.formRules) {
                if (k !== 'valid' && k !== 'invalid' && !this.formRules[k]) {
                    valid = false;
                    break;
                }
            }
            this.$set(this.formRules, 'valid', valid);
            this.$set(this.formRules, 'invalid', !valid);
        }

        @Watch('validator')
        setValidator() {
            if (this.validator) {
                this.show = false;
                this.$set(this.formRules, this.id, false);
                const validator = new AsyncValidator({
                    input: {
                        validator: this.validator
                    }
                });
                const item = this.$refs['item'] as Vue;
                item.$on('on-form-change', (input: any) => {
                    validator.validate({input}, {firstFields: true}, (errors?: any[]) => {
                        if (errors) {
                            this.$set(this.formRules, this.id, false);
                            this.error = errors[0].message || "";
                            this.show = true;
                        } else {
                            this.$set(this.formRules, this.id, true);
                            this.show = false;
                            this.error = "";
                        }
                        this.checkValid();
                    })
                })
            }
        }

        mounted() {
            this.setValidator();
            this.checkValid();
        }
    }
</script>
