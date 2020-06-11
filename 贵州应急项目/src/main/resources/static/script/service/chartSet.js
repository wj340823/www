define(['app'], function (app) {
    app.factory("chartSet", function (dataSet) {
        var factory = {};
        factory.setAnaBar = function () {
            var labelBottom = {
                normal: {
                    position: 'bottom'
                }
            };
            var labelTop = {
                normal: {
                    position: 'top'
                }
            };
            return {
                backgroundColor: "rgba(62,62,62, .2)",
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    },
                    formatter: function (params) {
                        return params[0].name + "<br />" + params[0].seriesName + ": " + params[0].value + "%";
                    }
                },
                grid: {
                    left: 20,
                    right: 30,
                    bottom: 5,
                    top: 40,
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    axisLine: {
                        lineStyle: {
                            color: "#959595",
                            type: 'dashed'
                        }
                    },
                    axisLabel: {
                        color: "#bdbdbd",
                        interval: 0,
                    },
                    axisTick: {
                        show: false
                    },
                    data: ['ten', 'nine', 'eight', 'seven', 'six', 'five', 'four', 'three', 'two', 'one']
                },
                yAxis: {
                    type: 'value',
                    name: '单位:%',
                    axisLine: {
                        lineStyle: {
                            color: "#959595"
                        }
                    },
                    axisLabel: {
                        color: "#bdbdbd"
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
                        name: (new Date().getFullYear())+'年与'+(new Date().getFullYear()-1)+'年同期对比',
                        type: 'bar',
                        barMaxWidth: 40,
                        label: {
                            normal: {
                                show: true,
                                formatter: '{c}%'
                            }
                        },
                        data: [
                            {
                                value: -0.07,
                                label: labelBottom,
                                itemStyle: {
                                    color: "#F76417"
                                }
                            },
                            {
                                value: -0.09,
                                label: labelBottom,
                                itemStyle: {
                                    color: "#F76417"
                                }
                            },
                            {
                                value: 0.2,
                                itemStyle: {
                                    color: "#FFCC01"
                                }
                            },
                            0.44,
                            {
                                value: -0.23,
                                label: labelBottom,
                                itemStyle: {
                                    color: "#F76417"
                                }
                            },
                            0.08,
                            {
                                value: -0.17,
                                label: labelBottom,
                                itemStyle: {
                                    color: "#F76417"
                                }
                            },
                            0.47,
                            {
                                value: -0.36,
                                label: labelBottom,
                                itemStyle: {
                                    color: "#F76417"
                                }
                            },
                            0.18
                        ]
                    }
                ]
            }
        };

        factory.setAnaLine = function () {
            return {
                backgroundColor: "rgba(62,62,62, .2)",
                color: ["#FFCC01", "#F76417"],
                title: {
                    text: '趋势图',
                    left: 'left',
                    padding: [10, 0, 0, 20],
                    textStyle: {
                        color: "#ffcc01",
                        fontSize: 14
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    top: 10,
                    right: 30,
                    data: ['2017', '2018'],
                    textStyle: {
                        color: "#fcolor"
                    }
                },
                grid: {
                    left: 20,
                    right: 30,
                    bottom: 5,
                    top: 60,
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    axisLine: {
                        lineStyle: {
                            color: "#959595"
                        }
                    },
                    axisLabel: {
                        color: "#bdbdbd"
                    },
                    axisTick: {
                        show: false
                    },
                    data: ['1月']
                },
                yAxis: {
                    type: 'value',
                    name: '单位:套',
                    axisLine: {
                        lineStyle: {
                            color: "#959595"
                        }
                    },
                    axisLabel: {
                        color: "#bdbdbd"
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
                        name: '2017',
                        type: 'line',
                        data: []
                    },
                    {
                        name: '2018',
                        type: 'line',
                        data: []
                    }
                ]
            }
        };

        factory.setPollutionBar = function () {
            return {
                backgroundColor: "rgba(62,62,62, .2)",
                color: ["#FFCC01"],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                grid: {
                    left: 20,
                    right: 30,
                    bottom: 5,
                    top: 40,
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    axisLine: {
                        lineStyle: {
                            color: "#959595"
                        }
                    },
                    axisLabel: {
                        color: "#bdbdbd"
                    },
                    axisTick: {
                        show: false
                    },
                    data: []
                },
                yAxis: {
                    type: 'value',
                    name: '单位:袋',
                    axisLine: {
                        lineStyle: {
                            color: "#959595"
                        }
                    },
                    axisLabel: {
                        color: "#bdbdbd"
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
                        name: '物质数量',
                        type: 'bar',
                        barMaxWidth: 40,
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: '{c}'
                            }
                        },
                        data: []
                    }
                ]
            }
        };

        factory.setWatchPie = function () {
            return {
                backgroundColor: "rgba(62,62,62, .2)",
                color: ["#B3D465", "#32B16C", "#00B7EE", "#556FB5", "#AE5DA1", "#EA68A2", "#F19149", "#EC6941", "#F8B551"],
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    top: 'bottom',
                    data: [],
                    textStyle: {
                        color: "#fcolor"
                    }
                },
                series: [
                    {
                        name: '物资关注榜',
                        type: 'pie',
                        center: ['50%', '48%'],
                        radius: [0, '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: true,
                                formatter: '{d}%'
                            }
                        },
                        labelLine: {
                            show: true
                        },
                        data: []
    		        }
    		    ]
            }
        };

        factory.setWarnBar = function () {
            return {
                color: ["#F76417", "#FFCC01"],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    top: 10,
                    left: -5,
                    data: ["最低预警库存", "实际库存"],
                    textStyle: {
                        color: "#bdbdbd"
                    }
                },
                grid: {
                    left: 0,
                    right: 40,
                    bottom: 5,
                    top: 40,
                    containLabel: true
                },
                yAxis: {
                    type: 'category',
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        color: "#bdbdbd"
                    },
                    axisTick: {
                        show: false
                    },
                    data: []
                },
                xAxis: {
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    data: []
                },
                series: [
                    {
                        name: '最低预警库存',
                        type: 'bar',
                        barMaxWidth: 20,
                        label: {
                            normal: {
                                show: true,
                                formatter: '{c}',
                                position: "right",
                                color: '#fcolor'
                            }
                        },
                        data: []
                    },
                    {
                        name: '实际库存',
                        type: 'bar',
                        barMaxWidth: 20,
                        label: {
                            normal: {
                                show: true,
                                formatter: '{c}',
                                position: "right",
                                color: '#fcolor'
                            }
                        },
                        data: []
                    }
                ]
            };
        };

        factory.setRankBar = function () { //各行政区风险源数量排名
            return {
                color: ["#FFCC01"],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                grid: {
                    left: 20,
                    right: 30,
                    bottom: 5,
                    top: 10,
                    containLabel: true
                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        color: "#bdbdbd"
                    },
                    axisTick: {
                        show: false
                    },
                    data: []
                },
                xAxis: {
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
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
                        name: '风险源数量',
                        type: 'bar',
                        barMaxWidth: 20,
                        label: {
                            normal: {
                                show: true,
                                formatter: '{c}',
                                position: "right"
                            }
                        },
                        data: []
                    }
                ]
            }
        };

        factory.setRiskPie = function () { //风险源分类占比
            return {
                color: ["#C62828", "#FFB401",'#fff', "#28A900"],
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: "vertical",
                    top: 20,
                    right: 80,
                    data: [],
                    textStyle: {
                        color: "#bdbdbd"
                    }
                },
                series: [
                    {
                        name: '风险级别分类占比',
                        type: 'pie',
                        center: ['25%', '48%'],
                        radius: ['45%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            formatter: "",
                            color: "#FFCC01"
                        },
                        labelLine: {
                            show: false
                        },
                        data: []
    		        }
    		    ]
            }
        };

        factory.setMateriale = function () { /*物资储备*/
            return {
                color: ["#F76417", "#FFCC01"],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                grid: {
                    left: 0,
                    right: 40,
                    bottom: 5,
                    top: 5,
                    containLabel: true
                },
                yAxis: {
                    type: 'category',
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        color: "#bdbdbd"
                    },
                    axisTick: {
                        show: false
                    },
                    data: []
                },
                xAxis: {
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
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
                        name: '',
                        type: 'bar',
                        barMaxWidth: 20,
                        label: {
                            normal: {
                                show: true,
                                formatter: '{c}',
                                position: "right",
                                color: '#fcolor'
                            }
                        },
                        data: []
                    }
                ]
            }
        };

        factory.aaa = function () { //首页风险排查统计
            return {
                color: ["#A00", "rgb(45,164,57)", "#fc0"],
                tooltip: {
					trigger: 'item',					//formatter: "{a} <br/>{b}: {c} ({d}%)",					formatter: '{a}：<br/>{d}%',					position: 'right'
                    formatter: "{a} : <br/>{d}%",
                    position: 'right'
                },

                legend: {
                    top: 'center',
                    right: 0,
                    data: [],
                    width: '40px',
                    itemWidth: 18,
                    itemHeight: 10,
                    borderRadius: 0,
                    formatter: function (name) {
                        var nameL = name.split("|");
                        return '{b|' + nameL[0] + '}' + " " + '{a|' + nameL[1] + '}';
                    },
                    textStyle: {
                        color: '#fff',
                        fontSize: '14px',
                        rich: {
                            a: {
                                color: '#fc0',
                                align: 'right',
                                width: 50,
                                fontSize: 14
                            },
                            b: {
                                width: 50
                            }
                        }
                    },
                },
                series: [
                    {
                        name: '风险排查统计',
                        type: 'pie',
                        center: ['25%', '50%'],
                        radius: ['35%', '50%'],
                        avoidLabelOverlap: false,
                        label: {
                            formatter: "",
                            color: "#FFCC01"
                        },
                        labelLine: {
                            show: false
                        },
                        data: []
    		        }
    		    ]
            };
        };

        factory.bbb = function () { //首页应急预案备案统计
            return {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    position: 'right'
                },
                grid: {
                    left: '15%',
                    containLabel: true,
                    top: '1%',
                    bottom: '10%'
                },
                xAxis: {
                    show:false,
                    type: 'value',
                    position:'top',
                    splitLine: {show: false},
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: ['风险源总数','已备案','未备案','即将到期', '超期'],
                    axisLine: {
                        lineStyle: {
                            color: 'grey'
                        }
                    },
                    axisLabel: {
                        color: '#fff'
                    },
                    axisTick: {
                        show: false
                    },
                    inverse: true
                },
                series: [
                    {
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    // build a color map as your need.
                                    var colorList = [
                                        '#199ed8',
                                        '#090',
                                        '#ccc',
                                        '#f60',
                                        '#f00',
                                    ];
                                    return colorList[params.dataIndex]
                                },
                                shadowBlur: 20,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        type: 'bar',
                        data: [],
                        barWidth: 15,
                        label:{
                            normal:{
                                show: true,
                                position: 'right'
                            }
                        }
                    }
                ]
            };
        };

        factory.ccc = function () { //首页风险源统计
            return {
                color: ["rgb(45,164,57)","#fc0", "#A00"],
                tooltip: {
                    position: 'right',
                    formatter: '{a}：<br/>{d}%'
                },
                legend: {
                    top: 'center',
                    right: 0,
                    data: [],
                    width: '40px',
                    itemWidth: 18,
                    itemHeight: 10,
                    borderRadius: 0,
                    formatter: function (name) {
                        var nameL = name.split("|");
                        return '{b|' + nameL[0] + '}' + " " + '{a|' + nameL[1] + '}';
                    },
                    textStyle: {
                        color: '#fff',
                        fontSize: '14px',
                        rich: {
                            a: {
                                color: '#fc0',
                                align: 'right',
                                width: 50,
                                fontSize: 14
                            },
                            b: {
                                width: 50
                            }
                        }
                    },
                },
                series: [{
                    name: '风险源统计',
                    type: 'pie',
                    center: ['25%', '50%'],
                    radius: ['35%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        formatter: "",
                        color: "#FFCC01"
                    },
                    labelLine: {
                        show: false
                    },
                    data: []
                }]
            };
        };

        factory.fxyCount = function () { //市风险源数量统计
            return {
                tooltip: {
                    trigger: 'axis',
                    /*axisPointer: {
                        type: 'shadow'
                    },*/
                    position: 'right'
                },
                grid: {
                    left: '10%',
                    containLabel: true,
                    top: '1%',
                    bottom: '5%'
                },
                xAxis: {
                    show:false,
                    type: 'value',
                    position:'top',
                    splitLine: {show: false},
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: [],
                    axisLine: {
                        lineStyle: {
                            color: '#bdbddb'
                        },
                    },
                    axisLabel: {
                        color: '#fff',
                        fontSize:'14'
                    },
                    axisTick: {
                        show: false
                    },
                    inverse: true
                },
                series: [
                    {
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    // build a color map as your need.
                                    // var colorList = ['#68cb00'  , 'yellow'  , 'red'];
                                    var colorList = ['#68cb00','#68cb00','#68cb00'];
                                    var index=0,color;
                                    var riskNum = [0,20,50,100]
                                    if(params.data<riskNum[1]){
                                        color = colorList[0]
                                        return color
                                    }else if(params.data<riskNum[2]){
                                        color = colorList[1];
                                        return new echarts.graphic.LinearGradient(
                                            0, 0, 1, 0,
                                            [
                                                {offset: 0, color: '#68cb00'},
                                                {offset: 1, color: color}
                                            ]
                                        )
                                    }else {
                                        color = colorList[2]
                                        return new echarts.graphic.LinearGradient(
                                            0, 0, 1, 0,
                                            [
                                                {offset: 0, color: '#68cb00'},
                                                // {offset: 0.5, color: 'yellow'},
                                                {offset: 0.5, color: '#68cb00'},
                                                {offset: 1, color: color}
                                            ]
                                        )
                                    }

                                },
                                shadowBlur: 20,
                                shadowColor: ''
                            }
                        },
                        type: 'bar',
                        data: [],
                        barWidth: 15,
                        label:{
                            normal:{
                                show: true,
                                position: 'right',
                                textStyle: {
                                    color: 'white'
                                }
                            }
                        }
                    }
                ]
            };
        };

        factory.wzCount = function () { //市风险源数量统计
            return {
                tooltip: {
                    trigger: 'axis',
                    /*axisPointer: {
                        type: 'shadow'
                    },*/
                    position: 'right'
                },
                grid: {
                    left: '10%',
                    containLabel: true,
                    top: '1%',
                    bottom: '5%'
                },
                xAxis: {
                    show:false,
                    type: 'value',
                    position:'top',
                    splitLine: {show: false},
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: [],
                    axisLine: {
                        lineStyle: {
                            color: '#000'
                        }
                    },
                    axisLabel: {
                        color: '#fff',
                        fontSize:'14'
                    },
                    axisTick: {
                        show: false
                    },
                    inverse: true
                },
                series: [
                    {
                        itemStyle: {
                            normal: {
                                color: '#fc0',
                                shadowBlur: 20,
                                shadowColor: ''
                            }
                        },
                        type: 'bar',
                        data: [],
                        barWidth: 15,
                        label:{
                            normal:{
                                show: true,
                                position: 'right',
                                textStyle: {
                                    color: 'white'
                                }
                            }
                        }
                    }
                ]
            };
        };
        return factory;
    });
});
