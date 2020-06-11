export default {
    anchor: [
        {
            id: 'TYPEA',
            title: '类型一',
            component: 'TimelineDemo1',
            desc: ''
        },
        {
            id: 'TYPEB',
            title: '类型二',
            component: 'TimelineDemo2',
            desc: ''
        },
        {
            id: 'TYPEC',
            title: '类型三',
            component: 'TimelineDemo3',
            desc: ''
        },
        {
            id: 'TYPED',
            title: '类型四',
            component: 'TimelineDemo4',
            desc: ''
        },
        {
            id: 'TYPEE',
            title: '类型五',
            component: 'TimelineDemo5',
            desc: ''
        }
    ],
    api: {
        props: [{
            attr: 'pending',
            desc: '指定是否最后一个节点为幽灵节点',
            type: 'Boolean',
            default: 'false'
        }]
    }
}