define(['app'], function(app) {

    app.controller("city", function($rootScope, $scope, $http, $stateParams, $uibModal, mapSet, chartSet) {
    // 初始化
    $rootScope.system="new";
        $scope.$on("$destroy",function(){
        $rootScope.system="";
    });
    function init() {
    }
    // 调用初始化
    init();
  });
    app.controller("addEnterCtrl", function($rootScope, $scope, $http, $state,$stateParams) {
        $scope.addEnter=function(){
            $('.taskApply').hide()
            $('.addEnter').show()
        }
        $scope.delMsg = function(i){
            $scope.items.checkStatus[i]=false
        }
        $scope.getMsg = function () {
            $('.loader').show()
            $http.get("basicData/listXzqy").then(function (response) {
                $scope.areas = response.data;
                //console.log($scope.areas);
            });
            $http.get('riskSource/listRiskSouce?'+'&xzqyId='+$rootScope.userList.xzqyId+
                '&keyword='+encodeURIComponent($scope.items.keywords)).then(
                function (req) {
                    console.log(req)
                    $('.loader').hide()
                    $scope.obj = req.data;
                    $scope.obj.length==0?$scope.noData=true:$scope.noData=false;
                    for(let i in $scope.obj){
                        $scope.items.checkStatus.push(false)
                    }
                }
            )
        }
        $scope.postMsg = function(){
            $('.task-alert').show();
            $scope.list.company=[];
            for (let i in $scope.items.checkStatus){
                if($scope.items.checkStatus[i]==true){
                    $scope.list.company.push(
                        {companyId:$scope.obj[i].COMPANYID,xzqyId:$scope.obj[i].xzqyId});
                }
            }
            $scope.listEnter.companyList=$scope.list.company;
            $scope.textContent='确定派发吗?'
        }
        $scope.changeStatus=function(){
            if($scope.items.checkStatu==true){
                for (let i in $scope.items.checkStatus) {
                    $scope.items.checkStatus[i]=true
                }
            }else {
                for (let i in $scope.items.checkStatus) {
                    $scope.items.checkStatus[i]=false
                }
            }
        }
        $scope.submitMsg=function () {
            $('.taskApply').show()
            $('.addEnter').hide()
        }
        $scope.cancel=function () {
            $scope.items.checkStatu=false;
            $scope.changeStatus();
            $('.taskApply').show()
            $('.addEnter').hide()
        }
        $scope.backToList=function () {
            $state.go('city.taskManage')
        }

        $scope.sureAlert = function () {
            $http.post('emergencyTask/releaseTaskToEnterprise',$scope.listEnter).then(
                function (req) {

                }
            )
            $scope.textContent='操作成功！'
        }
        $scope.resetAlert = function (text) {
            if(text=='操作成功！'){
                $state.go('city.taskManage');
            }
            $('.task-alert').hide();
        }
        function init() {
            $scope.baseMsg={
                name:$stateParams.taskName,
                deadline:$stateParams.time,

            }
            $scope.items={
                pageNo:1,
                pageSize:1,
                xzqyId:'-1',
                keywords:'',
                checkStatu:false,
                checkStatus:[],
            }
            $scope.listEnter= {
                companyList:[],
                taskId:$stateParams.id
            }
            $scope.getMsg()

        }
        // 调用初始化
        init();
    });

    app.controller('cityMaterial',function($rootScope, $scope, $http){
        $rootScope.system="new";
            $scope.$on("$destroy",function(){
            $rootScope.system="";
        });
        function init(){
            $scope.obj={
                pageNo:1,
                pageSize:10,
                total:10,
                material:[],
                keyword:''
            }
        }
        init()
        $scope.getMsg = function(){
            $http.get('goods/list?pageNo='+$scope.obj.pageNo+'&XZQY='+$rootScope.userList.xzqyId+'&name='+$scope.obj.keyword).then(function(data){
                $scope.obj.material = data.data.dataList;
                $scope.obj.pageSize = data.data.pageSize;
                $scope.obj.total = data.data.totalCount;
            })
        }
        $scope.getMsg()
    })
});


