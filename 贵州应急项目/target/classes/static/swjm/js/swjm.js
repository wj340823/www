﻿    var depart=[],fxdy=[],yjwz=[],fxAddress=[]
    wrsj=[
        {name:'水污染事件', children:[{name:'磷酸泄漏'}],
            info:[
                {name:'贵州开磷集团矿肥有限责任公司磷酸泄漏',level:'一般',hurtNumber:0,lost:'10w',strTime:'2018-5-4 13:02:33',
                    endTime:'2018-5-4 14:12:54',reason:'由于贮存罐上，阀门破裂，导致泄漏',
                    des:'在应急指挥部的领导下，各部门应急小组，积极配合，合力处置， 经过2个小时的处理，泄漏已经停滞，' +
                    '泄漏的污染物已经得到控制和处理。'}
                ]
        },
    ];
    ayfx=[
        {name:'遨游飞行'},
    ];
    var latlon = [],viewHeight = 50;
    var companyId = window.location.search.slice(4).split('&')[0];
    var yjwzkLon , yjwzkLat;
function getYjry(){
    $.ajax({
        method:'GET',
        url:'../riskSource/getDepartmentFromCrew?companyId='+companyId,
        success:function (data) {
            depart=data;
            console.log(data);
            depart.forEach(function (item,i) {
                var inner='<li class="depart"> <div class="depName">' +
                    '<span onclick="locate(1,'+item.LA+','+item.LO+')">'+item.DEPARTMENT+'</span> </div></li> ';
                $('.depList .depCon').append(inner);
                var depItem=item.DEPARTMENT;
                latlon.push({LONGITUDE:item.LO,LATITUDE:item.LA,objectId:1,name:item.DEPARTMENT})
                //console.log($('.depart:eq(i) .dep-people'))
            })
            initCreateSite();
        },
        error:function () {
            alert('未获取到应急部门信息！')
        }
    });

}

function getFxdy(){
    $.ajax({
        method:'GET',
        url:'../app/getDangerUnitInfo?companyId='+companyId,
        success:function (data) {
            fxdy=data.DangerUnit;
            //console.log(fxdy)
            fxdy.forEach(function (item,i) {
                var inner='<li class="depart"> ' +
                    '<div class="depName"><span onclick="locate(2,'+item.LA+','+item.LO+')">'+item.NAME+'</span></div> '
                $('.fxdy .depCon').append(inner);
                fxAddress.push({LONGITUDE:item.LO,LATITUDE:item.LA,objectId:3,name:item.NAME})
                //console.log(arrItem)
            })
            initCreateSite2()
        },
    });

}

function getYjwz(){
    $.ajax({
        method:'GET',
        url:'../riskSource/getEmergencySubstance?companyId='+companyId+'&pageSize=100000',
        success:function (data) {
            yjwz=data.dataList
            //console.log(yjwz)
            var inner='<li class="depart"> ' +
                '<div class="depName"><span onclick="locate(3)">应急物资库</span></div>'
            $('.yjwz .depCon').append(inner);
            yjwzkLon = data.dataList[0].LO
            yjwzkLat = data.dataList[0].LA
            initCreateSite1()
        }
    })
}

function getWrsj() {
    wrsj.forEach(function (item,i) {
        var inner='<li class="depart"> ' +
            '<div class="depName"><span onclick="locateMove(0)">'+item.name+'</span> </div> ';
         $('.wrsj .depCon').append(inner);
        initCreateSite3()
    })
}

function getAyfx() {
   ayfx .forEach(function (item,i) {
       var inner='<li class="depart"> ' +
           '<div class="depName" onclick="locateMove(1)"><span>'+item.name+'</span></div> </li>';
       $('.ayfx .depCon').append(inner);
   })
}


