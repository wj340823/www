<template>
    <suc-timeline>
        <suc-timeline-item type="success">
            <suc-icon type="ios-checkmark-circle" slot="dot"/>
            <h6 class="title">提交成功</h6>
            <p class="content">
                2017-07-10 张晓敏
            </p>
        </suc-timeline-item>
        <suc-timeline-item type="success">
            <suc-icon type="ios-checkmark-circle" slot="dot"/>
            <h6 class="title">XX成功</h6>
            <p class="content">
                2017-07-10 张晓敏
            </p>
        </suc-timeline-item>
        <suc-timeline-item type="danger">
            <suc-icon type="ios-close-circle" slot="dot"/>
            <h6 class="title">XX错误</h6>
            <p class="content">
                2017-07-10 张晓敏
            </p>
        </suc-timeline-item>
        <suc-timeline-item type="primary" animation>
            <suc-icon type="ios-loading" class="custom-loading" slot="dot"/>
            <h6 class="title">等待修改</h6>
            <p class="content">
                2017-07-10 张晓敏
            </p>
        </suc-timeline-item>
    </suc-timeline>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import {SucTimelineItem,SucTimeline ,SucIcon} from "@suc/ui";
    @Component({
        components: {
            SucTimelineItem,SucTimeline,SucIcon
        }
    })
    export default class TimelineDemo3 extends Vue {
       
        
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

    .custom-loading {
        font-family: "iconfont" !important;
        font-style: normal;
        font-size: 18px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        &:before {
            content: '\e6ad' !important;
        }
    }
</style>
