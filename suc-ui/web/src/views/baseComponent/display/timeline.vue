<template>
    <view-page title="Timeline 时间轴">
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
        <demo-api type="SucTimeline"></demo-api>
        <demo-api type="SucTimelineItem" data-key="timelineItem"></demo-api>
    </view-page>
</template>
<script lang="ts">
   import { Vue, Component} from "vue-property-decorator";
    import anchorSets from "@/utils/anchor";
    import components, { codes } from "./timelinePages";
    @Component({
        components: {
            ...components
        }
    })
    export default class DemoTimeline extends Vue {
        partsList = anchorSets.timeline.anchor;
        codes: any[] = codes;
    }
</script>
<style lang="scss" scoped>
   ::v-deep .suc-timeline{
       margin-left:80px;
   }
</style>
