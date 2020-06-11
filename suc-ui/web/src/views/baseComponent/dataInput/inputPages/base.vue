<template>
    <div>
        <ul class="input-group">
            <li><label>默认状态：</label></li>
            <li>
                <suc-input 
                    label="姓名:"
                    :label-width="45"
                    placeholder="请输入姓名"
                    v-model="value">
                </suc-input>
                <br>
                <suc-input 
                    label="姓名:"
                    label-position="top"
                    placeholder="请输入姓名"
                    v-model="value">
                </suc-input>
            </li>
        </ul>
        <ul class="input-group">
            <li><label>禁用状态：</label></li>
            <li>
                <suc-input 
                    label="姓名:"
                    :label-width="45"
                    placeholder="请输入姓名"
                    disabled
                    v-model="value">
                </suc-input>
            </li>
        </ul>
        <ul class="input-group">
            <li><label>错误提示：</label></li>
            <li style="padding-left:73px">
                <suc-input 
                    is-error 
                    error-tip="用户名已被占用!"
                    placeholder="请输入姓名"
                    v-model="value">
                </suc-input>
            </li>
        </ul>
        <ul class="input-group">
            <li><label>必填项提示：</label></li>
            <li>
                <suc-input 
                    label="姓名:"
                    :label-width="54"
                    placeholder="请输入姓名"
                    v-model="value"
                    required >
                </suc-input>
                <br>
                <suc-input 
                    label="姓名:" 
                    label-position="top"
                    placeholder="请输入姓名"
                    v-model="value"
                    required >
                </suc-input>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import { SucInput } from "@suc/ui";
    import { InputConfig } from "@suc/ui/components/input/interface";
    @Component({
        components: {
            SucInput
        }
    })
    export default class InputBase extends Vue {
        value:string = "";
        option:InputConfig = {
            
        }
        
    }
</script>
<style lang="scss" scoped>
   .input-group {
        display: table;
        width: 100%;
        &:not(:first-of-type) {
            border-top: dashed 1px #dde4eb;
        }
        > li {
            display: table-cell;
            vertical-align: top;
            padding: 30px 20px;

            &:first-child {
                width: 120px;
                border-top: none;
            }
        }
    }
</style>
