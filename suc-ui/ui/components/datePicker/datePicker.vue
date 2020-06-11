<template>
    <div class="suc-datepicker suc-input">
        <DatePicker
            :value="value"
            v-bind="options"
            v-on="$listeners"
            transfer
        ></DatePicker>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop, Emit } from "vue-property-decorator";
import { DatePicker } from "iview";
import { DatePickerOptions } from "./interface";
@Component({
    components: { DatePicker }
})
export default class SucDatePicker extends Vue {
    @Prop({ required: true }) value!: any;
    @Prop() options?: DatePickerOptions;
}
</script>
