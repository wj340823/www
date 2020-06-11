export default {
    anchor: [{
        id: 'JBYF',
        title: '基本用法',
        component: 'BasePageDemo'
    }, {
        id: 'QBYF',
        title: '全部元素',
        component: 'AllPageDemo',
        desc: '可以切换每页显示的数量。快速跳转到某一页。显示总共多少条数据。'
    }, {
        id: 'MNX',
        title: '迷你型',
        component: 'SmallPageDemo',
        desc: '设置size为small使用迷你型，迷你型拥有普通的所有功能。'
    }, {
        id: 'JJMS',
        title: '简洁模式',
        component: 'SimplePageDemo',
        desc: '设置simple属性即可使用简洁版的分页，通过输入页码回车切换，或使用鼠标点击切换页码，或使用键盘的上下键来切换。简洁分页不能使用总数、电梯和切换数量。'
    }],
    api: {
        props: [{
            attr: 'current',
            desc: '当前页码，支持 .sync 修饰符',
            type: 'Number',
            default: "1"
        }, {
            attr: 'total',
            desc: '数据总数',
            type: 'Number',
            default: "0"
        }, {
            attr: 'page-size',
            desc: '每页条数',
            type: 'Number',
            default: "10"
        }, {
            attr: 'page-size-opts',
            desc: '每页条数切换的配置',
            type: 'Array',
            default: "[10, 20, 30, 40]"
        }, {
            attr: 'size',
            desc: '可选值为small（迷你版）或不填（默认）',
            type: 'String',
            default: '-'
        }, {
            attr: 'show-total',
            desc: '显示总数',
            type: 'Boolean',
            default: "false"
        }, {
            attr: 'show-elevator',
            desc: '显示电梯，可以快速切换到某一页',
            type: 'Boolean',
            default: "false"
        }, {
            attr: 'show-sizer',
            desc: '显示分页，用来改变page-size',
            type: 'Boolean',
            default: "false"
        }, {
            attr: 'prev-text',
            desc: '替代图标显示的上一页文字',
            type: 'String',
            default: "-"
        }, {
            attr: 'next-text',
            desc: '替代图标显示的下一页文字',
            type: 'String',
            default: "-"
        }]
    }
}
