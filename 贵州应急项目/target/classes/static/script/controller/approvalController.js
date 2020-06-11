

define(['app'], function (app) {
    app.controller("approCtrl", function ($rootScope, $scope) {
        function init() {
        }
        $rootScope.system="new";
        $scope.$on("$destroy",function(){
            $rootScope.system="";
        })
        init();
    });
    //审批详情
    app.controller("approveInfoCtrl", function ($rootScope, $scope, $http, mapSet,
         chartSet,$stateParams,$filter,$state) {
        function getFj() {
            $http.get('emergencyTask/listAttachmentByTask?taskId='+$stateParams.itemNum).then(function (data) {
                $scope.downId = data.data.dataList[0].id
                $http.get('emergencyTask/downTaskAttachment?attachmentId='+$scope.downId).then(function (data) {
                    if(data.status==200){
                        $scope.filesDown = true
                    }else {
                        $scope.filesDown = false
                    }
                })
            })

        }
        getFj()
        $scope.downloadFile = function () {
            window.open('emergencyTask/downTaskAttachment?attachmentId='+$scope.downId)
        }
        function getMsg() {
            $http.get('emergencyTask/getTaskDetails?'+'id='+$stateParams.itemNum)
                .then(function (req) {
                    console.log(req.data)
                    $scope.obj=req.data
                    $scope.obj.deadline = $filter('date')(new Date($scope.obj.deadline),'yyyy-MM-dd')
                    $scope.obj.completetime = $filter('date')(new Date($scope.obj.completetime),'yyyy-MM-dd')
                    $scope.obj.commenttime = $filter('date')(new Date($scope.obj.commenttime),'yyyy-MM-dd')
                    $scope.obj.status = $scope.obj.status.toString();
                })
        }
        function init() {
            $scope.operate=$stateParams.operate;
            $scope.items={
                comment:'',
                reviewer:$rootScope.userList.userName,
                type:'1',
                taskId:$stateParams.itemNum,
            }
            getMsg();
        }
        init();
        $scope.submit=function () {
            $('.task-alert').show()
            if($scope.items.type==2&&$scope.items.comment==''){
                $scope.textContent='驳回理由尚未填写,确定保存吗?';
            }else {
                $scope.textContent='确定保存吗?';
            }
            if($scope.items.type==1){
                $scope.items.comment=''
            }
        }
        $scope.sureAlert=function () {
            $http.post('examTask/exam',$scope.items).then(
                function (req) {
                    console.log(req);
                    $scope.textContent='操作成功！';
                }
            )
        }
        $scope.resetAlert=function (text) {
            if(text=='操作成功！'){
                $state.go('approval.waiter');
            }
            $('.task-alert').hide()
        }
    });
    //已审批列表
    app.controller("drawCtrl", function ($rootScope, $scope, $http, mapSet, chartSet,$filter) {
        $scope.getMsg=function(){
            $scope.pageType=1;
            $http.get('examTask/listTaskBeExamed?'+'&pageNo='+$scope.items.pageNo)
                .then(function (req){console.log(req.data.dataList)
                    $scope.obj=req.data.dataList;
                    if($scope.obj.length==0){$scope.noData=true}else {$scope.noData=false}
                    $scope.items.pageSize=req.data.pageSize;
                    $scope.items.total=req.data.totalCount;
                })
        }
        $scope.searchMsg=function () {
            $('.loader').show();$scope.pageType=2;
            $http.get('examTask/listTaskBeExamed?'+'&pageNo='+$scope.items.pageNo+
                    '&completetimeStart='+(new Date($scope.items.strTime).getTime())+
                    '&completetimeEnd='+(new Date($scope.items.endTime).getTime())+
                    '&examResult='+$scope.items.result+
                    '&keywords='+encodeURIComponent($scope.items.keywords)
            )
                .then(function (req) {console.log(req.data.dataList)
                    $('.loader').hide()
                    $scope.obj=req.data.dataList;
                    if($scope.obj.length==0){$scope.noData=true}else {$scope.noData=false}
                    $scope.items.pageSize=req.data.pageSize;
                    $scope.items.total=req.data.totalCount;
                })
        }
        function init() {
            $scope.items={
                pageNo:1,
                pageSize:1,
                total:1,
                strTime:new Date().getFullYear()+'/01/01',
                endTime:new Date().getFullYear()+1+'/01/01',
                result:'-1',
                keywords:''
            }
            $scope.getMsg()
        }
        init();
    });
    //待审批列表
    app.controller("waiterCtrl", function ($rootScope, $scope, $http,
         mapSet, chartSet, $stateParams,$filter) {
        $scope.getMsg = function () {
            $scope.pageType=1;
            $http.get("examTask/listTaskToBeExam?"+'&pageNo='+$scope.items.pageNo)
                .then(function (response) {
                    $scope.obj=response.data.dataList;
                    if($scope.obj.length==0){$scope.noData=true}else {$scope.noData=false}
                    $scope.items.pageSize=response.data.pageSize;
                    $scope.items.total=response.data.totalCount;
                    console.log($scope.obj)
                    for (let i=0;i<$scope.obj.length;i++) {
                        $scope.obj[i].DEADLINE=$filter('date')(new Date($scope.obj[i].DEADLINE), 'yyyy-MM-dd')
                    }
                });
        };
        $scope.searchMsg=function () {
            $('.loader').show();$scope.pageType=2;
            $http.get('examTask/listTaskToBeExam?'+'&pageNo='+$scope.items.pageNo+
                    '&keywords='+encodeURIComponent($scope.items.keywords)
            )
                .then(function (req) {console.log(req.data.dataList)
                    $('.loader').hide()
                    $scope.obj=req.data.dataList;
                    if($scope.obj.length==0){$scope.noData=true}else {$scope.noData=false}
                    $scope.items.pageSize=req.data.pageSize;
                    $scope.items.total=req.data.totalCount;
                })
        }
        function init() {
            $scope.items={
                pageNo:1,
                pageSize:1,
                total:1,
                keywords:''
            }
            $scope.getMsg()
        }
        init();
    });
    //企业用户管理
    app.controller("cusermanage",function($rootScope,$scope,$http,$uibModal){
        $rootScope.system="new";
        $scope.$on("$destroy",function(){
            $rootScope.system="";
        })
            var mock = [
                {
                    username:"admin",
                    role:"管理员",
                    name:"张三",
                    phone:"13888888888"
                }
            ]

            $scope.modal = {
                page:{
                    no:1,
                    size:10,
                    total:10
                },
                users:[],
                queryUsers:_queryUsers,
                openModal:openModal,
                deleteUser:_deleteUser,
                init:_initPage
            }

            function responseErr(){
                alert("操作失败,监测网络是否正常!");
            }

            function _queryUsers(){
                var that = this;
                var url = "user/qyInfo";
                var params = {
                    companyName:that.keyword,
                    address:$rootScope.userList.xzqyId,
                    pageNo:that.page.no
                };
                var suc = function(data){
                    var res = data.data.dataList || {};
                    that.users = res;
                    that.page.total = data.data.totalCount;
                    that.page.size = data.data.pageSize
                }
                that.users.length = 0;
                that.users = mock;
                //that.page.total = 1;
                $http.get(url,{params:params}).then(suc,responseErr);
            }

            function openModal(type,info){
                var that = this;
                var opts = {
                    templateUrl:"partials/pop/userModal.html",
                    controller:"usermanage.userInfo",
                    size:"md",
                    resolve:{
                        body:function(){
                            return {
                                info:info,
                                oparate:type
                            }
                        }
                    }
                }
                var modal = $uibModal.open(opts);
                var resolve = function(){
                    that.queryUsers();
                }
                modal.result.then(resolve);
            };
            function _deleteUser(userid){
                var that = this;
                $scope.deleteurl = "riskSource/deleteCompanyById?companyId=" + encodeURIComponent(userid);
                $scope.textContent = '确定删除企业帐号及企业所有相关信息?';
                $('.task-alert').show()

                /*var suc = function(){

                }*/

            };
            $scope.sureAlert = function(){
                $http({
                    method:'GET',
                    url:$scope.deleteurl,
                    transformResponse:function(data){
                        return data;
                    }
                }).then(function(data){
                    $scope.textContent='删除成功！'
                    $('.task-alert').hide()
                    $scope.modal.queryUsers();
                })
                /*$http.get($scope.deleteurl).then(function(){
                    $scope.textContent='删除成功！'
                    $('.task-alert').hide()
                    that.queryUsers();
                })*/
            }
            $scope.resetAlert = function(text){
                $('.task-alert').hide()
            }
            function _initPage(){
                $rootScope.system="new";
                this.queryUsers();
            };

            $scope.modal.init();
        });
    app.controller("usermanage.userInfo",function($scope,$http,$uibModalInstance,body,$rootScope){
        //body{info,oparate:'detail'/'add'/'update'}
        $scope.modal = {
            info:'',
            readonly:true,
            oparate:"detail",
            form:{},
            initForm:_initForm,
            cancel:cancel,
            confirm:_confirm,
            init:_initPage
        }
        var  getRnterList = function(){
            $http.get('riskSource/listRiskSouce?xzqyId='+$rootScope.userList.xzqyId).then(function(data){
                $scope.modal.form.enterList = data.data;
                $scope.modal.form.enter = ''
            })
        }
        getRnterList();
        function _initForm(){
            var formatter = function(data){
                return {
                    company:data.id,
                    description:$scope.modal.form.enter,
                    account:data.username,
                    password:data.pwd,
                    displayName:data.name,
                    phoneMobile:data.phone,
                    address:$rootScope.userList.xzqyId
                }
            }
            this.form = [body].map(formatter)[0];
        }

        function cancel(update){
            update ? $uibModalInstance.close() : $uibModalInstance.dismiss();
        }
        //$scope.modal.form = $scope.modal.initForm
        function _confirm(){
            if(this.oparate == "detail"){
                this.oparate = "updata";
                this.readonly = false;
                return;
            }else if(this.oparate == "add"){
                if($scope.modal.info!='enter'){
                    $scope.modal.form.enterList.forEach(function(item){
                        if(item.COMPANYID == $scope.modal.form.enter){
                            $scope.modal.form.enterName = item.COMPANYNAME
                        }
                    })
                    if($scope.modal.form.username!=''||$scope.modal.form.pwd!=''){
                        $http.post('user/createqy', {
                            company:$scope.modal.form.enter,
                            description:$scope.modal.form.enterName,
                            account:$scope.modal.form.username,
                            password:$scope.modal.form.pwd,
                            displayName:$scope.modal.form.name,
                            phoneMobile:$scope.modal.form.phone,
                            address:$rootScope.userList.xzqyId
                        }).then(function(data){
                            if(data.data == 1){
                                alert('该企业已有账号！')
                            }else if(data.data == 2){
                                alert('用户名重复！')
                            }else if(data.data == 0){
                                alert('创建成功！')
                            }else{
                                alert('创建失败！')
                            }
                            $uibModalInstance.close();
                        })
                    }
                }else if($scope.modal.info=='enter'){
                    $http.get('riskSource/checkCompanyByname?companyName='+$scope.modal.form.enter).then(function(data){
                        if(data.data==true){
                            alert('该企业已存在！')
                        }else{
                            $http.post('riskSource/addEnterpriseInformation',{
                               "account": $scope.modal.form.username,
                               "companyName": $scope.modal.form.enter,
                               "custodian": $scope.modal.form.name,
                               "custodianTelephone": $scope.modal.form.phone,
                               "latitude": $scope.modal.form.lat,
                               "legalPerson": $scope.modal.form.legalPerson,
                               "longitude": $scope.modal.form.lon,
                               "password": $scope.modal.form.pwd,
                               "xzqyId": $rootScope.userList.xzqyId,
                            }).then(function(data){
                            //0 成功 1 企业账号存在 2 账号重复 3 异常
                                if(data.data == '0'){
                                    alert('添加企业成功！')
                                }else if(data.data == '1'){
                                    alert('该企业已有账号存在！')
                                }else if(data.data == '2'){
                                    alert('该用户名已被注册！')
                                }else{
                                    alert('注册失败！')
                                }
                                $uibModalInstance.close()
                            })
                        }
                    })

                }


            }
        }

        function _initPage(){
            var oparate = this.oparate = body.oparate;
            var info = this.info =body.info
            this.readonly = oparate == "detail";
            if(oparate != "add"){
                this.form = this.initForm();
            }
        }

        $scope.modal.init();
    });
    
});
