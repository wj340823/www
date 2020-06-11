<template>
    <suc-timeline pending>
        <suc-timeline-item type="success">
            <h6 class="left-time">2017-07-10</h6>
            <h6 class="title">提交成功</h6>
            <p class="content">
                2017-07-10 张晓敏
            </p>
        </suc-timeline-item>
        <suc-timeline-item type="success">
            <h6 class="title">XX成功</h6>
            <p class="content">
                2017-07-10 张晓敏
            </p>
        </suc-timeline-item>
        <suc-timeline-item type="danger">
            <h6 class="left-time">2017-07-10</h6>
            <h6 class="title">XX错误</h6>
            <p class="content">
                2017-07-10 张晓敏
            </p>
        </suc-timeline-item>
        <suc-timeline-item type="primary">
            <h6 class="title">等待修改</h6>
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
    export default class TimelineDemo4 extends Vue {
       
        
    }
</script>
<style lang="scss" scoped>
    .left-time {
        position: absolute;
        left: -70px;
        top: 0;
    }

    .content {
        padding: 6px 0;
        color: rgba(24, 43, 81, .5);
    }

    .title {
        color: #182b51;
    }
</style>
