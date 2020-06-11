import BreadcrumbDemo1 from './demo1.vue';
import BreadcrumbDemo2 from './demo2.vue';

import demoCode1 from "!!raw-loader!./demo1.vue";
import demoCode2 from "!!raw-loader!./demo2.vue";

export const codes = [demoCode1,demoCode2];

export default {
    BreadcrumbDemo1,
    BreadcrumbDemo2
}
