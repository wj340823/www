<template>
    <div :class="[wrapClass]">
        <i-menu ref="suc-menu-ref" v-bind="props" v-on="$listeners">
            <slot></slot>
        </i-menu>
    </div>
</template>
<script lang="ts">
    import { Vue, Component,Watch,Prop,Emit} from "vue-property-decorator";
    import {Menu} from 'iview';
    import {MenuConfig} from './interface';
    import {ELEMENT_CLASS_PREFIX} from '../constants';

    @Component({
        components:{
            IMenu:Menu
        }
    })
    export default class SucMenu extends Vue {
        @Prop({default:() => ({})}) config!:MenuConfig;
        wrapClass:string = `${ELEMENT_CLASS_PREFIX}menu`;
		get props(){
            return Object.assign({width:"auto"},this.config);
        }
        updateOpened(){
            const menuRef:any = this.$refs["suc-menu-ref"];
            this.$nextTick(() => {
                menuRef.updateOpened();
            });
        }
        updateActiveName(){
            const menuRef:any = this.$refs["suc-menu-ref"];
            this.$nextTick(() => {
                menuRef. updateActiveName();
            });
        }
    }
</script>
