define(['app', 'mapSet', 'script/controller/storeBtns'], function (app) {
    app.controller("emergencyCtrl", function ($scope, $http, mapSet, chartSet, dataSet, olHelpers,$rootScope, olData,$stateParams) {
        $scope.material.materialSearch.pollutionCtrl =$stateParams.search=='true'?true:false;
        $scope.$on("$destroy", function () {
            $scope.material.line.visible = false;
            $scope.material.line.overlay.visible = false;
            $scope.materialDetail.reserveShow = false;
            $scope.materialDetail.anaShow = false;
            $scope.materialDetail.videoShow = false;
            $scope.districts.forEach(function (obj) {
                obj.active = false;
            })
            $scope.waterSource.forEach(function (obj) {
                obj.active = false;
            })
            $scope.natural.forEach(function (obj) {
                obj.active = false;
            })
        })
        var pageSize = parseInt((angular.element(window)[0].innerHeight-440)/30);
        angular.element(window).bind('resize',function () {
            pageSize = parseInt((this.innerHeight-440)/30);
            $scope.searchMaterial()
        })
        //刷新消耗地图
        var refreshConsumeMap = function () {
            $http.get("goods/consumeLog", {
                params: {
                    startTime: $scope.material.materialChart.consumption.searchItem.start,
                    endTime: $scope.material.materialChart.consumption.searchItem.end
                }
            }).then(function (res) {
                var data = res.data;
                $scope.partMap.features.forEach(function (f) {
                    var name = f.get("name");
                    data.forEach(function (item) {
                        if (name == item.name) {
                            f.setStyle(olHelpers.createStyle({
                                fill: {
                                    color: "#BFAA34"
                                },
                                stroke: {
                                    width: 2,
                                    color: "#000"
                                }
                            }))
                        }
                    });
                })
            });
        }

        function init() {
            $scope.olMap.center = {
                lat: 26.64227,
                lon: 106.667045,
                zoom: 8
            }
            $scope.materialDetail.yjwzk = true;
            $scope.materialDetail.fxwzk = false;
            $scope.status = {
                isAreaOpen: true,
                isWaterOpen: false,
                isNaturalOpen: false
            };
            $scope.materialSpread = {
                navShow: false,
                searchShow: false,
                anaShow: false
            }
            $scope.searchItem={
                kind : '-1'
            }
            $scope.material.materialSearch.xzqyBar = chartSet.setPollutionBar();
            $scope.material.materialChart.consumption.consumBar = chartSet.setAnaBar();
            $scope.material.materialChart.watch.watchPie = chartSet.setWatchPie();
            $scope.material.materialChart.warn.bar = chartSet.setWarnBar();
            $scope.partMap = { //贵州市县地图
                gzLayer: {
                    source: {
                        type: "GeoJSON",
                        url: "guizhou.json",
                        dataType: "json",
                        loader: true,
                        style: function (feature) {
                            var colors = ['#bba137', '#f4cf30', '#dbea5d', '#FBFEE2'];
                            var index = parseInt(Math.random() * 2 + 2);
                            var style = new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    width: 2,
                                    color: "#FFA500"
                                })
                            });
                            return style;
                        }
                    },
                    zIndex: 2,
                    show:false,
                    loadEnd: function (oSource) {
                        if (!oSource) {
                            return;
                        }
                        var features = oSource.getFeatures();
                        $scope.partMap.features = features;
                        refreshConsumeMap();
                    }
                },
                center: {
                    lat: 27,
                    lon: 107.084525,
                    zoom: 6
                },
                view: {
                    rotation: 0,
                    maxZoom: 18
                },
                defaults: {
                    controls: {
                        attribution: false,
                        rotate: false,
                        zoom: false
                    },
                    interactions: {
                        mouseWheelZoom: true
                    },
                    events: {
                        map: ['singleclick'],
                        compose: ''
                    }
                },
                controls: []
            }
            $scope.partMap.districts = [];
            dataSet.getDistricts().then(function (data) {
                $scope.districts = data; //行政区域
                $scope.districts.forEach(function (d) {
                    if (d.name != "贵安新区") {
                        $scope.partMap.districts.push({
                            coord: [parseFloat(d.longitude), parseFloat(d.latitude)],
                            label: {
                                id: d.id,
                                message: '<div style="white-space:nowrap;margin-left: -20px;margin-top: -6px;">' + d.name + '</div>',
                                classNm: "placeName",
                                placement: "right",
                                stopEvent: false
                            }
                        })
                    }
                })
            })

            //地图物资库点位
            mapSet.getStore().then(function (data) {
                $scope.material.stores = data;
            })
            $scope.materialDetail.searchItem.pageNo = 1;
            $scope.materialDetail.searchItem.pageSize = 8;
            $scope.materialDetail.searchItem.totalCount = 1;
            $scope.material.materialSearch.pageNo = 1;
            $scope.material.materialSearch.pageSize = 1;
            $scope.material.materialSearch.totalCount = 1;
            $scope.material.materialSearch.searchItem.name = '';
            $scope.material.materialSearch.areas = '';
            $scope.material.materialSearch.area = ''
        }
        init();
        $scope.tabToggle = function(n){
            n==1?$scope.materialDetail.yjwzk = true:$scope.materialDetail.yjwzk = false;
            n==2?$scope.materialDetail.fxwzk = true:$scope.materialDetail.fxwzk = false;
        }
        $scope.toggleOpen = function (index) {
            if (index == 0) {
                $scope.status.isWaterOpen = false;
                $scope.status.isNaturalOpen = false;
                if (!$scope.status.isAreaOpen) {
                    $scope.status.isAreaOpen = true;
                } else {
                    $scope.olMap.center = {
                        lat: 26.64227,
                        lon: 106.667045,
                        zoom: 8
                    }
                }
            } else if (index == 1) {
                $scope.status.isAreaOpen = false;
                $scope.status.isNaturalOpen = false;
                if (!$scope.status.isWaterOpen) {
                    $scope.status.isWaterOpen = true;
                } else {
                    $scope.olMap.center = {
                        lat: 26.64227,
                        lon: 106.667045,
                        zoom: 8
                    }
                }
            } else {
                $scope.status.isAreaOpen = false;
                $scope.status.isWaterOpen = false;
                if (!$scope.status.isNaturalOpen) {
                    $scope.status.isNaturalOpen = true;
                } else {
                    $scope.olMap.center = {
                        lat: 26.64227,
                        lon: 106.667045,
                        zoom: 8
                    }
                }
            }
        }

        //右侧菜单切换
        $scope.toggleMenu = function (index) {
            if (index == 0) {
                $scope.materialSpread.navShow = !$scope.materialSpread.navShow;
                $scope.materialSpread.searchShow = false;
                $scope.materialSpread.anaShow = false;
            } else if (index == 1) {
                $scope.materialSpread.searchShow = !$scope.materialSpread.searchShow;
                $scope.materialSpread.navShow = false;
                $scope.materialSpread.anaShow = false;
            } else {
                $scope.materialSpread.anaShow = !$scope.materialSpread.anaShow;
                $scope.materialSpread.navShow = false;
                $scope.materialSpread.searchShow = false;
            }
        }

        //污染控制类
        $scope.controlType = 'table';
        $scope.controlMat = function (type) {
            $scope.controlType = type;
        }
        var protocol = window.location.protocol;
        var host = window.location.host;
        $scope.outPort = function () {
            $http.get('goods/downloadlist?'+'&name='+$scope.material.materialSearch.searchItem.name).then(
                function (res) {
                    console.log(111)
                }
            )
        }
        $scope.material.materialSearch.goods='';
        $scope.material.materialSearch.emergencySubstance='';
        $scope.materialDetail.searchItem.pageSize = 1;
        $scope.materialDetail.searchItem.totalCount = 1;
        $scope.material.materialSearch.pageSize = 1;
        $scope.material.materialSearch.totalCount = 1;
        $http.get('basicData/listXzqy').then(function (res) {
            $scope.material.materialSearch.areas = res.data
        })
        $http.get("goods/groupGoodsByXZQY", {
            params: {
                name: $scope.material.materialSearch.searchItem.name
            }
        }).then(function (res) {
            var data = res.data;
            $http.get('rest/dc/'+$rootScope.userList.access+'/Category').then(function (req) {
                $scope.kinds=req.data
            })
        })
        $scope.showPollutionChart = function () {
            $scope.searchName = $scope.material.materialSearch.searchItem.name;
            $scope.material.materialSearch.pollutionCtrl = true;
            $scope.material.materialChart.consumption.show = false;
            $scope.material.materialChart.watch.show = false;
            $scope.material.materialChart.warn.show = false;

            //            $http.get("goods/list").then(function (data) {
            //                $scope.goodsLists = data.data;
            //            })
            $http.get('basicData/listXzqy').then(function (res) {
                $scope.material.materialSearch.areas = res.data
            })
            $http.get("goods/groupGoodsByXZQY", {
                params: {
                    name: $scope.material.materialSearch.searchItem.name
                }
            }).then(function (res) {
                var data = res.data;
                $http.get('rest/dc/'+$rootScope.userList.access+'/Category').then(function (req) {
                    $scope.kinds=req.data
                })
            })
        }
        $scope.searchMaterial=function(){
            $http.get("goods/list", {
                params: {
                    name: $scope.material.materialSearch.searchItem.name,
                    category: $scope.searchItem.kind,
                    pageNo:$scope.materialDetail.searchItem.pageNo,
                    XZQY:$scope.material.materialSearch.area,
                    pageSize:pageSize,
                }
            }).then(function (res) {
                $scope.material.materialSearch.goods = res.data.dataList;
                $scope.materialDetail.searchItem.pageSize = res.data.pageSize;
                $scope.materialDetail.searchItem.totalCount = res.data.totalCount
                //console.log(res)
            });
            $http.get('riskSource/getEmergencySubstance?'+'&keywords='+
                encodeURIComponent($scope.material.materialSearch.searchItem.name)+'&pageNo='
                +$scope.material.materialSearch.pageNo+'&XZQY='+$scope.material.materialSearch.area+'&pageSize='+pageSize).then(
                function (req) {
                    //console.log($scope.material.materialSearch.pageNo)
                    $scope.material.materialSearch.emergencySubstance = req.data.dataList;
                    $scope.material.materialSearch.pageSize = req.data.pageSize;
                    $scope.material.materialSearch.totalCount = req.data.totalCount;
                    //console.log(req.data)
                }
            )
        }
        //显示企业物资库
        $scope.showriskMaterial = false;
        $scope.showEnterMaterial = function(){
            $scope.showriskMaterial = !$scope.showriskMaterial;
           $scope.risk.material=[];
           if($scope.showriskMaterial==true){
            $http.get("riskSource/listRiskSouce").then(function(res){
                var data = res.data;
                data.forEach(function(s){
                    $scope.risk.material.push({
                        id: s.COMPANYID,
                        lat: parseFloat(s.LATITUDE),
                        lon: parseFloat(s.LONGITUDE),
                        projection: "EPSG:4326",
                        info: s,
                        clickLabel: {
                            id: s.COMPANYID,
                            title: s.COMPANYNAME+'&nbsp;&nbsp;&nbsp;&nbsp;负责人:'+(s.CUSTODIAN||'无')+'&nbsp;&nbsp;&nbsp;&nbsp;联系方式:'+(s.CUSTODIANTELEPHONE||'无'),
                            url: 'partials/pop/enterStoreBtns.html',
                            classNm: "featureClick",
                            placement: "mid"
                        },
                        overLabel: { //悬浮显示的信息
                            id: s.COMPANYID,
                            message: '<div style="white-space:nowrap;min-width:100px">'+s.COMPANYNAME+'</div>',
                            classNm: "featureOver",
                            placement: "right"
                        },
                        style: {
                            image: {
                                icon: {
                                    anchor: [0.5, 0.5],
                                    opacity: 1,
                                    src: 'images/storehouse.png'
                                }
                            }
                        }
                    })
                })
            })
           }else{
            $scope.risk.material=[];
           }
        }

    });
    app.controller("orgCtrl", function ($scope,$rootScope,$http){
        $rootScope.system="new";
        $scope.$on("$destroy",function(){
            $rootScope.system="";
        });
        $http.get('basicData/listXzqy').then(function (res) {
            $scope.areas = res.data;
        })
        $http.get('basicData/listManagerCrewUnit?'+'&pageSize=1000').then(function (res) {
            $scope.units = res.data.dataList;
        })
        $scope.searchMsg=function () {
            $('.loader').show();
            $http.get('basicData/listManagerCrew?'+'&keywords='+encodeURIComponent($scope.items.keywords)
                +'&pageNo='+$scope.items.pageNo+'&xzqy='+$scope.items.xzqyId+'&unit='+encodeURIComponent($scope.items.unit))
                .then(function (req) {console.log(req.data)
                    $('.loader').hide()
                    $scope.obj=req.data.dataList;
                    $scope.items.pageSize = req.data.pageSize;
                    $scope.items.totalCount = req.data.totalCount;
                    if($scope.obj.length==0){$scope.noData=true}else {$scope.noData=false}
                })
        }
        function init() {
            $scope.items = {
                keywords:'',
                pageSize:10,
                pageNo:1,
                totalCount:10,
                unit:'',
                xzqyId:''
            }
            $scope.searchMsg()
        }

        init();
    })

    app.controller("emerExpertCtrl", function ($scope,$rootScope,$http){
        $rootScope.system="new";
        $scope.$on("$destroy",function(){
            $rootScope.system="";
        });
        $scope.searchMsg=function () {
            $('.loader').show();
            $http.get('basicData/getManagerSpecialist?'+'&name='+encodeURIComponent($scope.items.keywords)+'&pageNo='+$scope.items.pageNo)
                .then(function (req) {console.log(req.data)
                    $('.loader').hide()
                    $scope.obj=req.data.dataList;
                    $scope.items.pageSize = req.data.pageSize;
                    $scope.items.totalCount = req.data.totalCount;
                    if($scope.obj.length==0){$scope.noData=true}else {$scope.noData=false}
                })
        }
        function init() {
            $scope.items = {
                keywords:'',
                pageSize:10,
                pageNo:1,
                totalCount:10
            }
            $scope.searchMsg()
        }
        init();
    })

    app.controller("emerCaseCtrl", function ($scope,$rootScope,$http,$state,$stateParams){
        var url = '';
        $rootScope.system="new";
        $scope.$on("$destroy",function(){
            $rootScope.system="";
        });
        if($stateParams.time!=''){
            $scope.caseTime = parseInt($stateParams.time);
        }else{
            $scope.caseTime = new Date().getTime();
        }
        $scope.caseName = $stateParams.name;
        $scope.getArea = function(){
            $http.get('basicData/listXzqy').then(function (req) {
                $scope.items.areas = req.data;
            })
        }
        /*$scope.getCounties = function(){
            if($scope.items.city!=''){
                $http.get('basicData/listXzqy?'+'&xzqyId='+$scope.items.city).then(function (req) {
                    $scope.items.counties = req.data
                })
            }else {
                $scope.items.counties=''
            }
        }*/
        $scope.addMsg=function () {
            if($stateParams.id==null||$stateParams.id==''){
                $http.post('rest/dc/'+$rootScope.userList.access+'/EmergencyExample',
                    {
                        xzqyNum:$scope.caseArea,
                        time:new Date($scope.caseTime).getTime(),
                        name:$scope.caseName }).then(
                    function (req) {
                        alert('案例新增成功！')
                        $state.go(url)
                    }
                )
            }else {
                $http.post('rest/dc/'+$rootScope.userList.access+'/EmergencyExample/'+$stateParams.id,
                    {
                        xzqyNum:$scope.caseArea,
                        time:parseInt($scope.caseTime).toString().length==4?parseInt(new Date($scope.caseTime).getTime()):parseInt($scope.caseTime),
                        name:$scope.caseName }).then(
                    function (req) {
                        alert('案例修改成功！')
                        $state.go(url)
                    }
                )
            }

        }
        $scope.delCase=function(item){
            $scope.textContent='确定删除吗?';
            $('.task-alert').show()
            $scope.trId = item.ID
        }
        $scope.sureAlert = function(){
            $http.delete('rest/dc/'+$rootScope.userList.access+'/EmergencyExample/'+$scope.trId);
            $scope.textContent='操作成功！';
        }
        $scope.resetAlert = function(text){
            if(text!='确定删除吗?'){
                $scope.searchMsg();
            }
            $('.task-alert').hide()
        }

        $scope.getFile=function () {
            $http.get('emergencyExample/listAttachementByExampleId?'+'exampleId='+
                $stateParams.id+'&pageNo='+$scope.file.pageNo).then(function (req) {
                $scope.file.list=req.data.dataList;
                $scope.file.pageSize=req.data.pageSize;
                $scope.file.totalCount=req.data.totalCount;
            })
        }
        $scope.delFile=function (item) {
            $http.delete('rest/dc/'+$rootScope.userList.access+'/ExampleAttachement/'+item.ID);
            $scope.getFile()
        }
        function init() {
            $scope.items = {
                keywords:'',
                city:'',
                county:'',
                strTime:new Date().getFullYear()-3+'/'+new Date().getMonth()+'/'+new Date().getDate(),
                endTime:new Date().getFullYear()+'/'+new Date().getMonth()+'/'+new Date().getDate(),
                pageSize:10,
                pageNo:1,
                totalCount:10,
                areas:''
            }

            if($rootScope.userList.role == 'szrole'){
                //$scope.items.city = $rootScope.userList.xzqyId
                //$scope.caseArea = $rootScope.userList.xzqyId;
                url = 'cityEmerCase.emerCase'
            }else{
                //$scope.items.city = ''
                //$scope.caseArea = $stateParams.area;
                url = 'emergency.emerCase'
            }
            $scope.file = {
                id:$stateParams.id,
                name:$stateParams.name,
                time:$stateParams.time,
                area:$stateParams.area,
                pageNo:1,
                pageSize:10,
                totalCount:0,
                list:[]
            }

        }
        init();
        $scope.searchMsg=function(){
        var strTime = parseInt(new Date($scope.items.strTime).getTime())
        var endTime = parseInt(new Date($scope.items.endTime).getTime())
            $('.loader').show();
            $http.get('emergencyExample/listEmergencyExample?'+'&name='+encodeURIComponent($scope.items.keywords)
                +'&strTime='+strTime+'&endTime='+endTime+'&pageNo='
                +$scope.items.pageNo+'&xzqyNum='+$scope.items.city)
                .then(function (req) {
                $scope.obj=req.data.dataList;
                $scope.items.totalCount = req.data.totalCount;
                $scope.items.pageSize = req.data.pageSize
                $('.loader').hide();
            })
        }
        $scope.getArea();
        $scope.searchMsg();
        $scope.getFile()
    })
    app.controller('upload',function ($scope,$http,$rootScope,$stateParams) {
        $rootScope.system="new";
        $scope.$on("$destroy",function(){
            $rootScope.system="";
        });
        $scope.getType = function(){
            $http.get('rest/dc/'+$rootScope.userList.access+'/ExampleAttachementType').then(function (req) {
                $scope.type = req.data[0].id
                $scope.option = req.data;
            })
        }
        $scope.getType()
        $scope.uploadFile = function () {
            var fd = new FormData();
            var fileValue = document.querySelector('input[type=text]');
            var file = document.querySelector('input[type=file]').files[0];
            //判断文件大小
            if (file.size / 1024 > 100000) {
                $("#haha").fadeIn(200);
                $(".task-alert").fadeIn(300);
                setTimeout(function () {
                    $(".task-alert").fadeOut(200);
                    $("#haha").fadeOut(300);
                }, 2000);
                fileValue.value = "请重新选择文件！注意大小！";
                return;
            }

            fd.append("file", file);
            /**
             * 必须false才会避开jQuery对 formdata 的默认处理
             * XMLHttpRequest会对 formdata 进行正确的处理
             */
            $.ajax({
                type: "POST",
                url: "emergencyExample/addExampleAttachment?exampleId=" + $stateParams.id + "&type=" + $scope.type,
                data: fd,
                processData: false,
                //必须false才会自动加上正确的Content-Type
                contentType: false,
                xhr: function () {
                    var xhr = $.ajaxSettings.xhr();
                    if (onprogress && xhr.upload) {
                        xhr.upload.addEventListener("progress", onprogress, false);
                        return xhr;
                    }
                }
            });
            function onprogress(evt) {
                var loaded = evt.loaded; //已经上传大小情况
                var tot = evt.total; //附件总大小
                var per = Math.floor(100 * loaded / tot); //已经上传的百分比
                $("#number").html(per + "%");
                $("#son").css("width", per + "%");
                if (per == 100) {
                    $("#haha").fadeIn(200);
                    $(".tasks-alerts").fadeIn(300);
                }
            }
            $scope.closeModal1 = function () {
                $(".task-alert").fadeOut(200);
                $("#haha").fadeOut(230);
            };
            $scope.closeModal2 = function () {
                $(".tasks-alert").fadeOut(200);
                $("#haha").fadeOut(230);
            };
            $scope.closeModal3 = function () {
                $(".tasks-alerts").fadeOut(200);
                $("#haha").fadeOut(230);
            };
        }
    })
});
