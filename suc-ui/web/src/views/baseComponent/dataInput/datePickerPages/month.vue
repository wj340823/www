<template>
    <suc-date-picker
        v-model="date"
        :options="options"
    ></suc-date-picker>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { SucDatePicker } from "@suc/ui";
import { DatePickerOptions } from "@suc/ui/components/datePicker/interface";
@Component({
    components: {
        SucDatePicker
    }
})
export default class MonthDatePickerDemo extends Vue {
    date: string = "";
    options: DatePickerOptions = {
        type: "month"
    };
}
</script>