'use strict';

/**
 * @ngdoc directive
 * @name adAdminApp.directive:numberSwitcher
 * @description
 * # numberSwitcher
 */

  app.directive('numberSwitcher', function () {
    return {
      scope:{
        value:'=',
        unit:'@',
        event:'@'
      },
      template: '<div class="btn-group mr10 noselect">' +
                  '<label class="btn btn-default light" ng-click="stepDown()" ng-disabled="!(min && value > min)">' +
                    '<i class="fa fa-chevron-left"></i>' +
                  '</label>' +
                  '<label class="btn btn-default light" ng-click="stepUp()" ng-disabled="!(max && value < max)">' +
                    '<i class="fa fa-chevron-right"></i>' +
                  '</label>' +
                '</div>' +
                '<span>{{value}}{{unit}}</span>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.step  = angular.isDefined(attrs.step) ? attrs.step - 0 : 1;
        scope.max  = angular.isDefined(attrs.max) ? attrs.max - 0 : undefined;
        scope.min  = angular.isDefined(attrs.min) ? attrs.min - 0 : undefined;

        scope.stepUp = function(){
          if(angular.isDefined(scope.max)){
            scope.value = (scope.value + scope.step) > scope.max ? scope.value : scope.value + scope.step;
          }else{
            scope.value += scope.step;
          }


        };
        scope.stepDown = function(){
          if(angular.isDefined(scope.min)){
            scope.value = (scope.value - scope.step) < scope.min ? scope.value : scope.value - scope.step;
          }else{
            scope.value -= scope.step;
          }

        };

        scope.$watch('value',function(data){
          if(angular.isDefined(scope.event)){
            scope.$emit(scope.event,data);
          }
        });

      }
    };
  });
