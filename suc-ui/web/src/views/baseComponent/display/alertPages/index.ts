import BasicAlertDemo from './basic.vue';
import DescAlertDemo from './desc.vue';
import IconAlertDemo from './icon.vue';
import ClosableAlertDemo from './closable.vue';

import basicCode from "!!raw-loader!./basic.vue";
import descCode from "!!raw-loader!./desc.vue";
import iconCode from "!!raw-loader!./icon.vue";
import closableCode from "!!raw-loader!./closable.vue";

export const codes = [basicCode, descCode, iconCode, closableCode];

export default {
    BasicAlertDemo,
    DescAlertDemo,
    IconAlertDemo,
    ClosableAlertDemo
}
