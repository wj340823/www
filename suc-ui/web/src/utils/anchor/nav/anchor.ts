export default {
    anchor: [{
        id: 'JBYF',
        title: '基本用法',
        component: 'BasicAnchorDemo'
    }],
    api: {
        props: [{
            attr: 'affix',
            desc: '固定模式（只有当滚动条在 window 上时才起作用）',
            type: 'Boolean',
            default: 'true'
        },{
            attr: 'offset-top',
            desc: '距离窗口顶部达到指定偏移量后触发',
            type: 'Number',
            default: '0'
        },{
            attr: 'offset-bottom',
            desc: '距离窗口底部达到指定偏移量后触发',
            type: 'Number',
            default: '-'
        },{
            attr: 'bounds',
            desc: '锚点区域边界，单位：px',
            type: 'Number',
            default: '5'
        },{
            attr: 'scroll-offset',
            desc: '点击滚动的额外距离',
            type: 'Number',
            default: '0'
        },{
            attr: 'container',
            desc: '指定滚动的容器',
            type: 'String | HTMLElement',
            default: '-'
        },{
            attr: 'show-ink',
            desc: '是否显示小圆点',
            type: 'Boolean',
            default: 'false'
        }],
        subProps: [{
            attr: 'href',
            desc: '锚点链接',
            type: 'String',
            default: '-'
        },{
            attr: 'title',
            desc: '文字内容',
            type: 'String',
            default: '-'
        },{
            attr: 'scroll-offset',
            desc: '点击滚动的额外距离',
            type: 'Number',
            default: '0'
        }],
        events: [{
            name: 'on-select',
            desc: '点击锚点时触发，返回链接',
            returnValue: 'href'
        }, {
            name: 'on-change',
            desc: '链接改变时触发，返回新链接和旧链接\t',
            returnValue: 'newHref, oldHref'
        }]
    }
}
