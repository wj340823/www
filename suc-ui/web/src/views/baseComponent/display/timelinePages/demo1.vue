<template>
     <suc-timeline>
        <suc-timeline-item>
            <h6 class="title">建立XXXXX</h6>
            <p class="content">
                2017-07-10 张晓敏
            </p>
        </suc-timeline-item>
        <suc-timeline-item>
            <h6 class="title">提交修改</h6>
            <p class="content">
                2017-07-10 张晓敏
            </p>
        </suc-timeline-item>
        <suc-timeline-item>
            <h6 class="title">提交修改</h6>
            <p class="content">
                2017-07-10 张晓敏
            </p>
        </suc-timeline-item>
        <suc-timeline-item solid>
            <h6 class="title">提交修改</h6>
            <p class="content">
                2017-07-10 张晓敏
            </p>
        </suc-timeline-item>
    </suc-timeline>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import {SucTimelineItem,SucTimeline } from "@suc/ui";
    @Component({
        components: {
            SucTimelineItem,SucTimeline
        }
    })
    export default class TimelineDemo1 extends Vue {
       
        
    }
</script>
<style lang="scss" scoped>
    .content {
        padding: 6px 0;
        color: rgba(24, 43, 81, .5);
    }

    .title {
        color: #182b51;
    }
</style>
