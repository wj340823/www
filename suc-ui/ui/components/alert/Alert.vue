<template>
    <div :class="wrapClass">
        <Alert :type="type" :closable="closable" :showIcon="showIcon" :banner="banner" v-on="$listeners">
            <slot></slot>
            <template slot="desc"><slot name="desc"></slot></template>
            <template slot="icon">
                <slot name="icon"><i class="iconfont" :class="iconClass"></i></slot>
            </template>
            <template slot="close">
                <slot name="close"><i class="iconfont iconclose"></i></slot>
            </template>
        </Alert>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {Alert} from "iview";
    import {ELEMENT_CLASS_PREFIX} from '../constants';

    @Component({
        components:{
            Alert
        }
    })
    export default class SucAlert extends Vue {
        @Prop({default:'info'}) type?: 'info'|'success'|'warning'|'error';
        @Prop({default:false}) closable?: string;
        @Prop({default:false}) showIcon?: string;
        @Prop({default:false}) banner?: string;

        wrapClass:string = `${ELEMENT_CLASS_PREFIX}alert`;

        get iconClass(){
            let classNm = "icontip-";
            if(this.type=="info"){
                classNm = this.$slots.desc?'icontip':'icontip-';
            }else if(this.type=="success"){
                classNm = this.$slots.desc?'iconsuccess':'iconsuccess-';
            }else if(this.type=="warning"){
                classNm = this.$slots.desc?'iconwarning':'iconwarning-';
            }else if(this.type=="error"){
                classNm = this.$slots.desc?'iconerror':'iconerror-';
            }

            return classNm;
        }
    }
</script>
<style lang="scss" scoped>

</style>
