<template>
    <i-checkbox-group :class="[wrapClass,{'vertical':vertical}]" :value="value" v-bind="config" v-on="$listeners">
        <slot></slot>
    </i-checkbox-group>
</template>
<script lang="ts">
    import { Vue, Component,Watch,Prop,Emit} from "vue-property-decorator";
    import { CheckboxGroup } from 'iview';
    import {CheckboxGroupConfig} from './interface'
    import {ELEMENT_CLASS_PREFIX} from '../constants';
    @Component({
        components:{
            ICheckboxGroup:CheckboxGroup
        }
    })
    export default class SucRadioGroup extends Vue {
        @Prop() config!:CheckboxGroupConfig;
        @Prop(Boolean) vertical!:boolean;
        @Prop({required: true}) value!: any;
        wrapClass:string = `${ELEMENT_CLASS_PREFIX}checkbox-group`;
    }
</script>