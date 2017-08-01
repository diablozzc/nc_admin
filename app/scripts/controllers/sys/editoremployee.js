'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:EditoremployeeCtrl
 * @description
 * # EditoremployeeCtrl
 * Controller of the propertyAdminApp
 */

app.controller('EditoremployeeCtrl', function ($rootScope, $scope, $state, $stateParams, Models, config, ucauth, notify) {

  // 初始化数据
  $scope.gender_list = config.data.states.gender;
  $scope.user_tag_list = config.data.states.userTag;
  $scope.errorInfo = [];
  $scope.userRoles = config.data.states.userRoles;

  var action = $stateParams.action;
  $scope.action = $stateParams.action;
  $scope.isEdit = false
  var init = function () {
    $scope.the_employee = {};
    $scope.the_employee.gender = true;
    $scope.the_employee.national = '汉族';
    $scope.the_employee.userTag = 1;
    $scope.the_employee.userRole = 'supper'
    $scope.isEdit = false
  };

  switch (action) {
    case 'add':
      $scope.form_title = '新增员工';
      init();
      break;
    case 'edit':
      $scope.form_title = '修改员工信息';
      $scope.isEdit = true
      Models.init('Admins/AutoId').actions('get', {'autoId': $stateParams.itemId}).then(
        function (ret) {
          $scope.the_employee = ret;
          $scope.form_title = '修改员工 ' + $scope.the_employee.username + ' 的信息';
        }
      );
      break;
  }


  $scope.save = function (keep) {
    if ($scope.employeeForm.$valid) {
      switch (action) {
        case 'add':

          Models.init('Admins').actions('add', $scope.the_employee).then(function (ret) {
              notify({message: '添加成功', classes: 'alert-success'});
              $state.go('admin.sys.account');
            },
            function (err) {

              console.log(err);
              notify({message: err.data.info, classes: 'alert-danger'});
              if (keep) {
                init();
              }
            }
          );
          break;
        case
        'edit':
          Models.init('Admins/AutoId').actions('update', $scope.the_employee, {'autoId': $scope.the_employee.autoId}).then(
            function (ret) {
              notify({message: '修改成功', classes: 'alert-success'});
              $state.go('admin.sys.account');
            }, function (err) {
              notify({message: err.data.info, classes: 'alert-danger'});
              if (keep) {
                $state.go('admin.sys.add', {action: 'add'});
              }
            }
          );
          break;
      }

    }

  }
  ;

  $scope.close = function () {
    $state.go('admin.sys.account');
  };
})
;
