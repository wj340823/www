import BasePageDemo from "./base.vue";
import AllPageDemo from "./all.vue";
import SmallPageDemo from "./small.vue";
import SimplePageDemo from "./simple.vue";

import baseCode from "!!raw-loader!./base.vue";
import allCode from "!!raw-loader!./all.vue";
import smallCode from "!!raw-loader!./small.vue";
import simpleCode from "!!raw-loader!./simple.vue";
export const codes = [baseCode, allCode, smallCode, simpleCode];

export default {
    BasePageDemo,
    AllPageDemo,
    SmallPageDemo,
    SimplePageDemo
};