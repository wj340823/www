export default {
    anchor: [],
    api: {
        props: [{
            attr: 'type',
            desc: '显示类型，可选值为 time、timerange',
            type: 'String',
            default: 'time'
        }, {
            attr: 'format',
            desc: '展示的日期格式',
            type: 'Date',
            default: 'HH:mm:ss'
        }, {
            attr: 'placement',
            desc: '日期选择器出现的位置，可选值为toptop-starttop-endbottombottom-startbottom-endleftleft-startleft-endrightright-startright-end，2.12.0 版本开始支持自动识别',
            type: 'String',
            default: 'bottom-start'
        }, {
            attr: 'placeholder',
            desc: '占位文本',
            type: 'String',
            default: '空'
        }, {
            attr: 'disabled',
            desc: '是否禁用选择器',
            type: 'Date',
            default: 'false'
        }, {
            attr: 'clearable',
            desc: '是否显示清除按钮',
            type: 'Boolean',
            default: 'true'
        }, {
            attr: 'readonly',
            desc: '完全只读，开启后不会弹出选择器，只在没有设置 open 属性下生效',
            type: 'Boolean',
            default: 'false'
        }, {
            attr: 'confirm',
            desc: '是否显示底部控制栏，开启后，选择完日期，选择器不会主动关闭，需用户确认后才可关闭',
            type: 'Boolean',
            default: 'false'
        }],
        events: [{
            name: 'on-change',
            desc: '日期发生变化时触发',
            returnValue: '返回两个值，已经格式化后的日期，比如 2016-01-01，和当前的日期类型，比如 date'
        }]
    }
}