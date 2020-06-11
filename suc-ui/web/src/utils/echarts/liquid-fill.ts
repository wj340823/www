let config = {
    title: {
        text: '水球图'
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    series: [{
        type: 'liquidFill',
        data: [0.47],
        outline: {
            //show: true ,
            borderDistance: 5,
            itemStyle:{
                borderWidth: 3,
                borderColor: '#27ef9f'

            }
        },
        backgroundStyle: {
            color:'transparent',
            borderWidth: 0,
        },
        itemStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    {offset: 0, color: '#009efd'},
                    {offset: 1, color: '#2af598'}
                ]
            }
        },
        label: {
            position: ['50%', '30%'],
            fontSize: 50
        },
        center: ['50%','50%'],
        radius: '80%',

    }]
};
let moreInfo = '参考资料：<a href="https://github.com/ecomfe/echarts-liquidfill" target="new_window">' +
    'https://github.com/ecomfe/echarts-liquidfill</a>';

export default {
    config,
    moreInfo
}