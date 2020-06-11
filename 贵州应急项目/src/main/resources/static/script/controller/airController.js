define(['app'], function (app) {
    app.controller("airCtrl", function ($scope, $http, mapSet, olHelpers, olData, $interval, sucHelpers, $timeout,$stateParams) {
        var timer = ""; //定时器
        var timeLen = 22;
        //重新定位
        $scope.changePlot = function () {
            $scope.airModel.plot40l3.start = true;
            $scope.olMap.center.lat=26.6072
            $scope.olMap.center.lon=107.5130
            if (!$scope.airModel.plot40l3.type) {
                $scope.airModel.plot40l3.clear = true;
                $scope.airModel.plot40l3.type = "";
            }
        }
    	function init(){
            $scope.eventsCoords=[[106.86, 27.13176], [106.86, 27.13244], [106.86, 27.13308], [106.86, 27.13372], [106.86, 27.13436], [106.86, 27.135], [106.86, 27.1356], [106.86, 27.13624], [106.86, 27.13684], [106.86, 27.13744], [106.86, 27.13804], [106.86, 27.13864], [106.86, 27.13924], [106.86, 27.13984], [106.86, 27.14044], [106.86, 27.141000000000002], [106.86, 27.1416], [106.86, 27.1422], [106.86, 27.14276], [106.86, 27.14336], [106.86, 27.14392], [106.86, 27.13104]];
            initMapview($scope.fileIndex);
            $scope.olMap.center.zoom = 14;
            $scope.airModel.tab = 1;
            $scope.airModel.calculating = false;
        	$scope.airModel.modelShow = false;
            $scope.param = {
            		direction: "东南风",
            		speed: 3,
            		stability: "B",
            		range: 26800,
            		strength: 5000,
            		height: 50
            }
            $scope.airModel.plot40l3 = {
                    start: false,
                    type: "",
                    edit: true,
                    clear: false,
                    point: [{
                        plotType: {
                            type: "MARKER",
                        },
                        coords: [olHelpers.coordinateTransform([107.517, 26.5833], "EPSG:4326", "EPSG:3857")],
                        style: {
                            image: {
                                circle: {
                                    radius: 6,
                                    /*fill: new ol.style.Fill({
                                        color: '#D32F2F'
                                    }),*/
                                    /*stroke: new ol.style.Stroke({
                                        color: 'rgba(32, 88, 165, 0)',
                                    })*/
                                }
                            }
                        }
	                    }],
                drawEnd: function (feature) {
                    $scope.olMap.center.zoom =14;
                }
            }
            $scope.times = mapSet.getTimes();
            $scope.infoShow = false;
            $scope.playStatus = false;
            $scope.fileIndex = -1; //文件读取指针
            $scope.changePlot();
            $scope.infoBoard = {
            		time: "00:00.00"
            }
            $scope.olMap.windData=18
    	}
    	init();

        $scope.changeTab = function (no) {
        	if(no==2){
        		alert("功能有待开发");
        		return;
        	}
            $scope.airModel.tab = no;

            if ($scope.playStatus) {
                $scope.playStatus = !$scope.playStatus;
                if (timer) {
                    $interval.cancel(timer);
                }
            }
        }

        //初始化地图视窗
        function initMapview(timePoint){
            var index = timePoint>0?timePoint:0;
            var coord = $scope.eventsCoords[index];
            $scope.olMap.center.lon = coord[0];
            $scope.olMap.center.lat = coord[1];
            $scope.olMap.center.zoom = 16;
        };

        //时段
        function readData(url) {
            if (url == -1) {
            	$scope.times.forEach(function (t, no) {
                    t.processed = false;
                    t.selected = false;
                });
                $scope.times[0].processed = true;
                $scope.times[0].selected = true;
                $scope.infoBoard.time = "00:00.00";
            }else{
            	$scope.times.forEach(function (t, no) {
                    if (no < $scope.fileIndex + 1) {
                        t.processed = true;
                        t.selected = false;
                    } else if (no == $scope.fileIndex + 1) {
                        t.processed = true;
                        t.selected = true;
                        $scope.infoBoard.time = sucHelpers.getDiffMs(t.val*60*1000);
                    } else {
                        t.processed = false;
                        t.selected = false;
                    }
                })
            }
        }

        $scope.startSimulate = function () {
            $scope.airModel.calculating = true;
            if (timer) {
                $interval.cancel(timer);
            }
            $scope.times.forEach(function (t, no) {
                t.processed = false;
                t.selected = false;
            })
            $scope.playStatus = false;
            $scope.infoShow = false;
            $scope.fileIndex = -1;

            $timeout(function () {
                $scope.airModel.calculating = false;
            	$scope.airModel.modelShow = true;
                $scope.infoShow = true;
                readData(-1);
                $scope.fileIndex = -1;
            }, 3000);
        }

        $scope.prev = function () {
            if ($scope.fileIndex > 0) {
                $scope.fileIndex--;
                readData(1);
            }
            initMapview($scope.fileIndex);
            $scope.$emit("timestamp",$scope.fileIndex);
        }
        $scope.next = function () {
            if ($scope.fileIndex < timeLen - 1) {
                $scope.fileIndex++;
                readData(1);
            }
            initMapview($scope.fileIndex);
            $scope.$emit("timestamp",$scope.fileIndex);
        }
        $scope.toggleTime = function (t, no) {
            $scope.fileIndex = no - 1;
            initMapview($scope.fileIndex);
            $scope.$emit("timestamp",no-1);
            if ($scope.fileIndex == -1) {
                readData(-1);
            } else {
                readData(1);
            }
        }
        var timeval=0;
        $scope.play = function () {
            $scope.playStatus = !$scope.playStatus;
            if (!$scope.playStatus||$scope.route!='riskPrevention.riskSpatial.air') {
                if (timer) {
                    $interval.cancel(timer);
                }
            } else {
                if ($scope.fileIndex == timeLen - 1) {
                    $scope.fileIndex = 0;
                    readData(1);
                }
                timer = $interval(function () {
                    if ($scope.fileIndex < timeLen - 1) {
                        $scope.fileIndex++;
                        readData(1);
                        if ($scope.fileIndex == timeLen - 1) {
                            $interval.cancel(timer);
                            $scope.playStatus = false;
                        }
                        initMapview($scope.fileIndex);
                        $scope.$emit("timestamp",$scope.fileIndex);
                    } else {
                        $interval.cancel(timer);
                        $scope.playStatus = false;
                    }

                }, 2000);
            }
        }
    });
    app.controller("airCtrl",function($rootScope,$scope, $http,$q,$stateParams, mapSet,dataSet, olHelpers, olData, $interval, sucHelpers, $timeout,$filter,gisCaculate,gisCache,$uibModal){
        $scope.modal = {
            tab:1,
            default:{
                coord:[106.86,27.131]
            },
            init:_pageInit
        }

        $scope.moniPlayer = {
            timer:"", //定时器
            checkTimer:"", //轮询定时器
            timeLen:0,
            fileIndex:-1,
            times:[],
            timeLineShow:false,
            points:[],  //每一个时刻点模型中心点坐标
            playing:false,
            loading:false,
            loaded:false,
            tl:false,
            infoBoard:{
                time:"00:00.00",
                show:false
            },
            config:{
                halfdeadRange:500, //预估半致死浓度范围
                harmRange:1000, //预估伤害浓度范围
                q:1, //单位时间污染物泄漏量(kg/s)
                u:1,//风速(m/s)
                tl:660,//泄漏时长
                angle:30,//与正东方向夹角(度)
                lg:$scope.modal.default.coord[0], //泄漏源经度
                lt:$scope.modal.default.coord[1],//泄漏源纬度
                pollutant:"" , //污染物名称
                height:0,//泄露离地高度
                kssc:9000,//扩散时长
                airStability:'D',//大气稳定度
                roughness:0 ,//地面粗糙度
                safevalue:1
            },
            echartsOption:{
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
                        name:"分钟",
                        type: 'category',
                        boundaryGap: true,
                        data: ['0', '15', '120', '150', '180', '240', '270', '300'],
                        axisLabel: {
                            color: "#dbdbdb"
                        }
                    }
                ],
                yAxis: [
                    {
                        name: "mg/m³",
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
            },
            timeLineActive:_timeLineActive,
            playPause:_moniPlayPause,
            prev:_moniPrev,
            next:_moniNext,
            toggle:_moniToggle,
            initMapview:_initMapview,
            initZone:_initZone,
            onload:_moniLoadedHandler,
            createMonit:_createMonit,
            checkMoniResult:_checkMoniResult,
            destroy:_destroy,
            init:_moniInit,
            loadPeak:_loadPeak
        };
        //打开介绍弹框
        $scope.openDes = function(type){
            var that = this;
            var modal = $uibModal.open({
                templateUrl:"partials/pop/gsIntro.html",
                controller:"intro",
                size:"md",
                resolve:{
                    body:function(){
                        return {
                            type:type
                        }
                    }
                }
            });
            var resolve = function(){

            }
            modal.result.then(resolve);
        }
        $scope.aiModalTool.plot40l3 = {
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
                coords:[olHelpers.coordinateTransform($scope.modal.default.coord, "EPSG:4326", "EPSG:3857")],
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
                console.log(coord)
                $scope.moniPlayer.config.lg = parseFloat(coord[0].toFixed(5));
                $scope.moniPlayer.config.lt = parseFloat(coord[1].toFixed(5));
                $scope.$apply();
            }
        }

        function _timeLineActive(type){
            var self = this;
            if (type == -1) {
            	self.times.forEach(function (t, no) {
                    t.processed = false;
                    t.selected = false;
                });
                self.times[0].processed = true;
                self.times[0].selected = true;
                self.infoBoard.time = "00:00.00";
            }else{
            	self.times.forEach(function (t, no) {
                    if (no < self.fileIndex + 1) {
                        t.processed = true;
                        t.selected = false;
                    } else if (no == self.fileIndex + 1) {
                        t.processed = true;
                        t.selected = true;
                        self.infoBoard.time = sucHelpers.getDiffMs(t.val*60*1000);
                    } else {
                        t.processed = false;
                        t.selected = false;
                    }
                })
            }
        };

        function _moniPlayPause(){
            if(!this.loaded)return;
            var self = this;
            self.playing = !self.playing;
            if(!self.playing) {
                if (self.timer) {
                    $interval.cancel(self.timer);
                }
            }else{
                if (self.fileIndex == self.timeLen - 1) {
                    self.fileIndex = 0;
                    self.timeLineActive(1);
                }
                self.timer = $interval(function () {
                    var zoom = self.fileIndex < 5 ? 16 : (self.fileIndex<10?15:14);
                    if (self.fileIndex < self.timeLen - 1) {
                        self.fileIndex++;
                        self.timeLineActive(1);
                        if (self.fileIndex == self.timeLen - 1) {
                            $interval.cancel(self.timer);
                            self.playing = false;
                        }
                        self.initMapview(self.fileIndex,zoom);
                        $scope.$emit("timestamp",self.fileIndex);
                    } else {
                        $interval.cancel(self.timer);
                        self.playing = false;
                    }
                }, 2000);
            }
        };

        function _moniPrev(){
            if(!this.loaded)return;
            if (this.fileIndex > 0) {
                this.fileIndex--;
                this.timeLineActive(1);
            }
            var zoom = this.fileIndex < 5 ? 16 : (this.fileIndex<10?15:14);
            this.initMapview(this.fileIndex,zoom);
            $scope.$emit("timestamp",this.fileIndex);
        };

        function _moniNext(){
            if(!this.loaded)return;
            if (this.fileIndex < this.timeLen - 1) {
                this.fileIndex++;
                this.timeLineActive(1);
            }
            var zoom = this.fileIndex < 5 ? 16 : (this.fileIndex<10?15:14);
            this.initMapview(this.fileIndex,zoom);
            $scope.$emit("timestamp",this.fileIndex);
        };

        function _moniToggle(timePoint){
            if(!this.loaded)return;
            var fileIndex = this.fileIndex = timePoint - 1;
            var zoom = fileIndex < 5 ? 16 : (fileIndex<10?15:14);
            this.initMapview(fileIndex,zoom);
            $scope.$emit("timestamp",fileIndex);
            if (fileIndex == -1) {
                this.timeLineActive(-1);
            } else {
                this.timeLineActive(1);
            }
        };

        function _moniLoadedHandler(data){
            this.loading = false;
            this.timeLineShow = true;
            this.loaded = data.isSuccess;
            this.infoBoard.show = true;
            this.points = data.centers;
        };

        function _initMapview(timePoint,zoom){
            var coord = timePoint==-1?this.eventCoord:this.points[timePoint];
            $scope.olMap.center.lon = coord[0];
            $scope.olMap.center.lat = coord[1];
            $scope.olMap.center.zoom = zoom || 16;
        };

        function _createMonit(){
            var self = this;
            var config = angular.copy(self.config);
            config.q = self.config.q*1000000;
            delete config.coord;
            var params = JSON.stringify(config);
            var url = 'AtmosphericEvent/addSimulation?jsonParam='+params;
            $http.post(encodeURI(url)).then(function(data){
                gisCache.airTool.simulationId = data.data.simulationId;
                self.checkMoniResult(gisCache.airTool.simulationId);
            });
        };

        function _checkMoniResult(simulationId){
            var self = this;
            var post = function(){
                var url = 'AtmosphericEvent/checkSimulation?simulationId='+simulationId;
                $http.get(url).then(function(data){
                    if(data.data){
                        $scope.olMap.windData=simulationId;
                        $interval.cancel(self.checkTimer);
                    }
                });
            }
            self.checkTimer = $interval(post,2000);
        };

        function _loadPeak(data) {
            var arr = [],time=[]
            if(data){
                data.forEach(function (item) {
                    arr.push(item.the_peak)
                    time.push((item.time/60).toFixed(1))
                })
                this.echartsOption.series[0].data = arr
                this.echartsOption.series[0].name = this.config.pollutant
                this.echartsOption.xAxis[0].data = time
                this.tl = true
            }
        }
        //初始化浓度范围
        function _initZone(){
            var f = this.eventCoord;
            var r1 = this.halfdeadRange
            var r0 = this.harmRange;
            var m = gisCaculate.destinationVincenty(f,180,r0);
            var l = gisCaculate.destinationVincenty(f,0,r1);
            $scope.aiModalTool.safeZone.radius = r1;
            $scope.aiModalTool.dangerZone.radius = r0;
            $scope.aiModalTool.safeZone.coords = f;
            $scope.aiModalTool.dangerZone.coords = f;
            $scope.aiModalTool.safeLine.coords=[f,l];
            $scope.aiModalTool.dangerLine.coords=[f,m];
            $scope.aiModalTool.safeLine.center=[(f[0]+l[0])/2,(l[1]+f[1])/2];
            $scope.aiModalTool.dangerLine.center=[(m[0]+f[0])/2,(m[1]+f[1])/2];
            $scope.aiModalTool.safeLine.label={
                classNm: 'moniOverlay',
                message: "<div style='white-space: nowrap;'>预估半致死浓度范围(" + r1.toFixed(2) + "米)</div>",
                stopEvent: false
            }
            $scope.aiModalTool.dangerLine.label={
                classNm: 'moniOverlay',
                message: "<div style='white-space: nowrap;'>预估伤害浓度范围(" + r0.toFixed(2) + "米)</div>",
                stopEvent: false
            };
        };

        function _moniInit(){
            var config = $scope.moniPlayer.config;
            //config.q = $scope.moniPlayer.config.q*1000000
            if(config.lg>180 || config.lt>90 || config.lg<-180 || config.lg<0){
                alert("请输入正确的经纬度信息!");
                return;
            }
            this.eventCoord = [config.lg,config.lt]; //事故地点
            this.halfdeadRange = config.halfdeadRange?parseFloat(config.halfdeadRange):1246.78; //预估半致死浓度范围
            this.harmRange = config.harmRange?parseFloat(config.harmRange):512.07; //预估伤害浓度范围
            this.loading = true;
            //this.times = mapSet.getTimes();
            this.times = []
            for (var i=0;i<24;i++){
                //$filter('date')(new Date(), 'yyyy-MM-dd')
                var dev = config.kssc/12
                this.times.push({
                    name:(dev*i/120).toFixed(1)+'min'
                })
            }
            this.timeLen = 22;
            this.points.length = 0;
            if (this.timer) {
                $interval.cancel(this.timer);
            }
            this.times.forEach(function (t, no) {
                t.processed = false;
                t.selected = false;
            })
            this.playing = false;
            this.infoBoard.show = false;
            this.fileIndex = -1;
            this.timeLineActive(-1);
            this.initMapview(-1);
            this.initZone();
            this.createMonit();
            //$scope.olMap.windData=$scope.emergencyMoni.event.simulationId;
        };

        //销毁
        function _destroy(){
            $interval.cancel(this.timer);
            $interval.cancel(this.checkTimer);
        };

        //页面初始化
        function _pageInit(){
            if(gisCache.airTool.simulationId){
                $scope.moniPlayer.config = gisCache.airTool.config;
                $timeout($scope.startSimulate,500);
                return;
            };
            $scope.moniPlayer.eventCoord = this.default.coord;
            $scope.moniPlayer.initMapview(-1,10);
        };

        //监听气模型数据是否加载成功
        $rootScope.$on("olFcolorComplete",function(e,data){
            if(!data.isSuccess){
                console.log("模型数据加载失败!");
            }
            $scope.moniPlayer.onload(data);
        });

        $rootScope.$on("peakData",function(e,data){
            $scope.moniPlayer.loadPeak(data);
        });

        $scope.startSimulate = function(){
            if($scope.moniPlayer.config.kssc<=0&&$scope.moniPlayer.config.kssc<$scope.moniPlayer.config.tl){
                alert('扩散时长不能小于泄露时长！')
            }else {
                $scope.moniPlayer.destroy();
                $scope.moniPlayer.init();
                gisCache.airTool.config = $scope.moniPlayer.config;
                $scope.$emit('timeDevice',Math.floor($scope.moniPlayer.config.kssc/24))
            }

        };

        $scope.$on("$destroy",function(){
            $scope.moniPlayer.destroy();
        });

        $scope.modal.init();
    });
    app.controller('intro',function ($scope,$uibModalInstance,body) {
        $scope.tb1 = [
            {
                fs:'<2',
                l:'A',
                m:'A~B',
                s:'B',
                lowCloud:'E',
                highCloud:'F'
            },
            {
                fs:'2~3',
                l:'A~B',
                m:'B',
                s:'C',
                lowCloud:'E',
                highCloud:'F'
            },
            {
                fs:'3~4',
                l:'B',
                m:'B~C',
                s:'C',
                lowCloud:'D',
                highCloud:'E'
            },
            {
                fs:'4~6',
                l:'C',
                m:'C~D',
                s:'D',
                lowCloud:'D',
                highCloud:'D'
            },
            {
                fs:'6',
                l:'C',
                m:'D',
                s:'D',
                lowCloud:'D',
                highCloud:'D'
            },
        ]
        $scope.tb2 = [
            {
                type:'草原、平坦开阔地',
                value:'0.1'
            },
            {
                type:'农作物地区',
                value:'0.1~0.3'
            },
            {
                type:'村落、分散的树林',
                value:'0.1~3'
            },
            {
                type:'分散的高矮建筑物（如：城市）',
                value:'1~4'
            },
            {
                type:'密集的高矮建筑物（如：大都市）',
                value:'4'
            },
        ]
        $scope.fileType = body.type
        $scope.close = function () {
            $uibModalInstance.close()
        }
    })

});
