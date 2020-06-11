<template>
    <div :class="[wrapClass]">
       <i-checkbox :value="value" v-bind="config" :label="label" :disabled="disabled" v-on="$listeners">
           <slot></slot>
       </i-checkbox>
    </div>
</template>
<script lang="ts">
    import { Vue, Component,Watch,Prop,Emit} from "vue-property-decorator";
    import { Checkbox } from 'iview';
    import {CheckboxConfig} from './interface'
    import {ELEMENT_CLASS_PREFIX} from '../constants';
    @Component({
        components:{
            ICheckbox:Checkbox
        }
    })
    export default class SucCheckbox extends Vue {
        @Prop([String,Number,Boolean]) label!:string | number | boolean;
        @Prop(Boolean) disabled!:boolean;
        @Prop() config!:CheckboxConfig;
        /**
         * @description  不能 {required: true} 要不然checkbox-group会一直报错
         */
        @Prop() value!: any;
        wrapClass:string = `${ELEMENT_CLASS_PREFIX}checkbox`;
    }
</script>
