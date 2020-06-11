import baseComponent from './baseComponent';
import echarts from './echarts';

export const routers:any[] = [...baseComponent.routers, ...echarts.routers];
export const secondMenus:any = {
    baseComponent:baseComponent.menus
}