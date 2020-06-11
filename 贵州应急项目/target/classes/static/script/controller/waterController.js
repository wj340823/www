define(['app','openLayers'], function (app,ol) {
    app.controller("waterCtrl", function ($scope, $http, mapSet, olHelpers, olData, $interval, sucHelpers, $timeout) {
        var timer = ""; //定时器

        //本地文件路径数组
        var files = [];
        var timeLen = 22;
        for (var num = 1; num <= timeLen; num++) {
            files.push("dzm/" + num + ".json");
        }
        var jiaData = [527.84, 527.8382839145403, 373.2380299258416, 304.74757530664994, 263.91914195727014, 236.0564567919492, 215.48907704949025, 199.5041188138541, 186.6190149629208, 175.94609463818009, 166.91712134045653, 159.1492307026924, 152.37378765332497, 146.39599983129187, 141.0707152879229, 136.28725887278114, 131.95957097863507, 128.0195881073184, 124.41267664194721, 121.09440726923222, 118.0282283959746, 115.18375670161775, 112.53550025049609];
        var adData = [115.165, 115.16471649044516, 81.43375198381999, 66.49038006690544, 57.58235824522258, 51.50322693642528, 47.01579862897969, 43.52817137756817, 40.716875991909994, 38.38823883014838, 36.41828101973597, 34.723468516951066, 33.24519003345272, 31.94094541773641, 30.779065153728634, 29.73540193587952, 28.79117912261129, 27.9315464961422, 27.144583994606666, 26.420597949650666, 25.75161346821264, 25.131001462171145, 24.553200054653693];
        jiaData = jiaData.map(function (item) {
            return item.toFixed(4);
        })
        adData = adData.map(function (item) {
            return item.toFixed(4);
        })
        var posi = ["枣子湾村", "合江县红十字会九支医院", "赤水一中", "赤水市市中街道办", "赤水市市中司法所", "五里村", "贵州省盐务局赤水支局", "团鱼石", "团鱼石", "水竹林", "松树塝", "赤水市金华中心小学", "赤天化育才学校", "园村沱", "园村沱", "园村沱", "马四家", "鲢鱼溪", "瓦房头", "柏香塝"];

        //污染层级数值与代表颜色
        var color = ["#00FFEF", "#00FFE0", "#00FF84", "#00FF28", "#33FF00", "#8FFF00", "#EBFF00", "#FFB700", "#FF5B00", "#FF0000"];
        var numLevel = [0, 0.01, 0.1, 1, 10, 20, 50, 80, 100, 200];

        function init() {
            $scope.waterModel.tab = 1;
            $scope.waterModel.mgdOverlay = {
                coord: undefined,
                label: {
                    message: "<div class='nowrap'></div>",
                    classNm: "featureOver",
                    placement: "right",
                    stopEvent: false
                }
            }

            $scope.waterModel.posOverlay = {
                coord: undefined,
                label: {
                    message: "<div class='nowrap'></div>",
                    classNm: "posInfo featureOver",
                    placement: "right"
                }
            }
            $scope.param = {
                wid: "",
                deep: "",
                speed: "",
                xs: "",
                constant: ""
            }

            $scope.sensitiveMarkers = []; //敏感点
            $scope.infoBoard = {
                time: ""
            }

            $scope.waterModel.nearCircle = {
                coords: "",
                createEnd: function (feature) {
                    var cg = feature.getGeometry();
                    //敏感点
                    olData.getMap("map1").then(function (map) {
                        var layers = map.getLayers();
                        var circle, no = 0;
                        layers.forEach(function (l) {
                            if (l.get("name") == "mgd") {
                                var points = l.getSource().getFeatures();
                                $scope.infoBoard.mgd = "";
                                points.forEach(function (point) {
                                    var coord = point.getGeometry().getCoordinates();
                                    if (cg.intersectsCoordinate(coord)) {
                                        no++;
                                        point.set("flag", "mgdNotice");
                                        point.setStyle(olHelpers.createStyle({
                                            zIndex: no,
                                            image: {
                                                icon: {
                                                    anchor: [0.5, 1],
                                                    color: "#005BFF",
                                                    opacity: 1,
                                                    src: 'images/listIcon.png'
                                                }
                                            },
                                            text: {
                                                text: no + "",
                                                offsetX: 0,
                                                offsetY: -12,
                                                font: '500 16px',
                                                fill: {
                                                    color: "white"
                                                }
                                            }
                                        }))

                                        $scope.infoBoard.mgd += ", " + point.get("NAME");
                                    } else {
                                        point.setStyle(olHelpers.createStyle({
                                            image: {
                                                circle: {
                                                    radius: 2,
                                                    fill: {
                                                        color: [255, 0, 0, 0]
                                                    }
                                                }
                                            }
                                        }))
                                    }
                                })
                                if ($scope.infoBoard.mgd) {
                                    $scope.infoBoard.mgd = $scope.infoBoard.mgd.substr(1).split(",");
                                } else {
                                    $scope.infoBoard.mgd = [];
                                }

                            }
                        })
                    })
                    if ($scope.fileIndex == 0) {
                        $scope.waterModel.posOverlay.label.message = "<div style='white-space:nowrap;'>" + "废液经严家河进入赤水河" + "</div>";
                    } else if ($scope.fileIndex == timeLen - 1) {
                        $scope.waterModel.posOverlay.label.message = "<div style='white-space:nowrap;'>" + "污染团流入四川省境内" + "</div>";
                    } else {
                        $scope.waterModel.posOverlay.label.message = "<div style='white-space:nowrap;'>污染团流经" + posi[$scope.fileIndex - 1] + "</div>";
                    }
                    $scope.waterModel.posOverlay.coord = cg.getCenter();
                    console.log(cg.getCenter())
                }
            }


            $scope.infoShow = false;
            //敏感点
            $scope.waterModel.mgdLayer = {
                name: "mgd",
                source: {
                    type: "GeoJSON",
                    url: "mgd.json"
                },
                style: {
                    image: {
                        circle: {
                            radius: 2,
                            fill: {
                                color: [255, 0, 0, 0]
                            }
                        }
                    }
                },
                zIndex: 20
            }

            $scope.fileIndex = -1; //文件读取指针
            $scope.waterModel.dzmLayer = { //等值面图层
                source: {
                    type: "GeoJSON",
                    geojson: {
                        projection: "EPSG:4326",
                        object: ""
                    },
                    style: function(f){
                    	var fvalue = parseFloat(f.get("value"));
                        var len = numLevel.length;
                        var fcolor = color[len - 1];
                        for (var i = len - 1; i >= 0; i--) {
                            if (fvalue < numLevel[i]) {
                                fcolor = color[i - 1];
                            }
                        }

                        return olHelpers.createStyle({
                            fill: {
                                color: fcolor
                            }
                        })
                    }
                },
                style: {
                    fill: {
                        color: "transparent"
                    }
                },
                zIndex: 9,
                visible: false,
                regionLoaded: function (oSource) {
                    if (!oSource) {
                        return false;
                    }
                    var features = oSource.getFeatures();
                    var max = parseFloat(features[0].get("value")),
                        maxIndex = 0;
                    features.forEach(function (f, no) {
                        var fvalue = parseFloat(f.get("value"));
                        if (fvalue >= max) {
                            maxIndex = no;
                            max = fvalue;
                        }
                    })
                    $scope.waterModel.nearCircle.coords = features[maxIndex].getGeometry().getInteriorPoint().getCoordinates();
                    $scope.waterModel.nearCircle.visible = true;

                    var coord = olHelpers.coordinateTransform($scope.waterModel.nearCircle.coords, "EPSG:3857", "EPSG:4326");
                    $scope.olMap.center.lon = coord[0];
                    $scope.olMap.center.lat = coord[1];
                }
            }
            $scope.times = mapSet.getTimes();

            $scope.waterModel.plot40l3 = {
                start: false,
                type: "",
                img: "images/source.png",
                edit: true,
                clear: false,
                point: [{
                    plotType: {
                        type: "MARKER",
                    },
                    coords: [olHelpers.coordinateTransform([105.758480622, 28.5551627353], "EPSG:4326", "EPSG:3857")],
                    style: {
                        image: {
                            icon: {
                                anchor: [0.5, 1],
                                opacity: 1,
                                src: 'images/source.png'
                            }
                        }
                    }
	                    }],
                drawEnd: function (feature) {
                    $scope.olMap.center.zoom =14;
                }
            }
        }
        init();

        $scope.changeTab = function (no) {
            $scope.waterModel.tab = no;

            if ($scope.playStatus) {
                $scope.playStatus = !$scope.playStatus;
                if (timer) {
                    $interval.cancel(timer);
                }
            }
        }
        //重新定位
        $scope.changePlot = function () {
            $scope.waterModel.plot40l3.start = true;
            $scope.olMap.center.lat = 28.5551627353;
            $scope.olMap.center.lon = 105.758480622;
            $scope.param = {
                wid: 50,
                deep: 8,
                speed: 0.5,
                xs: 6,
                constant: 0
            }
            if (!$scope.waterModel.plot40l3.type) {
                $scope.waterModel.plot40l3.clear = true;
                $scope.waterModel.plot40l3.type = "";
            }
        }
        $scope.changePlot();

        //开始模拟
        //时段
        function readData(url) {
            if (url == -1) {
                $scope.waterModel.dzmLayer.visible = true;
                $scope.infoBoard.time = "0";
                $scope.infoBoard.jia = jiaData[0];
                $scope.infoBoard.ad = adData[0];

                var len = numLevel.length;
                var color1 = color[len - 1],
                    color2 = color[len - 1];
                for (var i = len - 1; i >= 0; i--) {
                    if (jiaData[0] < numLevel[i]) {
                        color1 = color[i - 1];
                    }
                    if (adData[0] < numLevel[i]) {
                        color2 = color[i - 1];
                    }
                }
                $scope.infoBoard.jiaColor = {
                    background: color1
                };
                $scope.infoBoard.adColor = {
                    background: color2
                };

                $scope.infoBoard.mgd = [];

                $scope.times.forEach(function (t, no) {
                    t.processed = false;
                    t.selected = false;
                });
                $scope.times[0].processed = true;
                $scope.times[0].selected = true;
                $scope.waterModel.dzmLayer.visible = false;
                $scope.waterModel.nearCircle.visible = false;
                $scope.waterModel.posOverlay.label.message = "<div style='white-space:nowrap;'>" + "甲苯和液氨废液进入严家河" + "</div>";
                var posCoord = olHelpers.coordinateTransform([105.758480622, 28.5551627353], "EPSG:4326", "EPSG:3857");
                $scope.waterModel.posOverlay.coord = posCoord;
                //敏感点
                olData.getMap("map1").then(function (map) {
                    var layers = map.getLayers();
                    var circle, no = 0;
                    layers.forEach(function (l) {
                        if (l.get("name") == "mgd") {
                            var points = l.getSource().getFeatures();
                            $scope.infoBoard.mgd = [];
                            points.forEach(function (point) {
                                point.setStyle(olHelpers.createStyle({
                                    image: {
                                        circle: {
                                            radius: 2,
                                            fill: {
                                                color: [255, 0, 0, 0]
                                            }
                                        }
                                    }
                                }))
                            })
                        }
                    })
                })

                $scope.valColor = {
                    color: "#FFCC01"
                }
                return;
            }
            $http.get(url).then(function (data) {
                var res = data.data;
                var arr = [];
                res.forEach(function (f) {
                    arr.push({
                        type: "Feature",
                        geometry: {
                            type: "Polygon",
                            coordinates: f.geometry.rings
                        },
                        properties: f.attributes
                    })
                })
                var obj = {
                    type: "FeatureCollection",
                    features: arr
                }
                $scope.waterModel.dzmLayer.source.geojson.object = obj;
                $scope.waterModel.dzmLayer.visible = true;

                $scope.times.forEach(function (t, no) {
                    if (no < $scope.fileIndex + 1) {
                        t.processed = true;
                        t.selected = false;
                    } else if (no == $scope.fileIndex + 1) {
                        t.processed = true;
                        t.selected = true;
                        $scope.infoBoard.time = t.val;

                        $scope.infoBoard.jia = jiaData[no];
                        $scope.infoBoard.ad = adData[no];

                        var len = numLevel.length;
                        var color1 = color[len - 1],
                            color2 = color[len - 1];
                        for (var i = len - 1; i >= 0; i--) {
                            if (jiaData[no] < numLevel[i]) {
                                color1 = color[i - 1];
                            }
                            if (adData[no] < numLevel[i]) {
                                color2 = color[i - 1];
                            }
                        }
                        $scope.infoBoard.jiaColor = {
                            background: color1
                        };
                        $scope.infoBoard.adColor = {
                            background: color2
                        };
                    } else {
                        t.processed = false;
                        t.selected = false;
                    }
                })

                if ($scope.fileIndex % 2 != 0) {
                    $scope.valColor = {
                        color: "#FFCC01"
                    }
                } else {
                    $scope.valColor = {
                        color: "#33ff86"
                    }
                }
            })
        }
        $scope.waterModel.calculating = false;
        $scope.startSimulate = function () {
            $scope.waterModel.calculating = true;
            $scope.waterModel.dzmLayer.visible = false;
            if (timer) {
                $interval.cancel(timer);
            }
            $scope.times.forEach(function (t, no) {
                t.processed = false;
                t.selected = false;
            })
            $scope.playStatus = false;
            $scope.waterModel.nearCircle.visible = false;
            $scope.fileIndex = -1;
            $scope.infoShow = false;
            $scope.waterModel.posOverlay.coord = undefined;

            $timeout(function () {
                $scope.waterModel.calculating = false;
                $scope.infoShow = true;
                readData(-1);
                $scope.fileIndex = -1;
                // $scope.play();

                $scope.lineOp = sucHelpers.setLine();
                var tArr = [];
                $scope.times.forEach(function (t) {
                    tArr.push(t.name);
                })
                $scope.lineOp.xAxis[0].data = tArr;
                $scope.lineOp.series[0].data = adData;
                $scope.lineOp.series[1].data = jiaData;
            }, 3000);
        }
        //$scope.startSimulate();

        $scope.prev = function () {
            if ($scope.fileIndex > 0) {
                $scope.fileIndex--;
                readData(files[$scope.fileIndex]);
            }

        }
        $scope.playStatus = false;
        $scope.play = function () {
            $scope.playStatus = !$scope.playStatus;
            if (!$scope.playStatus) {
                if (timer) {
                    $interval.cancel(timer);
                }
            } else {
                if ($scope.fileIndex == timeLen - 1) {
                    $scope.fileIndex = 0;
                    readData(files[$scope.fileIndex]);
                }
                timer = $interval(function () {
                    if ($scope.fileIndex < timeLen - 1) {
                        $scope.fileIndex++;
                        readData(files[$scope.fileIndex]);
                        if ($scope.fileIndex == timeLen - 1) {
                            $interval.cancel(timer);
                            $scope.playStatus = false;
                        }
                    } else {
                        $interval.cancel(timer);
                        $scope.playStatus = false;
                    }

                }, 2000);
            }
        }

        $scope.next = function () {
            if ($scope.fileIndex < timeLen - 1) {
                $scope.fileIndex++;
                readData(files[$scope.fileIndex]);
            }
        }

        $scope.toggleTime = function (t, no) {
            $scope.fileIndex = no - 1;
            if ($scope.fileIndex == -1) {
                readData(-1);
            } else {
                readData(files[$scope.fileIndex]);
            }

        }
        $scope.valColor = {
            color: "#FFCC01"
        }
        $scope.$watch("fileIndex", function (n, o) {

        })
    });
    app.controller("detailCtrl", function ($scope) {
        $scope.detail = {};
        $scope.sensitiveMarkers.forEach(function (m, index) {
            if (m.id == $scope.selectedLayid) {
                $scope.detail.name = m.info.name;
                $scope.detail.status = m.info.status;
                $scope.detail.index = index;
            }
        })
        $scope.$watch("fileIndex", function (n, o) {
            if ($scope.waterModel.dzmLayer.visible) {
                $scope.sensitiveMarkers.forEach(function (item) {
                    item.info.status = "正常";
                })
                if (n == 0) {
                    $scope.sensitiveMarkers[0].info.status = "危险";
                }
                if (n > 0 && n < 5) {
                    $scope.sensitiveMarkers[1].info.status = "危险";
                }
                if (n > 3 && n < 7) {
                    $scope.sensitiveMarkers[2].info.status = "危险";
                }
                if (n > 5 && n < 8) {
                    $scope.sensitiveMarkers[3].info.status = "危险";
                }
                $scope.detail.status = $scope.sensitiveMarkers[$scope.detail.index].info.status;
            }
        });
    })
    app.controller("waterSand", function ($scope, $http, olHelpers, olData, sucHelpers, mapSet) {

        $scope.waterModel.sourceMarker = { //事故发生地点
            id: "source",
            lat: 28.5551627353,
            lon: 105.758480622,
            projection: "EPSG:4326",
            overLabel: { //悬浮显示的信息
                id: "source",
                message: '<div style="white-space:nowrap;min-width:100px">事故发生点</div>',
                classNm: "featureOver",
                placement: "right"
            },
            style: {
                image: {
                    icon: {
                        anchor: [0.5, 1],
                        opacity: 1,
                        src: 'images/source.png'
                    }
                }
            }
        }

        $scope.waterModel.jcdLayer = { //监测点
            source: {
                type: "GeoJSON",
                url: "监测断面.geo.json"
            },
            zIndex: 19,
            style: {
                image: {
                    icon: {
                        anchor: [0.5, 1],
                        opacity: 1,
                        src: 'images/wp2.png'
                    }
                }
            }
        }

        $scope.waterModel.jcdOverlay = mapSet.setJcdLay("<div class='nowrap'></div>",undefined);
        $scope.waterModel.jcdOverlay1 = mapSet.setJcdLay("<div style='white-space:nowrap;'>1#背景断面</div>",[105.6926, 28.5665]);
        $scope.waterModel.jcdOverlay2 = mapSet.setJcdLay("<div style='white-space:nowrap;'>2#监测断面</div>",[105.6915, 28.571]);
        $scope.waterModel.jcdOverlay3 = mapSet.setJcdLay("<div style='white-space:nowrap;'>3#消解断面</div>",[105.713, 28.5867]);
        $scope.waterModel.jcdOverlay4 = mapSet.setJcdLay("<div style='white-space:nowrap;'>4#出境监控断面</div>",[105.7356, 28.6135]);

        $scope.eventsCoords = [[105.6926, 28.5665], [105.6915, 28.571], [105.713, 28.5867], [105.7356, 28.6135]];
        $scope.waterModel.eventsMarker = [];
        $scope.eventsCoords.forEach(function (e, no) {
            var item = {
                id: "event" + no,
                lat: e[1],
                lon: e[0],
                overLabel: { //悬浮显示的信息
                    id: "event" + no,
                    message: '<div style="white-space:nowrap;min-width:100px"></div>',
                    classNm: "markerOver",
                    placement: "right"
                },
                style: {
                    zIndex: no + 1,
                    image: {
                        icon: {
                            anchor: [0.5, 1],
                            color: "#FFCC01",
                            opacity: 1,
                            src: 'images/locate.png'
                        }
                    }
                },
                active: false
            }
            $scope.waterModel.eventsMarker.push(item);
        })

        var flash = olHelpers.flash;
        $scope.slimOp = {
            height: $(window).height() - 520 + "px",
            size: "2px",
            color: "#2687FA"
        }
        var times = ["15:00", "17:00", "19:00", "21:00"];
        $scope.patchTimes = [{
            val: times[0]
        }, {
            val: times[1]
        }, {
            val: times[2]
        }, {
            val: times[3]
        }]

        $scope.eventsTotal = [{
            time: "2017/12/20 15:00",
            msg: "一"
        }, {
            time: "2017/12/20 17:00",
            msg: "二"
        }, {
            time: "2017/12/20 19:00",
            msg: "三"
        }, {
            time: "2017/12/20 21:00",
            msg: "四"
        }]
        $scope.events = [];
        $scope.timeSel = {}
        $scope.timeIndex = 0;
        var initTime = "2017/12/20 12:00:00";

        $scope.prev = function () {
            if ($scope.timeIndex == 0) {
                return;
            }
            $scope.timeIndex--;
        }

        $scope.next = function () {
            if ($scope.timeIndex == $scope.eventsTotal.length - 1) {
                return;
            }
            $scope.timeIndex++;
        }
        $scope.clear = function () {
            $scope.events = [{
                time: "2017/12/20 15:00",
                msg: $scope.eventsTotal[0].msg,
                active: true
            }];
            $scope.timeSel = {
                time: "2017/12/20 15:00:00",
                disTime: "02:00.00"
            }
            $scope.timeIndex = 0;
            var coord = $scope.eventsCoords[$scope.timeIndex];
            $scope.olMap.center.lon = coord[0];
            $scope.olMap.center.lat = coord[1];
        }

        var lineOb = sucHelpers.setLine();

        var chart1 = [[0, 0, 0, 0], [0.203, 0.198, 0.196, 0.196]]; //1#  甲苯、氨氮
        var chart2 = [[106, 10.5, 1.67, 0.16], [86, 5.63, 0.93, 0.48]]; //2#
        var chart3 = [[2.55, 30.8, 6.35, 0.26], [0.86, 26.3, 4.73, 0.62]]; //3#
        var chart4 = [[0, 0, 0.42, 0.12], [0.203, 0.199, 0.35, 0.253]]; //4#
        var chart5 = [];
        chart5[0] = [[chart1[0][0], chart2[0][0], chart3[0][0], chart4[0][0]], [chart1[1][0], chart2[1][0], chart3[1][0], chart4[1][0]]]; //15：00
        chart5[1] = [[chart1[0][1], chart2[0][1], chart3[0][1], chart4[0][1]], [chart1[1][1], chart2[1][1], chart3[1][1], chart4[1][1]]]; //17：00
        chart5[2] = [[chart1[0][2], chart2[0][2], chart3[0][2], chart4[0][2]], [chart1[1][2], chart2[1][2], chart3[1][2], chart4[1][2]]]; //19：00
        chart5[3] = [[chart1[0][3], chart2[0][3], chart3[0][3], chart4[0][3]], [chart1[1][3], chart2[1][3], chart3[1][3], chart4[1][3]]]; //21：00
        $scope.barTitle = ["15:00第一次", "17:00第二次", "19:00第三次", "21:00第四次"];
        var stableTitle = "应急监测 赤水河贵州境内污染趋势";
        $scope.dataBoard = angular.copy(chart5);

        var chartData = [chart1, chart2, chart3, chart4];
        lineOb.xAxis[0].data = times;
        $scope.chart1 = angular.copy(lineOb);
        $scope.chart2 = angular.copy(lineOb);
        $scope.chart2.series[0].data = chart2[1];
        $scope.chart2.series[1].data = chart2[0];
        $scope.chart3 = angular.copy(lineOb);
        $scope.chart3.series[0].data = chart3[1];
        $scope.chart3.series[1].data = chart3[0];
        $scope.chart4 = angular.copy(lineOb);
        $scope.chart4.series[0].data = chart4[1];
        $scope.chart4.series[1].data = chart4[0];

        $scope.chart5 = sucHelpers.setBar();

        $scope.$watch("timeIndex", function (n, o) {
            $scope.chart1.series[0].data = [];
            $scope.chart1.series[1].data = [];
            $scope.chart2.series[0].data = [];
            $scope.chart2.series[1].data = [];
            $scope.chart3.series[0].data = [];
            $scope.chart3.series[1].data = [];
            $scope.chart4.series[0].data = [];
            $scope.chart4.series[1].data = [];
            for (var i = 0; i <= n; i++) {
                $scope.chart1.series[0].data.push(chart1[1][i]);
                $scope.chart1.series[1].data.push(chart1[0][i]);
                $scope.chart2.series[0].data.push(chart2[1][i]);
                $scope.chart2.series[1].data.push(chart2[0][i]);
                $scope.chart3.series[0].data.push(chart3[1][i]);
                $scope.chart3.series[1].data.push(chart3[0][i]);
                $scope.chart4.series[0].data.push(chart4[1][i]);
                $scope.chart4.series[1].data.push(chart4[0][i]);
            }
            $scope.chart5.series[0].data = chart5[n][1];
            $scope.chart5.series[1].data = chart5[n][0];

            $scope.events.forEach(function (e) {
                e.active = false;
            })
            if ($scope.events.length < 4 && (n >= $scope.events.length)) {
                var item = angular.copy($scope.eventsTotal[n]);
                item.active = true;
                $scope.events.push(item);

            } else {
                $scope.events[$scope.timeIndex].active = true;
            }
            $scope.timeSel.time = $scope.eventsTotal[$scope.timeIndex].time + ":00";
            $scope.timeSel.disTime = sucHelpers.getDiffDate(initTime, $scope.timeSel.time);

            olData.getMap("map1").then(function (map) {
                var coord = $scope.eventsCoords[$scope.timeIndex];
                $scope.olMap.center.lon = coord[0];
                $scope.olMap.center.lat = coord[1];
                flash(map, coord, 3000);
                map.render();
            })
        });

    });
    app.controller("waterCtrl2",function($rootScope,$scope, $http,$q,$stateParams, mapSet,dataSet, olHelpers, olData, $interval, sucHelpers, $timeout,$interval,gisCaculate,gisCache){

        var defaultCenter = [106.8,26.931];
        var defaultZoom = 10;
        var rivers = [
            {
                name:"曹渡河",
                id:"1"
            },
            {
                name:"赤水河",
                id:"2"
            },
            {
                name:"大环江",
                id:"3"
            },
            {
                name:"都柳江01",
                id:"4"
            },
            {
                name:"都柳江02",
                id:"4"
            },
            {
                name:"都柳江03",
                id:"5"
            },
            {
                name:"独水河",
                id:"6"
            },
            {
                name:"芙蓉江",
                id:"8"
            },
            {
                name:"红水河",
                id:"9"
            },
            {
                name:"花溪河",
                id:"10"
            },{
                name:"北盘江",
                id:"11"
            },
            {
                name:"剑江",
                id:"12"
            },
            {
                name:"锦江",
                id:"13"
            },
            {
                name:"锦江02",
                id:"14"
            },
            {
                name:"涟江",
                id:"15"
            },
            {
                name:"六冲河",
                id:"16"
            },
            {
                name:"猫跳河",
                id:"17"
            },
            {
                name:"蒙江",
                id:"18"
            },
            {
                name:"南盘江",
                id:"19"
            },
            {
                name:"清水江",
                id:"20"
            },
            {
                name:"三岔河",
                id:"21"
            },
            {
                name:"三岔河02",
                id:"22"
            },
            {
                name:"三岔河03",
                id:"23"
            },
            {
                name:"赏泥江",
                id:"24"
            },
            {
                name:"石阡河",
                id:"25"
            },
            {
                name:"市西河",
                id:"26"
            },
            {
                name:"乌江",
                id:"27"
            },
            {
                name:"无名河01",
                id:"28"
            },
            {
                name:"无名河02",
                id:"29"
            },
            {
                name:"无名河03",
                id:"30"
            },
            {
                name:"无名河04",
                id:"31"
            },
            {
                name:"无名河05",
                id:"32"
            },
            {
                name:"无名河06",
                id:"33"
            },
            {
                name:"无名河07",
                id:"34"
            },
            {
                name:"习水河",
                id:"35"
            },
            {
                name:"湘江01",
                id:"36"
            },
            {
                name:"湘江02",
                id:"37"
            },
            {
                name:"湘江03",
                id:"38"
            },
            {
                name:"湘江04",
                id:"39"
            },
            {
                name:"小环江",
                id:"40"
            },
            {
                name:"印江",
                id:"41"
            },
            {
                name:"寨蒿河",
                id:"42"
            },
            {
                name:"漳江",
                id:"43"
            },
            {
                name:"重安江",
                id:"44"
            }
        ];
        var levels = [
            {
                name:"50",
                value:[0, 50, 100, 150, 200, 250, 300, 350, 400, 500]
            },
            {
                name:"100",
                value:[0, 100, 200, 300, 400, 500, 600, 700, 800, 900]
            },
            {
                name:"200",
                value:[0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800]
            },
            {
                name:"500",
                value:[0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000]
            }
        ];
        var speeds = [
            {name:"快",value:10},
            {name:"中",value:15},
            {name:"慢",value:20}
        ];
        var createActiveStyle = function(name){
            return new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#90dfff',
                    width: 4
                }),
                fill:new ol.style.Fill({
                    color:"rgba(144,223,255,0.6)"
                }),
                text:new ol.style.Text({
                    text: name,
                    font: '20px 微软雅黑',
                    fill:new ol.style.Fill({
                        color:"#ffcc01"
                    })
                })
            });
        };

        $scope.modal = {
            tab:1,
            river:"",
            rivers:rivers,
            speeds:speeds,
            levels:levels,
            riverFeature:null,
            coordInFeature:coordInFeature,
            startSimulate:startSimulate,
            init:initPage
        };

        $scope.waterModalTool.plot40l3 = {
            start: false,
            type: "",
            img: "images/source.png",
            edit: true,
            clear: false,
            start:true,
            timer:"",
            coord:[],
            point: [{
                plotType: {
                    type: "MARKER",
                },
                coords:[olHelpers.coordinateTransform(defaultCenter, "EPSG:4326", "EPSG:3857")],
                style: {
                    image: {
                        icon: {
                            anchor: [0.5, 1],
                            opacity: 1,
                            src: 'images/source.png'
                        }
                    }
                }
                    }],
            drawEnd: function (feature) {
                //$scope.olMap.center.zoom =14;
            },
            draging:function(coord){
                $scope.waterPlayer.config.lg = coord[0];
                $scope.waterPlayer.config.lt = coord[1];
                $scope.$apply();
            }
        };
        $scope.waterModalTool.plot40l3.marker = [
            {
                id:'',
                lon:106.8,
                lat:26.931,
                style:{
                    image: {
                        icon: {
                            anchor: [0.5, 1],
                            opacity: 1,
                            src: 'images/source.png'
                        }
                    }
                }
            }
        ]
        $scope.waterPlayer = {
            timer:"", //定时器
            timeLen:0,
            fileIndex:-1,
            loading:false,
            playing:false,
            legendOpt:{size:"5px",height:"200px"},
            from:"",
            to:"",
            config:{
                speed:20,
                amount:120000,//污染物总量
                levels:null,//
                lg:"",
                lt:"",
                pollutant:"磷酸",
                harmRange:500
            },
            files:[],
            times:[],
            modalData:[],//模型原始数据
            wrwData:[], //污染物数据
            addrs:[],//河流流经地点
            riverFeature:null,
            timeLineShow:false,
            infoBoard:{},
            numLevel:[],
            color:[],
            echarts:[],
            getData:_getWaterData,
            setData:_setData,
            readData:_waterReadData,
            initFiles:_initFiles,
            playPause:_waterPlayPause,
            prev:_waterPrev,
            next:_waterNext,
            toggle:_waterToggle,
            onload:_waterOnloaded,
            initEcharts:_initEcharts,
            init:_waterInit,
            destroy:_destroy
        };
        //定位到始发地
        $scope.locateWryStart = function () {
            if($scope.waterPlayer.config.lg&&$scope.waterPlayer.config.lt){
                $scope.olMap.center.lon = parseFloat($scope.waterPlayer.config.lg);
                $scope.olMap.center.lat = parseFloat($scope.waterPlayer.config.lt);
                $scope.olMap.center.zoom = 14
            }else {
                alert('请先设置经纬度')
            }

        }
        //判断点是否在河面内
        function coordInFeature(coord,proj,padding){
        	if(!coord)return false;
            if(this.riverFeature){
            	var item = 0.00001;
                var geo = this.riverFeature.getGeometry();
                var proj = proj || "EPSG:4326";
                var _coord = olHelpers.coordinateTransform(coord,proj,"EPSG:3857");
                if(!padding){
                	return geo.intersectsCoordinate(_coord);
                }
                var num = parseInt(2 * padding / item),
                	minX = coord[0] - item * num / 2,
                	minY = coord[1] - item * num / 2,
                	xlist = [],
                	ylist = [];
                for(var i=0;i<num;i++){
                	xlist.push(minX + i*item);
                	ylist.push(minY + i*item);
                }

                for(var i=0,len1=xlist.length;i<len1;i++){
                	for(var j=0,len2=ylist.length;j<len2;j++){
                		var _coord = olHelpers.coordinateTransform([xlist[i],ylist[j]],proj,"EPSG:3857");
                		if(geo.intersectsCoordinate(_coord)){
                			return true;
                		}
                	}
                }
                return false;

            }
        };

        function _getWaterData(amount){
            var self = this;
            var url = dataSet.getUrls().modalQuery + "?amount="+(amount || 366120);
            $http.get(url).then(function(data){
                self.modalData = data.data && data.data.features || [];
                self.wrwData = data.data && data.data.concentrations || [];
                self.wrwData = self.wrwData.map(function(item){
                    return item.toFixed(4);
                });
                var arr = []
                var str = '';
                data.data.features.forEach(function (item,index) {
                    if(item.length>0){
                        var max = parseFloat(item[0].attributes.value),
                            maxIndex = 0;
                        item.forEach(function (f, no) {
                            var fvalue = parseFloat(f.attributes.value);
                            if (fvalue >= max) {
                                maxIndex = no;
                                max = fvalue;
                            }
                        })
                        var feature = new ol.Feature({
                            geometry: new ol.geom.Polygon(item[maxIndex].geometry.rings).transform("EPSG:4326", "EPSG:3857")
                        });
                        var len = item[maxIndex].geometry.rings[0].length

                        var coords = feature.getGeometry().getInteriorPoint().getCoordinates();
                        var point = olHelpers.coordinateTransform(coords,'EPSG:3857','EPSG:4326');
                        str+=point[0]+'_'+point[1]+'_'+$scope.waterPlayer.config.river.name+';'
                    }
                })
                $scope.waterPlayer.msgs = []
                $http.get('waterEven/input?str='+str).then(function (data) {
                    $scope.waterPlayer.msgs = data.data
                    self.onload();
                }).catch(function (data) {
                    alert('计算点位信息失败')
                })

            },function(){
                self.loading = false;
                alert("模型计算失败...");
            });
        };

        function _setData(){
            var  defer = $q.defer();
            var config = this.config;
            setInline().then(setOutline).then(setModel).then(function(){
                defer.resolve();
            });
            return defer.promise;
        };

        function setOutline(){
            var defer = $q.defer();
            var config = $scope.waterPlayer.config;
            var fileUrl = "dzm/"+config.river.name+"/outline.json";
            $http.get(fileUrl).then(function(data){
                var geoJson = data.data;
                var url = dataSet.getUrls().setOutline;
                $http({
                    method:"POST",
                    url:url,
                    data:geoJson,
                    transformResponse:function(data){
                        return data
                    }
                })
                .then(function(data){
                    console.log(data);
                    defer.resolve();
                });
            });
            return defer.promise;
        };

        function setInline(){
            var defer = $q.defer();
            var config = $scope.waterPlayer.config;
            var fileUrl = "dzm/"+config.river.name+"/inline.json";
            $http.get(fileUrl).then(function(data){
                var geoJson = data.data;
                var url = dataSet.getUrls().setInline;
                $http.get(fileUrl).then(function(data){
                    $http({
                        method:"POST",
                        url:url,
                        data:geoJson,
                        transformResponse:function(data){
                            return data
                        }
                    })
                    .then(function(data){
                        console.log(data);
                        defer.resolve();
                    });
                });
            });
            return defer.promise;
        };

        function setModel(){
            var defer = $q.defer();
            var config = $scope.waterPlayer.config;
            var url = dataSet.getUrls().setModal;
            var body ={
                "samplePoint": config.speed,
                "start":null,
                "target":config.levels
            }
            if(config.lt && config.lg){
                body.start = [config.lg,config.lt];
            }
            $http({
                method:"POST",
                url:url,
                data:body,
                transformResponse:function(data){
                    return data
                }
            })
            .then(function(data){
                console.log(data);
                defer.resolve();
            });
            return defer.promise;
        };

        function _waterReadData(url){
            var self = this,
                wrwData = self.wrwData,
                numLevel = self.numLevel,
                colors = self.color,
                fileIndex = self.fileIndex;
            if (url == -1) {
                $scope.waterModalTool.dzmLayer.visible = true;
                self.infoBoard.time = "0";
                self.infoBoard.wrwData = wrwData[0];
                var len = numLevel.length;
                var color = colors[len - 1];
                for (var i = len - 1; i >= 0; i--) {
                    if (wrwData[0] < numLevel[i]) {
                        color = colors[i - 1];
                    }
                }
                self.infoBoard.wrwColor = {
                    color: color
                };
                self.times.forEach(function (t, no) {
                    t.processed = false;
                    t.selected = false;
                });
                self.times[0].processed = true;
                self.times[0].selected = true;
                $scope.waterModalTool.dzmLayer.visible = false;
                $scope.waterModalTool.nearCircle.visible = false;
                //敏感点
                $scope.resourceMap.mgd.markers.forEach(function(marker){
                    marker.visible = false;
                });
                return;
            }
            var modal = self.modalData[fileIndex];
            var features = modal.map(function(f){
                return {
                    type: "Feature",
                    geometry: {
                        type: "Polygon",
                        coordinates: f.geometry.rings
                    },
                    properties: f.attributes
                }
            });
            var obj = {
                type: "FeatureCollection",
                features: features
            }
            $scope.waterModalTool.dzmLayer.source.geojson.object = obj;
            $scope.waterModalTool.dzmLayer.visible = true;
            self.times.forEach(function (t, no) {
                if (no < fileIndex + 1) {
                    t.processed = true;
                    t.selected = false;
                } else if (no == fileIndex + 1) {
                    t.processed = true;
                    t.selected = true;
                    self.infoBoard.time = t.val;
                    self.infoBoard.wrwData = wrwData[fileIndex];
                    var len = numLevel.length;
                    var color = colors[len - 1];
                    for (var i = len - 1; i >= 0; i--) {
                        if (wrwData[fileIndex] < numLevel[i]) {
                            color = colors[i - 1];
                        }
                    }
                    self.infoBoard.wrwColor = {
                        color: color
                    };
                } else {
                    t.processed = false;
                    t.selected = false;
                }
            });
        };

        function _initFiles(){
            for (var num = 1; num <= this.timeLen; num++) {
                this.files.push("dzm/洋水河/" + num + ".json");
            }
        };

        function _waterPlayPause(){
            var self =  this;
            self.playing = !self.playing;
            if (!self.playing) {
                if (self.timer) {
                    $interval.cancel(self.timer);
                }
            } else {
                if (self.fileIndex == self.timeLen - 1) {
                    self.fileIndex = 0;
                    self.readData(self.files[self.fileIndex]);
                }
                self.timer = $interval(function () {
                    if (self.fileIndex < self.timeLen - 1) {
                        self.fileIndex++;
                        self.readData(self.files[self.fileIndex]);
                        if (self.fileIndex == self.timeLen - 1) {
                            $interval.cancel(self.timer);
                            self.playing = false;
                        }
                    } else {
                        $interval.cancel(self.timer);
                        self.playing = false;
                    }
                }, 3000);
            }
        };

        function _waterPrev(){
            if (this.fileIndex > 0) {
                this.fileIndex--;
                this.readData(this.files[this.fileIndex]);
            }
        };

        function _waterNext(){
            if (this.fileIndex < this.timeLen - 1) {
                this.fileIndex++;
                this.readData(this.files[this.fileIndex]);
            }
        };

        function _waterToggle (timePoint) {
            this.fileIndex = timePoint - 1;
            if (this.fileIndex == -1) {
                this.readData(-1);
            } else {
                this.readData(this.files[this.fileIndex]);
            }
        };

        function _waterOnloaded(){
            var self = this;
            $timeout(function(){
                self.loading = false;
                self.timeLineShow = true;
                self.readData(-1);
                self.initEcharts();
                self.infoBoard.show = true;
            },0);
        };

        function _initEcharts(){
            this.echarts = sucHelpers.setLine();
            this.echarts.xAxis[0].data = this.times.map(function(item){
                return item.name;
            });
            this.echarts.legend.data.shift();
            this.echarts.legend.data[0]=this.config.pollutant;
            this.echarts.series[0].data = this.wrwData;
            this.echarts.series.length = 1;
            this.echarts.series[0].name = this.config.pollutant;
        };

        function _waterInit(){
            var self = this;
            var config = self.config;
            self.numLevel =  [0, 50, 100, 150, 200, 250, 300, 350, 400, 500];//浓度层级
            self.color = config.colors || ["#00FFEF", "#00FFE0", "#00FF84", "#00FF28", "#33FF00", "#8FFF00", "#EBFF00", "#FFB700", "#FF5B00", "#FF0000"];//与浓度层级对应
            self.infoBoard.mgd = [];
            self.infoBoard.show = false;
            self.loading = true;
            self.playing = false;
            self.times = mapSet.getTimes();
            self.timeLen = 22;
            self.timeLineShow = false;
            self.fileIndex = -1;
            self.initFiles();
            self.setData().then(function(){
                self.getData(config.amount);
            });

            //影响范围设置
            $scope.waterModalTool.nearCircle = {
                coords: "",
                radius:self.config.harmRange,
                createEnd: function (feature) {
                    var cg = feature.getGeometry();
                    var pos = "";
                    var len = self.addrs.length;
                    //self.from = self.addrs[0]&&self.addrs[0].name;
                    //self.to = $scope.emergencyMoni.event.flowTo || "谷撤河";
                    //敏感点
                    self.infoBoard.mgd.length = 0;
                    $scope.resourceMap.mgd.markers.forEach(function(marker){
                       var coord = olHelpers.coordinateTransform([marker.lon,marker.lat],"EPSG:4326", "EPSG:3857");
                       if(cg.intersectsCoordinate(coord)){
                           marker.visible = true;
                           self.infoBoard.mgd.push(marker.info.COMPANYNAME);
                       }else{
                            marker.visible = false;
                       }
                    });
                    var addrs = [];
                    self.addrs.forEach(function(addr){
                        if(cg.intersectsCoordinate(addr.coord)){
                            addrs.push(addr.name);
                        }
                    });
                    pos = self.fileIndex==0?addrs[0]:addrs[addrs.length-1];

                    /*if(pos){
                        $scope.waterModalTool.posOverlay.label.message = "<div style='white-space:nowrap;'>" + pos + "</div>";
                    }*/
                    $scope.waterModalTool.posOverlay.coord = olHelpers.coordinateTransform(cg.getCenter(),'EPSG:3857','EPSG:4326') ;
                    var key = $scope.waterPlayer.fileIndex
                    var param = $.parseJSON($scope.waterPlayer.msgs);
                    var city = fiterArr(param.city)
                    var province = fiterArr(param.province)
                    function fiterArr(arr) {
                        var obj = {
                            state:true,
                            val:arr[0],
                            arrIndex:[]
                        }
                        for(let i = 1;i < arr.length;i++){
                            if(obj.val != arr[i]){
                                obj.val = arr[i];
                                obj.state = false;
                                obj.arrIndex.push(i)
                            }
                        }return obj
                    }
                    function compare(n,arr,area) {
                        for (let i=0;i<arr.length;i++){
                            if(arr[i]>n){
                                return arr[i];
                            }else {
                                if(area == 'province'){
                                    province.state = true
                                }else if(area == 'city'){
                                    city.state = true
                                }
                            }
                        }
                    }
                    //时间转化
                    function timeFmt(t) {
                        var out = ''
                        if(t<60){
                            out = t+'分钟'
                        }else if(t%60==0){
                            out = t/60+'小时'
                        }else {
                            out = parseInt(t/60)+'小时'+parseInt(t%60)+'分钟'
                        }
                        return out
                    }
                    if(key >= province.arrIndex[province.arrIndex.length-1]){
                        province.state = true
                    }
                    if(key >= city.arrIndex[city.arrIndex.length-1]){
                        city.state = true
                    }
                    if(province.state == true){
                        var value = '之后不会到外省。'
                    }else {
                        var value = '还有'+timeFmt((compare(key,province.arrIndex,'province')-key)*15)+
                            '进入'+param.province[compare(key,province.arrIndex,'province')]+'，到达交界处时的浓度为'+($scope.waterPlayer.wrwData[compare(key,province.arrIndex,'province')] || '--')+'mg/L'
                    }
                    if(city.state == true){
                        var inner = '之后不会到外市，'
                    }else {
                        var inner = '还有'+timeFmt((compare(key,city.arrIndex,'city')-key)*15) +
                            '进入'+param.city[compare(key,city.arrIndex,'city')]+'，到达该市时污染物浓度'+($scope.waterPlayer.wrwData[compare(key,city.arrIndex,'city')] || '--')+'mg/L，'
                    }
                    $scope.waterModalTool.posOverlay.label.message = ' 当前位于'+param.city[key]+'，' +
                        '预计' +inner+ '预计'+value
                }
            };
            //

            //等值面设置
            $scope.waterModalTool.dzmLayer = { //等值面图层
                source: {
                    type: "GeoJSON",
                    geojson: {
                        projection: "EPSG:4326",
                        object: ""
                    },
                    style: function(f){
                    	var fvalue = parseFloat(f.get("value"));
                        var len = self.numLevel.length;
                        var fcolor = self.color[len - 1];
                        for (var i = len - 1; i >= 0; i--) {
                            if (fvalue < self.numLevel[i]) {
                                fcolor = self.color[i - 1];
                            }
                        }
                        return olHelpers.createStyle({
                            fill: {
                                color: fcolor
                            }
                        })
                    }
                },
                style: {
                    fill: {
                        color: "transparent"
                    }
                },
                zIndex: 9,
                visible: false,
                regionLoaded: function (oSource) {
                    if (!oSource) {
                        return false;
                    }
                    var features = oSource.getFeatures();
                    var max = parseFloat(features[0].get("value")),
                        maxIndex = 0;
                    features.forEach(function (f, no) {
                        var fvalue = parseFloat(f.get("value"));
                        if (fvalue >= max) {
                            maxIndex = no;
                            max = fvalue;
                        }
                    })
                    $scope.waterModalTool.nearCircle.coords = features[maxIndex].getGeometry().getInteriorPoint().getCoordinates();
                    $scope.waterModalTool.nearCircle.visible = true;

                    var coord = olHelpers.coordinateTransform($scope.waterModalTool.nearCircle.coords, "EPSG:3857", "EPSG:4326");
                    $scope.olMap.center.lon = coord[0];
                    $scope.olMap.center.lat = coord[1];
                    $scope.olMap.center.zoom = 15;
                }
            };
        };

        //销毁
        function _destroy(){
            $interval.cancel(this.timer);
        };

        $scope.$watch("waterPlayer.config.river",function(n,o){
            if(n){
                if(n.name.slice(-2,-1) == 0){
                    var match = n.name.slice(0,-2)
                }else {
                    var match = n.name
                }

                $scope.resourceMap.riverFeatures.forEach(function(item){
                    if(item.name==match){
                        var activeStyle = createActiveStyle(item.name);
                        item.feature.setStyle(activeStyle);
                        mapSet.locationByFeature("map1",item.feature);
                        var coord = olHelpers.coordinateTransform(item.feature.get('geometry').getCoordinates()[0][0][0],"EPSG:3857","EPSG:4326");
                        //$scope.waterModel.plot40l3.start = true;
                        $scope.waterModalTool.plot40l3.marker[0].lon = coord[0];
                        $scope.waterModalTool.plot40l3.marker[0].lat = coord[1];
                        $scope.waterPlayer.config.lg = coord[0];
                        $scope.waterPlayer.config.lt = coord[1]
                        $scope.modal.riverFeature = item.feature;
                    }else{
                        item.feature.setStyle(item.style);
                    }
                });
            }
        })

        function initPage(){
            $scope.waterModalTool.posOverlay = {
                coord: null,
                label: {
                    message: ""
                }
            }
            $scope.waterModalTool.dzmLayer = null;
            $scope.waterModalTool.nearCircle = null;
            $timeout(function(){
                $scope.olMap.center.lat=defaultCenter[1];
                $scope.olMap.center.lon=defaultCenter[0];
                $scope.olMap.center.zoom = defaultZoom;
            },600);
        };

        function startSimulate(){
            $scope.waterModalTool.posOverlay.label.message = ''
            $scope.waterPlayer.config.levels = $scope.modal.levels[0].value;
            var config = $scope.waterPlayer.config;
            if(!config.amount){
                alert("请先设置泄漏量!");
                return;
            }
            if(!config.levels || !config.levels.length){
                alert("请先设置浓度差!");
                return;
            }
            if(!config.river){
                alert("请选择河流!");
                return;
            }
            if((config.lg || config.lt) && (config.lg>180 || config.lt>90 || config.lg<-180 || config.lg<0)){
                alert("请输入正确的经纬度信息!");
                return;
            }
            if((config.lg || config.lt) && !$scope.modal.coordInFeature([config.lg,config.lt],"",0.0001)){
                alert("起始点经纬度必须设置在河流内!");
                return;
            }
            $scope.waterPlayer.destroy();
            $scope.waterPlayer.init();
        };


        $scope.modal.init();
        /*$scope.$on("openlayers.map.singleclick", function (e, d) {
            var coord = olHelpers.coordinateTransform(d.coord, "EPSG:3857", "EPSG:4326");
            console.log(coord);

        })*/
        $rootScope.$on('waterLocate',function f(e,d) {
            var coord = d;
            $scope.waterModalTool.plot40l3.marker[0].lon = coord[0];
            $scope.waterModalTool.plot40l3.marker[0].lat = coord[1];
            $scope.waterPlayer.config.lg = coord[0];
            $scope.waterPlayer.config.lt = coord[1]
        })
    });
});
