import StepsDemo1 from './demo1.vue';
import StepsDemo2 from './demo2.vue';
import StepsDemo3 from './demo3.vue';

import demoCode1 from "!!raw-loader!./demo1.vue";
import demoCode2 from "!!raw-loader!./demo2.vue";
import demoCode3 from "!!raw-loader!./demo3.vue";


export const codes = [demoCode1,demoCode2,demoCode3];

export default {
    StepsDemo1,
    StepsDemo2,
    StepsDemo3
}
