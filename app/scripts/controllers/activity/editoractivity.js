'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:EditoractivityCtrl
 * @description
 * # EditoractivityCtrl
 * Controller of the propertyAdminApp
 */


app.controller('EditoractivityCtrl', function ($rootScope, $scope, $state, $stateParams, localStorageService, uiGridConstants, Models, notify, config, ucauth) {

  // 初始化数据
  //$scope.type_list = config.data.states.afficheType;
  //$scope.user_tag_list = config.data.states.userTag;
  //$scope.errorInfo = [];

  //$scope.user = ucauth.getUser();


  var action = $stateParams.action;
  $scope.action = $stateParams.action;

  //console.log(action);
  console.log($stateParams.itemId);

  $scope.datePicker = {
    date: {startDate: undefined, endDate: undefined},
    closeTime: {startDate: undefined, endDate: undefined}
  };

  $scope.upload_param = {pub: 'pub', fileType: 'activity_poster'};

  switch (action) {
    case 'add':
      $scope.form_title = '活动发布';
      // $scope.datePicker = {
      //   closeTime: {
      //     startDate: moment(),
      //     endDate: moment()
      //   }
      // };
      break;
    case 'edit':
      $scope.form_title = '编辑活动';

      Models.init('Activities/autoId').actions('info', {'autoId': $stateParams.itemId}).then(
        function (ret) {
          //console.log($stateParams.itemId);
          $scope.the_activity = ret;
          $scope.activityContent = $scope.the_activity.content;

          $scope.datePicker = {
            date: {
              startDate: moment($scope.the_activity.startTime),
              endDate: moment($scope.the_activity.endTime)
            },
            closeTime: {
              startDate: moment($scope.the_activity.signupEndTime),
              endDate: moment($scope.the_activity.signupEndTime)
            }
          };
          $scope.the_activity.coverUrl = $scope.the_activity.overUrl;
          //var files = [];
          //if($scope.the_activity.imgPoster){
          //  var imgs = $scope.the_activity.imgPoster.split(',');
          //  lodash.forEach(imgs,function(key){
          //    var obj = {};
          //    obj.fileName = key;
          //    obj.uploaded = true;
          //    obj.old = true;
          //    obj.pub = $scope.upload_param.pub;
          //    obj.fileType = $scope.upload_param.fileType;
          //    files.push(obj);
          //  });
          //}
          //$scope.files = files;
        }
      );
      break;
  }

  $scope.deleteUploadFile = function (index, file) {
    var data = {};
    data.fileName = file.fileName;
    data.pub = file.pub;
    data.fileType = file.fileType;

    //删除方法暂时不用
    // Models.init('Files').actions('delete',data).then(function(ret){
    //   if(ret.meta.code == 200){
    //
    //   }
    // });
    $scope.files.splice(index, 1);
    $scope.$broadcast('updateResult');
    $scope.saved = false;
  };


  $scope.save = function (keep) {
    //状态
    if (keep) {
      //保存并发布
      $scope.the_activity.status = 1;
    } else {
      //保存
      $scope.the_activity.status = 0;
    }

    if ($scope.activityForm.$valid) {
      switch (action) {
        case 'add':

          if (angular.isDate($scope.the_activity.startTime)) {
            $scope.the_activity.startTime = (Date.parse($scope.the_activity.startTime));
          }
          if (angular.isDate($scope.the_activity.endTime)) {
            $scope.the_activity.endTime = (Date.parse($scope.the_activity.endTime));
          }
          if (angular.isDate($scope.the_activity.signupEndTime)) {
            $scope.the_activity.signupEndTime = (Date.parse($scope.the_activity.signupEndTime));
          }
          // $scope.the_activity.property = ucauth.getUser().property;
          //if($scope.the_affiche.type == 1){
          //  $scope.community = '';
          //}
          //
          //

           //console.log($scope.the_activity.content);
          Models.init('Activities').actions('add', $scope.the_activity).then(function (ret) {
            notify({message: '添加成功', classes: 'alert-success'});
            if (keep) {
              //保存并发布
              $state.go('admin.activity.list');
            } else {
              //保存
              $state.go('admin.activity.listedit');
            }

          }, function (err) {
            notify({message: err.data.info, classes: 'alert-danger'});
          });
          break;
        case 'edit':

          if (angular.isDate($scope.the_activity.startTime)) {
            $scope.the_activity.startTime = (Date.parse($scope.the_activity.startTime));
          }
          if (angular.isDate($scope.the_activity.endTime)) {
            $scope.the_activity.endTime = (Date.parse($scope.the_activity.endTime));
          }
          if (angular.isDate($scope.the_activity.signupEndTime)) {
            $scope.the_activity.signupEndTime = (Date.parse($scope.the_activity.signupEndTime));
          }
          Models.init('Activities/autoId').actions('update', $scope.the_activity, {'autoId': $scope.the_activity.autoId}).then(
            function (ret) {
              notify({message: '修改成功', classes: 'alert-success'});

              if (keep) {
                //保存并发布
                $state.go('admin.activity.list');
              } else {
                //保存
                $state.go('admin.activity.listedit');
              }
            }, function (err) {
              notify({message: err.data.info, classes: 'alert-danger'});
            }
          );
          break;
      }

    }

  };

  $scope.close = function () {
    $state.go('admin.activity.list');
  };

  $scope.dateChange = function () {
    $scope.the_activity.startTime = angular.isUndefined($scope.datePicker.date.startDate)?null: $scope.datePicker.date.startDate.valueOf();
    $scope.the_activity.endTime = angular.isUndefined($scope.datePicker.date.endDate)?null:$scope.datePicker.date.endDate.valueOf();
    $scope.the_activity.signupEndTime = angular.isUndefined($scope.datePicker.closeTime.startDate)?null:$scope.datePicker.closeTime.startDate.valueOf();
  };



  $scope.$on('updateDate', function (e, value) {
    $scope.the_activity.startTime = angular.isUndefined(value.startDate) ? null : value.startDate.valueOf();
    $scope.the_activity.endTime = angular.isUndefined(value.endDate) ? null : value.endDate.valueOf();
    $scope.the_activity.signupEndTime = angular.isUndefined(value.startDate) ? null : value.startDate.valueOf();
    $scope.the_activity.signupEndTime = angular.isUndefined(value.endDate) ? null : value.endDate.valueOf();
  })
});
