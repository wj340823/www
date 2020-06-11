<template>
    <div :class="[wrapClass]">
       <i-radio :value="value" v-bind="config" :disabled="disabled" :label="label" v-on="$listeners">
           <slot></slot>
       </i-radio>
    </div>
</template>
<script lang="ts">
    import { Vue, Component,Watch,Prop,Emit} from "vue-property-decorator";
    import { Radio } from 'iview';
    import {RadioConfig} from './interface'
    import {ELEMENT_CLASS_PREFIX} from '../constants';
    @Component({
        components:{
            IRadio:Radio
        }
    })
    export default class SucRadio extends Vue {
        @Prop([String,Number]) label!:string | number;
        @Prop(Boolean) disabled!:boolean;
        @Prop() config!:RadioConfig;
        /**
         * @description  不能 {required: true} 要不然radio-group会一直报错
         */
        @Prop() value!: any;
        wrapClass:string = `${ELEMENT_CLASS_PREFIX}radio`;
    }
</script>
