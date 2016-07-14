'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:EditormeterCtrl
 * @description
 * # EditormeterCtrl
 * Controller of the propertyAdminApp
 */

app.controller('EditorbillCtrl', function ($rootScope,$scope,$state,$stateParams,$q,localStorageService,Models,ucauth,notify,config) {

  // 初始化数据
  $scope.community_list = [];
  $scope.building_list = [];
  $scope.unit_list = [];
  $scope.room_list = [];
  $scope.item_list = [];

  // 获取小区列表
  Models.init('Communities').actions('list',{}).then(
    function(ret){
      $scope.community_list = ret.data;
    }
  );

  // 切换小区
  $scope.onCommunityChange = function(val){
    $scope.building_list = [];
    $scope.unit_list = [];
    $scope.room_list = [];
    var deferred = $q.defer();
    var params = {community:val};


    // 获取小区楼宇
    Models.init('Buildings').actions('list',params).then(function(ret){
      if(ret.meta.code == 200){
        $scope.building_list = ret.data;
      }
      deferred.resolve(ret);
    });
    // 获取小区缴费项目
    params = {community:val,billType:1};
    Models.init('Items').actions('list',params).then(function(ret){
      $scope.item_list = ret.data;
    });

    return deferred.promise;

  };
  // 切换楼宇
  $scope.onBuildingChange = function(val){
    $scope.unit_list = [];
    $scope.room_list = [];
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
  $scope.onUnitChange = function(val){
    $scope.room_list = [];
    var params = {building:$scope.current.building.code,unit:val};
    //console.log(params);
    Models.init('Rooms').actions('list',params).then(function(ret){
      if(ret.meta.code == 200){
        //console.log(ret);
        $scope.room_list = ret.data;
      }
    });
  };

  // 切换房间
  $scope.onRoomChange = function(val){
    var index = lodash.findIndex($scope.room_list,{code:val});
    $scope.the_bill.houseNumber = $scope.room_list[index].houseNumber;
  };


  var action = $stateParams.action;
  $scope.action = $stateParams.action;

  var init = function(){
    $scope.the_bill = {};

  };


  switch (action){
    case 'add':
      $scope.form_title = '添加账单';
      init();

      $scope.current = localStorageService.get('current_position') || {};
      $scope.current.building = $scope.current.building || {};

      if(!angular.isUndefined($scope.current.community)){
        $scope.onCommunityChange($scope.current.community);
      }

      if(!angular.isUndefined($scope.current.buildingId)){
        $scope.onBuildingChange($scope.current.buildingId);
      }

      if(!angular.isUndefined($scope.current.unit)){
        $scope.onUnitChange($scope.current.unit);
      }

      break;

  }
  $scope.save = function(keep){
    if($scope.billForm.$valid){
      switch (action){
        case 'add':
          $scope.the_bill.property = ucauth.getUser().property;
          if(angular.isDate($scope.the_bill.period)){
            $scope.the_bill.period = (Date.parse($scope.the_bill.period));
          }


          Models.init('Bills/bill').actions('add',$scope.the_bill).then(function(ret){

            localStorageService.set('current_position',$scope.current);

            if(ret.meta.code == 200){
              notify({message:'添加成功',classes:'alert-success'});
            }else{
              notify({message:ret.meta.error , classes:'alert-danger'});
            }

            if(keep){
              init();
            }else{
              $state.go('admin.payment.bills');
            }
          });
          break;

      }
    }

  };

  $scope.close = function(){
    $state.go('admin.payment.bills');
  };


});
