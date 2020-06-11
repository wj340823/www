/*
 * 通用的方法指令集合
 */
define(['app','openLayers'], function (app,ol) {
    app.factory("sucHelpers", function () {
        var factory = {};
        factory.isDefined = function (value) {
            return angular.isDefined(value);
        };

        factory.isDefinedAndNotNull = function (value) {
            return angular.isDefined(value) && value !== null;
        };

        //通过obj唯一的属性pro，判断对象数组中是否已有obj
        factory.isContain = function (arr, obj, pro) {
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (arr[i][pro] == obj[pro]) {
                    return true;
                }
            }
            return false;
        }
        //获取第一个符合条件的元素在数组中的下标
        factory.getArrIndex = function (arr, key, val) {
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (arr[i][key] == val) {
                    return i;
                }
            }
            return -1;
        }

        //全选与全不选
        factory.checkAll = function (list, allChecked) {
            list.forEach(function (w) {
                w.checked = allChecked;
            });
            return list;
        }
        factory.getCheckedObj = function (list) {
            var checkedList = [];
            list.forEach(function (w) {
                if (w.checked) {
                    var copy = angular.copy(w);
                    delete copy['checked'];
                    checkedList.push(copy);
                }
            });
            return checkedList;
        }
        factory.getCheckedId = function (list) {
            var checkedIdList = [];
            list.forEach(function (w) {
                if (w.checked) {
                    checkedIdList.push(w.id);
                }
            });
            return checkedIdList;
        }
        factory.checkOne = function (item, list) {
            list.forEach(function (w) {
                w.checked = false;
                if (w === item) {
                    w.checked = true;
                }
            });
        }

        //一个数组中删除另一个数组中已有数据
        factory.delArrsSame = function (arr1, arr2) {
            var len2 = arr2.length;
            var len1 = arr1.length;
            var temp = [],
                tempArr = [];
            for (var i = 0; i < len2; i++) {
                temp[arr2[i]] = true;
            }
            for (var i = 0; i < len1; i++) {
                if (!temp[arr1[i]]) {
                    tempArr.push(arr1[i]);
                }
            }
            return tempArr;
        }

        /*
         * angular.extend(dst, src)  src的同名属性会覆盖dst的同名属性
         * 想要一个只有没有子对象的属性会相互覆盖的方法
         */
        factory.getKeys = function (obj) {
            var keys = [];
            for (var key in obj) {
                keys.push(key);
            }
            return keys;
        }
        factory.getSameNestKeys = function (obj1, obj2) { //获取两个对象的同名且为对象的属性
            if (angular.isArray(obj1) || angular.isArray(obj2)) {
                return [];
            }
            var dstKeys = factory.getKeys(obj1),
                srcKeys = factory.getKeys(obj2),
                resultKeys = [];

            dstKeys.forEach(function (item) {
                if (srcKeys.indexOf(item) != -1) {
                    if (typeof obj2[item] == "object") {
                        resultKeys.push(item);
                    }
                }
            });
            return resultKeys;
        }
        factory.extend = function (dst, src) {
            var keys = factory.getKeys(src);
            //首先判断是否有同名且为对象属性
            var sameKeys = factory.getSameNestKeys(dst, src);
            if (sameKeys.length > 0) {

                //满足条件的属性回调
                sameKeys.forEach(function (item) {
                    if (angular.isArray(dst[item]) || angular.isArray(src[item])) {
                        dst[item] = src[item];
                        return;
                    }
                    factory.extend(dst[item], src[item]);
                });

                //不满足条件的属性进行覆盖
                keys.forEach(function (key) {
                    if (sameKeys.indexOf(key) == -1) {
                        dst[key] = src[key];
                    }
                })
            } else {
                angular.extend(dst, src);
            }
        }

        factory.getDiffMs = function (date3) {
        	//计算出相差天数
            var days = Math.floor(date3 / (24 * 3600 * 1000));

            //计算出小时数
            var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
            var hours = Math.floor(leave1 / (3600 * 1000));

            //计算相差分钟数
            var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000));

            //计算相差秒数
            var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
            var seconds = Math.round(leave3 / 1000);
            if (days == 0) {
                if ((hours + "").length == 1) {
                    hours = "0" + hours;
                }
                if ((minutes + "").length == 1) {
                    minutes = "0" + minutes;
                }
                if ((seconds + "").length == 1) {
                    seconds = "0" + seconds;
                }
                return hours + ":" + minutes + "." + seconds;
            }
            if ((days + "").length == 1) {
                days = "0" + days;
            }
            return days + ":" + hours + ":" + minutes + "." + seconds;
        }
        
        factory.getDiffDate = function (date1, date2) {
            var aDate = date1.split(" "),
                bDate = date2.split(" ");
            var aDay = aDate[0].split("/"),
                bDay = bDate[0].split("/");
            var aTime = aDate[1].split(":"),
                bTime = bDate[1].split(":");
            var oDate1 = new Date(aDay[0], aDay[1] - 1, aDay[2], aTime[0], aTime[1], aTime[2]),
                oDate2 = new Date(bDay[0], bDay[1] - 1, bDay[2], bTime[0], bTime[1], bTime[2]);
            var date3 = oDate2.getTime() - oDate1.getTime() //时间差的毫秒数

            //计算出相差天数
            var days = Math.floor(date3 / (24 * 3600 * 1000));

            //计算出小时数
            var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
            var hours = Math.floor(leave1 / (3600 * 1000));

            //计算相差分钟数
            var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000));

            //计算相差秒数
            var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
            var seconds = Math.round(leave3 / 1000);
            if (days == 0) {
                if ((hours + "").length == 1) {
                    hours = "0" + hours;
                }
                if ((minutes + "").length == 1) {
                    minutes = "0" + minutes;
                }
                if ((seconds + "").length == 1) {
                    seconds = "0" + seconds;
                }
                return hours + ":" + minutes + "." + seconds;
            }
            if ((days + "").length == 1) {
                days = "0" + days;
            }
            return days + ":" + hours + ":" + minutes + "." + seconds;
        }
        factory.setLine = function () {
            return {
                color: ["rgba(239, 61, 18, 0.72)", "rgba(255, 255, 0, 0.72)","rgba(0, 128, 0, 0.72)"],
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
                    data: ['氨氮'],
                    right: 30,
                    top: 10,
                    itemWidth: 25,
                    itemHeight: 10,
                    textStyle: {
                        color: "#dbdbdb"
                    }
                },
                grid: {
                    left: '3%',
                    right: 30,
                    bottom: 5,
                    top: 40,
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: true,
                        data: ['0', '15分钟', '120', '150', '180', '240', '270', '300'],
                        axisLabel: {
                            color: "#dbdbdb"
                        }
                    }
                ],
                yAxis: [
                    {
                        name: "mg/L",
                        nameGap: 20,
                        type: 'value',
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            color: "#dbdbdb"
                        },
                        axisTick: {
                            interval: 1
                        },
                        nameLocation: "end",
                        nameTextStyle: {
                            color: "#dbdbdb"
                        }
                    }
                ],
                series: [
                    {
                        name: '氨氮',
                        type: 'line',
                        smooth: true,
                        data: ["1.9194", "1.3572", "1.1082", "0.9597", "0.8584", "0.7836", "0.7255", "0.6786", "0.6398", "0.6070", "0.5787", "0.5541", "0.5323", "0.5130", "0.4956", "0.4799", "0.4655", "0.4524", "0.4403", "0.4292"],
                        markLine: {
                            data: [{
                                yAxis: 0.7,
                                xAxis: "min"
                            }, {
                                yAxis: 0.7,
                                xAxis: "max"
                            }],
                            lineStyle: {
                                normal: {
                                    color: "rgba(255,0,0,0.5)",
                                    type: 'dashed'
                                }
                            },
                            label: {
                                normal: {
                                    position: 'end',
                                    textStyle: {
                                        color: 'red',
                                        fontSize: 13
                                    }
                                }
                            },
                            symbol: ['', '']
                        },
                        symbol: "circle",
                        itemStyle: {
                            normal: {
                                color: "rgba(239, 61, 18, 0.72)",
                                borderColor: "rgba(239, 94, 18, 0.72)",
                                shadowColor: "rgba(239, 94, 18, 0.72)"
                            }
                        },
                        lineStyle: {
                            normal: {
                                width: 2,
                                color: "rgba(239, 61, 18, 1)"
                            }
                        }

                    }
                    // {
                    //     name: '石油类',
                    //     type: 'line',
                    //     smooth: true,
                    //     data: ["2.8791", "2.0358", "1.6623", "1.4396", "1.2876", "1.1754", "1.0882", "1.0179", "0.9597", "0.9105", "0.8681", "0.8311", "0.7985", "0.7695", "0.7434", "0.7198", "0.6983", "0.6786", "0.6605", "0.6438"],
                    //     markLine: {
                    //         lineStyle: {
                    //             normal: {
                    //                 color: "red",
                    //                 type: 'dashed'
                    //             }
                    //         },
                    //         label: {
                    //             normal: {
                    //                 position: 'end',
                    //                 distance: 0,
                    //                 textStyle: {
                    //                     color: 'white',
                    //                     fontSize: 13
                    //                 }
                    //             }
                    //         },
                    //         data: [[{
                    //             name: "进入赤水河",
                    //             xAxis: "15分钟",
                    //             y: '90%'
                    //         }, {
                    //             xAxis: "15分钟",
                    //             yAxis: 690
                    //         }]],
                    //         symbol: ['', '']
                    //     },
                    //     symbol: "circle",
                    //     itemStyle: {
                    //         normal: {
                    //             color: "rgba(255, 255, 0, 0.72)",
                    //             borderColor: "rgba(237, 196, 22, 0.72)",
                    //             shadowColor: "rgba(237, 196, 22, 0.72)"
                    //         }
                    //     },
                    //     lineStyle: {
                    //         normal: {
                    //             width: 2,
                    //             color: "rgba(255, 255, 0, 1)"
                    //         }
                    //     }
                    // },
                    // {
                    //     name: '总磷',
                    //     type: 'line',
                    //     smooth: true,
                    //     data: ["0.9597", "0.6786", "0.5541", "0.4799", "0.4292", "0.3918", "0.3627", "0.3393", "0.3199", "0.3035", "0.2894", "0.2770", "0.2662", "0.2565", "0.2478", "0.2399", "0.2328", "0.2262", "0.2202", "0.2146"],
                    //     markLine: {
                    //         lineStyle: {
                    //             normal: {
                    //                 color: "red",
                    //                 type: 'dashed'
                    //             }
                    //         },
                    //         label: {
                    //             normal: {
                    //                 position: 'end',
                    //                 distance: 0,
                    //                 textStyle: {
                    //                     color: 'white',
                    //                     fontSize: 13
                    //                 }
                    //             }
                    //         },
                    //         data: [[{
                    //             name: "进入赤水河",
                    //             xAxis: "15分钟",
                    //             y: '90%'
                    //         }, {
                    //             xAxis: "15分钟",
                    //             yAxis: 690
                    //         }]],
                    //         symbol: ['', '']
                    //     },
                    //     symbol: "circle",
                    //     itemStyle: {
                    //         normal: {
                    //             color: "rgba(0, 128, 0, 0.72)",
                    //             borderColor: "rgba(0, 128, 0, 0.72)",
                    //             shadowColor: "rgba(0, 128, 0, 0.72)"
                    //         }
                    //     },
                    //     lineStyle: {
                    //         normal: {
                    //             width: 2,
                    //             color: "rgba(0, 128, 0, 0.72)"
                    //         }
                    //     }
                    // }

                ]
            }
        }

        factory.setBar = function () {
            return {
                color: ["rgba(239, 61, 18, 0.72)", "rgba(255, 255, 0, 0.72)"],
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
                    data: ['氨氮（mg/L）', '甲苯（mg/L）'],
                    right: 5,
                    top: 5,
                    itemWidth: 12,
                    itemHeight: 12,
                    textStyle: {
                        color: "#dbdbdb",
                        fontSize: 12
                    }
                },
                grid: {
                    left: '3%',
                    right: 30,
                    bottom: 5,
                    top: 10,
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: true,
                        data: ['1#背景断面', '2#监测断面', '3#消解断面', '4#出境断面'],
                        axisLabel: {
                            color: "#dbdbdb"
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            color: "#dbdbdb"
                        },
                        axisTick: {
                            interval: 1
                        },
                        nameLocation: "end",
                        nameTextStyle: {
                            color: "#dbdbdb"
                        }
                    }
                ],
                series: [
                    {
                        name: '氨氮（mg/L）',
                        type: 'bar',
                        smooth: true,
                        barWidth: "20%",
                        data: []

                    },
                    {
                        name: '甲苯（mg/L）',
                        type: 'bar',
                        smooth: true,
                        barWidth: "20%",
                        data: []
                    }

                ]
            }
        }


        return factory;
    });
    app.factory("gisCaculate",function(){
        return {
            VincentyConstants : {
                a: 6378137,
                b: 6356752.3142,
                f: 1/298.257223563
            },
            /**
            *Calculate destination point given start point lat/long (numeric degrees),
            * bearing (numeric degrees) & distance (in m).
            */
            destinationVincenty : function(coord, brng, dist) {
                var u = this;
                var ct = u.VincentyConstants;
                var a = ct.a, b = ct.b, f = ct.f;

                var lon1 = coord[0];
                var lat1 = coord[1];

                var s = dist;
                var alpha1 = u.rad(brng);
                var sinAlpha1 = Math.sin(alpha1);
                var cosAlpha1 = Math.cos(alpha1);

                var tanU1 = (1-f) * Math.tan(u.rad(lat1));
                var cosU1 = 1 / Math.sqrt((1 + tanU1*tanU1)), sinU1 = tanU1*cosU1;
                var sigma1 = Math.atan2(tanU1, cosAlpha1);
                var sinAlpha = cosU1 * sinAlpha1;
                var cosSqAlpha = 1 - sinAlpha*sinAlpha;
                var uSq = cosSqAlpha * (a*a - b*b) / (b*b);
                var A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
                var B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));

                var sigma = s / (b*A), sigmaP = 2*Math.PI;
                while (Math.abs(sigma-sigmaP) > 1e-12) {
                    var cos2SigmaM = Math.cos(2*sigma1 + sigma);
                    var sinSigma = Math.sin(sigma);
                    var cosSigma = Math.cos(sigma);
                    var deltaSigma = B*sinSigma*(cos2SigmaM+B/4*(cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)-
                        B/6*cos2SigmaM*(-3+4*sinSigma*sinSigma)*(-3+4*cos2SigmaM*cos2SigmaM)));
                    sigmaP = sigma;
                    sigma = s / (b*A) + deltaSigma;
                }

                var tmp = sinU1*sinSigma - cosU1*cosSigma*cosAlpha1;
                var lat2 = Math.atan2(sinU1*cosSigma + cosU1*sinSigma*cosAlpha1,
                    (1-f)*Math.sqrt(sinAlpha*sinAlpha + tmp*tmp));
                var lambda = Math.atan2(sinSigma*sinAlpha1, cosU1*cosSigma - sinU1*sinSigma*cosAlpha1);
                var C = f/16*cosSqAlpha*(4+f*(4-3*cosSqAlpha));
                var L = lambda - (1-C) * f * sinAlpha *
                    (sigma + C*sinSigma*(cos2SigmaM+C*cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)));

                var revAz = Math.atan2(sinAlpha, -tmp);  // final bearing

                return new ol.proj.toLonLat ([lon1+u.deg(L), u.deg(lat2)],"EPSG:4326");
            },

            /**
             * 度换成弧度
             * @param  {Float} d  度
             * @return {[Float}   弧度
             */
            rad:function(d)
            {
            return d * Math.PI / 180.0;
            },

            /**
             * 弧度换成度
             * @param  {Float} x 弧度
             * @return {Float}   度
             */
            deg:function(x) {
                return x*180/Math.PI;
            }  
        }
    });
    app.factory("gisCache",function(){
        return {
            "airTool":{
                "config":{},
                "simulationId":""
            }
        }
    });

});
