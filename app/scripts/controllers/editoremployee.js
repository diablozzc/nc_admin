'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:EditoremployeeCtrl
 * @description
 * # EditoremployeeCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('EditoremployeeCtrl', function ($rootScope,$scope,$state,$stateParams,Models,config,ucauth,notify) {

    // 初始化数据
    $scope.gender_list = config.data.states.gender;
    $scope.user_tag_list = config.data.states.userTag;
    $scope.errorInfo = [];

    $scope.community_list = [];
    Models.init('Communities').actions('list',{}).then(
      function(ret){
        $scope.community_list = ret.data;
        $scope.community_list.unshift({name:'请选择...'});
      }
    );


    var action = $stateParams.action;
    $scope.action = $stateParams.action;

    var init = function(){
      $scope.the_employee = {};
      $scope.the_employee.gender = true;
      $scope.the_employee.national = '汉族';
      $scope.the_employee.userTag = 1;

    };

    switch (action){
      case 'add':
        $scope.form_title = '新增员工';
        init();

        break;
      case 'edit':
        $scope.form_title = '修改员工信息';

        Models.init('Admins/id').actions('get',{'autoId':$stateParams.itemId}).then(
          function(ret){
            $scope.the_employee = ret.data;
            $scope.form_title = '修改员工 '+ $scope.the_employee.username +' 的信息';
          }
        );
        break;
    }


    $scope.save = function(keep){
      if($scope.employeeForm.$valid){
        switch (action){
          case 'add':
            if(angular.isDate($scope.the_employee.birthday)) {
              $scope.the_employee.birthday = (Date.parse($scope.the_employee.birthday));
            }
            if(angular.isDate($scope.the_employee.joinTime)){
              $scope.the_employee.joinTime = (Date.parse($scope.the_employee.joinTime));
            }
            $scope.the_employee.property = ucauth.getUser().property;

            $scope.the_employee.pwd = md5($scope.the_employee.pwd);
            //
            //
            Models.init('Admins').actions('add',$scope.the_employee).then(function(ret){

              if(ret.meta.code == 200){
                notify({message:'添加成功',classes:'alert-success'});
              }else{
                notify({message:ret.meta.error , classes:'alert-danger'});
              }

              if(keep){
                init();
              }else{
                $state.go('admin.employees.list');
              }
            });
            break;
          case 'edit':
            if(angular.isDate($scope.the_employee.birthday)) {
              $scope.the_employee.birthday = (Date.parse($scope.the_employee.birthday));
            }
            if(angular.isDate($scope.the_employee.joinTime)){
              $scope.the_employee.joinTime = (Date.parse($scope.the_employee.joinTime));
            }
            $scope.the_employee.property = ucauth.getUser().property;
            //
            //

            Models.init('Admins/id').actions('update',$scope.the_employee,{'autoId':$scope.the_employee.autoId}).then(
              function(ret){

                if(ret.meta.code == 200){
                  notify({message:'修改成功',classes:'alert-success'});
                }else{
                  notify({message:ret.meta.error , classes:'alert-danger'});
                }

                if(keep){
                  $state.go('admin.employees.add',{action:'add'});
                }else{
                  $state.go('admin.employees.list');
                }
              }
            );
            break;
        }

      }

    };

    $scope.close = function(){
      $state.go('admin.employees.list');
    };
  });
