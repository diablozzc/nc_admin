'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:RoomgeneratorCtrl
 * @description
 * # RoomgeneratorCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('RoomgeneratorCtrl', function ($rootScope,$scope,$state,$stateParams,localStorageService,Models,ucauth,notify,config) {

    $scope.room_sale_state_list = config.data.states.saleState;
    $scope.room_use_state_list = config.data.states.useState;
    $scope.house_door_model_list = config.data.states.houseDoorModel;
    $scope.building_head_list = config.data.states.buildingHead;
    $scope.unit_list = [];
    $scope.room_list = [];
    $scope.the_building = {};
    $scope.building = {};


    var buildingId = $stateParams.buildingId;
    var action = $stateParams.action;
    $scope.action = $stateParams.action;

    $scope.the_building = localStorageService.get('buildings.entity');

    $scope.building.startFloor = 1;
    $scope.building.endFloor = $scope.the_building.floors;

    for(var i=0;i<$scope.the_building.roomNumber;i++){
      var the_room = {};
      the_room.houseNumber = i+1;
      the_room.houseDoorModel = '三室两厅';
      the_room.houseArea = 100;
      the_room.useArea = 100;
      the_room.buildingHead = '朝南';
      the_room.community = $scope.the_building.community;
      the_room.property = $scope.the_building.property;

      $scope.room_list.push(the_room);
    }


    var ul = lodash.range(1,$scope.the_building.unit+1);
    angular.forEach(ul,function(k){
      $scope.unit_list.push({val:k,name:k+'单元'});
    });

    switch (action){
      case 'generate':
        $scope.form_title = '房间生成器';
        break;
    }

    $scope.save = function(){
      switch (action){
        case 'generate':

          var all = {};
          all.list = [];

          angular.forEach($scope.room_list,function(item){
            var tmp = {};
            tmp.houseNumber = item.houseNumber;
            tmp.houseDoorModel = item.houseDoorModel;
            tmp.houseArea = item.houseArea;
            tmp.useArea = item.useArea;
            tmp.buildingHead = item.buildingHead;
            tmp.community = item.community;
            tmp.property = item.property;
            all.list.push(tmp);
          });

          all.startFloor = $scope.building.startFloor;
          all.endFloor = $scope.building.endFloor;
          all.building = $scope.the_building.code;


          Models.init('Rooms/AutoCreate').actions('create',all).then(function(ret){
            if(ret.meta.code == 200){
              notify({message:'生成完毕',classes:'alert-success'});
            }else{
              notify({message:ret.meta.error , classes:'alert-danger'});
            }
            $state.go('admin.rooms.list');
          });
          break;
      }
    };

    $scope.close = function(){
      $state.go('admin.rooms.list');
    };

  });
