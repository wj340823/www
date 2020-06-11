<template>
    <div class="suc-datepicker suc-input">
        <TimePicker
            :value="value"
            v-bind="options"
            v-on="$listeners"
            transfer
        ></TimePicker>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop, Emit } from "vue-property-decorator";
import { TimePicker } from "iview";
import { TimePickerOptions } from "./interface";
@Component({
    components: { TimePicker }
})
export default class SucTimePicker extends Vue {
    @Prop({ required: true }) value!: any;
    @Prop() options?: TimePickerOptions;
}
</script>
