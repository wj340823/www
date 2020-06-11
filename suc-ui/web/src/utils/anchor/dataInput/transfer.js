export default {
    anchor: [{
            id: 'JBYF',
            title: '基本用法',
            component: 'BasicTransferDemo',
            desc: '基本用法，展示了 data、target-keys、每行的渲染函数 render-format 以及回调函数 on-change 的用法。'
        }, {
            id: 'SS',
            title: '搜索',
            component: 'SearchTransferDemo',
            desc: '通过设置属性 filterable 可以进行搜索，可以自定义搜索函数。'
        }, {
            id: 'JY',
            title: '禁用',
            component: 'DisabledTransferDemo'
        }, {
            id: 'GJYF',
            title: '高级用法',
            component: 'MoreTransferDemo',
            desc: '穿梭框高级用法，可以自定义两列的宽高、操作文案，以及底部自定义操作，更多配置见 API。'
        }],
    api: {
        props: []
    }
};
//# sourceMappingURL=transfer.js.map