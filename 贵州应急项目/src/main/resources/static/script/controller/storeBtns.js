define(['app'], function (app) {
    app.controller("storeBtns", function ($scope, $http, mapSet, chartSet, $rootScope) {
        $scope.materialDetail.anaData.curMonth = 2;

        //        关闭详情框
        $scope.closeStroage = function () {
            $scope.materialDetail.reserveShow = false;
            $scope.materialDetail.anaShow = false;
            $scope.materialDetail.videoShow = false;
            $rootScope.$emit('closeStroages', false);
        }

    });
    app.controller("enterStoreBtns", function ($scope, $http, mapSet, chartSet, $rootScope) {
            //获取企业物资
            $scope.items = {
                list:null,
                pageNo:1,
                pageSize:15,
                totalCount:10
            }
            $scope.getSubList = function(){
                $http.get('riskSource/getEmergencySubstance?&companyId='+encodeURIComponent($scope.selectedLayid)+'&pageNo='+$scope.items.pageNo).then(function(req){
                    $scope.items.list = req.data.dataList;
                    $scope.items.pageSize = req.data.pageSize;
                    $scope.items.totalCount = req.data.totalCount;
                })
            }
            $scope.getSubList()
            //        关闭详情框
            $scope.closeStoreLay = function () {
                $scope.risk.material.forEach(function (s) {
                    if (s.id == $scope.selectedLayid) {
                        s.clickLabel.remove = true;
                        $scope.selectPos.visible = false;
                    }
                })
            }
        });
});
