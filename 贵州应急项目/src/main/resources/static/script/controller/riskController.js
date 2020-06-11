define(['app', 'mapSet', 'angularCgsUtil', 'fileUpload', 'sucHelpers', 'printw'], function (app) {
    // app.useModule('angularFileUpload');
    app.controller("riskCtrl", function ($scope, $http, mapSet) {
        /*$scope.risk.gzLayer.style.fill={
            color:'rgba(0,0,0,0)'
        }*/
    });
    app.controller("riskSourceCtrl", function ($rootScope, $scope, $http, $filter, mapSet, olHelpers, chartSet,$stateParams) {
        $scope.risk.state = true;
        $scope.mapShow = true
        /*序号  行政区划（市州）  行政区划（区县）  企业名称  风险级别  行业类别  风险源类型  风险物质  备案状态  应急物资  应急设施  应急演练*/
        $scope.riskPage = {
            no:1,
            size:15,
            total:10,
            city:'',
            county:null,
            riskGrade:'',
            keyword:'',//企业名
            list:[],
            cities:[],
            counties:[],
            grade:['重大','较大','一般'],
            changeCity:_getCounties
        }
        //切换市州获取对应区县列表
        function _getCounties(){
            $http.get('basicData/listXzqy?xzqyId='+$scope.riskPage.city).then(function (res) {
                if($scope.riskPage.city!=1&&$scope.riskPage.city!=null&&$scope.riskPage.city!=''){
                    setTimeout(function () {
                        $scope.riskPage.counties = res.data
                        $scope.$apply()
                    },0)
                }else {
                    $scope.riskPage.county = null
                    $scope.riskPage.cities = res.data
                }
            })
        }
        _getCounties()
        $scope.changeToList = function () {
            $scope.mapShow = false
            var param = {
                pageNo:$scope.riskPage.no,
                pageSize:$scope.riskPage.size,
                riskGrade:$scope.riskPage.riskGrade,
                xzqyId:$scope.riskPage.county||$scope.riskPage.city||'',
                keyword:$scope.riskPage.keyword
            }
            $http.get('riskSource/listRiskSoucePage',{params:param}).then(function (res) {
                $scope.riskPage.list = res.data.dataList
                $scope.riskPage.total = res.data.totalCount
            })
        }
        //$scope.changeToList()
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
        $scope.print = function () {
			var LODOP = getLodop();
			LODOP.PRINT_INIT("打印表格");
			LODOP.SET_PRINT_STYLE("FontSize", 15);
			LODOP.SET_PRINT_PAGESIZE(1);
			var a = ".detail {width: 1000px; margin: 25px auto;text-align: center;}";
			var style = "<style>" + document.getElementById("style").innerHTML + "</style>";
			var htm ="<body>" + style + document.getElementById("content").innerHTML + "</body>";
			LODOP.ADD_PRINT_HTM(20, 25, 750, 1200, htm);
			LODOP.PREVIEW();
		};
        // 关闭风险源详细信息
        $scope.closeRisk = function (type) {
            $scope.risk.sourceInfo.company = false;
            $rootScope.$emit('riskSendscrub', 'false');
        }

        //切换企业 / 产品信息
        $scope.messageType = 'company';
        $scope.selectMessage = function (type) {
            $scope.messageType = type;
        }
        //切换应急物资
        $scope.materialType = 'storage';
        $scope.selectMaterial = function (type) {
            $scope.materialType = type;
        }
        //切换应急人员
        $scope.peopleType = 'people';
        $scope.selectPeople = function (type) {
            $scope.peopleType = type;
        }
        /* tbody高度*/
        $scope.$on('sendTbodyh', function (e, data) {
            $scope.tbodyh = data;
        })
        $scope.$on("$destroy", function () {
            $scope.risk.popOverlay.visible = false;
            $scope.risk.sourceInfo.company = false;
            $scope.districts.forEach(function (obj) {
                obj.active = false;
            })
            $scope.waterSource.forEach(function (obj) {
                obj.active = false;
            })
            $scope.natural.forEach(function (obj) {
                obj.active = false;
            })
        });
        $scope.$on('sendType', function (e, data) {
            $scope.messageType = data;
        })
        $scope.searchSoure = function (name, flag) {
            $scope.riskSource.sourceCompanies = [];
            //查询风险源列表
            $http.get("riskSource/listRiskSouce", {
                params: {
                    keyword: name
                }
            }).then(function (res) {
                var data = res.data;
                $scope.riskSource.sourceCompanies = angular.copy(data);
                //查询风险源点位
                mapSet.getRisk().then(function (data) {
                    $scope.risk.markers = data;
                })
            })
        }

        function init() {
            $scope.risk.sourceInfo.overview = false;
            $scope.status = {
                isAreaOpen: true,
                isWaterOpen: false,
                isNaturalOpen: false
            };
            $scope.riskSource = {
                navShow: false,
                introShow: false,
                searchShow: $stateParams.search=='true'?true:false,
                comSearch: "",
                recentInput: [""],
                sourceCompanies: [],
                rankBar: chartSet.setRankBar(),
                rankPie: chartSet.setRiskPie()
            }
            console.log($scope.riskSource.searchShow)
            $scope.risk.heatMap = true;
            $scope.olMap.center = {
                lat: 26.64227,
                lon: 106.667045,
                zoom: 8
            }
            $scope.searchSoure("", 1);
            $http.get("riskSource/numberRanking").then(function (res) {
            /*$scope.risk.gzLayer.loadEnd = function (oSource) {
                if (!oSource) {
                    return;
                }
                var features = oSource.getFeatures();
                    //$rootScope.fxqy=res.data;
                    var data = res.data;
                    var riskColorLevel = ["red", "#2DA439", "#fc0", "#f00"];
                    var riskNumLevel = [1, 20, 60];
                    features.forEach(function (f) {
                        var name = f.get("name");
                        data.forEach(function (item, index) {
                            if (name == item.NAME) {
                                var num = item.NUM;
                                riskNumLevel.forEach(function (n, index) {
                                    if (num >= n) {
                                        color = riskColorLevel[index + 1];
                                    }
                                })
                                f.setStyle(olHelpers.createStyle({
                                    stroke: {
                                        width: 2,
                                        color: "FFA500"
                                    }
                                }))
                            }
                        });
                    })
                    data.forEach(function (item, index) {
                        $scope.risk.topDistricts.push({
                            lat: item.LATITUDE,
                            lon: item.LONGITUDE,
                            projection: "EPSG:4326",
                            overLabel: { //悬浮显示的信息
                                id: item.XZQYID,
                                message: '<div style="white-space:nowrap;min-width:100px">'+item.NAME+'</div>',
                                classNm: "featureOver",
                                placement: "right"
                            },
                            style: {
                                zIndex: index + 1,
                                image: {
                                    icon: {
                                        anchor: [0.5, 1],
                                        color: "#FF5722",
                                        src: 'images/locate.png'
                                    }
                                },
                                text: {
                                    text: item.NUM+'',
                                    offsetX: 1,
                                    offsetY: -22,
                                    font: '500 16px',
                                    fill: {
                                        color: "white"
                                    }
                                }
                            }
                        })
                    })
                    //风险源数量排名柱状图
                    $scope.riskSource.rankBar.yAxis.data = [];
                    $scope.riskSource.rankBar.series[0].data = [];
                    data.forEach(function (item) {
                        $scope.riskSource.rankBar.yAxis.data.push(item.NAME);
                        $scope.riskSource.rankBar.series[0].data.push(item.NUM);
                    });
            }*/
            });

            //显示风险源点位
            mapSet.getRisk().then(function (data) {
                $scope.risk.markers = data;
            })

            //风险源统计
            $http.get("riskSource/riskgradeRanking").then(function (res) {
                console.log(res);
                var data = res.data;
                $scope.riskSource.rankPie.legend.data = [];
                $scope.riskSource.rankPie.series[0].data = [];
                data.reverse().forEach(function (item) {
                    $scope.riskSource.rankPie.legend.data.push(item.RISKGRADE + "风险源");
                    $scope.riskSource.rankPie.series[0].data.push({
                        value: item.NUM,
                        name: item.RISKGRADE + "风险源"
                    });
                });
            })
        }
        init();

        //左侧菜单切换
        $scope.toggleOpen = function (index) {
            if (index == 0) {
                $scope.risk.heatMap = true;
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
            $scope.risk.sourceInfo.overview = false;
            if (index == 0) {
                $scope.riskSource.navShow = !$scope.riskSource.navShow;
                $scope.riskSource.introShow = false;
                $scope.riskSource.searchShow = false;
            } else if (index == 1) {
                $scope.riskSource.introShow = !$scope.riskSource.introShow;
                $scope.riskSource.navShow = false;
                $scope.riskSource.searchShow = false;
            } else {
                $scope.riskSource.searchShow = !$scope.riskSource.searchShow;
                $scope.riskSource.navShow = false;
                $scope.riskSource.introShow = false;
            }
        }

        //风险源检索点击定位
        $scope.locateSource = function (item) {
            if(item.LATITUDE!=null&&item.LONGITUDE!=null){
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
    });
    app.controller("riskCheckCtrl", function ($scope, $http, mapSet, $uibModal) {
        $scope.getTaskWarning = function () {
            $http.get("/screening/taskWarning").then(function (response) {
                $scope.taskWarnings = response.data;
                console.log(response)
            })
        }
        $scope.getTaskWarningDetail = function (item) {
            $scope.warningSelect = item;
            $http.get("/screening/queryTaskDetails?taskId=" + item.TASKID).then(function (response) {
                $scope.warningSelect.detail = response.data;
                console.log(response);
            })
        }

        $scope.getTaskParameter = function () {
            $http.get("/screening/taskParameter?name=" + $scope.taskDispatch.name).then(function (responsefornum) {
                $http.get("/screening/taskParameter?name=" + $scope.taskDispatch.name + "&pageNo=1&pageSize=" + responsefornum.data.totalCount).then(function (response) {
                    $scope.taskParameters = response.data.dataList;
                    console.log(response)
                })
            })
        }

        $scope.getTaskParameterParts = function (item) {
            if (!item.open) {
                return;
            }
            $http.get("/screening/queryTaskDetails?taskId=" + item.TASKID).then(function (response) {
                item.parts = response.data;
                console.log(response);
            })
        }

        $scope.downloadFile = function (name) {
            $http.get("/screening/downLoadFile?fileName=" + name).then(function (response) {

                console.log(response);
            })
        }

        $scope.addUtilOpen = function () {
            var templateUrl = 'partials/pop/addUtil.html';
            var modalInstance = $uibModal.open({
                templateUrl: templateUrl,
                controller: 'addUtilCtrl',
                //                size: 'md',
                resolve: {
                    infoitem: function () {
                        return angular.copy($scope.utilCheckedList);
                    }
                }
            });
            modalInstance.result.then(function (backdata) {
                $scope.utilCheckedList = backdata;
                console.log('backdata:', backdata)
            })
        }
        $scope.deleteUtil = function (index) {
            $scope.utilCheckedList.splice(index, 1);
        }
        $scope.restartUtil = function (index) {
            $scope.taskDispatch = {
                name: ''
            };
            $scope.fileList = [];
            $scope.utilCheckedList = [];
        }

        $scope.fileList = []
        var fileget = document.getElementById("filebox");
        var fileinput = document.getElementById("file");
        fileget.ondrop = function (ev) {
            ev.preventDefault();
            angular.forEach(ev.dataTransfer.files, function (file) {
                $scope.fileList.push(file);
            })
            $scope.$apply();
        }
        fileinput.onchange = function () {
            angular.forEach(fileinput.files, function (file) {
                $scope.fileList.push(file);
            })
            $scope.$apply();
        }
        $scope.upUtils = function () {
            //    		var fileObjs = document.getElementById("file").files; // js 获取文件对象
            var form = new FormData(); // FormData 对象
            angular.forEach($scope.fileList, function (fileObj) {
                form.append("file", fileObj);
            })
            console.log(form)

            var dataobj = {

            }
            dataobj.listDepartMentId = []
            angular.forEach($scope.utilCheckedList, function (utilObj, index) {
                dataobj.listDepartMentId.push(utilObj.departMentId)
            })
            dataobj.listDepartMentId = dataobj.listDepartMentId.join(",")
            dataobj.taskName = $scope.taskDispatch.name ? $scope.taskDispatch.name : '';
            dataobj.endTime = $scope.taskDispatch.deadline ? $scope.taskDispatch.deadline : '';
            //    		dataobj.endTime=new Date($scope.taskDispatch.deadline.substr(0,4),parseInt($scope.taskDispatch.deadline.substr(5,2))-1+'',$scope.taskDispatch.deadline.substr(8,2)).valueOf()
            dataobj.taskDetails = $scope.taskDispatch.desc ? $scope.taskDispatch.desc : '';

            $http({
                method: 'POST',
                url: "/screening/distributed?listDepartMentId=" + dataobj.listDepartMentId + "&taskName=" + dataobj.taskName + "&endTimeString=" + dataobj.endTime + "&taskDetails=" + dataobj.taskDetails,
                data: form,
                headers: {
                    'Content-Type': undefined
                },
            }).then(function (response) {
                alert(response.data.msg);
                console.log(response);
            })
            //   		     $http({
            //	    	    method: 'POST',
            //	    	    url: "/screening/updateTest?listDepartMentId="+dataobj.listDepartMentId+"&taskName="+dataobj.taskName+"&endTimeString="+dataobj.endTime+"&taskDetails="+dataobj.taskDetails,
            //	    	    data:form,
            //	    	    headers:{"Content-Type":"multipart/form-data"}
            //                headers: {'Content-Type': undefined},
            //    	     }).then(function(response){
            //   		    	alert(response.data.msg);
            //   		    	console.log(response);
            //   		    })
        }

        function init() {
            $scope.riskCheck = {
                tabActive: 0
            }
            $scope.utilCheckedList = []
            $scope.taskDispatch = {
                name: ''
            };
            $scope.taskBooks = [{
                name: "测试测试测",
                parts: []
    		}, {
                name: "测试测试测",
                parts: []
    		}]
            $scope.warningSelect = null;
            $scope.getTaskWarning();
            $scope.getTaskParameter();
        }
        init();

        $scope.toggleTab = function (index) {
            $scope.taskDispatch = {
                name: ''
            };
            $scope.fileList = [];
            $scope.utilCheckedList = [];
            $scope.riskCheck.tabActive = index;
        }

    }).controller("addUtilCtrl", function ($scope, $uibModalInstance, $http, infoitem) {
        $http.get("/screening/queryUtilDetails").then(function (response) {
            $scope.utilList = response.data;
            $scope.utilList.forEach(function (ulitem) {
                ulitem.checked = false;
                infoitem.forEach(function (ifitem) {
                    if (ulitem.departMentId == ifitem.departMentId) {
                        ulitem.checked = true;
                    }
                });
            });
            console.log(response);
        })
        $scope.addOk = function () {
            var backList = [];
            $scope.utilList.forEach(function (ulitem) {
                if (ulitem.checked == true) {
                    backList.push(ulitem);
                }
            });
            $uibModalInstance.close(backList);
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });

});
