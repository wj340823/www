export default {
    anchor: [{
        id: 'JBYF',
        title: '基本用法',
        component: 'BasicTabsDemo',
        desc: 'value 与 SucTabPane 的 name 对应，用于标识当前激活的是哪一项，' +
            'name 值默认从 0 开始，默认激活第一项。可以使用 v-model 双向绑定数据。'
    },{
        id: 'JY',
        title: '禁用',
        component: 'DisabledTabsDemo'
    },{
        id: 'TB',
        title: '图标',
        component: 'IconTabsDemo'
    },{
        id: 'MNX',
        title: '迷你型',
        component: 'MiniTabsDemo',
        desc: '设置属性 size 为 small 可以显示为迷你型，只在 type 为 line 时有效。'
    },{
        id: 'KPYS',
        title: '卡片样式',
        component: 'CardTabsDemo'
    },{
        id: 'KGB',
        title: '可关闭',
        component: 'ClosableTabsDemo',
        desc: '通过设置属性 closable 可以关闭某一项，仅在 type 为 card 时有效。<br/>' +
            '需结合 @on-tab-remove 事件手动关闭标签页。'
    },{
        id: 'ZDYBQY',
        title: '自定义标签页',
        component: 'RenderTabsDemo',
        desc: '设置 label 为 Render 函数后，可以自定义标签页的内容。'
    },{
        id: 'FJNR',
        title: '附加内容',
        component: 'ExtraTabsDemo'
    },{
        id: 'BSYDH',
        title: '不使用动画',
        component: 'AnimatedTabsDemo'
    }],
    api: {
        props: [{
            attr: 'value',
            desc: '当前激活 tab 面板的 name，可以使用 v-model 双向绑定数据',
            type: 'String',
            default: '默认为第一项的 name'
        },{
            attr: 'type',
            desc: '页签的基本样式，可选值为 line 和 card',
            type: 'String',
            default: 'line'
        },{
            attr: 'size',
            desc: '尺寸，可选值为 default 和 small，仅在 type="line" 时有效',
            type: 'String',
            default: 'default'
        },{
            attr: 'closable',
            desc: '是否可以关闭页签，仅在 type="card" 时有效',
            type: 'Boolean',
            default: 'false'
        },{
            attr: 'animated',
            desc: '是否使用 CSS3 动画',
            type: 'Boolean',
            default: 'true'
        },{
            attr: 'capture-focus',
            desc: 'Tabs 内的表单类组件是否自动获得焦点',
            type: 'Boolean',
            default: 'false'
        },{
            attr: 'before-remove',
            desc: '关闭前的函数，返回 Promise 可阻止标签关闭',
            type: 'Function',
            default: '-'
        },{
            attr: 'name',
            desc: '当嵌套使用 Tabs，指定 name 区分层级',
            type: 'String',
            default: '-'
        }],
        subProps: [{
            attr: 'name',
            desc: '用于标识当前面板，对应 value，默认为其索引值',
            type: 'String',
            default: '-'
        },{
            attr: 'label',
            desc: '选项卡头显示文字，支持 Render 函数。',
            type: 'String | Function',
            default: '空'
        },{
            attr: 'icon',
            desc: '选项卡图标',
            type: 'String',
            default: '-'
        },{
            attr: 'disabled',
            desc: '是否禁用该选项卡',
            type: 'Boolean',
            default: 'false'
        },{
            attr: 'closable',
            desc: '是否可以关闭页签，仅在 type="card" 时有效',
            type: 'Boolean',
            default: 'false'
        },{
            attr: 'tab',
            desc: '当嵌套使用 Tabs，设置该属性指向对应 Tabs 的 name 字段',
            type: 'String',
            default: '-'
        },{
            attr: 'index',
            desc: '在 TabPane 使用 v-if 时，并不会按照预先的顺序渲染，这时可设置 index，并从小到大排序(需大于 0)',
            type: 'Number',
            default: '-'
        }],
        events: [{
            name: 'on-click',
            desc: 'tab 被点击时触发',
            returnValue: 'name'
        }, {
            name: 'on-tab-remove',
            desc: 'tab 被关闭时触发',
            returnValue: 'name'
        }],
        slot: [{
            name: 'extra',
            desc: '附加内容'
        }]
    }
}
