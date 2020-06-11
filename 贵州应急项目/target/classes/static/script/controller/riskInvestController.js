
define(['app'], function (app) {
    app.controller("riskInCtrl", function ($rootScope, $scope) {
        function init() {
        }
        init();
        $rootScope.system="new";
        $scope.$on("$destroy",function(){
            $rootScope.system="";
        });
        init();
    });
    //已办任务列表
    app.controller("tbFinishCtrl", function ($rootScope, $scope, $http) {
        $scope.getMsg=function(){
            $scope.pageType=1;
            $http.get('emergencyTask/listDone?'+'&pageNo='+$scope.items.pageNo)
                .then(function (req){console.log(req.data.dataList)
                    $scope.obj=req.data.dataList;
                    if( $scope.obj.length==0){$scope.noData=true}else {$scope.noData=false}
                    $scope.items.total=req.data.totalCount;
                    $scope.items.pageSize=req.data.pageSize;
                    console.log(req)
                })
        }
        $scope.searchMsg=function () {
            $('.loader').show();$scope.pageType=2;
            $http.get('emergencyTask/listDone?'+'&pageNo='+$scope.items.pageNo+
                '&completetimeStart='+(new Date($scope.items.strTime).getTime())+
                '&completetimeEnd='+(new Date($scope.items.endTime).getTime()+
                '&examResult='+$scope.items.result+
                '&keywords='+encodeURIComponent($scope.items.keywords)
                )
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
                pageSize:3,
                total:10,
                keywords:'',
                strTime:new Date().getFullYear()+'/01/01',
                endTime:new Date().getFullYear()+1+'/01/01',
                result:'-1'
            }
            $scope.getMsg()

        }
        init();

    });
    //待办任务列表
    app.controller("tbTodoCtrl", function ($rootScope, $scope, $http, $state) {
        $scope.getCurrentPage = function () {
            $http.get("emergencyTask/listUndoTask?" + "&pageNo=" + $scope.obj.currentPage ).then(function (response) {
                //$scope.obj=response.data;
                $scope.obj.items=response.data.dataList;
                if( $scope.obj.items.length==0){$scope.noData=true}else {$scope.noData=false}
                $scope.obj.total=response.data.totalCount;
                $scope.obj.pageSize=response.data.pageSize;
                $scope.obj.pageSize = response.data.pageSize;
                console.log($scope.obj)
            });
        };
        $scope.msgSend=function(n) {
            $('.task-alert').show();
            $scope.textContent='确定提交吗?'
            $scope.taskId = n

        }
        $scope.sureAlert=function (text) {
            $http.put('emergencyTask/commitEnterpriseTask?'+"taskId="+$scope.taskId)
                .then(function (req) {
                    console.log(req)
                    $scope.textContent='操作成功！'
                })
            $scope.getCurrentPage()
        }
        $scope.resetAlert=function (text) {
            if(text=='操作成功！'){
                $state.go('riskInvest.tabTodo');
            }
            $('.task-alert').hide();
        }
        function init() {
            $scope.obj={
                currentPage:1,
                pageSize:3,
                total:10,
                items:[],
            }
            //msgGet();
            $scope.getCurrentPage()
        }
        init();
    });
    //待办、已办任务详情
    app.controller("taskInfoCtrl", function ($rootScope, $scope, $http, mapSet,
                   chartSet,$stateParams,$filter,$state,$interval) {
        function init() {
            getMsg()
            $scope.hasDone=$stateParams.hasDone;
            $scope.itemNum=$stateParams.itemNum;
            $scope.taskName=$stateParams.name;
            $scope.company=$stateParams.company;
            $scope.id=$stateParams.id;
        }
        init();
        $scope.fileName = '未选择文件'
        $interval(function () {
            if(document.querySelector('input[type=file]').files){
                if(document.querySelector('input[type=file]').files[0]!=undefined&&
                    document.querySelector('input[type=file]').files[0].name!=$scope.fileName){
                    $scope.fileName = document.querySelector('input[type=file]').files[0].name
                }
            }

        },300)
        function getMsg() {
            $http.get('emergencyTask/getTaskDetails?'+'id='+$stateParams.itemNum)
                .then(function (req){
                    console.log(req)
                    $scope.obj=req.data
                    $scope.obj.deadline=$filter('date')(new Date($scope.obj.deadline),'yyyy-MM-dd')
                    $scope.obj.completetime=$filter('date')(new Date($scope.obj.completetime),'yyyy-MM-dd')
                })
        }
        $scope.msgSend=function() {
            $('.task-alert').show();
            if($scope.obj.emergencyManagement==null||$scope.obj.riskManagement==null||
                $scope.obj.emergencyManagement.status==0||$scope.obj.riskManagement.status==0){
                $scope.textContent='任务未完成，无法提交！'
            }else {
                $scope.textContent='确定提交吗?'
            }
        }
        $scope.sureAlert=function (text) {
            $http.put('emergencyTask/commitEnterpriseTask?'+"taskId="+$scope.obj.id)
                .then(function (req) {
                    console.log(req)
                    $scope.textContent='操作成功！'
                })
            var fd = new FormData();
            fd.append("file", document.querySelector('input[type=file]').files[0]);
            $.ajax({
                type: "POST",
                url: "emergencyTask/addTaskAttachment?taskId="+$scope.obj.id,
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
            })
            function onprogress(evt) {}
        }
        $scope.resetAlert=function (text) {
            if(text=='操作成功！'){
                $state.go('riskInvest.tabTodo');
            }
            $('.task-alert').hide();
        }
    });
    //应急管理隐患排查表
    app.controller("tbRCCtrl", function ($rootScope, $scope, $http, mapSet,$state, chartSet,
                   $interval,$stateParams,$filter) {

        function init() {
            $scope.operate=$stateParams.operate;
            $scope.getMsg=function(){
                $http.get('rest/dc/'+$rootScope.userList.access+'/RiskInventory/'+$stateParams.id)
                    .then(function (req) {
                        $scope.baseMsg=req.data;
                    })
                $http.get('hiddenDanger/listHiddenDanger?'+"inventoryId="+$stateParams.id+'&type='+$stateParams.type)
                    .then(function (req) {
                        //console.log(req.data.dataList)
                        $scope.obj=req.data.dataList;
                        for (var i=0;i<$scope.obj.length;i++){
                            if($scope.obj[i].result!=null){
                                $scope.obj[i].result= $scope.obj[i].result.toString();
                            }
                        }
                    })
            }
            $scope.acount=0;
            console.log($stateParams.id)
            if($stateParams.id==''||$stateParams.id==null){
                $scope.obj=[
                    {number:'1-(1)',name:'是否编制突发环境事件风险评估报告，并与预案一起备案。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'1-(2)',name:'企业现有突发环境事件风险物质种类和风险评估报告相比是否未发生变化。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'1-(3)',name:'企业现有突发环境事件风险物质数量和风险评估报告相比是否未发生变化。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'1-(4)',name:'企业突发环境事件风险物质种类、数量变化未影响风险等级。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'1-(5)',name:'突发环境事件风险等级确定是否正确合理。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'1-(6)',name:'突发环境事件风险评估是否通过评审。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'2-(7)',name:'是否按要求对预案进行评审，评审意见是否及时落实。',result:'0',remark:'',inventoryId:null,level:3,},
                    {number:'2-(8)',name:'是否将预案进行了备案，是否每三年进行回顾性评估。',result:'0',remark:'',inventoryId:null,level:3,},
                    {number:'2-(9)',name:'出现下列情况预案未进行及时修订。 (' +
                        'a.面临的突发环境事件风险发生重大变化，需要重新进行风险评估； ' +
                        'b.应急管理组织指挥体系与职责发生重大变化； ' +
                        'c.环境应急监测预警机制发生重大变化，报告联络信息及机制发生重大变化； ' +
                        'd.环境应急应对流程体系和措施发生重大变化； ' +
                        'e.环境应急保障措施及保障体系发生重大变化； ' +
                        'f.重要应急资源发生重大变化；' +
                        'g.在突发环境事件实际应对和应急演练中发现问题，需要对环境应急预案作出重大调整的。)',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'3-(10)',name:'是否建立隐患排查治理责任制。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'3-(11)',name:'是否制定本单位的隐患分级规定。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'3-(12)',name:'是否有隐患排查治理年度计划。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'3-(13)',name:'是否建立隐患记录报告制度，是否制定隐患排查表。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'3-(14)',name:'重大隐患是否制定治理方案。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'3-(15)',name:'是否建立重大隐患督办制度。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'3-(16)',name:'是否建立隐患排查治理档案。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'4-(17)',name:'是否将应急培训纳入单位工作计划。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'4-(18)',name:'是否开展应急知识和技能培训。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'4-(19)',name:'是否健全培训档案，如实记录培训时间、内容、人员等情况。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'5-(20)',name:'是否按规定配备足以应对预设事件情景的环境应急装备和物资。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'5-(21)',name:'是否已设置专职或兼职人员组成的应急救援队伍。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'5-(22)',name:'是否与其他组织或单位签订应急救援协议或互救协议。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'5-(23)',name:'是否对现有物资进行定期检查，对已消耗或耗损的物资装备进行及时补充。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'6-(24)',name:'是否按规定公开突发环境事件应急预案及演练情况。',result:'0',remark:'',inventoryId:null,level:3},
                    {number:'7-(25)',name:'是否落实环境影响评价文件中环境风险防范和应急措施',result:'0',remark:'',inventoryId:null,level:3},
                ];
                $scope.baseMsg={
                    responsiblePerson:'',//负责人
                    enterpriseId:6,//企业id
                    time:new Date(),//排查时间
                    type:$stateParams.type,
                    enterpriseName:$rootScope.userList.companyName,//企业名称//写死的
                    taskId:$stateParams.itemNum,//任务id
                    status:0,
                    num1:0,
                    name:$stateParams.name,
                    id:$stateParams.id,
                };
            }else {
                $scope.getMsg();
            }
            $scope.riskItems='';
        }
        init();
        $scope.submit=function () {
            //完成状态判断
            if($scope.baseMsg.responsiblePerson==''){
                $scope.baseMsg.status=0;
            }else {
                $scope.baseMsg.status=1;
            }
            $scope.baseMsg.time=(new Date($scope.baseMsg.time)).getTime();
            $('.task-alert').show()
            if($scope.baseMsg.status==0){
                $scope.textContent='还有必填项未完成，确定保存吗?'
            }else {
                $scope.textContent='所有必填项都已填写完毕，排查表状态将变为已完成，确定保存吗?'
            }
        }
        $scope.sureAlert=function (text) {
            $http.post('emergencyTask/saveInventory?'+"inventoryId="+$stateParams.id,$scope.baseMsg)
                .then(function(req){$scope.inventoryId=req.data.id;
                    for (var j=0;j<$scope.obj.length;j++){
                        $scope.obj[j].inventoryId=$scope.inventoryId;
                        $scope.obj[j].level=3
                    }
                    $http.post('emergencyTask/saveRiskInventory',$scope.obj)
                        .then(function(req){console.log(req)
                            $scope.textContent='操作成功！'
                        })
                })
        }
        $scope.resetAlert=function (text) {
            if(text=='操作成功！'){
                $state.go('riskInvest')
            }
            $('.task-alert').hide();
        }
        var timer=$interval(function(){
            $scope.baseMsg.num1=0;
            $scope.riskItems='';
            for (var i=0;i<$scope.obj.length;i++){
                if($scope.obj[i].result==1){
                    $scope.baseMsg.num1++;
                    $scope.riskItems += $scope.obj[i].number+' '
                }
            }
        },300);   //间隔300毫秒定时执行
    });
    //风险防控措施隐患排查表
    app.controller("tbRPCtrl", function ($rootScope, $scope,$state, $http, mapSet,
                   chartSet,$interval,$stateParams,$filter) {
        function init() {
            $scope.status=1;
            $scope.operate=$stateParams.operate;
            console.log($rootScope.userList.access)
            $scope.getMsg=function(){
                $http.get('rest/dc/'+$rootScope.userList.access+'/RiskInventory/'+$stateParams.id)
                    .then(function (req) {
                        $scope.baseMsg=req.data;
                        $scope.baseMsg.time=$filter('date')(new Date($scope.baseMsg.time) , 'yyyy-MM-dd')
                    })

                $http.get('hiddenDanger/listHiddenDanger?'+"inventoryId="+$stateParams.id+'&type='+$stateParams.type)
                    .then(function (req) {
                        $scope.obj=req.data.dataList;
                        for (var i=0;i<$scope.obj.length;i++){
                            if($scope.obj[i].result!=null){
                                $scope.obj[i].result= $scope.obj[i].result.toString();
                            }
                            if($scope.obj[i].level!=null){
                                $scope.obj[i].level=$scope.obj[i].level.toString();
                            }
                            if($scope.obj[i].isRectification!=null){//是否整改
                                $scope.obj[i].isRectification=$scope.obj[i].isRectification.toString();
                            }
                            if($scope.obj[i].result!=null){
                                $scope.obj[i].result= $scope.obj[i].result.toString();
                            }
                        }
                    })
            }
            if($stateParams.id==null||$stateParams.id==''){
                $scope.baseMsg={
                    responsiblePerson:'',//负责人
                    enterpriseId:6,//企业id
                    time:new Date(),//排查时间
                    type:$stateParams.type,
                    enterpriseName:$rootScope.userList.companyName,//企业名称//写死的
                    taskId:$stateParams.itemNum,//任务id
                    status:0,
                    num2:null,
                    num3:null,
                    name:$stateParams.name
                }
                $scope.obj=[
                    //                (是否整改)          (整改日期)              (排查结果)    (编号)
                    {level:'0',result:'0',isRectification:null,rectificationTime:null,number:'1-(1)',
                        //hiddenDanger     责任人                   是否限期整改
                        hiddenDanger:'',responsiblePerson:'',isLimitRectification:false,inventoryId:null,
                        //挂牌督办                    治理期限      追究责任人数
                        licensesToSupervise:false,deadline:new Date().getTime(),investigated:0,remark:'',name:'是否设置应急池。',
                        address:'',isinvestigated:false
                    },
                    {level:'0',result:'0',isRectification:null,rectificationTime:null,number:'1-(2)',
                        hiddenDanger:'',responsiblePerson:'',isLimitRectification:false,inventoryId:null,
                        licensesToSupervise:false,deadline:new Date().getTime(),investigated:0,remark:'',name:'应急池容积是否满足环评文件及批复等相关文件要求。',address:'',isinvestigated:false
                    },
                    {level:'0',result:'0',isRectification:null,rectificationTime:null,number:'1-(3)',
                        hiddenDanger:'',responsiblePerson:'',isLimitRectification:false,inventoryId:null,
                        licensesToSupervise:false,deadline:new Date().getTime(),investigated:0,remark:'',name:'应急池在非事故状态下需占用时，是否符合相关要求，并设有在事故时可以紧急排空的技术措施。',address:'',isinvestigated:false
                    },
                    {level:'0',result:'0',isRectification:null,rectificationTime:null,number:'1-(4)',
                        hiddenDanger:'',responsiblePerson:'',isLimitRectification:false,inventoryId:null,
                        licensesToSupervise:false,deadline:new Date().getTime(),investigated:0,remark:'',name:'应急池位置是否合理，消防水和泄漏物是否能自流进入应急池；如消防水和泄漏物不能自流进入应急池，是否配备有足够能力的排水管和泵，确保泄漏物和消防水能够全部收集。',address:'',isinvestigated:false
                    },
                    {level:'0',result:'0',isRectification:null,rectificationTime:null,number:'1-(5)',
                        hiddenDanger:'',responsiblePerson:'',isLimitRectification:false,inventoryId:null,
                        licensesToSupervise:false,deadline:new Date().getTime(),investigated:0,remark:'',name:'接纳消防水的排水系统是否具有接纳最大消防水量的能力，是否设有防止消防水和泄漏物排出厂外的措施。',address:'',isinvestigated:false
                    },
                    {level:'0',result:'0',isRectification:null,rectificationTime:null,number:'1-(6)',
                        hiddenDanger:'',responsiblePerson:'',isLimitRectification:false,inventoryId:null,
                        licensesToSupervise:false,deadline:new Date().getTime(),investigated:0,remark:'',name:'是否通过厂区内部管线或协议单位，将所收集的废（污）水送至污水处理设施处理。',address:'',isinvestigated:false
                    },
                    {level:'0',result:'0',isRectification:null,rectificationTime:null,number:'2-(7)',
                        hiddenDanger:'',responsiblePerson:'',isLimitRectification:false,inventoryId:null,
                        licensesToSupervise:false,deadline:new Date().getTime(),investigated:0,remark:'',name:'装置区围堰、罐区防火堤外是否设置排水切换阀，正常情况下通向雨水系统的阀门是否关闭，通向应急池或污水处理系统的阀门是否打开。',address:'',isinvestigated:false
                    },
                    {level:'0',result:'0',isRectification:null,rectificationTime:null,number:'2-(8)',
                        hiddenDanger:'',responsiblePerson:'',isLimitRectification:false,inventoryId:null,
                        licensesToSupervise:false,deadline:new Date().getTime(),investigated:0,remark:'',name:'所有生产装置、罐区、油品及化学原料装卸台、作业场所和危险废物贮存设施（场所）的墙壁、地面冲洗水和受污染的雨水（初期雨水）、消防水，是否都能排入生产废水系统或独立的处理系统。',address:'',isinvestigated:false
                    },
                    {level:'0',result:'0',isRectification:null,rectificationTime:null,number:'2-(9)',
                        hiddenDanger:'',responsiblePerson:'',isLimitRectification:false,inventoryId:null,
                        licensesToSupervise:false,deadline:new Date().getTime(),investigated:0,remark:'',name:'是否有防止受污染的冷却水、雨水进入雨水系统的措施，受污染的冷却水是否都能排入生产废水系统或独立的处理系统。',address:'',isinvestigated:false
                    },
                    {level:'0',result:'0',isRectification:null,rectificationTime:null,number:'2-(10)',
                        hiddenDanger:'',responsiblePerson:'',isLimitRectification:false,inventoryId:null,
                        licensesToSupervise:false,deadline:new Date().getTime(),investigated:0,remark:'',name:'各种装卸区（包括厂区码头、铁路、公路）产生的事故液、作业面污水是否设置污水和事故液收集系统，是否有防止事故液、作业面污水进入雨水系统或水域的措施。',address:'',isinvestigated:false
                    },
                    {level:'0',result:'0',isRectification:null,rectificationTime:null,number:'2-(11)',
                        hiddenDanger:'',responsiblePerson:'',isLimitRectification:false,inventoryId:null,
                        licensesToSupervise:false,deadline:new Date().getTime(),investigated:0,remark:'',name:'有排洪沟（排洪涵洞）或河道穿过厂区时，排洪沟（排洪涵洞）是否与渗漏观察井、生产废水、清净下水排放管道连通。',address:'',isinvestigated:false
                    },
                    {level:'0',result:'0',isRectification:null,rectificationTime:null,number:'3-(12)',
                        hiddenDanger:'',responsiblePerson:'',isLimitRectification:false,inventoryId:null,
                        licensesToSupervise:false,deadline:new Date().getTime(),investigated:0,remark:'',name:'雨水、清净下水、排洪沟的厂区总排口是否设置监视及关闭闸（阀），是否设专人负责在紧急情况下关闭总排口，确保受污染的雨水、消防水和泄漏物等排出厂界。',address:'',isinvestigated:false
                    },
                    {level:'0',result:'0',isRectification:null,rectificationTime:null,number:'3-(13)',
                        hiddenDanger:'',responsiblePerson:'',isLimitRectification:false,inventoryId:null,
                        licensesToSupervise:false,deadline:new Date().getTime(),investigated:0,remark:'',name:'污（废）水的排水总出口是否设置监视及关闭闸（阀），是否设专人负责关闭总排口，确保不合格废水、受污染的消防水和泄漏物等不会排出厂界。',address:'',isinvestigated:false
                    },
                    {level:'0',result:'0',isRectification:null,rectificationTime:null,number:'4-(14)',
                        hiddenDanger:'',responsiblePerson:'',isLimitRectification:false,inventoryId:null,
                        licensesToSupervise:false,deadline:new Date().getTime(),investigated:0,remark:'',name:'企业与周边重要环境风险受体的各种防护距离是否符合环境影响评价文件及批复的要求。',address:'',isinvestigated:false
                    },
                    {level:'0',result:'0',isRectification:null,rectificationTime:null,number:'4-(15)',
                        hiddenDanger:'',responsiblePerson:'',isLimitRectification:false,inventoryId:null,
                        licensesToSupervise:false,deadline:new Date().getTime(),investigated:0,remark:'',name:'涉有毒有害大气污染物名录的企业是否在厂界建设针对有毒有害污染物的环境风险预警体系。',address:'',isinvestigated:false
                    },
                    {level:'0',result:'0',isRectification:null,rectificationTime:null,number:'4-(16)',
                        hiddenDanger:'',responsiblePerson:'',isLimitRectification:false,inventoryId:null,
                        licensesToSupervise:false,deadline:new Date().getTime(),investigated:0,remark:'',name:'涉有毒有害大气污染物名录的企业是否定期监测或委托监测有毒有害大气特征污染物。',address:'',isinvestigated:false
                    },
                    {level:'0',result:'0',isRectification:null,rectificationTime:null,number:'4-(17)',
                        hiddenDanger:'',responsiblePerson:'',isLimitRectification:false,inventoryId:null,
                        licensesToSupervise:false,deadline:new Date().getTime(),investigated:0,remark:'',name:'涉有毒有害大气污染物名录的企业是否定期监测或委托监测有毒有害大气特征污染物。',address:'',isinvestigated:false
                    },
                ]
            }else {
                $scope.getMsg()
            }
        }
        init();

        $scope.submit=function () {
            for(var i=0;i<$scope.obj.length;i++){
                if($scope.obj[i].level==1){
                    $scope.obj[i].result='1';
                    if( $scope.obj[i].address==''|| $scope.obj[i].deadline==null||
                        $scope.obj[i].responsiblePerson==''||$scope.obj[i].isRectification==null){
                        $scope.status=0;
                        //console.log($scope.obj[i].deadline)
                    }
                }else  if($scope.obj[i].level==2){
                    $scope.obj[i].result='1';
                    if( $scope.obj[i].address==''|| $scope.obj[i].deadline==null||
                        $scope.obj[i].responsiblePerson==''||$scope.obj[i].isRectification==null){
                        $scope.status=0;
                        //console.log($scope.obj[i].responsiblePerson)
                    }else {
                        if($scope.obj[i].isinvestigated==true&&$scope.obj[i].investigated==0){
                            $scope.status=0;
                            //console.log($scope.obj[i].investigated)
                        }
                    }
                }else {
                    $scope.status=1;
                }
                if($scope.obj[i].isinvestigated==false){
                    $scope.obj[i].investigated=0
                }
            }
            $('.task-alert').show();
            $scope.baseMsg.time=new Date($scope.baseMsg.time).getTime();
            if($scope.baseMsg.responsiblePerson==''||$scope.status==0){
                $scope.baseMsg.status=0;
                $scope.textContent='还有必填项未完成，确定保存吗?';
            }else {
                $scope.baseMsg.status=1;
                $scope.textContent='所有必填项都已填写完毕，排查表状态将变为已完成，确定保存吗?';

            }
        }
        $scope.sureAlert=function (text) {
            $http.post('emergencyTask/saveInventory?'+"inventoryId="+$stateParams.id,$scope.baseMsg)
                .then(function(req){$scope.inventoryId=req.data.id;
                    for (var j=0;j<$scope.obj.length;j++){
                        $scope.obj[j].inventoryId=$scope.inventoryId;
                    }
                    $http.post('emergencyTask/saveRiskInventory',$scope.obj)
                        .then(function(req){console.log(req)
                            $scope.textContent='操作成功！'
                        })
                })
        }
        $scope.resetAlert=function (text) {
            if(text=='操作成功！'){
                $state.go('riskInvest')
            }
            $('.task-alert').hide();
        }
        var timer=$interval(function(){
            $scope.baseMsg.num2=0;
            $scope.baseMsg.num3=0;
            $scope.geneItems='';
            $scope.majorItems='';
            for (var i=0;i<$scope.obj.length;i++){
                if($scope.obj[i].level==1){
                    $scope.baseMsg.num3++;
                    $scope.geneItems += $scope.obj[i].number+' '
                }else if($scope.obj[i].level==2){
                    $scope.baseMsg.num2++;
                    $scope.majorItems += $scope.obj[i].number+' '
                }
            }
        },300);

    });
    app.controller("msgCtrl", function ($rootScope, $scope) {
        function init() {
        }
        init();
        $rootScope.system="new";
        $scope.$on("$destroy",function(){
            $rootScope.system="";
        });
        init();
    });
    app.controller('yilanbiao',function ($rootScope,$scope,$http,$stateParams,$state,$timeout,$uibModal) {
        function init(){
            $scope.items={
                type:$stateParams.opType,
                index:$stateParams.index,
                pageNo:1,
                pageSize:10,
                totalCount:10,
                hjfxwzPageNo : 1,
                hjfxwzpageSize : 10,
                hjfxwztotalCount : 10,
                hjbhmbPageNo : 1,
                hjbhmbpageSize : 10,
                hjbhmbtotalCount : 10,
                tfhjpageNo : 1,
                tfhjpageSize : 10,
                tfhjtotalCount : 10,
                scgypageNo : 1,
                scgypageSize : 10,
                scgytotalCount : 10
            }
            $scope.imgUrl=''
        }
        init()
        $scope.editable = false;
        $scope.ylb={
            editable : false,
            selectedPer_hjbhmb : [],
            selectedPer_jlcs : [],
            selectedPer_sgfssjcs : [],
            selectedPer_qjfsxtcs : [],
            selectedPer_yspsxtfxfkcs : [],
            selectedPer_scfswpcs : [],
            selectedPer_pfqx : [],
            companyIntro:'',
            riskfile : '',
            riskfactors : '',
            risksubstances : '',
            risksubstancesCombo : '',
            hjfxwzfxlx : '1',
            riskunit : '',
            riskmeasures : '',
            qyscenario :'',
            scgygylx : '',
            scgyLists : '',
            proLists:'',
            targetLists:'',
            hjbhmb :{"companyId": $rootScope.userList.companyId,"stlx": "水"},
            hjbhmbWhole : '',
            accidents:'',
            storages:'',
            phones:'',
            emergency:'',
            experts:'',
            th1:['装置名称','主要原材料','产品名称','年产能（吨）'],
            // th2:['类型','保护目标','方位','距离(m)','人数/户数','经纬度','标准'],
            th3:['事故源','危险性类别','危险特性','泄露应急措施'],
            th4:['物资名称','数量','计量单位','规格/型号','贮存地点'],
            th5:['部门','姓名','职务','办公室电话','手机'],
            th6:['部门','办公室电话'],
            th7:['姓名','单位','职务/职称','联系电话'],
            th8:['名称','化学代码','使用或贮存场所','最大使用或贮存量（吨）','临界量（吨）'],
            th9:['风险单元名称','环境风险物质','最大贮存量（m³）','是否有围堰','是否防渗漏','是否防腐','是否有应急池或污水处理设施','是否有喷淋措施和预警监测'],
            th10:['可能发生突发环境事件场所','应对措施'],
            scgyth:['生产工艺类型','生产工艺名称'],
            td1:{name:$stateParams.name,materials:$stateParams.materials,productName:$stateParams.productName,
                annualCapacity:$stateParams.annualCapacity,companyId:$rootScope.userList.companyId, productionUnitId:$stateParams.id},
            td2:{bhlx:$stateParams.bhlx,protectionObjectives:$stateParams.protectionObjectives,position:$stateParams.position,distance:$stateParams.distance,
                households:$stateParams.households,hlzl:$stateParams.hlzl,objective:$stateParams.objective,jd:$stateParams.jd,wd:$stateParams.wd,standard:$stateParams.standard,
                qyId:$rootScope.userList.companyId,riskreceptor_Id:$stateParams.id},
            td3:{'accidentSource':'','level':'', 'hazardousCharacteristics':'','emergencyMeasure':'',
                companyId:$rootScope.userList.companyId,accidentsource_Id:''},
            td4:{'name':$stateParams.name,'number':$stateParams.number,'numberUtil':$stateParams.numberUtil, 'typeNumber':$stateParams.typeNumber,'address':$stateParams.address,companyId:$rootScope.userList.companyId,
                companyName:$rootScope.userList.companyName, emergencySubstanceId:$stateParams.id,function:''},
            td5:{'department':'','name':'','companyAgency':'', 'sfzNum':'','telephone':'',companyId:$rootScope.userList.companyId,
                emergencyCrewId:'',companyAgency:'', officeTelephone:'',sex:'',theUtil:''},
            td6:{'department':'','telephone':'',companyId:$rootScope.userList.companyId,responsibility:'',foreignAidUnitId:''},
            td7:{'name':'','theUtil':'','companyAgency':'','telephone':'',address:'',companyId:$rootScope.userList.companyId,
                department:'',emergencySpecialistId:'',professionalField:'',sex:'',sfzNum:''},
            td8:{'fxlx':$stateParams.fxlx,'name':$stateParams.name,'chemicalCode':$stateParams.chemicalCode,'place':$stateParams.place,'storage':$stateParams.storage,'ljl':$stateParams.ljl,'hjrisksubstances_Id':$stateParams.id,qyId:$rootScope.userList.companyId},
            td9:{'riskName':$stateParams.riskName,'address':$stateParams.address,'unitName':$stateParams.unitName,'maxNumber':$stateParams.maxNumber,'sfwy':$stateParams.sfwy,'sffs':$stateParams.sffs,'sfff':$stateParams.sfff,'sfwscl':$stateParams.sfwscl,'sfqtcl':$stateParams.sfqtcl,'id':$stateParams.id,companyId:$rootScope.userList.companyId},
            td10:{place:$stateParams.place,measures:$stateParams.measures,'qyscenarioanalysis_Id':$stateParams.id,qyId:$rootScope.userList.companyId},
            scgy:{gylx:$stateParams.gylx,gyName:$stateParams.gyName,gyName1:$stateParams.gyName,gyName2:$stateParams.gyName,bz:'','productionProcess_Id':$stateParams.id,qyId:$rootScope.userList.companyId}
        }
        // $scope.getcqpmt = function(){
        //     var companyId = encodeURIComponent($rootScope.userList.companyId);
        //     $http({
        //         method:'GET',
        //         url:'riskSource/downloadAttachment?companyId='+encodeURIComponent($rootScope.userList.companyId)+'&type=1',
        //     }).then(function (req) {
        //         $scope.cqpmtType=1;
        //     },function (req) {
        //         $scope.cqpmtType=2;
        //     })
        // }
        // $scope.getcqpmt()
        $scope.getYlb=function (){
            var companyId = encodeURIComponent($rootScope.userList.companyId);
            $http.get("riskSourceTwo/enterpriseInfo/"+companyId).then(function (req) {
                    $scope.ylb.companyIntro = req.data;
                    $scope.ylb.companyIntro.type = '0'
                    //console.log($scope.riskSource.companyInfo)
                    //console.log($scope.riskSource.companyInfo.companyName)
                })
            $http.get("riskSourceTwo/file/list/"+companyId).then(function (req) {
                $scope.ylb.riskfile = req.data;
            })
            $http.get("riskSourceTwo/getRiskFactors?"+'qyId='+companyId).then(function (req) {
                    if(req.data[0].pkinfos != undefined && req.data[0].pkinfos != null && req.data[0].pkinfos.length>0){
                        for(var i=0; i<req.data[0].pkinfos.length; i++){
                            $scope.ylb.selectedPer_pfqx[i] =  req.data[0].pkinfos[i].pfqx.split(',');
                        }
                    }else{
                        req.data[0].pkinfos = [];
                    }
                    $scope.ylb.riskfactors = req.data[0]
            })
            $http.get("riskSourceTwo/getHjRiskSubstances?"+'qyId='+companyId+'&fxlx='+$scope.ylb.hjfxwzfxlx+'&pageNo='+$scope.items.hjfxwzPageNo+'&pageSize='+$scope.items.hjfxwzpageSize).then(function (req) {
                    var datalist = req.data.dataList;
                    for(var i=0; i<datalist.length; i++){
                        if(datalist[i].fxlx == '水'){
                            datalist[i].fxlx = '1';
                        }else{
                            datalist[i].fxlx = '2';
                        }
                    }
                    $scope.ylb.risksubstances = datalist;
                    $scope.items.hjfxwzpageSize = req.data.pageSize;
                    $scope.items.hjfxwztotalCount = req.data.totalCount;
            })
            //风险受体整体信息
            $http.get("riskSourceTwo/riskReceptorWithCompany/"+companyId).then(function (req) {
                if(req.data.length > 0){
                    $scope.ylb.hjbhmbWhole = req.data[0];
                    $scope.ylb.selectedPer_hjbhmb = req.data[0].shjfxstmgcd.split(',');
                }else{
                    $scope.ylb.hjbhmbWhole = {"companyId": $rootScope.userList.companyId};
                }
            })
            $http.get('riskSourceTwo/RiskSourceUnit/list/'+companyId).then(function (req) {
                    $scope.ylb.riskunit = req.data;
            })
            $http.get('riskSourceTwo/RiskControlMeasures/'+companyId).then(function (req) {
                    if(req.data == ''){
                        $scope.ylb.riskmeasures = {"companyId": $rootScope.userList.companyId, "FXLX": "1"};
                    }else{
                        req.data.FXLX = '1';
                        $scope.ylb.riskmeasures = req.data;
                        if(req.data.jlcs != null){
                            $scope.ylb.selectedPer_jlcs = req.data.jlcs.split(',');
                            $scope.ylb.selectedPer_sgfssjcs = req.data.sgfssjcs.split(',');
                            $scope.ylb.selectedPer_qjfsxtcs = req.data.qjfsxtcs.split(',');
                            $scope.ylb.selectedPer_yspsxtfxfkcs = req.data.yspsxtfxfkcs.split(',');
                            $scope.ylb.selectedPer_scfswpcs = req.data.scfswpcs.split(',');
                        }
                    }
            })
            $http.get("riskSourceTwo/getQyScenarioAnalysis?"+'qyId='+companyId+'&pageNo='+$scope.items.tfhjpageNo+'&pageSize='+$scope.items.tfhjpageSize).then(function (req) {
                    $scope.ylb.qyscenario = req.data.dataList;
                    $scope.items.tfhjpageSize = req.data.pageSize;
                    $scope.items.tfhjtotalCount = req.data.totalCount;
            })
            $http.get("riskSource/getProductionUnit?"+'&companyId='+companyId).then(function (req) {
                    $scope.ylb.proLists = req.data
            })
            // $http.get("riskSource/getProtectionObject?"+'&companyId='+companyId).then(function (req) {
            //         $scope.ylb.targetLists = req.data
            //         //console.log($scope.targetLists)
            //     })
            $http.get("riskSourceTwo/getRiskReceptor?"+'qyId='+companyId+'&stlx='+$scope.ylb.hjbhmb.stlx+'&pageNo='+$scope.items.hjbhmbPageNo+'&pageSize='+$scope.items.hjbhmbpageSize).then(function (req) {
                    $scope.ylb.targetLists = req.data.dataList;
                    $scope.items.hjbhmbpageSize = req.data.pageSize;
                    $scope.items.hjbhmbtotalCount = req.data.totalCount;
            })
            $http.get("riskSource/getAccidentSource?"+'&companyId='+companyId).then(function (req) {
                    $scope.ylb.accidents = req.data
                    //console.log($scope.accidents)
                })
            $http.get('riskSource/getEmergencySubstance?'+'&companyId='+companyId+'&pageNo='+$scope.items.pageNo+'&pageSize='+$scope.items.pageSize).then(function (data) {
                $scope.ylb.storages = data.data.dataList;
                $scope.items.pageSize = data.data.pageSize;
                $scope.items.totalCount = data.data.totalCount;
                //console.log($scope.storages)
            })
            $http.get('riskSource/getEmergencyCrew?'+'&companyId='+companyId).then(function (data) {
                $scope.ylb.phones = data.data;
                //console.log($scope.phones)
            })
            $http.get('riskSource/getForeignAidUnit?'+'&companyId='+companyId).then(function (data) {
                $scope.ylb.emergency = data.data;
                //console.log($scope.emergency)
            })
            $http.get('riskSource/getEmergencySpecialist?'+'&companyId='+companyId).then(function (data) {
                $scope.ylb.experts = data.data;
                //console.log($scope.experts)
            })
            $http.get('riskSourceTwo/getProductionProcess?'+'qyId='+companyId+'&gylx='+$scope.ylb.scgygylx+'&pageNo='+$scope.items.scgypageNo+'&pageSize='+$scope.items.scgypageSize).then(function (data) {
                $scope.ylb.scgyLists = data.data.dataList;
                $scope.items.scgypageSize = data.data.pageSize;
                $scope.items.scgytotalCount = data.data.totalCount;
            })
            // 查询环境风险物质名称
            $http.get('riskSourceTwo/getFxwzLjlByName').then(function (req) {
                $scope.ylb.risksubstancesOldCombo = req.data;
                $scope.ylb.risksubstancesCombo = req.data;
            })
        }
        //风险物质名称下拉框搜索
        $scope.hjfxwzselected = function($event){
            var combo = $scope.ylb.risksubstancesCombo;
            var name = $scope.ylb.td8.name;
            var comboarr = [];
            if(name != ''){
                for(var i=0; i<combo.length; i++){
                    if(combo[i].wzmc.indexOf(name)>-1){
                        comboarr.push(combo[i])
                    }
                }
                $scope.ylb.risksubstancesCombo = comboarr
            }else{
                $scope.ylb.risksubstancesCombo = $scope.ylb.risksubstancesOldCombo
            }
        }
        //风险物质下拉框选中
        $scope.hjfxwzclick = function(name,ljl){
            $scope.ylb.td8.name = name
            $scope.ylb.td8.ljl = ljl
            $scope.tb8focus = false
        };
        $scope.getYlb();
        $scope.isSelected = function(id,type,index){
            if(index != undefined){
                return $scope.ylb.selectedPer_pfqx[index].indexOf(id)>=0
            }else{
                return $scope.ylb['selectedPer_'+type].indexOf(id)>=0
            }
        };
        $scope.updateSelected = function (action,type, id, name) {
            if (action == 'add' && $scope.ylb['selectedPer_'+type].indexOf(id) == -1) {
                $scope.ylb['selectedPer_'+type].push(id);
            }
            if (action == 'remove' && $scope.ylb['selectedPer_'+type].indexOf(id) != -1) {
                var idx = $scope.ylb['selectedPer_'+type].indexOf(id);
                $scope.ylb['selectedPer_'+type].splice(idx, 1);
            }
        }
        $scope.updateYSSelected = function (action,type, id,index) {
            if ($scope.ylb.selectedPer_pfqx[index].indexOf(id) == -1) {
                $scope.ylb.selectedPer_pfqx[index].push(id);
            }else if ($scope.ylb.selectedPer_pfqx[index].indexOf(id) != -1) {
                var idx = $scope.ylb.selectedPer_pfqx[index].indexOf(id);
                $scope.ylb.selectedPer_pfqx[index].splice(idx, 1);
            }
        }
        //判断是在集合$scope.selected里去掉此id，还是加上id
        $scope.updateSelection = function ($event,type, id) {
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            $scope.updateSelected(action, type,id, checkbox.name);
        }
        $scope.showBig = function() {
            $scope.bigImg = true
        }
        function  showBig(){
            $scope.bigImg = true
        }
        //提示框
        $scope.alertTask = function () {
            $("#comInfo").fadeIn(200);
            $('.task-alert').fadeIn(300);
            $scope.textContent = '确定保存吗?';
        };
        //关闭提示框
        $scope.resetAlert = function (text) {
            $("#comInfo").fadeOut(200);
            $('.task-alert').fadeOut(300);
        };
        //关闭成功提示框
        $scope.sureAlert = function (text) {
            $("#comInfo").fadeOut(200);
            $(".tasks-alert").fadeOut(300);
        };
        //动态添加产品信息
        $scope.addcompanyDiv = function () {
            var Infos = {
                companyId: $rootScope.userList.companyId,
                id: '',
                name: '',
                number: ''
            };
            $scope.ylb.companyIntro.productInfos.push(Infos);
        }
        //动态删除产品信息
        $scope.removecompanyDiv = function(index,item){
            $scope.ylb.companyIntro.productInfos.splice(index, 1);
            if(item.id != ''){
                $http.get('riskSourceTwo/productInfo/delete/'+item.id)
                    .then(function (req) {
                        alert('删除成功！');
                    });
            }
        }
        //企业概况保存
        $scope.saveCompanyIntro = function () {
            var prdinfo = $scope.ylb.companyIntro.productInfos;
            var companytype = $scope.ylb.companyIntro.type;
            if(prdinfo.length>0){
                for(var i=0; i<prdinfo.length; i++){
                    if(prdinfo[i].id == ''){
                        $http.post('riskSourceTwo/productInfo/save',prdinfo[i])
                            .then(function (req) {
                            });
                    }else{
                        $http.post('riskSourceTwo/productInfo/update',prdinfo[i])
                            .then(function (req) {
                            });
                    }
                }
            }
            if($scope.ylb.companyIntro.type == '1'){
                $scope.ylb.companyIntro.longitude = $scope.ylb.companyIntro.longitude1 + '°'+$scope.ylb.companyIntro.longitude2 + '′'+$scope.ylb.companyIntro.longitude3 + '″';
                $scope.ylb.companyIntro.latitude = $scope.ylb.companyIntro.latitude1 + '°'+$scope.ylb.companyIntro.latitude2 + '′'+$scope.ylb.companyIntro.latitude3 + '″';
            }
            delete $scope.ylb.companyIntro.longitude1;
            delete $scope.ylb.companyIntro.longitude2;
            delete $scope.ylb.companyIntro.longitude3;
            delete $scope.ylb.companyIntro.latitude1;
            delete $scope.ylb.companyIntro.latitude2;
            delete $scope.ylb.companyIntro.latitude3;
            delete $scope.ylb.companyIntro.type;
            $http.post('riskSourceTwo/enterpriseInfo/update?type='+companytype,$scope.ylb.companyIntro)
                .then(function (req) {
                    $('.task-alert').fadeOut(200);
                }).then(function () {
                    $('.tasks-alert').fadeIn(300);
                    $scope.getYlb()
                });
        }

        //宏观数据图保存
        $scope.saveRiskFile = function () {
            var fileName = $('#txt').val();
            var filearr=fileName.split("\\");
            var file_name=filearr[filearr.length-1];  //解决获取为全路径的文件名问题
            var lastfileName = fileName.substring(fileName.lastIndexOf(".")+1,fileName.length);
            var fd = new FormData();
            if(lastfileName != 'png' && lastfileName != 'jpg' && lastfileName != 'gif' && lastfileName != 'jpeg'){
                alert("请上传图片格式的附件！");
                return;
            }
            fd.append("file", document.querySelector('input[type=file]').files[0]);
            $.ajax({
                type: "POST",
                url: "riskSourceTwo/file/upload?companyId="+encodeURIComponent($rootScope.userList.companyId)+'&name='+file_name+'&type='+$scope.type,
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
                    alert('保存成功！');
                    $('#txt').val('');
                    $scope.getYlb()
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
        }
        //删除宏观数据图
        $scope.deleteRiskFile = function (id) {
            $http.get('riskSourceTwo/file/delete/'+id)
                .then(function (req) {
                    alert('删除成功！');
                    $scope.getYlb()
                });
        }
        //放大宏观数据图
        $scope.showRiskFileImg = function (id) {
            $scope.bigImg = true;
            $scope.RiskFileid = id;
        }
        $scope.saveIntro = function () {
            $http({
                url:'riskSource/updateCompanyDetails',
                data:$scope.ylb.companyIntro,
                method:'POST',
                transformResponse:function(data){
                    return data;
                }
            }).then(
                function (req) {
                    if(req.data=='success'){
                        alert('保存成功！')
                    }
                    $scope.getYlb()
                }
            )
            function showBig(){
                $scope.bigImg = true
            }
            var fd = new FormData();
            fd.append("file", document.querySelector('input[type=file]').files[0]);
            $.ajax({
                type: "POST",
                url: "riskSource/uploadAttachment?companyId="+encodeURIComponent($rootScope.userList.companyId)+'&name='+'comImg.jpg' + "&type=1",
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
                    $scope.getcqpmt()
                    function showBig(){
                        $scope.bigImg = true
                    }
                    var imgUrl='riskSource/downloadAttachment?companyId='+$rootScope.userList.companyId+'&type=1'
                    if($('#imghead')){
                        $('#imghead').remove();
                        $('.bigImg').remove()
                    }
                    $('#imgCon').append("<img id='imghead' src="+imgUrl+" >")
                    $('.bigCon').append("<img class='bigImg' src="+imgUrl+" >")
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
        }
        //动态添加环境风险要素排口信息
        $scope.addriskfactorsDiv = function () {
            var nowindex = $scope.ylb.riskfactors.pkinfos.length;
            $scope.ylb.selectedPer_pfqx[nowindex] = [];
            var Infos = {
                riskfactors_id: $scope.ylb.riskfactors.riskfactors_Id,
                name : '',
                jd: '',
                wd: '',
                pfqx: '',
                qt : '',
                snst : '',
                uuid : ''
            };
            $scope.ylb.riskfactors.pkinfos.push(Infos);
        }
        //动态删除环境风险要素排口信息
        $scope.removeriskfactorsDiv = function(index,item){
            if(item.uuid != ''){
                $http.get('riskSourceTwo/deleteRiskFactorsPKList/'+item.uuid) .then(function (req) {
                    $('.task-alert').fadeOut(200);
                }).then(function () {
                    $('.tasks-alert').fadeIn(300);
                });
            }
            $scope.ylb.riskfactors.pkinfos.splice(index, 1);
        }
        //环境风险要素-保存
        $scope.saveRiskFactors = function () {
            for(var i=0; i<$scope.ylb.riskfactors.pkinfos.length; i++){
                $scope.ylb.riskfactors.pkinfos[i].pfqx = $scope.ylb.selectedPer_pfqx[i].join(',');
            }
            $http.post('riskSourceTwo/updateRiskFactors',$scope.ylb.riskfactors)
                .then(function (req) {
                    $('.task-alert').fadeOut(200);
                }).then(function () {
                    $('.tasks-alert').fadeIn(300);
                    $scope.getYlb()
                });
        }
        //环境风险防控设施新增、更新
        $scope.saveRiskMeasures = function () {
            if($scope.ylb.riskmeasures.id == ''){
                var url = 'riskSourceTwo/RiskControlMeasures/save';
            }else{
                var url = 'riskSourceTwo/riskControlMeasures/update';
            }
            $scope.ylb.riskmeasures.jlcs =  $scope.ylb.selectedPer_jlcs.join(',');
            $scope.ylb.riskmeasures.sgfssjcs =  $scope.ylb.selectedPer_sgfssjcs.join(',');
            $scope.ylb.riskmeasures.qjfsxtcs =  $scope.ylb.selectedPer_qjfsxtcs.join(',');
            $scope.ylb.riskmeasures.yspsxtfxfkcs =  $scope.ylb.selectedPer_yspsxtfxfkcs.join(',');
            $scope.ylb.riskmeasures.scfswpcs =  $scope.ylb.selectedPer_scfswpcs.join(',');
            delete $scope.ylb.riskmeasures.FXLX;
            $http({
                url:url,
                data:$scope.ylb.riskmeasures,
                method:'POST',
                transformResponse:function(data){
                    return data;
                }
            }).then(function (req) {
                $('.task-alert').fadeOut(200);
            }).then(function () {
                $('.tasks-alert').fadeIn(300);
                $scope.getYlb()
            });
        }
        $scope.selectCheckbox = function(e){
            console.log(e)
        }
        //环境风险受体整体信息保存
        $scope.saveWaterhjbhmb = function(){
            $scope.ylb.hjbhmbWhole.shjfxstmgcd =  $scope.ylb.selectedPer_hjbhmb.join(',');
            $http({
                url:'riskSourceTwo/updateRiskReceptorWithCompany',
                data:$scope.ylb.hjbhmbWhole,
                method:'POST',
                transformResponse:function(data){
                    return data;
                }
            }).then(function (req) {
                $('.task-alert').fadeOut(200);
            }).then(function () {
                $('.tasks-alert').fadeIn(300);
                $scope.getYlb()
            });
        }

        //excel导入
        $scope.openFileEntry = function (type) {
            var body
            var modalInstance = $uibModal.open({
                templateUrl: "partials/pop/enterFileUpload.html",
                controller: "enterFileUploadCtrl",
                backdrop: 'static',
                size: 'moniPop',
                resolve: {
                    body:{
                        type:type
                    }
                }
            });
            modalInstance.result.then(function() {
                $scope.getYlb()
            })
        }
        $scope.changeFile = function(){
            console.log($scope.upContent)
        }
        $scope.postYlb=function (n) {//新增
            switch (n){
                case 1:
                    $http.post('rest/dc/'+$rootScope.userList.access+'/ProductionUnit',$scope.ylb.td1)
                        .then(function (req) {
                            alert('添加成功！')
                            $state.go('msgManage.sczzq')
                    })
                    break;
                case 2:
                    $http.post('riskSourceTwo/addRiskReceptor',$scope.ylb.td2)
                        .then(function (req) {
                            alert('添加成功！')
                            $state.go('msgManage.hjbhmb')
                        })
                    break;
                case 3:
                    $http.post('rest/dc/'+$rootScope.userList.access+'/AccidentSource  ',$scope.ylb.td3)
                        .then(function (req) {
                            alert('添加成功！')
                            $state.go('msgManage.hjwrsgy')
                        })
                    break;
                case 4:
                    $http.post('rest/dc/'+$rootScope.userList.access+'/EmergencySubstance ',$scope.ylb.td4)
                        .then(function (req) {
                            alert('添加成功！')
                            $state.go('msgManage.yjwz')
                        })
                    break;
                case 5:
                    $http.post('rest/dc/'+$rootScope.userList.access+'/EmergencyCrew',$scope.ylb.td5)
                        .then(function (req) {
                            alert('添加成功！')
                            $state.go('msgManage.yjzhtxl')
                        })
                    break;
                case 6:
                    $http.post('rest/dc/'+$rootScope.userList.access+'/ForeignAidUnit ',$scope.ylb.td6)
                        .then(function (req) {
                            alert('添加成功！')
                            $state.go('msgManage.yjwbllb')
                        })
                    break;
                case 7:
                    $http.post('rest/dc/'+$rootScope.userList.access+'/EmergencySpecialist',$scope.ylb.td7)
                        .then(function (req) {
                            alert('添加成功！')
                            $state.go('msgManage.yjzj')
                        })
                    break;
                case 8:
                    $http.post('riskSourceTwo/addHjRiskSubstances',$scope.ylb.td8)
                        .then(function (req) {
                            alert('添加成功！')
                            $state.go('msgManage.hjfxwz')
                        })
                    break;
                case 9:
                    $http.post('riskSourceTwo/RiskSourceUnit/save',$scope.ylb.td9)
                        .then(function (req) {
                            alert('添加成功！')
                            $state.go('msgManage.hjfxdy')
                        })
                    break;
                case 10:
                    $http.post('riskSourceTwo/addQyScenarioAnalysis',$scope.ylb.td10)
                        .then(function (req) {
                            alert('添加成功！')
                            $state.go('msgManage.tfhjsjqjfx')
                        })
                    break;
                case 11:
                    $scope.ylb.scgy.gyName = $scope.ylb.scgy.gylx == '1'? $scope.ylb.scgy.gyName1:$scope.ylb.scgy.gyName2;
                    delete $scope.ylb.scgy.gyName1;
                    delete $scope.ylb.scgy.gyName2;
                    $http.post('riskSourceTwo/addProductionProcess',$scope.ylb.scgy)
                        .then(function (req) {
                            alert('添加成功！')
                            $state.go('msgManage.scgy')
                        })
                    break;
            }
        }
        $scope.editYlb=function (n) {//修改
            switch (n){
                case 1:
                    $http.post('rest/dc/'+$rootScope.userList.access+'/ProductionUnit/'+$stateParams.id,$scope.ylb.td1)
                        .then(function (req) {
                            alert('修改成功！')
                            $state.go('msgManage.sczzq')
                        })
                    break;
                case 2:
                    $http.post('riskSourceTwo/updateRiskReceptor',$scope.ylb.td2)
                        .then(function (req) {
                            alert('修改成功！')
                            $state.go('msgManage.hjbhmb')
                        })
                    break;
                case 3:
                    $http.post('rest/dc/'+$rootScope.userList.access+'/AccidentSource/'+$stateParams.id,
                        $scope.ylb.accidents[$scope.items.index])
                        .then(function (req) {
                            alert('修改成功！')
                            $state.go('msgManage.hjwrsgy')
                        })
                    break;
                case 4:
                        $http.post('rest/dc/'+$rootScope.userList.access+'/EmergencySubstance/'+$stateParams.id,$scope.ylb.td4)
                    // $http.post('rest/dc/'+$rootScope.userList.access+'/EmergencySubstance/'+$stateParams.id,
                    //     $scope.ylb.storages[$scope.items.index])
                        .then(function (req) {
                            alert('修改成功！')
                            $state.go('msgManage.yjwz')
                        })
                    break;
                case 5:
                    $http.post('rest/dc/'+$rootScope.userList.access+'/EmergencyCrew/'+$stateParams.id,
                        $scope.ylb.phones[$scope.items.index])
                        .then(function (req) {
                            alert('修改成功！')
                            $state.go('msgManage.yjzhtxl')
                        })
                    break;
                case 6:
                    $http.post('rest/dc/'+$rootScope.userList.access+'/ForeignAidUnit/'+$stateParams.id,
                        $scope.ylb.emergency[$scope.items.index])
                        .then(function (req) {
                            alert('修改成功！')
                            $state.go('msgManage.yjwbllb')
                        })
                    break;
                case 7:
                    $http.post('rest/dc/'+$rootScope.userList.access+'/EmergencySpecialist/'+$stateParams.id,
                        $scope.ylb.experts[$scope.items.index])
                        .then(function (req) {
                            alert('修改成功！')
                            $state.go('msgManage.yjzj')
                        })
                    break;
                case 8:
                    $http.post('riskSourceTwo/updateHjRiskSubstances',$scope.ylb.td8)
                        .then(function (req) {
                            alert('修改成功！')
                            $state.go('msgManage.hjfxwz')
                        })
                    break;
                case 9:
                    $http.post('riskSourceTwo/RiskSourceUnit/update',$scope.ylb.td9)
                        .then(function (req) {
                            alert('修改成功！')
                            $state.go('msgManage.hjfxdy')
                        })
                    break;
                case 10:
                    $http.post('riskSourceTwo/updateQyScenarioAnalysis',$scope.ylb.td10)
                        .then(function (req) {
                            alert('修改成功！')
                            $state.go('msgManage.tfhjsjqjfx')
                        })
                    break;
                case 11:
                    $scope.ylb.scgy.gyName = $scope.ylb.scgy.gylx == '1'? $scope.ylb.scgy.gyName1:$scope.ylb.scgy.gyName2;
                    delete $scope.ylb.scgy.gyName1;
                    delete $scope.ylb.scgy.gyName2;
                    $http.post('riskSourceTwo/updateProductionProcess',$scope.ylb.scgy)
                        .then(function (req) {
                            alert('修改成功！')
                            $state.go('msgManage.scgy')
                        })
                    break;
            }
        }
        $scope.deltr=function (item,n) {//删除
            switch (n) {
                case 1:
                    $http.delete('rest/dc/' + $rootScope.userList.access +'/ProductionUnit/' + item.productionUnitId)
                        .then(function (req) {
                            alert('删除成功！')
                            $scope.getYlb();
                        });
                    break;
                case 2:
                    $http.get('riskSourceTwo/deleteRiskReceptor?id='+item.riskreceptor_Id)
                        .then(function (req) {
                            alert('删除成功！')
                            $scope.getYlb();
                        });
                    break;
                case 3:
                    $http.delete('rest/dc/' + $rootScope.userList.access +'/AccidentSource/' + item.accidentsource_Id)
                        .then(function (req) {
                            alert('删除成功！')
                            $scope.getYlb();
                        });
                    break;
                case 4:
                    $http.delete('rest/dc/'+$rootScope.userList.access+'/EmergencySubstance/'+item.emergencySubstanceId )
                        .then(function (req) {
                            alert('删除成功！')
                            $scope.getYlb();
                        })
                    break;
                case 5:
                    $http.delete('rest/dc/'+$rootScope.userList.access+'/EmergencyCrew/'+item.emergencyCrewId)
                        .then(function (req) {
                            alert('删除成功！')
                            $scope.getYlb();
                        })
                    break;
                case 6:
                    $http.delete('rest/dc/'+$rootScope.userList.access+'/ForeignAidUnit/'+item.foreignAidUnitId)
                        .then(function (req) {
                            alert('删除成功！')
                            $scope.getYlb();
                        })
                    break;
                case 7:
                    $http.delete('rest/dc/'+$rootScope.userList.access+'/EmergencySpecialist/'+item.emergencySpecialistId)
                        .then(function (req) {
                            alert('删除成功！')
                            $scope.getYlb();
                        })
                    break;
                case 8:
                    $http.get('riskSourceTwo/deleteHjRiskSubstances?id='+item.hjrisksubstances_Id)
                        .then(function (req) {
                            alert('删除成功！')
                            $scope.getYlb();
                        })
                    break;
                case 9:
                    $http.get('riskSourceTwo/RiskSourceUnit/delete/'+item.id)
                        .then(function (req) {
                            alert('删除成功！')
                            $scope.getYlb();
                        })
                    break;
                case 10:
                    $http.get('riskSourceTwo/deleteQyScenarioAnalysis?id='+item.qyscenarioanalysis_Id)
                        .then(function (req) {
                            alert('删除成功！')
                            $scope.getYlb();
                        })
                    break;
                case 11:
                    $http.get('riskSourceTwo/deleteProductionProcess?id='+item.productionProcess_Id)
                        .then(function (req) {
                            alert('删除成功！')
                            $scope.getYlb();
                        })
                    break;
            }
        }

        //console.log($scope.items.type)
        //console.log($scope.ylb[$scope.items.type])
        //console.log($scope.ylb['phones'][$scope.items.index])
    });
    app.controller('enterFileUploadCtrl',['$rootScope','$scope', '$http','$stateParams','body', '$uibModalInstance', '$timeout', function ($rootScope,$scope, $http,$stateParams,body, $uibModalInstance,$timeout,op, select) {
        $scope.enterfileUpload = function () {
            var fd = new FormData();
            fd.append("file", document.querySelector('input[type=file]').files[0]);
            $.ajax({
                type: "POST",
                url: "yjInfosImport/addYjzjExcel?companyId="+encodeURIComponent($rootScope.userList.companyId),
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
    }])
    //生态环境部门环境隐患台账
    app.controller("environmentAccountCtrl", function ($rootScope, $scope, $http,$uibModal) {
        $scope.msgObj = {}
        $scope.msgObj.test=[]

        $scope.searchMsg=function () {
            $scope.pageType=2;
            $('.loader').show();
            $scope.items.strTime=new Date($scope.items.strTime).getTime();
            $http.get('dzm/environmentAccount.json')
                .then(function (req) {
                    $('.loader').hide();
                    $scope.obj=req.data;
                    if($scope.obj.length==0){
                        $scope.noData=true;
                    }else {
                        $scope.noData=false;
                    }
                });
        };
        function init() {
            $scope.items={
                strTime:new Date(),
                endTime:new Date(),
            };
            $scope.searchMsg();
        }
        init();
    })
});
