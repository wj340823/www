//@ts-ignore
import InputConfigCode from "!!raw-loader!@suc/ui/components/input/interface";

export default {
    anchor: [
        {
            id: 'JBYF',
            title: '基本用法',
            component: 'BaseInput',
            desc: '',
        },
        {
            id: 'ICON',
            title: '带icon',
            component: 'IconInput',
            desc: '',
        },
        {
            id: 'TEXTAREA',
            title: '文本域',
            component: 'TypeInput',
            desc: '',
        }
    ],
    api: {
        props: [{
            attr: 'type',
            desc: '输入框类型，可选值为 text、password、textarea、url、email、date、number、tel',
            type: 'String',
            default: 'text'
        }, {
            attr: 'value',
            desc: '绑定的值，可使用 v-model 双向绑定',
            type: 'Number | String',
            default: '空'
        }, {
            attr: 'label',
            desc: '标题',
            type: 'String',
            default: '空'
        }, {
            attr: 'label-position',
            desc: '标题位置,可选值为left、right、top',
            type: "String",
            default: 'right'
        }, {
            attr: 'label-width',
            desc: '标题宽度',
            type: "Number",
            default: '100'
        }, {
            attr: 'placeholder',
            desc: '占位文本',
            type: 'String',
            default: '空'
        }, {
            attr: 'disabled',
            desc: '是否禁用选择器',
            type: 'Boolean',
            default: 'false'
        }, {
            attr: 'readonly',
            desc: '设置输入框为只读',
            type: 'Boolean',
            default: 'false'
        }, {
            attr: 'error-tip',
            desc: '错误提示信息',
            type: 'String',
            default: '空'
        }, {
            attr: 'is-error',
            desc: '输入信息是否有误',
            type: 'Boolean',
            default: 'false'
        }, {
            attr: 'required',
            desc: '是否为必填项',
            type: 'Boolean',
            default: 'false'
        }],
        interfaces: [
            {
                text: InputConfigCode
            }
        ],
        events: [
            {
                name: 'on-enter',
                desc: '按下回车键时触发',
                returnValue: '无'
            },
            {
                name: 'on-click',
                desc: '设置 icon 属性后，点击图标时触发',
                returnValue: '无'
            },
            {
                name: 'on-change',
                desc: '数据改变时触发',
                returnValue: 'event'
            },
            {
                name: 'on-focus',
                desc: '输入框聚焦时触发',
                returnValue: '无'
            },
            {
                name: 'on-blur',
                desc: '输入框失去焦点时触发',
                returnValue: '无'
            },
            {
                name: 'on-keyup',
                desc: '原生的 keyup 事件',
                returnValue: 'event'
            },
            {
                name: 'on-keydown',
                desc: '原生的 keydown 事件',
                returnValue: 'event'
            },
            {
                name: 'on-keypress',
                desc: '原生的 keypress 事件',
                returnValue: 'event'
            },
            {
                name: 'on-search',
                desc: '开启 search 时可用，点击搜索或按下回车键时触发',
                returnValue: 'value'
            },
            {
                name: 'on-clear(3.4.0)',
                desc: '开启 clearable 时可用，点击清空按钮时触发',
                returnValue: '无'
            }
        ]
    }
}
