<template>
    <div :class="[wrapClass]">
        <i-breadcrumb :separator="separator">
            <template v-if="list">
                <i-breadcrumb-item v-for="(item,index) in list" :key="index" v-bind="item">{{item.label}}</i-breadcrumb-item>
            </template>
            <slot else></slot>
        </i-breadcrumb>
    </div>
</template>
<script lang="ts">
    import { Vue, Component,Watch,Prop,Emit} from "vue-property-decorator";
    import {Breadcrumb,BreadcrumbItem} from 'iview';
    import {BreadcrumbItemData} from './interface';
    import {ELEMENT_CLASS_PREFIX} from '../constants';
    @Component({
        components:{
            IBreadcrumb:Breadcrumb,
            IBreadcrumbItem:BreadcrumbItem
        }
    })
    export default class SucBreadcrumb extends Vue {
        @Prop(String) separator!:string;
        @Prop() list!:BreadcrumbItemData[];
        wrapClass:string = `${ELEMENT_CLASS_PREFIX}breadcrumb`;
    }
</script>