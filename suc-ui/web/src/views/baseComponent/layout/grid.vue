<template>
    <view-page class="grid-demo" title="Grid 栅格">
        <template v-for="(part, index) in partsList">
            <demo-part :id="part.id" :title="part.title" :desc="part.desc" :code="codes[index]">
                <component :is="part.component"></component>
            </demo-part>
        </template>

        <demo-api type="SucRow" subtype="SucCol"></demo-api>
    </view-page>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import anchorSets from '@/utils/anchor';
    import components, {codes} from "./gridPages";

    @Component({
        components: {...components}
    })
    export default class DemoGrid extends Vue {
        codes: any[] = [];
        partsList = anchorSets.grid.anchor;

        created() {
            this.codes = codes;
        }
    }
</script>
<style lang="scss">
    .grid-demo .main-left {
        .ivu-col {
            padding: 10px 0;
            text-align: center;
            background: rgba(0,153,229,.9);
            color: white;
            &:nth-child(odd), &:nth-child(odd)>div {
                background: rgba(0,153,229,.7);
            }
            >div {
                padding: 10px 0;
                background: rgba(0,153,229,.9);
            }
        }
        .gutter .ivu-col {
            background: transparent;
        }
    }
</style>
