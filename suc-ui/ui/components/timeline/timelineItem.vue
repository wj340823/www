<template>
    <i-timeline-item :class="[itemClass,{'timeline-item-solid':solid,'timeline-item-loading':animation}]" :color="color" >
        <template slot="dot">
            <slot name="dot"></slot>
        </template>
        <slot></slot>
    </i-timeline-item>
</template>
<script lang="ts">
    import { Vue, Component,Watch,Prop,Emit} from "vue-property-decorator";
    import {TimelineItem} from 'iview';
    @Component({
        components:{
            ITimelineItem:TimelineItem
        }
    })
    export default class SucTimelineItem extends Vue {
        @Prop(String) color!: string;
        @Prop(String) type!: 'primary' | 'success' | 'danger';
        @Prop(Boolean) solid!:boolean; //实心
        @Prop(Boolean) animation!:boolean;
        get itemClass(){
            return `timeline-item-${this.type || 'primary'}`;
        }
    }
</script>
