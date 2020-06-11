//@ts-ignore
import styles from '@suc/ui/styles/index.scss';

let config = {
    backgroundColor: '#fff',
    title: {
        text: '条纹背景 柱状图'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow',
            shadowStyle: {
                color: 'rgba(255,198,0,0.15)'
            }
        }
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    dataset: {
        // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
        dimensions: ['place', 'amount'],
        source: [
            {place: '停车场', 'amount': 26},
            {place: '检查站 快速通道', 'amount': 8},
            {place: '政府党政 机关大院', 'amount': 14},
            {place: '机场', 'amount': 29},
            {place: '路面', 'amount': 38},
            {place: '加油站', 'amount': 10},
            {place: '测速场所', 'amount': 6}
        ]
    },
    xAxis: {
        type: 'category',
        axisTick: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#e4e7ef'
            }
        },
        axisLabel: {
            margin: 12,
            textStyle: {
                color: styles.primary,
                fontSize: 16,
            },
            formatter: function (val: string) {
                return val.split(" ").join("\n");
            }
        },
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            margin: 12,
            textStyle: {
                color: styles.primary,
                fontSize: 14,
            }
        },
        axisLine: {
            lineStyle: {
                color: '#e4e7ef'
            }
        },
        axisTick: {
            show: false
        },
        splitLine: {
            lineStyle: {
                color: '#f6f7fa'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['#f6f7fa', '#fff']
            }
        }
    },
    series: [
        {
            name: '卡口总数',
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
                            {offset: 0, color: '#37e0ff'},
                            {offset: 1, color: '#419fff'}
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