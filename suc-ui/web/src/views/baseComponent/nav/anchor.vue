<template>
    <view-page title="Anchor 锚点">
        <template v-for="(part, index) in partsList">
            <demo-part :id="part.id" :title="part.title" :desc="part.desc" :code="codes[index]">
                <component :is="part.component"></component>
            </demo-part>
        </template>

        <demo-api title="SucAnchor" subtitle="SucAnchorLink"></demo-api>
    </view-page>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import anchorSets from "@/utils/anchor";
    import components, {codes} from "./anchorPages";

    @Component({
        components:{
            ...components
        }
    })
    export default class DemoAnchor extends Vue {
        codes: any[] = codes;
        partsList = anchorSets.anchor.anchor;
    }
</script>
<style lang="scss">
    .testDiv {
        height: 400px;
        margin-bottom: 10px;
        border: 1px solid blue;
    }
</style>
