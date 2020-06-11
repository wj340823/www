//@ts-ignore
import DrawerConfigCode from "!!raw-loader!@suc/ui/components/drawer/interface";

export default {
    anchor: [
        {
            id: 'JBYF',
            title: '基本用法',
            component: 'BaseDrawer',
            desc: '',
        }
    ],
    api: {
        props: [{
            attr: 'value',
            desc: '抽屉是否显示，可使用 v-model 双向绑定数据',
            type: 'Boolean',
            default: 'false'
        }, {
            attr: 'hideheader',
            desc: '是否隐藏头部',
            type: 'Boolean',
            default: 'false'
        }],
        interfaces: [
            {
                text: DrawerConfigCode
            }
        ],
        events: [
            {
                name: 'on-close',
                desc: '关闭抽屉时触发',
                returnValue: '无'
            },
            {
                name: 'on-visible-change',
                desc: '显示状态发生变化时触发',
                returnValue: 'true / false'
            },
            {
                name: 'on-resize-width(3.3.0)',
                desc: '调整宽度时触发',
                returnValue: 'width'
            }

        ],
        slot: [
            {
                name: 'header',
                desc: '自定义标题栏'
            },
            {
                name: 'close',
                desc: '自定义右上角关闭内容'
            },
            {
                name: 'trigger(3.3.0)',
                desc: '自定义调整宽度节点'
            },
            {
                name: '默认',
                desc: '抽屉主体内容'
            }
        ]
    }
}
