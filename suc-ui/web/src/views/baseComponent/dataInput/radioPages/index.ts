import BaseRadio from "./base.vue";
import DisableRadio from "./disable.vue";
import GroupRadio from "./group.vue";


import baseCode from "!!raw-loader!./base.vue";
import disableCode from "!!raw-loader!./disable.vue";
import groupCode from "!!raw-loader!./group.vue";


export const codes = [baseCode,disableCode,groupCode];

export default {
    BaseRadio,
    DisableRadio,
    GroupRadio
};