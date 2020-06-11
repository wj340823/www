<template>
    <view-page title="TimePicker 时间选择器">
        <template>
            <demo-part
                title="其余状态与输入框类似。"
                :code="code"
            >
                <div class="form-demo">
                    <time-picker-demo></time-picker-demo>
                </div>
            </demo-part>
        </template>
        <demo-api type="timePicker"></demo-api>
    </view-page>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import timePickerDemo from "./timePicker/timePickerDemo.vue";
import timePickerDemoCode from "!!raw-loader!./timePicker/timePickerDemo.vue";
@Component({
    components: {
        timePickerDemo
    }
})
export default class timePicker extends Vue {
    code: any = timePickerDemoCode;
}
</script>
