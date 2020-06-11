define(['app', 'script/controller/storeBtns','mapSet', 'angularCgsUtil', 'fileUpload', 'sucHelpers', 'printw'], function (app) {
    app.controller("homeCtrl", function ($rootScope, $scope, $http, mapSet, chartSet) {

        $scope.risk.sourceInfo.overview = false;
        $scope.risk.sourceInfo.emergency = false;
        $scope.$on("$destroy", function () {
            $scope.risk.sourceInfo.emergency = false;
            $scope.risk.sourceInfo.overview = false;
            $scope.materialDetail.reserveShow = false;
            $scope.materialDetail.anaShow = false;
            $scope.materialDetail.videoShow = false;
        });
        $rootScope.$on('sendScrub', function (e, data) {
            $scope.scrubEffect = data;
        });
        $rootScope.$on('closeStroages', function (e, data) {
            $scope.scrubEffect = data;
        });
        //物资警戒榜
        $scope.showWarn = function () {
            $scope.material.materialChart.warn.bar.yAxis.data = [];
            $scope.material.materialChart.warn.bar.series[0].data = [];
            $scope.material.materialChart.warn.bar.series[1].data = [];
            $http.get("goods/listAlarmGoods").then(function (res) {
                var data = res.data;
                data.forEach(function (item) {
                    $scope.material.materialChart.warn.bar.yAxis.data.push(item.NAME);
                    var warn1 = {
                        value: item.limitnumber,
                        label: {
                            normal: {
                                show: true,
                                formatter: '{c}' + item.UNIT,
                                position: "right"
                            }
                        }
                    }
                    var warn2 = {
                        value: item.number,
                        label: {
                            normal: {
                                show: true,
                                formatter: '{c}' + item.UNIT,
                                position: "right"
                            }
                        }
                    }
                    $scope.material.materialChart.warn.bar.series[0].data.push(warn1);
                    $scope.material.materialChart.warn.bar.series[1].data.push(warn2);
                });
            });
        };
        //风险排查统计
        var getA = function () {
            $scope.aaa = chartSet.aaa();
            $http.get("emergencyTask/countTask").then(function (data) {
                $scope.aaa.legend.data = ['重大隐患数|'+data.data[0].significant,
                    '一般隐患数|'+data.data[0].general,'应急管理隐患数|'+data.data[0].emergency];
                $scope.aaa.legend.data.forEach(function (data,index) {
                    var arr=data.split('|');
                    //console.log(arr[0])
                    //console.log(arr[1])
                    $scope.aaa.series[0].data.push({
                        name:arr[0]+'|'+arr[1],
                        value:arr[1]
                    })
                })

            }).catch(function (data) {
                console.log(data);
            });
        };
        //应急预案备案统计
        var getB = function () {
            $scope.bbb = chartSet.bbb();
            $http.get("preplan/countPreplan").then(function (data) {
            var allData = data.data[0],                     seriesList = [];
                seriesList = [allData.csum, allData.recorded, allData.notOnRecord, allData.expired, allData.aboutToExpire];
                $scope.bbb.series[0].data = seriesList;
            });
        }
        //风险源统计
        var getC = function () {
            $scope.ccc = chartSet.ccc();
            $http.get("riskSource/riskgradeRanking").then(function (data) {
                //console.log(data);
                var legendList = [],
                    seriesList = [];
                data.data.forEach(function (item) {
                    legendList.push(item.RISKGRADE + "风险源|" + item.NUM);
                    seriesList.push({
                        name: item.RISKGRADE + "风险源|" + item.NUM,
                        value: item.NUM
                    });
                })
                $scope.ccc.legend.data = legendList.reverse();
                $scope.ccc.series[0].data = seriesList;
            }).catch(function (data) {
                console.log(data);
            });
        };

        $scope.time = new Date();

        function init() {
            $scope.olMap.center = {
                lat: 26.64227,
                lon: 106.667045,
                zoom: 8
            }
            $scope.home = {
                navShow: false
            };
            var getCountData=function(){
                $http.get('basicData/countEmergencyResource').then(function (req) {
                    $scope.yjzyCount=req.data[0]
                    //console.log($scope.yjzyCount)
                })
                $http.get('basicData/countSimulation').then(function (req) {
                    $scope.yjmnCount=req.data
                })
            }
            getCountData()
            $scope.messageType = 'overViews';
            //$scope.riskmanage.sourceInfo.company = "";
            //地图物资库点位
            mapSet.getStore().then(function (data) {
                $scope.material.stores = data;
            });
            //查询风险源点位
            mapSet.getRisk().then(function (data) {
                $scope.risk.markers = data;
            });
            getA();
            getB();
            //getC();
            $scope.dataType ={
                page:1,
                rotate:null,
            }
        }
        init();


    });

    app.controller('dataCtrl',function ($rootScope, $scope, $http, mapSet, chartSet,$timeout) {
        $scope.risklevel = ''
        /*市州风险源总数量统计*/
        var getC = function () {
            $scope.ccc = chartSet.ccc();
            $scope.account = 0;
            $http.get("riskSource/riskgradeRanking").then(function (data) {
                //console.log(data);
                var legendList = [],
                    seriesList = [];
                data.data.forEach(function (item) {
                    $scope.account+=item.NUM
                    legendList.push(item.RISKGRADE + "风险源|" + item.NUM);
                    seriesList.push({
                        name: item.RISKGRADE + "风险源|" + item.NUM,
                        value: item.NUM
                    });
                })
                $scope.ccc.legend.data = legendList.reverse();
                $scope.ccc.series[0].data = seriesList;
            }).catch(function (data) {
                console.log(data);
            });
        };
        getC();
        $scope.dataType.page=$scope.route.slice($scope.route.length-1)
        if($scope.dataType.page ==3){
            $rootScope.system = 'new';
        }else {
            $rootScope.system = '';
        }
        $scope.data1Title ='各市州风险源数量柱状图'
        $scope.fxyCount = chartSet.fxyCount();
        //var features = oSource.getFeatures();
        $scope.getAllFxy = function (level){
            $scope.risklevel = level
            var url='';
            if(!level||level==''||level==null||level == undefined){
                level='';
                $scope.data1Title ='各市州风险源数量柱状图'
                url='riskSource/countEnterpriseByXzqy';
            }else{
                $('.riskLevelTg li').removeClass('active')
                if(level == '重大'){
                    $('.riskLevelTg li:eq(0)').addClass('active');
                    $scope.data1Title ='各市州重大风险源数量柱状图'
                }else if(level == '较大'){
                    $('.riskLevelTg li:eq(1)').addClass('active')
                    $scope.data1Title ='各市州较大风险源数量柱状图'
                }else{
                    $('.riskLevelTg li:eq(2)').addClass('active')
                    $scope.data1Title ='各市州一般风险源数量柱状图'
                }
                url="riskSource/countEnterpriseByXzqy?"+'&riskGrade='+encodeURIComponent(level);
            }
            $http.get(url).then(function (res) {
                //$rootScope.fxqy=res.data;
                var data = res.data;
                var arr=[],arry=[];
                $scope.risk.topDistricts=[];
                $scope.risk.HeatMark=[];
                $scope.risk.gzLayer.show = true;
                $scope.risk.gzLayer.style.fill = {
                    color:'rgba(81,201,54,0.2)'
                }
                /*$scope.risk.gzLayer.loadEnd = function (oSource) {
                    if (!oSource) {
                        return;
                    }
                    var features = oSource.getFeatures();
                    var riskColorLevel = ["rgba(0,0,0,0)", "#68cb00", "#f6e200", "#df2d00"];
                    var riskNumLevel = [1, 20, 60];
                    features.forEach(function (f) {
                        var name = f.get("name");
                        data.forEach(function (item, index) {
                            if (name == item.NAME) {
                                var num = item.number;
                                var color = 'rgba(0,0,0,0)';
                                riskNumLevel.forEach(function (n, index) {
                                    if (num >= n) {
                                        color = riskColorLevel[index + 1];
                                    }
                                })
                                f.setStyle(olHelpers.createStyle({
                                    fill: {
                                        color: color
                                    },
                                    stroke: {
                                        width: 2,
                                        color: "FFA500"
                                    }
                                }))
                            }
                        });
                    })
                }*/
                $scope.fxyCount.yAxis.data=[]
                $scope.fxyCount.series[0].data = []
                data.forEach(function (item, index) {
                    $scope.fxyCount.yAxis.data.push(item.NAME);
                    $scope.fxyCount.series[0].data.push(item.number) ;
                    item.number = item.number == null?0:item.number;
                    $scope.risk.topDistricts.push({
                        lat: item.LATITUDE,
                        lon: item.LONGITUDE,
                        info:item,
                        projection: "EPSG:4326",
                        clickLabel: {
                            id: item.ID,
                            title: item.NAME+'风险源企业列表',
                            url: 'partials/pop/enterList.html',
                            classNm: "featureClick",
                            placement: "left",
                        },
                        style: {
                            zIndex: 99,
                            image: {
                                icon: {
                                    anchor: [0.5, 1],
                                    color: "#FF5722",
                                    src: 'images/square1.png'
                                }
                            },
                            text:{
                                text:item.number+' '+item.NAME,
                                font:"16px 微软雅黑",
                                //offsetX: 0,
                                offsetY: -24,
                                fill:{
                                    color:"#fc0"
                                },
                                stroke:{
                                    color:"#000",
                                    width:3
                                }
                            },
                        }
                    })
                })
                //$scope.fxyCount.yAxis.data = arr;
                //$scope.fxyCount.series[0].data = arry;
            });
            $http.get("riskSource/listRiskSouce?"+'&riskGrade='+encodeURIComponent(level)).then(function (data) {
                var points = [];
                data.data.forEach(function (item,index) {
                    if(item.LATITUDE&&item.LONGITUDE&&item.LATITUDE<=90&&item.LONGITUDE<=180){
                        points.push({
                            lat: parseFloat(item.LATITUDE),
                            lon: parseFloat(item.LONGITUDE)
                        });
                        $scope.risk.HeatMark.push({
                            lat: item.LATITUDE,
                            lon: item.LONGITUDE,
                            projection: "EPSG:4326",
                            style: {
                                image: {
                                    icon: {
                                        color:'#f19149',
                                        src: 'images/riskPoint.png'
                                    }
                                }
                            }
                        })
                    }

                });
                points.sort(function (a,b) {
                    return a.lon-b.lon;
                })

                $scope.olMap.points = angular.copy(points);
                //console.log($scope.olMap.points)
                // $scope.mapDemo.heatLayer.visible = true;
            });

        }
        if($scope.dataType.page==2){
            $scope.getAllFxy('重大')
        }else if($scope.dataType.page==1){
            $scope.getAllFxy();
        }
        //
        $scope.showMarker.risk = function (item) {
            //alert(item.info.ID);
            $scope.risk.cityMark = [];
            if($scope.risklevel == undefined){
                $scope.risklevel = ''
            }
            $http.get('riskSource/listRiskSouce?'+"xzqyId="+item.info.ID+'&riskGrade='+$scope.risklevel).then(function (res) {
                res.data.forEach(function (m) {
                    var img;
                    switch(m.RISKGRADE){
                        case "较大":
                            img = "images/large.png";
                            break;
                        case "重大":
                            img = "images/major.png";
                            break;
                        case "一般":
                            img = "images/common.png";
                            break;
                    }
                    $scope.risk.cityMark.push({
                        id: m.COMPANYID,
                        lat: m.LATITUDE,
                        lon: m.LONGITUDE,
                        projection: "EPSG:4326",
                        info: m,
                        overLabel: { //悬浮显示的信息
                            id: m.COMPANYID,
                            message: '<div style="white-space:nowrap;min-width:100px">'+m.COMPANYNAME+'</div>',
                            classNm: "featureOver",
                            placement: "right"
                        },
                        clickLabel: {
                            id: m.COMPANYID,
                            title: m.COMPANYNAME,
                            url: 'partials/pop/risk.html',
                            classNm: "featureClick",
                            placement: "right"
                        },
                        style: {
                            image: {
                                icon: {
                                    anchor: [0.5, 0.5],
                                    opacity: 1,
                                    src: img
                                }
                            }
                        }
                    })
                })
                $timeout(function (){
                    $rootScope.$emit('risk.cityMark',$scope.risklevel)
                },0)
            })
        }

        $rootScope.$on('showNearMark',function(e,s){
            $scope.showMarker.risk(s)
        })
    })
    app.controller('dealCtrl',function ($rootScope, $scope, $http) {
        $rootScope.system = 'new'
        $scope.$on('$destroy',function () {
            $rootScope.system = ''
        })
        $scope.danger={
            type:'',
            goods:'',
            check:[],
            name:'',
            intro:'',
            spec:'',
            desc:'',
            envir:'',
            prote:'',
            search:[]
        }
        function getDangeType() {
            $scope.danger.goods=[];
            $http.get('weixian/listweixianType?'+'&pageSize='+10000).then(function (res) {
                 $scope.danger.type= res.data.dataList;
                $scope.danger.type.forEach(function (item) {
                    $scope.danger.check.push(false)
                    $http.get('weixian/listweixian?'+'&HXPLX='+encodeURIComponent(item.HXPLX)+'&pageSize='+10000).then(function (res) {
                        $scope.danger.goods.push(res.data.dataList)
                    })
                })

            })
        }
        getDangeType();
        $scope.showGoods = function (i) {
            $('.dangeGoodsMenu').hide()
            $('.spanfr i').removeClass('icon-zhankai4-copy')
            $('.fff').removeClass('fff')
            var eveTarget = $('.dangerGoods>li:eq('+i+')')
            console.log(eveTarget)
            if($scope.danger.check[i]==false){
                $(eveTarget).find('i').addClass('icon-zhankai4-copy fff')
                $(eveTarget).find('.dangeGoodsMenu').show()
                $(eveTarget).find('i').parent().prev().addClass('fff')
            }else {
                $(eveTarget).find('i').removeClass('icon-zhankai4-copy fff')
                $(eveTarget).find('.dangeGoodsMenu').hide()
                $(eveTarget).find('i').parent().prev().removeClass('fff')
            }
            $scope.danger.check[i]=!$scope.danger.check[i]
        }
        $scope.dangeGoodsSearch = function(){
            if($scope.dangerZWMC){
                $scope.danger.search=[];
                $http.get('weixian/listweixian?'+'&ZWMC='+encodeURIComponent($scope.dangerZWMC)+'&pageSize='+10000).then(function (res) {
                    $scope.danger.search=res.data.dataList;
                    $scope.danger.search.length == 0?$scope.searchRes=true:$scope.searchRes=false
                })
            }else {
                alert('请输入危险品名！')
            }

        }
        $scope.showMsg = function (item) {
            $scope.danger.name = '——'+item.ZWMC
            $scope.danger.intro = item.ZYYT.replace(/\n/g,'<br>')
            $scope.danger.spec = item.WGYXZ.replace(/\n/g,'<br>')
            $scope.danger.desc = item.DHJDYX.replace(/\n/g,'<br>')
            $scope.danger.envir = item.HJBZ.replace(/\n/g,'<br>')
            $scope.danger.prote = item.YJCLCZFF.replace(/\n/g,'<br>')
        }
    })
    app.controller('emerStatusCtrl',function ($rootScope, $scope, $http, mapSet, chartSet,olHelpers) {
        $rootScope.system = '';
        mapSet.getStore().then(function (data) {
            $scope.material.stores = data;
        });
        $scope.showMarker.material = function (item) {
            /*$http.get('goods/listWarehouse?'+'&xzqyId='+item.info.id).then(function (req) {
                $scope.material.stores = req;
            })*/
            //alert('开发中...')
        };
        /*$scope.risk.gzLayer.style.fill={
            color:'rgba(0,0,0,0)'
        }*/
        $scope.data1Title = '各市州应急物资库数量柱状图'
        $http.get('basicData/listXzqyCountWarehouse').then(function (res) {
            var data = res.data;
            $scope.risk.topDistricts=[];
            $scope.fxyCount = chartSet.wzCount();
            data.forEach(function (item, index) {
                $scope.fxyCount.yAxis.data.push(item.name);
                $scope.fxyCount.series[0].data.push(item.sum) ;
                $scope.risk.topDistricts.push({
                    lat: item.latitude,
                    lon: item.longitude,
                    info:item,
                    projection: "EPSG:4326",
                    style: {
                        zIndex: index + 1,
                        image: {
                            icon: {
                                anchor: [0.5, 1],
                                color: "#FF5722",
                                src: 'images/square1.png'
                            }
                        },
                        text:{
                            text:item.sum+' '+item.name,
                            font:"16px 微软雅黑",
                            //offsetX: 0,
                            offsetY: -24,
                            fill:{
                                color:"#fc0"
                            },
                            stroke:{
                                color:"#000",
                                width:3
                            }
                        },
                    }
                })
            })
        })

        $scope.searchSub = function (item) {
            $scope.riskSub.mark.length=0;
            if(item){
                $http.get('riskSource/findSubstance?'+'&keyword='+encodeURIComponent(item)).then(function (res) {
                    $scope.searchSubResult = res.data;
                    $scope.riskDetail.companyId = $scope.searchSubResult
                    $scope.searchSubResult.forEach(function (item) {
                        var img;
                        switch(item.RISKGRADE){
                            case "较大":
                                img = "images/large.png";
                                break;
                            case "重大":
                                img = "images/major.png";
                                break;
                            case "一般":
                                img = "images/common.png";
                                break;
                        }
                        $scope.riskSub.mark.push({
                            id: item.COMPANYID,
                            lat: item.LATITUDE,
                            lon: item.LONGITUDE,
                            projection: "EPSG:4326",
                            info: item,
                            overLabel: { //悬浮显示的信息
                                id: item.COMPANYID,
                                message: '<div style="white-space:nowrap;min-width:100px">'+item.COMPANYNAME+'</div>',
                                classNm: "featureOver",
                                placement: "right"
                            },
                            clickLabel: {
                                id: item.COMPANYID,
                                title: item.COMPANYNAME,
                                url: 'partials/pop/risk.html',
                                classNm: "featureClick",
                                placement: "right"
                            },
                            style: {
                                image: {
                                    icon: {
                                        anchor: [0.5, 0.5],
                                        opacity: 1,
                                        src: img
                                    }
                                }
                            }
                        })
                    })
                        console.log($scope.riskSub.mark)
                })
            }

        }
        $scope.locateSource = function (item) {
            if(item.LATITUDE!=null&&item.LONGITUDE!=null&&item.LATITUDE!=''&&item.LONGITUDE!=''){
                $scope.olMap.center.lat = parseFloat(item.LATITUDE);
                $scope.olMap.center.lon = parseFloat(item.LONGITUDE);
                $scope.risk.popOverlay.visible = true;
                $scope.risk.popOverlay.coord = [parseFloat(item.LONGITUDE), parseFloat(item.LATITUDE)];
                $scope.risk.popOverlay.label.id = item.COMPANYID;
                $scope.risk.popOverlay.label.title = item.COMPANYNAME;
                angular.extend($scope.riskDetail, item);
                $scope.selectPos.coord = olHelpers.coordinateTransform($scope.risk.popOverlay.coord, "EPSG:4326", "EPSG:3857");
                $scope.selectPos.visible = true;
            }else {
                alert('因缺少经纬度无法正常显示')
            }

        }
    })
    app.controller('envirCtrl',function ($rootScope, $scope, $http, mapSet, chartSet,olHelpers){
        $scope.syd.river = mapSet.getSyd();
        if($scope.route == 'home.river'){
            $scope.data1Title = '重点流域周边(100km)风险源数量柱状图'
            $http.get('riskSource/listRiskNearRiver').then(function (res) {
                $scope.fxyCount = chartSet.fxyCount();
                var data = res.data;
                data.forEach(function (item,j) {
                    $scope.fxyCount.yAxis.data.push(item.riverName);
                    $scope.fxyCount.series[0].data.push(item.riverList) ;
                })
            })
        }else {
            $scope.data1Title = '一级水源地周边(100km)风险源数量柱状图'
            $http.get('riskSource/getRiskSourceNearWater').then(function (res) {
                $scope.fxyCount = chartSet.fxyCount();
                var data = res.data;
                data.forEach(function (item,j) {
                    $scope.fxyCount.yAxis.data.push(item.waterName);
                    $scope.fxyCount.series[0].data.push(item.resultList.length) ;
                })
            })
        }

    })
});
