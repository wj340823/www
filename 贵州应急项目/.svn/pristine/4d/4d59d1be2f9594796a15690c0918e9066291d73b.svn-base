
define(['app'], function (app) {
    //一般隐患
    app.controller("generalDCtrl", function ($rootScope, $scope, $http) {
        $scope.getManageDetail = function () {
            $http({
                method:"get",
                url: $scope.page.url,
                params: {
                    "pageNo": $scope.page.currentPage,
                    "pageSize": $scope.page.pageSize
                }
            }).then(function (response) {
                $scope.page.list = response.data;
                if($scope.page.list.dataList.length==0){$scope.noData=true}else {$scope.noData=false}
                $scope.page.total = response.data.totalCount;
                $scope.page.pageSize = response.data.pageSize;
                console.log(response.data)
            });
        };

        // 初始化
        function init () {
            $scope.page = {
                url: "hiddenDanger/listGeneral",
                total: 10,
                currentPage: 1,
                pageSize: 3,
                list: [],
                strTime:new Date().getFullYear()+'/01/01',
                endTime:new Date().getFullYear()+1+'/01/01',
            };
            $scope.getManageDetail();
        }

        // 调用初始化
        init();
    });
    //重大隐患
    app.controller("majorDCtrl", function ($rootScope, $scope, $http) {
        $scope.getManageDetail = function () {
            $scope.pageType=1;
            $http({
                method:"get",
                url: $scope.page.url,
                params: {
                    "pageNo": $scope.page.currentPage,
                }
            }).then(function (response) {
                $scope.page.list = response.data;
                $scope.page.total = response.data.totalCount;
                $scope.page.pageSize = response.data.pageSize;
                console.log(response.data)
                if($scope.page.list.dataList.length==0){
                    $scope.noData=true
                }else {
                    $scope.noData=false
                }
                for(let i in $scope.page.list.dataList){
                    $scope.line=(new Date($scope.page.list.dataList[i].deadline).getTime()-new Date().getTime())>0;
                    $scope.page.listLine.push($scope.line)
                }
                console.log($scope.page.listLine)
            });
        };
        $scope.searchMsg=function () {
            $('.loader').show();
            $scope.pageType=1;
            $http.get('hiddenDanger/listSignificant?'+'&pageNo='+$scope.page.currentPage+
                '&startTime='+(new Date($scope.page.strTime).getTime())+
                '&endTime='+(new Date($scope.page.endTime).getTime())+
                '&isRectification='+$scope.page.type+
                '&type='+2+
                '&xzqyId='+$scope.page.xzqyId+
                '&isRectification='+$scope.page.type+
                '&keywords='+encodeURIComponent($scope.page.keywords)
            )
                .then(function (req) {
                    $('.loader').hide()
                    $scope.page.list = req.data;
                    $scope.page.total = req.data.totalCount;
                    $scope.page.pageSize = req.data.pageSize;
                    console.log(req.data)
                    if($scope.page.list.dataList.length==0){
                        $scope.noData=true
                    }else {
                        $scope.noData=false
                    }
                    for(let i in $scope.page.list.dataList){
                        $scope.line=(new Date($scope.page.list.dataList[i].deadline).getTime()-new Date().getTime())>0;
                        $scope.page.listLine.push($scope.line)
                    }
                    console.log($scope.page.listLine)
                })
        }
        // 获取select地区数据
        $http.get("basicData/listXzqy").then(function (response) {
            $scope.areas = response.data;
        });
        // 初始化
        function init () {
            $scope.page = {
                url: "hiddenDanger/listSignificant",
                total: 10,
                currentPage: 1,
                pageSize: 3,
                list: [],
                listLine:[],
                strTime:new Date().getFullYear()+'/01/01',
                endTime:new Date().getFullYear()+1+'/01/01',
                type:'-1',
                xzqyId:'-1',
                keywords:''
            };
            $scope.getManageDetail();
        }

        // 调用初始化
        init();

    });
    //重大、一般隐患详情
    app.controller("majorDDCtrl", function ($rootScope, $scope, $http, $state, $parse, $stateParams) {
        $scope.getMsg = function () {
            $http.get('rest/dc/'+$rootScope.userList.access+'/HiddenDanger/'+$stateParams.id).then(function (req) {
                console.log(req);
            })
            $http.get('hiddenDanger/getRiskDetailById?'+'id='+$stateParams.id).then(
                function (req) {
                    console.log(req)
                    $scope.obj=req.data;
                    //console.log($scope.obj)
                    $scope.obj.ISRECTIFICATION= $scope.obj.ISRECTIFICATION.toString();
                })
        };

        $scope.submit=function () {
            $scope.obj1={
                address:$scope.obj.ADDRESS,
                deadline:$scope.obj.DEADLINE,
                id:$scope.obj.ID,
                hiddenDanger:$scope.obj.HIDDENDANGER,
                inventoryId:$scope.obj.INVENTORYID,
                investigated:$scope.obj.INVESTIGATED,
                isLimitRectification:$scope.obj.ISLIMITRECTIFICATION,
                isRectification:$scope.obj.ISRECTIFICATION,
                isinvestigated:$scope.obj.ISINVESTIGATED,
                level:$scope.obj.LEVEL,
                licensesToSupervise:$scope.obj.LICENSESTOSUPERVISE,
                name:$scope.obj.NAME,
                number:$scope.obj.NUMBER,
                rectificationTime:$scope.obj.RECTIFICATIONTIME,
                remark:$scope.obj.REMARK,
                responsiblePerson:$scope.obj.RESPONSIBLEPERSON,
                result:$scope.obj.RESULT,
                updatetime:(new Date()).getTime()
            }
            $('.task-alert').show()
            $scope.textContent='确定保存吗?'
        }
        $scope.sureAlert=function (text) {
            $http.post('rest/dc/'+$rootScope.userList.access+'/HiddenDanger/'+$stateParams.id,$scope.obj1)
                .then(function (req) {
                        $scope.textContent='操作成功！'
                    })
        }
        $scope.resetAlert=function (text) {
            if(text=='操作成功！'){
                window.history.back()
            }
            $('.task-alert').hide();
        }

        // 初始化
        function init () {
            $scope.getMsg()
            $scope.id=$stateParams.id;
            $scope.level=$stateParams.level;
            $scope.operate=$stateParams.operate;
        }
        // 调用初始化
        init();

    });
    //应急隐患
    app.controller("manageDCtrl", function ($rootScope, $scope, $http) {
        $scope.getManageDetail = function () {
            $scope.pageType=1;
            $http({
                method:"get",
                url: $scope.page.url,
                params: {
                    "pageNo": $scope.page.currentPage,
                    "pageSize": $scope.page.pageSize
                }
            }).then(function (response) {
                $scope.page.list = response.data;
                $scope.page.total = response.data.totalCount;
                $scope.page.pageSize = response.data.pageSize;
                console.log(response.data)
                if($scope.page.list.dataList.length==0){
                    $scope.noData=true
                }else {
                    $scope.noData=false
                }
            });
        };
        //获取行政区划
        $http.get("basicData/listXzqy").then(function (response) {
            $scope.areas = response.data;
        });
        $scope.searchMsg=function () {
            $('.loader').show();$scope.pageType=2;
            $http.get('hiddenDanger/listEmergency?'+'&pageNo='+$scope.page.currentPage+
                '&startTime='+(new Date($scope.page.strTime).getTime())+
                '&endTime='+(new Date($scope.page.endTime).getTime()+
                    '&isRectification='+$scope.page.type+
                    '&type='+1+
                    '&xzqyId='+$scope.page.xzqyId+
                    '&isRectification='+$scope.page.type+
                    '&keywords='+encodeURIComponent($scope.page.keywords)
                )
            )
                .then(function (req) {
                    $('.loader').hide()
                    $scope.page.list = req.data;
                    $scope.page.total = req.data.totalCount;
                    $scope.page.pageSize = req.data.pageSize;
                    console.log(req.data)
                    if($scope.page.list.dataList.length==0){
                        $scope.noData=true
                    }else {
                        $scope.noData=false
                    }
                })
        }
        // 初始化
        function init () {
            $scope.page = {
                url: "hiddenDanger/listEmergency",
                total: 3,
                currentPage: 1,
                pageSize: 10,
                list: [],
                strTime:new Date().getFullYear()+'/01/01',
                endTime:new Date().getFullYear()+1+'/01/01',
                type:'-1',
                xzqyId:'-1',
                keywords:''
            };
            $scope.getManageDetail();
        }

        // 调用初始化
        init();

    });
    //应急隐患详情
    app.controller("manageDDCtrl", function ($rootScope, $scope, $http, $state, $parse, $stateParams) {
        $scope.getMsg = function () {
            $http.get('hiddenDanger/getEmergencyDetailById?'+'id='+$stateParams.id).then(
                function (req) {
                    $scope.obj=req.data;
                    console.log($scope.obj);
                    if($scope.obj.ISRECTIFICATION!=null){
                        $scope.obj.ISRECTIFICATION= $scope.obj.ISRECTIFICATION.toString();
                    }

                })
        };
        $scope.submit=function () {
            $scope.obj1={
                address:$scope.obj.ADDRESS,
                deadline:$scope.obj.DEADLINE,
                id:$scope.obj.ID,
                hiddenDanger:$scope.obj.HIDDENDANGER,
                inventoryId:$scope.obj.INVENTORYID,
                investigated:$scope.obj.INVESTIGATED,
                isLimitRectification:$scope.obj.ISLIMITRECTIFICATION,
                isRectification:$scope.obj.ISRECTIFICATION,
                isinvestigated:$scope.obj.ISINVESTIGATED,
                level:$scope.obj.LEVEL,
                licensesToSupervise:$scope.obj.LICENSESTOSUPERVISE,
                name:$scope.obj.NAME,
                number:$scope.obj.NUMBER,
                rectificationTime:$scope.obj.RECTIFICATIONTIME,
                remark:$scope.obj.REMARK,
                responsiblePerson:$scope.obj.RESPONSIBLEPERSON,
                result:$scope.obj.RESULT,
                updatetime:(new Date()).getTime()
            }
            $('.task-alert').show()
            $scope.textContent='确定保存吗?'
        }
        $scope.sureAlert=function (text) {

            $http.post('rest/dc/'+$rootScope.userList.access+'/HiddenDanger/'+$stateParams.id,$scope.obj1)
                .then(function (req) {
                    $scope.textContent='操作成功！';})

        }
        $scope.resetAlert=function (text) {
            if(text=='操作成功！'){
                window.history.back()
            }
            $('.task-alert').hide();
        }
        // 获取select地区数据

        // 初始化
        function init () {
            $scope.getMsg()
            $scope.id=$stateParams.id;
            $scope.operate=$stateParams.operate;
        }
        // 调用初始化
        init();

    });
});
