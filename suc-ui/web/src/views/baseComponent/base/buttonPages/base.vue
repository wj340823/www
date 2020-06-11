<template>
    <div>
        <div class="button-pannel" v-for="(button,index) in buttons" :key="index">
            <suc-button
                :type="button.type"
                :config="button.iviewProps"
                :dashed="button.dashed"
                :debounce="800"
                @on-click="onclick">{{button.label}}
            </suc-button>
            <p class="suc-font-text">{{button.remark}}</p>
        </div>
    </div>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import {SucButton } from "@suc/ui";
    import { ButtonConfig } from "@suc/ui/components/button/interface";
    @Component({
        components: {
            SucButton
        }
    })
    export default class BaseButton extends Vue {
        clickCount:number = 0;
        option: ButtonConfig = {

        };
        buttons: any[] = [
            {
                label: "确认",
                remark: "主按钮",
                type: "primary"
            },
            {
                label: "确认",
                remark: "次按钮",
                type: "primary",
                iviewProps: {
                    ghost: true
                }
            },
            {
                label: "确认",
                remark: "次按钮2",
                type: "primary2"
            },
            {
                label: "确认",
                remark: "虚线按钮",
                dashed: true,
                type: "primary"
            },
            {
                label: "确认",
                remark: "危险按钮",
                type: "error"
            },
            {
                label: "导出",
                remark: "文字按钮",
                type: "text"
            },
            {
                label: "搜索",
                remark: "搜索按钮",
                type: "primary",
                iviewProps: {
                    icon: "ios-search",
                    ghost: true
                }
            }
        ];
        onclick(){
            this.clickCount ++;
            console.log(this.clickCount);
        }
    }
</script>
<style lang="scss" scoped>
  .button-pannel {
        display: inline-block;
        margin-right: 16px;
        > p {
            margin-top: 15px;
            text-align: center;
        }
    }
</style>
