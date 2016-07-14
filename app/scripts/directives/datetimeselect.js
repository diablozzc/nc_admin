'use strict';

/**
 * @ngdoc directive
 * @name propertyAdminApp.directive:datetimeSelect
 * @description
 * # datetimeSelect
 */

  app.directive('datetimeSelect', function () {
    return {
      scope:{
        selectId:'@',
        selectValue:'=',
        format:'@',
        label:'@',
        required:'@'
      },
      template: '<div class="col-lg-12">' +
                  '<div class="bs-component" ng-class="{\'has-error\':!isValid && isRequired}">' +
                    '<div class="dropdown">' +
                      '<span class="dropdown-toggle" id="{{selectId}}" role="button" data-toggle="dropdown" data-target="#" href="#">' +
                        '<div class="input-group">' +
                          '<span class="input-group-addon">{{label}}</span>' +
                          '<span class="form-control">{{selectValue | date:format}}</span>' +
                          '<input type="hidden" ng-model="selectValue" ng-required="isRequired" test-valid/>' +
                          '<span class="input-group-addon"><i ng-class="icon"></i></span>' +
                        '</div>' +
                      '</span>' +
                      '<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">' +
                        '<datetimepicker ng-model="selectValue" data-datetimepicker-config="conf"/>' +
                      '</ul>' +
                    '</div>' +
                  '</div>' +
                '</div>',
      restrict: 'A',
      controller:function($scope,$attrs){

        // 最小视图
        var minView = 'minute';
        if(angular.isDefined($attrs.minView)){
          minView = $attrs.minView;
        }

        // 图标
        $scope.icon = 'fa fa-clock-o';
        if(angular.isDefined($attrs.icon)){
          $scope.icon = $attrs.icon;
        }

        // 配置
        $scope.conf = {
          dropdownSelector: '#' + $scope.selectId,
          startView:'day',
          minView: minView
        };


      },
      link: function(scope, element, attrs) {
        scope.isRequired = false;
        scope.isValid = true;
        // 是否必填
        if(angular.isUndefined(scope.required)){
          scope.isRequired = true;
        }else{
          scope.isRequired = scope.required === 'true';
        }

      }
    };
  });