function itemToggle(n) {
    $('.depList').hide();
    $('.fxdy').hide();
    $('.yjwz').hide();
    $('.wrsj').hide();
    $('.ayfx').hide();
    $('.toggleMenu li i').removeClass('active')
    $(event.target).addClass('active')
    if(n==1){
        $('.depList').show();
        hideAllTree();
        SGWorld.ProjectTree.SetVisibility(_yjrySiteGroup,true);
        $('.swmap').removeClass('swmap1');
    }else if(n==2){
        $('.fxdy').show();
        hideAllTree();
        SGWorld.ProjectTree.SetVisibility(_fxdySiteGroup,true);
        $('.swmap').removeClass('swmap1');
    }else if(n==3){
        $('.yjwz').show();
        hideAllTree();
        SGWorld.ProjectTree.SetVisibility(_yjwzSiteGroup,true);
        $('.swmap').removeClass('swmap1');
    }else if(n==4){
        $('.wrsj').show();
        hideAllTree();
        $('.swmap').removeClass('swmap1');
    }else if(n==5){
        $('.ayfx').show();
        $('.swmap').removeClass('swmap1');
        hideAllTree();
    }else {
        $('.swmap').addClass('swmap1');
    }
}

function showPeople(i) {
    $(event.target).toggleClass('icon-zhankai4-copy')
    $(event.target).parent().next().stop()
    $(event.target).parent().next().slideToggle(400)
}

/*$(window.frames["iframeSon"].document).find('.spanfr').click = function () {
    alert(1)
    $('.msgAlert').hide()
}*/
//console.log($(window.frames["iframeSon"].document).find('.spanfr'))
function locate(n,lat,lon) {
    if(n==1){
        var position = SGWorld.Creator.CreatePosition( lon, lat, 1000, 0,
            0, -89, 0, 0);
        SGWorld.Navigate.FlyTo(position);
    }else  if(n==2){
        var position = SGWorld.Creator.CreatePosition(lon, lat, 1000, 0,
            0, -89, 0, 0);
        SGWorld.Navigate.FlyTo(position);
    }else if(n==3){
        var position = SGWorld.Creator.CreatePosition(yjwzkLon, yjwzkLat, 1000, 0,
            0, -89, 0, 0);
        SGWorld.Navigate.FlyTo(position);
    }
    $('.depCon span').removeClass('active')
    $(event.target).addClass('active')

}
function locateMove(e) {
    if(e==0){
        showLinSuanXL();
    }else  if(e==1){
        planeFLy();
    }
    $('.depCon span').removeClass('active')
    $(event.target).addClass('active')
}

/**
 * 三维地图js方法
 */
var _yjrySiteGroup,_yjwzSiteGroup,_fxdySiteGroup,_imageLabelArr=[],_linSuanSiteGroup,_linSuanXL1;
//隐藏所有节点
function hideAllTree(){
    SGWorld.ProjectTree.SetVisibility(_yjrySiteGroup,false);
    SGWorld.ProjectTree.SetVisibility(_yjwzSiteGroup,false);
    SGWorld.ProjectTree.SetVisibility(_fxdySiteGroup,false);
    SGWorld.ProjectTree.SetVisibility(_linSuanSiteGroup,false);
    SGWorld.ProjectTree.SetVisibility(_linSuanXL1,false);
}

