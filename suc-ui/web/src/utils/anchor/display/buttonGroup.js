export default {
    api: {
        props: [{
                attr: 'size',
                desc: '按钮组合大小，可选值为large、small、default或者不设置',
                type: 'String',
                default: 'default'
            }, {
                attr: 'shape',
                desc: '按钮组合形状，可选值为circle或者不设置',
                type: 'String',
                default: '-'
            }, {
                attr: 'vertical',
                desc: '是否支持防抖',
                type: '是否纵向排列按钮组',
                default: 'false'
            }]
    }
};
//# sourceMappingURL=buttonGroup.js.map