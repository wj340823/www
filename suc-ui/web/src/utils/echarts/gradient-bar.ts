//@ts-ignore
import styles from '@suc/ui/styles/index.scss';

let config = {
    title: {
        text: '渐变色 柱状图'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'cross'
        }
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    dataset: {
        // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
        dimensions: ['city', 'amount'],
        source: [
            {city: '贵 阳', 'amount': 180},
            {city: '黔 南', 'amount': 52},
            {city: '黔西南', 'amount': 100},
            {city: '黔东南', 'amount': 100},
            {city: '毕 节', 'amount': 190},
            {city: '安 顺', 'amount': 120},
            {city: '铜 仁', 'amount': 66},
            {city: '遵 义', 'amount': 156},
            {city: '六盘水', 'amount': 130},
            {city: '贵 安', 'amount': 70}
        ]
    },
    xAxis: {
        type: 'category',
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            textStyle: {
                color: styles.primary,
                fontSize: 16,
            },
            formatter: function (val: string) {
                return val.split("").join("\n");
            }
        },
        splitLine: {
            show: false
        },
        boundaryGap: false
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            margin: 30,
            textStyle: {
                color: styles.primary,
                fontSize: 14,
            }
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        splitLine: {
            show: false
        }
    },
    series: [
        {
            name: '直接访问',
            type: 'bar',
            barWidth: '30%',
            itemStyle: {
                normal: {
                    barBorderRadius: [10, 10, 0, 0],
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {offset: 0, color: '#00ffe4'},
                            {offset: 1, color: '#3971c0'}
                        ]
                    }
                }
            }
        }
    ]
};
let moreInfo = '';

export default {
    config,
    moreInfo
}