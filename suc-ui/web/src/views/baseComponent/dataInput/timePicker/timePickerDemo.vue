<template>
    <suc-time-picker
        v-model="date"
        :options="options"
    ></suc-time-picker>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { SucTimePicker } from "@suc/ui";
import { TimePickerOptions } from "@suc/ui/components/timePicker/interface";

@Component({
    components: {
        SucTimePicker
    }
})
export default class timePicker extends Vue {
    date: string = "";

    options: TimePickerOptions = {
        type: "time"
    };
}
</script>
