/*
 * 通用的指令集合
 */
define(['jquery', 'app', 'wDatePicker', 'slimscroll', 'ztree', 'perfect-scrollbar'], function ($, module) {

    /**
     * echarts
     * ------------------------------------------------------------------
     */
    module.directive('cgsEcharts', function () {
        return {
            restrict: 'A',
            scope: {
                options: '='
            },
            link: function (scope, element, attrs) {
                var chart;
                var chartId = attrs.cgsEcharts ? attrs.cgsEcharts : 'autoid';
                scope.$watch('options', function (n, o) {
                    if (scope.options) {
                        init();
                        /* if (chart) {
                             chart.setOption(scope.options);
                         }*/
                    }
                }, true);

                function dispose() {
                    if (chart) {
                        chart.dispose();
                        $(window).unbind('resize.' + chartId);
                    }
                }

                function init() {
                    dispose();
                    // 安全检测，未显示却加载则不init
                    if (element && scope.options) {
                        chart = echarts.init(element[0], 'macarons');
                        chart.showLoading({
                            text: '正在努力读取数据中……'
                        });
                        // 为echarts对象加载数据
                        chart.setOption(scope.options);
                        chart.hideLoading();
                        $(window).bind('resize.' + chartId, function () {
                            //						console.log(chartId);
                            chart.resize();
//                            chart.refresh();
                        });

                        //监控饼图扇形切换选中状态的事件
                        chart.on('pieselectchanged', function (params) {
                            scope.$emit("pieselectchanged", params);
                        });
                    }
                }
                init();

                scope.$on('$destroy', function () {
                    dispose();
                });
            }
        }
    });
    module.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            $(document).bind("keydown keypress", function (event) {
                if (event.which === 39) { //向右
                    scope.$apply(function () {
                        scope.$eval(attrs.ngRight);
                    });
                    event.preventDefault();
                }
                if (event.which === 37) { //向左
                    scope.$apply(function () {
                        scope.$eval(attrs.ngLeft);
                    });
                    event.preventDefault();
                }
                if (event.which === 46) { //delete键
                    scope.$apply(function () {
                        scope.$eval(attrs.ngDelete);
                    });
                    event.preventDefault();
                }
            });
        };
    });

    module.directive('repeatFinish', function () {
        return {
            link: function (scope, element, attr) {
                console.log(scope.$index)
                if (scope.$last == true) {
                    console.log('ng-repeat执行完毕')
                    scope.$eval(attr.repeatFinish)
                }
            }
        }
    })

    //滚动条 支持Chrome FireFox Opera IE6+
    module.directive('cgsSlim', [
	function () {
            return {
                restrict: 'AC',
                scope: {
                    options: '='
                },
                link: function (scope, element, attrs) {
                    var options;
                    if (scope.options) {
                        options = scope.options;
                    } else options = {
                        height: '490px',
                        size: '7px'
                    };
                    $(element).slimscroll(options);
                }
            }
	}]);
    //滚动条 edited by zjf
    module.directive('cgsSlimz', [
	function () {
            return {
                restrict: 'AC',
                scope: {
                    options: '='
                },
                link: function (scope, element, attrs) {
                    var options;
                    var watcher = scope.$watch('options', function () {
                        if (scope.options) {
                            options = scope.options;
                        } else options = {
                            height: '490px',
                            size: '7px'
                        };
                        for (var i in options) {
                            if (options[i]) {
                                $(element).slimscroll(options);
                                break;
                            }
                        }
                    }, true);
                    scope.$on('$destroy', function () {
                        if (watcher) {
                            watcher = null;
                        }
                    });
                }
            }
	}]);
    module.directive('mydraggable', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if (element.draggable && typeof (element.draggable) == "function") {
                    element.draggable({
                        handle: ".layHead"
                    });
                } else {
                    require(['jquery', 'jqueryUi'], function () {
                        if (element.draggable && typeof (element.draggable) == "function") {
                            element.draggable({
                                handle: ".layHead"
                            });
                        }
                    })
                }

            }
        }
    })
    /**
     * My97 datePicker
     * @author linyh
     * ------------------------------------------------------------------
     */
    module.directive('cgsDatePicker', function ($filter) {
            return {
                require: '?ngModel',
                restrict: 'A',
                link: function (scope, element, attrs, ngModel) {
                    if (typeof WdatePicker == 'function') {
                        var options = {};
                        options.dateFmt = attrs.dateFmt ? attrs.dateFmt : 'yyyy-MM-dd';
                        options.onpicked = function (dp) {
                            var object = dp.cal.newdate;
                            var date = new Date(object.y, object.M - 1, object.d, object.H, object.m, object.s);
                            if (!!ngModel)
                                ngModel.$setViewValue($filter('date')(date, options.dateFmt));
                        };
                        options.oncleared = function (dp) {
                            if (!!ngModel)
                                ngModel.$setViewValue(null);
                        };
                        options.onblur = function(){
                            if (!!ngModel)
                                ngModel.$setViewValue($filter('date')($(element).val()))
                        }
                        scope.$watch(attrs.ngModel, function (n, o) {
                            $(element).val($filter('date')(new Date(n), options.dateFmt));
                        });
                        var wdateFun = function () {
                            WdatePicker(options);
                        };
                        $(element).focus(wdateFun);
                        $(element).click(wdateFun);
                    }
                }
            }
        })
        /**
         * 模拟单选框组
         * @author hucj
         * ------------------------------------------------------------------
         */
        .directive('cgsRadio', function ($interval, dateFilter) {
            return {
                restrict: 'EA',
                require: '?ngModel',
                scope: {
                    items: '=',
                    curItem: '=ngModel'
                },

                template: ' <ul class="radio-list">\
	<li ng-repeat="item in items" ng-click="select(item,$index)" ng-class="{\'selected\':($index==0)}">{{item.name}}</li>\
				</ul>',
                link: function (scope, element, attrs, ctrls) {

                    var $ul = $(element).children('ul');
                    scope.select = function (item, index) {
                        ctrls.$setViewValue(item);
                        $ul.children('li.selected').removeClass('selected');
                        $ul.children('li').eq(index).addClass('selected');
                    };

                }
            }
        })
        /**
         * ztree
         * @author hecb
         * ------------------------------------------------------------------
         */
        .directive('cgsTree', function ($http) {
            return {
                require: '^ngModel',
                restrict: 'A',
                scope: {
                    zNodes: '=',
                    zSettings: '='
                },
                link: function (scope, element, attrs, ngModel) {
                    function initTree() {
                        if (!!scope.zNodes && !!scope.zSettings) {
                            var zObj = $.fn.zTree.init(element, scope.zSettings, scope.zNodes);
                            var zTreeObj = $.fn.zTree.getZTreeObj(attrs['id']);
                            zTreeObj.expandAll(true);
                            if (!!ngModel) {
                                ngModel.$setViewValue(zObj);
                            }
                        }
                    }
                    scope.$watch('zNodes', function (o, n) {
                        initTree();
                    });
                    scope.$watch('zSettings', function (o, n) {
                        initTree();
                    })
                    scope.$on('$destroy', function () {
                        var zTreeObj = $.fn.zTree.getZTreeObj(attrs['id']);
                        if (!!zTreeObj) {
                            zTreeObj.destroy();
                        }
                    });
                }
            };
        })
        .filter("ellipsis", function () {
            return function (string, length) {
                var out = "";
                if (string) {
                    if (string.length > length) {
                        out = string.substr(0, length) + "...";
                    } else {
                        out = string;
                    }
                }
                return out;
            }
        })


        //    滚动条固定表头
        .directive("selfPerfectScrollbar", function () {
            return {
                restrict: "A",
                scope: {
                    timestamp: '=timestamp', //通过时间戳更新滚动条，主要针对动态内容
                    options: "=",
                    events: "=",
                    scrollto: "="
                },
                link: function (scope, element, attr) {
                    var options = {
                        handlers: ['click-rail', 'drag-scrollbar', 'keyboard', 'wheel', 'touch'],
                        wheelSpeed: 1,
                        wheelPropagation: false,
                        swipePropagation: true,
                        swipeEasing: true,
                        minScrollbarLength: null,
                        maxScrollbarLength: null,
                        useBothWheelAxes: false,
                        suppressScrollX: false,
                        suppressScrollY: false,
                        scrollXMarginOffset: 0,
                        scrollYMarginOffset: 0,
                        theme: 'default'
                    };
                    //初始化配置项
                    var initOpts = function (opts) {
                        if (angular.isObject(opts)) {
                            for (var key in opts) {
                                options[key] = opts[key];
                            }
                        }
                    }
                    //绑定事件回调
                    var bindEvents = function (events) {
                        var eventsTemp = {
                            scrollx: 'ps-scroll-x',
                            scrolly: 'ps-scroll-y',
                            scrollup: 'ps-scroll-up',
                            scrolldown: 'ps-scroll-down',
                            scrollleft: 'ps-scroll-left',
                            scrollright: 'ps-scroll-right',
                            xreachstart: 'ps-x-reach-start',
                            xreachend: 'ps-x-reach-end',
                            yreachstart: 'ps-y-reach-start',
                            yreachend: 'ps-y-reach-end'
                        };
                        if (angular.isObject(events)) {
                            for (var prop in events) {
                                var callback = events[prop];
                                if (angular.isFunction(callback)) {
                                    $(element).unbind(eventsTemp[prop]);
                                    $(element).bind(eventsTemp[prop], function () {
                                        callback();
                                    })
                                }
                            }
                        }
                    }
                    //浏览器窗口改变事件回调
                    var resizeHandler = function () {
                        $(element).perfectScrollbar('update');
                    }

                    //初始化插件
                    var init = function () {
                        if (scope.options) {
                            initOpts(scope.options);
                        }
                        var position = $(element).css("position");
                        if (!position || position !== 'relative' || position !== 'absolute') {
                            $(element).css("position", "relative");
                        }
                        $(element).perfectScrollbar(options);
                    }

                    //页面销毁时销毁插件
                    scope.$on("$destroy", function () {
                        $(element).perfectScrollbar('destroy');
                        $(window).unbind("resize", resizeHandler);
                    });

                    //初始化指令
                    var initPage = function () {
                        //浏览器窗口事件绑定
                        $(window).bind("resize", resizeHandler);
                        //监听配置项
                        scope.$watch("options", function (nval, oval) {
                            init();
                            $(element).perfectScrollbar('update');
                        }, true);
                        //监听传入的时间戳
                        scope.$watch("timestamp", function (nval, oval) {
                            $(element).perfectScrollbar('update');
                        })
                        //插件事件绑定
                        scope.$watch("events", function (nval, oval) {
                            if (nval) bindEvents(nval);
                        });
                        //监听滚动至变化
                        scope.$watch("scrollto", function (nval, oval) {
                            var template = {
                                top: 'scrollTop',
                                left: 'scrollLeft'
                            }
                            if (nval) {
                                for (var direction in nval) {
                                    if (nval[direction]) {
                                        element[template[direction]] = nval[direction];
                                    }
                                }
                                $(element).perfectScrollbar('update');
                            }
                        }, true);

                        init();
                    }

                    initPage();

                }
            }
        })
        .directive("fileCtrl",function(){
            return {
                restrict: "A",
                scope: {
                    fileChange:"&"
                },
                link:function(scope,ele,attr){
                    var changeHandler = function(event){
                        var file = event.target.files[0];
                        scope.fileChange({file:file});
                    }
                    ele.bind("change",changeHandler);
                    scope.$on("$destroy",function(){
                        ele.unbind(changeHandler);
                    })
                }
            }
        })
        .directive("selfReadonly",function(){
            return{
                restrict:"A",
                link:function(scope,ele,attr){
                    scope.$watch(function(){
                        if(attr.focus){
                            $(ele).focus();
                        }
                        return scope.$eval(attr.selfReadonly);
                    },function(n,o){
                        n?$(ele).attr("readonly",n):$(ele).removeAttr("readonly");
                    })
                }
            }
        })
        //自定义选择框(支持联想功能)
        //author:rencp
        .directive("selfSelect", function ($timeout) {
            return {
                restrict: "AE",
                replace: true,
                scope: {
                    selectList: "=", //下拉框列表
                    bindData: "=", //输出绑定
                    formatter: '=', //{value:"value",label:"label"(string,array)}
                    changed:'='
                },
                template: "<div class='self-select'>" +
                    "<span ng-dblclick='labelDblclickHandler($event)' ng-click='labelClickHandler($event)' class='label-pannel' title='{{label}}' ng-bind='label'></span>" +
                    "<input ng-click='$event.stopPropagation()' class='input-pannel' ng-model='keyword' />" +
                    "<ul class='select-list' self-perfect-scrollbar timestamp='timestamp'><li ng-click='listClickHandler($event,item)' ng-repeat='item in list | filter:{label:keyword} as filterList' title='{{item.label}}'>{{item.label}}</li></ul>" +
                    "</div>",
                link: function (scope, ele, attr) {
                    var otherClickHandlerName;
                    var curSelect = {};
                    var isfirst = true;
                    var $body = $("body");
                    var $list = $(ele).find(".select-list");
                    var $input = $(ele).find(".input-pannel");
                    var $label = $(ele).find(".label-pannel");
                    var initStyle = function () {
                        var height = $(ele).height();
                        $(ele).css({
                            display: 'inline-block',
                            position: 'relative'
                        });
                        $label.css({
                            position: 'absolute',
                            zIndex: 1,
                            top: 0,
                            left: 0
                        });
                        $input.css({
                            position: 'absolute',
                            zIndex: -1,
                            top: 0,
                            left: 0
                        });
                        $list.css({
                            top: height + 2 + 'px'
                        });
                    }

                    var initList = function (list) {
                        if (!list || !angular.isArray(list)) return;
                        var formatter = scope.formatter;
                        var _list = angular.copy(list);
                        var value = formatter && formatter.value || "value";
                        var label = formatter ? (angular.isArray(formatter.label) ? formatter.label.join(",") : formatter.label) : "label";
                        _list.forEach(function (item) {
                            item.value = item[value];
                            item.label = item[label];
                        })
                        return _list;
                    }

                    var init = function () {
                        initStyle();
                        scope.list = initList(scope.selectList);
                        if(!otherClickHandlerName){
                            otherClickHandlerName = attr.selfSelect ? "otherClick" + attr.selfSelect : "otherClick" + Date.now();
                            scope[otherClickHandlerName] = function () {
                                $list.css("display", "none");
                                $label.css("zIndex", 1);
                                $input.css("zIndex", -1);
                            }
                            $body.bind("click", scope[otherClickHandlerName]);
                        }
                    }

                    scope.labelDblclickHandler = function (e) {
                        e.stopPropagation();
                        if(attr.readonly=="true")return;
                        $label.css("zIndex", -1);
                        $input.css("zIndex", 1).focus();
                        scope.keyword = curSelect.label;
                    }

                    scope.labelClickHandler = function (e) {
                        e.stopPropagation();
                        if(attr.readonly=="true")return;
                        scope.keyword = "";
                        $(".select-list").css("display", "none");
                        if (scope.list.length > 0) {
                            $list.css("display", "block");
                            scope.timestamp = Date.now();
                        }
                    }

                    scope.listClickHandler = function (e, item) {
                        e.stopPropagation();
                        scope.bindData = item.value;
                        scope.label = item.label;
                        curSelect = item;
                        $(".select-list").css("display", "none");
                        //$list.css("display", "none");
                        $label.css("zIndex", 1);
                        $input.css("zIndex", -1);
                        if(scope.changed && typeof(scope.changed)=='function'){
                            $timeout(function(){
                                 scope.changed(item.value,item);
                            },0);
                        }
                    }

                    scope.$on("$destroy", function () {
                        $body.unbind("click", scope[otherClickHandlerName]);
                    })

                    scope.$watch("selectList", function (n, o) {
                        if (n) {
                            var isFind = false;
                            init();
                            angular.forEach(scope.list, function (item) {
                                if (item.value == scope.bindData || (!item.value && !scope.bindData)) {
                                    scope.label = item.label;
                                    isFind = true;
                                }
                            })
                            if(!isFind){
                                scope.label = "";
                                scope.bindData = "";
                            }
                        }
                    }, true)

                    scope.$watch("bindData", function (n, o) {
                        init();
                        angular.forEach(scope.list, function (item) {
                            if (item.value == n) {
                                scope.label = item.label;
                            }
                        })
                    })

                    scope.$watch("keyword", function (n, o) {
                        if (!isfirst) $list.css("display", "block");
                        $input.removeClass("error-input");
                        if (scope.filterList && scope.filterList.length == 0 && n) {
                            $input.addClass("error-input");
                            $list.css("display", "none");
                        }
                        isfirst = false;
                    })



                }

            }
        })
});
