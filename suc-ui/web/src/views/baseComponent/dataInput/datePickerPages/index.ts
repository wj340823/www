import BaseDatePickerDemo from "./base.vue";
import YearDatePickerDemo from "./year.vue";
import MonthDatePickerDemo from "./month.vue";

import baseCode from "!!raw-loader!./base.vue";
import yearCode from "!!raw-loader!./year.vue";
import monthCode from "!!raw-loader!./month.vue";

export const codes = [baseCode, yearCode, monthCode];

export default {
    BaseDatePickerDemo,
    YearDatePickerDemo,
    MonthDatePickerDemo,
};