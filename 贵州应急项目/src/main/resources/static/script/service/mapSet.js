/*
 * 地图基础设置
 */
define(['app','openLayers'], function (app,ol) {
    var access='gzhbfxyOnline';
    // var access='gzhbfxy';
    app.factory("mapSet", function ($q, $http,$rootScope,olData) {
        var factory = {};
        var changeCenterHandler = null;
        var stores, defer1 = $q.defer();
        var risks, defer2 = $q.defer();
        factory.init = function(){
            return {
                map: [{
                    name: "satelliteMap_base",
                    source: {
                        type: 'XYZ',
                        url: 'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}'
                    },
                    visible: false
                },
                {
                    name: "satelliteMap_symbol",
                    source: {
                        type: 'XYZ',
                        url: 'http://t1.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}'
                    },
                    visible: false
                },
                 {
                    name: "imageMap_base",
                    source: {
                        type: 'XYZ',
                        url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=469cfd9c133f30baaf3f94a9cd848c47'
                    },
                    "visible": true
                },
                {
                    name: "imageMap_symbol",
                    source: {
                        type: 'XYZ',
                        url: 'http://t1.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=469cfd9c133f30baaf3f94a9cd848c47'
                    },
                    "visible": true
                },{
                    name: "satelliteMap_symbol",
                    source: {
                        type: 'XYZ',
                        url: 'http://mt0.google.cn/vt/imgtp=png32&lyrs=h&hl=zh-Hans-CN&gl=CN&&x={x}&y={y}&z={z}'
                    },
                    zIndex: 2,
                    visible: false
                }, {
                    name: "satelliteMap_base",
                    source: {
                        type: 'XYZ',
                        url: 'http://mt0.google.cn/vt/src=app&lyrs=s&hl=zh-CN&gl=cn&&x={x}&y={y}&z={z}'
                    },
                    visible: false
                }],
                center: {
                    lat: 26.64227,
                    lon: 106.667045,
                    zoom: 8
                },
                view: {
                    rotation: 0,
                    maxZoom: 18
                },
                defaults: {
                    controls: {
                        attribution: false,
                        rotate: false,
                        zoom: false
                    },
                    interactions: {
                        mouseWheelZoom: true
                    },
                    events: {
                        map: ['singleclick', 'pointermove'],
                        compose: ''
                    }
                },
                controls: [
                    { //全屏
                    name: "fullscreen",
                    active: false
                    },
                    { //鹰眼
                    name: "overviewmap",
                    active: false,
                    collapsed: false,
                    label: "»",
                    collapseLabel: "«",
                    tipLabel: "鹰眼",
                    layers: [{
                        name: "satelliteMap_symbol",
                        source: {
                            type: 'XYZ',
                            url: 'http://mt0.google.cn/vt/imgtp=png32&lyrs=h&hl=zh-Hans-CN&gl=CN&&x={x}&y={y}&z={z}'
                        },
                        visible: false
                    }, {
                        name: "satelliteMap_base",
                        source: {
                            type: 'XYZ',
                            url: 'http://mt0.google.cn/vt/src=app&lyrs=s&hl=zh-CN&gl=cn&&x={x}&y={y}&z={z}'
                        },
                        visible: false
                    }]
                },
                    {
                        name: "scaleline",
                        units: 'metric',
                        target: 'scalebar',
                        className: 'ol-scale-line',
                        active:true
                    }

                ]
            }
        }
        //资源库点位
        factory.getStore = function(){
        	if(stores){
        		defer1.resolve(stores);
        	}else{
        		$http.get("rest/dc/"+access+"/Warehouse").then(function(res){
        		    /*$http.get('basicData/listWareHouse').then(function (req) {

                    })*/
        			var data = res.data;
        			stores = [];
        			data.forEach(function(obj){
        				var item = {
    						id: obj.id,
    			            lat: parseFloat(obj.latitude),
    			            lon: parseFloat(obj.longitude),
    			            projection: "EPSG:4326",
    			            info: obj,
    			            clickLabel: {
    			            	id: obj.id,
    			            	title: obj.name,
    			                url: 'partials/pop/material.html',
    			                classNm: "featureClick",
    			                placement: "right"
    			            },
    			            overLabel: { //悬浮显示的信息
    			                id: obj.id,
    			                message: '<div style="white-space:nowrap;min-width:100px">'+obj.name+'</div>',
    			                classNm: "featureOver",
    			                placement: "right",
    			            },
    			            style: {
    			                image: {
    			                    icon: {
    			                        anchor: [0.5, 0.5],
    			                        opacity: 1,
    			                        src: 'images/storehouse2.png'
    			                    }
    			                },
    			            }
        				}
        				stores.push(item);
        			});
            		defer1.resolve(stores);
        		})
        	}
        	return defer1.promise;
        }

        //风险源点位
        factory.getRisk = function(){
        	if(risks){
        		defer2.resolve(risks);
        	}else{
        		$http.get("riskSource/listRiskSouce").then(function(res){
        			var data = res.data;
        			risks = [];
        			data.forEach(function(s){
        				var img;
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
    					var item = {
    						id: s.COMPANYID,
    			            lat: parseFloat(s.LATITUDE),
    			            lon: parseFloat(s.LONGITUDE),
    			            projection: "EPSG:4326",
    			            info: s,
    			            clickLabel: {
    			            	id: s.COMPANYID,
    			            	title: s.COMPANYNAME,
    			                url: 'partials/pop/risk.html',
    			                classNm: "featureClick",
    			                placement: "right"
    			            },
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
    					risks.push(item);
        			})
            		defer2.resolve(risks);
        		})
        	}
        	return defer2.promise;
        }

        //赤水河图层
        factory.getCsh = function(){
        	return {
        		source: {
                    type: "GeoJSON",
                    url: "新河面.geo.json"
                },
                zIndex: 2
        	}
        }

        //严家河图层
        factory.getYjh = function(){
        	return {
        		source: {
        			type: "GeoJSON",
                    url: "严家河.geo.json"
                },
                zIndex: 2
        	}
        }

        //省界线图层
        factory.getSjx = function(){
        	return {
        		source: {
                    type: "GeoJSON",
                    url: "guizhou.json",
                    moveStyle: function () {
                         return new ol.style.Style({
                            stroke:new ol.style.Stroke({
                                color: '#1a5cb9',
                                width: 2
                            })
                        })
                    },
                    loader: true,
                    dataType: "json"
                },
                zIndex: 5,
                style: {
                    stroke: {
                        color: '#1a5cb9',
                        width: 2
                    }
                }
        	}
        }
        //水系图
        factory.getGzsx = function(n){
            return {
                source: {
                    type: "GeoJSON",
                    url: "dzm/贵州水系.json",
                    moveStyle: function () {
                        return new ol.style.Style({
                            fill:new ol.style.Fill({
                                color:[88, 198, 255, 0.8]
                            }),
                            stroke:new ol.style.Stroke({
                                width:2,
                                color:[88, 198, 255, 0.8]
                            })
                        })
                    },
                    loader:true,
                    dataType:"json"
                },
                zIndex: 5,
                style: function (feature) {
                    var name = feature.get("Name");
                    if(name.match('水库') == null){
                        var style1 = {
                            fill:new ol.style.Fill({
                                color:[88, 198, 255, 0.8]
                            }),
                            stroke:new ol.style.Stroke({
                                width:2,
                                color:[88, 198, 255, 0.8]
                            }),
                            text:new ol.style.Text({
                                text:name,

                                fill:new ol.style.Fill({
                                    color:"#fff"
                                }),
                                stroke:new ol.style.Stroke({
                                    color:"#000",
                                    width:2
                                })
                            })
                        }
                    }else{
                        var style1 = {
                            fill:new ol.style.Fill({
                                color:[88, 198, 255, 0.8]
                            }),
                            stroke:new ol.style.Stroke({
                                width:2,
                                color:[88, 198, 255, 0.8]
                            })
                        }
                    }
                    var style = new ol.style.Style(style1)
                    return style;
                }
            }
        }

        //汇入点标记
        factory.getInLay = function(){
        	return {
        		 coord: [105.69240425845436, 28.570499229659973],
                 label: {
                     classNm: "inOut",
                     placement: "left",
                     stopEvent: false
                 }
        	}
        }

        //出省点标记
        factory.getOutLay = function(){
        	return {
        		 coord: [105.73462885118033, 28.61336347737077],
                 label: {
                	 classNm: "inOut inOut2",
                     placement: "left",
                     stopEvent: false
                 }
        	}
        }
        //红枫湖图层
        factory.getHfh = function(){
        	return {
        		source: {
                    type: "EsriJson",
                    url: "红枫湖面.json",
                    moveStyle: {},
                    style: function(feature){
                    	return {
                    		fill: {
                    			color: [88, 198, 255, 0.8]
                    		},
                    		stroke: {
                    			width: 1,
                    			color: [0,0,0,0]
                    		}
                    	}
                    }
                },
                zIndex: 2
        	}
        }

        //获取水源地
        factory.getSyd = function(){
            return {
                source:{
                    type:'EsriJson',
                    url:'饮用水源地.json',
                    style: function(feature){
                        return {
                            fill: {
                                color: [88, 198, 255, 0.8]
                            },
                            stroke: {
                                width: 1,
                                color: [0,0,0,0]
                            }
                        }
                    }
                },
                zIndex: 2
            }
        }

        //重点污染区域
        factory.getZdqy = function(){
            return {
                source: {
                    type: "EsriJson",
                    url: "重点污染区域.json",
                    moveStyle: {},
                    style: function(feature){
                    	return {
                    		fill: {
                    			color: [0, 0, 0, 0]
                    		},
                            /*
                            fill: new ol.style.Fill({
                                stroke:{
                                    width: 2,
                                    color: "#1a5cb9"
                                }
                            })
                            * */
                    		stroke: {
                                width: 2,
                                lineDash: [10, 5],
                    			color: "#FF0000"
                    		}
                    	}
                    }
                },
                zIndex: 2
            }
        }

        //模型分析时间轴
        factory.getTimes = function(){
        	return  [
                {
                    val: 0,
                    name: "事故发生"
                }, {
                    val: 15,
                    name: "15分钟"
                }, {
                    val: 30,
                    name: "30分钟"
                }, {
                    val: 45,
                    name: "45分钟"
                }, {
                    val: 60,
                    name: "1小时"
                }, {
                    val: 75,
                    name: "1小时15分钟"
                }, {
                    val: 90,
                    name: "1.5小时"
                }, {
                    val: 105,
                    name: "1小时45分钟"
                }, {
                    val: 120,
                    name: "2小时"
                }, {
                    val: 135,
                    name: "2小时15分钟"
                }, {
                    val: 150,
                    name: "2.5小时"
                }, {
                    val: 165,
                    name: "2小时45分钟"
                }, {
                    val: 180,
                    name: "3小时"
                }, {
                    val: 195,
                    name: "3小时15分钟"
                }, {
                    val: 210,
                    name: "3.5小时"
                }, {
                    val: 225,
                    name: "3小时45分钟"
                }, {
                    val: 240,
                    name: "4小时"
                }, {
                    val: 255,
                    name: "4小时15分钟"
                }, {
                    val: 270,
                    name: "4.5小时"
                }, {
                    val: 285,
                    name: "4小时45分钟"
                }, {
                    val: 300,
                    name: "5小时"
                }, {
                    val: 315,
                    name: "5小时15分钟"
                }, {
                    val: 330,
                    name: "5.5小时"
                }
            ];
            // return  [
            //     {
            //         val: 0,
            //         name: "事故发生"
            //     }, {
            //         val: 0.5,
            //         name: "30秒"
            //     }, {
            //         val: 1,
            //         name: "1分钟"
            //     }, {
            //         val: 1.5,
            //         name: "1分钟30秒"
            //     }, {
            //         val: 2,
            //         name: "2分钟"
            //     }, {
            //         val: 2.5,
            //         name: "2分钟30秒"
            //     }, {
            //         val: 3,
            //         name: "3分钟"
            //     }, {
            //         val: 3.5,
            //         name: "3分钟30秒"
            //     }, {
            //         val: 4,
            //         name: "4分钟"
            //     }, {
            //         val: 4.5,
            //         name: "4分钟30秒"
            //     }, {
            //         val: 5,
            //         name: "5分钟"
            //     }, {
            //         val: 5.5,
            //         name: "5分钟30秒"
            //     }, {
            //         val: 6,
            //         name: "6分钟"
            //     }, {
            //         val: 6.5,
            //         name: "6分钟30秒"
            //     }, {
            //         val: 7,
            //         name: "7分钟"
            //     }, {
            //         val: 7.5,
            //         name: "7分钟30秒"
            //     }, {
            //         val: 8,
            //         name: "8分钟"
            //     }, {
            //         val: 8.5,
            //         name: "8分钟30秒"
            //     }, {
            //         val: 9,
            //         name: "9分钟"
            //     }, {
            //         val: 9.5,
            //         name: "9分钟30秒"
            //     }, {
            //         val: 300,
            //         name: "10分钟"
            //     }, {
            //         val: 10,
            //         name: "10分钟30秒"
            //     }, {
            //         val: 11,
            //         name: "11分钟"
            //     }
            // ]
        }



        //监测点弹框
        factory.setJcdLay = function(message,coord){
        	return {
                coord: coord,
                label: {
                    message: message,
                    classNm: "featureOver",
                    placement: "right",
                    stopEvent: false
                }
            }
        }

        //开阳河流


        //根据feature定位
        factory.locationByFeature=function(mapId,feature,duration,dragable){
            if(feature && feature instanceof ol.Feature){
                var geometry = feature.getGeometry();/** @type {ol.geom.SimpleGeometry} */
                var extent = geometry.getExtent();
                var timer="";
                if(geometry instanceof ol.geom.SimpleGeometry){
                    olData.getMap(mapId).then(function (map) {
                        var view=map.getView();
                        if(dragable != undefined){
                            view.setMinZoom(6);  //防止设置最小缩放级别后出现获取不到当前缩放级别的问题(因为获取当前级别时会先判断当前比例尺是否在比例尺范围内)
                        }
                        view.un("change:center",changeCenterHandler);
                        view.fit(geometry, {
                            padding:[170, 50, 30, 150],
                            constrainResolution: false,
                            duration: duration,
                            callback:callback
                        });
                        function callback(){
                            if(dragable != undefined && !dragable){
                                var zoomLevel=view.getZoom();
                                changeCenterHandler=function(event){
                                    var center=event.oldValue;
                                    if(timer){
                                        $timeout.cancel(timer);
                                        timer="";
                                    }
                                    timer=$timeout(function(){
                                        if(!ol.extent.containsXY(extent,center[0],center[1])){
                                            var x=(extent[0]+extent[2])/2;
                                            var y=(extent[1]+extent[3])/2;
                                            view.setCenter([x,y]);
                                        }
                                    },0);
                                }
                                view.setMinZoom(zoomLevel);
                                view.on("change:center",changeCenterHandler);
                                return;
                                //map.setView(new ol.View({extent:[extent[1]-0.0001,extent[0]-0.0001,extent[3]+0.0001,extent[2]+0.0001],projection:"EPSG:3857"}))
                                // map.getInteractions().forEach(function(element,index,array){
                                // 	if(element instanceof ol.interaction.DragPan) {
                                // 		var pan = element;
                                // 		pan.setActive(dragable)
                                // 	}
                                // });
                            }
                        }
                    })
                }
            }
        }
        return factory;
    });
    app.factory("dataSet", function ($http,$q) {
    	var factory = {};
    	var cities, waters, nature, defer1=$q.defer(), defer2=$q.defer(), defer3=$q.defer();
        factory.getDistricts = function(){
        	if(cities){
        		defer1.resolve(cities);
        	}else{
        		$http.get("basicData/listXzqyCountWarehouse").then(function(data){
        			cities = data.data;
        			defer1.resolve(cities);
        		})
        	}
			return defer1.promise;
        	//return ["贵阳市","遵义市","六盘水市","安顺市","毕节市","铜仁市","黔西南","黔东南","黔南","贵安新区"];
        }
        factory.getWaters = function(){
        	if(waters){
        		defer2.resolve(waters);
        	}else{
        		$http.get("rest/dc/"+access+"/DrinkingWater").then(function(data){
        			waters = data.data;
        			defer2.resolve(waters);
        		})
        	}
			return defer2.promise;
        	//return ["红枫湖","百花湖","啊哈水库","乌江水库","梭筛水库","虹山水库","草海","万峰湖"];
        }
        factory.getNatural = function(){
        	if(nature){
        		defer3.resolve(nature);
        	}else{
        		$http.get("rest/dc/"+access+"/NaturalReserve").then(function(data){
        			nature = data.data;
        			defer3.resolve(nature);
        		})
        	}
			return defer3.promise;t
        	//return ["绥阳宽阔水国家级自然保护区","习水中亚热带常绿阔叶林国家级","赤水桫椤国家级","咸宁草海国家级"];
        }

        factory.getUrls = function(){
            return {
                /*setOutline:"http://172.18.21.16:10080/api/river-pollution/outline",
                setInline:"http://172.18.21.16:10080/api/river-pollution/centerline",
                setModal:"http://172.18.21.16:10080/api/river-pollution/model",
                modalQuery:"http://172.18.21.16:10080/api/river-pollution/query",*/

                setOutline:"http://103.3.152.152:8888/2/api/river-pollution/outline",//项目里有个dzm文件夹，参数是对应dzm/河流名称/下的outline.json，method是post
                setInline:"http://103.3.152.152:8888/2/api/river-pollution/centerline",//项目里有个dzm文件夹，参数是对应dzm/河流名称/下的inline.json，method是post
                setModal:"http://103.3.152.152:8888/2/api/river-pollution/model",//method:"POST" 传参{"samplePoint": 流速（实际上绑定的不是真正的河流流速）,"start":null,"target":污染物浓度等级划分}
                modalQuery:"http://103.3.152.152:8888/2/api/river-pollution/query",//?amount="+(amount || 366120) method是get，参数amount是污染物总排放量
                getMoniText:"http://103.3.152.152:8888/3/main/input1/",
                // setOutline:"http://122.224.74.82:50297/2/api/river-pollution/outline",
                // setInline:"http://122.224.74.82:50297/2/api/river-pollution/centerline",
                // setModal:"http://122.224.74.82:50297/2/api/river-pollution/model",
                // modalQuery:"http://122.224.74.82:50297/2/api/river-pollution/query"

            }
        }

        return factory;
    });
});
