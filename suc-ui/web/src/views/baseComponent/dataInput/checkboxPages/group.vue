<template>
    <suc-row>
        <suc-col span="12">
            <suc-checkbox-group v-model="checkboxGroupValue1">
                <suc-checkbox label="apple">
                    <suc-icon type="logo-apple"></suc-icon>
                    苹果
                </suc-checkbox>
                <suc-checkbox label="banana">香蕉</suc-checkbox>
                <suc-checkbox label="'orange" disabled>橘子</suc-checkbox>
            </suc-checkbox-group>
        </suc-col>
        <suc-col span="12">
            <suc-checkbox-group v-model="checkboxGroupValue2" vertical>
                <suc-checkbox label="apple">
                    <suc-icon type="logo-apple"></suc-icon>
                    苹果
                </suc-checkbox>
                <suc-checkbox label="banana">香蕉</suc-checkbox>
                <suc-checkbox label="'orange" disabled>橘子</suc-checkbox>
            </suc-checkbox-group>
        </suc-col>
    </suc-row>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import { SucCol, SucIcon, SucCheckbox,  SucCheckboxGroup,SucRow } from "@suc/ui";
    import { CheckboxConfig,CheckboxGroupConfig} from "@suc/ui/components/checkbox/interface";
    @Component({
        components: {
            SucCheckbox,
            SucCheckboxGroup,
            SucRow,
            SucCol,
            SucIcon
        }
    })
    export default class Groupcheckbox extends Vue {
        checkboxGroupValue1: string[] = ["apple", "banana"];
        checkboxGroupValue2: string[] = ["apple", "banana"];
        checkboxGroupOption:CheckboxGroupConfig = {
            
        }
        checkboxOption:CheckboxConfig = {
            
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
