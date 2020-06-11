define(["app"], function(app) {
    app.controller("emergencyMng",function($rootScope,$scope, $http, $state,$uibModal,mapSet, olHelpers, olData, $interval, sucHelpers, $timeout){
        $scope.emergency={
            bodyH:500,
            timer:null,
            loading:false,
            pages:{
                pageNo:1,
                pageSize:getRows(),
                total:0
            },
            events:[],
            getEvents:_getEvents,
            deleteEvent:_deleteEvent,
            autoFresh:_autoFresh,
            eventsClick:_eventsClickHandler,
            initialize:_initialize
        };

        function getRows(){
            var out = $(".emergencyOuter").height();
            var head = 240;
            var rows =parseInt((out - head)/42);
            return rows;
        };

        function _rightTabClick(attr){
            this[attr].show=!this[attr].show;
        };

        //获取应急模拟列表
        function _getEvents(){
            var url = "AtmosphericEvent/listEvent";
            var self = this;
            self.loading = true;
            self.events.length = 0;
            var params = {
                companyId:"",
                name:self.keyword,
                pageNo:self.pages.pageNo,
                pageSize:self.pages.pageSize
            };
            $http.get(url,{params:params}).then(function(data){
                var res = data.data;
                if(res.dataList){
                    self.pages.total = res.totalCount;
                    self.events = res.dataList;
                }
                self.loading = false;
            },function(err){
                console.log(err);
                self.loading = false;
            })
        };

        //删除事件
        function _deleteEvent(id){
            var url = "rest/dc/"+$rootScope.userList.access+"/AtmosphericEvent/"+id;
            var self = this;
            $http.delete(url).then(function(data){
                self.getEvents();
            },function(err){
                console.log(err);
            });
        };

        function _autoFresh(){
            var self = this;
            if(self.timer){
                $timeout.cancel(this.timer);
            }
            self.timer = $timeout(function(){
                self.getEvents();
            },60000);
        };

        //应急模拟列表操作方法
        function _eventsClickHandler(type,data){
            var self = this;
            if(type == "moni"){
                var msg = data.status=="1"?"模型计算未完成":"模型计算失败";
                if(data.status!="2"){
                    alert(msg+",无法进行模拟演示!");
                    return;
                }
                $state.go("riskPrevention.riskSpatial.emergencyMoni",{eid:data.id,companyId:data.companyId});
            }
            else if(type == "delete"){
                if(window.confirm("确认删除该事件吗?")){
                    self.deleteEvent(data.id);
                }
            }
            else{
                var modalInstance = $uibModal.open({
                    templateUrl: "partials/pop/emergencyModal.html",
                    controller: "emergencyModalPopCtrl",
                    backdrop: 'static',
                    size: 'moniPop',
                    resolve: {
                        body:function(){
                            return {type:type,data:angular.copy(data)}
                        }
                    }
                });
                modalInstance.result.then(function (data) {
                    self.getEvents();
                }, function () {});
            }
        };

        function _initialize(){
            $rootScope.system = "new";
            this.getEvents();
            this.autoFresh();
        };

        $scope.$on("$destroy",function(){
            $rootScope.system = "old";
        });

        $scope.emergency.initialize();


    })
    .controller("emergencyModalPopCtrl",function($scope,$http,$q,$uibModalInstance,$timeout,$interval,body,getCompany){
        var timer = null;
        var statuMap = {
            "1":"red",
            "2":"yellow",
            "3":"green"
        };
        var titlemap = {
            "add":"新增模拟",
            "detail":"模拟详情",
            "update":"更新模拟"
        };
        var port = {
            add:"AtmosphericEvent/addEvent"
        };
        $scope.modal = {
            title:titlemap[body.type],
            status:"1",
            type:body.type,
            uploading:false,
            statusBg:"red",
            form:{},
            step:{
                index:1
            },
            company:{
                list:[],
                formatter:{
                    label:"COMPANYNAME",
                    value:"COMPANYID"
                },
                changed:companyChanged
            },
            fileChange:fileChange,
            start:start,
            cancel:_cancel,
            close:_close,
            send:_send,
            initialize:_initialize
        };

        $scope.progress = {
            index:0,
            list:[
                {name:"开始"},
                {name:"加载"},
                {name:"配置"},
                {name:"完成"}
            ],
            active:progressActive
        };

        function companyChanged(id,company){
            $scope.modal.form.companyId = id;
            $scope.modal.form.companyName = company.COMPANYNAME;
        };

        function progressActive(index){
            this.list.forEach(function(point,i){
                if(i<index){
                    point.processed = true;
                }
                else if(i==index){
                    point.processed = true;
                    point.selected = true;
                }else{
                    point.processed = false;
                    point.selected = false;
                }
            });
        };

        function testParams(){
            var form  = $scope.modal.form;
            if(!form.name){
                alert("请先输入应急事件！");
                e.stopPropagation();
                return;
            }
            if(!form.time){
                alert("请先输入模拟时间！");
                e.stopPropagation();
                return;
            }
            if(!form.eventType){
                alert("请先选择模型类别！");
                e.stopPropagation();
                return;
            }
        };

        function start(e){
            testParams();
            $("#modal-file").click();
        };

        function fileChange(file){
           var fileType = file.name.split(".").pop();
           if(fileType!="json"){
               alert("请选择json格式的文件！");
               return;
           }
            $scope.progress.index = 1;
            readFile(file).then(calculate);
        };

        function readFile(file){
            var defer = $q.defer();
            var fileReader = new FileReader();
            fileReader.readAsText(file);
            fileReader.onload = function(e){
                defer.resolve(e.target.result);
            };
            return defer.promise;
        };

        //计算
        function calculate(config){
            var randomTime = parseInt((Math.random()*2 + 3)*1000); 
            $scope.modal.config = JSON.parse(config);
            $scope.progress.index = 2;
            $timeout(function(){
                $scope.progress.index = 3;
                $scope.modal.step.index = 3;
                $scope.modal.status = 3;
            },randomTime);
        };

        function _cancel(){
            $uibModalInstance.dismiss();
        };

        function _close(data){
            $uibModalInstance.close(data);
        };

        function _send(){
            var self = this;
            var url = self.type== "add"?port.add:port.update;
            var type = this.form.eventType;
            var config = angular.copy(this.config);
            this.form.args = JSON.stringify(this.config);
            this.form.pollutant = config.pollutant;
            this.form.halfdeadRange = config.halfdeadRange;
            this.form.harmRange = config.harmRange;
            this.form.lg = config.lg;
            this.form.lt = config.lt;
            this.form.amount = this.form.amount || config.amount;
            this.form.colors = config.colors?config.colors.join(","):"";
            this.form.levels = config.levels?config.levels.join(","):"";
            this.form.time = this.form.time?new Date(this.form.time):null;
            $http({
                url:url,
                method:"POST",
                data:this.form,
                transformResponse:function(data){
                    return data;
                }
            })
            .then(function(simulationId){
                self.close(simulationId);
            },function(err){
                console.log(err);
            });
        };

        function _initialize(){
            var self = this;
            getCompany().then(function(companys){
                self.company.list = companys;
            });
            if(self.type == "add"){
                self.step.index = 1;
                self.statusBg = "red";
                self.status = "1";
            }else{
                self.statusBg = "green";
                self.status = "3";
                self.form=body.data;
            }
        };

        $scope.$watch("progress.index",function(n,o){
            $scope.progress.active(n);
        });

        $scope.modal.initialize();



    })
    .filter("eventMoniStatu",function(){
        return function(input){
            var statumap={
                "1":"计算中",
                "2":"已完成",
                "3":"计算失败"
            };
            return statumap[input];
        }
    })
    .filter("eventType",function(){
        return function(input){
            var statumap={
                "1":"气模型",
                "2":"水模型"
            };
            return statumap[input];
        }
    })
    .factory("getCompany",function($q,$http){
        var company = [];
        return function(){
            var defer = $q.defer();
            if(company.length>1){
                defer.resolve(company);
            }
            else{
                var url = "riskSource/listRiskSouce";
                $http.get(url).then(function(data){
                    var res = data.data;
                    if(res && angular.isArray(res)){
                        res.unshift({COMPANYID:"",COMPANYNAME:"选择企业"});
                        company = angular.copy(res);
                        defer.resolve(res);
                    }
                });
            }
            return defer.promise;
        }
    })
    
});