//初始化三维js，创建各节点树
function initRoot(){
    //创建ProjectTree group，用于放置对应的监测测点
    _yjrySiteGroup = SGWorld.ProjectTree.CreateGroup('yjrySiteGroup', '');//应急人员点project Group
    _yjwzSiteGroup = SGWorld.ProjectTree.CreateGroup('yjwzSiteGroup', '');//应急物资点project Group
    _fxdySiteGroup = SGWorld.ProjectTree.CreateGroup('fxdySiteGroup', '');//风险单元点project Group
    _linSuanSiteGroup = SGWorld.ProjectTree.CreateGroup('linSuanSiteGroup', '');//磷酸泄露点project Group
    _planeGroup = SGWorld.ProjectTree.CreateGroup('planeGroup', '');

    _linSuanXL1 = SGWorld.ProjectTree.FindItem("磷酸泄漏1");// 得到飞行节点

    SGWorld.AttachEvent("OnLButtonClicked", onLButtonClicked);//定义鼠标点击事件;6.6才有此事件监听

    //initCreateSite();swjm.jsswjm.js
    //初始化设置应急物资、风险单元隐藏
    getYjry();
    getFxdy();
    getYjwz();
    getWrsj();
    getAyfx();
    iconHide();
}
function iconHide(){
    SGWorld.ProjectTree.SetVisibility(_yjwzSiteGroup,false);
    SGWorld.ProjectTree.SetVisibility(_fxdySiteGroup,false);
    SGWorld.ProjectTree.SetVisibility(_linSuanSiteGroup,false);
    SGWorld.ProjectTree.SetVisibility(_linSuanXL1,false);
}
//初始化创建所有图片标注
function initCreateSite(){
    /*var record1 = {
        LONGITUDE : 106.859217222222,
        LATITUDE : 27.1386241666666,
        objectId : 1,
        name: '何国勇'
    }*/
    //创建应急人员点位
    latlon.forEach(function (i,j) {
        createSiteImageLabel(i,_yjrySiteGroup,"yjry",viewHeight);
    })
    console.log(latlon)
}
function initCreateSite1() {
    //创建应急物资点位
    var record2 = {
        LONGITUDE : yjwzkLon,
        LATITUDE : yjwzkLat,
        objectId : 2,
        name: '应急物资库'
    }
    createSiteImageLabel(record2,_yjwzSiteGroup,"yjwz",viewHeight);
}
function initCreateSite2() {
    //创建风险单元点位
    /*var record3 = {
        LONGITUDE : 106.856220555555,
        LATITUDE : 27.1439161111111,
        objectId : 3,
        name: '硫酸罐区'
    }*/
    fxAddress.forEach(function (i) {
        createSiteImageLabel(i,_fxdySiteGroup,"fxdy",viewHeight);
    })
    console.log(fxAddress)
}
function initCreateSite3() {
    //创建磷酸泄露点位
    var record4 = {
        LONGITUDE : 106.8563475,
        LATITUDE : 27.143662777,
        objectId : 4,
        name: '磷酸泄露1'
    }
    createSiteImageLabel(record4,_linSuanSiteGroup,"lsxl",viewHeight);
}
//initCreateSite3()
//创建图片标注
function createSiteImageLabel(record, siteGroup,cdlx,dep){
    var imageUrl = '';
    var mhigh = 50000;
    var limitScreenSize = 30;
    try{
        //根据测点类型设置测点图片
        if (cdlx == "yjry") {
            imageUrl = 'swjm/images/people.png';
            //imageUrl ='D:/gzxm/upload/swjmImg/people.png'
        } else if (cdlx == "yjwz") {
            imageUrl = 'swjm/images/yjwz.png';
        }else if (cdlx == "fxdy") {
            imageUrl = 'swjm/images/fxdy.png';
        }else if (cdlx == "lsxl") {
            imageUrl = 'swjm/images/wrsj.png';
        }

        var position = SGWorld.Creator.CreatePosition(parseFloat(record.LONGITUDE),
            parseFloat(record.LATITUDE), dep, 0, 0.0, 0.0, 0, 0);
        console.log(toAbsPath(imageUrl));
        var LabelStyle = SGWorld.Creator.CreateLabelStyle();
        var ImageLabel = SGWorld.Creator.CreateLabel(position, '',
            toAbsPath(imageUrl), LabelStyle, siteGroup, '');
        ImageLabel.Style.TextOnImage = false;
        ImageLabel.Style.Bold = true;
        ImageLabel.Style.LineToGround = false;
        ImageLabel.Style.MultilineJustification = "left";
        ImageLabel.Style.TextAlignment = "bottom";
        ImageLabel.Style.MaxViewingHeight = mhigh;
        ImageLabel.Style.MinViewingHeight = 1;
        ImageLabel.Style.LimitScreenSize = limitScreenSize;
        ImageLabel.Style.LockMode = 0;
        ImageLabel.Tooltip.Text = record.name;
        console.log(ImageLabel);
        var obj={
            labelId : ImageLabel.ID,
            cdlx :cdlx,  //测点类型
            name:record.name,
            objectId : record.objectId
        }
        _imageLabelArr.push(obj);

    }catch(e){
        alert(e);
    }
}
//图标点击事件
function onLButtonClicked(Flags, X, Y){
    var worldInfo = SGWorld.Window.PixelToWorld(X, Y, -1);// 得到单击的对象
    if (worldInfo.type == 2) {// 判断点击的对象是否为label
        var obj = SGWorld.Creator.GetObject(worldInfo.ObjectID);// 得到点击的对象
        for (var i = 0; i < _imageLabelArr.length; i++) {
            //console.log( _imageLabelArr);
            if (obj.ID == _imageLabelArr[i].labelId) {
                if (_imageLabelArr[i].cdlx == "yjry") {// 应急人员
                    /*alert(_imageLabelArr[i].name);*/
                    msgAlertHide()
                    $('.msgAlert1').show();
                    $(window.frames["iframeSon1"].document).find('.yjryList').show();
                    $(window.frames["iframeSon1"].document).find('.a-title').text('应急人员_'+_imageLabelArr[i].name);
                    var str='<tr><th>序号</th><th>应急职务</th><th>姓名</th><th>单位职务</th><th>联系电话</th></tr>';
                    $(window.frames["iframeSon1"].document).find('.yjryList').html(str);
                    console.log(_imageLabelArr[i].name);
                    $.ajax({
                        method:'GET',
                        url:'../riskSource/getEmergencyCrew?companyId='+companyId+'&keywords='+encodeURIComponent(_imageLabelArr[i].name),
                        success:function (data) {
                            //console.log(data)
                            data.forEach(function (item,i) {
                                var str='<tr><td>'+parseInt(i+1)+'</td><td>'+item.companyAgency+'</td><td>'+item.name+'</td>' +
                                    '<td>'+(item.theUtil==null?' ':item.theUtil)+'</td><td>'+item.telephone+'</td></tr>';
                                $(window.frames["iframeSon1"].document).find('.yjryList').append(str);
                            })
                        }
                    })

                }
                else if (_imageLabelArr[i].cdlx == "yjwz") {// 应急物资
                    /*alert(_imageLabelArr[i].name);
                    createCDWin(obj, i);*/
                    msgAlertHide()
                    $('.msgAlert1').show();
                    $(window.frames["iframeSon1"].document).find('.yjwzList').show()
                    $(window.frames["iframeSon1"].document).find('.a-title').text('应急物资');
                    var str='<tr><th>序号</th><th>名称</th><th>型号</th><th>单位</th><th>数量</th><th>贮存地点</th></tr>'
                    $(window.frames["iframeSon1"].document).find('.yjwzList').html(str)
                    yjwz.forEach(function (item,i) {
                        var str = '<tr><td>'+parseInt(i+1)+'</td><td>'+item.name+'</td><td>'+(item.typeNumber==null?' ':item.typeNumber)+'</td>' +
                            '<td>'+item.numberUtil+'</td><td>'+item.number+'</td><td>'+item.address+'</td></tr>';
                        $(window.frames["iframeSon1"].document).find('.yjwzList').append(str);
                    })
                }
                else if (_imageLabelArr[i].cdlx == "fxdy") {// 风险单元
                    $('.msgAlert1').show();
                    msgAlertHide()
                    $(window.frames["iframeSon1"].document).find('.fxdyList').show()
                    $(window.frames["iframeSon1"].document).find('.a-title').text('风险单元_'+_imageLabelArr[i].name);
                    var str='<tr><th>序号</th><th>单元名称</th><th>贮存方式</th><th>贮存危化品</th><th>贮存设备数量</th>' +
                        '<th>设计容量</th><th>临界量</th></tr>';
                    //$(window.frames["iframeSon1"].document).find('.fxdyList').html(str);
                    fxdy.forEach(function (item) {
                        if(item.NAME == _imageLabelArr[i].name){
                            var str1 ='';
                            item.CSL.split(',').forEach(function (k) {
                                str1+=k+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                            })
                            str1='<div class="conIntro"> '+str1+'</div>'
                            var str2= '<div class="dangerInfo"><div><div class="item-titleSub" >理化特性</div><div class="item-text">'+(item.LHTX||"<span class='dangerColor'>暂无数据</span>")+'</div></div>' +
                                '<div><div class="item-titleSub">潜在环境污染事故以及环境突发事件危险性分析</div><div class="item-text">'+(item.YINGXIANG||"<span class='dangerColor'>暂无数据</span>")+'</div></div>' +
                                '<div><div class="item-titleSub" >应急保障</div><div class="item-text">'+(item.YJBZ||"<span class='dangerColor'>暂无数据</span>")+'</div></div>' +
                                '<div><div class="item-titleSub">专项应急处置方案</div><div class="item-text">'+(item.CZFA||"<span class='dangerColor'>暂无数据</span>")+' </div></div></div>'
                                /*'<div><div class="item-titleSub">隔离与公共安全</div><div class="item-text">'+(item.AQ||"<span class='dangerColor'>暂无数据</span>")+'</div></div>' +
                                ' <div><div class="item-titleSub">应急监管</div><div class="item-text">'+(item.YJJG||"<span class='dangerColor'>暂无数据</span>")+'</div></div>*/
                            var str =(str1+str2).replace(/\r\n/g,"<br/>")
                            $(window.frames["iframeSon1"].document).find('.fxdyList').html(str)
                        }
                    })
                }else if(_imageLabelArr[i].cdlx == "lsxl"){
                    msgAlertHide()
                    $('.msgAlert1').show();
                    $(window.frames["iframeSon1"].document).find('.wrsjList').show()
                    $(window.frames["iframeSon1"].document).find('.a-title').text('污染事件');
                    var str='<tr><th>序号</th><th>应急事件</th><th>事故等级</th><th>伤亡人数</th><th>造成经济损失</th><th>发生时间</th>' +
                        '<th>结束时间</th><th>事故原因</th><th>事故描述</th></tr>'
                    $(window.frames["iframeSon1"].document).find('.wrsjList').html(str)
                    wrsj.forEach(function (m) {
                        m.info.forEach(function (item,i) {
                            var str = '<tr><td>'+parseInt(i+1)+'</td><td>'+item.name+'</td><td>'+item.level+'</td><td>'+item.hurtNumber+'</td>' +
                                '<td>'+item.lost+'</td><td>'+item.strTime+'</td><td>'+item.endTime+'</td><td>'+item.reason+'</td><td>'+item.des+'</td></tr>';
                            $(window.frames["iframeSon1"].document).find('.wrsjList').append(str);
                        })
                    })
                }
                break;
            }
        }
    }else{
        $('.msgAlert').hide();
//		clearIframeDiv();
    }
}
function msgAlertHide() {
    $(window.frames["iframeSon1"].document).find('.fxdyList').hide()
    $(window.frames["iframeSon1"].document).find('.yjryList').hide()
    $(window.frames["iframeSon1"].document).find('.yjwzList').hide()
    $(window.frames["iframeSon1"].document).find('.wrsjList').hide()
}
//显示磷酸泄露扩散效果
function  showLinSuanXL(){
    SGWorld.ProjectTree.SetVisibility(_linSuanSiteGroup,true);
    SGWorld.ProjectTree.SetVisibility(_linSuanXL1,true);
    var position = SGWorld.Creator.CreatePosition(106.8563475, 27.143662777777777, 300, 0,
        0, -89, 0, 0);
    SGWorld.Navigate.FlyTo(position);
}
//进行企业遨游飞行
function planeFLy(){
        var planeId = SGWorld.ProjectTree.FindItem("飞行路线");
        var pg = SGWorld.ProjectTree.FindItem("planeGroup");// 得到飞行节点
        var planeshow = SGWorld.Creator.CreatePresentation(pg, "planeshow");
        // 创建飞行动态路径

        planeshow.CreateFollowDynamicObjectStep(1, 100, "", planeId);
        planeshow.LoopRoute = false;
        planeshow.play(1);
}

// 获取项目绝对路径
function getProAbsPath() {
    var location = (window.location + '').split('/');
    var basePath = location[0] + '//' + location[2] + '/' + location[3];
    return basePath;
}
// 获取文件绝对路径
function toAbsPath(fileName) {
    try {
        return getProAbsPath() + "/" + fileName;
    } catch (e) {
    }
}
