// @ts-ignore
import CheckboxConfigCode from "!!raw-loader!@suc/ui/components/checkbox/interface";

export default {
    anchor: [
        {
            id: 'JBYF',
            title: '基本用法',
            component: 'BaseCheckbox',
            desc: '',
        },
        {
            id: 'DISABLED',
            title: '禁用',
            component: 'DisableCheckbox',
            desc: '',
        },
        {
            id: 'GROUP',
            title: '分组及排列方式',
            component: 'GroupCheckbox',
            desc: '',
        }
    ],
    api: {
        props: [{
            attr: 'value',
            desc: '只在单独使用时有效。可以使用 v-model 双向绑定数据',
            type: 'Boolean',
            default: 'false'
        }, {
            attr: 'label',
            desc: '只在组合使用时有效。指定当前选项的 value 值，组合会自动判断是否选中',
            type: 'String | Number | Boolean',
            default: '-'
        },
            {
                attr: 'disabled',
                desc: '是否禁用当前项',
                type: 'Boolean',
                default: 'false'
            }],
        interfaces: [
            {
                text: CheckboxConfigCode
            }
        ],
        events: [
            {
                name: 'on-change',
                desc: '只在单独使用时有效。在选项状态发生改变时触发，通过修改外部的数据改变时不会触发',
                returnValue: 'true | false'
            }
        ]
    }
}
