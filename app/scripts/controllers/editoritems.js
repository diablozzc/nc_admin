'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:EditoritemsCtrl
 * @description
 * # EditoritemsCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('EditoritemsCtrl', function ($rootScope,$scope,$state,$stateParams,$q,localStorageService,Models,ucauth,notify,config) {

    $scope.community_list = [];
    $scope.charge_type_list = config.data.states.chargeType;
    $scope.rate_type_list = config.data.states.rateType;
    $scope.bill_type_list = config.data.states.billType;
    $scope.pre_payment_list = config.data.states.prePayment;

    // 获取小区列表
    Models.init('Communities').actions('list',{}).then(
      function(ret){
        $scope.community_list = ret.data;
      }
    );


    $scope.onChangeChargeType = function(val){
      if(val !== 1){
        $scope.the_item.rateType = 1;
      }
    };

    var action = $stateParams.action;
    $scope.action = $stateParams.action;


    switch (action){
      case 'add':
        $scope.form_title = '新增缴费项目';
        $scope.the_item = {};
        $scope.the_item.category = 0;
        $scope.the_item.rateType = 1;
        $scope.the_item.billType = 0;
        $scope.the_item.months = 1;
        $scope.the_item.prePayment = false;
        //$scope.the_owner.gender = true;
        //$scope.the_owner.ownerType = 0;
        //$scope.the_owner.national = '汉族';

        break;
      case 'edit':
        $scope.form_title = '编辑缴费项目';

        Models.init('Items/id').actions('get',{},{'autoId':$stateParams.itemId}).then(
          function(ret){
            //console.log(ret);
            $scope.the_item = ret.data;
        //    $scope.current.community = $scope.the_owner.community;
        //    $scope.current.buildingId = $scope.the_owner.buildingId;
        //
        //    $scope.current.building.code = $scope.the_owner.building;
        //    $scope.current.unit = $scope.the_owner.unit;
        //    $scope.onCommunityChange($scope.current.community).then(function(ret){
        //      $scope.onBuildingChange($scope.current.buildingId).then(function(ret){
        //        $scope.onUnitChange($scope.current.unit);
        //      });
        //    });
        //
        //
          }
        );
        break;
    }

    $scope.save = function(){
      switch (action){
        case 'add':
          if(angular.isDate($scope.the_item.billTime)){
            $scope.the_item.billTime = (Date.parse($scope.the_item.billTime));
          }
          //
          Models.init('Items').actions('add',$scope.the_item).then(function(ret){

            if(ret.meta.code == 200){
              notify({message:'添加成功',classes:'alert-success'});
            }else{
              notify({message:ret.meta.error , classes:'alert-danger'});
            }

            $state.go('admin.payment.items');
          });
          break;
        case 'edit':
          if(angular.isDate($scope.the_item.billTime)){
            $scope.the_item.billTime = (Date.parse($scope.the_item.billTime));
          }
          Models.init('Items/id').actions('update',$scope.the_item,{'autoId':$scope.the_item.autoId}).then(
            function(ret){

              if(ret.meta.code == 200){
                notify({message:'修改成功',classes:'alert-success'});
              }else{
                notify({message:ret.meta.error , classes:'alert-danger'});
              }
              $state.go('admin.payment.items');
            }
          );
          break;
      }

    };

    $scope.close = function(){
      $state.go('admin.payment.items',{type:'owners'});
    };
  });
