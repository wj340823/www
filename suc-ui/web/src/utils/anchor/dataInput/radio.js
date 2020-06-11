//@ts-ignore
import RadioConfigCode from "!!raw-loader!@suc/ui/components/radio/interface";
export default {
    anchor: [
        {
            id: 'JBYF',
            title: '基本用法',
            component: 'BaseRadio',
            desc: '',
        },
        {
            id: 'DISABLED',
            title: '禁用',
            component: 'DisableRadio',
            desc: '',
        },
        {
            id: 'GROUP',
            title: '分组及排列方式',
            component: 'GroupRadio',
            desc: '',
        }
    ],
    api: {
        props: [{
                attr: 'value',
                desc: '只在单独使用时有效。可以使用 v-model 双向绑定数据',
                type: 'Number | String',
                default: '空'
            }, {
                attr: 'label',
                desc: '只在组合使用时有效。指定当前选项的 value 值，组合会自动判断当前选择的项目',
                type: 'String | Number',
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
                text: RadioConfigCode
            }
        ],
        events: [
            {
                name: 'on-change',
                desc: '在选项状态发生改变时触发，返回当前状态。通过修改外部的数据改变时不会触发',
                returnValue: '...'
            }
        ]
    }
};
//# sourceMappingURL=radio.js.map