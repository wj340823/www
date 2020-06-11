<template>
    <div :class="wrapClass">
       <cascader :value="value" :data="data" :disabled="disabled" :clearable="clearable" :trigger="trigger"
                 :transfer="transfer" :change-on-select="changeOnSelect" :filterable="filterable" v-bind="config" v-on="$listeners">
           <slot></slot>
       </cascader>
    </div>
</template>
<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";
    import { Cascader } from 'iview';
    import {ELEMENT_CLASS_PREFIX} from '../constants';
    import {CascaderConfig} from './interface';

    @Component({
        components:{
            Cascader
        }
    })
    export default class SucCascader extends Vue {
        @Prop({default: ()=>[]}) value?: any[];
        @Prop({default: ()=>[]}) data?: any[];
        @Prop({default:false}) disabled?:boolean;
        @Prop({default:true}) clearable?:boolean;
        @Prop({default:'click'}) trigger?:string;
        @Prop() transfer?:boolean;
        @Prop({default:false}) changeOnSelect?:boolean;
        @Prop({default:false}) filterable?:boolean;
        @Prop({default: () => ({})}) config?: CascaderConfig;

        wrapClass:string = `${ELEMENT_CLASS_PREFIX}cascader ${ELEMENT_CLASS_PREFIX}input`;
    }
</script>
