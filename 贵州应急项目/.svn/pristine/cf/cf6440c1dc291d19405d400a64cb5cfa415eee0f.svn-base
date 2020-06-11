define(['app', 'sucHelpers2'], function (app) {
    app.controller("userCtrl", function ($scope, $http, $rootScope, $uibModal, sucHelpers1, $state) {
        $scope.user = {};
        $scope.user.table = {
            headList: ['序号', '用户名', '行政区划','上级区划','角色', '姓名', '手机号'],
            searchList: [{
                key: 'account',
                name: '用户名'
            }, {
                key: 'displayName',
                name: '姓名'
            }]
        };
        $scope.user.pages = {
            totalCount: 0,
            currentPageNo: 1,
            pageSize: 8,
        }
        $scope.user.refresh = function (allContent, content, currentPageNo) {
            $http.get("rest/authox/users").then(function (data) {
                $scope.user.table.allContent = data.data;
                $scope.user.pages.totalCount = data.data.length;
                $scope.user.pages.currentPageNo = 1;
                console.log($scope.user.table.allContent)
                $scope.user.table.content = data.data.slice(0, $scope.user.pages.pageSize);
            });
        }
        $scope.user.refresh();
        $scope.user.table.searchName = 'account';
        $scope.user.search = function () {
            $http.get('rest/authox/users/like?key=' + $scope.user.table.searchName + '&value=' + ($scope.user.searchValue || '')).then(function (data) {
                $scope.user.table.content = data.data.slice(0, $scope.user.pages.pageSize);;
            })
        }
        $scope.user.pageChanged = function (currentPageNo) {
            $scope.user.table.content = $scope.user.table.allContent.slice((currentPageNo - 1) * $scope.user.pages.pageSize, currentPageNo * $scope.user.pages.pageSize);
        }
        $scope.user.delUser = function (item) {
        	if(confirm("确认删除？")){
                $http({
                    method: "delete",
                    url: "rest/authox/users/" + item.uid
                }).then(function (data) {
                    $scope.user.refresh();
                })
        	}
        }
        $scope.user.addUser = function (op, select) {
            var modalInstance = $uibModal.open({
                templateUrl: "partials/authority/system/user/addUser.html",
                controller: "addUserCtrl",
                backdrop: 'static',
                size: 'role',
                resolve: {
                    op: function () {
                        return angular.copy(op);
                    },
                    select: function () {
                        return angular.copy(select)
                    }
                }
            });
            modalInstance.result.then(function (i) {
                if (i === 1) {
                    $scope.user.refresh();
                } else {
                    $http({
                        method: "get",
                        url: "rest/authox/users/" + $scope.user.select.info.uid
                    }).then(function (data) {
                        $scope.user.select.info = data.data;
                    })
                }
            }, function () {});
        };
        //sucHelpers.extend($scope.user, $scope.suc.user);
    }).controller('userSelectCtrl', function ($scope, $stateParams, $http, sucHelpers1, $uibModal) {
    	$scope.user={};
        $scope.user.select = {};
        $http({
            method: "get",
            url: "rest/authox/users/" + $stateParams.key
        }).then(function (data) {
            $scope.user.select.info = data.data;
        })
        $http({
            method: "get",
            url: "rest/authox/users/" + $stateParams.key + "/roles"
        }).then(function (data) {
            $scope.user.select.roles = data.data;
        })
        $http({
            method: "get",
            url: "rest/authox/users/" + $stateParams.key + "/groups"
        }).then(function (data) {
            $scope.user.select.groups = data.data;
        })
                
        $scope.user.resetKey = function () {
            if (confirm("确认重置该用户密码为123456？")) {
                $http.post('rest/authox/users/' + $scope.user.select.info.uid + '/resetPassword ').then(function (data) {
                    alert('重置成功');
                })
            }
        };
        $scope.user.addUser = function (op, select) {
            var modalInstance = $uibModal.open({
                templateUrl: "partials/authority/system/user/addUser.html",
                controller: "addUserCtrl",
                backdrop: 'static',
                size: 'role',
                resolve: {
                    op: function () {
                        return angular.copy(op);
                    },
                    select: function () {
                        return angular.copy(select)
                    }
                }
            });
            modalInstance.result.then(function (i) {
                if (i === 1) {
                    $scope.user.refresh();
                } else {
                    $http({
                        method: "get",
                        url: "rest/authox/users/" + $scope.user.select.info.uid
                    }).then(function (data) {
                        $scope.user.select.info = data.data;
                    })
                }
            }, function () {});
        };

        $scope.user.editUserRole = function (op, select) {
            var modalInstance = $uibModal.open({
                templateUrl: "partials/authority/system/user/editUserRole.html",
                controller: "editUserRoleCtrl",
                backdrop: 'static',
                resolve: {
                    op: function () {
                        return angular.copy(op)
                    },
                    select: function () {
                        return angular.copy(select)
                    }
                }
            });
            modalInstance.result.then(function (i) {
                $http({
                    method: "get",
                    url: "rest/authox/users/" + i + "/roles"
                }).then(function (data) {
                    $scope.user.select.roles = data.data;
                })
            }, function () {});
        }
        
        $scope.user.xzqhSelect = function () {

        }
        $scope.user = {
            city:'',
            counties:'',
            enterprise:''
        }
        $scope.getCities = function (n) {
            $http.get('basicData/listXzqy?'+'xzqyId='+n)
                .then(function (data) {
                    $scope.citySelect = data.data
                })
            $scope.user = {
                counties:'',
                enterprise:''
            }
        }
        $scope.getCounties = function (n) {
            if(n!=''){
                $http.get('basicData/listXzqy?'+'xzqyId='+n)
                    .then(function (data) {
                        $scope.countiesSelect = data.data
                    })
            }
        }
        $scope.getEnterprise = function (n) {
            $http.get('riskSource/listRiskSouce?'+'xzqyId='+n)
                .then(function (data) {
                    $scope.enterpriseSelect = data.data
                })
        }
        $scope.getCities('-1')

    }).controller("addUserCtrl", ['$scope', '$http', '$uibModalInstance', 'op', 'select',
        function ($scope, $http, $uibModalInstance, op, select) {
        $scope.op = op;
        $scope.showSel = !!select;
        $scope.select = angular.copy(select) || {};
        $scope.checkModel = $scope.showSel ? select.account : '';
        $scope.commit = function () {
            var data = angular.copy($scope.select);
            if ($scope.showSel) {
                delete data.password;
                $http({
                    method: "POST",
                    url: "rest/authox/users/" + select.uid,
                    data: data
                }).then(function (data) {
                    $uibModalInstance.close(2);
                }).error(function (data) {})
            } else {
                $http({
                    method: "POST",
                    url: "rest/authox/users",
                    data: data
                }).then(function (data) {
                    $uibModalInstance.close(1);
                }).error(function (data) {})
            }
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
	    }]).controller("editUserRoleCtrl", ['$scope', '$http', '$uibModalInstance', 'op', 'select', function ($scope, $http, $uibModalInstance, op, select) {
        $scope.op = op;
        $scope.select = angular.copy(select);
        $http.get("rest/authox/roles").then(function (data) {
            $scope.multiSel = []
            //console.log(data.data)
            data.data.forEach(function (i) {
                console.log(i)
                var list = {};
                list.role = i.role;
                list.name = i.name;
                list.des = i.des;
                list.ticked = false;
                $scope.select.roles.forEach(function (j) {
                    if (j.role === i.role) {
                        list.ticked = true;
                    }
                })
                $scope.multiSel.push(list);
            })
        })
        $scope.commit = function () {
            var data = [];
            $scope.select.checkUsers.forEach(function (i) {
                data.push(i.role);
            })
            $http({
                method: 'post',
                url: 'rest/authox/users/' + select.info.uid + '/roles',
                data: data
            }).then(function (data) {
                $uibModalInstance.close(select.info.uid);
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
    ]).controller("logCtrl",function ($scope, $http) {
        $scope.log={
            data:'',
            pageNo:1,
            pageSize:10,
            totalCount:10
        }
        $scope.getMsg = function(){
            $http.get('user/listLoginLog?'+'&pageNo='+$scope.log.pageNo).then(function (res) {
                $scope.log.data = res.data.dataList;
                $scope.log.pageSize = res.data.pageSize;
                $scope.log.totalCount = res.data.totalCount;
                console.log($scope.log.data)
            })
        }
        $scope.getMsg()
    })
});
