import BasicTreeDemo from './basic.vue';
import CheckTreeDemo from './check.vue';
import LazyTreeDemo from './lazy.vue';
import ExpandTreeDemo from './expand.vue';
import DisabledTreeDemo from './disabled.vue';
import NodeTreeDemo from './node.vue';
import RenderTreeDemo from './render.vue';
import FilterTreeDemo from './filter.vue';

import basicCode from "!!raw-loader!./basic.vue";
import checkCode from "!!raw-loader!./check.vue";
import lazyCode from "!!raw-loader!./lazy.vue";
import expandCode from "!!raw-loader!./expand.vue";
import disabledCode from "!!raw-loader!./disabled.vue";
import nodeCode from "!!raw-loader!./node.vue";
import renderCode from "!!raw-loader!./render.vue";
import filterCode from "!!raw-loader!./filter.vue";

export const codes = [basicCode, checkCode, lazyCode, expandCode, disabledCode, nodeCode, renderCode, filterCode];

export default {
    BasicTreeDemo,
    CheckTreeDemo,
    LazyTreeDemo,
    ExpandTreeDemo,
    DisabledTreeDemo,
    NodeTreeDemo,
    RenderTreeDemo,
    FilterTreeDemo,
}
