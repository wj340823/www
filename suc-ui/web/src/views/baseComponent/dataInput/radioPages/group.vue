<template>
    <suc-row style="margin-bottom:20px">
        <suc-col span="12">
            <suc-radio-group v-model="radioGroupValue1">
                <suc-radio label="apple">
                    <suc-icon type="logo-apple"></suc-icon>
                    苹果
                </suc-radio>
                <suc-radio label="banana">香蕉</suc-radio>
                <suc-radio label="'orange" disabled>橘子</suc-radio>
            </suc-radio-group>
        </suc-col>
        <suc-col span="12">
            <suc-radio-group v-model="radioGroupValue2" :config="radioGroupOption">
                <suc-radio label="apple">
                    <suc-icon type="logo-apple"></suc-icon>
                    苹果
                </suc-radio>
                <suc-radio label="banana">香蕉</suc-radio>
                <suc-radio label="'orange" disabled>橘子</suc-radio>
            </suc-radio-group>
        </suc-col>
    </suc-row>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import { SucCol, SucIcon, SucRadio,  SucRadioGroup,SucRow } from "@suc/ui";
    import { RadioConfig,RadioGroupConfig} from "@suc/ui/components/radio/interface";
    @Component({
        components: {
            SucRadio,
            SucRadioGroup,
            SucRow,
            SucCol,
            SucIcon
        }
    })
    export default class GroupRadio extends Vue {
        radioGroupValue1: string = "apple";
        radioGroupValue2: string = "apple";
        radioGroupOption:RadioGroupConfig = {
            vertical:true
        }
        radioOption:RadioConfig = {
            
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
