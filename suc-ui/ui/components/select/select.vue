<template>
    <div :class="wrapClass">
        <i-select ref="$select"
                  :value="value"
                  v-bind="config"
                  v-on="$listeners">
            <!--<slot slot="prefix"></slot>-->
            <template v-if="!$slots.default">
                <i-option v-for="(item,index) in options"
                          :key="index"
                          :value="item.value"
                          :disabled="item.disabled">
                    {{item.label}}
                </i-option>
            </template>
            <slot></slot>
        </i-select>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";
    import { Select, Option } from "iview";
    import { SelectOptions } from "./interface";

    const prefixCls = "suc-select";
    @Component({
        components: {
            ISelect: Select,
            IOption: Option
        }
    })
    export default class SucSelect extends Vue {

        @Prop({required: true}) value!: any;

        @Prop({default: () => []}) options?: SelectOptions;

        @Prop() keyString?: string;

        @Prop({default: () => ({})}) config: any;

        // get model() {
        //     return this.value;
        // }
        //
        // set model(value: any) {
        //     this.$emit('input', value);
        // }

        get wrapClass() {
            return `${prefixCls}`
        }

        setQuery(query: string) {
            (this.$refs['$select'] as any).setQuery(query);
        }

        clearSingleSelect() {
            (this.$refs['$select'] as any).clearSingleSelect();
        }

        // mounted() {
        // }
    }
</script>

<style lang="scss" scoped>

</style>
