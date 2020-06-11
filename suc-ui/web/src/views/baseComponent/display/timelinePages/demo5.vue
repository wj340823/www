<template>
     <suc-timeline pending>
        <suc-timeline-item type="success">
            <h6 class="title">提交成功</h6>
            <p class="card">
                此处是具体信息
            </p>
        </suc-timeline-item>
        <suc-timeline-item type="success">
            <h6 class="title">XX成功</h6>
            <p class="card">
                此处是具体信息
            </p>
        </suc-timeline-item>
        <suc-timeline-item type="danger">
            <h6 class="title">XX错误</h6>
            <p class="card">
                此处是具体信息
            </p>
        </suc-timeline-item>
        <suc-timeline-item type="primary">
            <h6 class="title">等待修改</h6>
            <p class="card">
                此处是具体信息
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
    export default class TimelineDemo5 extends Vue {
       
        
    }
</script>
<style lang="scss" scoped>
    .title {
        color: #182b51;
    }

    .card {
        width: 274px;
        height: 70px;
        padding: 6px 10px;
        background-color: #f8f8f9;
        border-radius: 4px;
        color: rgba(24, 43, 81, .5);
    }
</style>
