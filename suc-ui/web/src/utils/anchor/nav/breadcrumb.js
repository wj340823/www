//@ts-ignore
import BreadcrumbItemDataCode from "!!raw-loader!@suc/ui/components/breadcrumb/interface";
export default {
    anchor: [{
            id: 'TYPE1',
            title: '类型一',
            component: 'BreadcrumbDemo1',
            desc: ''
        }, {
            id: 'TYPE2',
            title: '类型二',
            component: 'BreadcrumbDemo2',
            desc: ''
        }],
    api: {
        props: [{
                attr: 'separator',
                desc: '自定义分隔符',
                type: 'String | Element String',
                default: "/"
            }],
        interfaces: [
            {
                text: BreadcrumbItemDataCode
            }
        ],
    }
};
//# sourceMappingURL=breadcrumb.js.map