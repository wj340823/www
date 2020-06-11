<template>
    <div class="steps-container">
         <suc-steps :current="1" :list="stepList" :config="option"></suc-steps>
    </div>
</template>
<script lang="ts">
    import { Vue, Component} from "vue-property-decorator";
    import {SucSteps,SucStep} from "@suc/ui";
    import { StepsConfig,StepItem } from "@suc/ui/components/steps/interface";
    @Component({
        components: {
           SucSteps,
           SucStep
        }
    })
    export default class StepsDemo1 extends Vue {
        stepList:StepItem[] = [
            {
                title:"finished",
                content:"This is a description"
            },
            {
                title:"InProsgress",
                content:"This is a description"
            },
            {
                title:"Waiting",
                content:"This is a description"
            }
        ]
        option: StepsConfig = {
            center:true
        };
    }
</script>
<style lang="scss" scoped>
    .steps-container{
        padding:10px 40px;
    }
</style>
