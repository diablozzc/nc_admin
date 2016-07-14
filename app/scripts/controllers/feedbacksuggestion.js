'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:FeedbacksuggestionCtrl
 * @description
 * # FeedbacksuggestionCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('FeedbacksuggestionCtrl', function ($rootScope,$scope,$state,$stateParams,localStorageService,uiGridConstants,Models,notify) {

    var action = $stateParams.action;
    $scope.action = $stateParams.action;

    var init = function(){
      $scope.the_suggest = {};
    };

    $scope.form_title = '投诉建议反馈';
    init();

    Models.init('Suggestions/id').actions('get',{},{'autoId':$stateParams.itemId}).then(function(ret){
      $scope.the_suggest = ret.data;
    });


    $scope.save = function(keep){
      if($scope.feedbackSuggestForm.$valid){
        switch (action){
          case 'feedback':

            Models.init('Suggestions/feedback/id').actions('feedback',$scope.the_suggest,{'autoId':$scope.the_suggest.autoId}).then(function(ret){
              console.log(ret);
              //localStorageService.set('current_position',$scope.current);
              notify({message:'提交成功',classes:'alert-success'});
              if(keep){
                init();
              }else{
                $state.go('admin.suggestions.list');
              }
            });
            break;

        }
      }


    };

    $scope.close = function(){
      $state.go('admin.suggestions.list');
    };
  });
