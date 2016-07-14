'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:EditorroomCtrl
 * @description
 * # EditorroomCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('EditorroomCtrl', function ($rootScope,$scope,$state,$stateParams,$q,localStorageService,Models,ucauth,notify,config) {

    $scope.room_sale_state_list = config.data.states.saleState;
    $scope.room_use_state_list = config.data.states.useState;
    $scope.house_door_model_list = config.data.states.houseDoorModel;
    $scope.building_head_list = config.data.states.buildingHead;

    $scope.the_building = {};

    $scope.community_list = [];
    $scope.building_list = [];
    $scope.unit_list = [];

    var buildingId = $stateParams.buildingId;
    var action = $stateParams.action;
    $scope.action = $stateParams.action;

    // 获取选择的楼宇参数
    $scope.the_building = localStorageService.get('buildings.entity');
    //console.log($scope.the_building);


    // 获取小区楼宇列表
    Models.init('Communities').actions('list',{}).then(
      function(ret){
        $scope.community_list = ret.data;
        $scope.onCommunityChange($scope.the_building.community,false);
      }
    );

    // 切换小区
    $scope.onCommunityChange = function(val,refresh){
      if(angular.isUndefined(refresh)) refresh = true;
      if(refresh){
        //$scope.the_building = {};
        $scope.building_list = [];
        $scope.unit_list = [];

      }

      var deferred = $q.defer();
      var params = {community:val};
      Models.init('Buildings').actions('list',params).then(function(ret){
        if(ret.meta.code == 200){
          $scope.building_list = ret.data;
          if(refresh){
            $scope.the_building = $scope.building_list[0];
          }
          $scope.createUnitList($scope.the_building.unit);

          if(angular.isDefined($scope.the_building.current_unit)){
            $scope.the_room.unit = $scope.the_building.current_unit;
          }

        }
        deferred.resolve(ret);
      });
      return deferred.promise;

    };
    // 切换楼宇
    $scope.onBuildingChange = function(val,refresh){
      $scope.unit_list = [];

      var deferred = $q.defer();
      var building_index = lodash.findIndex($scope.building_list,'code',val);
      $scope.the_building = $scope.building_list[building_index];
      $scope.createUnitList($scope.the_building.unit);
      deferred.resolve($scope.the_building);

      return deferred.promise;
    };
    // 构建单元list
    $scope.createUnitList = function(val){
      $scope.unit_list = [];
      var ul = lodash.range(1,val+1);
      angular.forEach(ul,function(k){
        $scope.unit_list.push({val:k,name:k+'单元'});
      });
    };

    switch (action){
      case 'add':
        $scope.form_title = '新增房间';
        $scope.the_room = {};
        $scope.the_room.saleStateCode = 0;
        $scope.the_room.useStateCode = 0;
        $scope.the_room.houseDoorModel = "三室两厅";
        $scope.the_room.buildingHead = "朝南";
        $scope.the_room.unit = 1;

        break;
      case 'edit':
        $scope.form_title = '修改房间';

        Models.init('Rooms/id').actions('get',{},{'autoId':$stateParams.roomId}).then(
          function(ret){
            $scope.the_room = ret.data;
          }
        );
        break;
    }

    $scope.save = function(){
      switch (action){
        case 'add':
          $scope.the_room.property = ucauth.getUser().property;
          $scope.the_room.building = $scope.the_building.code;
          $scope.the_room.community = $scope.the_building.community;
          $scope.the_room.saleState = config.data.states.saleState[lodash.findIndex($scope.room_sale_state_list,{'val':$scope.the_room.saleStateCode})].name;
          $scope.the_room.useState = config.data.states.useState[lodash.findIndex($scope.room_use_state_list,{'val':$scope.the_room.useStateCode})].name;

          Models.init('Rooms').actions('add',$scope.the_room).then(function(ret){
            if(ret.meta.code == 200){
              notify({message:'添加成功',classes:'alert-success'});
            }else{
              notify({message:ret.meta.error , classes:'alert-danger'});
            }
            $state.go('admin.rooms.list');
          });
          break;
        case 'edit':
          Models.init('Rooms/id').actions('update',$scope.the_room,{'autoId':$scope.the_room.autoId}).then(
            function(ret){
              if(ret.meta.code == 200){
                notify({message:'修改成功',classes:'alert-success'});
              }else{
                notify({message:ret.meta.error , classes:'alert-danger'});
              }
              $state.go('admin.rooms.list');
            }
          );
          break;
      }

    };

    $scope.close = function(){
      $state.go('admin.rooms.list');
    };
    $scope.$on('selectCommunity',function(e,data){
      $scope.onCommunityChange(data.code);
      $scope.the_room.unit = 1;
    });
    $scope.$on('selectBuilding',function(e,data){
      $scope.the_building = data;
      $scope.onCommunityChange($scope.the_building.community,false);
      $scope.the_room.unit = 1;
    });
    $scope.$on('selectUnit',function(e,data){
      $scope.the_building = data.building_data;
      $scope.onCommunityChange($scope.the_building.community,false);
      $scope.the_room.unit = data.unit;

    });

  });
