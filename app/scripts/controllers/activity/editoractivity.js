'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:EditoractivityCtrl
 * @description
 * # EditoractivityCtrl
 * Controller of the propertyAdminApp
 */


app.controller('EditoractivityCtrl', function ($rootScope, $scope, $state, $stateParams, localStorageService , Models, notify, config, ngDialog, ucauth, Upload) {

  // 初始化数据
  //$scope.type_list = config.data.states.afficheType;
  //$scope.user_tag_list = config.data.states.userTag;
  //$scope.errorInfo = [];

  $scope.ucauth = ucauth;
  $scope.flag = {};
  $scope.flag.add_activity = false;
  ucauth.hasRole('add_activity', $scope.flag);

  var action = $stateParams.action;
  $scope.action = $stateParams.action;


  $scope.datePicker = {
    startTime: {startDate: undefined, endDate: undefined},
    endTime: {startDate: undefined, endDate: undefined},
    signupStartTime: {startDate: undefined, endDate: undefined},
    signupEndTime: {startDate: undefined, endDate: undefined},
  };


  var today = (new Date(moment().get('year'),moment().get('month'),moment().get('date')));
  $scope.minDate = moment(today);

  $scope.summernote_conf = {
    height:300,
    placeholder: '活动内容'
  };

  $scope.upload_param = {pub: 'pub', fileType: 'activity_poster'};


  $scope.imageUpload = function(files) {
    // console.log('image upload:', files);

    if (files && files.length) {

      for (var i = 0; i < files.length; i++) {
        Upload.upload({
          // 上传服务器地址
          url: config.global.nc_server + config.global.upload_service,
          sendFieldAs: 'form',
          file: files[i]
        }).success(function(data, status, headers, config){
          $scope.editor.summernote('insertImage', data.data, function ($image) {
            $image.css('width', '50%');
          });

        });
      }
    }
  };

  switch (action) {
    case 'add':
      $scope.form_title = '活动发布';
      $scope.the_activity = {};
      break;
    case 'edit':
      $scope.form_title = '编辑活动';

      Models.init('Activities/autoId').actions('info', {'autoId': $stateParams.itemId}).then(
        function (ret) {
          //console.log($stateParams.itemId);
          $scope.the_activity = ret;
          $scope.activityContent = $scope.the_activity.content;

          $scope.datePicker = {
            startTime: {
              startDate: moment($scope.the_activity.startTime),
              endDate: undefined
            },
            endTime: {
              startDate: moment($scope.the_activity.endTime),
              endDate: undefined
            },
            signupStartTime: {
              startDate: moment($scope.the_activity.signupStartTime),
              endDate: undefined
            },
            signupEndTime: {
              startDate: moment($scope.the_activity.signupEndTime),
              endDate: undefined
            },

          };
          $scope.the_activity.coverUrl = $scope.the_activity.overUrl;

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
          if (angular.isDate($scope.the_activity.signupStartTime)) {
            $scope.the_activity.signupStartTime = (Date.parse($scope.the_activity.signupStartTime));
          }
          if (angular.isDate($scope.the_activity.signupEndTime)) {
            $scope.the_activity.signupEndTime = (Date.parse($scope.the_activity.signupEndTime));
          }


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
          if (angular.isDate($scope.the_activity.signupStartTime)) {
            $scope.the_activity.signupStartTime = (Date.parse($scope.the_activity.signupStartTime));
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

  $scope.dateChange = function (value) {
    $scope.the_activity.startTime = angular.isUndefined($scope.datePicker.startTime.startDate)? null: $scope.datePicker.startTime.startDate.valueOf();
    $scope.the_activity.endTime = angular.isUndefined($scope.datePicker.endTime.startDate)?null:$scope.datePicker.endTime.startDate.valueOf();
    $scope.the_activity.signupStartTime = angular.isUndefined($scope.datePicker.signupStartTime.startDate)?null:$scope.datePicker.signupStartTime.startDate.valueOf();
    $scope.the_activity.signupEndTime = angular.isUndefined($scope.datePicker.signupEndTime.startDate)?null:$scope.datePicker.signupEndTime.startDate.valueOf();
  };


  //预览
  $scope.previewActivity = function (item) {
    ngDialog.open({
      template: 'previewActivityTpl',
      controller: 'previewActivityWindow',
      width:375,
      height:667,
      resolve: {
        info: function paymentInfoFactory() {
          var info = item;
          //info.autoId = item.autoId;
          //info.content=
          // info.selectedItems = selectedItem;
          // info.totalPaymentAmt = total_payment_amt;
          //console.log(info);
          return info;
        }

      },
      preCloseCallback: function (value) {
        //$scope.tableParams.reload();
        //$scope.getPageList();
        //$scope.updateGrid();

      }
    });
  };

});


app.controller('previewActivityWindow', function ($scope, $rootScope, notify,info, ucauth, config, Models) {


  $scope.prewActivity=info;
  $scope.prewActivity.publishTime=new Date();

  console.log($scope.prewActivity);

  $scope.close = function () {
    $scope.closeThisDialog();
  }
});
