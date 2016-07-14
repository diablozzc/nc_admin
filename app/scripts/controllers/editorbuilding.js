'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:EditorbuildingCtrl
 * @description
 * # EditorbuildingCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('EditorbuildingCtrl', function ($rootScope,$scope,$state,$stateParams,Models,ucauth,notify) {

    $scope.community_list = [];
    Models.init('Communities').actions('list',{}).then(
      function(ret){
        $scope.community_list = ret.data;
        $scope.community_list.unshift({name:'请选择...'});
      }
    );

    var action = $stateParams.action;

    switch (action){
      case 'add':
        $scope.form_title = '新增楼宇';
        $scope.the_building = {};
        $scope.the_building.unit = 1;
        $scope.the_building.floors = 1;
        $scope.the_building.roomNumber = 1;
        break;
      case 'edit':
        $scope.form_title = '修改楼宇';
        Models.init('Buildings/id').actions('get',{},{'autoId':$stateParams.itemId}).then(
          function(ret){
            $scope.the_building = ret.data;
          }
        );
        break;
    }

    $scope.save = function(){
      switch (action){
        case 'add':
          //var user = ucauth.getUser();
          $scope.the_building.property = ucauth.getUser().property;
          Models.init('Buildings').actions('add',$scope.the_building).then(function(ret){

            if(ret.meta.code == 200){
              notify({message:'添加成功',classes:'alert-success'});
            }else{
              notify({message:ret.meta.error , classes:'alert-danger'});
            }

            $state.go('admin.buildings.list');
          });
          break;
        case 'edit':
          Models.init('Buildings/id').actions('update',$scope.the_building,{'autoId':$scope.the_building.autoId}).then(
            function(ret){

              if(ret.meta.code == 200){
                notify({message:'修改成功',classes:'alert-success'});
              }else{
                notify({message:ret.meta.error , classes:'alert-danger'});
              }

              $state.go('admin.buildings.list');
            }
          );
          break;
      }
    };

    $scope.close = function(){
      $state.go('admin.buildings.list');
    };

  });
