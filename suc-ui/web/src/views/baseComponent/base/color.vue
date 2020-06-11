<template>
    <view-page title="Color 色彩">
        <div class="color-group" v-for="(group,index) in groups" :key="index">
            <h6 class="title">
                {{group.title}}<span v-if="group.remark">({{group.remark}})</span>
            </h6>
            <ul>
                <li class="color-item" v-for="(item,index) in group.colors" :key="index">
                    <div>
                        <span class="color-pannel" :class="item.class"></span>
                    </div>
                    <div>
                        <p>{{item.remark}}</p>
                        <span>{{item.color}}</span>
                    </div>
                </li>
            </ul>
        </div>
    </view-page>
</template>
<script lang="ts">
    import { Vue, Component, Watch } from "vue-property-decorator";

    @Component({
        components: {}
    })
    export default class DemoColor extends Vue {
        groups: any[] = [
            {
                title: "主色",
                colors: [
                    {
                        remark: "Primary 主色调",
                        class: "color1-1",
                        color: "#588AF6"
                    },
                    {
                        remark: "Light Primary 常用于hover",
                        class: "color1-2",
                        color: "#4078F1"
                    },
                    {
                        remark: "Dark Primary 常用于active",
                        class: "color1-3",
                        color: "#4078F1"
                    },
                    {
                        remark: "主题渐变色",
                        class: "color1-4",
                        color: "#4F83F5-#6897F8"
                    }
                ]
            },
            {
                title: "辅助色",
                remark: "功能表意",
                colors: [
                    {
                        remark: "用于成功/安全等表意",
                        class: "color2-1",
                        color: "#1FBE07"
                    },
                    {
                        remark: "用于正常/一般/等待等表意",
                        class: "color2-2",
                        color: "#4EABFF"
                    },
                    {
                        remark: "用于告警等表意",
                        class: "color2-3",
                        color: "#FFAA00"
                    },
                    {
                        remark: "用于错误提示等表意",
                        class: "color2-4",
                        color: "#FF545A"
                    }
                ]
            },
            {
                title: "中性色",
                remark: "文本、边框、分割线等",
                colors: [
                    {
                        remark: "主要文字颜色，一级",
                        class: "color3-1",
                        color: "#182B51"
                    },
                    {
                        remark: "辅助文字，二级",
                        class: "color3-2",
                        color: "#182B51，50%不透明度"
                    },
                    {
                        remark: "占位文字、不失效文字等，三级",
                        class: "color3-3",
                        color: "#182B51，30%不透明度"
                    },
                    {
                        remark: "链接、操作",
                        class: "color3-4",
                        color: "#5085F8"
                    },
                    {
                        remark: "分割线、边框等",
                        class: "color3-5",
                        color: "#DDE4EB"
                    },
                    {
                        remark: "需要被识别的灰色元素（light）",
                        class: "color3-6",
                        color: "#CCCCCC"
                    },
                    {
                        remark: "需要被识别的灰色元素（dark）",
                        class: "color3-7",
                        color: "#A6A6A7"
                    },
                    {
                        remark: "表头、卡片底色等",
                        class: "color3-8",
                        color: "#F8F8F9"
                    }
                ]
            },
            {
                title: "彩色组",
                remark: "用于需要用颜色区分类且与功能辅助不冲突时",
                colors: [
                    {
                        remark: "绿",
                        class: "color4-1",
                        color: "#42CB19"
                    },
                    {
                        remark: "蓝",
                        class: "color4-2",
                        color: "#1097FF"
                    },
                    {
                        remark: "紫",
                        class: "color4-3",
                        color: "#8462FF"
                    },
                    {
                        remark: "红",
                        class: "color4-4",
                        color: "#FF6E83"
                    },
                    {
                        remark: "橙",
                        class: "color4-5",
                        color: "#FF9F10"
                    }
                ]
            }
        ]

    }
</script>
<style lang="scss" scoped>
    @import "~@suc/ui/styles/variables";

    .color-group {
        margin-bottom: 40px;
        overflow: hidden;

        > .title {
            font-size: 16px;
            padding: 12px 0;
            color: $theme-text-primary;

            > span {
                font-size: 14px;
                color: $theme-text-help;
                padding-left: 10px;
            }
        }
    }

    .color-item {
        display: table;
        float: left;
        width: 25%;
        margin-bottom: 20px;

        > div {
            display: table-cell;
            vertical-align: middle;
            color: $theme-text-primary;

            &:first-child {
                width: 1px;
                padding-right: 10px;
            }
        }
    }

    .color-pannel {
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 4px;

        &.color1-1 {
            background: $theme-primary;
        }

        &.color1-2 {
            background: $theme-primary-light;
        }

        &.color1-3 {
            background: $theme-primary-dark;
        }

        &.color1-4 {
            background-image: linear-gradient(0deg,
                    #4f83f5 0%,
                    #6897f8 100%);
        }

        &.color2-1 {
            background: $theme-success;
        }

        &.color2-2 {
            background: $theme-info;
        }

        &.color2-3 {
            background: $theme-warning;
        }

        &.color2-4 {
            background: $theme-danger;
        }

        &.color3-1 {
            background: $theme-text-primary
        }

        &.color3-2 {
            background: $theme-text-help;
        }

        &.color3-3 {
            background: $theme-text-place;
        }

        &.color3-4 {
            background: $theme-text-link;
        }

        &.color3-5 {
            background: $theme-border-color;
        }

        &.color3-6 {
            background: $theme-gray-light;
        }

        &.color3-7 {
            background: $theme-gray-dark;
        }

        &.color3-8 {
            background: $theme-gray-bg;
        }

        &.color4-1 {
            background: $theme-other-green;
        }

        &.color4-2 {
            background: $theme-other-blue;
        }

        &.color4-3 {
            background: $theme-other-purple;
        }

        &.color4-4 {
            background: $theme-other-red;
        }

        &.color4-5 {
            background: $theme-other-orange;
        }
    }

</style>
