export default {
    api: {
        props: [{
                attr: 'status',
                desc: '步骤的状态，可选值为wait、process、finish、error，不设置时自动判断',
                type: 'String',
                default: "process"
            }, {
                attr: 'title',
                desc: '标题',
                type: 'String',
                default: "空"
            }, {
                attr: 'content',
                desc: '步骤的详细描述，可选',
                type: 'String',
                default: "-"
            }, {
                attr: 'icon',
                desc: '步骤的图标，可选',
                type: 'String',
                default: "-"
            }]
    }
};
//# sourceMappingURL=step.js.map