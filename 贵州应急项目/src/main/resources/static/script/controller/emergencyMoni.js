define(["app",'openLayers'], function(app,ol) {
    app.controller("emergencyMoni",function($rootScope,$scope, $http,$q,$stateParams, mapSet,dataSet, olHelpers, olData, $interval, sucHelpers, $timeout,gisCaculate){
        var companys = {
            "贵州开磷集团矿肥有限责任公司":{
                river:"洋水河",
                zcqk:[
                    {
                        id:"1",
                        info:{
                            pm:"硫酸",
                            cas:"8014-95-7",
                            zdcc:"33750",
                            ljl:"2.5"
                        }
                    },
                    {
                        id:"2",
                        info:{
                            pm:"磷酸",
                            cas:"7664-38-2",
                            zdcc:"50000",
                            ljl:"2.5"
                        }
                    },
                    {
                        id:"3",
                        info:{
                            pm:"氨",
                            cas:"7664-41-7",
                            zdcc:"1920",
                            ljl:"7.5"
                        }
                    },
                    {
                        id:"4",
                        info:{
                            pm:"双氧水",
                            cas:"7722-84-1",
                            zdcc:"87.6",
                            ljl:"/"
                        }
                    },
                    {
                        id:"5",
                        info:{
                            pm:"硫磺",
                            cas:"63705-05-5",
                            zdcc:"7661",
                            ljl:"10"
                        }
                    },
                    {
                        id:"6",
                        info:{
                            pm:"氟硅酸",
                            cas:"16961-83-4",
                            zdcc:"7200",
                            ljl:"5"
                        }
                    },
                    {
                        id:"7",
                        info:{
                            pm:"二氧化硫",
                            cas:"7446-09-5",
                            zdcc:"10",
                            ljl:"2.5"
                        }
                    },
                    {
                        id:"8",
                        info:{
                            pm:"三氧化硫",
                            cas:"7647-01-0",
                            zdcc:"0.04",
                            ljl:"2.5"
                        }
                    }
                ],
                mgd:[
                    {
                        name:"大水村",
                        id:"1"
                    },
                    {
                        name:"茶园坡",
                        id:"2"
                    },
                    {
                        name:"温泉镇",
                        id:"3"
                    },
                     {
                        name:"沙坝村",
                        id:"4"
                    },
                     {
                        name:"蛇卡",
                        id:"5"
                    },
                     {
                        name:"永温乡政府",
                        id:"6"
                    },
                    {
                        name:"金钟镇中心",
                        id:"7"
                    },
                    {
                        name:"洋水河",
                        id:"8"
                    },
                    {
                        name:"两岔河",
                        id:"9"
                    },
                    {
                        name:"龙井湾泉点",
                        id:"10"
                    },
                    {
                        name:"大水村泉点",
                        id:"11"
                    },
                    {
                        name:"蒿芝坝桥边泉点",
                        id:"12"
                    },
                    {
                        name:"河边泉点",
                        id:"13"
                    },
                    {
                        name:"王水沟泉点",
                        id:"14"
                    },
                    {
                        name:"蒿芝坝村民泉点",
                        id:"15"
                    },
                ],
                factory:[
                    {name:"硫酸",id:"1"},
                    {name:"磷酸",id:"2"},
                    {name:"氨",id:"3"},
                    {name:"双氧水",id:"4"},
                    {name:"硫磺",id:"5"},
                    {name:"氟硅酸",id:"6"},
                    {name:"二氧化硫",id:"7"},
                    {name:"三氧化硫",id:"8"}
                ],
                mgdMarkers:[
                    {"LONGITUDE":"106.86","LATITUDE":"27.148","COMPANYNAME":"大水村","COMPANYID":"1","TYPE":"air",},
                    {"LONGITUDE":"106.855","LATITUDE":"27.162","COMPANYNAME":"茶园坡","COMPANYID":"2","TYPE":"air"},
                    {"LONGITUDE":"106.847","LATITUDE":"27.250","COMPANYNAME":"温泉镇","COMPANYID":"3","TYPE":"air"},
                    {"LONGITUDE":"106.864","LATITUDE":"27.134","COMPANYNAME":"沙坝村","COMPANYID":"4","TYPE":"air"},
                    {"LONGITUDE":"106.919","LATITUDE":"27.171","COMPANYNAME":"蛇卡（原永温公社）","COMPANYID":"5","TYPE":"air"},
                    {"LONGITUDE":"106.922","LATITUDE":"27.138","COMPANYNAME":"永温乡政府","COMPANYID":"6","TYPE":"air"},
                    {"LONGITUDE":"106.847","LATITUDE":"27.112","COMPANYNAME":"金钟镇中心","COMPANYID":"7","TYPE":"air"},
                    {"LONGITUDE":"106.844","LATITUDE":"27.143","COMPANYNAME":"龙井湾废矿井内泉点","COMPANYID":"8","TYPE":"water"},
                    {"LONGITUDE":"106.857","LATITUDE":"27.147","COMPANYNAME":"大水村新寨组饮用水泉点","COMPANYID":"9","TYPE":"water"},
                    {"LONGITUDE":"106.829","LATITUDE":"27.142","COMPANYNAME":"蒿芝坝桥边(河对面)泉点","COMPANYID":"10","TYPE":"water"},
                    {"LONGITUDE":"106.832","LATITUDE":"27.144","COMPANYNAME":"蒿芝坝村民房子后面泉点","COMPANYID":"11","TYPE":"water"},
                    {"LONGITUDE":"106.837","LATITUDE":"27.155","COMPANYNAME":"河边泉点(茶园坡取水点)","COMPANYID":"12","TYPE":"water"},
                    {"LONGITUDE":"106.847","LATITUDE":"27.152","COMPANYNAME":"王木沟泉点","COMPANYID":"13","TYPE":"water"}
                ],
                mgdInfo:[
                    {
                        id:"1",
                        info:{
                            "hbmb":"大水村",
                            "fw":"N",
                            "jl":"500",
                            "rs":"1500/375",
                        }
                    },
                    {
                        id:"2",
                        info:{
                            "hbmb":"茶园坡",
                            "fw":"N",
                            "jl":"2500",
                            "rs":"550/133",
                        }
                    },
                    {
                        id:"3",
                        info:{
                            "hbmb":"温泉镇",
                            "fw":"NNW",
                            "jl":"7500",
                            "rs":"22000/6285",
                        }
                    },
                    {
                        id:"4",
                        info:{
                            "hbmb":"沙坝村",
                            "fw":"SE",
                            "jl":"500",
                            "rs":"500/6285"
                        }
                    },
                    {
                        id:"5",
                        info:{
                            "hbmb":"蛇卡",
                            "fw":"NE",
                            "jl":"6000",
                            "rs":"10000/2850"
                        }
                    },
                    {
                        id:"6",
                        info:{
                            "hbmb":"永温乡政府",
                            "fw":"SEE",
                            "jl":"5000",
                            "rs":"17000/4857"
                        }
                    },
                    {
                        id:"7",
                        info:{
                            "hbmb":"金钟镇中心",
                            "fw":"S",
                            "jl":"2500",
                            "rs":"15000/4233"
                        }
                    },
                    {
                        id:"8",
                        info:{
                            "hbmb":"洋水河",
                            "fw":"E",
                            "jl":"20",
                            "rs":"无饮用功能"
                        }
                    },
                    {
                        id:"9",
                        info:{
                            "hbmb":"两叉河",
                            "fw":"S",
                            "jl":"渣厂外100m",
                            "rs":"无饮用功能"
                        }
                    },
                    {
                        id:"10",
                        info:{
                            "hbmb":"龙井湾泉点",
                            "fw":"N",
                            "jl":"渣厂外100m",
                            "rs":"无饮用功能"
                        }
                    },
                    {
                        id:"11",
                        info:{
                            "hbmb":"大水村泉点",
                            "fw":"NE",
                            "jl":"渣场外1200m",
                            "rs":"无饮用功能"
                        }
                    },
                    {
                        id:"12",
                        info:{
                            "hbmb":"蒿芝坝桥边泉点",
                            "fw":"SW",
                            "jl":"渣场外1500m",
                            "rs":"无饮用功能"
                        }
                    },
                    {
                        id:"12",
                        info:{
                            "hbmb":"河边泉点",
                            "fw":"NW",
                            "jl":"渣场外1800m",
                            "rs":"约2000人"
                        }
                    },
                    {
                        id:"13",
                        info:{
                            "hbmb":"王木沟泉点",
                            "fw":"N",
                            "jl":"渣场外1500m",
                            "rs":"无饮用功能"
                        }
                    },
                    {
                        id:"14",
                        info:{
                            "hbmb":"蒿芝坝村民泉点",
                            "fw":"W",
                            "jl":"渣场外200m",
                            "rs":"无饮用功能"
                        }
                    }
                ]
            },
            "瓮福化工公司":{
                river:"鱼梁江",
                zcqk:[
                    {
                        id:"1",
                        info:{
                            pm:"硫酸",
                            cas:"8014-95-7",
                            zdcc:"20000",
                            ljl:""
                        }
                    },
                    {
                        id:"2",
                        info:{
                            pm:"磷酸",
                            cas:"7664-38-2",
                            zdcc:"16775",
                            ljl:""
                        }
                    },
                    {
                        id:"3",
                        info:{
                            pm:"氟硅酸",
                            cas:"16961-83-4",
                            zdcc:"2400",
                            ljl:"500"
                        }
                    },
                    {
                        id:"4",
                        info:{
                            pm:"甲基异丁基(甲)酮",
                            cas:"108-10-1",
                            zdcc:"227",
                            ljl:"1000"
                        }
                    },
                    {
                        id:"5",
                        info:{
                            pm:"液氨",
                            cas:"7664-41-7",
                            zdcc:"20000",
                            ljl:"10"
                        }
                    },
                    {
                        id:"6",
                        info:{
                            pm:"硫磺",
                            cas:"7704-34-9",
                            zdcc:"70000",
                            ljl:"200"
                        }
                    },
                    {
                        id:"7",
                        info:{
                            pm:"双氧水",
                            cas:"7722-84-1",
                            zdcc:"190",
                            ljl:"200"
                        }
                    },
                    {
                        id:"8",
                        info:{
                            pm:"五氧化二钒",
                            cas:"1314-62-1",
                            zdcc:"300",
                            ljl:"500"
                        }
                    }
                ],
                factory:[
                    {name:"硫酸",id:"1"},
                    {name:"磷酸",id:"2"},
                    {name:"氟硅酸",id:"3"},
                    {name:"甲基异丁基(甲)酮",id:"4"},
                    {name:"液氨",id:"5"},
                    {name:"硫磺",id:"6"},
                    {name:"双氧水",id:"7"},
                    {name:"五氧化二钒",id:"8"}        
                ],
                mgd:[
                    {"name":"大干田","id":"1"},
                    {"name":"程家山","id":"2"},
                    {"name":"大院村","id":"3"},
                    {"name":"下乐岗","id":"4"},
                    {"name":"沙井","id":"5",},
                    {"name":"龙井","id":"6"},
                    {"name":"沙锅厂","id":"7"},
                    {"name":"马场冲","id":"8"},
                    {"name":"夹耳田","id":"9"},
                    {"name":"马场坪","id":"10"},
                    {"name":"石板河","id":"11"},
                    {"name":"鱼梁江","id":"12"},
                    {"name":"米汤河","id":"13"},
                    {"name":"团坝河","id":"14"},
                    {"name":"浪坝河","id":"15"},
                    {"name":"石板河溶洞","id":"16"},
                    {"name":"吴家河溶洞","id":"17"},
                ],
                mgdMarkers:[
                    {"LONGITUDE":"107.5237","LATITUDE":"26.6465","COMPANYNAME":"大干田","COMPANYID":"1","TYPE":"air"},
                    {"LONGITUDE":"107.5277","LATITUDE":"26.6487","COMPANYNAME":"程家山","COMPANYID":"2","TYPE":"air"},
                    {"LONGITUDE":"107.5325","LATITUDE":"26.6434","COMPANYNAME":"大院村","COMPANYID":"3","TYPE":"air"},
                    {"LONGITUDE":"107.5312","LATITUDE":"26.653","COMPANYNAME":"下乐岗","COMPANYID":"4","TYPE":"air"},
                    {"LONGITUDE":"107.5249","LATITUDE":"26.651","COMPANYNAME":"沙井","COMPANYID":"5","TYPE":"air"},
                    {"LONGITUDE":"107.5206","LATITUDE":"26.6494","COMPANYNAME":"龙井","COMPANYID":"6","TYPE":"air"},
                    {"LONGITUDE":"107.5172","LATITUDE":"26.6373","COMPANYNAME":"沙锅厂","COMPANYID":"7","TYPE":"air"},
                    {"LONGITUDE":"107.4999","LATITUDE":"26.6427","COMPANYNAME":"马场冲","COMPANYID":"8","TYPE":"air"},
                    {"LONGITUDE":"107.5129","LATITUDE":"26.6403","COMPANYNAME":"夹耳田","COMPANYID":"9","TYPE":"air"},
                    {"LONGITUDE":"107.528","LATITUDE":"26.631","COMPANYNAME":"马场坪","COMPANYID":"10","TYPE":"air"},
                    {"LONGITUDE":"107.5238","LATITUDE":"26.6424","COMPANYNAME":"石板河","COMPANYID":"11","TYPE":"water"},
                    {"LONGITUDE":"107.5112","LATITUDE":"26.6422","COMPANYNAME":"鱼梁江","COMPANYID":"12","TYPE":"water"},
                    {"LONGITUDE":"107.5293","LATITUDE":"26.6455","COMPANYNAME":"米汤河","COMPANYID":"13","TYPE":"water"},
                    {"LONGITUDE":"107.5218","LATITUDE":"26.6199","COMPANYNAME":"团坝河","COMPANYID":"14","TYPE":"water"},
                    {"LONGITUDE":"107.5196","LATITUDE":"26.6771","COMPANYNAME":"浪坝河","COMPANYID":"15","TYPE":"water"},
                    {"LONGITUDE":"107.5246","LATITUDE":"26.6407","COMPANYNAME":"石板河溶洞","COMPANYID":"16","TYPE":"water"},
                    {"LONGITUDE":"107.5182","LATITUDE":"26.6396","COMPANYNAME":"吴家河溶洞","COMPANYID":"17","TYPE":"water"}
                ],
                mgdInfo:[
                    {
                        id:"1",
                        info:{
                            "hbmb":"大干田",
                            "fw":"NE",
                            "jl":"310",
                            "rs":"110/385",
                        }
                    },
                    {
                        id:"2",
                        info:{
                            "hbmb":"程家山",
                            "fw":"NE",
                            "jl":"740",
                            "rs":"14/50",
                        }
                    },
                    {
                        id:"3",
                        info:{
                            "hbmb":"大院村",
                            "fw":"E",
                            "jl":"1000",
                            "rs":"90/315",
                        }
                    },
                    {
                        id:"4",
                        info:{
                            "hbmb":"下乐岗",
                            "fw":"NE",
                            "jl":"1150",
                            "rs":"21/74",
                        }
                    },
                    {
                        id:"5",
                        info:{
                            "hbmb":"沙井",
                            "fw":"NE",
                            "jl":"550",
                            "rs":"30/105",
                        }
                    },
                    {
                        id:"6",
                        info:{
                            "hbmb":"龙井",
                            "fw":"N",
                            "jl":"410",
                            "rs":"86/300",
                        }
                    },
                    {
                        id:"7",
                        info:{
                            "hbmb":"沙锅厂",
                            "fw":"W",
                            "jl":"230",
                            "rs":"84/294",
                        }
                    },
                    {
                        id:"8",
                        info:{
                            "hbmb":"马场冲",
                            "fw":"SW",
                            "jl":"1120",
                            "rs":"11/38",
                        }
                    },
                    {
                        id:"9",
                        info:{
                            "hbmb":"夹耳田",
                            "fw":"SW",
                            "jl":"530",
                            "rs":"8/32",
                        }
                    },
                    {
                        id:"10",
                        info:{
                            "hbmb":"马场坪",
                            "fw":"SE",
                            "jl":"800",
                            "rs":"8330/25000",
                        }
                    },
                    {
                        id:"11",
                        info:{
                            "hbmb":"河坎",
                            "fw":"SE",
                            "jl":"660",
                            "rs":"75/270",
                        }
                    },
                    {
                        id:"12",
                        info:{
                            "hbmb":"石板河",
                            "fw":"N",
                            "jl":"60",
                            "rs":"/",
                        }
                    },
                    {
                        id:"13",
                        info:{
                            "hbmb":"鱼梁江",
                            "fw":"W",
                            "jl":"1000",
                            "rs":"/",
                        }
                    },
                    {
                        id:"14",
                        info:{
                            "hbmb":"米汤河",
                            "fw":"W",
                            "jl":"1000",
                            "rs":"/",
                        }
                    },
                    {
                        id:"15",
                        info:{
                            "hbmb":"团坝河",
                            "fw":"S",
                            "jl":"900",
                            "rs":"/",
                        }
                    },
                    {
                        id:"16",
                        info:{
                            "hbmb":"浪坝河",
                            "fw":"N",
                            "jl":"8000",
                            "rs":"/",
                        }
                    },
                    {
                        id:"17",
                        info:{
                            "hbmb":"石板河溶洞",
                            "fw":"N",
                            "jl":"80",
                            "rs":"/",
                        }
                    },
                    {
                        id:"18",
                        info:{
                            "hbmb":"吴家河溶洞",
                            "fw":"W",
                            "jl":"140",
                            "rs":"/",
                        }
                    }
                ],
                jcdMarkers:[
                    {"LONGITUDE":"107.5257012","LATITUDE":"26.6409068","COMPANYNAME":"背景点#1","COMPANYID":"1"},
                    {"LONGITUDE":"107.5135288","LATITUDE":"26.6439058","COMPANYNAME":"背景点#2","COMPANYID":"2"},
                    {"LONGITUDE":"107.5211756","LATITUDE":"26.6430689","COMPANYNAME":"监测点#1","COMPANYID":"3"},
                    {"LONGITUDE":"107.5187567","LATITUDE":"26.6445335","COMPANYNAME":"监测点#2","COMPANYID":"4"},
                    {"LONGITUDE":"107.5097055","LATITUDE":"26.6502522","COMPANYNAME":"监测点#3","COMPANYID":"5"},
                    {"LONGITUDE":"107.5817799","LATITUDE":"26.6573653","COMPANYNAME":"监测点#4","COMPANYID":"6"},
                    {"LONGITUDE":"107.6432113","LATITUDE":"26.6573374","COMPANYNAME":"控制监测点#1","COMPANYID":"7"},
                    {"LONGITUDE":"107.6472687","LATITUDE":"26.6684943","COMPANYNAME":"控制监测点#2","COMPANYID":"8"}
                ],
                jcd2:[
                    {"LONGITUDE":"107.5281502037","LATITUDE":"26.642457639","COMPANYNAME":"背景点#1","COMPANYID":"1"},
                    {"LONGITUDE":"107.528128746","LATITUDE":"26.640290353","COMPANYNAME":"监测点#1","COMPANYID":"2"},
                    {"LONGITUDE":"107.528193119","LATITUDE":"26.638314826","COMPANYNAME":"监测点#2","COMPANYID":"3"},
                    {"LONGITUDE":"107.527849796","LATITUDE":"26.63632008","COMPANYNAME":"监测点#3","COMPANYID":"4"},
                ]
            },
            "威顿（中国）化工有限责任公司":{
                river:"鱼梁江",
                zcqk:[],
                factory:[
                    {name:"硫酸",id:"1"},
                    {name:"磷酸",id:"2"},
                    {name:"氟硅酸",id:"3"},
                    {name:"甲基异丁基(甲)酮",id:"4"},
                    {name:"液氨",id:"5"},
                    {name:"硫磺",id:"6"},
                    {name:"双氧水",id:"7"},
                    {name:"五氧化二钒",id:"8"}        
                ],
                mgd:[
                    {"name":"大干田","id":"1"},
                    {"name":"程家山","id":"2"},
                    {"name":"大院村","id":"3"},
                    {"name":"下乐岗","id":"4"},
                    {"name":"沙井","id":"5",},
                    {"name":"龙井","id":"6"},
                    {"name":"沙锅厂","id":"7"},
                    {"name":"马场冲","id":"8"},
                    {"name":"夹耳田","id":"9"},
                    {"name":"马场坪","id":"10"},
                    {"name":"石板河","id":"11"},
                    {"name":"鱼梁江","id":"12"},
                    {"name":"米汤河","id":"13"},
                    {"name":"团坝河","id":"14"},
                    {"name":"浪坝河","id":"15"},
                    {"name":"石板河溶洞","id":"16"},
                    {"name":"吴家河溶洞","id":"17"},
                ],
                mgdMarkers:[
                    {"LONGITUDE":"107.5237","LATITUDE":"26.6465","COMPANYNAME":"大干田","COMPANYID":"1","TYPE":"air",},
                    {"LONGITUDE":"107.5277","LATITUDE":"26.6487","COMPANYNAME":"程家山","COMPANYID":"2","TYPE":"air",},
                    {"LONGITUDE":"107.5325","LATITUDE":"26.6434","COMPANYNAME":"大院村","COMPANYID":"3","TYPE":"air",},
                    {"LONGITUDE":"107.5312","LATITUDE":"26.653","COMPANYNAME":"下乐岗","COMPANYID":"4","TYPE":"air",},
                    {"LONGITUDE":"107.5249","LATITUDE":"26.651","COMPANYNAME":"沙井","COMPANYID":"5","TYPE":"air",},
                    {"LONGITUDE":"107.5206","LATITUDE":"26.6494","COMPANYNAME":"龙井","COMPANYID":"6","TYPE":"air",},
                    {"LONGITUDE":"107.5172","LATITUDE":"26.6373","COMPANYNAME":"沙锅厂","COMPANYID":"7","TYPE":"air",},
                    {"LONGITUDE":"107.4999","LATITUDE":"26.6427","COMPANYNAME":"马场冲","COMPANYID":"8","TYPE":"air",},
                    {"LONGITUDE":"107.5129","LATITUDE":"26.6403","COMPANYNAME":"夹耳田","COMPANYID":"9","TYPE":"air",},
                    {"LONGITUDE":"107.528","LATITUDE":"26.631","COMPANYNAME":"马场坪","COMPANYID":"10","TYPE":"air",},
                    {"LONGITUDE":"107.5238","LATITUDE":"26.6424","COMPANYNAME":"石板河","COMPANYID":"11","TYPE":"water",},
                    {"LONGITUDE":"107.5112","LATITUDE":"26.6422","COMPANYNAME":"鱼梁江","COMPANYID":"12","TYPE":"water",},
                    {"LONGITUDE":"107.5293","LATITUDE":"26.6455","COMPANYNAME":"米汤河","COMPANYID":"13","TYPE":"water",},
                    {"LONGITUDE":"107.5218","LATITUDE":"26.6199","COMPANYNAME":"团坝河","COMPANYID":"14","TYPE":"water",},
                    {"LONGITUDE":"107.5196","LATITUDE":"26.6771","COMPANYNAME":"浪坝河","COMPANYID":"15","TYPE":"water",},
                    {"LONGITUDE":"107.5246","LATITUDE":"26.6407","COMPANYNAME":"石板河溶洞","COMPANYID":"16","TYPE":"water",},
                    {"LONGITUDE":"107.5182","LATITUDE":"26.6396","COMPANYNAME":"吴家河溶洞","COMPANYID":"17","TYPE":"water",}
                ],
                mgdInfo:[
                    {
                        id:"1",
                        info:{
                            "hbmb":"大干田",
                            "fw":"NE",
                            "jl":"310",
                            "rs":"110/385",
                        }
                    },
                    {
                        id:"2",
                        info:{
                            "hbmb":"程家山",
                            "fw":"NE",
                            "jl":"740",
                            "rs":"14/50",
                        }
                    },
                    {
                        id:"3",
                        info:{
                            "hbmb":"大院村",
                            "fw":"E",
                            "jl":"1000",
                            "rs":"90/315",
                        }
                    },
                    {
                        id:"4",
                        info:{
                            "hbmb":"下乐岗",
                            "fw":"NE",
                            "jl":"1150",
                            "rs":"21/74",
                        }
                    },
                    {
                        id:"5",
                        info:{
                            "hbmb":"沙井",
                            "fw":"NE",
                            "jl":"550",
                            "rs":"30/105",
                        }
                    },
                    {
                        id:"6",
                        info:{
                            "hbmb":"龙井",
                            "fw":"N",
                            "jl":"410",
                            "rs":"86/300",
                        }
                    },
                    {
                        id:"7",
                        info:{
                            "hbmb":"沙锅厂",
                            "fw":"W",
                            "jl":"230",
                            "rs":"84/294",
                        }
                    },
                    {
                        id:"8",
                        info:{
                            "hbmb":"马场冲",
                            "fw":"SW",
                            "jl":"1120",
                            "rs":"11/38",
                        }
                    },
                    {
                        id:"9",
                        info:{
                            "hbmb":"夹耳田",
                            "fw":"SW",
                            "jl":"530",
                            "rs":"8/32",
                        }
                    },
                    {
                        id:"10",
                        info:{
                            "hbmb":"马场坪",
                            "fw":"SE",
                            "jl":"800",
                            "rs":"8330/25000",
                        }
                    },
                    {
                        id:"11",
                        info:{
                            "hbmb":"河坎",
                            "fw":"SE",
                            "jl":"660",
                            "rs":"75/270",
                        }
                    },
                    {
                        id:"12",
                        info:{
                            "hbmb":"石板河",
                            "fw":"N",
                            "jl":"60",
                            "rs":"小河",
                        }
                    },
                    {
                        id:"13",
                        info:{
                            "hbmb":"鱼梁江",
                            "fw":"W",
                            "jl":"1000",
                            "rs":"小河",
                        }
                    },
                    {
                        id:"14",
                        info:{
                            "hbmb":"米汤河",
                            "fw":"W",
                            "jl":"1000",
                            "rs":"小河",
                        }
                    },
                    {
                        id:"15",
                        info:{
                            "hbmb":"团坝河",
                            "fw":"S",
                            "jl":"900",
                            "rs":"小河",
                        }
                    },
                    {
                        id:"16",
                        info:{
                            "hbmb":"浪坝河",
                            "fw":"N",
                            "jl":"8000",
                            "rs":"小河",
                        }
                    },
                    {
                        id:"17",
                        info:{
                            "hbmb":"石板河溶洞",
                            "fw":"N",
                            "jl":"80",
                            "rs":"/",
                        }
                    },
                    {
                        id:"18",
                        info:{
                            "hbmb":"吴家河溶洞",
                            "fw":"W",
                            "jl":"140",
                            "rs":"/",
                        }
                    }
                ]
            }
        }
        var flowtos = {
            "贵州开磷集团矿肥有限责任公司":"古撤河",
            "瓮福化工公司":"重安江",
            "威顿（中国）化工有限责任公司":"重安江"
        };
        var companyInfo = {};//企业信息(用于面板显示)
        //风险源
        var fxyMock = [{
            ADDRESS: "瓮福化工公司位于福泉市马场坪镇北面800m",
            COMPANYID: "522702AAA0070",
            COMPANYNAME: "瓮福化工公司",
            COMPANYPROFILE: null,
            CUSTODIAN: "张迪",
            CUSTODIANTELEPHONE: "13,595,470,983",
            DOCUMENTYEAR: "-2017",
            ENTRYTIME: "2018-09-10",
            INDUSTRYINVOLVED: "",
            LATITUDE: "26.6415",
            LONGITUDE: "107.528",
            RISKGRADE: "较大",
            xzqyId: "92",
            xzqyName: "福泉市",
            xzqyName2: "黔南州"
        }];
        //var fxyMock = [$scope.resourceMap.fxy.detail];

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
                }
                else if(type=="jcd"){
                    img = "images/wp2.png";
                }
                else{
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
                    lat: parseFloat(s.LATITUDE) + 0.003,
                    lon: parseFloat(s.LONGITUDE) - 0.004,
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
                    },
                    visible:true
                }
                if(type=="fxy"){
                    item.clickLabel={
                        id: s.COMPANYID,
                        title: s.COMPANYNAME,
                        url: 'partials/pop/risk.html',
                        classNm: "featureClick",
                        placement: "right"
                    };
                }
                markers.push(item);
            });
            return markers;
        };

        //格式化监测点悬浮信息
        function initOverlays(resource){
            return resource.map(function(jcd){
                return mapSet.setJcdLay("<div style='white-space:nowrap;'>"+jcd.COMPANYNAME+"</div>",[parseFloat(jcd.LONGITUDE) - 0.004, parseFloat(jcd.LATITUDE)+0.003]);
            })
        }

        //初始化河流汇入点和流出点
        function initInOut(){
            var args = this.event.args;
            if(!args.in || !args.out) return;
            $scope.inOverlay.coord = args.in;
            $scope.inOverlay.message = args.inMsg;
            $scope.outOverlay.coord = args.out;
            $scope.outOverlay.message = args.outMsg;
        }
        
        $scope.emergencyMoni = {
            type:"",
            histype:"",
            moniInfoShow:true,
            bodyH:600,
            moniUploaded:false,
            eventFactory:"",
            eventShow:false,
            events:[],
            event:{},
            moniInfo:{
                factory:[],
                mgd:[],
                wxfx:"",
                lhtx:""
            },
            detail:{
                show:false,
                type:"mgd",
                info:""
            },
            eventToggle:_eventToggle,
            eventClick:_eventClick,
            getDetail:_getDetail,
            getLhAndWxx:_getLhAndWxx,
            resize:resizeHandler,
            getCompanyInfo:getCompanyInfo,
            getEvents:_getEvents,
            getMgdMarkers:_getMgdMarkers,
            getFxyMarkers:_getFxyMarkers,
            initInOut:initInOut,
            initModal:_initModal,
            initialize:_initialize
        };

        function _eventToggle(){
            this.eventShow=!this.eventShow;
            this.type = $scope.resourceMap.type = "";
            this.moniInfoShow = true;
            $scope.moniPlayer.destroy();
            $scope.waterPlayer.destroy();
        };

        function _eventClick(event){

            this.events.forEach(function(event){
                event.checked = false;
            });
            event.checked = true;
            this.event = event;
            this.type = event.eventType=="1"?"air":"water";
            this.eventShow = false;
            this.initModal();
            //$scope.waterPlayer.init();
        };

        //获取面板信息
        function getCompanyInfo(){
            var companyId = $stateParams.cid || $stateParams.companyId;
            var url = "dataDeal/getData?companyId=" + companyId;
            var defer = $q.defer();
            $http.get(url).then(function(res){
                companyInfo = res.data;
                defer.resolve(companyInfo);
            });
            return defer.promise;
        }

        //获取风险源
        function _getFxyMarkers(){
            var fxy = companyInfo.companyInfo;
            $scope.resourceMap.fxy.markers = initMarker(fxyMock,'fxy');
        };

        //获取敏感点
        function _getMgdMarkers(){
            var mgd = companyInfo.mgdMarkers || [];
            var water_jcd = companyInfo.jcdMarkers || [];
            var air_jcd = companyInfo.jcd2 || [];
            var jcd = this.type == "water" ? water_jcd : air_jcd;
            $scope.resourceMap.mgd.markers = initMarker(mgd,'mgd');
            $scope.resourceMap.jcd.markers = initMarker(jcd,'jcd');
            $scope.resourceMap.jcd.overlays = initOverlays(jcd);
        };

        //获取污染物理化特性以及危险性分析信息
        function _getLhAndWxx(){
            var self = this;
            var url = "dataDeal/getLHTX?name=" + self.eventFactory;
            $http.get(url).then(function(res){
                var data = res.data || {};
                self.moniInfo.lhtx = self.moniInfo.wxfx = data;
            });
        }

        //获取事件列表
        function _getEvents(){
            var defer = $q.defer();
            var self = this;
            var url = $stateParams.cid?"AtmosphericEvent/listEvent":"rest/dc/"+$rootScope.userList.access+"/AtmosphericEvent/"+$stateParams.eid;
            var params = {
                companyId:$stateParams.cid,
                name:"",
                pageNo:1,
                pageSize:1000
            };
            $http.get(url,{params:params}).then(function(data){
                var response = data.data;
                var result=$stateParams.cid?response.dataList:[response];
                self.events = result
                .map(function(event){
                    if(event.args){
                        try{
                            event.args = JSON.parse(event.args)
                        }catch(e){
                            event.args = {};
                        }
                    }else{
                        event.args = {};
                    }
                    return event;
                })
                .filter(function(event){
                    return event.status == "2"; //已完成的
                });
                defer.resolve();
            });
            return defer.promise;
        };

        function resizeHandler(){
            var wh = $("body").height();
            var gh = 70;
            $scope.emergencyMoni.bodyH = wh - gh;
        };

        function _getDetail(data,type){
            this.detail.show = true;
            this.detail.type = type;
            if(type == "mgd"){
                this.detail.title = "敏感点详情";
                this.detail.info = data.info;
                this.detail.info.hbmb = data.COMPANYNAME;
                return;
            }
            this.detail.title = "贮存情况详情";
            this.detail.info = data;
        };

        ////////////////气模型start///////////////////

        $scope.moniPlayer = {
            timer:"", //定时器
            timeLen:0,
            fileIndex:-1,
            times:[],
            timeLineShow:false,
            points:[],  //每一个时刻点模型中心点坐标
            playing:false,
            loading:false,
            loaded:false,
            infoBoard:{
                time:"00:00.00",
                show:false
            },
            timeLineActive:_timeLineActive,
            playPause:_moniPlayPause,
            prev:_moniPrev,
            next:_moniNext,
            toggle:_moniToggle,
            initMapview:_initMapview,
            initZone:_initZone,
            onload:_moniLoadedHandler,
            destroy:_destroy,
            init:_moniInit
        };

        function _timeLineActive(type){
            var self = this;
            if (type == -1) {
            	self.times.forEach(function (t, no) {
                    t.processed = false;
                    t.selected = false;
                });
                self.times[0].processed = true;
                self.times[0].selected = true;
                self.infoBoard.time = "00:00.00";
            }else{
            	self.times.forEach(function (t, no) {
                    if (no < self.fileIndex + 1) {
                        t.processed = true;
                        t.selected = false;
                    } else if (no == self.fileIndex + 1) {
                        t.processed = true;
                        t.selected = true;
                        self.infoBoard.time = sucHelpers.getDiffMs(t.val*60*1000);
                    } else {
                        t.processed = false;
                        t.selected = false;
                    }
                })
            }
        };

        function _moniPlayPause(){
            if(!this.loaded)return;
            var self = this;
            self.playing = !self.playing;
            $scope.emergencyMoni.moniInfoShow = !self.playing;
            if(!self.playing) {
                if (self.timer) {
                    $interval.cancel(self.timer);
                }
            }else{
                if (self.fileIndex == self.timeLen - 1) {
                    self.fileIndex = 0;
                    self.timeLineActive(1);
                }
                self.timer = $interval(function () {
                    var zoom = self.fileIndex < 5 ? 16 : (self.fileIndex<10?15:14);
                    if (self.fileIndex < self.timeLen - 1) {
                        self.fileIndex++;
                        self.timeLineActive(1);
                        if (self.fileIndex == self.timeLen - 1) {
                            $interval.cancel(self.timer);
                            self.playing = false;
                        }
                        self.initMapview(self.fileIndex,zoom);
                        $scope.$emit("timestamp",self.fileIndex);
                    } else {
                        $interval.cancel(self.timer);
                        self.playing = false;
                    }
                }, 2000);
            }
        };

        function _moniPrev(){
            if(!this.loaded)return;
            if (this.fileIndex > 0) {
                this.fileIndex--;
                this.timeLineActive(1);
            }
            var zoom = this.fileIndex < 5 ? 16 : (this.fileIndex<10?15:14);
            this.initMapview(this.fileIndex,zoom);
            $scope.$emit("timestamp",this.fileIndex);
            $scope.emergencyMoni.moniInfoShow=false;
        };

        function _moniNext(){
            if(!this.loaded)return;
            if (this.fileIndex < this.timeLen - 1) {
                this.fileIndex++;
                this.timeLineActive(1);
            }
            var zoom = this.fileIndex < 5 ? 16 : (this.fileIndex<10?15:14);
            this.initMapview(this.fileIndex,zoom);
            $scope.$emit("timestamp",this.fileIndex);
            $scope.emergencyMoni.moniInfoShow=false;
        };

        function _moniToggle(timePoint){
            if(!this.loaded)return;
            var fileIndex = this.fileIndex = timePoint - 1;
            var zoom = fileIndex < 5 ? 16 : (fileIndex<10?15:14);
            this.initMapview(fileIndex,zoom);
            $scope.$emit("timestamp",fileIndex);
            if (fileIndex == -1) {
                this.timeLineActive(-1);
            } else {
                this.timeLineActive(1);
            }
        };

        function _moniLoadedHandler(data){
            this.loading = false;
            this.timeLineShow = true;
            this.loaded = data.isSuccess;
            this.infoBoard.show = true;
            this.points = data.centers;
            $scope.emergencyMoni.histype = $scope.emergencyMoni.type;
        };

        //初始化浓度范围
        function _initZone(){
            var f = this.eventCoord;
            var r1 = this.halfdeadRange
            var r0 = this.harmRange;
            var m = gisCaculate.destinationVincenty(f,180,r0);
            var l = gisCaculate.destinationVincenty(f,0,r1);
            $scope.resourceMap.safeZone.radius = r1;
            $scope.resourceMap.dangerZone.radius = r0;
            $scope.resourceMap.safeZone.coords = f;
            $scope.resourceMap.dangerZone.coords = f;
            $scope.resourceMap.safeLine.coords=[f,l];
            $scope.resourceMap.dangerLine.coords=[f,m];
            $scope.resourceMap.safeLine.center=[(f[0]+l[0])/2,(l[1]+f[1])/2];
            $scope.resourceMap.dangerLine.center=[(m[0]+f[0])/2,(m[1]+f[1])/2];
            $scope.resourceMap.safeLine.label={
                classNm: 'moniOverlay',
                message: "<div style='white-space: nowrap;'>预估半致死浓度范围(" + r1.toFixed(2) + "米)</div>",
                stopEvent: false
            }
            $scope.resourceMap.dangerLine.label={
                classNm: 'moniOverlay',
                message: "<div style='white-space: nowrap;'>预估伤害浓度范围(" + r0.toFixed(2) + "米)</div>",
                stopEvent: false
            };
        };

        function _moniInit(){
            var event = $scope.emergencyMoni.event;
            this.eventCoord = event.args.lg&&event.args.lt?[parseFloat(event.args.lg),parseFloat(event.args.lt)]:[106.86,27.131]; //事故地点
            this.halfdeadRange = event.halfdeadRange?parseFloat(event.halfdeadRange):1246.78; //预估半致死浓度范围
            this.harmRange = event.harmRange?parseFloat(event.harmRange):512.07; //预估伤害浓度范围
            this.loading = true;
            this.times = mapSet.getTimes();
            this.timeLen = 22;
            this.points.length = 0;
            if (this.timer) {
                $interval.cancel(this.timer);
            }
            this.times.forEach(function (t, no) {
                t.processed = false;
                t.selected = false;
            })
            this.playing = false;
            this.infoBoard.show = false;
            this.fileIndex = -1;
            this.timeLineActive(-1);
            this.initMapview(-1);
            this.initZone();
            $scope.olMap.windData=$scope.emergencyMoni.event.simulationId;
        };

        //监听气模型数据是否加载成功
        $rootScope.$on("olFcolorComplete",function(e,data){
            if(!data.isSuccess){
                alert("模型数据加载失败!");
            }
            $scope.moniPlayer.onload(data);
        });
        ////////////////气模型end///////////////////

        //////////////水模型start/////////////////
        $scope.waterPlayer = {
            timer:"", //定时器
            timeLen:0,
            fileIndex:-1,
            loading:false,
            playing:false,
            legendOpt:{size:"5px",height:"200px"},
            postNum:0, //记录河流图层和模型数据加载情况(为2时加载完成)
            from:"",
            to:"",
            moniText:"<span>预测信息...</span>",
            files:[],
            times:[],
            modalData:[],//模型原始数据
            wrwData:[], //污染物数据
            addrs:[],//河流流经地点
            riverFeature:null,
            timeLineShow:false,
            infoBoard:{},
            numLevel:[],
            color:[],
            echarts:[],
            getData:_getWaterData,
            setData:_setData,
            readData:_waterReadData,
            playPause:_waterPlayPause,
            prev:_waterPrev,
            next:_waterNext,
            toggle:_waterToggle,
            onload:_waterOnloaded,
            initEcharts:_initEcharts,
            init:_waterInit,
            destroy:_destroy
        };

        function _getWaterData(amount){
            var self = this;
            var url = dataSet.getUrls().modalQuery + "?amount="+(amount || 366120);
            $http.get(url).then(function(data){
                self.modalData = data.data && data.data.features || [];
                self.wrwData = data.data && data.data.concentrations || [];
                self.wrwData = self.wrwData.map(function(item){
                    return item.toFixed(4);
                });
                self.messages = [];
                var str = ''
                data.data.features.forEach(function (item,index) {
                    if(item.length!=0){
                        var max = parseFloat(item[0].attributes.value),
                            maxIndex = 0;
                        item.forEach(function (f, no) {
                            var fvalue = parseFloat(f.attributes.value);
                            if (fvalue >= max) {
                                maxIndex = no;
                                max = fvalue;
                            }
                        })
                        var feature = new ol.Feature({
                            geometry: new ol.geom.Polygon(item[maxIndex].geometry.rings).transform("EPSG:4326", "EPSG:3857")
                        });
                        var coords = feature.getGeometry().getInteriorPoint().getCoordinates();
                        var point = olHelpers.coordinateTransform(coords,'EPSG:3857','EPSG:4326');
                        str+=point[0]+'_'+point[1]+'_'+companyInfo.rever+';'
                    }

                })
                $http.get('waterEven/input?str='+str).then(function (data) {
                    self.messages = data.data;
                    self.postNum ++;
                    self.loading = true;
                })
            },function(){
                self.loading = false;
                alert("模型计算失败...");
            });
        };

        function _setData(){
            var  defer = $q.defer();
            setInline().then(setOutline).then(setModel).then(function(){
                defer.resolve();
            });
            return defer.promise;
        };

        function setOutline(){
            var defer = $q.defer();
            var fileUrl = "dzm/"+companyInfo.rever+"/outline.json";
            $http.get(fileUrl).then(function(data){
                var geoJson = data.data;
                var url = dataSet.getUrls().setOutline;
                $http({
                    method:"POST",
                    url:url,
                    data:geoJson,
                    transformResponse:function(data){
                        return data
                    }
                })
                .then(function(data){
                    console.log(data);
                    defer.resolve();
                });
            });
            return defer.promise;
        };

        function setInline(){
            var defer = $q.defer();
            var fileUrl = "dzm/"+companyInfo.rever+"/inline.json";
            $http.get(fileUrl).then(function(data){
                var geoJson = data.data;
                var url = dataSet.getUrls().setInline;
                $http.get(fileUrl).then(function(data){
                    $http({
                        method:"POST",
                        url:url,
                        data:geoJson,
                        transformResponse:function(data){
                            return data
                        }
                    })
                    .then(function(data){
                        console.log(data);
                        defer.resolve();
                    });
                });
            });
            return defer.promise;
        };

        function setModel(){
            var defer = $q.defer();
            var event = $scope.emergencyMoni.event;
            var url = dataSet.getUrls().setModal;
            var body ={
                "samplePoint": 20,
                "start":null,
                "target":event.args.levels
            }
            if(event.args.start){
                body.start = event.args.start;
            }
            $http({
                method:"POST",
                url:url,
                data:body,
                transformResponse:function(data){
                    return data
                }
            })
            .then(function(data){
                console.log(data);
                defer.resolve();
            });
            return defer.promise;
        };

        function _waterReadData(url){
            var self = this,
                wrwData = self.wrwData,
                numLevel = self.numLevel,
                colors = self.color,
                fileIndex = self.fileIndex;
            if (url == -1) {
                $scope.waterModel.dzmLayer.visible = true;
                self.infoBoard.time = "0";
                self.infoBoard.wrwData = wrwData[0];
                var len = numLevel.length;
                var color = colors[len - 1];
                for (var i = len - 1; i >= 0; i--) {
                    if (wrwData[0] < numLevel[i]) {
                        color = colors[i - 1];
                    }
                }
                self.infoBoard.wrwColor = {
                    color: color
                };
                self.times.forEach(function (t, no) {
                    t.processed = false;
                    t.selected = false;
                });
                self.times[0].processed = true;
                self.times[0].selected = true;
                $scope.waterModel.dzmLayer.visible = false;
                $scope.waterModel.nearCircle.visible = false;
                //敏感点
                $scope.resourceMap.mgd.markers.forEach(function(marker){
                    marker.visible = false;
                });
                return;
            }
            var modal = self.modalData[fileIndex];
            var features = modal.map(function(f){
                return {
                    type: "Feature",
                    geometry: {
                        type: "Polygon",
                        coordinates: f.geometry.rings
                    },
                    properties: f.attributes
                }
            });
            var obj = {
                type: "FeatureCollection",
                features: features
            }
            $scope.waterModel.dzmLayer.source.geojson.object = obj;
            $scope.waterModel.dzmLayer.visible = true;
            self.times.forEach(function (t, no) {
                if (no < fileIndex + 1) {
                    t.processed = true;
                    t.selected = false;
                } else if (no == fileIndex + 1) {
                    t.processed = true;
                    t.selected = true;
                    self.infoBoard.time = t.val;
                    self.infoBoard.wrwData = wrwData[fileIndex];
                    var len = numLevel.length;
                    var color = colors[len - 1];
                    for (var i = len - 1; i >= 0; i--) {
                        if (wrwData[fileIndex] < numLevel[i]) {
                            color = colors[i - 1];
                        }
                    }
                    self.infoBoard.wrwColor = {
                        color: color
                    };
                } else {
                    t.processed = false;
                    t.selected = false;
                }
            });
        };

        function _initFiles(){
            for (var num = 1; num <= this.timeLen; num++) {
                this.files.push("dzm/洋水河/" + num + ".json");
            }
        };

        function _waterPlayPause(){
            var self =  this;
            self.playing = !self.playing;
            this.infoBoard.show = self.playing;
            $scope.emergencyMoni.moniInfoShow = !self.playing;
            if (!self.playing) {
                if (self.timer) {
                    $interval.cancel(self.timer);
                }
            } else {
                if (self.fileIndex == self.timeLen - 1) {
                    self.fileIndex = 0;
                    self.readData(self.files[self.fileIndex]);
                }
                self.timer = $interval(function () {
                    if (self.fileIndex < self.timeLen - 1) {
                        self.fileIndex++;
                        self.readData(self.files[self.fileIndex]);
                        if (self.fileIndex == self.timeLen - 1) {
                            $interval.cancel(self.timer);
                            self.playing = false;
                        }
                    } else {
                        $interval.cancel(self.timer);
                        self.playing = false;
                    }
                }, 2000);
            }
        };

        function _waterPrev(){
            $scope.emergencyMoni.moniInfoShow = false;
            this.infoBoard.show = true;
            if (this.fileIndex > 0) {
                this.fileIndex--;
                this.readData(this.files[this.fileIndex]);
            }
        };

        function _waterNext(){
            $scope.emergencyMoni.moniInfoShow = false;
            this.infoBoard.show = true;
            if (this.fileIndex < this.timeLen - 1) {
                this.fileIndex++;
                this.readData(this.files[this.fileIndex]);
            }
        };

        function _waterToggle (timePoint) {
            $scope.emergencyMoni.moniInfoShow = false;
            this.infoBoard.show = true;
            this.fileIndex = timePoint - 1;
            if (this.fileIndex == -1) {
                this.readData(-1);
            } else {
                this.readData(this.files[this.fileIndex]);
            }
        };

        function _waterOnloaded(){
            var self = this;
            $scope.emergencyMoni.histype = $scope.emergencyMoni.type;
            $timeout(function(){
                self.loading = false;
                self.timeLineShow = true;
                self.readData(-1);
                self.initEcharts();
            },0);
        };

        function _initEcharts(){
            var event = $scope.emergencyMoni.event;
            this.echarts = sucHelpers.setLine();
            this.echarts.xAxis[0].data = this.times.map(function(item){
                return item.name;
            });
            //this.echarts.legend.data.shift();
            this.echarts.legend.data[0]=$scope.emergencyMoni.eventFactory;
            this.echarts.series[0].data = this.wrwData;
            //this.echarts.series.length = 1;
            this.echarts.series[0].name = $scope.emergencyMoni.eventFactory;
            this.echarts.series[0].markLine.data.length = 1;
            this.echarts.series[0].markLine.data[0].yAxis = event.args && event.args.standard || 0.7;
        };
  
        function _waterInit(){
            var event = $scope.emergencyMoni.event;
            var self = this;
            self.numLevel = event.args.levels || [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000];//浓度层级
            self.color = event.args.colors || ["#00FFEF", "#00FFE0", "#00FF84", "#00FF28", "#33FF00", "#8FFF00", "#EBFF00", "#FFB700", "#FF5B00", "#FF0000"];//与浓度层级对应
            self.infoBoard.mgd = [];
            self.infoBoard.show = false;
            self.loading = true;
            self.playing = false;
            self.times = mapSet.getTimes();
            self.timeLen = 22;
            self.timeLineShow = false;
            self.fileIndex = -1;
            self.postNum = $scope.emergencyMoni.histype=="water"?1:0;
            self.setData().then(function(){
                self.getData(event.args.amount);
            });
            $scope.waterModel.river = {
                source: {
                    type: "GeoJSON",
                    url: "dzm/"+companyInfo.rever+"/outline.json",
                    moveStyle: {},
                    loader:true,
                    dataType:'json',
                    style: function(feature){
                        return new ol.style.Style({
                            fill:new ol.style.Fill({
                                color: [88, 198, 255, 0.8]
                            }),
                            stroke:new ol.style.Stroke({
                                width: 1,
                                color: [0,0,0,0]
                            })
                        })

                    	// return {
                    	// 	fill: {
                    	// 		color: [88, 198, 255, 0.8]
                    	// 	},
                    	// 	stroke: {
                    	// 		width: 1,
                    	// 		color: [0,0,0,0]
                    	// 	}
                    	// }
                    }
                },
                zIndex: 2
            };
            /*$scope.waterModel.addrLayer = {
                name: "riverAddr",
                source: {
                    type: "GeoJSON",
                    url: "dzm/"+companyInfo.rever+"/inline.json"
                },
                style: function(feature){
                    var name = feature.get("name");
                    return new ol.style.Style({
                        text:new ol.style.Text({
                            text:name,
                            font:"14px 微软雅黑",
                            fill:new ol.style.Fill({
                                color:"rgba(0,0,0,0)"
                            }),
                            stroke:new ol.style.Stroke({
                                color:"rgba(0,0,0,0)",
                                width:1
                            })
                        })
                    });
                },
                zIndex: 20
            }*/
            $scope.waterModel.addrCreated = function(source){
                if(source){
                    var features = source.getFeatures();
                    self.addrs = features.map(function(f){
                        return {
                            name:f.get("name"),
                            coord:f.getGeometry().getCoordinates()
                        }
                    });
                }
            }
            $scope.waterModel.riverCreated = function(source){
                if(source){
                    //var features = source.getFeatures();
                    var start = [$scope.emergencyMoni.event.args.lg,$scope.emergencyMoni.event.args.lt];
                    //var end = features[0].get("end").split(",");
                    //self.riverFeature = features[0];
                    $scope.olMap.center.lon = parseFloat(start[0]);
                    $scope.olMap.center.lat = parseFloat(start[1]);
                    $scope.olMap.center.zoom = 15;
                    self.postNum ++;
                    $scope.$apply();
                }
            };
            $scope.waterModel.posOverlay = {
                coord: undefined,
                label: {
                    message: "<div class='nowrap'></div>",
                    classNm: "posInfo featureOver",
                    placement: "right"
                }
            };
            //影响范围设置
            $scope.waterModel.nearCircle = {
                coords: "",
                radius:event.args.harmRange || 500,
                createEnd: function (feature) {
                    var cg = feature.getGeometry();
                    var pos = "";
                    var len = self.addrs.length;
                    self.from = self.addrs[0]&&self.addrs[0].name;
                    //self.to = self.addrs[len-1]&&self.addrs[len-1].name;
                    self.to = $scope.emergencyMoni.event.flowTo || flowtos[$scope.emergencyMoni.event.companyName];
                    //敏感点
                    self.infoBoard.mgd.length = 0;
                    $scope.resourceMap.mgd.markers.forEach(function(marker){
                       var coord = olHelpers.coordinateTransform([marker.lon,marker.lat],"EPSG:4326", "EPSG:3857");
                       if(cg.intersectsCoordinate(coord)){
                           marker.visible = true;
                           self.infoBoard.mgd.push(marker.info.COMPANYNAME);
                       }else{
                            marker.visible = false;
                       }
                    });
                    var addrs = [];
                    self.addrs.forEach(function(addr){
                        if(cg.intersectsCoordinate(addr.coord)){
                            addrs.push(addr.name);
                        }
                    });
                    pos = self.fileIndex==0?addrs[0]:addrs[addrs.length-1];
                    if(pos){
                        $scope.waterModel.posOverlay.label.message = "<div style='white-space:nowrap;'>" + pos + "</div>";
                    }
                    $scope.waterModel.posOverlay.coord = cg.getCenter();
                    var center = olHelpers.coordinateTransform($scope.waterModel.posOverlay.coord,'EPSG:3857','EPSG:4326') ;
                    var speed = $scope.emergencyMoni.event.args.speed || 10;//水流速度(模型中记得配置)
                    var key = $scope.waterPlayer.fileIndex
                    var param = $.parseJSON($scope.waterPlayer.messages);
                    var city = fiterArr(param.city)
                    var province = fiterArr(param.province)
                    function fiterArr(arr) {
                        var obj = {
                            state:true,
                            val:arr[0],
                            arrIndex:[]
                        }
                        for(let i = 1;i < arr.length;i++){
                            if(obj.val != arr[i]){
                                obj.val = arr[i];
                                obj.state = false;
                                obj.arrIndex.push(i)
                            }
                        }return obj
                    }
                    function compare(n,arr,area) {
                        for (let i=0;i<arr.length;i++){
                            if(arr[i]>n){
                                return arr[i];
                            }else {
                                if(area == 'province'){
                                    province.state = true
                                }else if(area == 'city'){
                                    city.state = true
                                }
                            }
                        }
                    }
                    //时间转化
                    function timeFmt(t) {
                        var out = ''
                        if(t<60){
                            out = t+'分钟'
                        }else if(t%60==0){
                            out = t/60+'小时'
                        }else {
                            out = parseInt(t/60)+'小时'+parseInt(t%60)+'分钟'
                        }
                        return out
                    }
                    if(key >= province.arrIndex[province.arrIndex.length-1]){
                        province.state = true
                    }
                    if(key >= city.arrIndex[city.arrIndex.length-1]){
                        city.state = true
                    }
                    if(province.state == true){
                        var value = '之后不会到外省。'
                    }else {
                        var value = '还有'+timeFmt((compare(key,province.arrIndex,'province')-key)*15)+
                            '进入'+param.province[compare(key,province.arrIndex,'province')]+'，到达交界处时的浓度为'+($scope.waterPlayer.wrwData[compare(key,province.arrIndex,'province')] || '--')+'mg/L'
                    }
                    if(city.state == true){
                        var inner = '之后不会到外市，'
                    }else {
                        var inner = '还有'+timeFmt((compare(key,city.arrIndex,'city')-key)*15) +
                            '进入'+param.city[compare(key,city.arrIndex,'city')]+'，到达该市时污染物浓度'+($scope.waterPlayer.wrwData[compare(key,city.arrIndex,'city')] || '--')+'mg/L，'
                    }
                    self.moniText = ' 当前位于'+param.city[key]+'市州，' +
                        '预计' +inner+ ',预计'+value
                }
            };
            //等值面设置
            $scope.waterModel.dzmLayer = { //等值面图层
                source: {
                    type: "GeoJSON",
                    geojson: {
                        projection: "EPSG:4326",
                        object: ""
                    },
                    style: function(f){
                    	var fvalue = parseFloat(f.get("value"));
                        var len = self.numLevel.length;
                        var fcolor = self.color[len - 1];
                        for (var i = len - 1; i >= 0; i--) {
                            if (fvalue < self.numLevel[i]) {
                                fcolor = self.color[i - 1];
                            }
                        }
                        return olHelpers.createStyle({
                            fill: {
                                color: fcolor
                            }
                        })
                    }
                },
                style: {
                    fill: {
                        color: "transparent"
                    }
                },
                zIndex: 9,
                visible: false,
                regionLoaded: function (oSource) {
                    if (!oSource) {
                        return false;
                    }
                    var features = oSource.getFeatures();
                    var max = parseFloat(features[0].get("value")),
                        maxIndex = 0;
                    features.forEach(function (f, no) {
                        var fvalue = parseFloat(f.get("value"));
                        if (fvalue >= max) {
                            maxIndex = no;
                            max = fvalue;
                        }
                    })
                    $scope.waterModel.nearCircle.coords = features[maxIndex].getGeometry().getInteriorPoint().getCoordinates();
                    $scope.waterModel.nearCircle.visible = true;
                    var coord = olHelpers.coordinateTransform($scope.waterModel.nearCircle.coords, "EPSG:3857", "EPSG:4326");
                    $scope.olMap.center.lon = coord[0];
                    $scope.olMap.center.lat = coord[1];
                }
            };
        };

        //监听水模型数据是否加载成功
        $scope.$watch("waterPlayer.postNum",function(n,o){
            if(n==2){
                $scope.waterPlayer.onload();
            }
        });

        //////////////水模型end/////////////////

        function _destroy(){
            $interval.cancel(this.timer);
        };

        function _tabClick(tabid){
            var tab = this.list.filter(function(tab){return tab.id==tabid})[0];
            this.tabId = tabid;
        };

        //初始化地图视窗
        function _initMapview(timePoint,zoom){
            var coord = timePoint==-1?this.eventCoord:this.points[timePoint];
            $scope.olMap.center.lon = coord[0];
            $scope.olMap.center.lat = coord[1];
            $scope.olMap.center.zoom = zoom || 16;
        };

        //初始化模型
        function _initModal(){
            $scope.resourceMap.type = this.type;
            $scope.moniPlayer.destroy();
            $scope.waterPlayer.destroy();
            //this.getMgdMarkers();
            //this.eventFactory =  this.type=="air"?"液氨":"磷酸";
            this.eventFactory = this.event.pollutant || this.event.args.pollutant;
            this.getLhAndWxx();
            this.initInOut();
            if(this.type=="air"){
                $scope.moniPlayer.init();
                $scope.olMap.center.zoom = 15;
                
                $scope.olMap.map[0].visible = $scope.olMap.map[1].visible = true;
                $scope.olMap.map[2].visible = $scope.olMap.map[3].visible = false;
            }else{
                $scope.olMap.map[0].visible = $scope.olMap.map[1].visible = false;
                $scope.olMap.map[2].visible = $scope.olMap.map[3].visible = true;

            }
        };

        //初始化页面
        function _initialize(){
            $scope.resourceMap.type = "";
            $scope.waterModel.river = null;
            $scope.waterModel.riverCreated = null;
            $scope.waterModel.posOverlay = null;
            $scope.waterModel.dzmLayer = null;
            var self = this;
            self.eventShow = true;
            this.getCompanyInfo().then(function(){
                self.getMgdMarkers();
                self.getFxyMarkers();
                self.moniInfo.factory = companyInfo.zcqk;
                self.moniInfo.mgd = companyInfo.mgdMarkers;
                /*if(JSON.stringify($scope.emergencyMoni.event) != '{}'){
                    $scope.waterPlayer.init();
                }*/
                $timeout(function () {
                    $scope.waterPlayer.init();
                },0)
            });
            self.getEvents().then(function(){
                if(self.events.length==1){
                    self.eventClick(self.events[0]);
                }
            })
            this.resize();
        };

        $scope.$on("$destroy",function(){
            $scope.moniPlayer.destroy();
            $scope.waterPlayer.destroy();
            $scope.olMap.map[0].visible = $scope.olMap.map[1].visible = false;
            $scope.olMap.map[2].visible = $scope.olMap.map[3].visible = true;
        });

        $scope.$on("sendTbodyh",resizeHandler);

        $scope.levelFun = function(item){
            return item>0;
        }


        $scope.emergencyMoni.initialize();
        




    })
    
    
    
});