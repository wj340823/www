<template>
    <view-page title="Input 输入框">
        <div class="demo-group">
            <template v-for="(part, index) in partsList">
                <demo-part
                    :id="part.id"
                    :title="part.title"
                    :desc="part.desc"
                    :code="codes[index]"
                    :key="index"
                >
                    <component :is="part.component"></component>
                </demo-part>
            </template>
           <demo-api type="SucInput"></demo-api>
        </div>
    </view-page>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import anchorSets from "@/utils/anchor";
    import components, { codes } from "./inputPages";
    @Component({
        components: {
            ...components
        }
    })
    export default class DemoInput extends Vue {
        partsList = anchorSets.input.anchor;
        codes: any[] = codes;
    }
</script>
<style lang="scss" scoped>
    .demo-group {
        margin-bottom: 30px;
    }
</style>
