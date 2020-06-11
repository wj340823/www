<template>
    <Form v-on="$listeners"
          v-bind="config">
        <slot></slot>
        <slot name="buttons" :formRules="formRules"></slot>
    </Form>
</template>

<script lang="ts">
    import { Vue, Component, Prop, Provide, Watch } from "vue-property-decorator";
    import { Form } from "iview";

    @Component({
        components: {
            Form
        }
    })
    export default class SucForm extends Vue {
        @Prop({default: () => ({})}) config!: any;
        @Provide() formRules = {
            valid: true,
            invalid: false
        };

        @Watch('formRules', {deep: true})
        onFormRulesChange() {
            this.$emit('validate', this.formRules);
        }
    }
</script>

<style lang="scss" scoped>

</style>
