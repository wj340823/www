<template>
    <div :class="[wrapClass,{'hide-header':hideheader}]">
        <i-drawer :class="{true:wrapClass}[config.transfer]" :value="value" v-bind="defaultConfig" v-on="$listeners" >
            <template slot="header">
               <slot name="header"></slot>
            </template>
            <template slot="close">
               <slot name="close"></slot>
            </template>
            <template slot="trigger">
               <slot name="trigger"></slot>
            </template>
            <slot></slot>
        </i-drawer>
    </div>
</template>
<script lang="ts">
    import { Vue, Component,Watch,Prop,Emit} from "vue-property-decorator";
    import {Drawer} from 'iview';
    import {ELEMENT_CLASS_PREFIX} from '../constants';
    import {DrawerConfig} from './interface'
    @Component({
        components:{
            IDrawer:Drawer
        }
    })
    export default class SucDrawer extends Vue {
        @Prop({required: true}) value!: any;
        @Prop({default:() => ({})}) config!:DrawerConfig;
        @Prop(Boolean) hideheader!:boolean;
        get defaultConfig(){
            this.config.inner ? this.config.transfer = false : null;
            !this.config.maskStyle ? this.config.maskStyle = {background:"rgba(0,0,0,0.5)"} : null;
            return this.config;
        }
        wrapClass:string = `${ELEMENT_CLASS_PREFIX}drawer`;
    }
</script>
