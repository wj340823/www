import gradientBar from './gradient-bar';
import liquidFill from './liquid-fill';
import stripeBar from './stripe-bar';

const LIST = [
    {
        name: '渐变柱状图',
        options: 'gradientBar',
        img: 'gradient-bar.png'
    },
    {
        name: '水球图',
        options: 'liquidFill',
        img: 'liquid-fill.png'
    },
    {
        name: '条纹背景柱状图',
        options: 'stripeBar',
        img: 'stripe-bar.png'
    }
];
const OPTIONS:{[key:string]:any} = {
    gradientBar,
    liquidFill,
    stripeBar
}

interface ListItem {
    name: string,
    options: string,
    img: string
}
export {
    LIST,
    OPTIONS,
    ListItem
}