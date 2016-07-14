'use strict';

/**
 * @ngdoc directive
 * @name propertyAdminApp.directive:addressResolve
 * @description
 * # addressResolve
 */

  app.directive('addressResolve', function ($timeout,$rootScope) {
    return {
      restrict: 'A',
      require:'ngModel',
      link: function postLink(scope, element, attrs) {
        var stop;
        scope.$watch(attrs.ngModel,function(data){
          if(data){
            scope.updateNames();
            var fulladdr = '';
            fulladdr += (scope.the_community.provinceName ? scope.the_community.provinceName : '');
            fulladdr += (scope.the_community.cityName ? scope.the_community.cityName : '');
            fulladdr += (scope.the_community.areaName ? scope.the_community.areaName : '');
            fulladdr += data;

            //console.log(fulladdr);
            $timeout.cancel(stop);
            stop = $timeout(function(){
              $rootScope.$broadcast('resolve',fulladdr);
            },1000);
          }
        });
      }
    };
  });
