define(['app'], function (app) {
    app.controller("indexCtrl", function ($rootScope, $scope, $http, mapSet, chartSet,$timeout) {
        $rootScope.system = 'new'
        $scope.$on("$destroy",function(){
            $rootScope.system="";
        });
        function init() {

        }
        init()
    });
});
