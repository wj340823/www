export default {
    anchor: [{
            id: 'PTTS',
            title: '普通提示',
            component: 'GeneralMessageDemo'
        }, {
            id: 'TSLX',
            title: '提示类型',
            component: 'TypeMessageDemo'
        }, {
            id: 'JZZ',
            title: '加载中',
            component: 'LoadingMessageDemo',
            desc: 'Loading 的状态，并异步在某个时机移除。'
        }, {
            id: 'HMMXX',
            title: '含描述信息',
            component: 'DescMessageDemo'
        }, {
            id: 'KDYSC',
            title: '自定义时长',
            component: 'TimeMessageDemo',
            desc: '自定义时长，也可以在 Message.config() 中全局配置，详见 API 。'
        }, {
            id: 'KGB',
            title: '可关闭',
            component: 'ClosableMessageDemo'
        }, {
            id: 'ZDY_Render_HS',
            title: '自定义 Render 函数',
            component: 'RenderMessageDemo'
        }],
    api: {
        props: [],
        events: [],
        slot: []
    }
};
//# sourceMappingURL=message.js.map