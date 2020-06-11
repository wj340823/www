define(['app'], function (app) {
  app.controller("provinceCtrl", function ($rootScope, $scope ) {
    function init() {
    }
    init();
    $rootScope.system="new";
    $scope.$on("$destroy",function(){
      $rootScope.system="";
    });
      $scope.list={
          company:[],
          checkStatus:[]
      }
    init();
  });
    //任务管理
    app.controller("taskManageCtrl", function ($rootScope, $scope, $http,$uibModal) {
        $scope.msgState = false;
        $scope.openMsg = function(){
            $scope.msgState = true;
        }
        $scope.closeMsg = function(){
            $scope.msgState = false;
        }
        $scope.msgObj = {}
        $scope.msgObj.test=[]
        $scope.selAll = false;
        //获取行政区域
        function getCity(){
            $http.get("basicData/listXzqy").then(function (response) {
                $scope.areas = response.data;
                $scope.areas.unshift({
                    id:'1',
                    name:'贵州省'
                })
                $scope.areas.forEach(function(item){
                    item.sel = false;
                    $scope.msgObj[item.id] = []
                })
            });
        };
        getCity();
        //全选
        $scope.selectAll = function(){
            $scope.areas.forEach(function(item,i){
                if($scope.selAll == true){
                    item.sel = false;
                }else{
                    item.sel = true;
                }
                $scope.getOrgPeople(item.id,i)
            })
        }
        //获取机构人员
        $scope.getOrgPeople = function(xzqy,index){
            var a = this
            $scope.areas[index].sel = !$scope.areas[index].sel
            if($scope.areas[index].sel == true){
                $('.sel:eq('+(index+1)+') input').prop("checked",true)
                $http.get('basicData/listManagerCrew?xzqy='+xzqy+'&pageSize=1000').then(function(data){
                    var arr = data.data.dataList
                    arr.forEach(function(item){
                        var obj = {
                            position:item.position,
                            name:item.name,
                            tel:item.phoneNumber
                        }
                        $scope.msgObj[xzqy].push(obj)
                    })
                })
            }else{
                $('.sel:eq('+(index+1)+') input').prop("checked",false)
                $scope.msgObj[xzqy] = []
            }

        }
        //单个添加
        $scope.openTest = function(){
            var modalInstance = $uibModal.open({
                templateUrl: "partials/pop/addTestMessage.html",
                controller: "addConcatCtrl",
                backdrop: 'static',
                size: 'moniPop',
                resolve: {}
            });
            modalInstance.result.then(function (data) {
                if(data){
                    $scope.msgObj.test=[]
                    $scope.msgObj.test.push(data)
                }
            })
        }
        //单个删除
        $scope.delMsg = function(key,i){
            $scope.msgObj[key].splice(i,1);
        }
        //发送短信
        $scope.msgSend = function(){
            var people = ''
            for(let key in $scope.msgObj){
                $scope.msgObj[key].forEach(function(item){
                    people += item.tel+','
                })
            }
            if(people!=''){
                $http.get('emergencyTask/dxfs?tel='+people).then(function(data){
                    if(data.status == 200){
                        alert('短信发送成功')
                    }else{
                        alert('短信发送失败')
                    }
                })
            }


        }
        $scope.getMsg=function(){
            $scope.pageType=1;
            $http.get('emergencyTask/listEmergencyTask?'+'&pageNo='+$scope.items.pageNo)
                .then(function (req) {
                    $scope.obj=req.data.dataList;
                    if($scope.obj.length==0){
                        $scope.noData=true;
                    }else {
                        $scope.noData=false;
                    }
                    $scope.items.pageSize=req.data.pageSize;
                    $scope.items.total=req.data.totalCount;
                    console.log(req);
                    for (var i in $scope.obj){
                        $scope.overLine=$scope.obj[i].DEADLINE - new Date().getTime()>0;
                        $scope.items.listDanger.push($scope.overLine);
                    }
                });
        };

        $scope.searchMsg=function () {
            $scope.pageType=2;
            $('.loader').show();
            $scope.items.strTime=new Date($scope.items.strTime).getTime();
            $http.get('emergencyTask/listEmergencyTask?'+'&pageNo='+$scope.items.pageNo+
                '&strTime='+$scope.items.strTime+
                '&endTime='+(new Date($scope.items.endTime).getTime())+
                '&keywords='+encodeURIComponent($scope.items.keywords)+
                '&status='+$scope.items.status)
                .then(function (req) {
                    $('.loader').hide();
                    $scope.obj=req.data.dataList;
                    console.log($scope.obj);
                    if($scope.obj.length==0){
                        $scope.noData=true;
                    }else {
                        $scope.noData=false;
                    }
                    $scope.items.pageSize=req.data.pageSize;
                    $scope.items.total=req.data.totalCount;
                    console.log(req);
                });
        };
        $scope.deleteTask=function (id) {
            $('.task-alert').show();
            $scope.textContent='确定删除吗?删除记录不可恢复！';
            $scope.deleteId=id;
            console.log($scope.deleteId);
        };
        $scope.sureAlert=function(){
            $http({
                url:'emergencyTask/deleteEmergencyTask/'+$scope.deleteId,
                method:'DELETE',
                transformResponse:function(data){
                    return data;
                }
            }).then(function(data){
                if(data.data=='success'){
                    $scope.textContent='操作成功！';
                }else {
                    $scope.textContent=data.data;
                }
                $scope.getMsg();
            });
        };
        $scope.resetAlert=function (text) {
            $('.task-alert').hide();
        };
        function init() {
            $scope.items={
                pageNo:1,
                pageSize:1,
                total:1,
                status:'-1',
                strTime:new Date().getFullYear()+'/01/01',
                endTime:new Date().getFullYear()+1+'/01/01',
                keywords:'',
                listDanger:[],
            };
            $scope.getMsg();
        }
        init();
        $scope.openFileLists = function(item){
            var modalInstance = $uibModal.open({
                templateUrl: "partials/pop/fileLists.html",
                controller: "fileListCtrl",
                backdrop: 'static',
                size: 'moniPop',
                resolve:{
                    item:item
                }
            });
            modalInstance.result.then(function () {
                $scope.getMsg();
            })
        }
        $scope.openLoad = function (item) {
            var modalInstance = $uibModal.open({
                templateUrl: "partials/pop/uploadFile.html",
                controller: "uploadFileCtrl",
                backdrop: 'static',
                size: 'moniPop',
                resolve:{
                    id:item.ID
                }
            });
            modalInstance.result.then(function () {
                $scope.getMsg();
            })
        }
    });
    //添加测试人员
    app.controller('addConcatCtrl',['$scope', '$http', '$uibModalInstance',
        function ($scope, $http, $uibModalInstance) {
            $scope.test={
                name:'',
                tel:'',
                close:_close,//关闭
                commit:_commit,//确定
            }
            function _close() {
                $uibModalInstance.close()
            }
            function _commit() {
                var self = this;
                var test = {
                    position:'测试',
                    name:self.name,
                    tel:self.tel
                }
                $uibModalInstance.close(test)
            }
        }])
    //任务派发
    app.controller("taskApplyCtrl", function ($rootScope, $scope, $http,
                   $state, $parse, $stateParams, $filter) {
        $scope.areas=[];
        $scope.checkTime=$filter('date')(new Date(), 'yyyy-MM-dd');
        $http.get("rest/dc/"+$rootScope.userList.access+"/XZQY")
            .then(function(data) {
                //console.log(data.data);
                $scope.areas=data.data;
            })
            .catch(function(data) {
                //console.log(arguments);
            });

        function init() {
            $scope.task={
                //deadline:$filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                deadline:new Date(),
                name:'',
                xzqyId:null,
                status:0,
                info:''
            };
        }
        init();
        $scope.submit = function() {
            if($scope.task.deadline!=''&&$scope.task.name!=''){
                $('.task-alert').show();
                $scope.textContent='确定发布吗?';
            }
        };
        $scope.sureAlert=function () {
            $scope.task.deadline = new Date($scope.task.deadline).getTime();
            $http.post('emergencyTask/saveEmergencyTask',$scope.task).then(function(req){
                var fd = new FormData();
                fd.append("file", document.querySelector('input[type=file]').files[0]);
                if(document.querySelector('input[type=file]').files[0]!=undefined&&document.querySelector('input[type=file]').files[0]!=''){
                    $.ajax({
                        type: "POST",
                        url: "emergencyTask/addTaskAttachment?taskId="+req.data,
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
                            $state.go('province.taskManage')
                        }
                    })
                }else{
                    $state.go('province.taskManage')
                }


                    function onprogress(evt) {
                                    /*var loaded = evt.loaded; //已经上传大小情况
                                    var tot = evt.total; //附件总大小
                                    var per = Math.floor(100 * loaded / tot); //已经上传的百分比
                                    $("#number").html(per + "%");
                                    $("#son").css("width", per + "%");
                                    if (per == 100) {
                                        $("#haha").fadeIn(200);
                                        $(".tasks-alerts").fadeIn(300);
                                    }*/
                }
            });
        };
        $scope.resetAlert=function (text) {
            if(text=='操作成功！'){
               window.history.back();
            }
            $('.task-alert').hide();
        };

    });
    //任务统计
    app.controller("taskSCtrl",function ($rootScope, $scope, $http, $state, $parse, $stateParams, $filter,$uibModal) {
        $scope.getMsg=function () {
            $http.get('emergencyTask/countTask?'+'&taskId='+$stateParams.id)
                .then(function (req) {
                    $scope.obj=req.data;
                    console.log(req);
                });
        };
        $scope.showEnterList = function(code){
            var body
            var modalInstance = $uibModal.open({
                templateUrl: "partials/pop/acceptEnterList.html",
                controller: "acceptEnterListCtrl",
                backdrop: 'static',
                size: 'moniPop',
                resolve: {
                    body:{
                        taskId:$stateParams.id,
                        xzqyCode:code
                    }
                }
            });
        }
        $scope.downTaskFile = function(){
            $http.get('emergencyTask/downTaskAttachment?attachmentId='+$scope.baseMsg.id).then(function(){
                window.open('emergencyTask/downTaskAttachment?attachmentId='+$scope.baseMsg.id)
            })
        }
        function init() {
            $scope.getMsg();
            $scope.baseMsg={
                id:'',
                time:$stateParams.time,
                taskName:$stateParams.taskName,
                status:$stateParams.status,
                info:$stateParams.info,
                fileName:'',
                list:[]
            };
        }
        init();
        $http.get('emergencyTask/listAttachmentByTask?taskId='+$stateParams.id).then(function(data){
            if(data.data.dataList.length!=0){
                $scope.baseMsg.fileName = data.data.dataList[0].url;
                $scope.baseMsg.id = data.data.dataList[0].id;
            }
            $scope.baseMsg.list = data.data.dataList;
         })
    });
    //排查记录
    app.controller("recordCtrl", function ($rootScope, $scope, $http, mapSet, chartSet) {
        $scope.getMsg=function(){
            $scope.pageType=1;
            $http.get("examTask/listExamLog?"+'&pageNo='+$scope.obj.pageNo)
                .then(function (response) {
                    $scope.items = response.data.dataList;
                    $scope.obj.pageSize=response.data.pageSize;
                    $scope.obj.total=response.data.totalCount;
                    console.log(response);
                    if($scope.items.length==0){$scope.noData=true;}else {$scope.noData=false;}
                });
        };

        $scope.searchMsg=function () {
            $scope.pageType=2;
            $('.loader').show();
            $http.get('examTask/listExamLog?'+'&pageNo='+$scope.obj.pageNo+
                '&strTime='+(new Date($scope.obj.strTime).getTime())+
                '&endTime='+(new Date($scope.obj.endTime).getTime())+
                '&result='+$scope.obj.level+
                '&xzqyId='+$scope.obj.xzqyId+
                '&keywords='+encodeURIComponent($scope.obj.keywords)
            )
                .then(function (req) {
                    $('.loader').hide();
                    $scope.items=req.data.dataList;
                    console.log($scope.obj);
                    if($scope.items.length==0){
                        $scope.noData=true;
                    }else {
                        $scope.noData=false;
                    }
                    $scope.obj.pageSize=req.data.pageSize;
                    $scope.obj.total=req.data.totalCount;
                    console.log(req);
                });
        };
        function init() {
            $http.get("basicData/listXzqy").then(function (response) {
                $scope.areas = response.data;
                console.log($scope.areas);
            });
            $scope.obj={
                pageNo:1,
                pageSize:10,
                total:1,
                strTime:new Date().getFullYear()+'/01/01',
                endTime:new Date().getFullYear()+1+'/01/01',
                keywords:'',
                level:'-1',
                xzqyId:'-1'
            };
            $scope.searchQuery={
                level:'0'
            };
            $scope.getMsg();
        }

        init();
    });

    app.controller('acceptEnterListCtrl', function ($rootScope,$scope,$http,body,$uibModalInstance) {
        console.log(body)
        if(body.xzqyCode==undefined||!body.xzqyCode){
            var code = $rootScope.userList.xzqyId
            var flag = true
        }else {
            var code = body.xzqyCode
            var flag = false
        }
        $scope.list = {
            pageNo:1,
            pageSize:6,
            totalCount:10,
            data:[],
            getMsg:function(){
                $http.get('emergencyTask/getEmergencTaskList?taskId='+body.taskId+'&pageNo='+
                    $scope.list.pageNo+'&xzqyId='+code+'&pageSize='+$scope.list.pageSize+'&flag='+flag).then(function (data) {
                    $scope.list.data = data.data.dataList;
                    //$scope.list.pageSize = data.data.pageSize;
                    $scope.list.totalCount = data.data.totalCount;
                })
            },
            cancel:function () {
                $uibModalInstance.close()
            }
        }
        $scope.list.getMsg()
    });

    app.controller('uploadFileCtrl',function ($scope,$http,$uibModalInstance,$timeout,id,$rootScope) {
        var taskId = id
        $scope.modal = {
            fileName:'点击选择文件',
            list:[],
            page:{
                pageNo:1,
                pageSize:4,
                total:10
            },
            getFile:function(file){
                console.log(document.querySelector('input[type=file]'));
                $timeout(function (){
                    $scope.modal.fileName = file.name;
                })

            },
            upload:_upload,
            del:function(item){
                var self = this;
                $http.get('emergencyTask/deleteResultTaskAttend?id='+item.id)
                    .then(function () {
                        self.init()
                    })
            },
            cancel:function () {
                $uibModalInstance.close()
            },
            init:function () {
                var self = this
                $http.get('emergencyTask/listAttachmentResult?taskId='+taskId+'&pageNo='+self.page.pageNo
                        +'&pageSize='+self.page.pageSize)
                    .then(function (data) {
                        self.list = data.data.dataList;
                        self.page.total = data.data.totalCount;
                    })
            }
        }
        function _upload() {
            var fd = new FormData();
            fd.append("file", document.querySelector('input[type=file]').files[0]);
            $.ajax({
                type: "POST",
                url: "emergencyTask/addTaskAttachmentResult?taskId="+taskId+'&xzqyId='+$rootScope.userList.xzqyId,
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
                success:function () {
                    $scope.modal.init()
                    $scope.modal.fileName='点击选择文件';
                }
            })
            function onprogress(evt) {}
        }
        $scope.modal.init()
    })
    app.controller('fileListCtrl',function ($scope,$http,$uibModalInstance,$timeout,item) {
        var taskId = item.ID;
        $scope.file = {
            list:[],
            page:{
                pageNo:1,
                pageSize:4,
                total:10
            },
            close:function () {
                $uibModalInstance.close()
            },
            down:function(item){
                window.open("emergencyTask/downTaskAttachment?attachmentId="+item.attendId)
            },
            del:function(item){
                var self = this;
                $http.get('emergencyTask/deleteResultTaskAttend?id='+item.id)
                    .then(function () {
                        self.init()
                    })
            },
            init:function () {
                var self = this
                $http.get('emergencyTask/listAttachmentResult?taskId='+taskId+'&pageNo='+self.page.pageNo
                    +'&pageSize='+self.page.pageSize)
                    .then(function (data) {
                        self.list = data.data.dataList;
                        self.page.total = data.data.totalCount;
                    })
            }
        }
        $scope.file.init()
    })
});
