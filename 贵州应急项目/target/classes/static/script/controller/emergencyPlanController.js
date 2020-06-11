define(['app'], function (app) {

	app.controller("emerHeadCtrl", function ($rootScope, $scope, $http, $stateParams, $uibModal, mapSet, chartSet) {
		$rootScope.system = "new";
		$scope.$on("$destroy", function () {
			$rootScope.system = "";
		});
	});

	app.controller("emerPlanCtrl", function ($rootScope, $scope, $http, $stateParams, $uibModal, mapSet, chartSet) {

		// 获取列表数据
		$scope.getManageDetail = function () {
			$http({
				method: "get",
				url: $scope.page.url,
				params: {
					"pageNo": $scope.page.currentPage,
					"pageSize": $scope.page.pageSize
				}
			}).then(function (response) {
				$scope.page.list = response.data;
				console.log($scope.page.list);
				$scope.page.totalCount = response.data.totalCount;
				$scope.page.pageSize = response.data.pageSize;
			});
		};

		// 获取select地区数据
		$scope.getArea = function () {
			$http.get("basicData/listXzqy").then(function (response) {
				$scope.itAreas = response.data;
				console.log($scope.itAreas);
			});
		};

		//查询按钮功能，查询并回显
		$scope.searchInfo = function () {
			$('.loader').show();  //加载查询动态条
			localStorage.setItem('page',$scope.page.currentPage)
            $http.post("preplan/listEnterprisePreplan?" + "&pageNo=" + $scope.page.currentPage,
                {
                    "companyName":$scope.search.companyName,
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

		$scope.searchCountry = function () {
			$('.loader').show();  //加载查询动态条
            $http.post("preplan/listEnterprisePreplan?" + "&pageNo=" + $scope.page.currentPage,
                {
                    "companyName": $scope.search.companyName,
                    "level": $scope.search.level,
                    "recordStatus": $scope.search.recordStatus,
                    "xzqyId": $scope.search.xzqyId,
					'strDate':new Date($scope.search.strDate).getTime(),
					'endDate':new Date($scope.search.endDate).getTime()
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
		$scope.xzqyId = '15';
		$scope.exzqyId = '15';

		// 初始化
		function init() {
			$scope.page = {
				url: "preplan/listEnterprisePreplan",
				totalCount: 10,
				currentPage: localStorage.getItem('page')||1,
				pageSize: 1,
				list: []
			};
			$scope.search = {
				xzqyId: '-1',
				level: '-1',
				recordStatus: '-1',
				strDate:new Date().getFullYear()+'/01/01',
				endDate:new Date().getFullYear()+1+'/01/01',
				companyName: ''
			};
			$scope.searchInfo();
			$scope.getArea();
		}

		// 调用初始化
		init();
	});
	app.controller('riskFileUploadCtrl',['$rootScope','$scope', '$http','$stateParams', '$uibModalInstance', '$timeout', function ($rootScope,$scope, $http,$stateParams, $uibModalInstance,$timeout,op, select) {
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
			$uibModalInstance.close();
		};
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
	app.controller("emerDetailCtrl", function ($rootScope, $scope, $http, $stateParams, mapSet, chartSet) {

		console.log($stateParams.ID);
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
				$scope.page.totalCount = response.data.totalCount;
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
        var fjList = ['应急综合预案','应急专项预案','应急现场处置预案','应急预案备案表','应急预案编制说明','环境风险评估报告',
            '环境应急资源调查报告','环境应急预案评审意见','其他']
        $scope.fjOption = {
            tooltip: {
            	trigger: 'item',
				formatter:'{c}'
			},
            xAxis: [{
                type: 'category',
                data: [],
                axisTick: {show: false},
                axisLine: {
                    lineStyle: {color: '#00a3fe'}
                },
                axisLabel: {color: '#fcolor'},
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                            formatter: function (params) {
								console.log(params)
                            }　　　//这是关键，在需要的地方加上就行了
                        }
                    }
                },
                data:[]
            }],
            yAxis: [{
                type: 'value',
				name:'企业数',
                splitLine: {show: false},
                axisTick: {show: false},
                axisLine: {
                    lineStyle: {color: '#00a3fe'}
                },
                axisLabel: {color: '#fff'},
                nameTextStyle: {
                    color: '#fff',
                    fontSize: 16
                },
                minInterval: 1
            }],
            series: [{
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
                barWidth:40
            }]
        }
        function getStatics(){
            $http.post('preplan/getfjStatistics',{xzqyId:$rootScope.userList.xzqyId}).then(function (data) {
                console.log(data.data)
                var arr = []
                fjList.forEach(function (item,index) {
                    $scope.fjOption.xAxis.data=[]
                    data.data.forEach(function (s) {
                        if(s.type == index+1){
                            arr.push({
                                name:item,
                                value:s.typeCount
                            })
                            $scope.fjOption.xAxis[0].data.push(item)
                        }
                    })
                })
                $scope.fjOption.series[0].data = arr
            })
        }
        getStatics()
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
						left: 40,
						bottom: 30,
						right: 20,
						top: 50
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
