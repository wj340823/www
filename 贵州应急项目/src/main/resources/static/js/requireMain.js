'use strict';

(function (win) {
    //配置baseUrl
    var baseUrl = document.getElementById('main').getAttribute('data-baseurl');

    /*
     * 文件依赖
     */
    var config;
    config = {
        baseUrl: baseUrl, //依赖相对路径
        waitSeconds: 60,
        urlArgs: "version=@release-version@",
        paths: { //如果某个前缀的依赖不是按照baseUrl拼接这么简单，就需要在这里指出
            'jquery': 'js/jquery-2.1.3.min',
            'printw': 'js/jQuery.print.min',
            'angular': 'js/angular.min',
            'angularAnimate': 'js/angular-animate.min',
            'angularUiRouter': 'js/angular-ui-router.min',
            'angularAsyncLoader': 'js/angular-async-loader.min', //符合AMD规范
            'angularVsRepeat': 'js/angular-vs-repeat.min', //符合AMD规范
            'fileUpload': 'js/angular-file-upload.min', //符合AMD规范
            'angularSanitize': 'js/angular-sanitize.min',
            'uiBootstrapTpls': 'js/ui-bootstrap-tpls.min',
            'angularCgsUtil': 'script/directive/angular-cgs-utils',
            'sucHelpers': 'script/service/sucHelpers',
            'mapSet': 'script/service/mapSet',
            'chartSet': 'script/service/chartSet',
            'wDatePicker': 'plugin/My97DatePicker/WdatePicker',
            'slimscroll': 'js/jquery.slimscroll',
            'perfect-scrollbar': 'js/perfect-scrollbar.jquery.min',
            'ztree': 'plugin/ztree/js/jquery.ztree.all-3.5.min',
            'jqueryUi': 'plugin/jquery-ui/jquery-ui.min',
            'slider': "js/slider",
            'pOl3': 'plugin/OpenLayers/p-ol3/p-ol3.min',
            'colorPicker': 'plugin/color-picker/color-picker',
            'openLayers': 'plugin/OpenLayers/4/ol',
            'angularOpenlayersDirective': 'plugin/OpenLayers/dist/angular-openlayers-directive',
            'app': 'script/app',
            'routes': 'script/routes',
            'appCtrl': 'script/controller/appController',
            'mapCtrl': 'script/controller/mapController',
            'authox': 'js/authox-ng',
            'sysCtrl': 'partials/authority/script/sysController',
            'userCtrl': 'partials/authority/script/userController',
            'groupCtrl': 'partials/authority/script/groupController',
            'roleCtrl': 'partials/authority/script/roleController',
            'role2Ctrl': 'partials/authority/script/role2Controller',
            'riskSourceCtrl': 'script/controller/riskController',
            'sucHelpers2': 'partials/authority/script/sucHelpers',
            'flowplayer':'plugin/flowplayer/flowplayer',
            'flowplayerhls':'plugin/flowplayer/flowplayer.hlsjs.min'
        },
        shim: { //引入没有使用requirejs模块写法的类库
            'angular': {
                exports: 'angular',
                deps: ['jquery']
            },
            'angularSanitize': {
                deps: ['angular'] //依赖什么模块
            },
            'angularVsRepeat': {
                deps: ['angular']
            },
            'angularAnimate': {
                deps: ['angular'] //依赖什么模块
            },
            'angularUiRouter': {
                deps: ['angular']
            },
            'uiBootstrapTpls': {
                deps: ['angular']
            },
            'authox': {
                deps: ['angular']
            },
            'wDatePicker': {
                deps: ['jquery']
            },
            'slimscroll': {
                deps: ['jquery']
            },
            'ztree': {
                deps: ['jquery']
            },
            'jqueryUi': {
                deps: ['jquery']
            },
            'slider': {
                deps: ['angular', 'jquery', 'jqueryUi']
            },
            'colorPicker': {
                deps: ['angular', 'slider']
            },
            'fileUpload': {
                deps: ['angular']
            },
            'routes':{
                deps: ['jquery']
            },
            'flowplayerhls':{
                deps: ['flowplayer']
            }
        }
    };

    require.config(config);

    require(['jquery', 'angular', 'routes', 'app', 'appCtrl','sysCtrl','userCtrl','groupCtrl','roleCtrl','role2Ctrl','sucHelpers2'], function ($, angular) {
        angular.bootstrap(document, ['frame']); //动态方式启动angular
    });

})(window);
