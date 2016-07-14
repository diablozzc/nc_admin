'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:BreadcrumbCtrl
 * @description
 * # BreadcrumbCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('BreadcrumbCtrl', function ($rootScope,$scope,$state,config) {

    // 构建面包屑导航
    $scope.create_bread = function(){
      $scope.bread =[];
      $scope.current_node = config.data.breadcrumb[$state.$current.name];


      if($scope.current_node!==undefined && $scope.current_node.hasOwnProperty('parent')){
        var parent = $scope.current_node.parent;

        $scope.bread.push($scope.current_node);

        while(parent){
          var parent_node = config.data.breadcrumb[parent];
          $scope.bread.unshift(parent_node);
          parent = parent_node.parent;
        }
      }

    };

    // 是否到尾部
    $scope.is_trail = function(index){
      return index == $scope.bread.length - 1;
    };

    $scope.create_bread();

    $scope.$on('update_bread',function(){
      $scope.create_bread();
    });

    //$rootScope.$on('$stateChangeSuccess',
    //  function(event, toState, toParams, fromState, fromParams){
    //    //event.preventDefault();
    //    $scope.create_bread();
    //    // transitionTo() promise will be rejected with
    //    // a 'transition prevented' error
    //  });


  });

  app.directive('breadCrumb',function($state,config){
    return {
      restrict: 'A',
      template:'<ol class="breadcrumb">' +
      '<li class="crumb-active">' +
      '<a ui-sref="{{current_node.href}}">{{current_node.text}}</a>' +
      '</li>' +
      '<li class="crumb-icon">' +
      '<a ui-sref="dashboard">' +
      '<span class="glyphicon glyphicon-home"></span>' +
      '</a>' +
      '</li>' +
      '<li ng-repeat="crumb in bread" ng-class="{\'crumb-link\':!is_trail($index),\'crumb-trail\':is_trail($index)}">' +
        '<a ui-sref="{{crumb.href}}" ng-if="!is_trail($index)">{{crumb.text}}</a>' +
      '<span ng-if="is_trail($index)">{{crumb.text}}</span>' +
      '</li>' +
      '</ol>',
      controller:function($scope){
        $scope.current_node = config.data.breadcrumb['admin.welcome'];
        //console.log($scope.current_node);
      },
      link:function(scope,element,attrs,c){

        // 构建面包屑导航
        scope.create_bread = function(){
          scope.bread =[];
          scope.current_node = config.data.breadcrumb[$state.$current.name];


          if(scope.current_node!==undefined && scope.current_node.hasOwnProperty('parent')){
            var parent = scope.current_node.parent;

            scope.bread.push(scope.current_node);

            while(parent){
              var parent_node = config.data.breadcrumb[parent];
              scope.bread.unshift(parent_node);
              parent = parent_node.parent;
            }
          }

        };

        // 是否到尾部
        scope.is_trail = function(index){
          return index == scope.bread.length - 1;
        };

        scope.create_bread();


        scope.$on('update_bread',function(){
          //console.log('update_bread');
          scope.create_bread();
        });
      }
    }
  });
