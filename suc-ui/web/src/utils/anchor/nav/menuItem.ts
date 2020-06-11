export default {
    api: {
        props: [{
            attr: 'name',
            desc: '菜单项的唯一标识，必填',
            type: 'String | Number',
            default: "-"
        },{
            attr: 'to',
            desc: '跳转的链接，支持 vue-router 对象',
            type: 'String | Object',
            default: "-"
        },{
            attr: 'repalce',
            desc: '路由跳转时，开启 replace 将不会向 history 添加新记录',
            type: 'Boolean',
            default: "false"
        },{
            attr: 'target',
            desc: '相当于 a 链接的 target 属性',
            type: 'String',
            default: "_self"
        },{
            attr: 'append(3.4.0)',
            desc: '同 vue-router append',
            type: 'Boolean',
            default: "false"
        }]
    }
}
