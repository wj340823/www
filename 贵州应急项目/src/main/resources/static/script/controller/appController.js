define(['app','openLayers', 'mapSet', 'chartSet', 'angularCgsUtil'], function (app,ol) {
    app.controller("appCtrl", function ($rootScope, $scope, $http, olHelpers, olData,
                                        mapSet, dataSet, chartSet, $timeout,$stateParams,$state,$uibModal,$filter) {
        $rootScope.userList = {
            // access:'gzhbfxy'
            access:'gzhbfxyOnline'
        };
        $scope.showMarker = {
            risk:function () {
                //alert(111)
            },
            material:function () {
                //alert(222)
            }
        }
        var maxSize = parseInt((angular.element(window)[0].innerHeight-440)/30);
        angular.element(window).bind('resize',function () {
            maxSize = parseInt((this.innerHeight-440)/30);
            $scope.getCityMaterial()
        })
        $rootScope.system="";
        $scope.userRoot=function (){
            $http.get('user/getInfo').then(function (req) {
                $scope.userName = req.data.account;
                //console.log(req)
                $rootScope.userList={
                    userName:req.data.account,
                    xzqyId : req.data.xzqy.id||'',
                    xzqyName : req.data.xzqy.name,
                    role:req.data.roles[0].role,
                    roleName:req.data.roles[0].name,
                    displayName:req.data.displayName,
                    tel:req.data.phoneMobile,
                    companyName:req.data.companyName,
                    // access:'gzhbfxy',
                    access:'gzhbfxyOnline',
                    companyId: req.data.company
                }
                //企业
            })
        }
        $scope.getGotoUrl = function(){
            $http.get('user/getInfo').then(function (req) {
                $rootScope.system = 'new';
                var role = req.data.roles[0].role;
                var goto = "";
                $rootScope.system = 'new';
                if(role == 'qxrole'){
                    goto = 'approval'
                }else if(role == 'qyrole'){
                    goto = 'riskInvest'
                }else if(role == 'szrole'){
                    goto = 'city'
                }else if(role == 'super'){
                    goto = 'riskPrevention.riskSpatial'
                    $rootScope.system = '';
                }else {
                    goto = 'index'
                    $rootScope.system = '';
                }
                $state.go(goto);
            })
        }
        $scope.scrubEffect = false;
        $rootScope.$on('riskSendscrub', function (e, data) {
            $scope.scrubEffect = data;
        })
        function init() {
            $scope.userInfo={
                show:false,
                pwdChange:false
            }
            $scope.route = "loading";
            $scope.userRoot();
            $scope.olMap = mapSet.init();
            //$scope.olMap.timestamp=0;
            $scope.$on("timestamp",function(e,d){
                $scope.olMap.timestamp=d;
            });
            //获取时间间隔
            $scope.$on("timeDevice",function(e,d){
                $scope.olMap.timedevice=d;
            });
            $scope.selectPos = { //选中光圈
                visible: false
            }
            dataSet.getDistricts().then(function (data) {
                $scope.districts = data; //行政区域
            })
            dataSet.getWaters().then(function (data) {
                $scope.waterSource = data; //饮用水水源地（一级）
            })
            dataSet.getNatural().then(function (data) {
                $scope.natural = data; //自然保护区
            })

            $scope.cshLayer = mapSet.getCsh(); //赤水河
            $scope.yjhLayer = mapSet.getYjh(); //严家河
            $scope.sjxLayer = mapSet.getSjx(); //省界线
            //$scope.sjxLayer.feature = null
            /*$scope.sjxLayer.loadEnd = function(oSource){
                if(oSource){
                    //$scope.sjxLayer.feature = oSource.getFeatures()
                }

            }*/

            $scope.gzsxLayer = mapSet.getGzsx(); //贵州水系
            $scope.inOverlay = mapSet.getInLay(); //汇入点
            $scope.outOverlay = mapSet.getOutLay(); //出省点
            $scope.hfhLayer = mapSet.getHfh(); //红枫湖
            $scope.zdqyLayer = mapSet.getZdqy();//重点污染区域

            $scope.gzsxLayerLoad = function(oSource){
                if(oSource){
                    var feature = oSource.getFeatures();
                    feature.forEach(function (item) {
                        console.log(item.get('Name'))
                    })
                }
            }
            $scope.sLayer = {}
            $scope.sLayerLoadEnd = function(oSource){
                if(oSource){
                    var feature = oSource.getFeatures();
                    $scope.sLayer.features = feature;
                }
            }
            //源关系地图相关要素
            $scope.resourceMap={
                airModelShow:false,
                waterModelShow:false,
                river:mapSet.getGzsx(),
                riverFeatures:[],
                fxy:{
                    markers:[],
                    popup:{
                        visible:false,
                        coord:[],
                        label:{
                            id: "",
                            title: "",
                            classNm: "featureClick riskClicklay",
                            placement: "top"
                        },
                    },
                    detail:{}
                },
                mgd:{
                    markers:[]
                },
                jcd:{markers:[]},
                safeZone:{
                    coords:[],
                    radius:0,
                    style: {
                        fill: {
                            color: [230, 188, 11, 0.1]
                        },
                        stroke: {
                            width: 4,
                            color: "#E6BC0B"
                        }
                    }

                },
                dangerZone:{
                    coords:[],
                    radius:0,
                    style: {
                        fill: {
                            color: [255, 0, 0, 0.1]
                        },
                        stroke: {
                            width: 4,
                            color: "red"
                        }
                    }
                },
                safeLine:{},
                dangerLine:{},
                fxyPopLabel: function (item) { //marker点击弹框
                    var self = this;
                    self.fxy.popup.visible = true;
                    self.fxy.popup.coord = [item.lon, item.lat];
                    self.fxy.popup.label.id = item.id;
                    self.fxy.popup.label.title = item.info.COMPANYNAME;
                    self.fxy.detail = item.info;
                    $scope.riskDetail = item.info;//风险源一览表用到的相关信息
                    $scope.olMap.center.lat = parseFloat(item.lat);
                    $scope.olMap.center.lon = parseFloat(item.lon);
                    //$scope.$apply();
                }
            };

            //气模型工具
            $scope.aiModalTool = {
                safeZone:{
                    coords:[],
                    radius:0,
                    style: {
                        fill: {
                            color: [230, 188, 11, 0.1]
                        },
                        stroke: {
                            width: 4,
                            color: "#E6BC0B"
                        }
                    }

                },
                dangerZone:{
                    coords:[],
                    radius:0,
                    style: {
                        fill: {
                            color: [255, 0, 0, 0.1]
                        },
                        stroke: {
                            width: 4,
                            color: "red"
                        }
                    }
                },
                safeLine:{},
                dangerLine:{}
            };

            //水模型工具
            $scope.waterModalTool = {
                plot40l3:{
                    marker:[{
                        lat:'',
                        lon:''
                    }]
                }
            };

            $scope.riverCreated=function(source){
                if(source){
                    var features = source.getFeatures();
                    $scope.resourceMap.riverFeatures=features.map(function(feature){
                        var style = feature.getStyle();
                        var name = feature.get("Name");
                        return {
                            name:name,
                            feature:feature,
                            style:style
                        }
                    })
                    $timeout(function(){
                        $rootScope.$broadcast("riverCreated");
                    },600);

                }
            };

            //模型数据是否加载成功
            $scope.$on("olFcolorComplete",function(e,isSuccess){
                $rootScope.$broadcast("olFcolorComplete",isSuccess);
            });
            $scope.$on("peakData",function(e){
                $rootScope.$broadcast("peakData");
            });
            $scope.nearStyle = { //周围范围样式
                fill: {
                    color: [255, 0, 0, 0.1]
                },
                stroke: {
                    width: 1,
                    color: "red"
                }
            };
            $scope.nearStyle1 = { //伤害浓度范围样式
                fill: {
                    color: [230, 188, 11, 0.1]
                },
                stroke: {
                    width: 1,
                    color: "#E6BC0B"
                }
            };
            $scope.somepointStyle = {
                image: {
                    circle: {
                        radius: 10,
                        fill: {
                            color: [230, 188, 11, 0]
                        },
                        stroke: {
                            width: 1,
                            color: "#D32F2F"
                        }
                    }
                }
            }
            $scope.nearCircle1 = {
                coords: [105.758480622, 28.5551627353]
            }
            $scope.radiusStyle = { //半径样式
                stroke: {
                    width: 4,
                    color: "#F9A825"
                }
            };
            $scope.nearRadius = {
                coords: [[11772980.20991133, 3319149.134404648], [11774631.023524, 3319149.134404648]],
                midCoord: [11773805.616717665, 3319149.134404648],
                label: {
                    message: "<div class='nowrap'>1450m</div>",
                    classNm: "featureOver centerOver",
                    placement: "bottom",
                    stopEvent: false
                }
            }
            $scope.nearRadius1 = {
                coords: [[11772980.20991133, 3319149.134404648], [11772980.20991133, 3315972.741315445]],
                midCoord: [11772980.20991133, 3317560.9378600465],
                label: {
                    message: "<div class='nowrap'>2790m</div>",
                    classNm: "featureOver verticalOver",
                    placement: "right",
                    stopEvent: false
                }
            }
            $scope.airtextLays = [{
                coord: [11771461.02397416, 3318628.407149455],
                label: {
                    message: "<div class='nowrap'>半致死浓度</div>",
                    classNm: "featureOver",
                    placement: "right",
                    stopEvent: false
                }
            }, {
                coord: [11774308.303277783, 3316937.2378986455],
                label: {
                    message: "<div class='nowrap'>伤害浓度</div>",
                    classNm: "featureOver",
                    placement: "right",
                    stopEvent: false
                }
            }, {
                coord: [11776156.603000533, 3319149.134404648],
                label: {
                    message: "<div>卫生防护距离</div>",
                    classNm: "featureOver verticalOver1",
                    placement: "right",
                    stopEvent: false
                }
            }]
            $scope.airModel = {};
            $scope.waterModel = {};
            $scope.material = {
                stores: [],
                materialSearch: {
                    pollutionCtrl: false,
                    searchItem: {}
                },
                materialChart: {
                    consumption: {
                        show: false,
                        searchItem: {
                            start: new Date().getFullYear()+'/01/01',
                            end: new Date().getFullYear()+1+'/01/01',
                        }
                    },
                    watch: {
                        show: false
                    },
                    warn: {
                        show: false
                    }
                },
                line: { //最近距离连线
                    visible: false,
                    coords: [],
                    style: {
                        stroke: {
                            color: '#FFCC01',
                            width: 2,
                            lineDash: [4, 4]
                        }
                    },
                    viewFit: function (feature) {
                        if (feature) {
                            olData.getMap("map1").then(function (map) {
                                map.getView().fit(feature.getGeometry(), {
                                    padding: [160, 60, 100, 340]
                                });
                            });
                            $scope.material.line.overlay.coord = feature.getGeometry().getCoordinateAt(0.5);
                            var length = feature.getGeometry().getLength();
                            $scope.material.line.overlay.label.message = "<div class='nowrap'>" + Math.round(length * 100) / 100 + "m</div>";
                            $scope.material.line.overlay.visible = true;
                        }
                    },
                    overlay: {
                        visible: false,
                        coord: undefined,
                        label: {
                            message: "<div class='nowrap'></div>",
                            classNm: "featureOver",
                            placement: "right",
                            stopEvent: false
                        }
                    }
                }
            };

            $scope.materialDetail = {
                searchItem: {
                    numRange: ""
                },
                anaData: {
                    curMonth: new Date().getMonth() + 1
                }
            };
            $scope.materialDetail.pageNo = 1;
            $scope.materialDetail.pageSize = 8;
            $scope.materialDetail.totalCount = 8;

            $scope.goodsCategory = []; //物资设备分类

            $http.get("rest/dc/"+$rootScope.userList.access+"/Category").then(function (data) {
                $scope.goodsCategory = data.data;
                $scope.goodsCategory.unshift({
                    id: "",
                    name: "全部"
                })
            })
            $scope.goodsManagerUnit = []; //物资设备管理单位
            $http.get("rest/dc/"+$rootScope.userList.access+"/ManagerUnit").then(function (data) {
                $scope.goodsManagerUnit = data.data;
                $scope.goodsManagerUnit.unshift({
                    id: "",
                    name: "全部"
                })
            })

            //风险源地图
            $scope.riskDetail = {};
            $scope.risk = {
                topDistricts: [],
                HeatMark:[],
                heatMap: true,
                state:true,
                gzLayer: {
                    source: {
                        type: "GeoJSON",
                        url: "guizhou.json",
                        loader:true,
                        dataType:"json",
                        moveStyle: function () {
                            return ol.style.Stroke({
                                stroke:{
                                    width: 2,
                                    color: "#1a5cb9"
                                }
                            })
                        }
                    },
                    zIndex: 2,
                    style: {
                        stroke: {
                            width: 2,
                            color: "#1a5cb9"
                        }
                    },
                    loadEnd: function (oSource) {
                        if(oSource){
                            $scope.risk.gzLayer.features = oSource.getFeatures()
                        }
                    }
                },
                markers: [],
                popOverlay: {
                    visible: false,
                    coord: undefined,
                    label: {
                        id: "",
                        title: "",
                        classNm: "featureClick riskClicklay",
                        placement: "top"
                    }
                },
                popLabel: function (item) { //marker点击弹框
                    $scope.risk.popOverlay.visible = true;
                    $scope.risk.popOverlay.coord = [item.lon, item.lat];
                    $scope.risk.popOverlay.label.id = item.id;
                    $scope.risk.popOverlay.label.title = item.info.COMPANYNAME;
                    $scope.riskDetail = item.info;
                    $scope.olMap.center.lat = parseFloat(item.lat);
                    $scope.olMap.center.lon = parseFloat(item.lon);
                    $scope.$apply();
                    //console.log($scope.risk.popOverlay.coord)
                },
                sourceInfo: {
                    company: false
                }
            }
            $scope.risk.districts = [];
            dataSet.getDistricts().then(function (data) {
                $scope.districts = data; //行政区域
                $scope.districts.forEach(function (d) {
                    if (d.name != "贵安新区") {
                        $scope.risk.districts.push({
                            coord: [parseFloat(d.longitude), parseFloat(d.latitude)],
                            /*label: {
                                id: d.id,
                                message: '<div style="white-space:nowrap;margin-left: -20px;margin-top: -6px;">' + d.name + '</div>',
                                classNm: "placeName",
                                placement: "right",
                                stopEvent: false
                            }*/
                        })
                    }
                })
            })
            $scope.company = {
                'intro':true,
                'hgsjt':false,
                'hjfxys':false,
                'hjfxwz':false,
                'hjfxdy':false,
                'hjfxfkss':false,
                'sczz':false,
                'scgy':false,
                'hjbhmb':false,
                'hjwrsgy':false,
                'tfhjsjqjfx':false,
                'yjwz':false,
                'yjzhtxl':false,
                'yjwbllb':false,
                'yjzj':false,
            }
            $scope.showYlb = function (n) {
                $scope.company = {
                    'intro':false,
                    'hgsjt':false,
                    'hjfxys':false,
                    'hjfxwz':false,
                    'hjfxdy':false,
                    'hjfxfkss':false,
                    'sczz':false,
                    'scgy':false,
                    'hjbhmb':false,
                    'hjwrsgy':false,
                    'tfhjsjqjfx':false,
                    'yjwz':false,
                    'yjzhtxl':false,
                    'yjwbllb':false,
                    'yjzj':false,
                }
                $scope.company[n] = true
                //console.log($scope.company)
            }
            $scope.riskSub={
                mark:[]
            }
            $scope.syd ={
                river:null
            }
            $scope.risk.material = null;

        }
        init();
        //初始化
        $scope.materialDetail.searchItem.numRange = "";
        $scope.materialDetail.searchItem.name = "";
        $scope.materialDetail.searchItem.category = "";
        $scope.materialDetail.searchItem.managerunit = "全部";


        $scope.$on("openlayers.map.singleclick", function (e, d) {
          var coord = olHelpers.coordinateTransform(d.coord, "EPSG:3857", "EPSG:4326");
             console.log(coord);
            $rootScope.$emit('waterLocate',coord)
            var f = d.feature;
            if (f && f.get("featureInfo") && f.get("featureInfo").type == "marker") {
                $scope.selectPos.coord = f.getGeometry().getCoordinates();
                $scope.selectPos.visible = true;
                var detail = f.get("featureInfo").data.info;
                if (detail.COMPANYID) {
                    angular.extend($scope.riskDetail, detail);
                    $scope.riskDetail.DOCUMENTYEAR=$scope.riskDetail.DOCUMENTYEAR==null?' '
                        :$filter('date')($scope.riskDetail.DOCUMENTYEAR,'-yyyy')
                    return;
                }
                $scope.districts.forEach(function (item) {
                    if (detail.xzqyId2 == item.id) {//标记
                        detail.xzqy = item.name;
                    }else if(detail.xzqyId==1){
                        detail.xzqy = '贵州省';
                    }
                })
                //console.log(detail.id)
                //console.log($scope.riskDetail.COMPANYID)
                angular.extend($scope.materialDetail, detail);
            } else {
                $scope.$apply(function () {
                    $scope.selectPos.visible = false;
                    $scope.risk.popOverlay.visible = false;
                });
            }
            $scope.searchReserve = function () {
                if ($scope.materialDetail.searchItem.numRange) {
                    var arr = $scope.materialDetail.searchItem.numRange.split("-");
                    //$scope.materialDetail.searchItem.minnumber = arr[0];
                    //$scope.materialDetail.searchItem.maxnumber = arr[1];
                }

                var str = "";
                /*angular.forEach($scope.materialDetail.searchItem, function (v, k) {
                    if (v && v != "全部") {
                        str += "&" + k + "=" + encodeURIComponent(v);
                    }
                })*/
                str = str.substr(1);
                $http.get("goods/list?" + str, {
                    params: {
                        pageSize: $scope.materialDetail.pageSize,
                        pageNo: $scope.materialDetail.pageNo,
                        wareHouseId: $scope.materialDetail.id,
                        name:$scope.materialDetail.searchItem.name
                    }
                }).then(function (data) {
                    $scope.materialDetail.goods = data.data.dataList;
                    $scope.materialDetail.pageSize = data.data.pageSize;
                    $scope.materialDetail.totalCount = data.data.totalCount
                })
            }
        })
        $scope.getCityMaterial = function(){
            $http.get("goods/list", {
                params: {
                    wareHouseId: $scope.materialDetail.id,
                    pageNo:$scope.materialDetail.pageNo,
                    pageSize:maxSize
                }
            }).then(function (data) {
                $scope.materialDetail.goods = data.data.dataList;
                $scope.materialDetail.pageSize = data.data.pageSize;
                $scope.materialDetail.totalCount = data.data.totalCount;
            })
        }
        $scope.getCityMaterial()
        $scope.$on("openlayers.map.pointermove", function (e, d) {
            var f = d.feature;
            if (f && f.get("flag") == "mgdNotice") {
                var g = f.getGeometry();
                $scope.$apply(function () {
                    $scope.waterModel.mgdOverlay.label.message = "<div style='white-space:nowrap;'>" + f.get("NAME") + "</div>";
                    $scope.waterModel.mgdOverlay.coord = g.getCoordinates();
                });
            } else {
                if ($scope.waterModel.mgdOverlay) {
                    $scope.$apply(function () {
                        $scope.waterModel.mgdOverlay.coord = undefined;
                    });
                }
            }
        })

        /* 监听路由的状态变化 */
        stateListener = $scope.$on('$stateChangeStart', function (event, toState, toParams) {
            var route = toState.name;

            $scope.route = route;
            $scope.selectPos.visible = false; //移除选中光圈
        });
        //市州聚焦样式
        var createActiveStyle = function(name){
            return new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#FF0000',
                    width: 4
                })
            });
        };
        var normalStyle = function(name){
            return new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#1a5cb9',
                    width: 2
                })
            });
        };
        //点击左侧菜单定位到特定位置
        $scope.locate = function (item, flag) {
            if (item.latitude && item.longitude && parseFloat(item.latitude) <= 90) {
                var coords = [parseFloat(item.longitude), parseFloat(item.latitude)];
                $scope.olMap.center.lat = coords[1];
                $scope.olMap.center.lon = coords[0];
                $scope.sLayer.features.forEach(function (feature) {
                    if(feature.get('name') == item.name){
                        var activeStyle = createActiveStyle(item.name);
                        feature.setStyle(activeStyle);
                    }else {
                        feature.setStyle(normalStyle(item.name))
                    }
                })
                if (flag != 1 && $scope.route == "emergency.emergencyMaterial") {
                    olData.getMap("map1").then(function (map) {
                        map.getLayers().forEach(function (l) {
                            if (l.get("markers")) {
                                var s = l.getSource();
                                var coords2 = olHelpers.coordinateTransform(coords, "EPSG:4326", "EPSG:3857");
                                var coords3 = s.getClosestFeatureToCoordinate(coords2).getGeometry().getCoordinates();
                                $scope.material.line.coords = [coords2, coords3];
                                $scope.material.line.visible = true;
                            }
                        })
                    })
                } else {
                    $scope.olMap.center.zoom = 12;
                }


            }
            $scope.districts.forEach(function (obj) {
                obj.active = false;
            })
            $scope.waterSource.forEach(function (obj) {
                obj.active = false;
            })
            $scope.natural.forEach(function (obj) {
                obj.active = false;
            })
            item.active = true;
        }

        $scope.closeRiskLay = function () {
            $scope.selectPos.visible = false;
            /*if ($scope.route == "home") {
                $scope.risk.markers.forEach(function (s) {
                    if (s.id == $scope.selectedLayid) {
                        s.clickLabel.remove = true;
                    }
                })
            } else {*/
                $scope.risk.popOverlay.visible = false;
            //}
        };

        //打开储备现状
        $scope.getReserve = function () {
            $scope.scrubEffect = true;
            $scope.materialDetail.reserveShow = true;
            $scope.searchReserve()
            console.log($scope.riskDetail.COMPANYID)
        }
        //        监听储备详情关闭按钮
        $rootScope.$on('closeStroages', function (e, data) {
            $scope.scrubEffect = data;
        })
        //放大宏观数据图
        $scope.showhgsjtImg = function (id) {
            if(id != ''){
                $scope.hgsjtFileid = id;
                $scope.hjsjtbigImg = true
            }else{
                $scope.hjsjtbigImg = false
            }

        }
        /* 企业详情*/
        $scope.openOverview = function () {
            $scope.riskSource = {
                companyInfo: ''
            }
            $scope.scrubEffect = true;
            $scope.risk.sourceInfo.overview = true;
            $scope.fxwzlx='1';
            $scope.scgygylx= '';
            $scope.hbmblx= '水';
            $scope.fksslx= '1';
            //$scope.$broadcast('sendType', 'overViews');
            $scope.storagePage = {
                pageNo:1,
                pageSize:8,
                totalCount:8,
                hjfxwzPageNo : 1,
                hjfxwzpageSize : 8,
                hjfxwztotalCount : 8,
                hjbhmbPageNo : 1,
                hjbhmbpageSize : 8,
                hjbhmbtotalCount : 8,
                tfhjpageNo : 1,
                tfhjpageSize : 8,
                tfhjtotalCount : 8,
                scgypageNo : 1,
                scgypageSize : 8,
                scgytotalCount : 8
            }
            $scope.getMsgList=function (type,value){
                if(typeof type != 'undefined'){
                    $scope[type] = value;
                }
                var companyId = encodeURIComponent($scope.riskDetail.COMPANYID);
                $scope.linkCompanyId = encodeURIComponent($scope.riskDetail.COMPANYID);
                // $http({
                //     method:'GET',
                //     url:'riskSource/downloadAttachment?companyId='+encodeURIComponent($scope.riskDetail.COMPANYID)+'&type=1',
                // }).then(function (req) {
                //     $scope.cqpmt=1;
                // },function (req) {
                //     $scope.cqpmt=2;
                // })
                $http.get("riskSourceTwo/enterpriseInfo/"+companyId).then(
                    function (req) {
                        $scope.companyInfoTro = req.data
                        //console.log($scope.riskSource.companyInfo)
                    }
                )
                // $http.get("riskSource/getCompanyDetails?"+'&companyId='+encodeURIComponent($scope.riskDetail.COMPANYID)+'&type=1').then(
                //     function (req) {
                //         $scope.companyInfoTro = req.data
                //         //console.log($scope.riskSource.companyInfo)
                //     }
                // )
                $http.get("riskSourceTwo/file/list/"+companyId).then(function (req) {
                    $scope.riskfile = req.data;
                    if(req.data.length > 0){
                        $scope.hgsjtFileid = req.data[0].id;
                    }
                })
                $http.get("riskSourceTwo/getRiskFactors?qyId="+companyId).then(function (req) {
                    if(req.data[0].pkinfos != null) {
                        for (var i = 0; i < req.data[0].pkinfos.length; i++) {
                            var pfxx = req.data[0].pkinfos[i].pfqx.split(','),
                                qt = req.data[0].pkinfos[i].qt == '' ? '' : '(' + req.data[0].pkinfos[i].qt + ')',
                                pfarr = [];
                            for (var j = 0; j < pfxx.length; j++) {
                                if (pfxx[j] == '1') {
                                    pfarr.push('间接排放');
                                } else if (pfxx[j] == '2') {
                                    pfarr.push('进入市政污水网');
                                } else if (pfxx[j] == '3') {
                                    pfarr.push('进入园区污水管网');
                                } else if (pfxx[j] == '4') {
                                    pfarr.push('其他' + qt);
                                }
                            }
                            req.data[0].pkinfos[i].pfqx = pfarr.join(';');
                        }
                    }else{
                        req.data[0].pkinfos = [];
                    }
                    $scope.riskfactors = req.data[0]
                })
                $http.get("riskSourceTwo/getHjRiskSubstances?qyId="+companyId+'&fxlx=1&pageNo=1&pageSize=99999').then(function (req) {
                    $scope.risksubstances = req.data.dataList;
                    // $scope.storagePage.hjfxwzpageSize = req.data.pageSize;
                    // $scope.storagePage.hjfxwztotalCount = req.data.totalCount;
                })
                $http.get("riskSourceTwo/getHjRiskSubstances?qyId="+companyId+'&fxlx=2&pageNo=1&pageSize=99999').then(function (req) {
                    $scope.riskAirsubstances = req.data.dataList;
                })
                $http.get('riskSourceTwo/RiskSourceUnit/list/'+companyId).then(function (req) {
                    $scope.riskunit = req.data;
                })
                $http.get('riskSourceTwo/RiskControlMeasures/'+companyId).then(function (req) {
                        $scope.riskmeasures = req.data;
                        if(req.data.jlcs != null){
                            $scope.riskmeasures.jlcs = req.data.jlcs.split(',');
                            var jlcsarr = [];
                            for(var i=0; i<$scope.riskmeasures.jlcs.length; i++){
                                if($scope.riskmeasures.jlcs[i] == '1'){
                                    jlcsarr.push('环境风险单元设防渗漏、防腐蚀、防淋溶、防流失措施');
                                }else if($scope.riskmeasures.jlcs[i] == '2'){
                                    jlcsarr.push('装置围堰与罐区防火堤（围堰）外设排水切换阀，正常情况下通向雨水系统的阀门关闭，通向事故存液池、应急事故水池、清净废水排放缓冲池或污水处理系统的阀门打开');
                                }else if($scope.riskmeasures.jlcs[i] == '3'){
                                    jlcsarr.push('前述措施日常管理及维护良好，有专人负责阀门切换或设置自动切换设施,保证初期雨水、泄漏物和受污染的消防水排入污水系统');
                                }
                            }
                            $scope.riskmeasures.jlcs = jlcsarr.join(';');

                            $scope.riskmeasures.sgfssjcs = req.data.sgfssjcs.split(',');
                            var jsgfssjcsarr = [];
                            for(var i=0; i<$scope.riskmeasures.sgfssjcs.length; i++){
                                if($scope.riskmeasures.sgfssjcs[i] == '1'){
                                    jsgfssjcsarr.push('按相关设计规范设置应急事故水池、事故存液池或清净废水排放缓冲池等事故排水收集设施，并根据相关设计规范、下游环境风险受体敏感程度和易发生极端天气情况，设计事故排水收集设施的容量');
                                }else if($scope.riskmeasures.sgfssjcs[i] == '2'){
                                    jsgfssjcsarr.push('确保事故排水收集设施在事故状态下能顺利收集泄漏物和消防水，日常保持足够的事故排水缓冲容量');
                                }else if($scope.riskmeasures.sgfssjcs[i] == '3'){
                                    jsgfssjcsarr.push('通过协议单位或自建管线，能将所收集废水送至厂区内污水处理设施处理');
                                }
                            }
                            $scope.riskmeasures.sgfssjcs = jsgfssjcsarr.join(';');

                            $scope.riskmeasures.qjfsxtcs = req.data.qjfsxtcs.split(',');
                            var jqjfsxtcsarr = [];
                            for(var i=0; i<$scope.riskmeasures.qjfsxtcs.length; i++){
                                if($scope.riskmeasures.qjfsxtcs[i] == '1'){
                                    jqjfsxtcsarr.push('具有收集受污染的清净废水的缓冲池（或收集池），池内日常保持足够的事故排水缓冲容量；池内设有提升设施或通过自流，能将所收集物送至厂区内污水处理设施处理');
                                }else if($scope.riskmeasures.qjfsxtcs[i] == '2'){
                                    jqjfsxtcsarr.push('具有清净废水系统的总排口监视及关闭设施，有专人负责在紧急情况下关闭清净废水总排口，防止受污染的清净废水和泄漏物进入外环境');
                                }
                            }
                            $scope.riskmeasures.qjfsxtcs = jqjfsxtcsarr.join(';');

                            $scope.riskmeasures.yspsxtfxfkcs = req.data.yspsxtfxfkcs.split(',');
                            var jyspsxtfxfkcsarr = [];
                            for(var i=0; i<$scope.riskmeasures.yspsxtfxfkcs.length; i++){
                                if($scope.riskmeasures.yspsxtfxfkcs[i] == '1'){
                                    jyspsxtfxfkcsarr.push('厂区雨水均进入废水处理系统；或雨污分流，且雨水排水系统具有收集初期雨水的收集池或雨水监控池；池出水管上设置切断阀，正常情况下阀门关闭，防止受污染的雨水外排；池内设有提升设施或通过自流，能将所收集物送至厂区污水处理设施处理');
                                }else if($scope.riskmeasures.yspsxtfxfkcs[i] == '2'){
                                    jyspsxtfxfkcsarr.push('具有雨水系统总排口（含泄洪渠）监视及关闭设施，在紧急情况下有专人负责关闭雨水系统总排口（含与清净废水共用一套排水系统情况），防止雨水，消防水和泄漏物进入外环境');
                                }else if($scope.riskmeasures.yspsxtfxfkcs[i] == '3'){
                                    jyspsxtfxfkcsarr.push('如果有排洪沟，排洪沟不得通过生产区和罐区，或具有防止泄漏物和受污染的消防水等流入区域排洪沟的措施');
                                }
                            }
                            $scope.riskmeasures.yspsxtfxfkcs = jyspsxtfxfkcsarr.join(';');

                            $scope.riskmeasures.scfswpcs = req.data.scfswpcs.split(',');
                            var scfswpcsarr = [];
                            for(var i=0; i<$scope.riskmeasures.scfswpcs.length; i++){
                                if($scope.riskmeasures.scfswpcs[i] == '1'){
                                    scfswpcsarr.push('受污染的循环冷却水、雨水、消防水等排入生产废水系统或独立处理系统');
                                }else if($scope.riskmeasures.scfswpcs[i] == '2'){
                                    scfswpcsarr.push('生产废水排放前设监控池，能够将不合格废水送废水处理设施处理');
                                }else if($scope.riskmeasures.scfswpcs[i] == '3'){
                                    scfswpcsarr.push('如企业收污染的清净废水或者雨水进入废水处理系统处理，则废水处理系统应设置事故水缓冲设施');
                                }else if($scope.riskmeasures.scfswpcs[i] == '4'){
                                    scfswpcsarr.push('具有生产废水总排口监视及关闭设施，有专人负责启用，确保泄漏物，受污染的消防水，不合格废水不排除厂外');
                                }
                            }
                            $scope.riskmeasures.scfswpcs = scfswpcsarr.join(';');
                        }
                })
                $http.get("riskSource/getProductionUnit?"+'&companyId='+encodeURIComponent($scope.riskDetail.COMPANYID)).then(
                    function (req) {
                        $scope.proLists = req.data
                    }
                )
                $http.get('riskSourceTwo/getProductionProcess?qyId='+companyId+'&gylx='+$scope.scgygylx+'&pageNo='+$scope.storagePage.scgypageNo+'&pageSize='+$scope.storagePage.scgypageSize).then(function (data) {
                    $scope.scgyLists = data.data.dataList;
                    $scope.storagePage.scgypageSize = data.data.pageSize;
                    $scope.storagePage.scgytotalCount = data.data.totalCount;
                })
                //风险受体整体信息
                $http.get("riskSourceTwo/riskReceptorWithCompany/"+companyId).then(function (req) {
                    if(req.data.length > 0) {
                        $scope.shjfxstmgcd = req.data[0].shjfxstmgcd.split(',');
                        var shjfarr = [];
                        for(var i=0; i<$scope.shjfxstmgcd.length; i++){
                            if($scope.shjfxstmgcd[i] == '1'){
                                shjfarr.push('企业雨水排口、清净废水排口、污水排口下游10公里流经范围内有下列一类或多类环境风险受体：集中式地表水、地下水饮用水水源保护区（包括一级保护区、二级保护区及准保护区）；农村及分散式饮用水水源保护区');
                            }else if($scope.shjfxstmgcd[i] == '2'){
                                shjfarr.push('废水排入受纳水体后24小时流经范围（按受纳河流最大日均流速计算）内涉及跨国界的');
                            }else if($scope.shjfxstmgcd[i] == '3'){
                                shjfarr.push('企业雨水排口、清净废水排口、污水排口下游10公里流经范围内有生态保护红线划定的或具有水生态服务功能的其他水生态环境敏感区和脆弱区，如国家公园，国家级和省级水产种质资源保护区，水产养殖区，天然渔场，海水浴场，盐场保护区，国家重要湿地，国家级和地方级海洋特别保护区，国家级和地方级海洋自然保护区，生物多样性保护优先区域，国家级和地方级自然保护区，国家级和省级风景名胜区，世界文化和自然遗产地，国家级和省级森林公园，世界、国家和省级地质公园，基本农田保护区，基本草原');
                            }else if($scope.shjfxstmgcd[i] == '4'){
                                shjfarr.push('企业雨水排口、清净废水排口、污水排口下游10公里流经范围内涉及跨省界的');
                            }else if($scope.shjfxstmgcd[i] == '5'){
                                shjfarr.push('企业位于溶岩地貌、泄洪区、泥石流多发等地区');
                            }
                        }
                        $scope.hjbhmbWhole = shjfarr.join(';');
                        $scope.hjbhmbactualsituation = req.data[0].actualsituation;
                    }
                })
                //水环境保护目标
                $http.get("riskSourceTwo/getRiskReceptor?qyId="+companyId+'&stlx=水&pageNo=1&pageSize=99999').then(function (req) {
                    $scope.targetLists = req.data.dataList;
                    // $scope.storagePage.hjbhmbpageSize = req.data.pageSize;
                    // $scope.storagePage.hjbhmbtotalCount = req.data.totalCount;
                })
                //气环境保护目标
                $http.get("riskSourceTwo/getRiskReceptor?qyId="+companyId+'&stlx=大气&pageNo=1&pageSize=99999').then(function (req) {
                    $scope.AirtargetLists = req.data.dataList;
                })
                // $http.get("riskSource/getProtectionObject?"+'&companyId='+encodeURIComponent($scope.riskDetail.COMPANYID)).then(
                //     function (req) {
                //         $scope.targetLists = req.data
                //     }
                // )
                $http.get("riskSource/getAccidentSource?"+'&companyId='+encodeURIComponent($scope.riskDetail.COMPANYID)).then(
                    function (req) {
                        $scope.accidents = req.data
                    }
                )
                $http.get("riskSourceTwo/getQyScenarioAnalysis?qyId="+companyId+'&pageNo='+$scope.storagePage.tfhjpageNo+'&pageSize='+$scope.storagePage.tfhjpageSize).then(function (req) {
                    $scope.qyscenario = req.data.dataList;
                    $scope.storagePage.tfhjpageSize = req.data.pageSize;
                    $scope.storagePage.tfhjtotalCount = req.data.totalCount;
                })
                $http.get('riskSource/getEmergencySubstance?&companyId='+companyId+'&pageNo='+$scope.storagePage.pageNo+'&pageSize='+$scope.storagePage.pageSize).then(function (data) {
                    $scope.storages = data.data.dataList;
                    $scope.storagePage.pageSize = data.data.pageSize;
                    $scope.storagePage.totalCount = data.data.totalCount;
                    //console.log($scope.storages)
                })
                $http.get('riskSource/getEmergencyCrew?'+'&companyId='+encodeURIComponent($scope.riskDetail.COMPANYID)).then(function (data) {
                    $scope.phones = data.data;
                })
                $http.get('riskSource/getForeignAidUnit?'+'&companyId='+encodeURIComponent($scope.riskDetail.COMPANYID)).then(function (data) {
                    $scope.emergency = data.data;
                })
                $http.get('riskSource/getEmergencySpecialist?'+'&companyId='+encodeURIComponent($scope.riskDetail.COMPANYID)).then(function (data) {
                    $scope.experts = data.data;
                })
            }
            $scope.getMsgList()
        }

        // 打开预案管理
        $scope.openEmergency = function () {
            $scope.risk.sourceInfo.emergency = true;
            console.log($scope.riskDetail.COMPANYNAME);
            $http.post("preplan/listEnterprisePreplan",
                {
                    "companyName": $scope.riskDetail.COMPANYNAME,
                    "recordStatus":-1
                }).then(function (res) {
                    $scope.entDetail = res.data.dataList[0];
                }
            ).then(function () {
                $http.get("preplan/listAttachmentByPlan?planId=" + encodeURIComponent($scope.entDetail.ID)).then(function (res) {
                    $scope.entLists = res.data.dataList;
                    if (res.data.totalCount == 0) {
                        $scope.noData = false;
                    } else {
                        $scope.noData = true;
                    }
                })
            })
        }

        //关闭弹窗
        $scope.closePrint = function () {
            $scope.company = {
                'intro':true,
                'sczz':false,
                'hjbhmb':false,
                'hjwrsgy':false,
                'yjwz':false,
                'yjzhtxl':false,
                'yjwbllb':false,
                'yjzj':false,
            }
            $scope.risk.sourceInfo.overview = false;
            $scope.risk.sourceInfo.emergency = false;
            $rootScope.$emit('riskSendscrub', 'false');
        }
        /*监听视窗变化*/
        /*$(window).resize(function () {
            var tbodyh = $('.riskTable').height() - 19;
            $scope.$broadcast('sendTbodyh', tbodyh);
        })*/
        $scope.changePwd = function () {
            var modalInstance = $uibModal.open({
                templateUrl: "partials/pop/changePwd.html",
                controller: "changePwdCtrl",
                backdrop: 'static',
                size: 'role',
                resolve: {}
            });
            modalInstance.result.then(function (i) {
                console.log(111)
            }, function () {});
        }
        $scope.showUserInfo=function () {
            var modalInstance = $uibModal.open({
                templateUrl: "partials/pop/userInfo.html",
                controller: "userInfoCtrl",
                backdrop: 'static',
                size: 'role',
                resolve: {}
            });
            modalInstance.result.then(function (i) {
                //console.log(222)
            }, function () {});
        }
    });
    app.controller("materialPopCtrl",function ($rootScope,$scope) {
        //关闭物资库弹窗
        $scope.closeStoreLay = function () {
            $scope.material.stores.forEach(function (s) {
                if (s.id == $scope.selectedLayid) {
                    s.clickLabel.remove = true;
                    $scope.selectPos.visible = false;
                }
            })
        }

    })
    app.controller('enterPopCtrl' , function($rootScope,$scope,$http,olHelpers){
        var marker = $scope.risk.topDistricts.filter(function (s) {
                    return s.info.ID == $scope.selectedLayid;
                })[0];
        /**/
        function getEnterList(level){
            if(level == ''||level == undefined){
                var url = 'riskSource/listRiskSouce?'+"&xzqyId="+$scope.selectedLayid
            }else {
                var url = 'riskSource/listRiskSouce?'+"&xzqyId="+$scope.selectedLayid+'&riskGrade='+level
            }
            $http.get(url).then(function(data){
                $scope.enterList = data.data;
            })
        }
        $rootScope.$on('risk.cityMark',function (e,d) {
            getEnterList(d)
        })
        $rootScope.$emit("showNearMark",marker)
        $scope.closeStoreLay = function () {
            $scope.risk.topDistricts.forEach(function (s) {
                if (s.info.ID == $scope.selectedLayid) {
                    s.clickLabel.remove = true;
                    $scope.selectPos.visible = false;
                }
            })
        }
        $scope.locateSource = function (item) {
        $scope.closeStoreLay()
                    if(item.LATITUDE!=null&&item.LONGITUDE!=null&&item.LATITUDE!=''&&item.LONGITUDE!=''){
                        $scope.olMap.center.lat = parseFloat(item.LATITUDE);
                        $scope.olMap.center.lon = parseFloat(item.LONGITUDE);
                        $scope.olMap.center.zoom = 12;
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
    app.controller('ylbCtrl',function ($scope) {
        $scope.closeRiskLay = function () {
            if($scope.riskSub.mark){
                $scope.riskSub.mark.forEach(function (s) {
                    if (s.id == $scope.selectedLayid) {
                        s.clickLabel.remove = true;
                        $scope.selectPos.visible = false;
                    }
                })
            }
            if($scope.risk.markers){
                $scope.risk.markers.forEach(function (s) {
                    if (s.id == $scope.selectedLayid) {
                        s.clickLabel.remove = true;
                        $scope.selectPos.visible = false;
                    }
                })
            }
            if($scope.risk.cityMark){
                $scope.risk.cityMark.forEach(function (s) {
                    if (s.id == $scope.selectedLayid) {
                        s.clickLabel.remove = true;
                        $scope.selectPos.visible = false;
                    }
                })
            }
            $scope.risk.popOverlay.visible = false;
        }
    })
    app.controller('userInfoCtrl',['$scope', '$http', '$uibModalInstance',
        function ($scope, $http, $uibModalInstance, op, select) {
            $scope.closeUserInfo = function () {
                $uibModalInstance.close();
            }
            function init() {

            }
            init()
        }])
    app.controller('changePwdCtrl',['$scope', '$http', '$uibModalInstance',
        function ($scope, $http, $uibModalInstance, op, select) {
        $scope.addOk = function () {
            if($scope.userPwd.oldPwd!=''&&$scope.userPwd.newPwd!=''&&$scope.userPwd.newPwd === $scope.userPwd.surePwd){
                $http({
                    url:'user/changePassword?'+'oldP='+$scope.userPwd.oldPwd+
                    '&newP='+$scope.userPwd.newPwd,
                    method:'PUT',
                    transformResponse:function(data){
                        return data;
                    }
                }).then(
                        function (req) {
                            //console.log(req)
                            if(req.data=='success'){
                                alert('修改成功！')
                            }
                        }
                )
                $uibModalInstance.close();
            }else {
                alert('输入有误！')
            }
        }
        $scope.cancel = function () {
            $uibModalInstance.close();
        }
        function init() {
            $scope.userPwd = {
                oldPwd:'',
                newPwd:'',
                surePwd:''
            }
        }
        init()
    }])
    app.filter('reverse', function () {
        return function (items) {
            return items.slice().reverse();
        };
    });
    app.controller('loadCt',function ($scope) {
        $scope.getGotoUrl()
    })
});
