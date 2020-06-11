import LineProgressDemo from './line.vue';
import PercentProgressDemo from './percent.vue';
import ColorProgressDemo from './color.vue';
import CircleProgressDemo from './circle.vue';
import DashboardProgressDemo from './dashboard.vue';

import lineCode from "!!raw-loader!./line.vue";
import percentCode from "!!raw-loader!./percent.vue";
import colorCode from "!!raw-loader!./color.vue";
import circleCode from "!!raw-loader!./circle.vue";
import dashboardCode from "!!raw-loader!./dashboard.vue";

export const codes = [lineCode, percentCode, colorCode, circleCode, dashboardCode];

export default {
    LineProgressDemo,
    PercentProgressDemo,
    ColorProgressDemo,
    CircleProgressDemo,
    DashboardProgressDemo
}
