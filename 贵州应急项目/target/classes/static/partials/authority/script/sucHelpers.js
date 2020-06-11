/*
 * 通用的方法指令集合
 */
define(['app'], function (app) {
    app.factory("sucHelpers1", function () {
        var factory = {};
        factory.isDefined = function (value) {
            return angular.isDefined(value);
        };

        factory.isDefinedAndNotNull = function (value) {
            return angular.isDefined(value) && value !== null;
        };

        //通过obj唯一的属性pro，判断对象数组中是否已有obj
        factory.isContain = function (arr, obj, pro) {
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (arr[i][pro] == obj[pro]) {
                    return true;
                }
            }
            return false;
        }

        //全选与全不选
        factory.checkAll = function (list, allChecked) {
            list.forEach(function (w) {
                w.checked = allChecked;
            });
            return list;
        }
        factory.getCheckedObj = function (list) {
            var checkedList = [];
            list.forEach(function (w) {
                if (w.checked) {
                    var copy = angular.copy(w);
                    delete copy['checked'];
                    checkedList.push(copy);
                }
            });
            return checkedList;
        }
        factory.getCheckedId = function (list) {
            var checkedIdList = [];
            list.forEach(function (w) {
                if (w.checked) {
                    checkedIdList.push(w.id);
                }
            });
            return checkedIdList;
        }
        factory.checkOne = function (item, list) {
            list.forEach(function (w) {
                w.checked = false;
                if (w === item) {
                    w.checked = true;
                }
            });
        }
		
		//一个数组中删除另一个数组中已有数据
		factory.delArrsSame = function(arr1, arr2){
			var len2 = arr2.length;
			var len1 = arr1.length;
			var temp=[], tempArr=[];
			for(var i=0;i<len2;i++){
				temp[arr2[i]]=true;
			}
			for(var i=0;i<len1;i++){
				if(!temp[arr1[i]]){
					tempArr.push(arr1[i]);
				}
			}
			return tempArr;
		}

        /*
         * angular.extend(dst, src)  src的同名属性会覆盖dst的同名属性
         * 想要一个只有没有子对象的属性会相互覆盖的方法
         */
        factory.getKeys = function (obj) {
            var keys = [];
            for (var key in obj) {
                keys.push(key);
            }
            return keys;
        }
        factory.getSameNestKeys = function (obj1, obj2) { //获取两个对象的同名且为对象的属性
            if (angular.isArray(obj1) || angular.isArray(obj2)) {
                return [];
            }
            var dstKeys = factory.getKeys(obj1),
                srcKeys = factory.getKeys(obj2),
                resultKeys = [];

            dstKeys.forEach(function (item) {
                if (srcKeys.indexOf(item) != -1) {
                    if (typeof obj2[item] == "object") {
                        resultKeys.push(item);
                    }
                }
            });
            return resultKeys;
        }
        factory.extend = function (dst, src) {
            var keys = factory.getKeys(src);
            //首先判断是否有同名且为对象属性
            var sameKeys = factory.getSameNestKeys(dst, src);
            if (sameKeys.length > 0) {

                //满足条件的属性回调
                sameKeys.forEach(function (item) {
                    if (angular.isArray(dst[item]) || angular.isArray(src[item])) {
                        dst[item] = src[item];
                        return;
                    }
                    factory.extend(dst[item], src[item]);
                });

                //不满足条件的属性进行覆盖
                keys.forEach(function (key) {
                    if (sameKeys.indexOf(key) == -1) {
                        dst[key] = src[key];
                    }
                })
            } else {
                angular.extend(dst, src);
            }
        }

        return factory;
    })
    .directive('samecheck', ['$q', '$http', function ($q, $http) {
        return {
            require: "ngModel",
            scope: {
                checkModel: '@'
            },
            link: function (scope, element, attr, ngModel) {
                ngModel.$asyncValidators.samecheck = function (modelValue, viewValue) {
                    var d = $q.defer();
                    $http.get(attr.checkUrl)
                        .then(function (data) {
                            var list = [];
                            data.data.forEach(function (i) {
                                if (!attr.checkModel || attr.checkModel !== i[attr.checkProperty]) {
                                    list.push(i[attr.checkProperty]);
                                }
                            })
                            if (list.indexOf(modelValue) >= 0) {
                                d.reject();
                            } else {
                                d.resolve();
                            }
                        });
                    return d.promise;
                }
            }
        };
    }]).directive("myOpe", function () {
        return {
            restrict: "EA",
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || 'dir/myOpe.html';
            },
            templateUrl: "dir/myOpe.html",
            scope: {
                data: '=',
                ops: '=',
                isEdited:'='
            },
            link: function (scope, element, attrs, ctrls) {
                scope.addBtn = true;
                scope.input_ope = {}; //{operaName:""}
                scope.noShowAdd = function () {
                    scope.input_ope.operaName = "";
                    scope.addBtn = true;
                }
                scope.clickAddBtn = function () {
                	scope.addBtn=false;
                	setTimeout(function(){
                		element.find('input')[0].focus();
                	},0)
                }
                scope.addNewOpe = function () {
                    //check identical
                    var checkIn = true;
                    scope.data.forEach(function (i) {
                        if (scope.input_ope.operaName === i.operaName) {
                            checkIn = false;
                        }
                    })
                    if (checkIn) {
                    	scope.isEdited=true;
                        scope.data.push(angular.copy(scope.input_ope));
                        scope.noShowAdd();
                    } else {
                        scope.input_ope = {};
                    }
                }
                scope.deleteOpe = function (item, item2) {
                    var index = item2.indexOf(item);
                    if (index !== -1) {
                    	scope.isEdited=true;
                        item2.splice(index, 1);
                    }
                }
                scope.$on('destroy', function () {})
            }
        }
    }).directive('istevenMultiSelect', ['$sce', '$timeout', function ($sce, $timeout) {
        return {
            restrict: 'AE',
            transclude: true,
            scope: {
                // models
                inputModel: '=',
                outputModel: '=',

                // settings based on attribute
                isDisabled: '=',

                // callbacks
                onClear: '&',
                onClose: '&',
                onSearchChange: '&',
                onItemClick: '&',
                onOpen: '&',
                onReset: '&',
                onSelectAll: '&',
                onSelectNone: '&',

                // i18n
                translation: '=',
                noMulti: '=?'
            },

            /* 
             * The rest are attributes. They don't need to be parsed / binded, so we can safely access them by value.
             * - buttonLabel, directiveId, helperElements, itemLabel, maxLabels, orientation, selectionMode, minSearchLength,
             *   tickProperty, disableProperty, groupProperty, searchProperty, maxHeight, outputProperties,outIndexProperty
             */
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || 'dir/multiSelect.html';
            },
            compile: function (ele, attr, trans) {
                return function ($scope, element, attrs, ctrls, linker) {

                    $scope.backUp = [];
                    $scope.varButtonLabel = '';
                    $scope.spacingProperty = '';
                    $scope.indexProperty = '';
                    $scope.filteredModel = [];
                    $scope.inputLabel = {
                        labelFilter: ''
                    };
                    $scope.tabIndex = 0;
                    $scope.lang = {};
                    $scope.helperStatus = {
                        all: true,
                        none: true,
                        reset: true,
                        filter: true
                    };
                    $scope.noMulti = $scope.noMulti || false;
                    $scope.outIndexProperty = attrs.outIndexProperty;
                    var
                        prevTabIndex = 0,
                        helperItems = [],
                        helperItemsLength = 0,
                        checkBoxLayer = '',
                        scrolled = false,
                        selectedItems = [],
                        formElements = [],
                        vMinSearchLength = 0,
                        clickedItem = null;

                    $scope.leftBana = attrs.leftBana;
                    $scope.rightBana = attrs.rightBana;
                    // v3.0.0
                    // clear button clicked
                    $scope.clearClicked = function (e) {
                        $scope.inputLabel.labelFilter = '';
                        $scope.updateFilter();
                        $scope.select('clear', e);
                    }

                    // A little hack so that AngularJS ng-repeat can loop using start and end index like a normal loop
                    // http://stackoverflow.com/questions/16824853/way-to-ng-repeat-defined-number-of-times-instead-of-repeating-over-array
                    $scope.numberToArray = function (num) {
                        return new Array(num);
                    }

                    // Call this function when user type on the filter field
                    $scope.searchChanged = function () {
                        if ($scope.inputLabel.labelFilter.length < vMinSearchLength && $scope.inputLabel.labelFilter.length > 0) {
                            return false;
                        }
                        $scope.updateFilter();
                    }

                    $scope.updateFilter = function () {
                        // we check by looping from end of input-model
                        $scope.filteredModel = [];
                        var i = 0;

                        if (typeof $scope.inputModel === 'undefined') {
                            return false;
                        }

                        for (i = $scope.inputModel.length - 1; i >= 0; i--) {

                            // if it's group end, we push it to filteredModel[];
                            if (typeof $scope.inputModel[i][attrs.groupProperty] !== 'undefined' && $scope.inputModel[i][attrs.groupProperty] === false) {
                                $scope.filteredModel.push($scope.inputModel[i]);
                            }

                            // if it's data 
                            var gotData = false;
                            if (typeof $scope.inputModel[i][attrs.groupProperty] === 'undefined') {

                                // If we set the search-key attribute, we use this loop. 
                                if (typeof attrs.searchProperty !== 'undefined' && attrs.searchProperty !== '') {

                                    for (var key in $scope.inputModel[i]) {
                                        if (
                                            typeof $scope.inputModel[i][key] !== 'boolean' &&
                                            String($scope.inputModel[i][key]).toUpperCase().indexOf($scope.inputLabel.labelFilter.toUpperCase()) >= 0 &&
                                            attrs.searchProperty.indexOf(key) > -1
                                        ) {
                                            gotData = true;
                                            break;
                                        }
                                    }
                                }
                                // if there's no search-key attribute, we use this one. Much better on performance.
                                else {
                                    for (var key in $scope.inputModel[i]) {
                                        if (
                                            typeof $scope.inputModel[i][key] !== 'boolean' &&
                                            String($scope.inputModel[i][key]).toUpperCase().indexOf($scope.inputLabel.labelFilter.toUpperCase()) >= 0
                                        ) {
                                            gotData = true;
                                            break;
                                        }
                                    }
                                }

                                if (gotData === true) {
                                    // push
                                    $scope.filteredModel.push($scope.inputModel[i]);
                                }
                            }

                            // if it's group start
                            if (typeof $scope.inputModel[i][attrs.groupProperty] !== 'undefined' && $scope.inputModel[i][attrs.groupProperty] === true) {

                                if (typeof $scope.filteredModel[$scope.filteredModel.length - 1][attrs.groupProperty] !== 'undefined' &&
                                    $scope.filteredModel[$scope.filteredModel.length - 1][attrs.groupProperty] === false) {
                                    $scope.filteredModel.pop();
                                } else {
                                    $scope.filteredModel.push($scope.inputModel[i]);
                                }
                            }
                        }

                        $scope.filteredModel.reverse();

                        $timeout(function () {

                            $scope.getFormElements();

                            // Callback: on filter change                      
                            if ($scope.inputLabel.labelFilter.length > vMinSearchLength) {

                                var filterObj = [];

                                angular.forEach($scope.filteredModel, function (value, key) {
                                    if (typeof value !== 'undefined') {
                                        if (typeof value[attrs.groupProperty] === 'undefined') {
                                            var tempObj = angular.copy(value);
                                            var index = filterObj.push(tempObj);
                                            delete filterObj[index - 1][$scope.indexProperty];
                                            delete filterObj[index - 1][$scope.spacingProperty];
                                        }
                                    }
                                });

                                $scope.onSearchChange({
                                    data: {
                                        keyword: $scope.inputLabel.labelFilter,
                                        result: filterObj
                                    }
                                });
                            }
                        }, 0);
                    };

                    // List all the input elements. We need this for our keyboard navigation.
                    // This function will be called everytime the filter is updated. 
                    // Depending on the size of filtered mode, might not good for performance, but oh well..
                    $scope.getFormElements = function () {
                        formElements = [];

                        var
                            selectButtons = [],
                            inputField = [],
                            checkboxes = [],
                            clearButton = [];

                        // If available, then get select all, select none, and reset buttons
                        if ($scope.helperStatus.all || $scope.helperStatus.none || $scope.helperStatus.reset) {
                            selectButtons = element.children().children().next().children().children()[0].getElementsByTagName('button');
                            // If available, then get the search box and the clear button
                            if ($scope.helperStatus.filter) {
                                // Get helper - search and clear button. 
                                inputField = element.children().children().next().children().children().next()[0].getElementsByTagName('input');
                                clearButton = element.children().children().next().children().children().next()[0].getElementsByTagName('button');
                            }
                        } else {
                            if ($scope.helperStatus.filter) {
                                // Get helper - search and clear button. 
                                inputField = element.children().children().next().children().children()[0].getElementsByTagName('input');
                                clearButton = element.children().children().next().children().children()[0].getElementsByTagName('button');
                            }
                        }

                        // Get checkboxes
                        if (!$scope.helperStatus.all && !$scope.helperStatus.none && !$scope.helperStatus.reset && !$scope.helperStatus.filter) {
                            checkboxes = element.children().children().next()[0].getElementsByTagName('input');
                        } else {
                            checkboxes = element.children().children().next().children().next()[0].getElementsByTagName('input');
                        }

                        // Push them into global array formElements[] 
                        for (var i = 0; i < selectButtons.length; i++) {
                            formElements.push(selectButtons[i]);
                        }
                        for (var i = 0; i < inputField.length; i++) {
                            formElements.push(inputField[i]);
                        }
                        for (var i = 0; i < clearButton.length; i++) {
                            formElements.push(clearButton[i]);
                        }
                        for (var i = 0; i < checkboxes.length; i++) {
                            formElements.push(checkboxes[i]);
                        }
                    }

                    // check if an item has attrs.groupProperty (be it true or false)
                    $scope.isGroupMarker = function (item, type) {
                        if (typeof item[attrs.groupProperty] !== 'undefined' && item[attrs.groupProperty] === type) return true;
                        return false;
                    }

                    $scope.removeGroupEndMarker = function (item) {
                        if (typeof item[attrs.groupProperty] !== 'undefined' && item[attrs.groupProperty] === false) return false;
                        return true;
                    }

                    // call this function when an item is clicked
                    $scope.syncItems = function (item, e, ng_repeat_index) {

                        e.preventDefault();
                        e.stopPropagation();

                        // if the directive is globaly disabled, do nothing
                        if (typeof attrs.disableProperty !== 'undefined' && item[attrs.disableProperty] === true) {
                            return false;
                        }

                        // if item is disabled, do nothing
                        if (typeof attrs.isDisabled !== 'undefined' && $scope.isDisabled === true) {
                            return false;
                        }

                        // if end group marker is clicked, do nothing
                        if (typeof item[attrs.groupProperty] !== 'undefined' && item[attrs.groupProperty] === false) {
                            return false;
                        }

                        var index = $scope.filteredModel.indexOf(item);

                        // if the start of group marker is clicked ( only for multiple selection! )
                        // how it works:
                        // - if, in a group, there are items which are not selected, then they all will be selected
                        // - if, in a group, all items are selected, then they all will be de-selected                
                        if (typeof item[attrs.groupProperty] !== 'undefined' && item[attrs.groupProperty] === true) {

                            // this is only for multiple selection, so if selection mode is single, do nothing
                            if (typeof attrs.selectionMode !== 'undefined' && attrs.selectionMode.toUpperCase() === 'SINGLE') {
                                return false;
                            }

                            var i, j, k;
                            var startIndex = 0;
                            var endIndex = $scope.filteredModel.length - 1;
                            var tempArr = [];

                            // nest level is to mark the depth of the group.
                            // when you get into a group (start group marker), nestLevel++
                            // when you exit a group (end group marker), nextLevel--
                            var nestLevel = 0;

                            // we loop throughout the filtered model (not whole model)
                            for (i = index; i < $scope.filteredModel.length; i++) {

                                // this break will be executed when we're done processing each group
                                if (nestLevel === 0 && i > index) {
                                    break;
                                }

                                if (typeof $scope.filteredModel[i][attrs.groupProperty] !== 'undefined' && $scope.filteredModel[i][attrs.groupProperty] === true) {

                                    // To cater multi level grouping
                                    if (tempArr.length === 0) {
                                        startIndex = i + 1;
                                    }
                                    nestLevel = nestLevel + 1;
                                }

                                // if group end
                                else if (typeof $scope.filteredModel[i][attrs.groupProperty] !== 'undefined' && $scope.filteredModel[i][attrs.groupProperty] === false) {

                                    nestLevel = nestLevel - 1;

                                    // cek if all are ticked or not                            
                                    if (tempArr.length > 0 && nestLevel === 0) {

                                        var allTicked = true;

                                        endIndex = i;

                                        for (j = 0; j < tempArr.length; j++) {
                                            if (typeof tempArr[j][$scope.tickProperty] !== 'undefined' && tempArr[j][$scope.tickProperty] === false) {
                                                allTicked = false;
                                                break;
                                            }
                                        }

                                        if (allTicked === true) {
                                            for (j = startIndex; j <= endIndex; j++) {
                                                if (typeof $scope.filteredModel[j][attrs.groupProperty] === 'undefined') {
                                                    if (typeof attrs.disableProperty === 'undefined') {
                                                        $scope.filteredModel[j][$scope.tickProperty] = false;
                                                        // we refresh input model as well
                                                        inputModelIndex = $scope.filteredModel[j][$scope.indexProperty];
                                                        $scope.inputModel[inputModelIndex][$scope.tickProperty] = false;
                                                    } else if ($scope.filteredModel[j][attrs.disableProperty] !== true) {
                                                        $scope.filteredModel[j][$scope.tickProperty] = false;
                                                        // we refresh input model as well
                                                        inputModelIndex = $scope.filteredModel[j][$scope.indexProperty];
                                                        $scope.inputModel[inputModelIndex][$scope.tickProperty] = false;
                                                    }
                                                }
                                            }
                                        } else {
                                            for (j = startIndex; j <= endIndex; j++) {
                                                if (typeof $scope.filteredModel[j][attrs.groupProperty] === 'undefined') {
                                                    if (typeof attrs.disableProperty === 'undefined') {
                                                        $scope.filteredModel[j][$scope.tickProperty] = true;
                                                        // we refresh input model as well
                                                        inputModelIndex = $scope.filteredModel[j][$scope.indexProperty];
                                                        $scope.inputModel[inputModelIndex][$scope.tickProperty] = true;

                                                    } else if ($scope.filteredModel[j][attrs.disableProperty] !== true) {
                                                        $scope.filteredModel[j][$scope.tickProperty] = true;
                                                        // we refresh input model as well
                                                        inputModelIndex = $scope.filteredModel[j][$scope.indexProperty];
                                                        $scope.inputModel[inputModelIndex][$scope.tickProperty] = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                // if data
                                else {
                                    tempArr.push($scope.filteredModel[i]);
                                }
                            }
                        }

                        // if an item (not group marker) is clicked
                        else {

                            // If it's single selection mode
                            if (typeof attrs.selectionMode !== 'undefined' && attrs.selectionMode.toUpperCase() === 'SINGLE') {

                                // first, set everything to false
                                for (i = 0; i < $scope.filteredModel.length; i++) {
                                    $scope.filteredModel[i][$scope.tickProperty] = false;
                                }
                                for (i = 0; i < $scope.inputModel.length; i++) {
                                    $scope.inputModel[i][$scope.tickProperty] = false;
                                }

                                // then set the clicked item to true
                                $scope.filteredModel[index][$scope.tickProperty] = true;
                            }

                            // Multiple
                            else {
                                $scope.filteredModel[index][$scope.tickProperty] = !$scope.filteredModel[index][$scope.tickProperty];
                            }

                            // we refresh input model as well
                            var inputModelIndex = $scope.filteredModel[index][$scope.indexProperty];
                            $scope.inputModel[inputModelIndex][$scope.tickProperty] = $scope.filteredModel[index][$scope.tickProperty];
                        }

                        // we execute the callback function here
                        clickedItem = angular.copy(item);
                        if (clickedItem !== null) {
                            $timeout(function () {
                                delete clickedItem[$scope.indexProperty];
                                delete clickedItem[$scope.spacingProperty];
                                $scope.onItemClick({
                                    data: clickedItem
                                });
                                clickedItem = null;
                            }, 0);
                        }

                        $scope.refreshOutputModel();
                        $scope.refreshButton();

                        // We update the index here
                        prevTabIndex = $scope.tabIndex;
                        $scope.tabIndex = ng_repeat_index + helperItemsLength;

                        // Set focus on the hidden checkbox 
                        e.target.focus();

                        // set & remove CSS style
                        /* $scope.removeFocusStyle( prevTabIndex );
                         $scope.setFocusStyle( $scope.tabIndex );*/

                        if (typeof attrs.selectionMode !== 'undefined' && attrs.selectionMode.toUpperCase() === 'SINGLE') {
                            // on single selection mode, we then hide the checkbox layer
                            $scope.toggleCheckboxes(e);
                        }
                    }
                    $scope.outClickItems = function (item, e) {
                            e.preventDefault();
                            e.stopPropagation();

                            // we refresh input model as well
                            $scope.inputModel.forEach(function (i) {
                                if (i[$scope.outIndexProperty] === item[$scope.outIndexProperty]) {
                                    i[$scope.tickProperty] = !i[$scope.tickProperty];
                                }
                            })

                            $scope.refreshOutputModel();
                            $scope.refreshButton();

                            // Set focus on the hidden checkbox 
                            e.target.focus();

                        }
                        // update $scope.outputModel
                    $scope.refreshOutputModel = function () {

                        $scope.outputModel = [];
                        var
                            outputProps = [],
                            tempObj = {};

                        // v4.0.0
                        if (typeof attrs.outputProperties !== 'undefined') {
                            outputProps = attrs.outputProperties.split(' ');
                            angular.forEach($scope.inputModel, function (value, key) {
                                if (
                                    typeof value !== 'undefined' &&
                                    typeof value[attrs.groupProperty] === 'undefined' &&
                                    value[$scope.tickProperty] === true
                                ) {
                                    tempObj = {};
                                    angular.forEach(value, function (value1, key1) {
                                        if (outputProps.indexOf(key1) > -1) {
                                            tempObj[key1] = value1;
                                        }
                                    });
                                    var index = $scope.outputModel.push(tempObj);
                                    delete $scope.outputModel[index - 1][$scope.indexProperty];
                                    delete $scope.outputModel[index - 1][$scope.spacingProperty];
                                }
                            });
                        } else {
                            angular.forEach($scope.inputModel, function (value, key) {
                                if (
                                    typeof value !== 'undefined' &&
                                    typeof value[attrs.groupProperty] === 'undefined' &&
                                    value[$scope.tickProperty] === true
                                ) {
                                    var temp = angular.copy(value);
                                    var index = $scope.outputModel.push(temp);
                                    delete $scope.outputModel[index - 1][$scope.indexProperty];
                                    delete $scope.outputModel[index - 1][$scope.spacingProperty];
                                }
                            });
                        }
                    }

                    // refresh button label
                    $scope.refreshButton = function () {

                        $scope.varButtonLabel = '';
                        var ctr = 0;

                        // refresh button label...
                        if ($scope.outputModel.length === 0) {
                            // https://github.com/isteven/angular-multi-select/pull/19                    
                            $scope.varButtonLabel = $scope.lang.nothingSelected;
                        } else {
                            var tempMaxLabels = $scope.outputModel.length;
                            if (typeof attrs.maxLabels !== 'undefined' && attrs.maxLabels !== '') {
                                tempMaxLabels = attrs.maxLabels;
                            }

                            // if max amount of labels displayed..
                            if ($scope.outputModel.length > tempMaxLabels) {
                                $scope.more = true;
                            } else {
                                $scope.more = false;
                            }

                            angular.forEach($scope.inputModel, function (value, key) {
                                if (typeof value !== 'undefined' && value[attrs.tickProperty] === true) {
                                    if (ctr < tempMaxLabels) {
                                        $scope.varButtonLabel += ($scope.varButtonLabel.length > 0 ? ';' : '') + $scope.writeLabel(value, 'buttonLabel');
                                    }
                                    ctr++;
                                }
                            });

                            if ($scope.more === true) {
                                // https://github.com/isteven/angular-multi-select/pull/16
                                if (tempMaxLabels > 0) {
                                    $scope.varButtonLabel += ', ... ';
                                }
                                $scope.varButtonLabel += '(' + $scope.outputModel.length + ')';
                            }
                        }
                        $scope.varButtonLabel = $sce.trustAsHtml($scope.varButtonLabel + '<span class="caret"></span>');
                    }

                    // A simple function to parse the item label settings. Used on the buttons and checkbox labels.
                    $scope.writeLabel = function (item, type) {

                            // type is either 'itemLabel' or 'buttonLabel'
                            var temp = attrs[type].split(' ');
                            var label = '';

                            angular.forEach(temp, function (value, key) {
                                item[value] && (label += '&nbsp;' + value.split('.').reduce(function (prev, current) {
                                    return prev[current];
                                }, item));
                            });

                            if (type.toUpperCase() === 'BUTTONLABEL') {
                                return label;
                            }
                            return $sce.trustAsHtml(label);

                        }
                        // UI operations to show/hide checkboxes based on click event..
                    $scope.toggleCheckboxes = function (e) {

                        // We grab the button
                        var clickedEl = element.children()[0];

                        // Just to make sure.. had a bug where key events were recorded twice
                        angular.element(document).off('click', $scope.externalClickListener);

                        // The idea below was taken from another multi-select directive - https://github.com/amitava82/angular-multiselect 
                        // His version is awesome if you need a more simple multi-select approach.                                

                        // close
                        if (angular.element(checkBoxLayer).hasClass('show')) {

                            angular.element(checkBoxLayer).removeClass('show');
                            angular.element(clickedEl).removeClass('buttonClicked');
                            angular.element(document).off('click', $scope.externalClickListener);

                            // clear the focused element;
                            //$scope.removeFocusStyle( $scope.tabIndex );
                            if (typeof formElements[$scope.tabIndex] !== 'undefined') {
                                formElements[$scope.tabIndex].blur();
                            }

                            // close callback
                            $timeout(function () {
                                $scope.onClose();
                            }, 0);

                            // set focus on button again
                            element.children().children()[0].focus();
                        }
                        // open
                        else {
                            // clear filter
                            $scope.inputLabel.labelFilter = '';
                            $scope.updateFilter();

                            helperItems = [];
                            helperItemsLength = 0;

                            angular.element(checkBoxLayer).addClass('show');
                            angular.element(clickedEl).addClass('buttonClicked');

                            // Attach change event listener on the input filter. 
                            // We need this because ng-change is apparently not an event listener.                    
                            angular.element(document).on('click', $scope.externalClickListener);

                            // to get the initial tab index, depending on how many helper elements we have. 
                            // priority is to always focus it on the input filter                                                                
                            $scope.getFormElements();
                            $scope.tabIndex = 0;

                            var helperContainer = angular.element(element[0].querySelector('.helperContainer'))[0];

                            if (typeof helperContainer !== 'undefined') {
                                for (var i = 0; i < helperContainer.getElementsByTagName('BUTTON').length; i++) {
                                    helperItems[i] = helperContainer.getElementsByTagName('BUTTON')[i];
                                }
                                helperItemsLength = helperItems.length + helperContainer.getElementsByTagName('INPUT').length;
                            }

                            // focus on the filter element on open. 
                            if (element[0].querySelector('.inputFilter')) {
                                element[0].querySelector('.inputFilter').focus();
                                $scope.tabIndex = $scope.tabIndex + helperItemsLength - 2;
                                // blur button in vain
                                angular.element(element).children()[0].blur();
                            }
                            // if there's no filter then just focus on the first checkbox item
                            else {
                                if (!$scope.isDisabled) {
                                    $scope.tabIndex = $scope.tabIndex + helperItemsLength;
                                    if ($scope.inputModel.length > 0) {
                                        formElements[$scope.tabIndex].focus();
                                        //$scope.setFocusStyle( $scope.tabIndex );
                                        // blur button in vain
                                        angular.element(element).children()[0].blur();
                                    }
                                }
                            }

                            // open callback
                            $scope.onOpen();
                        }
                    }

                    // handle clicks outside the button / multi select layer
                    $scope.externalClickListener = function (e) {

                        var targetsArr = element.find(e.target.tagName);
                        for (var i = 0; i < targetsArr.length; i++) {
                            if (e.target == targetsArr[i]) {
                                return;
                            }
                        }

                        angular.element(checkBoxLayer.previousSibling).removeClass('buttonClicked');
                        angular.element(checkBoxLayer).removeClass('show');
                        angular.element(document).off('click', $scope.externalClickListener);

                        // close callback                
                        $timeout(function () {
                            $scope.onClose();
                        }, 0);

                        // set focus on button again
                        element.children().children()[0].focus();
                    }

                    // select All / select None / reset buttons
                    $scope.select = function (type, e) {

                        var helperIndex = helperItems.indexOf(e.target);
                        $scope.tabIndex = helperIndex;

                        switch (type.toUpperCase()) {
                            case 'ALL':
                                angular.forEach($scope.filteredModel, function (value, key) {
                                    if (typeof value !== 'undefined' && value[attrs.disableProperty] !== true) {
                                        if (typeof value[attrs.groupProperty] === 'undefined') {
                                            value[$scope.tickProperty] = true;
                                        }
                                    }
                                });
                                $scope.refreshOutputModel();
                                $scope.refreshButton();
                                $scope.onSelectAll();
                                break;
                            case 'NONE':
                                angular.forEach($scope.filteredModel, function (value, key) {
                                    if (typeof value !== 'undefined' && value[attrs.disableProperty] !== true) {
                                        if (typeof value[attrs.groupProperty] === 'undefined') {
                                            value[$scope.tickProperty] = false;
                                        }
                                    }
                                });
                                $scope.refreshOutputModel();
                                $scope.refreshButton();
                                $scope.onSelectNone();
                                break;
                            case 'RESET':
                                angular.forEach($scope.filteredModel, function (value, key) {
                                    if (typeof value[attrs.groupProperty] === 'undefined' && typeof value !== 'undefined' && value[attrs.disableProperty] !== true) {
                                        var temp = value[$scope.indexProperty];
                                        value[$scope.tickProperty] = $scope.backUp[temp][$scope.tickProperty];
                                    }
                                });
                                $scope.refreshOutputModel();
                                $scope.refreshButton();
                                $scope.onReset();
                                break;
                            case 'CLEAR':
                                $scope.tabIndex = $scope.tabIndex + 1;
                                $scope.onClear();
                                break;
                            case 'FILTER':
                                $scope.tabIndex = helperItems.length - 1;
                                break;
                            default:
                        }
                    }

                    // just to create a random variable name                
                    function genRandomString(length) {
                        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                        var temp = '';
                        for (var i = 0; i < length; i++) {
                            temp += possible.charAt(Math.floor(Math.random() * possible.length));
                        }
                        return temp;
                    }

                    // count leading spaces
                    $scope.prepareGrouping = function () {
                        var spacing = 0;
                        angular.forEach($scope.filteredModel, function (value, key) {
                            value[$scope.spacingProperty] = spacing;
                            if (value[attrs.groupProperty] === true) {
                                spacing += 2;
                            } else if (value[attrs.groupProperty] === false) {
                                spacing -= 2;
                            }
                        });
                    }

                    // prepare original index
                    $scope.prepareIndex = function () {
                        var ctr = 0;
                        angular.forEach($scope.filteredModel, function (value, key) {
                            value[$scope.indexProperty] = ctr;
                            ctr++;
                        });
                    }


                    /*********************
                     *********************             
                     *
                     * 1) Initializations
                     *
                     *********************
                     *********************/

                    // attrs to $scope - attrs-$scope - attrs - $scope
                    // Copy some properties that will be used on the template. They need to be in the $scope.
                    $scope.groupProperty = attrs.groupProperty;
                    $scope.tickProperty = attrs.tickProperty;
                    $scope.directiveId = attrs.directiveId;

                    // Unfortunately I need to add these grouping properties into the input model
                    var tempStr = genRandomString(5);
                    $scope.indexProperty = 'idx_' + tempStr;
                    $scope.spacingProperty = 'spc_' + tempStr;


                    // get elements required for DOM operation
                    checkBoxLayer = element.children().children().next()[0];

                    // set max-height property if provided
                    if (typeof attrs.maxHeight !== 'undefined') {
                        var layer = element.children().children().children()[0];
                        angular.element(layer).attr("style", "height:" + attrs.maxHeight + "; overflow-y:scroll;");
                    }

                    // some flags for easier checking            
                    for (var property in $scope.helperStatus) {
                        if ($scope.helperStatus.hasOwnProperty(property)) {
                            if (
                                typeof attrs.helperElements !== 'undefined' &&
                                attrs.helperElements.toUpperCase().indexOf(property.toUpperCase()) === -1
                            ) {
                                $scope.helperStatus[property] = false;
                            }
                        }
                    }
                    if (typeof attrs.selectionMode !== 'undefined' && attrs.selectionMode.toUpperCase() === 'SINGLE') {
                        $scope.helperStatus['all'] = false;
                        $scope.helperStatus['none'] = false;
                    }

                    // helper button icons.. I guess you can use html tag here if you want to. 
                    $scope.icon = {};
                    $scope.icon.selectAll = '&#10003;'; // a tick icon
                    $scope.icon.selectNone = '&times;'; // x icon
                    $scope.icon.reset = '&#8630;'; // undo icon            
                    // this one is for the selected items
                    $scope.icon.tickMark = '&#10003;'; // a tick icon 

                    // configurable button labels                       
                    if (typeof attrs.translation !== 'undefined') {
                        $scope.lang.selectAll = $sce.trustAsHtml($scope.icon.selectAll + '&nbsp;' + $scope.translation.selectAll);
                        $scope.lang.selectNone = $sce.trustAsHtml($scope.icon.selectNone + '&nbsp;' + $scope.translation.selectNone);
                        $scope.lang.reset = $sce.trustAsHtml($scope.icon.reset + '&nbsp;' + $scope.translation.reset);
                        $scope.lang.search = $scope.translation.search;
                        $scope.lang.nothingSelected = $sce.trustAsHtml($scope.translation.nothingSelected);
                    } else {
                        $scope.lang.selectAll = $sce.trustAsHtml($scope.icon.selectAll + '&nbsp;全选');
                        $scope.lang.selectNone = $sce.trustAsHtml($scope.icon.selectNone + '&nbsp;取消全选');
                        $scope.lang.reset = $sce.trustAsHtml($scope.icon.reset + '&nbsp;还原');
                        $scope.lang.search = '搜索关键字...';
                        $scope.lang.nothingSelected = '请选择';
                    }
                    $scope.icon.tickMark = $sce.trustAsHtml($scope.icon.tickMark);

                    // min length of keyword to trigger the filter function
                    if (typeof attrs.MinSearchLength !== 'undefined' && parseInt(attrs.MinSearchLength) > 0) {
                        vMinSearchLength = Math.floor(parseInt(attrs.MinSearchLength));
                    }

                    /*******************************************************
                     *******************************************************
                     *
                     * 2) Logic starts here, initiated by watch 1 & watch 2
                     *
                     *******************************************************
                     *******************************************************/

                    // watch1, for changes in input model property
                    // updates multi-select when user select/deselect a single checkbox programatically
                    // https://github.com/isteven/angular-multi-select/issues/8            
                    var unwatch = $scope.$watch('inputModel', function (newVal) {
                        if (newVal) {
                            $scope.refreshOutputModel();
                            $scope.refreshButton();
                        }
                    }, true);

                    // watch2 for changes in input model as a whole
                    // this on updates the multi-select when a user load a whole new input-model. We also update the $scope.backUp variable
                    var unwatch1 = $scope.$watch('inputModel', function (newVal) {
                        if (newVal) {
                            $scope.backUp = angular.copy($scope.inputModel);
                            $scope.updateFilter();
                            $scope.prepareGrouping();
                            $scope.prepareIndex();
                            $scope.refreshOutputModel();
                            $scope.refreshButton();
                        }
                    });

                    // watch for changes in directive state (disabled or enabled)
                    var unwatch2 = $scope.$watch('isDisabled', function (newVal) {
                        $scope.isDisabled = newVal;
                    });

                    // this is for touch enabled devices. We don't want to hide checkboxes on scroll. 
                    var onTouchStart = function (e) {
                        $scope.$apply(function () {
                            $scope.scrolled = false;
                        });
                    };
                    angular.element(document).bind('touchstart', onTouchStart);
                    var onTouchMove = function (e) {
                        $scope.$apply(function () {
                            $scope.scrolled = true;
                        });
                    };
                    angular.element(document).bind('touchmove', onTouchMove);

                    // unbind document events to prevent memory leaks
                    $scope.$on('$destroy', function () {
                        angular.element(document).unbind('touchstart', onTouchStart);
                        angular.element(document).unbind('touchmove', onTouchMove);
                        unwatch();
                        unwatch1();
                        unwatch2();
                    });
                    if ($scope.noMulti) {
                        angular.element(checkBoxLayer).addClass('show');
                    } else {
                        element.find('.outChecked').addClass('hide')
                    }

                }
            }
        }
    }]).run(['$templateCache', function ($templateCache) {
        $templateCache.put('dir/myOpe.html', "    <div>" +
            "        <ul class=\"opeLi editing\">" +
            "            <li ng-repeat=\"ope in data track by $index\">" +
            "                <div><span class=\"leftOpe\" ng-click=\"deleteOpe(ope,data)\">×</span><span class=\"opeName\">{{ope.operaName}}</span></div>" +
            "            </li>" +
            "        </ul>" +
            "        <div class=\"inli\" ng-click=\"clickAddBtn()\" ng-show=\"addBtn\"><button class=\"editBtn\">+</button></div>" +
            "        <div class=\"inli\" ng-show=\"!addBtn\">" +
            "            <input type=\"text\" ng-model=\"input_ope.operaName\" uib-typeahead=\"autho for autho in ops | filter:$viewValue | limitTo:8\" class=\"tableInput opeInput form-control\">" +
            "            <button class=\"editBtn opeEditBtn leftB\" ng-disabled=\"!input_ope.operaName\" ng-click=\"addNewOpe()\"></button>" +
            "            <button class=\"editBtn opeEditBtn rightB\" ng-click=\"noShowAdd()\"></button>" +
            "        </div>" +
            "    </div>");
        $templateCache.put('dir/multiSelect.html', "    <span class=\"multiSelect inlineBlock\">" +
            "                <button id=\"{{directiveId}}\" type=\"button\"                " +
            "                    ng-click=\"toggleCheckboxes( $event );  refreshSelectedItems(); refreshButton();refreshButton(); prepareGrouping; prepareIndex();\"" +
            "                    ng-bind-html=\"varButtonLabel\" " +
            "                    ng-show=\"!noMulti\"" +
            "                    >" +
            "                </button>" +
            "                <div class=\"checkboxLayer\">" +
            "                    <div class=\"helperContainer\" ng-if=\"helperStatus.filter || helperStatus.all || helperStatus.none || helperStatus.reset \">" +
            "                        <div class=\"line\" ng-if=\"helperStatus.all || helperStatus.none || helperStatus.reset \">" +
            "                            <button type=\"button\" class=\"helperButton\"" +
            "                                ng-disabled=\"isDisabled\"" +
            "                                ng-if=\"helperStatus.all\" " +
            "                                ng-click=\"select( \'all\', $event );\"" +
            "                                ng-bind-html=\"lang.selectAll\">" +
            "                            </button>" +
            "                            <button type=\"button\" class=\"helperButton\"" +
            "                                ng-disabled=\"isDisabled\"" +
            "                                ng-if=\"helperStatus.none\"" +
            "                                ng-click=\"select( \'none\', $event );\"" +
            "                                ng-bind-html=\"lang.selectNone\">" +
            "                            </button>" +
            "                            <button type=\"button\" class=\"helperButton reset\"" +
            "                                ng-disabled=\"isDisabled\"" +
            "                                ng-if=\"helperStatus.reset\"" +
            "                                ng-click=\"select( \'reset\', $event );\"" +
            "                                ng-bind-html=\"lang.reset\">" +
            "                            </button>" +
            "                        </div>" +
            "                        <div class=\"line\" style=\"position:relative\" ng-if=\"helperStatus.filter\">       " +
            "                            <input placeholder=\"{{lang.search}}\" type=\"text\"" +
            "                                ng-click=\"select( \'filter\', $event )\"" +
            "                                ng-model=\"inputLabel.labelFilter\"" +
            "                                ng-change=\"searchChanged()\" class=\"inputFilter\"" +
            "                                />" +
            "                            <button type=\"button\" class=\"clearButton\" ng-click=\"clearClicked( $event )\" >×</button> " +
            "                        </div> " +
            "                    </div>" +
            "                    <div class=\"checkBoxContainer\">" +
            "                        <div " +
            "                            ng-repeat=\"item in filteredModel | filter:removeGroupEndMarker\" class=\"multiSelectItem\"" +
            "                            ng-class=\"{selected: item[ tickProperty ]}\"" +
            "                            ng-click=\"syncItems( item, $event, $index );\">        " +
            "                        <div class=\"acol\">" +
            "                            <label>                               " +
            "                                <span " +
            "                                   ng-if=\"!noMulti\"" +
            "                                    ng-bind-html=\"writeLabel( item, \'itemLabel\' )\">" +
            "                                </span>" +
            "                            </label>" +
            "                            <span class=\"tickMark\" ng-if=\"item[ tickProperty ] === true\" ng-bind-html=\"icon.tickMark\"></span>" +
            "                        </div>" +
            "                    </div>" +
            "                </div>" +
            "            </div>" +
            "        </span>");
        $templateCache.put('dir/checkMultiList.html', "    <span class=\"multiSelect inlineBlock\">" +
            "                <button id=\"{{directiveId}}\" type=\"button\"                " +
            "                    ng-click=\"toggleCheckboxes( $event );  refreshSelectedItems(); refreshButton();refreshButton(); prepareGrouping; prepareIndex();\"" +
            "                    ng-bind-html=\"varButtonLabel\" " +
            "                    ng-show=\"!noMulti\"" +
            "                    >" +
            "                </button>" +
            "                <div class=\"checkboxLayer noShadow\">" +
            "                    <div class=\"checkBanner\">{{::leftBana}}</div>" +
            "                    <div class=\"helperContainer\" ng-if=\"helperStatus.filter || helperStatus.all || helperStatus.none || helperStatus.reset \">" +
            "                        <div class=\"line\" ng-if=\"helperStatus.all || helperStatus.none || helperStatus.reset \">" +
            "                            <!--// select all-->" +
            "                            <button type=\"button\" class=\"helperButton\"" +
            "                                ng-disabled=\"isDisabled\"" +
            "                                ng-if=\"helperStatus.all\" " +
            "                                ng-click=\"select( \'all\', $event );\"" +
            "                                ng-bind-html=\"lang.selectAll\">" +
            "                            </button>" +
            "                            <button type=\"button\" class=\"helperButton\"" +
            "                                ng-disabled=\"isDisabled\"" +
            "                                ng-if=\"helperStatus.none\"" +
            "                                ng-click=\"select( \'none\', $event );\"" +
            "                                ng-bind-html=\"lang.selectNone\">" +
            "                            </button>" +
            "                            <button type=\"button\" class=\"helperButton reset\"" +
            "                                ng-disabled=\"isDisabled\"" +
            "                                ng-if=\"helperStatus.reset\"" +
            "                                ng-click=\"select( \'reset\', $event );\"" +
            "                                ng-bind-html=\"lang.reset\">" +
            "                            </button>" +
            "                        </div>" +
            "                        <div class=\"line\" style=\"position:relative\" ng-if=\"helperStatus.filter\">  " +
            "                            <input placeholder=\"{{lang.search}}\" type=\"text\"" +
            "                                ng-click=\"select( \'filter\', $event )\"" +
            "                                ng-model=\"inputLabel.labelFilter\"" +
            "                                ng-change=\"searchChanged()\" class=\"inputFilter\"" +
            "                                />" +
            "                            <button type=\"button\" class=\"clearButton\" ng-click=\"clearClicked( $event )\" >×</button> " +
            "                        </div> " +
            "                    </div>" +
            "                    <div class=\"checkBoxContainer\">" +
            "                        <div " +
            "                            ng-repeat=\"item in filteredModel | filter:removeGroupEndMarker\" class=\"multiSelectItem\"" +
            "                            ng-class=\"{selected: item[ tickProperty ]}\"" +
            "                            ng-click=\"syncItems( item, $event, $index );\">        " +
            "                        <div class=\"acol\">" +
            "                            <label>                               " +
            "                                <div ng-transclude></div>" +
            "                            </label>" +
            "                            <span class=\"tickMark\" ng-if=\"item[ tickProperty ] === true\" ng-bind-html=\"icon.tickMark\"></span>" +
            "                        </div>" +
            "                    </div>" +
            "                </div>" +
            "            </div>" +
            "            <div class=\"outChecked\">" +
            "                   <div class=\"checkBanner\">{{::rightBana}}</div>" +
            "                   <div class=\"checkBoxContainer\">" +
            "                        <div " +
            "                            ng-repeat=\"item in outputModel\" " +
            "                            ng-click=\"outClickItems( item, $event);\" class=\"multiSelectItem\" " +
            "                        ng-transclude></div>" +
            "                   </div>" +
            "            </div>" +
            "        </span>");
    }])

});