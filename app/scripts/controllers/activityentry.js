'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:ActivityentryCtrl
 * @description
 * # ActivityentryCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('ActivityentryCtrl', function ($rootScope,$scope,$state,$stateParams,$interval,localStorageService,ngTableParams,Models,notify,ucauth) {

    $scope.ucauth = ucauth;
    $scope.flag = {};
    $scope.flag.edit_activity = false;
    $scope.flag.confirm_join_activity = false;

    ucauth.hasRole('edit_activity',$scope.flag);
    ucauth.hasRole('confirm_join_activity',$scope.flag);

    $scope.key = 'activities_entry';
    $scope.the_activity = {};
    $scope.the_search = {};
    $scope.the_activity_entry_list = [];

    // 上传参数
    $scope.upload_param = {pub:'pub',fileType:'activity_poster'};

    // 获取活动信息
    Models.init('Activities/id').actions('get',{autoId:$stateParams.itemId}).then(function(ret){
      $scope.the_activity = ret.data;
      $scope.activitySummary = $scope.the_activity.activitySummary;

      var files = [];
      if($scope.the_activity.activityImg){
        var imgs = $scope.the_activity.activityImg.split(',');
        lodash.forEach(imgs,function(key){
          var obj = {};
          obj.fileName = key;
          obj.uploaded = true;
          obj.pub = $scope.upload_param.pub;
          obj.fileType = $scope.upload_param.fileType;
          files.push(obj);
        });
      }

      $scope.files = files;
      $scope.getPageList();
    });



    // 获取分页数据
    $scope.getPageList = function(){

      $scope.the_params = angular.extend({
        page: 1,
        count: 10,
        sorting: {
          autoId: 'desc'     // initial sorting
        }
      },{});

      $scope.tableParams = new ngTableParams($scope.the_params, {
        total: 0,           // length of data
        //counts: [],
        getData: function ($defer, params) {

          //$location.search(params.url());

          //var the_param = {page: true, pageSize: params.count(), pageIndex: params.page()};
          var the_param = {activity:$stateParams.itemId};

          the_param = angular.extend(the_param,$scope.the_search);

          // 排序
          var the_sorting = params.sorting();
          var keys = lodash.keys(the_sorting);
          var values = lodash.values(the_sorting);
          if(angular.isDefined(keys[0])){
            var sort_param = keys[0] + ':' + values[0];
            //the_param = angular.extend(the_param,{sorting:sort_param});
            the_param.sorting = sort_param;
          }

          $scope.activitiesDetailsPromise = Models.init('ActivityDetails').actions('list', the_param).then(function (ret) {
            console.log(ret);
            if (ret.meta.code == 200 && ret.data) {
              $scope.the_activity_entry_list = ret.data;
              params.total(ret.data.length);
              $defer.resolve(ret.data);
            }
          });
        }
      });


    };


    // 确认报名
    $scope.confirm = function(item){
      if(window.confirm("确认 "+ item.username + " 报名吗?")){
        Models.init('ActivityDetails/id').actions('confirm',{tag:1},{'autoId':item.autoId}).then(function(ret){
          if(ret.meta.code == 200){
            notify({message:'报名已确认',classes:'alert-success'});
            $scope.tableParams.reload();
          }else{
            notify({message:ret.meta.error + " " + ret.meta.info , classes:'alert-danger'});
          }
        });
      }
    };


    // 编辑活动总结
    $scope.editSummary = function(){
      $scope.is_edit_summary = true;
    };

    // 保存活动总结
    $scope.saveSummary = function(){
      var data = {activitySummary:$scope.the_activity.activitySummary};
      Models.init('Activities/id').actions('update',data,{autoId:$stateParams.itemId}).then(function(ret){
        if(ret.meta.code == 200){
          notify({message:'更新成功',classes:'alert-success'});


          Models.init('Activities/id').actions('get',{autoId:$stateParams.itemId}).then(function(ret){
            $scope.the_activity = ret.data;
            $scope.activitySummary = $scope.the_activity.activitySummary;

          });


        }
        $scope.is_edit_summary = false;
      });
    };

    // 删除上传文件
    $scope.deleteUploadFile = function(index,file){
      var data = {};
      data.fileName = file.fileName;
      data.pub = file.pub;
      data.fileType = file.fileType;

      Models.init('Files').actions('delete',data).then(function(ret){
        if(ret.meta.code == 200){

        }
      });
      $scope.files.splice(index,1);
      $scope.saved = false;
    };


    // 保存状态
    $scope.saved = true;

    $scope.$on('changeSaved',function(){
      $scope.saved = false;
    });

    var stopTime;

    stopTime = $interval(function(){
      if($scope.saved){
        return true;
      }else{
        $scope.saveActivityImage();
      }
    },500);

    // 保存活动图片
    $scope.saveActivityImage = function(){
      var tmp = [];
      lodash.forEach($scope.files,function(key){
        if(key.uploaded && key.fileName){
          tmp.push(key.fileName);
        }
      });
      var data = {};

      data.activityImg = tmp.join(',');
      Models.init('Activities/id').actions('update',data,{autoId:$stateParams.itemId}).then(function(ret){
        if(ret.meta.code == 200){
          notify({message:'保存成功',classes:'alert-success'});
          $scope.saved = true;
        }
      });
    };




  });
