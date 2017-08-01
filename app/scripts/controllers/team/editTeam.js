app.controller('EditorTeamCtrl', function ($rootScope, $scope, $state, $stateParams, localStorageService, Models, notify, config, ngDialog, ucauth, Upload) {


  $scope.userAdmins = []
  $scope.ucauth = ucauth;
  $scope.flag = {};
  $scope.flag.add_team = false;
  ucauth.hasRole('add_team', $scope.flag);

  var action = $stateParams.action;
  $scope.action = $stateParams.action;

  //初始化
  $scope.init = function () {
    Models.init('Admins/All').actions('get', {}).then(function (ret) {
      $scope.userAdmins = ret;
    }, function (err) {
      notify({message: err.data.info, classes: 'alert-danger'});
    });
  }


  $scope.upload_param = {pub: 'pub', fileType: 'activity_poster'};


  $scope.imageUpload = function (files) {
    // console.log('image upload:', files);

    if (files && files.length) {

      for (var i = 0; i < files.length; i++) {
        Upload.upload({
          // 上传服务器地址
          url: config.global.nc_server + config.global.upload_service,
          sendFieldAs: 'form',
          file: files[i]
        }).success(function (data, status, headers, config) {
          $scope.editor.summernote('insertImage', data.data, function ($image) {
            $image.css('width', '50%');
          });

        });
      }
    }
  };

  $scope.init()

  switch (action) {
    case 'add':
      $scope.form_title = '活动团队新增';
      $scope.the_team = {};
      break;
    case 'edit':
      $scope.form_title = '编辑活动团队';

      Models.init('Teams/autoId').actions('info', {'activityId': $stateParams.itemId}).then(
        function (ret) {
          $scope.the_team = ret;
        }
      );
      break;
  }

  $scope.deleteUploadFile = function (index, file) {
    var data = {};
    data.fileName = file.fileName;
    data.pub = file.pub;
    data.fileType = file.fileType;

    $scope.files.splice(index, 1);
    $scope.$broadcast('updateResult');
    $scope.saved = false;
  };


  $scope.save = function (keep) {
    //状态
    if (keep) {
      //保存并发布
      $scope.the_team.status = 1;
    } else {
      //保存
      $scope.the_team.status = 0;
    }

    if ($scope.activityForm.$valid) {
      Models.init('Teams').actions('add', $scope.the_team).then(function (ret) {
        notify({message: '添加成功', classes: 'alert-success'});
        $state.go('admin.team.list');
      }, function (err) {
        notify({message: err.data.info, classes: 'alert-danger'});
      });
    }

  };

  $scope.close = function () {
    $state.go('admin.team.list');
  };


  //预览
  $scope.previewActivity = function (item) {
    ngDialog.open({
      template: 'previewActivityTpl',
      controller: 'previewActivityWindow',
      width: 375,
      height: 667,
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


app.controller('previewActivityWindow', function ($scope, $rootScope, notify, info, ucauth, config, Models) {


  $scope.prewActivity = info;
  $scope.prewActivity.publishTime = new Date();

  console.log($scope.prewActivity);

  $scope.close = function () {
    $scope.closeThisDialog();
  }
});
