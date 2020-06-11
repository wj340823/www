<template>
    <suc-row>
        <suc-col span="8">
            <suc-checkbox :disabled="true" :value="unchecked">unchecked</suc-checkbox>
        </suc-col>
        <suc-col span="8">
            <suc-checkbox v-model="checked" disabled>checked</suc-checkbox>
        </suc-col>
         <suc-col span="8">
            <suc-checkbox :config="option" disabled >indeterminate</suc-checkbox>
        </suc-col>
    </suc-row>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import { SucCol, SucIcon, SucCheckbox, SucRow } from "@suc/ui";
    import { CheckboxConfig,CheckboxGroupConfig} from "@suc/ui/components/checkbox/interface";
    @Component({
        components: {
            SucCheckbox,
            SucRow,
            SucCol,
            SucIcon
        }
    })
    export default class DisableCheckbox extends Vue {
        checked:boolean = true;
        unchecked:boolean = false;
        option:CheckboxConfig = {
            indeterminate:true
        }
        
    }
</script>
<style lang="scss" scoped>
  
</style>
