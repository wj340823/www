export default {
    api: {
        props: [{
            attr: 'to',
            desc: '链接，不传则没有链接，支持 vue-router 对象',
            type: 'String | Object',
            default: "-"
        },{
            attr: 'replace',
            desc: '路由跳转时，开启 replace 将不会向 history 添加新记录',
            type: 'Boolean',
            default: "/"
        },{
            attr: 'target',
            desc: '相当于 a 链接的 target 属性',
            type: 'String',
            default: "_self"
        },{
            attr: 'append',
            desc: '同 vue-router append',
            type: 'Boolean',
            default: "false"
        }]
    }
}
