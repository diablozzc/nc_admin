'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:EditorownerCtrl
 * @description
 * # EditorownerCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('EditorownerCtrl', function ($rootScope,$scope,$state,$stateParams,$q,localStorageService,Models,ucauth,notify,config) {

    // 初始化数据
    $scope.current = {};
    $scope.current.building = {};

    $scope.community_list = [];
    $scope.building_list = [];
    $scope.unit_list = [];
    $scope.room_list = [];

    $scope.gender_list = config.data.states.gender;
    $scope.owner_type_list = config.data.states.ownerType;

    // 获取小区列表
    Models.init('Communities').actions('list',{}).then(
      function(ret){
        $scope.community_list = ret.data;
      }
    );
    // 切换小区
    $scope.onCommunityChange = function(val,refresh){
      $scope.building_list = [];
      $scope.unit_list = [];
      $scope.room_list = [];

      if(angular.isUndefined(refresh)) refresh = true;

      if(refresh){
        $scope.current.buildingId = undefined;
        $scope.current.unit = undefined;
        $scope.the_owner.room = undefined;
      }

      var deferred = $q.defer();
      var params = {community:val};
      Models.init('Buildings').actions('list',params).then(function(ret){
        if(ret.meta.code == 200){
          $scope.building_list = ret.data;
        }
        deferred.resolve(ret);
      });
      return deferred.promise;

    };
    // 切换楼宇
    $scope.onBuildingChange = function(val,refresh){
      $scope.unit_list = [];
      $scope.room_list = [];

      if(angular.isUndefined(refresh)) refresh = true;

      if(refresh){
        $scope.current.unit = undefined;
        $scope.the_owner.room = undefined;
      }

      var deferred = $q.defer();
      Models.init('Buildings/id').actions('get',{},{autoId:val}).then(function(ret){
        if(ret.meta.code == 200){
          $scope.current.building = ret.data;
          $scope.createUnitList($scope.current.building.unit);
        }
        deferred.resolve(ret);
      });
      return deferred.promise;
    };
    // 构建单元list
    $scope.createUnitList = function(val){
      //$scope.unit_list = [];
      var ul = lodash.range(1,val+1);
      angular.forEach(ul,function(k){
        $scope.unit_list.push({val:k,name:k+'单元'});
      });
    };

    // 切换单元
    $scope.onUnitChange = function(val,refresh){
      $scope.room_list = [];

      if(angular.isUndefined(refresh)) refresh = true;

      if(refresh){
        $scope.the_owner.room = undefined;
      }

      var params = {building:$scope.current.building.code,unit:val};
      Models.init('Rooms').actions('list',params).then(function(ret){
        if(ret.meta.code == 200){
          $scope.room_list = ret.data;
        }
      });
    };

    // 切换房间
    $scope.onRoomChange = function(val){
      //console.log($scope.current);
    };

    var action = $stateParams.action;
    $scope.action = $stateParams.action;


    switch (action){
      case 'add':
        $scope.form_title = '新增住户';
        $scope.the_owner = {};
        $scope.the_owner.gender = true;
        $scope.the_owner.ownerType = $stateParams.ownerType ? $stateParams.ownerType - 0 : 0;
        $scope.the_owner.national = '汉族';

        //if($stateParams.roomId){
        //  Models.init('Rooms/id').actions('get',{},{'autoId':$stateParams.roomId}).then(function(ret){


        $scope.the_room = localStorageService.get('rooms.entity');

        //$scope.current.community = $scope.the_room.community;
        //$scope.current.buildingId = $scope.the_room.buildingId;
        //$scope.current.building.code = $scope.the_room.building;
        //$scope.current.unit = $scope.the_room.unit;
        $scope.the_owner.room = $scope.the_room.code;

        //$scope.onCommunityChange($scope.current.community,false).then(function(){
        //  $scope.onBuildingChange($scope.current.buildingId,false).then(function(){
        //    $scope.onUnitChange($scope.current.unit,false);
        //  });
        //});


        //  });
        //}

        break;
      case 'edit':
        $scope.form_title = '修改住户信息';

        Models.init('Owners/id').actions('get',{},{'autoId':$stateParams.itemId}).then(
          function(ret){
            $scope.the_room.communityName = ret.data.communityName;
            $scope.the_room.buildingName = ret.data.buildingName;
            $scope.the_room.unitName = ret.data.unit+'单元';
            $scope.the_room.houseNumber = ret.data.houseNumber+'室';


            $scope.the_owner = ret.data;

            //$scope.current.community = $scope.the_owner.community;
            //$scope.current.buildingId = $scope.the_owner.buildingId;
            //$scope.current.building.code = $scope.the_owner.building;
            //$scope.current.unit = $scope.the_owner.unit;

            //$scope.onCommunityChange($scope.current.community,false).then(function(){
            //  $scope.onBuildingChange($scope.current.buildingId,false).then(function(){
            //    $scope.onUnitChange($scope.current.unit,false);
            //  });
            //});
          }
        );
        break;
    }

    $scope.save = function(){
      switch (action){
        case 'add':
          if(angular.isDate($scope.the_owner.birthday)) {
            $scope.the_owner.birthday = (Date.parse($scope.the_owner.birthday));
          }
          if(angular.isDate($scope.the_owner.checkInTime)){
            $scope.the_owner.checkInTime = (Date.parse($scope.the_owner.checkInTime));
          }

          Models.init('Owners').actions('add',$scope.the_owner).then(function(ret){

            if(ret.meta.code == 200){
              notify({message:'添加成功',classes:'alert-success'});
            }else{
              notify({message:ret.meta.error , classes:'alert-danger'});
            }

            $rootScope.$broadcast('onUpdateTreeNode',$scope.the_room);
            $scope.gotoList();


          });
          break;
        case 'edit':
          if(angular.isDate($scope.the_owner.birthday)){
            $scope.the_owner.birthday = (Date.parse($scope.the_owner.birthday));
          }
          if(angular.isDate($scope.the_owner.checkInTime)){
            $scope.the_owner.checkInTime = (Date.parse($scope.the_owner.checkInTime));
          }
          Models.init('Owners/id').actions('update',$scope.the_owner,{'autoId':$scope.the_owner.autoId}).then(function(ret){

            if(ret.meta.code == 200){
              notify({message:'修改成功',classes:'alert-success'});
            }else{
              notify({message:ret.meta.error , classes:'alert-danger'});
            }
            $rootScope.$broadcast('onUpdateTreeNode',$scope.the_room);
            $scope.gotoList();
          });
          break;
      }

    };

    $scope.gotoList = function(){
      $state.go('admin.tenement.list');
    };

    $scope.close = function(){
      $scope.gotoList();
    };

    $scope.$on('selectRoom',function(e,item){
      localStorageService.set('rooms.entity',item);


      if(action == 'add'){
        $scope.the_room = item;

        //$scope.current.community = item.community;
        //$scope.current.buildingId = item.buildingId;
        //$scope.current.building.code = item.building;
        //$scope.current.unit = item.unit;

        $scope.the_owner.room = item.code;

        //$scope.onCommunityChange($scope.current.community,false).then(function(){
        //  $scope.onBuildingChange($scope.current.buildingId,false).then(function(){
        //    $scope.onUnitChange($scope.current.unit,false);
        //  });
        //});
      }else if(action == 'edit'){
        $scope.gotoList();
      }

    });
    $scope.$on('selectCommunity',function(e,data){
      $scope.gotoList();
    });
    $scope.$on('selectBuilding',function(e,data){
      $scope.gotoList();
    });
    $scope.$on('selectUnit',function(e,data){
      $scope.gotoList();
    });

  });
