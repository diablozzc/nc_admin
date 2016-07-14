'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:AssignmenusCtrl
 * @description
 * # AssignmenusCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('AssignmenusCtrl', function ($scope, $state, $stateParams, $location, ngTableParams, localStorageService, Models, ngDialog, config, notify, ucauth) {

    $scope.system = 'prop';
    $scope.serverKey = $scope.system + '_server';

    $scope.the_profile = {};
    $scope.profile_title = '';
    $scope.menuGroups = [];
    $scope.saved = true;
    $scope.user = ucauth.getUser();

    //获取菜单组列表
    $scope.getMenuGroupList = function (skey) {
      Models.init('MenuGroups', skey).actions('list', {code:$scope.user.property}).then(function (ret) {
        $scope.menuGroups = ret.data;

        Models.init('UserMenuGroup',$scope.serverKey).actions('get',{username:$scope.the_profile.username}).then(function(ret){
          //console.log(ret);
          $scope.selectedIds = [];
          angular.forEach(ret.data,function(item){
            $scope.selectedIds.push(item.autoId);
          });

          lodash.map($scope.menuGroups,function(item){
            item.isActive = lodash.indexOf($scope.selectedIds,item.autoId) >= 0;
          });


        });


      });
    };

    $scope.selectGroup = function(group){
      group.isActive = !group.isActive;
      $scope.saved = false;
    };

    $scope.save = function(){
      var groups = [];
      angular.forEach($scope.menuGroups,function(group){
        if(group.isActive){
          groups.push(group.autoId);
        }
      });

      var group_str = groups.join(',');
      Models.init('UserMenuGroup',$scope.serverKey).actions('build',{username:$scope.the_profile.username,groups:group_str}).then(function(ret){
        if (ret.meta.code == 200) {
          notify({message: '保存成功', classes: 'alert-success'});
          $scope.saved = true;
        } else {
          notify({message: ret.meta.info, classes: 'alert-danger'});
        }
      });
    };

    $scope.reset = function(){
      $scope.getMenuGroupList($scope.serverKey);
    };


    switch ($scope.system){
      case 'prop':
        $scope.profile_title = '员工信息';
        Models.init('Admins/id').actions('get',{autoId:$stateParams.itemId}).then(function(ret){
          $scope.the_profile = ret.data;

          $scope.getMenuGroupList($scope.serverKey);
        });

        break;
    }

  });
