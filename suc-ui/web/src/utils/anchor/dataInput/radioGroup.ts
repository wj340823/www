export default {
    api: {
        props: [{
            attr: 'value',
            desc: '指定当前选中的项目数据。可以使用 v-model 双向绑定数据',
            type: 'Number | String',
            default: '空'
        }],
        events: [
            {
                name: 'on-change',
                desc: '在选项状态发生改变时触发，返回当前选中的项。通过修改外部的数据改变时不会触发',
                returnValue: '...'
            }
        ]
    }
}