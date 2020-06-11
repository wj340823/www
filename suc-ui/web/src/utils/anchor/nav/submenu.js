export default {
    api: {
        props: [{
                attr: 'name',
                desc: '子菜单的唯一标识，必填',
                type: 'String | Number',
                default: "-"
            }],
        slot: [
            {
                name: '无',
                desc: '菜单项'
            },
            {
                name: 'title',
                desc: '子菜单标题'
            }
        ]
    }
};
//# sourceMappingURL=submenu.js.map