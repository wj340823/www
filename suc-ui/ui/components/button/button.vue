<template>
    <Button v-bind="config"
            :type="initType"
            :disabled="disabled"
            :class="[btnClass,btnCustomClass,{true:'ivu-btn-dashed'}[dashed]]"
            @click="onclick()"
            v-on="$listeners">
        <slot></slot>
    </Button>
</template>
<script lang="ts">
    import { Vue, Component, Watch, Prop, Emit } from "vue-property-decorator";
    import debounce from 'lodash/debounce';
    import { ELEMENT_CLASS_PREFIX } from '../constants';
    import {ButtonConfig} from './interface';
    import { Button } from 'iview';
    const IVIEW_BUTTON_TYPES = ["default","primary","text","info","success","warning","error"];

    @Component({
        components: {Button}
    })
    export default class SucButton extends Vue {
        @Prop({default: () => ({})}) config!: ButtonConfig;
        @Prop(String) type!: string;
        @Prop(Boolean) dashed!: boolean;
        @Prop(Number) debounce!: number;
        @Prop({type: Boolean, default: false}) disabled!: boolean;
        customType:boolean|string = false;
        btnClass: string = `${ELEMENT_CLASS_PREFIX}button`;
        onclick() {
            this.$emit("on-click");
        }
        get initType(){
            if(this.type && !IVIEW_BUTTON_TYPES.includes(this.type)){
                this.customType = this.type;
            }
            return this.customType ? null : this.type;
        }
        get btnCustomClass(){
            return this.customType ? `ivu-btn-${this.customType}` : "";
        }
        mounted() {
            if (this.debounce) {
                this.onclick = debounce(() => {
                    this.$emit("on-click");
                }, this.debounce, {leading: true});
            }
            
        }
    }
</script>
