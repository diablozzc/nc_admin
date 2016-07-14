'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:CreatorbillsCtrl
 * @description
 * # CreatorbillsCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('CreatorbillsCtrl', function ($rootScope,$scope,$state,$stateParams,$q,localStorageService,Models,ucauth,notify,config) {
    $scope.community_list = [];
    $scope.item_list = [];
    $scope.the_item = {};
    $scope.datePicker = {};
    $scope.datePicker.date = {startDate: undefined, endDate: undefined};

    // 获取小区列表
    Models.init('Communities').actions('list',{}).then(
      function(ret){
        $scope.community_list = ret.data;
      }
    );

    // 切换小区
    $scope.onCommunityChange = function(val){
      var params = {community:val,billType:1};

      Models.init('Items').actions('list',params).then(function(ret){
        $scope.item_list = ret.data;
      });
    };

    $scope.onItemChange = function(val){
      //console.log(val);

      Models.init('Items/id').actions('get',{autoId:val}).then(function(ret){
        console.log(ret);
        $scope.the_item = ret.data;
        $scope.minDate = moment($scope.the_item.billTime);
        $scope.dateLimit = {'years':1};
      });
    };


    var action = $stateParams.action;
    $scope.action = $stateParams.action;


    switch (action){
      case 'create':
        $scope.form_title = '生成账单';
        $scope.the_creator = {};
        break;

    }

    $scope.create = function(){
      if(angular.isDefined($scope.datePicker.date.startDate)){
        $scope.the_creator.startDate = $scope.datePicker.date.startDate.valueOf();
        $scope.the_creator.endDate = $scope.datePicker.date.endDate.valueOf();
      }

      Models.init('Bills').actions('create',$scope.the_creator).then(function(ret){
        //console.log(ret);
        notify({message:ret.data,classes:'alert-success'});
        $state.go('admin.payment.bills');
      });

    };

    $scope.close = function(){
      $state.go('admin.payment.bills');
    };
  });
