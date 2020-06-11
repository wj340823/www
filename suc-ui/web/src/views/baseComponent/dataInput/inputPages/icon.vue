<template>
    <div>
        <ul class="input-group">
            <li><label>默认状态：</label></li>
            <li>
                <suc-input 
                    label="选择时间:" 
                    v-model="date"
                    :config="option">
                </suc-input>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import { SucInput } from "@suc/ui";
    import { InputConfig } from "@suc/ui/components/input/interface";
    @Component({
        components: {
            SucInput
        }
    })
    export default class InputIcon extends Vue {
        date:string = "2019-10-10";
        option:InputConfig = {
            icon:'ios-clock-outline'
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
