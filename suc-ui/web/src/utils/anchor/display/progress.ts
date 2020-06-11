export default {
    anchor: [{
        id: 'XXJDT',
        title: '线形进度条',
        component: 'LineProgressDemo'
    },{
        id: 'BFBNX',
        title: '百分比内显',
        component: 'PercentProgressDemo'
    },{
        id: 'ZDYYS',
        title: '自定义颜色',
        component: 'ColorProgressDemo'
    },{
        id: 'HXJDT',
        title: '环形进度条',
        component: 'CircleProgressDemo'
    },{
        id: 'YBPXJDT',
        title: '仪表盘形进度条',
        component: 'DashboardProgressDemo'
    }],
    api: {
        props: [{
            attr: 'percentage',
            desc: '百分比（必填）',
            type: 'Number',
            default: '0'
        },{
            attr: 'type',
            desc: '进度条类型，可选值为 line/circle/dashboard',
            type: 'String',
            default: 'line'
        },{
            attr: 'stroke-width',
            desc: '进度条的线宽，单位 px',
            type: 'Number',
            default: '6'
        },{
            attr: 'text-inside',
            desc: '进度条显示文字内置在进度条内（只在 type=line 时可用）',
            type: 'Boolean',
            default: 'false'
        },{
            attr: 'status',
            desc: '进度条当前状态，可选值为 success/exception/warning',
            type: 'String',
            default: '-'
        },{
            attr: 'color',
            desc: '进度条背景色（会覆盖 status 状态颜色）',
            type: 'String/Function/Array',
            default: ''
        },{
            attr: 'width',
            desc: '环形进度条画布宽度（只在 type 为 circle 或 dashboard 时可用）',
            type: 'Number',
            default: '126'
        },{
            attr: 'show-text',
            desc: '是否显示进度条文字内容',
            type: 'Boolean',
            default: 'true'
        },{
            attr: 'format',
            desc: '指定进度条文字内容',
            type: 'Function',
            default: '-'
        }]
    }
}
