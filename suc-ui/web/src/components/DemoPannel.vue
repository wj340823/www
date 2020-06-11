<template>
    <div class="demo-pannel">
        <div class="header">
            <slot name="header">
                <p class="title">{{title}}<span class="sub-title">{{subTitle}}</span></p>
            </slot>
            <span class="h-btn">
                交互说明
                <suc-icon type="ios-arrow-forward" />
            </span>
        </div>
        <div class="main">
            <slot></slot>
        </div>
        <div class="footer">
            <suc-icon type="ios-paper-outline" @click="copy" />
            &nbsp;&nbsp;
            <suc-icon type="ios-code" @click="showDetail" />
        </div>
    </div>
</template>
<script lang="ts">
    import { Vue, Component,Prop,Emit} from "vue-property-decorator";
    import { SucIcon } from "@suc/ui";

    @Component({
        components: {
            SucIcon
        }
    })
    export default class DemoPannel extends Vue {
        @Prop(String) title!:string;
        @Prop(String) subTitle!:string;

        @Emit("on-copy")
        copy(){

        }
        @Emit("on-detail")
        showDetail(){

        }
    }
</script>
<style lang="scss" scoped>
    .demo-pannel{
        >.header{
            position:relative;
            padding:12px 0;
            font-size: 16px;
            color: #182b51;
            >.title{
                font-weight: bold;
                height: 24px;
                padding-right:100px;
                >.sub-title{
                    font-weight: normal;
                }
            }
            >.h-btn{
                position: absolute;
                right:0;
                top:12px;
                cursor: pointer;
                user-select: none;
            }
        }
        >.main{
            min-height: 150px;
            padding:10px 10px 42px 10px;
            background-color: #ffffff;
            border-radius: 4px;
            border: solid 1px #dde4eb;
        }
        >.footer{
            font-size: 16px;
            height: 32px;
            line-height: 32px;
            padding:0 16px;
            text-align: right;
            margin-top:-32px;
            border-top: solid 1px #dde4eb;
        }
    }

</style>
