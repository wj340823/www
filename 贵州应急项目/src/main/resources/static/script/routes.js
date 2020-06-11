define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        //console.log(goto)
        $urlRouterProvider.when("", "loading")
            .when("/systemManage", "/systemManage/users")
            .when("/riskPrevention", "/riskPrevention/riskSource")
            .when('/home','/home/dataType1')
            .when("/riskPrevention/riskSpatial", "/riskPrevention/riskSpatial/resouceRelation")
            .when('/emergency','/emergency/emergencyMaterial')
            .when("/riskInvest", "/riskInvest/tabTodo")  //企业风险排查
            //.when("/riskInvest", "/riskInvest/checkAccount")  //企业风险排查
            .when("/enterpriseHead", "/enterpriseHead/emergencyManage")
            .when("/city", "/city/taskManage")  //市风险排查
            .when("/cityHead", "/cityHead/emergencyManage")  //市风险排查
            .when('/cityEmerCase','/cityEmerCase/material')
            .when("/approval", "/approval/waiter")
            .when("/countiesHead", "/countiesHead/emergencyManage")//县countiesHead
            .when("/emergencyPlan", "/emergencyPlan/emergencyManage")
            .when("/counties", "/counties/waiter")
            .when("/province", "/province/taskManage")
            .when("/emergencyShPlan", "/emergencyShPlan/emergencySPlan")
            .when('/msgManage','/msgManage/companyIntro')
            .when("/usermanage", "/usermanage/list")
            .otherwise("loading")
        $stateProvider.state("loading", { //load
            url: "/loading",
            templateUrl: "partials/loading.html"
        }).state("index", { //首页
            url: "/index",
            templateUrl: "partials/index.html", // jshint ignore:line
            controllerUrl: "script/controller/indexController"
        }).state("home", { //home
            url: "/home",
            templateUrl: "partials/home.html",
            controllerUrl: "script/controller/homeController"
        }).state("home.organise", { //机构人员
            url: "/organise",
            templateUrl: "partials/emergency/organizationPoeple.html",
            controllerUrl: "script/controller/emergencyController"
        }).state("home.dataType1", {
            url: "/dataType1",
            templateUrl: "partials/dataCenter/dataType1.html",
            controllerUrl: "script/controller/homeController"
        }).state("home.dataType2", {
            url: "/dataType2",
            templateUrl: "partials/dataCenter/dataType2.html",
            controllerUrl: "script/controller/homeController"
        }).state("home.dataType3", {
            url: "/dataType3",
            templateUrl: "partials/dataCenter/dataType3.html",
            controllerUrl: "script/controller/homeController"
        }).state("home.emerStatus1", {
            url: "/emerStatus1",
            templateUrl: "partials/dataCenter/emerStatus1.html",
            controllerUrl: "script/controller/homeController"
        }).state("home.emerStatus2", {
            url: "/emerStatus2",
            templateUrl: "partials/dataCenter/emerStatus2.html",
            controllerUrl: "script/controller/homeController"
        }).state("home.dealing", {
            url: "/dealing",
            templateUrl: "partials/dataCenter/dealing.html",
            controllerUrl: "script/controller/homeController"
        }).state("home.waterSource", {
            url: "/waterSource",
            templateUrl: "partials/dataCenter/waterSource.html",
            controllerUrl: "script/controller/homeController"
        }).state("home.river", {
            url: "/river",
            templateUrl: "partials/dataCenter/river.html",
            controllerUrl: "script/controller/homeController"
        }).state("system", { //系统设置，stateName和层级关系涉及到内部页面跳转，建议不要修改
            url: "/system",
            templateUrl: "partials/authority/system.html"
        }).state('system.user', { //用户管理
            url: "/user",
            views: {//route override view=hint@
                'hint@': {
                    templateUrl: "partials/authority/system/user.html"
                }
            }
        }).state('system.loginLog', { //用户管理
            url: "/loginLog",
            views: {//route override view=hint@
                'hint@': {
                    templateUrl: "partials/authority/system/loginLog.html"
                }
            }
        }).state('system.user.select', { //子用户
            url: "/:key",
            views: {
                'hint@': {//views字段是子路由覆盖父路由的关键。
                    templateUrl: "partials/authority/system/user/userSelect.html"
                }
            }
        }).state('system.group', { //群组
            url: "/group",
            views: {//route override view=hint@
                'hint@': {
                    templateUrl: "partials/authority/system/group.html"
                }
            }
        }).state('system.group.select', { //子用户
            url: "/:key",
            views: {
                'hint@': {//views字段是子路由覆盖父路由的关键。
                    templateUrl: "partials/authority/system/group/groupSelect.html"
                }
            }
        }).state('system.role', { //角色
            url: "/role",
            views: {//route override view=hint@
                'hint@': {
                    templateUrl: "partials/authority/system/role.html"
                }
            }
        }).state('system.role.select', { //子用户
            url: "/:key",
            views: {
                'hint@': {//views字段是子路由覆盖父路由的关键。
                    templateUrl: "partials/authority/system/role/roleSelect.html"
                }
            }
        }).state("riskPrevention", { //风险防控
            url: "/riskPrevention",
            templateUrl: "partials/riskPrevention.html",
            controllerUrl: "script/controller/riskController"
        }).state("riskPrevention.riskSource", { //风险源
            url: "/riskSource/:search",
            templateUrl: "partials/risk/riskSource.html",
            controllerUrl: "script/controller/riskController"
        }).state("riskPrevention.riskCheck", { //风险排查
            url: "/riskCheck",
            templateUrl: "partials/risk/riskCheck.html",
            controllerUrl: "script/controller/riskController"
        }).state("riskPrevention.riskSpatial", { //空间分析
            url: "/riskSpatial",
            templateUrl: "partials/risk/riskSpatial.html",
            controllerUrl: "script/controller/riskController"
        }).state("riskPrevention.riskSpatial.air", { //大气模型
            url: "/air",
            templateUrl: "partials/risk/airModel.html",
            controllerUrl: "script/controller/airController"
        }).state("riskPrevention.riskSpatial.water", { //水模型
            url: "/water",
            templateUrl: "partials/risk/waterModel.html",
            controllerUrl: "script/controller/waterController"
        }).state("riskPrevention.riskSpatial.resouceRelation", { //源关系
            url: "/resouceRelation",
            templateUrl: "partials/risk/resouceRelation.html",
            controllerUrl: "script/controller/resouceRelation"
        }).state("riskPrevention.riskSpatial.emergencyMng", { //应急管理
            url: "/emergencyMng",
            templateUrl: "partials/risk/emergencyMng.html",
            controllerUrl: "script/controller/emergencyMng"
        }).state("riskPrevention.riskSpatial.emergencyMoni", { //应急模拟
            url: "/emergencyMoni/:eid/:cid/:companyId",
            templateUrl: "partials/risk/emergencyMoni.html",
            controllerUrl: "script/controller/emergencyMoni"
        }).state("emergency", { //应急模块
            url: "/emergency",
            templateUrl: "partials/emergency.html",
            controllerUrl: "script/controller/emergencyController"
        }).state("emergency.emergencyMaterial", { //应急物资
            url: "/emergencyMaterial/:search",
            templateUrl: "partials/emergency/emergencyMaterial.html",
            controllerUrl: "script/controller/emergencyController"
        }).state("emergency.organise", { //机构人员
            url: "/organise",
            templateUrl: "partials/emergency/organizationPoeple.html",
            controllerUrl: "script/controller/emergencyController"
        }).state("emergency.experts", { //专家库
            url: "/experts",
            templateUrl: "partials/emergency/experts.html",
            controllerUrl: "script/controller/emergencyController"
        }).state("emergency.emerCase", { //应急案例
            url: "/emerCase",
            templateUrl: "partials/emergency/emergencyCase.html",
            controllerUrl: "script/controller/emergencyController"
        }).state("emergency.addCase", { //新增案例
            url: "/addCase/:id/:name/:area/:time",
            templateUrl: "partials/emergency/addCase.html",
            controllerUrl: "script/controller/emergencyController"
        }).state("emergency.editCase", { //修改案例
            url: "/editCase/:id/:name/:area/:time",
            templateUrl: "partials/emergency/addCase.html",
            controllerUrl: "script/controller/emergencyController"
        }).state("emergency.caseInfo", { //案例详情
            url: "/caseInfo/:name/:area/:time/:id",
            templateUrl: "partials/emergency/caseInfo.html",
            controllerUrl: "script/controller/emergencyController"
        }).state("emergency.upload", { //案例附件
            url: "/upload/:id",
            templateUrl: "partials/emergency/upLoadCase.html",
            controllerUrl: "script/controller/emergencyController"
        }).state("province", {//省级用户
            url: "/province",
            templateUrl: "partials/province/province.html",
            controllerUrl: "script/controller/provinceController",
        }).state("province.taskManage", {//任务管理
            url: "/taskManage",
            templateUrl: "partials/province/taskManage.html",
            controllerUrl: "script/controller/provinceController",
        }).state("province.taskApply", {//任务派发
            url: "/taskApply",
            templateUrl: "partials/province/taskApply.html",
            controllerUrl: "script/controller/provinceController",
        }).state("province.taskStatistics", {//任务统计
            url: "/taskStatistics/:id/:time/:taskName/:status/:info",
            templateUrl: "partials/province/taskStatistics.html",
            controllerUrl: "script/controller/provinceController",
        }).state("province.record", {//省排查记录
            url: "/record",
            templateUrl: "partials/province/record.html",
            controllerUrl: "script/controller/provinceController",
        }).state("province.recordInfo", {//省排查详情
            url: "/recordInfo/:itemNum",
            templateUrl: "partials/province/recordInfo.html",
            controllerUrl: "script/controller/approvalController",
        }).state("province.tbRiskCheck", {//省应急管理隐患排查表
            url: "/tbRiskCheck/:itemNum/:type/:name/:company/:id/:operate",
            templateUrl: "partials/enterprise/tbRiskCheck.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("province.tbRiskPrevent", {//省风险防控措施隐患排查表
            url: "/tbRiskPrevent/:itemNum/:type/:name/:company/:id/:operate",
            templateUrl: "partials/enterprise/tbRiskPrevent.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("province.majorDanger", {//省重大隐患
            url: "/majorDanger",
            templateUrl: "partials/province/majorDanger.html",
            controllerUrl: "script/controller/hiddenDangerController",
        }).state("province.manageDanger", {//省应急隐患
            url: "/manageDanger",
            templateUrl: "partials/province/manageDanger.html",
            controllerUrl: "script/controller/hiddenDangerController",
        }).state("province.environmentAccount", {//省生态环境部门环境隐患台账
            url: "/environmentAccount",
            templateUrl: "partials/province/environmentAccount.html",
            controllerUrl: "script/controller/riskInvestController",
        }).state("province.checkAccount", {//省企业自查环境隐患台账
            url: "/checkAccount",
            templateUrl: "partials/province/checkAccount.html",
            controllerUrl: "script/controller/riskInvestController",
        }).state("emergencyPlan", {//省应急头部
            url: "/emergencyPlan",
            templateUrl: "partials/province/emergencyPlan.html",
            controllerUrl: "script/controller/emergencyPlanController"
        }).state("emergencyPlan.emergencyManage", {//省应急管理
            url: "/emergencyManage",
            templateUrl: "partials/province/emergencyManage.html",
            controllerUrl: "script/controller/emergencyPlanController"
        }).state("emergencyPlan.emergencyAlarm", {//省备案告警
            url: "/emergencyAlarm",
            templateUrl: "partials/province/emergencyAlarm.html",
            controllerUrl: "script/controller/emergencyPlanShController"
        }).state("emergencyPlan.emergencyDetail", {//省应急详情
            url: "/emergencyDetail/:ID/:eId/:COMPANYNAME/:COMPANYID/:RECORDSTATUS/:RECORDTIME/:LEVEL/:UNDERSIGNED",
            templateUrl: "partials/province/emergencyDetail.html",
            controllerUrl: "script/controller/emergencyPlanController"
        }).state("emergencyPlan.emergencyStatistics", {//省应急统计
            url: "/emergencyStatistics",
            templateUrl: "partials/province/emergencyStatistics.html",
            controllerUrl: "script/controller/emergencyPlanController"
        }).state("city", {//市级用户
            url: "/city",
            templateUrl: "partials/city/city.html",
            controllerUrl: "script/controller/provinceController",
        }).state("city.taskManage", {//市任务管理
            url: "/taskManage",
            templateUrl: "partials/city/taskManage.html",
            controllerUrl: "script/controller/provinceController",
        }).state("city.taskStatistics", {//市任务统计
            url: "/taskStatistics/:id/:time/:taskName/:status/:info",
            templateUrl: "partials/city/taskStatistics.html",
            controllerUrl: "script/controller/provinceController",
        }).state("city.taskApply", {//市任务派发
            url: "/taskApply/:time/:taskName",
            templateUrl: "partials/city/taskApply.html",
            controllerUrl: "script/controller/cityController",
        }).state("city.addEnterprise", {//市任务派发
            url: "/addEnterprise/:id/:taskName/:time",
            templateUrl: "partials/city/addEnterprise.html",
            controllerUrl: "script/controller/cityController",
        }).state("city.record", {//市排查记录
            url: "/record",
            templateUrl: "partials/city/record.html",
            controllerUrl: "script/controller/provinceController",
        }).state("city.recordInfo", {//市排查详情
            url: "/recordInfo/:itemNum",
            templateUrl: "partials/city/recordInfo.html",
            controllerUrl: "script/controller/approvalController",
        }).state("city.tbRiskCheck", {//市应急管理隐患排查表
            url: "/tbRiskCheck/:itemNum/:type/:name/:company/:id/:operate",
            templateUrl: "partials/enterprise/tbRiskCheck.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("city.tbRiskPrevent", {//市风险防控措施隐患排查表
            url: "/tbRiskPrevent/:itemNum/:type/:name/:company/:id/:operate",
            templateUrl: "partials/enterprise/tbRiskPrevent.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("city.majorDanger", {//市重大隐患
            url: "/majorDanger",
            templateUrl: "partials/city/majorDanger.html",
            controllerUrl: "script/controller/hiddenDangerController",
        }).state("city.manageDanger", {//市应急隐患
            url: "/manageDanger",
            templateUrl: "partials/city/manageDanger.html",
            controllerUrl: "script/controller/hiddenDangerController",
        }).state("city.checkAccount", {//市企业自查环境隐患台账
            url: "/checkAccount",
            templateUrl: "partials/city/checkAccount.html",
            controllerUrl: "script/controller/riskInvestController",
        }).state("cityHead", {//市级应急头部
            url: "/cityHead",
            templateUrl: "partials/city/city.html",
            controllerUrl: "script/controller/provinceController",
        }).state("cityHead.emergencyManage", {//市应急管理
            url: "/emergencyManage",
            templateUrl: "partials/city/emergencyManage.html",
            controllerUrl: "script/controller/emergencyPlanShController"
        }).state("cityHead.emergencyDetail", {//市应急详情
            url: "/emergencyDetail/:ID/:eId/:COMPANYNAME/:COMPANYID/:RECORDSTATUS/:RECORDTIME/:LEVEL/:UNDERSIGNED/:documentYear/:preplanTel",
            templateUrl: "partials/city/emergencyDetail.html",
            controllerUrl: "script/controller/emergencyPlanShController"
        }).state("cityHead.emergencyAlarm", {//市备案告警
            url: "/emergencyAlarm",
            templateUrl: "partials/city/emergencyAlarm.html",
            controllerUrl: "script/controller/emergencyPlanShController"
        }).state("cityHead.emergencyStatistics", {//市应急统计
            url: "/emergencyStatistics",
            templateUrl: "partials/city/emergencyStatistics.html",
            controllerUrl: "script/controller/emergencyPlanShController"
        }).state("cityHead.emergencySub", {//市应急附件
            url: "/emergencySub/:ID",
            templateUrl: "partials/city/emergencySub.html",
            controllerUrl: "script/controller/emergencyPlanShController"
        }).state("cityEmerCase", {//市级应急资源
            url: "/cityEmerCase",
            templateUrl: "partials/city/city.html",
            controllerUrl: "script/controller/provinceController"
        }).state("cityEmerCase.emerCase", { //市应急案例
            url: "/emerCase",
            templateUrl: "partials/emergency/emergencyCase.html",
            controllerUrl: "script/controller/emergencyController"
        }).state("cityEmerCase.addCase", { //市新增案例
            url: "/addCase/:id/:name/:area/:time",
            templateUrl: "partials/emergency/addCase.html",
            controllerUrl: "script/controller/emergencyController"
        }).state("cityEmerCase.caseInfo", { //市案例详情
            url: "/caseInfo/:name/:area/:time/:id",
            templateUrl: "partials/emergency/caseInfo.html",
            controllerUrl: "script/controller/emergencyController"
        }).state("cityEmerCase.editCase", { //市修改案例
            url: "/editCase/:id/:name/:area/:time",
            templateUrl: "partials/emergency/addCase.html",
            controllerUrl: "script/controller/emergencyController"
        }).state("cityEmerCase.upload", { //市案例附件
            url: "/upload/:id",
            templateUrl: "partials/emergency/upLoadCase.html",
            controllerUrl: "script/controller/emergencyController"
        }).state("cityEmerCase.experts", { //市专家库
            url: "/experts",
            templateUrl: "partials/emergency/experts.html",
            controllerUrl: "script/controller/emergencyController"
        }).state("cityEmerCase.material", { //市专家库
            url: "/material",
            templateUrl: "partials/city/material.html",
            controllerUrl: "script/controller/cityController"
        }).state("approval", {//区县用户任务审批
            url: "/approval",
            templateUrl: "partials/counties/approval.html",
            params: {"check": null},
            controllerUrl: "script/controller/approvalController"
        }).state("approval.waiter", {//待审批
            url: "/waiter",
            templateUrl: "partials/counties/waiter.html",
            controllerUrl: "script/controller/approvalController"
        }).state("approval.drawing", {//已审批
            url: "/drawing",
            templateUrl: "partials/counties/drawing.html",
            controllerUrl: "script/controller/approvalController"
        }).state("approval.taskManage", {//任务管理
            url: "/taskManage",
            templateUrl: "partials/counties/taskManage.html",
            controllerUrl: "script/controller/provinceController",
        }).state("approval.taskStatistics", {//县任务统计
            url: "/taskStatistics/:id/:time/:taskName/:status/:info",
            templateUrl: "partials/counties/taskStatistics.html",
            controllerUrl: "script/controller/provinceController",
        }).state("approval.checkRecord", {//县排查记录
            url: "/checkRecord",
            templateUrl: "partials/counties/checkRecord.html",
            controllerUrl: "script/controller/provinceController",
        }).state("approval.recordInfo", {//县排查详情
            url: "/recordInfo/:itemNum",
            templateUrl: "partials/counties/recordInfo.html",
            controllerUrl: "script/controller/approvalController",
        }).state("approval.tbRiskCheck", {//县应急管理隐患排查表
            url: "/tbRiskCheck/:itemNum/:type/:name/:company/:id/:operate",
            templateUrl: "partials/enterprise/tbRiskCheck.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("approval.tbRiskPrevent", {//县风险防控措施隐患排查表
            url: "/tbRiskPrevent/:itemNum/:type/:name/:company/:id/:operate",
            templateUrl: "partials/enterprise/tbRiskPrevent.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("approval.majorDanger", {//重大隐患
            url: "/majorDanger",
            templateUrl: "partials/counties/majorDanger.html",
            controllerUrl: "script/controller/hiddenDangerController",
        }).state("approval.DangerDetail", {//县重大、一般隐患详情
            url: "/majorDangerDetail/:id/:level/:operate",
            templateUrl: "partials/enterprise/majorDangerDetail.html",
            controllerUrl: "script/controller/hiddenDangerController",
        }).state("approval.manageDanger", {//应急隐患管理
            url: "/manageDanger",
            templateUrl: "partials/counties/manageDanger.html",
            controllerUrl: "script/controller/hiddenDangerController",
        }).state("approval.manageDangerDetail", {//县应急隐患详情
            url: "/manageDangerDetail/:id/:operate/:taskName",
            templateUrl: "partials/enterprise/manageDangerDetail.html",
            controllerUrl: "script/controller/hiddenDangerController",
        }).state("approval.approvalInfo", {//审批详情
            url: "/approvalInfo/:itemNum/:operate",
            templateUrl: "partials/counties/approvalInfo.html",
            controllerUrl: "script/controller/approvalController",
        }).state("approval.checkAccount", {//县企业自查环境隐患台账
            url: "/checkAccount",
            templateUrl: "partials/counties/checkAccount.html",
            controllerUrl: "script/controller/riskInvestController",
        }).state("countiesHead", {//县应急头部
            url: "/countiesHead",
            templateUrl: "partials/counties/countiesHead.html",
            controllerUrl: "script/controller/countryController"
        }).state("countiesHead.emergencyManage", {//县应急管理
            url: "/emergencyManage",
            templateUrl: "partials/counties/emergencyManage.html",
            controllerUrl: "script/controller/countryController"
        }).state("countiesHead.emergencyAlarm", {//县备案告警
            url: "/emergencyAlarm",
            templateUrl: "partials/counties/emergencyAlarm.html",
            controllerUrl: "script/controller/emergencyPlanShController"
        }).state("countiesHead.emergencyDetail", {//县应急详情
            url: "/emergencyDetail/:ID/:eId/:COMPANYNAME/:COMPANYID/:RECORDSTATUS/:RECORDTIME/:LEVEL/:UNDERSIGNED",
            templateUrl: "partials/counties/emergencyDetail.html",
            controllerUrl: "script/controller/countryController"
        }).state("countiesHead.emergencyStatistics", {//县应急统计
            url: "/emergencyStatistics",
            templateUrl: "partials/counties/emergencyStatistics.html",
            controllerUrl: "script/controller/countryController"
        }).state("usermanage",{//县企业用户管理
            url: "/usermanage",
            templateUrl: "partials/counties/userManageIndex.html",
            controllerUrl: "script/controller/approvalController"
        }).state("usermanage.list",{//县企业用户管理
            url: "/list",
            templateUrl: "partials/counties/userManageList.html",
            controllerUrl: "script/controller/approvalController"
        }).state("riskInvest", {//企业风险排查
            url: "/riskInvest",
            templateUrl: "partials/enterprise/riskInvest.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("riskInvest.checkAccount", {//企业自查环境隐患台账
            url: "/checkAccount",
            templateUrl: "partials/enterprise/checkAccount.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("riskInvest.addCheckAccount", {//企业风险排查-新增
            url: "/addCheckAccount",
            templateUrl: "partials/enterprise/addCheckAccount.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("riskInvest.tabTodo", {//待办任务
            url: "/tabTodo",
            templateUrl: "partials/enterprise/tabTodo.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("riskInvest.tabFinish", {//已办任务
            url: "/tabFinish",
            templateUrl: "partials/enterprise/tabFinish.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("riskInvest.majorDanger", {//企业重大隐患
            url: "/majorDanger",
            templateUrl: "partials/enterprise/majorDanger.html",
            controllerUrl: "script/controller/hiddenDangerController",
        }).state("riskInvest.generalDanger", {//企业一般隐患
            url: "/generalDanger",
            templateUrl: "partials/enterprise/generalDanger.html",
            controllerUrl: "script/controller/hiddenDangerController",
        }).state("riskInvest.DangerDetail", {//企业重大、一般隐患详情
            url: "/majorDangerDetail/:id/:level/:operate",
            templateUrl: "partials/enterprise/majorDangerDetail.html",
            controllerUrl: "script/controller/hiddenDangerController",
        }).state("riskInvest.manageDanger", {//企业应急隐患管理
            url: "/manageDanger",
            templateUrl: "partials/enterprise/manageDanger.html",
            controllerUrl: "script/controller/hiddenDangerController",
        }).state("riskInvest.manageDangerDetail", {//企业应急隐患详情
            url: "/manageDangerDetail/:id/:operate/:taskName",
            templateUrl: "partials/enterprise/manageDangerDetail.html",
            controllerUrl: "script/controller/hiddenDangerController",
        }).state("riskInvest.tbRiskCheck", {//应急管理隐患排查表
            url: "/tbRiskCheck/:itemNum/:type/:name/:company/:id/:operate",
            templateUrl: "partials/enterprise/tbRiskCheck.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("riskInvest.tbRiskPrevent", {//风险防控措施隐患排查表
            url: "/tbRiskPrevent/:itemNum/:type/:name/:company/:id/:operate",
            templateUrl: "partials/enterprise/tbRiskPrevent.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("riskInvest.taskInfo", {//企业任务详情
            url: "/taskInfo/:itemNum/:name/:company/:id/:operate/:hasDone",
            templateUrl: "partials/enterprise/taskInfo.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("riskInvest.tabFinishInfo", {//已办任务详情
            url: "/tabFinishInfo/:itemNum",
            templateUrl: "partials/enterprise/tabFinishInfo.html",
            controllerUrl: "script/controller/approvalController"
        }).state("enterpriseHead", {//企业应急预案
            url: "/enterpriseHead",
            templateUrl: "partials/enterprise/emergencyPlan.html",
            controllerUrl: "script/controller/enterpriseController"
        }).state("enterpriseHead.emergencyManage", {//企业应急预案管理
            url: "/emergencyManage",
            templateUrl: "partials/enterprise/emergencyManage.html",
            controllerUrl: "script/controller/enterpriseController"
        }).state("enterpriseHead.addemergency", {//企业应急预案管理-新增
            url: "/addemergency/:opType/:index/:level/:id",
            templateUrl: "partials/enterprise/addemergency.html",
            controllerUrl: "script/controller/enterpriseController"
        }).state("enterpriseHead.emergencyDetail", {//企业应急详情
            url: "/emergencyDetail/:opType/:id/:RECORDTIME/:COMPANYNAME/:RECORDSTATUS/:RISKGRADE/:UNDERSIGNED/:PREPLANTEL",
            templateUrl: "partials/enterprise/emergencyDetail.html",
            controllerUrl: "script/controller/enterpriseController"
        }).state("enterpriseHead.emergencyFile", { //企业应急附件
            url: "/emergencyFile/:id",
            templateUrl: "partials/enterprise/emergencyFile.html",
            controllerUrl: "script/controller/enterpriseController"
        }).state("msgManage", {//企业信息管理
            url: "/msgManage",
            templateUrl: "partials/enterprise/riskInvest.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.companyIntro", {//公司简介
            url: "/companyIntro",
            templateUrl: "partials/enterprise/companyIntro.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.hgsjt", {//宏观数据图
            url: "/hgsjt",
            templateUrl: "partials/enterprise/comMsg/hgsjt.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.hjfxys", {//环境风险要素
            url: "/hjfxys",
            templateUrl: "partials/enterprise/comMsg/hjfxys.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.hjfxwz", {// 环境风险物质
            url: "/hjfxwz",
            templateUrl: "partials/enterprise/comMsg/hjfxwz.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.hjfxdy", {// 环境风险单元
            url: "/hjfxdy",
            templateUrl: "partials/enterprise/comMsg/hjfxdy.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.hjfxfkss", {// 环境风险防控设施
            url: "/hjfxfkss",
            templateUrl: "partials/enterprise/comMsg/hjfxfkss.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.sczzq", {//生产装置区
            url: "/sczzq",
            templateUrl: "partials/enterprise/comMsg/sczzq.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.scgy", {//生产工艺
            url: "/scgy",
            templateUrl: "partials/enterprise/comMsg/scgy.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.hjbhmb", {//环境风险受体
            url: "/hjbhmb",
            templateUrl: "partials/enterprise/comMsg/hjbhmb.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.hjwrsgy", {//环境污染事故源
            url: "/hjwrsgy",
            templateUrl: "partials/enterprise/comMsg/hjwrsgy.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.tfhjsjqjfx", {// 突发环境事件情景分析
            url: "/tfhjsjqjfx",
            templateUrl: "partials/enterprise/comMsg/tfhjsjqjfx.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.yjwz", {//应急物资
            url: "/yjwz",
            templateUrl: "partials/enterprise/comMsg/yjwz.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.yjzhtxl", {//应急指挥通讯录
            url: "/yjzhtxl",
            templateUrl: "partials/enterprise/comMsg/yjzhtxl.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.yjwbllb", {//应急外部联络表
            url: "/yjwbllb",
            templateUrl: "partials/enterprise/comMsg/yjwbllb.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.yjzj", {//应急专家
            url: "/yjzj",
            templateUrl: "partials/enterprise/comMsg/yjzj.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.addtr1", {//生产装置区
            url: "/addtr1/:opType/:name/:materials/:productName/:annualCapacity/:id",
            templateUrl: "partials/enterprise/comMsg/addtb1.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.addtr2", {//环境保护目标
            url: "/addtr2/:opType/:bhlx/:protectionObjectives/:position/:distance/:hlzl/:households/:objective/:jd/:wd/:standard/:id",
            templateUrl: "partials/enterprise/comMsg/addtb2.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.addtr3", {//环境污染事故源
            url: "/addtr3/:opType/:index/:id",
            templateUrl: "partials/enterprise/comMsg/addtb3.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.addtr4", {//应急物资
            url: "/addtr4/:opType/:name/:number/:numberUtil/:typeNumber/:address/:id",
            templateUrl: "partials/enterprise/comMsg/addtb4.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.addtr5", {//应急指挥通讯录
            url: "/addtr5/:opType/:index/:id",
            templateUrl: "partials/enterprise/comMsg/addtb5.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.addtr6", {//应急外部联络表
            url: "/addtr6/:opType/:index/:id",
            templateUrl: "partials/enterprise/comMsg/addtb6.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.addtr7", {//应急专家
            url: "/addtr7/:opType/:index/:id",
            templateUrl: "partials/enterprise/comMsg/addtb7.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.addtr8", {//环境风险物质
            url: "/addtr8/:opType/:fxlx/:name/:chemicalCode/:place/:storage/:ljl/:id",
            templateUrl: "partials/enterprise/comMsg/addtb8.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.addtr9", {//环境风险单元
            url: "/addtr9/:opType/:riskName/:address/:unitName/:maxNumber/:sfwy/:sffs/:sfff/:sfwscl/:sfqtcl/:id",
            templateUrl: "partials/enterprise/comMsg/addtb9.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.addtr10", {// 突发环境事件情景分析
            url: "/addtr10/:opType/:place/:measures/:id",
            templateUrl: "partials/enterprise/comMsg/addtb10.html",
            controllerUrl: "script/controller/riskInvestController"
        }).state("msgManage.addscgy", {// 生产工艺
            url: "/addscgy/:opType/:gylx/:gyName/:id",
            templateUrl: "partials/enterprise/comMsg/addscgy.html",
            controllerUrl: "script/controller/riskInvestController"
        });
    }
    ])
})
