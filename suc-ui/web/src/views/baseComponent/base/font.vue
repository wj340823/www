<template>
    <view-page title="Font 字体">
        <h5 style="margin:10px 0 24px 0" class="suc-font-title">默认字体：微软雅黑<span style="padding-left:10px;" class="suc-font-help">(中英文都是)</span></h5>
        <div class="font-pannel" v-for="(font,index) in fonts" :key="index">
            <span :class="font.class">{{font.title}}</span>
            <p class="suc-font-text">{{font.remark}}</p>
        </div>
    </view-page>
</template>
<script lang="ts">
    import { Vue, Component,Watch} from "vue-property-decorator";
    @Component({
        components:{}
    })
    export default class DemoColor extends Vue {
        fonts:any[] = [
            {
                title:"主标题是雅黑",
                class:"suc-font-title",
                remark:"主标题：16px, bold，#182B51"
            },
            {
                title:"次标题雅黑",
                class:"suc-font-subtitle",
                remark:"次标题：14px，bold，#182B51"
            },
            {
                title:"正文是雅黑",
                class:"suc-font-text",
                remark:"正文：14px，regular，#182B51"
            },
            {
                title:"辅助文字还是雅黑",
                class:"suc-font-help",
                remark:"辅助文字：14px, regular，#182B51,50% "
            },
            {
                title:"都失效了还能不是雅黑么",
                class:"suc-font-place",
                remark:"失效、占位文字：14px, regular，#182B51,30%"
            },
            {
                title:"链接能不能不雅黑",
                class:"suc-font-link",
                remark:"链接、操作文字：14px, regular，#5085F8"
            },
            {
                title:"其实只有雅黑",
                class:"suc-font-error",
                remark:"错误提示：14px, regular，#FF545A"
            }
        ]

    }
</script>
<style lang="scss" scoped>
    .font-pannel{
        display:inline-block;
        width:33.33%;
        margin-bottom:10px;
        >span{
            display:block;
            width: 240px;
            height: 88px;
            line-height:88px;
            text-align:center;
            background-color: #f8f8f9;
        }
        >p{
            padding:16px 0;
        }
    }


</style>
