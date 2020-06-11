define(['app'], function (app) {

  app.controller("emerPlanShCtrl", function ($rootScope, $scope, $http, $stateParams, $uibModal, mapSet, chartSet) {

    $scope.xzqyId = '-1';
    // 获取select地区数据
    var getArea = function () {
      $http.get("basicData/listXzqy").then(function (response) {
        $scope.itAreas = response.data;
        console.log($scope.itAreas);
      });
    };
    //查询按钮功能，查询并回显
    $scope.searchInfo = function () {
      $('.loader').show(); //加载查询动态条
      console.log($scope.search.xzqyId)
        localStorage.setItem('page',$scope.page.currentPage)
      $http.post("preplan/listEnterprisePreplan?" + "&pageNo=" + $scope.page.currentPage,
        {
            "companyName": $scope.search.companyName,
            "level": $scope.search.level,
            "recordStatus": $scope.search.recordStatus,
            "xzqyId": $scope.search.xzqyId
        }
      ).then(function (data) {
          $('.loader').hide();
          $scope.page.list = data.data;
          $scope.page.totalCount = data.data.totalCount;
          $scope.page.pageSize = data.data.pageSize;
      });
    };
      //预案清单导入
      $scope.riskfileEntry = function () {
          var body
          var modalInstance = $uibModal.open({
              templateUrl: "partials/pop/riskFileUpload.html",
              controller: "riskFileUploadCtrl",
              backdrop: 'static',
              size: 'moniPop',
              resolve: {
                  body :{}
              }
          });
          modalInstance.result.then(function() {
              $scope.searchInfo();
          })
      };
    // 初始化
    function init() {
      $scope.page = {
        url: "preplan/listEnterprisePreplan",
        totalCount: 10,
        currentPage: localStorage.getItem('page')||1,
        pageSize: 1,
        list: []
      };
      $scope.search = {
        xzqyId: '-1',
        level: '-1',
        recordStatus: '-1',
        strDate: new Date().getFullYear() + '/01/01',
        endDate: new Date().getFullYear() + 1 + '/01/01',
        companyName: ''
      };
      // $scope.getManageDetail();
      getArea();
    }
      // 调用初始化
      init();
      $scope.searchInfo();

  });
    app.controller('riskFileUploadCtrl',['$rootScope','$scope', '$http','$stateParams', '$uibModalInstance', '$timeout', function ($rootScope,$scope, $http,$stateParams,$uibModalInstance,$timeout,op, select) {
        $scope.riskfileUpload = function () {
            var fd = new FormData();
            fd.append("file", document.querySelector('input[type=file]').files[0]);
            $.ajax({
                type: "POST",
                url: "yaInfos/excel/import",
                data: fd,
                processData: false,
                //必须false才会自动加上正确的Content-Type
                contentType: false,
                xhr: function () {
                    var xhr = $.ajaxSettings.xhr();
                    if (onprogress && xhr.upload) {
                        xhr.upload.addEventListener("progress", onprogress, false);
                        return xhr;
                    }
                },
                success: function(){
                    $scope.cancel()
                }
            });
            function onprogress(evt) {}
        };
        $scope.cancel = function () {
            $uibModalInstance.close()
        };
        function init() {
            $scope.modal = {
                fileName:'点击选择文件',
                getenterFile:function(file){
                    $timeout(function (){
                        $scope.modal.fileName = file.name;
                    })
                }
            }
        }
        init()
    }]);
  app.controller('emerAlarm',function ($rootScope,$scope,$http ) {
      $scope.xzqyId = '-1';
      // 获取select地区数据
      var getArea = function () {
          $http.get("basicData/listXzqy").then(function (response) {
              $scope.itAreas = response.data;
              console.log($scope.itAreas);
          });
      };

      //查询按钮功能，查询并回显
      $scope.searchInfo = function () {
          $('.loader').show(); //加载查询动态条
          console.log($scope.search.xzqyId)
          $http.post("preplan/listAlarmPreplan?" +"&pageNo=" + $scope.page.currentPage,
            {
                "companyName": $scope.search.companyName,
                "endDate": new Date($scope.search.endDate).getTime(),
                "level": $scope.search.level,
                "recordStatus": $scope.search.recordStatus,
                "strDate": new Date($scope.search.strDate).getTime(),
                "xzqyId": $scope.search.xzqyId,
            }
          ).then(function (data) {
              $('.loader').hide();
              $scope.page.list = data.data;
              $scope.page.totalCount = data.data.totalCount;
              $scope.page.pageSize = data.data.pageSize;
          });
      };

      // 初始化
      function init() {
          $scope.page = {
              url: "preplan/listEnterprisePreplan",
              totalCount: 10,
              currentPage: 1,
              pageSize: 10,
              list: []
          };
          $scope.search = {
              xzqyId: '-1',
              level: '-1',
              recordStatus: '-1',
              strDate: new Date().getFullYear() + '/01/01',
              endDate: new Date().getFullYear() + 1 + '/01/01',
              companyName: ''
          };
          // $scope.getManageDetail();
          getArea();
          $scope.searchInfo();
      }

      // 调用初始化
      init();
  })
  app.controller("emerDetailShCtrl", function ($filter, $rootScope, $scope, $http, $stateParams, mapSet, chartSet) {
    console.log($stateParams.ID)
    //附件名称列表获取
    $scope.getManageDetail = function () {
      $http({
        method: "get",
        url: $scope.page.url,
        params: {
          "pageNo": $scope.page.currentPage,
          "pageSize": $scope.page.pageSize,
          "planId": $stateParams.ID
        }
      }).then(function (response) {
        console.log(response);
        $scope.page.list = response.data;
        $scope.page.total = response.data.totalCount;
        $scope.page.pageSize = response.data.pageSize;
        $scope.page.list.dataList.forEach(function (item) {
          item.URLS = "preplan/downPlanAttachment?attachmentId=" + item.ID;
        });
      });
    };
    //删除按钮
    $scope.deleteTask = function (ID) {
      $("#haha").fadeIn(200);
      $('.tasks-alert').fadeIn(300);
      $scope.textContent = '确定删除吗?删除记录不可恢复！';
      $scope.deleteId = ID;
      console.log($scope.deleteId);
    };
    //删除按钮--确认操作
    $scope.yesAlert = function () {
      $http({
        url: 'preplan/deletePlanAttachment?attachmentId=' + $scope.deleteId,
        method: 'GET',
        transformResponse: function (data) {
          return data;
        }
      }).then(function () {
        $('.tasks-alert').fadeOut(200);
      }).then(function () {
        $('.tasks-alerts').fadeIn(300);
        $scope.getManageDetail();
      });
    };
    //删除按钮--取消操作
    $scope.noAlert = function (text) {
      $("#haha").fadeOut(200);
      $('.tasks-alert').fadeOut(300);
    };
    //保存按钮
    $scope.save = function () {
      if($scope.company.recordStatus==0){
        $scope.company.recordtime=null;
        $scope.company.documentYear=null
      }else {
          $scope.company.documentYear=new Date($scope.company.documentYear).getTime()
      }
      $http.post('preplan/saveOrUpdatePreplan', $scope.company).then(function (req) {
        $("#haha").fadeIn(200);
        $(".task-alert").fadeIn(300);
      });
    };
    //保存按钮--确定操作
    //删除按钮
    $scope.sureAlert = function () {
      $("#haha").fadeOut(200);
      $(".task-alert").fadeOut(300);
      $('.tasks-alerts').hide();
    };
    //初始化
    function init() {
      $scope.page = {
        url: "preplan/listAttachmentByPlan",
        totalCount: 3,
        currentPage: 1,
        pageSize: 10,
        list: []
      };
      $scope.aaa = $stateParams.COMPANYNAME;
      $scope.company = {
            companyId: decodeURIComponent($stateParams.eId),
            id: $stateParams.ID,
            level: $stateParams.LEVEL=='一般'?'1':$stateParams.LEVEL=='较大'?'3':'2',
            recordtime: $stateParams.RECORDTIME==''?new Date():parseInt($stateParams.RECORDTIME),
            underSigned: $stateParams.UNDERSIGNED,
            recordStatus: $stateParams.RECORDSTATUS.toString(),
            documentYear:$stateParams.documentYear==''?new Date():parseInt($stateParams.documentYear),
            preplanTel:$stateParams.preplanTel
      };
        console.log($stateParams.RECORDSTATUS.toString())
      if ($stateParams.ID == null || $stateParams.ID == '') {

      } /*else {
        $http.get('rest/dc/' + $rootScope.userList.access + '/EnterprisePreplan/' + $stateParams.ID)
          .then(function (data) {
            $scope.company = data.data;
            if ($scope.company.recordStatus == null) {
              $scope.company.recordStatus = 0;
            }
            if($scope.company.RISKGRADE=='一般'){
                $scope.company.level = '1'
            }else if($scope.company.RISKGRADE=='较大'){
                $scope.company.level = '3'
            }else if($scope.company.RISKGRADE=='重大'){
                $scope.company.level = '2'
            }
          });
      }*/
      $scope.getManageDetail();
    }

    init();
      console.log($scope.company.level)
  });

  app.controller("emerStatisticsShCtrl", function ($rootScope, $scope, $http, $stateParams, mapSet, chartSet) {
      var fjList = ['应急综合预案','应急专项预案','应急现场处置预案','应急预案备案表','应急预案编制说明','环境风险评估报告',
          '环境应急资源调查报告','环境应急预案评审意见','其他']
      $scope.fjOption = {
          tooltip: {
              trigger: 'item',
              formatter:'{c}'
          },
          xAxis: [{
              type: 'category',
              data: [],
              axisTick: {show: false},
              axisLine: {
                  lineStyle: {color: '#00a3fe'}
              },
              axisLabel: {color: '#fcolor'},
              itemStyle: {
                  normal: {
                      label: {
                          show: true,
                          position: 'top',
                          formatter: function (params) {
                              console.log(params)
                          }　　　//这是关键，在需要的地方加上就行了
                      }
                  }
              },
              data:[]
          }],
          yAxis: [{
              type: 'value',
              name:'企业数',
              splitLine: {show: false},
              axisTick: {show: false},
              axisLine: {
                  lineStyle: {color: '#00a3fe'}
              },
              axisLabel: {color: '#fff'},
              nameTextStyle: {
                  color: '#fff',
                  fontSize: 16
              },
              minInterval: 1
          }],
          series: [{
              data: [],
              type: 'bar',
              barWidth:40
          }]
      }
      function getStatics(){
          $http.post('preplan/getfjStatistics',{xzqyId:$rootScope.userList.xzqyId}).then(function (data) {
              console.log(data.data)
              var arr = []
              fjList.forEach(function (item,index) {
                  $scope.fjOption.xAxis.data=[]
                  data.data.forEach(function (s) {
                      if(s.type == index+1){
                          arr.push({
                              name:item,
                              value:s.typeCount
                          })
                          $scope.fjOption.xAxis[0].data.push(item)
                      }
                  })
              })
              $scope.fjOption.series[0].data = arr
          })
      }
      getStatics()
    $scope.totalChart = {
      color: ['#13860c', '#ccc', '#ff3b31', '#ffa551'],
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        textStyle: {
          color: '#fff'
        }
      },
      grid: {
        show: false,
        left: 40,
        bottom: 30,
        right: 20,
        top: 50
      },
      xAxis: [{
        type: 'category',
        data: [],
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#00a3fe'
          }
        },
        axisLabel: {
          color: '#fcolor'
        }
      }],
      yAxis: [{
        name: '个',
        type: 'value',
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#00a3fe'
          }
        },
        axisLabel: {
          color: '#fff'
        },
        nameTextStyle: {
          color: '#fff',
          fontSize: 16
        },
        minInterval: 1
      }],
      series: [{
          name: '已备案',
          type: 'bar',
          data: []
        },
        {
          name: '未备案',
          type: 'bar',
          data: []
        },
        {
          name: '备案超期',
          type: 'bar',
          data: []
        },
        {
          name: '即将到期',
          type: 'bar',
          data: []
        }
      ]
    };
    var getStatistics = function () {
      $http.get("preplan/countPreplan").then(function (data) {
        $scope.items = data.data;
        console.log($scope.items);
        var xzqyNameList = [];
        var recordedList = [];
        var notOnRecordList = [];
        var expiredList = [];
        var aboutToExpireList = [];
        data.data.forEach(function (item) {
          xzqyNameList.push(item.xzqyName);
          recordedList.push(item.recorded);
          notOnRecordList.push(item.notOnRecord);
          expiredList.push(item.expired);
          aboutToExpireList.push(item.aboutToExpire);
        });
        $scope.totalChart.xAxis[0].data = xzqyNameList;
        $scope.totalChart.series[0].data = recordedList;
        $scope.totalChart.series[1].data = notOnRecordList;
        $scope.totalChart.series[2].data = expiredList;
        $scope.totalChart.series[3].data = aboutToExpireList;
      });
    };

    function init() {
      getStatistics();
      $scope.time = new Date();
    }
    init();
  });

  app.controller("emerSubShCtrl", function ($rootScope, $scope, $http, $stateParams, $uibModal, mapSet, chartSet, FileUploader) {
    $scope.type = "1";
    console.log($stateParams.ID);

    $scope.uploadFile = function () {
      var fd = new FormData();
      var fileValue = document.querySelector('input[type=text]');
      var file = document.querySelector('input[type=file]').files[0];
      //判断文件大小
      if (file.size / 1024 > 20000) {
        $("#haha").fadeIn(200);
        $(".task-alert").fadeIn(300);
        setTimeout(function () {
          $(".task-alert").fadeOut(200);
          $("#haha").fadeOut(300);
        }, 2000);
        fileValue.value = "请重新选择文件！注意大小！";
        return;
      }
      //判断文件格式
        //       // var name = file.name;
        //       // var fileName = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
        //       // if (fileName != "pdf" && fileName != "doc" && fileName != "docx") {
        //       //   $("#haha").fadeIn(200);
        //       //   $(".tasks-alert").fadeIn(300);
        //       //   setTimeout(function () {
        //       //     $(".tasks-alert").fadeOut(200);
        //       //     $("#haha").fadeOut(300);
        //       //   }, 2000);
        //       //   file.value = "";
        //       //   fileValue.value = "请重新选择文件！注意格式！";
        //       //   return;
        //       // }
      fd.append("file", file);
      /**
       * 必须false才会避开jQuery对 formdata 的默认处理
       * XMLHttpRequest会对 formdata 进行正确的处理
       */
      $.ajax({
        type: "POST",
        url: "preplan/addPlanAttachment?planId=" + encodeURIComponent($stateParams.ID) + "&type=" + $scope.type,
        data: fd,
        processData: false,
        //必须false才会自动加上正确的Content-Type
        contentType: false,
        xhr: function () {
          var xhr = $.ajaxSettings.xhr();
          if (onprogress && xhr.upload) {
            xhr.upload.addEventListener("progress", onprogress, false);
            return xhr;
          }
        }
      });
    }
    /**
     * 侦查附件上传情况 ,这个方法大概0.05-0.1秒执行一次
     */
    function onprogress(evt) {
      var loaded = evt.loaded; //已经上传大小情况
      var tot = evt.total; //附件总大小
      var per = Math.floor(100 * loaded / tot); //已经上传的百分比
      $("#number").html(per + "%");
      $("#son").css("width", per + "%");
      if (per == 100) {
        $("#haha").fadeIn(200);
        $(".tasks-alerts").fadeIn(300);
      }
    }
    $scope.closeModal1 = function () {
      $(".task-alert").fadeOut(200);
      $("#haha").fadeOut(230);
    };
    $scope.closeModal2 = function () {
      $(".tasks-alert").fadeOut(200);
      $("#haha").fadeOut(230);
    };
    $scope.closeModal3 = function () {
      $(".tasks-alerts").fadeOut(200);
      $("#haha").fadeOut(230);
    };
  });

});
