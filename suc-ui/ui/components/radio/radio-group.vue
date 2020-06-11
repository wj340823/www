<template>
    <i-radio-group :class="wrapClass" :value="value" v-bind="config" v-on="$listeners">
        <slot></slot>
    </i-radio-group>
</template>
<script lang="ts">
    import { Vue, Component,Watch,Prop,Emit} from "vue-property-decorator";
    import { RadioGroup } from 'iview';
    import {RadioGroupConfig} from './interface'
    import {ELEMENT_CLASS_PREFIX} from '../constants';
    @Component({
        components:{
            IRadioGroup:RadioGroup
        }
    })
    export default class SucRadioGroup extends Vue {
        @Prop() config!:RadioGroupConfig;
        @Prop({required: true}) value!: any;
        wrapClass:string = `${ELEMENT_CLASS_PREFIX}radio-group`;
    }
</script>
