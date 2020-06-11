//@ts-ignore
import ButtonConfigCode from "!!raw-loader!@suc/ui/components/button/interface";

export default {
    anchor: [
        {
            id: 'DEFAULT',
            title: '一般状态',
            component: 'BaseButton',
            desc: ''
        },
        {
            id: 'DISABLE',
            title: '禁用状态',
            component: 'DisableButton',
            desc: ''
        }
    ],
    api: {
        props: [{
            attr: 'type',
            desc: '按钮类型，可选值为 default、primary、primary2、text、info、success、warning、error或者不设置',
            type: 'string',
            default: '-'
        }, {
            attr: 'dashed',
            desc: '边框是否为虚线',
            type: 'Boolean',
            default: 'false'
        }, {
            attr: 'debounce',
            desc: '是否支持防抖',
            type: 'Number',
            default: '-'
        }, {
            attr: 'disabled',
            desc: '设置按钮为禁用状态',
            type: 'Boolean',
            default: 'false'
        }],
        interfaces: [
            {
                text: ButtonConfigCode
            }
        ],
        events: [
            {
                name: 'on-click',
                desc: '按钮点击',
                returnValue: '无'
            }
        ]
    }
}
