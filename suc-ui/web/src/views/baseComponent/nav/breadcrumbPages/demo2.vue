<template>
    <div class="breadcrumb-container">
       <suc-breadcrumb separator=">">
            <suc-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index" :to="item.to">{{item.label}}</suc-breadcrumb-item>
        </suc-breadcrumb>
    </div>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import {SucBreadcrumb,SucBreadcrumbItem} from "@suc/ui";
    import {BreadcrumbItemData} from "@suc/ui/components/breadcrumb/interface";
    @Component({
        components: {
           SucBreadcrumb,
           SucBreadcrumbItem
        }
    })
    export default class BreadcrumbDemo2 extends Vue {
        breadcrumbList:BreadcrumbItemData[] = [
            {
                label:"一级菜单",
                to:"/main/nav/breadcrumb"
            },
            {
                label:"二级菜单",
                to:"/main/nav/breadcrumb"
            },
            {
                label:"三级菜单",
                to:"/main/nav/breadcrumb"
            }
        ]
    }
</script>
<style lang="scss" scoped>
    .breadcrumb-container{
        padding:10px 40px;
    }
</style>
