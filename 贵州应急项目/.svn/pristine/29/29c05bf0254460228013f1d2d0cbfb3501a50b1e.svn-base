define(['app'], function (app) {

	app.controller("emerHeadCtrl", function ($rootScope, $scope, $http, $stateParams, $uibModal, mapSet, chartSet) {
		$rootScope.system = "new";
		$scope.$on("$destroy", function () {
			$rootScope.system = "";
		});
	});

	app.controller("emerPlanCtrl", function ($rootScope, $scope, $http, $stateParams, $uibModal, mapSet, chartSet,$timeout) {
		//查询按钮功能，查询并回显，未备案
		$scope.searchUnauditedInfo = function () {
			$('.loader').show();  //加载查询动态条
			$http.get("preplan/audit/preplan?companyId="+$scope.search.companyId).then(function (req) {
				$('.loader').hide();
				$scope.page.unlist = req.data;
			});
		};
		//预案保存、修改
		$scope.saveEmergency = function(){
			$scope.companyInfo.hjRiskSubstances = $scope.emergancy.company.FXWZ.concat($scope.riskFactorsDelete);
			$scope.companyInfo.productInfos = $scope.emergancy.company.FXY.productInfos.concat($scope.productInfosDelete);
			$scope.companyInfo.pkinfos = $scope.emergancy.company.FXYS.pkinfos.concat($scope.pkinfosDelete);
			delete $scope.emergancy.company.FXY.productInfos;
			$scope.companyInfo.enterpriseInformation = $scope.emergancy.company.FXY;
			delete $scope.emergancy.company.FXYS.pkinfos;
			$scope.companyInfo.riskFactors = $scope.emergancy.company.FXYS;
			if($stateParams.opType == 'edit'){
				$scope.companyInfo.enterprisePreplan =$scope.emergancy.company.YAINFOS;
				$scope.companyInfo.enterprisePreplan.babh = $scope.emergancy.company.FXYS.beiAnNum;
				$scope.companyInfo.enterprisePreplan.badw = $scope.emergancy.company.FXYS.unit;
				$scope.companyInfo.enterprisePreplan.recordtime = $scope.emergancy.company.FXYS.time;
				$scope.companyInfo.enterprisePreplan.level = $scope.emergancy.company.FXY.riskGrade=='一般'?'1':$scope.emergancy.company.FXY.riskGrade=='较大'?'2':$scope.emergancy.company.FXY.riskGrade=='重大'?'3':'';
					$http.post('yaInfos/update/preplan',$scope.companyInfo)
					.then(function (req) {
						alert('修改成功！')
						$scope.emergancy.company.id = req.data.id;
						$scope.ID = req.data.id;
					})
			}else{
				$scope.companyInfo.enterprisePreplan = {"id":$scope.emergancy.company.FXY.yaid==undefined?'':$scope.emergancy.company.FXY.yaid,"babh":$scope.emergancy.company.FXYS.beiAnNum,"badw":$scope.emergancy.company.FXYS.unit,"recordtime":$scope.emergancy.company.FXYS.time,"level":$scope.emergancy.company.FXY.riskGrade=='一般'?'1':$scope.emergancy.company.FXY.riskGrade=='较大'?'2':$scope.emergancy.company.FXY.riskGrade=='重大'?'3':''};
				$http.post('yaInfos/add/preplan',$scope.companyInfo)
					.then(function (req) {
						alert('新增成功！')
						$scope.emergancy.company.id = req.data.id;
						$scope.ID = req.data.id;
					})
			}

		}
		//查询按钮功能，查询并回显，已备案
		$scope.searchAuditedInfo = function () {
			$('.loader').show();  //加载查询动态条
			var param = {
				// companyId : $scope.search.companyId,
				companyName : $rootScope.userList.companyName,
				notInRecord : 1
			}
			$http.post("preplan/listEnterprisePreplan",{
				// "param": param,
				"companyName": $rootScope.userList.companyName,
				"level":-1,
				"recordStatus" : 1,
				"xzqyId" : -1
			}).then(function (req) {
				$('.loader').hide();
				$scope.page.list = req.data.dataList;
			});
		};
		// 获取文件数据
		$scope.getFileDetail = function () {
			$http({
				method: "get",
				url: $scope.file.url + "?planId=" + $scope.ID,
				params: {
					"pageNo": $scope.file.currentPage,
					"pageSize": $scope.file.pageSize
				}
			}).then(function (response) {
				$scope.file.list.dataList = response.data.dataList;
				$scope.file.totalCount = response.data.totalCount;
				$scope.file.pageSize = response.data.pageSize;
				$scope.file.list.dataList.forEach(function (item) {
					item.URLS = "preplan/downPlanAttachment?attachmentId=" + item.ID;
				});
			});
		};
		//删除按钮
		$scope.deleteTask = function (ID) {
			$("#haha").fadeIn(200);
			$('.tasks-alert').fadeIn(300);
			$scope.textContent = '确定删除吗?删除记录不可恢复！';
			$scope.deleteId = ID;
		};
		//删除按钮--确认操作
		$scope.yesAlert = function () {
			$http({
				url: 'preplan/deletePlanAttachment?attachmentId=' + $scope.deleteId,
				method: 'GET',
				transformResponse: function (data) {
					return data;
				}
			}).then(function () {
				$('.tasks-alert').fadeOut(200);
			}).then(function () {
				$('.tasks-alerts').fadeIn(300);
				$scope.getFileDetail();
			});
		};
		//删除按钮--取消操作
		$scope.noAlert = function (text) {
			$("#haha").fadeOut(200);
			$('.tasks-alert').fadeOut(300);
		};
		//删除按钮
		$scope.sureAlert = function () {
			$("#haha").fadeOut(200);
			$(".task-alert").fadeOut(300);
			$('.tasks-alerts').hide();
		};
		// 格式化SIZE
		$scope.input = function (input) {
			return input = (input / (1024 * 1024)).toFixed(2) + "Mb";
		};
		// 初始化
		function init() {
			$scope.ID = $stateParams.id;
			$scope.page = {
				type:$stateParams.opType,
				index:$stateParams.index,
				totalCount: 10,
				currentPage: 1,
				pageSize: 10,
				unlist: [],
				list : []
			};
			$scope.search = {
				emerStatus: '0',
				companyId : encodeURIComponent($rootScope.userList.companyId)
			};
			$scope.file = {
				url: "preplan/listAttachmentByPlan",
				totalCount: 10,
				currentPage: 1,
				pageSize: 10,
				list: []
			};
			$scope.companyInfo = {};
			$scope.pkinfosDelete = [];
			$scope.productInfosDelete = [];
			$scope.riskFactorsDelete = [];
			$scope.searchUnauditedInfo();
			$scope.searchAuditedInfo();
			// $scope.getEmergancyInfo();
		}
		$scope.detail ={id:$stateParams.id,RECORDTIME:$stateParams.RECORDTIME,'COMPANYNAME':$stateParams.COMPANYNAME,RECORDSTATUS:$stateParams.RECORDSTATUS,RISKGRADE:$stateParams.RISKGRADE,PREPLANTEL:$stateParams.PREPLANTEL,UNDERSIGNED:$stateParams.UNDERSIGNED}
		$scope.companyName = $rootScope.userList.companyName;
		$scope.emergancy = {
			company : {}
		}
		//初始化预案新增页面
		$scope.getEmergancyInfo=function () {
			$http.get("yaInfos/get/preplan/" + encodeURIComponent($rootScope.userList.companyId)).then(function (req) {
				$scope.emergancy.company = req.data;
			})
		}
		//初始化预案修改页面
		$scope.getDetailEmergancyInfo=function () {
			$http.get("yaInfos/query/preplan?companyId=" + encodeURIComponent($rootScope.userList.companyId)+"&yaid="+$stateParams.id).then(function (req) {
				$scope.emergancy.company = req.data;
			})
		}
		//动态添加产品信息
		$scope.addproductInfosDiv = function () {
			var Infos = {
				companyId: $rootScope.userList.companyId,
				id: '',
				name: '',
				number: ''
			};
			$scope.emergancy.company.FXY.productInfos.push(Infos);
		}
		//动态删除产品信息
		$scope.removeproductInfosDiv = function(index,item){
			$scope.emergancy.company.FXY.productInfos.splice(index, 1);
			$scope.productInfosDelete.push({id:item.id});
		}
		//动态添加排污口信息
		$scope.addpkinfosDiv = function () {
			var Infos = {
				companyId: $rootScope.userList.companyId,
				id: '',
				jd: '',
				wd: '',
				snst : '',
				snstjl : ''
			};
			$scope.emergancy.company.FXYS.pkinfos.push(Infos);
		}
		//动态删除排污口信息
		$scope.removepkinfosDiv = function(index,item){
			$scope.emergancy.company.FXYS.pkinfos.splice(index, 1);
			$scope.pkinfosDelete.push({uuid:item.uuid});
		}
		//动态添加风险物质信息
		$scope.addrisksubstancesDiv = function () {
			var Infos = {
				companyId: $rootScope.userList.companyId,
				name: '',
				sl: ''
			};
			$scope.emergancy.company.FXWZ.push(Infos);
		}
		//动态删除风险物质信息
		$scope.removerisksubstancesDiv = function(index,item){
			$scope.emergancy.company.FXWZ.splice(index, 1);
			$scope.riskFactorsDelete.push({hjrisksubstances_Id:item.hjrisksubstances_Id});
		}
		if($stateParams.opType == 'add'){
			$timeout(function () {
				$scope.getEmergancyInfo();
			}, 100)
		}
		if($stateParams.opType == 'edit'){
			$timeout(function () {
				$scope.getDetailEmergancyInfo();
				$scope.getFileDetail();
			}, 100)
		}
		if($stateParams.opType == 'detail'){
			$timeout(function () {
                $scope.getDetailEmergancyInfo();
				$scope.getFileDetail();
			}, 100)
		}
		// 调用初始化
		init();
	});

	app.controller('emerfileCtrl',function ($scope,$http,$rootScope,$stateParams) {
		$scope.type = "1";
		$scope.saveEmeFile = function () {
            console.log($stateParams.id);
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
				url: "preplan/addPlanAttachment?planId=" +$stateParams.id + "&type=" + $scope.type,
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
