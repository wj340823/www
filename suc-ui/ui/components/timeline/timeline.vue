<template>
    <div :class="wrapClass">
        <i-timeline :pending="pending">
            <slot></slot>
        </i-timeline>
    </div>
</template>
<script lang="ts">
    import { Vue, Component,Watch,Prop,Emit} from "vue-property-decorator";
    import {Timeline} from 'iview';
    import {ELEMENT_CLASS_PREFIX} from '../constants';
    @Component({
        components:{
            ITimeline:Timeline
        }
    })
    export default class SucTimeline extends Vue {
        @Prop(Boolean) pending!: boolean;
        wrapClass:string = `${ELEMENT_CLASS_PREFIX}timeline`;
    }
</script>
