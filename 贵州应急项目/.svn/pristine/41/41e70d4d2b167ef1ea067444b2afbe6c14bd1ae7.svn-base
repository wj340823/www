define(["app",'openLayers','flowplayer','flowplayerhls','printw'], function(app,ol,flowplayer) {
    app.controller("resouceRelation",function($rootScope,$scope, $http, mapSet, olHelpers, olData, $interval, sucHelpers, $timeout){
        var riverMock = [
            {
                name:"曹渡河",
                id:'1',
                chidren:[]
            },
            {
                name:"赤水河",
                id:'2',
                chidren:[]
            },
            {
                name:"大环江",
                id:'3',
                chidren:[]
            },
            {
                name:"都柳江",
                id:'4',
                chidren:[]
            },
            {
                name:"独水河",
                id:'7',
                chidren:[]
            },
            {
                name:"芙蓉江",
                id:'8',
                chidren:[]
            },
            {
                name:"红水河",
                id:'9',
                chidren:[]
            },
            {
                name:"花溪河",
                id:'10',
                chidren:[]
            },
            {
                name:"北盘江",
                id:'11',
                chidren:[]
            },
            {
                name:"剑江",
                id:'12',
                chidren:[]
            },
            {
                name:"锦江",
                id:'13',
                chidren:[]
            },
            {
                name:"涟江",
                id:'15',
                chidren:[]
            },
            {
                name:"六冲河",
                id:'16',
                chidren:[]
            },
            {
                name:"猫跳河",
                id:'17',
                chidren:[]
            },
            {
                name:"蒙江",
                id:'18',
                chidren:[]
            },
            {
                name:"南盘江",
                id:'19',
                chidren:[]
            },
            {
                name:"清水江",
                id:'20',
                chidren:[]
            },
            {
                name:"三岔河",
                id:'21',
                chidren:[]
            },
            {
                name:"赏泥江",
                id:'24',
                chidren:[]
            },
            {
                name:"石阡河",
                id:'25',
                chidren:[]
            },
            {
                name:"市西河",
                id:'26',
                chidren:[]
            },
            {
                name:"乌江",
                id:'27',
                chidren:[]
            },
            {
                name:"习水河",
                id:'35',
                chidren:[]
            },
            {
                name:"湘江",
                id:'36',
                chidren:[]
            },
            {
                name:"小环江",
                id:'40',
                chidren:[]
            },
            {
                name:"印江",
                id:'41',
                chidren:[]
            },
            {
                name:"寨蒿河",
                id:'42',
                chidren:[]
            },
            {
                name:"漳江",
                id:'43',
                chidren:[]
            },
            {
                name:"重安江",
                id:'44',
                chidren:[]
            }
        ]
        
        var defaultZoom = 10;
        var defaultCenter = [106.8,26.931];
        var createActiveStyle = function(name){
            return new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#FF0000',
                    width: 4
                }),
                fill:new ol.style.Fill({
                    color:"rgba(255,0,0,0.4)"
                }),
                text:new ol.style.Text({
                    text: name,
                    font: '20px 微软雅黑',
                    fill:new ol.style.Fill({
                        color:"#ffcc01"
                    })
                })
            });
        };
        var mouseTimer = null;
        var clickFlag = false;

        //敏感点
        var mgdMock = [
            {"LONGITUDE":"106.86","LATITUDE":"27.148","COMPANYNAME":"大水村","COMPANYID":"1","TYPE":"air","RIVERID":"4"},
            {"LONGITUDE":"106.855","LATITUDE":"27.162","COMPANYNAME":"茶园坡","COMPANYID":"2","TYPE":"air","RIVERID":"4"},
            {"LONGITUDE":"106.847","LATITUDE":"27.250","COMPANYNAME":"温泉镇","COMPANYID":"3","TYPE":"air","RIVERID":"4"},
            {"LONGITUDE":"106.864","LATITUDE":"27.134","COMPANYNAME":"沙坝村","COMPANYID":"4","TYPE":"air","RIVERID":"4"},
            {"LONGITUDE":"106.919","LATITUDE":"27.171","COMPANYNAME":"蛇卡（原永温公社）","COMPANYID":"5","TYPE":"air","RIVERID":"4"},
            {"LONGITUDE":"106.922","LATITUDE":"27.138","COMPANYNAME":"永温乡政府","COMPANYID":"6","TYPE":"air","RIVERID":"4"},
            {"LONGITUDE":"106.847","LATITUDE":"27.112","COMPANYNAME":"金钟镇中心","COMPANYID":"7","TYPE":"air","RIVERID":"4"},
            {"LONGITUDE":"106.844","LATITUDE":"27.143","COMPANYNAME":"龙井湾废矿井内泉点","COMPANYID":"8","TYPE":"water","RIVERID":"4"},
            {"LONGITUDE":"106.857","LATITUDE":"27.147","COMPANYNAME":"大水村新寨组饮用水泉点","COMPANYID":"9","TYPE":"water","RIVERID":"4"},
            {"LONGITUDE":"106.829","LATITUDE":"27.142","COMPANYNAME":"蒿芝坝桥边(河对面)泉点","COMPANYID":"10","TYPE":"water","RIVERID":"4"},
            {"LONGITUDE":"106.832","LATITUDE":"27.144","COMPANYNAME":"蒿芝坝村民房子后面泉点","COMPANYID":"11","TYPE":"water","RIVERID":"4"},
            {"LONGITUDE":"106.837","LATITUDE":"27.155","COMPANYNAME":"河边泉点(茶园坡取水点)","COMPANYID":"12","TYPE":"water","RIVERID":"4"},
            {"LONGITUDE":"106.847","LATITUDE":"27.152","COMPANYNAME":"王木沟泉点","COMPANYID":"13","TYPE":"water","RIVERID":"4"}
        ];
        //tab页配置
        $scope.tabSet = {
            tabId:"1",
            list:[
                {
                    id:"1",
                    label:"河流列表",
                    show:true
                },
                {
                    id:"2",
                    label:"海草区域",
                    show:false
                },
                {
                    id:"3",
                    label:"滇池国考",
                    show:false
                }
            ],
            tabClick:_tabClick
        };

        $scope.resource = {
            riverCreated:false,
            overviewShow:false,
            rivers:riverMock,
            fxyMarkers:[],
            mgdMarkers:[],
            getRivers:_getRivers,
            getFxyMarkers:_getFxyMarkers,
            getMgdMarkers:_getMgdMarkers,
            riverClick:_riverClick,
            initialize:_initialize
        };

        function _tabClick(tabid){
            var tab = this.list.filter(function(tab){return tab.id==tabid})[0];
            this.tabId = tabid;
        };

        //获取河流列表
        function _getRivers(){
            var self = this;
            var url = "";
            $http.get(url).then(function(data){
                self.rivers = data.data;
            });
        };

        //获取风险源点位
        function _getFxyMarkers(riverid){
            var self = this;
            var url = "riskSource/listRiskSouce";
            var params = {
                riverId:riverid
            }
            $http.get(url,{params:params}).then(function(data){
                var markers = data.data;
                $scope.resourceMap.fxy.markers=self.fxyMarkers = initMarker(markers,'fxy');
            });
        };

        //获取敏感点
        function _getMgdMarkers(riverid){
            var markers = mgdMock.filter(function(item){
                return item.RIVERID == riverid;
            })
            $scope.resourceMap.mgd.markers=self.mgdMarkers = initMarker(markers,'mgd');
        };

        //格式化点位
        function initMarker(resource,type){
            if(!resource) return;
            var markers = [];
            resource.forEach(function(s){
                var img;
                if(type=="fxy"){
                    switch(s.RISKGRADE){
                    case "较大":
                        img = "images/large.png";
                        break;
                    case "重大":
                        img = "images/major.png";
                        break;
                    case "一般":
                        img = "images/common.png";
                        break;
                    }
                }else{
                    switch(s.TYPE){
                    case "air":
                        img = "images/dq.png";
                        break;
                    case "water":
                        img = "images/water.png";
                        break;
                    }
                }
                var item = {
                    id: s.COMPANYID,
                    lat: parseFloat(s.LATITUDE),
                    lon: parseFloat(s.LONGITUDE),
                    projection: "EPSG:4326",
                    info: s,
                    overLabel: { //悬浮显示的信息
                        id: s.COMPANYID,
                        message: '<div style="white-space:nowrap;min-width:100px">'+s.COMPANYNAME+'</div>',
                        classNm: "featureOver",
                        placement: "right"
                    },
                    style: {
                        image: {
                            icon: {
                                anchor: [0.5, 0.5],
                                opacity: 1,
                                src: img
                            }
                        }
                    }
                }
                if(type=="fxy"){
                    item.clickLabel={
                        id: s.COMPANYID,
                        title: s.COMPANYNAME,
                        url: '',
                        classNm: "featureClick",
                        placement: "right"
                    };
                }
                markers.push(item);
            });
            return markers;
        };

        //河流列表点击方法
        function _riverClick(river){
            var hisCheck = river.checked;
            this.rivers.forEach(function(river){
                river.checked = false;
                if(river.chidren){
                    river.chidren.forEach(function(item){
                        item.checked = false;
                    })
                }
            });
            river.checked = clickFlag = !hisCheck;
            $scope.resourceMap.riverFeatures.forEach(function(item){
                if(item.name==river.name){
                    var activeStyle = createActiveStyle(item.name)
                    var riverid = '';
                    for (let i in riverMock) {
                        if(river.name == riverMock[i].name){
                            riverid = riverMock[i].id
                        }
                    }
                    item.feature.setStyle(activeStyle);
                    mapSet.locationByFeature("map1",item.feature);
                    $scope.resource.getFxyMarkers(riverid);
                }else{
                    item.feature.setStyle(item.style);
                }
            })
        };

        $scope.riverHover=function(river){
            if(clickFlag) return;
            $scope.olMap.center.lat=defaultCenter[1];
            $scope.olMap.center.lon=defaultCenter[0];
            $scope.olMap.center.zoom = defaultZoom;
            $scope.resourceMap.riverFeatures.forEach(function(item){
                if(item.name==river.name){
                    var activeStyle = createActiveStyle(item.name);
                    item.feature.setStyle(activeStyle);
                }else{
                    item.feature.setStyle(item.style);
                }
            })
        };

        $scope.riverOut=function(){
            if(clickFlag) return;
            $scope.resourceMap.riverFeatures.forEach(function(item){
                item.feature.setStyle(item.style); 
            });
        };



        //页面初始化
        function _initialize(){
            $scope.olMap.center.lat=defaultCenter[1];
            $scope.olMap.center.lon=defaultCenter[0];
            $scope.olMap.center.zoom = defaultZoom;
            $scope.resourceMap.fxy.markers.length=0;
            $scope.resourceMap.mgd.markers.length = 0;
        };


        $scope.resource.initialize();

        $scope.$on("riverCreated",function(){
            $scope.resource.riverCreated = true;
            $scope.$apply();
        });




    })
    app.controller("resouceFxyPop",function($rootScope,$scope,$state,$timeout){
        //应急模拟
        var player = null;
        $scope.videoShow = false;
        //模型显示
        $scope.modalShow = {
            "520121JJJ0000001":true,
            "522702was00001":false,
            "522702AAA0070":true
        };
        //视频显示
        $scope.modalShow2 = {
            "520121JJJ0000001":true,
            "522702was00001":true
        }
        $scope.emergencyMoni = function(cid){
            $scope.closeModel();
            $state.go("riskPrevention.riskSpatial.emergencyMoni",{cid:cid});
        };
       
        //三维建模
        $scope.sw = function(){
            window.open(" swjm/swjm.html?id="+encodeURIComponent($scope.riskDetail.COMPANYID)+'&'+$scope.riskDetail.LONGITUDE+'&'+$scope.riskDetail.LATITUDE)
        };

        //关闭窗口
        $scope.closeModel = function(){
            $scope.selectPos.visible = false;
            $scope.resourceMap.fxy.popup.visible=false;
        };

        $scope.$watch("videoShow",function(n,o){
            if(n){
                $timeout(function(){
                    var videoUrl = "video/"+$scope.riskDetail.COMPANYNAME+"/playlist.m3u8";
                    initVideo("videoPlayer",videoUrl);
                },0)
            }else{
                clearVideo("videoPlayer");
            }
        });

        function initVideo(playerDomId,videourl){
            clearVideo(playerDomId);
			var playerDom=angular.element(document.querySelector("#"+playerDomId));
			player= flowplayer("#"+playerDomId, {
				adaptiveRatio:true,
				embed:true,
				autoplay:false,
				clip: {
					sources:[
								{ type: "application/x-mpegurl", src: videourl }
							],
					title: "所选视频"
				}
			});
			player.bind("error",function(e,api,root){
				player.shutdown();
			});
			player.bind("fullscreen",function(e){
				oneX=0;oneY=0;lastX = 0;lastY = 0;
			});
			player.bind("fullscreen-exit",function(e){
				oneX=0;oneY=0;lastX = 0;lastY = 0;
			});
			player.bind("embed",function(e,api,root){
				if(!playerDom.hasClass("is-marking")){
					oneX=0;oneY=0;lastX = 0;lastY = 0;
				}else{
					function getAbsoluteLeft(objectId) {
						o = document.getElementById(objectId);
						oLeft = o.offsetLeft;            
						while(o.offsetParent!=null) { 
							oParent = o.offsetParent    ;
							oLeft += oParent.offsetLeft ;
							o = oParent;
						}
						return oLeft;
					};
					//获取控件上绝对位置
					function getAbsoluteTop(objectId) {
						o = document.getElementById(objectId);
						oTop = o.offsetTop;
						while(o.offsetParent!=null)
						{  
							oParent = o.offsetParent ;
							oTop += oParent.offsetTop ; // Add parent top position
							o = oParent;
						}
						return oTop
					};
					var canvasA = document.getElementById('cccc'),
						canvasA_con = canvasA.getContext('2d');
					canvasA.onmousedown = function(e){
						canvasA_con.clearRect(0,0,canvasA.width,canvasA.height); 
						var e = e || window.event,
							o_left = getAbsoluteLeft('cccc'),
							o_top = getAbsoluteTop('cccc');
						oneX = e.clientX - o_left;
						oneY = e.clientY - o_top;
						canvasA.onmousemove = function(e){
							var e = e || window.event;
						};
						canvasA.onmouseup = function(e){//取消事件绑定
							var e = e || window.event;
								lastX = e.clientX - o_left;
								lastY = e.clientY - o_top;
								canvasA_con.strokeRect( oneX, e.clientY - o_top, e.clientX - o_left - oneX, oneY - e.clientY + o_top );
								document.onmousedown = null;
								document.onmousemove = null;
						};
					};
				};
				
			});
			player.on("seek",function(e,api,time){
				player.pause();
			});
        };

        function clearVideo(playerDomId,deep){
            var playerDom=angular.element(document.querySelector("#"+playerDomId));
            if(player){
                player.stop();
                player.shutdown();
                player.empty();
                player.removeAttr("class");
                if(deep){
                    player = null;
                }
            }
        };


    });

    
    
});