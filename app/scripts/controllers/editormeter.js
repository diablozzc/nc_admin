'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:EditormeterCtrl
 * @description
 * # EditormeterCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('EditormeterCtrl', function ($rootScope,$scope,$state,$stateParams,$q,localStorageService,Models,ucauth,notify,config) {


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

    $scope.minDate = moment(0);
    $scope.maxDate = moment();
    $scope.meterReadDate = {};


    // 切换小区
    $scope.onCommunityChange = function(val,refresh){
      $scope.building_list = [];
      $scope.unit_list = [];
      $scope.room_list = [];

      if(angular.isUndefined(refresh)) refresh = true;

      if(refresh){
        $scope.current.buildingId = undefined;
        $scope.current.unit = undefined;
        $scope.the_meter.room = undefined;
      }

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
      params = {community:val,category:1};
      Models.init('Items').actions('list',params).then(function(ret){
        $scope.item_list = ret.data;
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
        $scope.the_meter.room = undefined;
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
        $scope.the_meter.room = undefined;
      }

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
      $scope.the_meter.item = undefined;
    };

    // 切换缴费项目
    $scope.onItemChange = function(val){
      var params = {room:$scope.the_meter.room,item:val};
      Models.init('Meters/last').actions('get',params).then(function(ret){
        if(!angular.isUndefined(ret.data)){
          $scope.the_meter.lastReadDate = ret.data.meterReadDate;
          $scope.the_meter.lastMeter = ret.data.autoId;
          $scope.the_meter.lastTimeRead = ret.data.thisTimeRead;
        }else{
          $scope.the_meter.lastReadDate = 0;
          $scope.the_meter.lastMeter = 0;
          $scope.the_meter.lastTimeRead = 0;
        }

        $scope.minDate = moment($scope.the_meter.lastReadDate);
      });
    };

    var action = $stateParams.action;
    $scope.action = $stateParams.action;

    var init = function(){
      $scope.the_meter = {};
      $scope.the_meter.lastReadDate = 0;
      $scope.the_meter.lastMeter = 0;
      $scope.the_meter.lastTimeRead = 0;
    };


    switch (action){
      case 'add':
        $scope.form_title = '新增抄表信息';
        init();

        $scope.current = localStorageService.get('current_position') || {};
        $scope.current.building = $scope.current.building || {};

        if(!angular.isUndefined($scope.current.community)){
          $scope.onCommunityChange($scope.current.community,false).then(function(ret){
            //console.log(ret);
            if(!angular.isUndefined($scope.current.buildingId)){
              $scope.onBuildingChange($scope.current.buildingId,false);
            }

          });
        }

        if(!angular.isUndefined($scope.current.unit)){
          $scope.onUnitChange($scope.current.unit,false);
        }


        break;
      case 'edit':
        $scope.form_title = '修改抄表信息';

        $scope.current = {};
        $scope.current.building = {};

        Models.init('Meters/id').actions('get',{},{'autoId':$stateParams.itemId}).then(
          function(ret){
            $scope.the_meter = ret.data;


            //$scope.meterReadDate = {
            //  startDate:null,
            //  endDate:null
            //};

            $scope.meterReadDate.startDate = moment($scope.the_meter.meterReadDate);

            $scope.current.community = $scope.the_meter.community;
            $scope.current.buildingId = $scope.the_meter.buildingId;
            $scope.current.building.code = $scope.the_meter.building;
            $scope.current.unit = $scope.the_meter.unit;

            $scope.onCommunityChange($scope.current.community,false);
            $scope.onBuildingChange($scope.current.buildingId,false);
            $scope.onUnitChange($scope.current.unit,false);

          }
        );
        break;
    }

    $scope.save = function(keep){
      if($scope.meterForm.$valid){
        switch (action){
          case 'add':

            //console.log($scope.meterReadDate);
            $scope.the_meter.meterReadDate = $scope.meterReadDate.startDate.valueOf();
            $scope.the_meter.community = $scope.current.community;

            //console.log($scope.the_meter);

            Models.init('Meters').actions('add',$scope.the_meter).then(function(ret){

              localStorageService.set('current_position',$scope.current);

              if(ret.meta.code == 200){
                notify({message:'添加成功',classes:'alert-success'});
              }else{
                notify({message:ret.meta.error , classes:'alert-danger'});
              }

              if(keep){
                init();
              }else{
                $state.go('admin.payment.meters');
              }
            });
            break;
          case 'edit':
            $scope.the_meter.meterReadDate = $scope.meterReadDate.startDate.valueOf();


            Models.init('Meters/id').actions('update',$scope.the_meter,{'autoId':$scope.the_meter.autoId}).then(
              function(ret){

                if(ret.meta.code == 200){
                  notify({message:'修改成功',classes:'alert-success'});
                }else{
                  notify({message:ret.meta.error , classes:'alert-danger'});
                }


                if(keep){
                  $state.go('admin.payment.addmeter',{action:'add'});
                }else{
                  $state.go('admin.payment.meters');
                }
              }
            );
            break;
        }
      }


    };

    $scope.close = function(){
      $state.go('admin.payment.meters');
    };

    $scope.$on('updateDate',function(e,data){
      $scope.meterReadDate = data;
    });

    $scope.$watch('minDate',function(data){
      var updateData = {};
      updateData.id = 'meter_read_date';
      updateData.option = 'minDate';
      updateData.value = data;
      $scope.$broadcast('updateOptions',updateData);
    });


  });
