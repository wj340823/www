<template>
    <div :class="[wrapClass,{'steps-center':props.center,'steps-pending':props.pending,'steps-simple':props.simple}]">
        <i-steps v-bind="props" :current="current" :status="status">
            <template v-if="list">
                <i-step v-for="(step,index) in list" :key="index" v-bind="step"></i-step>
            </template>
            <slot else></slot>
        </i-steps>
    </div>
</template>
<script lang="ts">
    import { Vue, Component, Watch, Prop, Emit } from "vue-property-decorator";
    import { Steps, Step } from 'iview';
    import { StepsConfig, StepItem } from './interface';
    import { ELEMENT_CLASS_PREFIX } from '../constants';

    @Component({
        components: {
            ISteps: Steps,
            IStep: Step
        }
    })
    export default class SucSteps extends Vue {
        @Prop({default: () => ({})}) config!: StepsConfig;
        @Prop(Number) current!: number;
        @Prop(String) status!: string;
        @Prop() list!: StepItem[];

        get props() {
            return Object.assign({pending: true}, this.config);
        }

        wrapClass: string = `${ELEMENT_CLASS_PREFIX}steps`;
    }
</script>
