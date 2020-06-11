<template>
    <suc-row style="margin-bottom:20px">
        <suc-col span="8">
            <suc-radio :disabled="true" :value="unchecked">unchecked</suc-radio>
        </suc-col>
        <suc-col span="8">
            <suc-radio :disabled="true" v-model="checked">checked</suc-radio>
        </suc-col>
    </suc-row>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import { SucCol, SucIcon, SucRadio, SucRow } from "@suc/ui";
    import { RadioConfig,RadioGroupConfig} from "@suc/ui/components/radio/interface";
    @Component({
        components: {
            SucRadio,
            SucRow,
            SucCol,
            SucIcon
        }
    })
    export default class DisableRadio extends Vue {
        checked:boolean = true;
        unchecked:boolean = false;
        radioGroupOption:RadioGroupConfig = {
            
        }
        radioOption:RadioConfig = {
            
        }
        
    }
</script>
<style lang="scss" scoped>
  
</style>
