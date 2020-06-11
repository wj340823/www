export default {
    api: {
        props: [{
            attr: 'value',
            desc: '指定选中项目的集合，可以使用 v-model 双向绑定数据',
            type: 'Array',
            default: '[]'
        }],
        events: [
            {
                name: 'on-change',
                desc: '在选项状态发生改变时触发，返回已选中的数组。通过修改外部的数据改变时不会触发',
                returnValue: '[...]'
            }
        ]
    }
}