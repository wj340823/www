export default {
    api: {
        props: [{
            attr: 'color',
            desc: '圆圈颜色，可选值为blue、red、green，或自定义色值',
            type: 'string',
            default: 'boolean'
        },{
            attr: 'type',
            desc: '圆圈主题',
            type: "'primary' | 'success' | 'danger'",
            default: 'primary'
        },{
            attr: 'solid',
            desc: '圆圈是否为实心',
            type: 'boolean',
            default: 'false'
        },,{
            attr: 'animation',
            desc: '节点是否有动画',
            type: 'boolean',
            default: 'false'
        }],
        slot: [
            {
                name: 'dot',
                desc: '自定义时间轴点内容'
            },
            {
                name: '无',
                desc: '基本内容'
            }
        ]
    }
}