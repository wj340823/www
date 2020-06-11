<template>
    <div :class="[wrapClass,{'required':required,'error':isError}]">
        <label 
            :class="[labelClass,{top:this.labelPosition==='top','disabled':disabled}]"
            :style="labelStyle"
            v-if="label">{{label}}</label>
        <i-input
                :value="value"
                :type="initType"
                :style="inputStyle"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                v-bind="initConfig"
                v-on="$listeners">
            <template v-slot:prepend>
                <slot name="prepend"></slot>
            </template>
            <template v-slot:append>
                <slot name="append"></slot>
            </template>
            <template v-slot:prefix>
                <slot name="prefix"></slot>
            </template>
            <template v-slot:suffix>
                <slot name="suffix"></slot>
            </template>
        </i-input>
        <div :class="errorTipClass" v-if="isError">
            <i-icon type="md-alert"/>
            {{errorTip}}
        </div>
    </div>
</template>
<script lang="ts">
    import { Vue, Component, Watch, Prop, Emit } from "vue-property-decorator";
    import { Input, Icon } from 'iview';
    import { ELEMENT_CLASS_PREFIX } from '../constants';
    import { InputConfig } from './interface'
    @Component({
        components: {
            IInput: Input,
            IIcon: Icon
        }
    })
    export default class SucInput extends Vue {
        @Prop() config!: InputConfig;
        @Prop({required: true}) value!: any;
        @Prop({default:"text",type:String}) type!:'text' | 'password' | 'textarea' | 'url' | 'email' | 'date' | 'number' | 'tel'
        @Prop(String) label!: string;
        @Prop({default: 'right', type: String}) labelPosition!: 'left' | 'right' | 'top';
        @Prop({default: 100, type: Number}) labelWidth!: number;
        @Prop(Boolean) required!: boolean;
        @Prop(String) errorTip!: string;
        @Prop(Boolean) isError!: boolean;
        @Prop(String) placeholder!:string;
        @Prop(Boolean) disabled!:boolean;
        @Prop(Boolean) readonly!:boolean;
        wrapClass: string = `${ELEMENT_CLASS_PREFIX}input`;
        labelClass: string = `${ELEMENT_CLASS_PREFIX}input-label`;
        errorTipClass: string = `${ELEMENT_CLASS_PREFIX}formctrl-error-tip`;

        get labelStyle() {
            return {
                width: `${this.labelWidth}px`,
                textAlign: this.labelPosition === 'top' ? 'left' : this.labelPosition
            }
        }

        get inputStyle() {
            return {
                marginLeft: this.label && this.labelPosition != 'top' ? `${this.labelWidth}px` : '0'
            }
        }

        get initConfig(){
            return this.config && this.config.enterButton ? Object.assign({},this.config,{search:true}) : this.config;
        }

        get initType(){
            return this.config && (this.config.rows || this.config.autosize) ? "textarea" : this.type;
        }
    }
</script>
