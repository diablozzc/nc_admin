/**
 * Created by Administrator on 2016/7/16.
 */
app.controller('EditorarticleCtrl', function ($rootScope,$scope,$state,$stateParams,localStorageService,uiGridConstants,Models,notify,config,ucauth) {

  $scope.column_list = [];
  //栏目
  $scope.column_list = lodash.clone(config.data.states.columnName);
  $scope.column_list.unshift({name: '全部'});
  //类型
  $scope.showType_list=[];
  $scope.showType_list=lodash.clone(config.data.states.showType);
  $scope.user = ucauth.getUser();



  var action = $stateParams.action;
  $scope.action = $stateParams.action;

  $scope.datePicker = {
    date:{startDate: undefined, endDate: undefined},
    closeTime:{startDate: undefined, endDate: undefined}
  };

  var init = function(){
    $scope.the_activity = {};
    $scope.the_activity.province = "410000";
    $scope.the_activity.city = "410300";
    $scope.the_activity.area = '';

    if($scope.user.userTag == 1 && $scope.user.community){
      $scope.the_activity.community = $scope.user.community;
    }

    //$scope.datePicker = {
    //  date:{startDate: undefined, endDate: undefined},
    //  closeTime:{startDate: undefined, endDate: undefined}
    //};
  };

  $scope.upload_param = {pub:'pub',fileType:'activity_poster'};

  switch (action){
    case 'add':
      $scope.form_title = '新增活动';
      init();

      break;
    case 'edit':
      $scope.form_title = '修改活动信息';

      Models.init('Activities/id').actions('get',{'autoId':$stateParams.itemId}).then(
        function(ret){
          $scope.the_activity = ret.data;
          $scope.activityContent = $scope.the_activity.content;

          $scope.datePicker = {
            date:{
              startDate: moment($scope.the_activity.startTime),
              endDate: moment($scope.the_activity.endTime)
            },
            closeTime:{
              startDate: moment($scope.the_activity.closeTime),
              endDate: moment($scope.the_activity.closeTime)
            }
          };
        }
      );
      break;
  }

  $scope.deleteUploadFile = function(index,file){
    var data = {};
    data.fileName = file.fileName;
    data.pub = file.pub;
    data.fileType = file.fileType;

    // Models.init('Upload').actions('delete',data).then(function(ret){
    //
    // });
    $scope.files.splice(index,1);
    $scope.$broadcast('updateResult');
    $scope.saved = false;
  };


  $scope.save = function(keep){
    if($scope.activityForm.$valid){
      switch (action){
        case 'add':

          if(angular.isDate($scope.the_activity.startTime)) {
            $scope.the_activity.startTime = (Date.parse($scope.the_activity.startTime));
          }
          if(angular.isDate($scope.the_activity.endTime)){
            $scope.the_activity.endTime = (Date.parse($scope.the_activity.endTime));
          }
          if(angular.isDate($scope.the_activity.closeTime)){
            $scope.the_activity.closeTime = (Date.parse($scope.the_activity.closeTime));
          }
          $scope.the_activity.property = ucauth.getUser().property;
          //if($scope.the_affiche.type == 1){
          //  $scope.community = '';
          //}
          //
          //

          Models.init('Activities').actions('add',$scope.the_activity).then(function(ret){
            if(ret.meta.code !== 200){
              notify({message:ret.meta.error , classes:'alert-danger'});
            }else{
              notify({message:'添加成功',classes:'alert-success'});
            }

            if(keep){
              init();
            }else{
              $state.go('admin.activities.list');
            }
          });
          break;
        case 'edit':

          if(angular.isDate($scope.the_activity.startTime)) {
            $scope.the_activity.startTime = (Date.parse($scope.the_activity.startTime));
          }
          if(angular.isDate($scope.the_activity.endTime)){
            $scope.the_activity.endTime = (Date.parse($scope.the_activity.endTime));
          }
          if(angular.isDate($scope.the_activity.closeTime)){
            $scope.the_activity.closeTime = (Date.parse($scope.the_activity.closeTime));
          }
          Models.init('Activities/id').actions('update',$scope.the_activity,{'autoId':$scope.the_activity.autoId}).then(
            function(ret){

              if(ret.meta.code == 200){
                notify({message:'修改成功',classes:'alert-success'});
              }else{
                notify({message:ret.meta.error , classes:'alert-danger'});
              }

              if(keep){
                $state.go('admin.activities.add', {action:'add'});
              }else{
                $state.go('admin.activities.list');
              }
            }
          );
          break;
      }

    }

  };

  $scope.close = function(){
    $state.go('admin.activities.list');
  };

  $scope.dateChange = function(){
    $scope.the_activity.startTime = $scope.datePicker.date.startDate.valueOf();
    $scope.the_activity.endTime = $scope.datePicker.date.endDate.valueOf();
    $scope.the_activity.closeTime = $scope.datePicker.closeTime.startDate.valueOf();
  };


  $scope.$on('updateNames',function(e,data){
    if(data[0]){
      $scope.the_activity.provinceName = data[0];
    }
    if(data[1]){
      $scope.the_activity.cityName = data[1];
    }
    if(data[2]){
      $scope.the_activity.areaName = data[2];
    }
  });
});
