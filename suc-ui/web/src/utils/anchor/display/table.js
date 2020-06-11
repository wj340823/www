export default {
    anchor: [{
            id: 'JBLX',
            title: '基础类型',
            component: 'BaseTableDemo'
        }, {
            id: 'STRIPE',
            title: '带有斑马纹的表格',
            component: 'StripeTableDemo'
        }, {
            id: 'SORT',
            title: '带有排序的表格',
            component: 'SortTableDemo'
        }],
    api: {
        props: [{
                attr: 'data',
                desc: '显示的数据',
                type: 'array',
                default: '-'
            }, {
                attr: 'height',
                desc: 'Table 的高度',
                type: 'string/number',
                default: '-'
            }, {
                attr: 'max-height',
                desc: 'Table 的最大高度',
                type: 'string/number',
                default: '-'
            }, {
                attr: 'stripe',
                desc: '是否为斑马纹 table',
                type: 'boolean',
                default: 'false'
            }, {
                attr: 'border',
                desc: '是否带有纵向边框',
                type: 'boolean',
                default: 'false'
            }],
        subProps: [{
                attr: 'type',
                desc: '对应列的类型。如果设置了 selection 则显示多选框；如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮',
                type: 'string',
                default: '-'
            }, {
                attr: 'label',
                desc: '对应列内容的字段名，也可以使用 property 属性',
                type: 'string',
                default: '-'
            }, {
                attr: 'width',
                desc: '对应列的宽度',
                type: 'string',
                default: '-'
            }]
    }
};
//# sourceMappingURL=table.js.map