define(['app'], function (app) {
    app.controller("roleCtrl", function ($scope, $http, $rootScope, $uibModal, $state, sucHelpers1) {
        $scope.role = {};
        $scope.role.table = {
            isActive: true,
            headList: ['角色标识', '角色名称', '父节点', '备注', '创建时间'],
            searchList: [{
                key: 'name',
                name: '角色名称'
            }]
        };
        $scope.role.pages = {
            totalCount: 0,
            currentPageNo: 1,
            pageSize: 8,
        }
        $scope.role.refresh = function () {
            $http.get('rest/authox/roles').then(function (data) {
                $scope.role.table.allContent = data;
                $scope.role.pages.totalCount = data.length;
                $scope.role.pages.currentPageNo = 1;
                $scope.role.table.content = data.data.slice(0, $scope.role.pages.pageSize);
            })
        }
        $scope.role.refresh();
        $scope.role.table.searchName = 'name';
        $scope.role.search = function () {
            $http.get('rest/authox/roles/like?key=' + $scope.role.table.searchName + '&value=' + ($scope.role.searchValue || '')).then(function (data) {
                $scope.role.table.content = data.data.slice(0, $scope.role.pages.pageSize);
            })
        }
        $scope.role.pageChanged = function (currentPageNo) {
            $scope.role.table.content = $scope.role.table.allContent.slice((currentPageNo - 1) * $scope.role.pages.pageSize, currentPageNo * $scope.role.pages.pageSize);
        }
        $scope.role.delrole = function (item) {
        	if(confirm("确认删除？")){
	            $http({
	                method: "delete",
	                url: "rest/authox/roles/" + item.role
	            }).then(function (data) {
	                $scope.role.refresh();
	            })
        	}
        }
        $scope.role.addRole = function (op, select) {
            var modalInstance = $uibModal.open({
                templateUrl: "partials/authority/system/role/addRole.html",
                controller: "addRoleCtrl",
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
                    $scope.role.refresh();
                } else {
                    $http.get('rest/authox/roles/' + $scope.role.select.info.role).then(function (data) {
                        $scope.role.select.info = data;
                    })
                }
            }, function () {});
        };
        //sucHelpers.extend($scope.role, $scope.suc.role);

    }).controller('roleSelectCtrl', function ($scope, $stateParams, $http, sucHelpers1, $uibModal) {
        $scope.role={};
    	$scope.role.addRole = function (op, select) {
            var modalInstance = $uibModal.open({
                templateUrl: "partials/authority/system/role/addRole.html",
                controller: "addRoleCtrl",
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
                    $scope.role.refresh();
                } else {
                    $http.get('rest/authox/roles/' + $scope.role.select.info.role).then(function (data) {
                        $scope.role.select.info = data.data;
                    })
                }
            }, function () {});
        };
        //-----table-------
        $scope.role.isEditing = false;
        $scope.role.select = {};
        $scope.role.objs = [];
        $scope.role.ops = [];
        $http.get('rest/authox/roles/' + $stateParams.key).then(function (data) {
            $scope.role.select.info = data.data;
        })
        $scope.role.showAuthoList = [];
        $scope.getShowAuthoList = function () {
            var list = [];
            $http.get('rest/authox/roles/' + $stateParams.key + '/rules').then(function (data) {
                data.data.forEach(function (i) {
                    var n = false;
                    list.forEach(function (j) {
                        if (j.objectTag === i.objectTag) {
                            n = true;
                            j.op.push({
                                'operaName': i.op
                            })
                        }
                    })
                    if (!n) {
                        var tagObj = {};
                        tagObj.objectTag = i.objectTag;
                        tagObj.inEditing = false;
                        tagObj.isEdited = false;
                        tagObj.op = [];
                        tagObj.op.push({
                            'operaName': i.op
                        });
                        list.push(tagObj)
                    }
                })
                $scope.role.showAuthoList = angular.copy(list);
            })
        }
        $scope.getShowAuthoList();
        $http.get('rest/authox/inputs/object').then(function (data) {
            $scope.role.objs = data;
        })
        $http.get('rest/authox/inputs/operation').then(function (data) {
            $scope.role.ops = data;
        })
        $http.get('rest/authox/roles/' + $stateParams.key + '/subjects').then(function (data) {
            $scope.role.select.record = data;
        })


        //-----table------
        var baseAuthoList = [];
        $scope.isEditing = false;
        $scope.newAutho = {};
        $scope.newAutho.isEdited = false;
        $scope.newAutho.op = [];
        $scope.addNewAutho = function (mess) {
            var c = true;
            var data = {};
            data.objectTag = $scope.newAutho.objectTag;
            data.ops = angular.copy($scope.newAutho.op);
            if ($scope.newAutho.op.length < 1) {
                alert("请至少保留一条操作项")
            } else {
                $http({
                    method: 'post',
                    url: 'rest/authox/roles/' + $scope.role.select.info.role + '/rules/'+data.objectTag,
                    data: data
                }).then(function (data) {
                    $scope.role.showAuthoList.forEach(function (i) {
                        if (i.objectTag === $scope.newAutho.objectTag) {
                            i.isEdited = false;
                            i.op = angular.copy($scope.newAutho.op)
                            c = false;
                        }
                    })
                    if (c) {
                        $scope.newAutho.isEdited = false;
                        $scope.role.showAuthoList.push(angular.copy($scope.newAutho));
                    }
                    $scope.newAutho = {};
                    $scope.newAutho.op = [];
                    alert(mess + "成功");
                }).error(function (data) {
                    alert(mess + "失败");
                })
            }
        }
        $scope.closeNewAutho = function () {
            $scope.newAutho = {};
            $scope.newAutho.op = [];
        }
        $scope.updateAutho = function (autho) {
            //update ifError 
            var data = {};
            data.objectTag = autho.objectTag;
            data.ops = angular.copy(autho.op);
            if (autho.op.length < 1) {
                alert("请至少保留一条操作项")
            } else {
                $http({
                    method: 'post',
                    url: 'rest/authox/roles/' + $scope.role.select.info.role + '/rules/'+data.objectTag,
                    data: data
                }).then(function (data) {
                    autho.isEdited = false;
                    alert("修改成功")
                })
            }
        }
        $scope.deleteAutho = function (item, item2) {
            if (confirm("确认删除此数据？")) {
                var data = {};
                data.objectTag = item.objectTag;
                data.ops = angular.copy(item.op);
                $http({
                    method: 'delete',
                    url: 'rest/authox/roles/' + $scope.role.select.info.role + '/rules/'+data.objectTag,
                    data: data
                }).then(function (data) {
                    var index = item2.indexOf(item);
                    if (index !== -1) {
                        item2.splice(index, 1);
                    }
                    alert("删除成功")
                })
            }
        }
        $scope.goEdit = function () {
                $scope.newAutho = {};
                $scope.newAutho.op = [];
            }
        $scope.overriderAutho = false;
        var checkW = $scope.$watch('newAutho.objectTag', function (newValue) {
            //$scope.newAutho.op = [];
            if (newValue) {
                var overrrider = false;
                $scope.role.showAuthoList.forEach(function (i) {
                    i.inEditing = false;
                    if (i.objectTag === newValue) {
                        overrrider = true;
                        i.inEditing = true;
                        $scope.newAutho.op = angular.copy(i.op);
                        //disable selected item
                    }
                })
                $scope.overriderAutho = overrrider;
            } else {
                $scope.overriderAutho = false;
                $scope.role.showAuthoList.forEach(function (i) {
                    i.inEditing = false;
                })
            }
        })
        $scope.$on('$destroy', function () {
            checkW();
        })

    }).controller("addRoleCtrl", ['$scope', '$http', '$uibModalInstance', 'op', 'select', function ($scope, $http, $uibModalInstance, op, select) {
        $scope.op = op;
        $scope.showSel = !!select;
        $scope.select = angular.copy(select) || {};
        $scope.select.parentsObj = [];
        $scope.multiSel = [];
        if ($scope.showSel) {
            $http.get('rest/authox/roles/' + select.role + '/validRoles').then(function (data) {
                var a = [];
                data.data.forEach(function (i) {
                    var list = {};
                    list.name = i.name;
                    list.role = i.role;
                    list.ticked = false;
                    if ($scope.select.parents.indexOf(i.name) > -1) {
                        list.ticked = true;
                    }
                    a.push(list);
                })
                $scope.multiSel = a;
            })
        } else {
            $http.get('rest/authox/roles').then(function (data) {
                var a = [];
                data.data.forEach(function (i) {
                    var list = {};
                    list.name = i.name;
                    list.role = i.role;
                    list.ticked = false;
                    a.push(list);
                })
                $scope.multiSel = a;
            })
        }

        $scope.commit = function () {
            var data = {};
            data.role = $scope.select.role || null;
            data.name = $scope.select.name;
            data.des = $scope.select.des;
            data.parents = [];
            $scope.select.parentsObj.forEach(function (i) {
                data.parents.push(i.role);
            })
            if ($scope.showSel) {
                $http({
                    method: "POST",
                    url: "rest/authox/roles/" + $scope.select.role,
                    data: data
                }).then(function (data) {
                    $uibModalInstance.close(2);
                }).error(function (data) {})
            } else {
                $http({
                    method: "POST",
                    url: "rest/authox/roles",
                    data: data
                }).then(function (data) {
                    $uibModalInstance.close(1);
                }).error(function (data) {
                    if (data.code == 500) {
                        $scope.role.name.$invalid = true;
                    } else {}
                })
            }
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }])
});
