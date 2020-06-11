import baseComponent from './baseComponent';
import echarts from './echarts';
export const routers = [...baseComponent.routers, ...echarts.routers];
export const secondMenus = {
    baseComponent: baseComponent.menus
};
//# sourceMappingURL=index.js.map