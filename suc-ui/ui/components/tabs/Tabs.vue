<template>
    <div :class="wrapClass">
        <Tabs :value="value" :type="type" :size="size" :animated="animated" :captureFocus="captureFocus"
              :closable="closable" :beforeRemove="beforeRemove" :name="name" v-on="$listeners">
            <template slot="extra">
                <slot name="extra"></slot>
            </template>
            <slot></slot>
        </Tabs>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {Tabs} from "iview";
    import {ELEMENT_CLASS_PREFIX} from "../constants";

    @Component({
        components: {
            Tabs
        }
    })
    export default class SucTabs extends Vue {
        @Prop([String, Number]) value?: string|number;
        @Prop({default:'line'}) type?: 'line' | 'card';
        @Prop({default:'default'}) size?: 'small' | 'default';
        @Prop({default: true}) animated?:boolean;
        @Prop({default: false}) captureFocus?:boolean;
        @Prop({default: false}) closable?:boolean;
        @Prop(Function) beforeRemove?: Function;
        @Prop(String) name?:string;

        wrapClass: string = `${ELEMENT_CLASS_PREFIX}tabs`;
    }
</script>
<style lang="scss" scoped>

</style>
