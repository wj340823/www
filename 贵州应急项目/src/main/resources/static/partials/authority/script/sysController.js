define(['app'], function (app) {
    app.controller("sysCtrl", function ($scope, $http, $rootScope) {
        function init() {
        }
        init();
        $rootScope.system="new";
        $scope.$on("$destroy",function(){
            $rootScope.system="";
        });
        init();
    })
});
