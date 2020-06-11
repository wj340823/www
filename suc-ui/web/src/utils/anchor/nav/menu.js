//@ts-ignore
import MenuConfigCode from "!!raw-loader!@suc/ui/components/menu/interface";
export default {
    anchor: [{
            id: 'HORIZONTAL',
            title: '横向导航',
            component: 'TopMenu',
            desc: ''
        }, {
            id: 'VERTICAL',
            title: '纵向导航',
            component: 'SideMenu',
            desc: ''
        }],
    api: {
        interfaces: [
            {
                text: MenuConfigCode
            }
        ],
        events: [
            {
                name: 'on-select',
                desc: '选择菜单（MenuItem）时触发',
                returnValue: 'name'
            },
            {
                name: 'on-open-change',
                desc: '当 展开/收起 子菜单时触发',
                returnValue: '当前展开的 Submenu 的 name 值数组'
            }
        ],
        methods: [
            {
                name: 'updateOpened',
                desc: '手动更新展开的子目录，注意要在 $nextTick 里调用',
                params: '无'
            },
            {
                name: 'updateActiveName',
                desc: '手动更新当前选择项，注意要在 $nextTick 里调用',
                params: '无'
            }
        ]
    }
};
//# sourceMappingURL=menu.js.map