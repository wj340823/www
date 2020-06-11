<template>
    <suc-row style="margin-bottom:20px">
        <suc-col span="8">
            <suc-radio v-model="unchecked">unchecked</suc-radio>
        </suc-col>
        <suc-col span="8">
            <suc-radio v-model="checked">checked</suc-radio>
        </suc-col>
    </suc-row>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import { SucCol, SucIcon, SucRadio, SucRow } from "@suc/ui";
    import { RadioConfig } from "@suc/ui/components/radio/interface";
    @Component({
        components: {
            SucRadio,
            SucRow,
            SucCol
        }
    })
    export default class BaseRadio extends Vue {
        checked:boolean = true;
        unchecked:boolean = false;
        option:RadioConfig = {
            
        }
        
    }
</script>
<style lang="scss" scoped>
   
</style>
