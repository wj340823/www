export default {
    anchor: [{
        id: 'JBYF',
        title: '基本用法',
        component: 'BasicAlertDemo'
    }, {
        id: 'HMSXX',
        title: '含描述信息',
        component: 'DescAlertDemo'
    }, {
        id: 'TB',
        title: '图标',
        component: 'IconAlertDemo'
    }, {
        id: 'KGB',
        title: '可关闭',
        component: 'ClosableAlertDemo'
    }],
    api: {
        props: [{
            attr: 'type',
            desc: '警告提示样式，可选值为 info、success、warning、error',
            type: 'String',
            default: 'info'
        },{
            attr: 'closable',
            desc: '是否可关闭',
            type: 'Boolean',
            default: 'false'
        },{
            attr: 'show-icon',
            desc: '是否显示图标',
            type: 'Boolean',
            default: 'false'
        }],
        events: [{
            name: 'on-close',
            desc: '关闭时触发',
            returnValue: 'event'
        }],
        slot: [{
            name: '无',
            desc: '警告提示内容'
        },{
            name: 'desc',
            desc: '警告提示辅助性文字介绍'
        },{
            name: 'icon',
            desc: '自定义图标内容'
        },{
            name: 'close',
            desc: '自定义关闭内容'
        }]
    }
}
