define(['app'], function (app) {

	app.controller("emerHeadCtrl", function ($rootScope, $scope, $http, $stateParams, $uibModal, mapSet, chartSet) {
		$rootScope.system = "new";
		$scope.$on("$destroy", function () {
			$rootScope.system = "";
		});
	});

	app.controller("emerPlanCtrl", function ($rootScope, $scope, $http, $stateParams, $uibModal) {
		$scope.editTime = function(item,type){
            var opts = {
                templateUrl:"partials/pop/changeTime.html",
                controller:"changeTime",
                size:"md",
                resolve:{
                    body:function(){
                        return {
                            info:item,
                            oparate:type
                        }
                    }
                }
            }
            var modal = $uibModal.open(opts);
            var resolve = function(){
                $scope.searchInfo();
            }
            modal.result.then(resolve);
		}
		// 获取select地区数据
		$scope.getArea = function () {
			$http.get("basicData/listXzqy").then(function (response) {
				$scope.itAreas = response.data;
				console.log($scope.itAreas);
			});
		};

		//搜索按钮功能，搜索并回显
		$scope.searchInfo = function () {
			$('.loader').show();  //加载查询动态条
            //localStorage.setItem('page',$scope.page.currentPage)
            $http.post("preplan/listEnterprisePreplan?" + "&pageNo=" + $scope.page.currentPage,
                {
                    "companyName": $scope.search.companyName,
                    "level": $scope.search.level,
                    "recordStatus": $scope.search.recordStatus,
                    "xzqyId": $scope.search.xzqyId
                }
            ).then(function (data) {
				$('.loader').hide();
				$scope.page.list = data.data;
				$scope.page.totalCount = data.data.totalCount;
				$scope.page.pageSize = data.data.pageSize;
            });
		};
		//预案清单导入
		$scope.riskfileEntry = function () {
			var body
			var modalInstance = $uibModal.open({
				templateUrl: "partials/pop/riskFileUpload.html",
				controller: "riskFileUploadCtrl",
				backdrop: 'static',
				size: 'moniPop',
				resolve: {
					body :{}
				}
			});
			modalInstance.result.then(function() {
				$scope.searchInfo();
			})
		};
		$scope.xzqyId = $rootScope.userList.xzqyId;
		$scope.exzqyId = '15';

		// 初始化
		function init() {
			$scope.page = {
				url: "preplan/listEnterprisePreplan",
				totalCount: 10,
				currentPage: 1,
				pageSize: 1,
				list: []
			};
			$scope.search = {
				xzqyId: $rootScope.userList.xzqyId,
				level: '-1',
				recordStatus: '-1',
				strDate:new Date().getFullYear()+'/01/01',
				endDate:new Date().getFullYear()+1+'/01/01',
				companyName: ''
			};
			$scope.getArea();
			$scope.searchInfo();
		}

		// 调用初始化
		init();
	});
	app.controller('riskFileUploadCtrl',['$rootScope','$scope', '$http','$stateParams','body', '$uibModalInstance', '$timeout', function ($rootScope,$scope, $http,$stateParams,body, $uibModalInstance,$timeout,op, select) {
		$scope.riskfileUpload = function () {
			var fd = new FormData();
			fd.append("file", document.querySelector('input[type=file]').files[0]);
			$.ajax({
				type: "POST",
				url: "yaInfos/excel/import",
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
				},
				success: function(){
					$scope.cancel()
				}
			});
			function onprogress(evt) {}
		};
		$scope.cancel = function () {
			$uibModalInstance.close()
		}
		function init() {
			$scope.modal = {
				fileName:'点击选择文件',
				getenterFile:function(file){
					$timeout(function (){
						$scope.modal.fileName = file.name;
					})
				}
			}
		}
		init()
	}]);
	app.controller('changeTime',function ($scope,$http,$rootScope,$uibModalInstance,body) {
		$scope.company = body.info;
        $scope.company.LEVEL = $scope.company.LEVEL.toString();
		if(body.oparate == 1){
			$scope.operate = 1
		}else if(body.oparate == 2){
            $scope.operate = 2
		}else if(body.oparate == 3){
            $scope.operate = 3
		}

		$scope.commitTime = function () {
            $scope.company.RECORDTIME = new Date($scope.company.RECORDTIME).getTime();
            $scope.company.DOCUMENTYEAR = new Date($scope.company.DOCUMENTYEAR).getTime();
            var param = {
                "companyId": $scope.company.COMPANYID,
                "documentYear": $scope.company.DOCUMENTYEAR,
                "id": $scope.company.ID,
                "level": $scope.company.LEVEL,
                "preplanTel": $scope.company.PREPLANTEL,
                "recordStatus": $scope.company.RECORDSTATUS,
                "recordtime": $scope.company.RECORDTIME,
                "underSigned": $scope.company.UNDERSIGNED
            }
            $http.post('preplan/saveOrUpdatePreplan',param).then(function () {
				alert('修改成功！')
                $uibModalInstance.close(true)
            })
        }
		$scope.cancel = function () {
            $uibModalInstance.close(true)
        }
    })
	app.controller("emerDetailCtrl", function ($rootScope, $scope, $http, $stateParams, mapSet, chartSet) {

		console.log($stateParams.ID)
		// 获取文件数据
		$scope.getManageDetail = function () {
			$http({
				method: "get",
				url: $scope.page.url,
				params: {
					"pageNo": $scope.page.currentPage,
					"pageSize": $scope.page.pageSize,
					"planId": $stateParams.ID
				}
			}).then(function (response) {
				$scope.page.list = response.data;
				$scope.page.total = response.data.totalCount;
				$scope.page.pageSize = response.data.pageSize;
				$scope.page.list.dataList.forEach(function (item) {
          item.URLS = "preplan/downPlanAttachment?attachmentId=" + item.ID;
        });
			});
		};

		$scope.sss = String($stateParams.RECORDSTATUS);

		// 格式化SIZE
		$scope.input = function (input) {
			return input = (input / (1024 * 1024)).toFixed(2) + "Mb";
		};

		// 初始化
		function init() {
			$scope.page = {
				url: "preplan/listAttachmentByPlan",
				totalCount: 10,
				currentPage: 1,
				pageSize: 10,
				list: []
			};
			$scope.COMPANYNAME = $stateParams.COMPANYNAME;
			$scope.detail = {};
			$scope.company = {
				COMPANYNAME: $stateParams.COMPANYNAME,
				RECORDSTATUS: $stateParams.RECORDSTATUS,
				RECORDTIME: $stateParams.RECORDTIME,
				LEVEL: $stateParams.LEVEL,
				UNDERSIGNED: $stateParams.UNDERSIGNED
			};
			$scope.getManageDetail();
		}
		init();
	});

	app.controller("emerStatisticsCtrl", function ($rootScope, $scope, $http, $stateParams, mapSet, chartSet) {

		var getStatistics = function () {
			$http.get("preplan/countPreplan").then(function (data) {
				$scope.items = data.data;
				var xzqyNameList = [];
				var recordedList = [];
				var notOnRecordList = [];
				var expiredList = [];
				var aboutToExpireList = [];
				data.data.forEach(function (item) {
					xzqyNameList.push(item.xzqyName);
					recordedList.push(item.recorded);
					notOnRecordList.push(item.notOnRecord);
					expiredList.push(item.expired);
					aboutToExpireList.push(item.aboutToExpire);
				});
				$scope.totalChart.xAxis[0].data = xzqyNameList;
				$scope.totalChart.series[0].data = recordedList;
				$scope.totalChart.series[1].data = notOnRecordList;
				$scope.totalChart.series[2].data = expiredList;
				$scope.totalChart.series[3].data = aboutToExpireList;
			});
		};

		function init() {
			$scope.totalChart = {
				color: ['#13860c', '#ccc', '#ff3b31', '#ffa551'],
				tooltip: {
						trigger: 'axis',
				},
				legend: {
					textStyle: {
						color: '#fff'
				}
				},
				grid: {
						show: false,
						bottom: 30,
						right: 'center',
						top: 80,
						width: '30%'
				},
				xAxis: [{
						type: 'category',
						data: [],
						axisTick: {
								show: false
						},
						axisLine: {
								lineStyle: {
										color: '#00a3fe'
								}
						},
						axisLabel: {
								color: '#fcolor'
						}
				}],
				yAxis: [{
						name: '个',
						type: 'value',
						splitLine: {
								show: false
						},
						axisTick: {
								show: false
						},
						axisLine: {
								lineStyle: {
										color: '#00a3fe'
								}
						},
						axisLabel: {
								color: '#fff'
						},
						nameTextStyle: {
								color: '#fff',
								fontSize: 16
						},
						minInterval: 1
				}],
				series: [{
						name: '已备案',
						type: 'bar',
						data: []
				},
						{
								name: '未备案',
								type: 'bar',
								data: []
						},
						{
								name: '备案超期',
								type: 'bar',
								data: []
						},
						{
								name: '即将到期',
								type: 'bar',
								data: []
						}
				]
			};
			getStatistics();
      $scope.time = new Date();
		}
		init();
	});

});
