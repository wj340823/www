export default {
    anchor: [{
            id: 'JBYF',
            title: '基本用法',
            component: 'BasicCollapseDemo'
        }, {
            id: 'SFQ',
            title: '手风琴',
            component: 'AccordionCollapseDemo',
            desc: '每次只能打开一个面板'
        }, {
            id: 'MBQT',
            title: '面板嵌套',
            component: 'NestCollapseDemo',
            desc: '折叠面板可以进行嵌套。'
        }, {
            id: 'JJMS',
            title: '简洁模式',
            component: 'SimpleCollapseDemo',
            desc: '<br/>设置属性 simple 可以显示为不带边框和背景色的简洁模式。。'
        }],
    api: {
        props: [{
                attr: 'value',
                desc: '当前激活的面板的 name，可以使用 v-model 双向绑定',
                type: 'Array | String',
                default: '-'
            }, {
                attr: 'accordion',
                desc: '是否开启手风琴模式，开启后每次至多展开一个面板',
                type: 'Boolean',
                default: 'false'
            }, {
                attr: 'simple',
                desc: '是否开启简洁模式',
                type: 'Boolean',
                default: 'false'
            }],
        events: [{
                name: 'on-change',
                desc: '切换面板时触发，返回当前已展开的面板的 key，格式为数组',
                returnValue: '[]'
            }],
        subProps: [{
                attr: 'name',
                desc: '当前面板的 name，与 Collapse的value对应，不填为索引值',
                type: 'String',
                default: 'index'
            }, {
                attr: 'hide-arrow',
                desc: '隐藏箭头',
                type: 'Boolean',
                default: 'false'
            }],
        subSlot: [{
                name: '无',
                desc: '面板头内容'
            }, {
                name: 'content',
                desc: '描述内容'
            }]
    }
};
//# sourceMappingURL=collapse.js.map