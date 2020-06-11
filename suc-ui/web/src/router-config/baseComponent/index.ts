import base from './base';
import layout from './layout';
import nav from './nav';
import dataInput from './dataInput';
import display from './display';

export const routers:any[] = [...base.routers,...layout.routers,...nav.routers,...dataInput.routers,...display.routers];
export const menus:any = {
    base:base.menus,
    layout:layout.menus,
    nav:nav.menus,
    dataInput:dataInput.menus,
    display:display.menus
}