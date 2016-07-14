'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:FeedbackrepairCtrl
 * @description
 * # FeedbackrepairCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('FeedbackrepairCtrl', function ($rootScope,$scope,$state,$stateParams,localStorageService,uiGridConstants,Models,notify) {
    notify.config({
      "duration":3000,
      "position":"right",
      "templateUrl":'partials/alert.html'
    });


    var action = $stateParams.action;
    $scope.action = $stateParams.action;

    var init = function(){
      $scope.the_repair = {};
    };


    $scope.form_title = '报修反馈';
    init();

    Models.init('Repairs/id').actions('get',{},{'autoId':$stateParams.itemId}).then(function(ret){
      console.log(ret.data);
      $scope.the_repair = ret.data;
    });


    $scope.save = function(keep){
      if($scope.feedbackRepairForm.$valid){
        switch (action){
          case 'feedback':

            Models.init('Repairs/feedback/id').actions('feedback',$scope.the_repair,{'autoId':$scope.the_repair.autoId}).then(function(ret){
              console.log(ret);
              //localStorageService.set('current_position',$scope.current);
              notify({message:'提交成功',classes:'alert-success'});
              if(keep){
                init();
              }else{
                $state.go('admin.repairs');
              }
            });
            break;

        }
      }

    };

    $scope.close = function(){
      $state.go('admin.repairs');
    };
  });
