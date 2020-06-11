//@ts-ignore
import StepsConfigCode from "!!raw-loader!@suc/ui/components/steps/interface";

export default {
    anchor: [{
        id: 'TYPE1',
        title: '类型一',
        component: 'StepsDemo1',
        desc: ''
    }, {
        id: 'TYPE2',
        title: '类型二',
        component: 'StepsDemo2',
        desc: ''
    },{
        id: 'TYPE3',
        title: '类型三',
        component: 'StepsDemo3',
        desc: ''
    }],
    api: {
        props: [{
            attr: 'current',
            desc: '当前步骤，从 0 开始计数',
            type: 'Number',
            default: "0"
        }, {
            attr: 'status',
            desc: '当前步骤的状态，可选值为wait、process、finish、error',
            type: 'String',
            default: "process"
        }, {
            attr: 'list',
            desc: '步骤列表',
            type: 'StepItem[]',
            default: "[]"
        }],
        interfaces: [
            {
                text: StepsConfigCode
            }
        ]
    }
}
