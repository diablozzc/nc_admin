'use strict';

/**
 * @ngdoc directive
 * @name propertyAdminApp.directive:itemSelect
 * @description
 * # itemSelect
 */


  app.directive('itemSelect', function () {
    return {
      scope:{
        itemData:'=',
        selectedValue:'=',
        nameKey:'@',
        valKey:'@',
        change:'&onChange',
        required:'@'
      },
      //templateUrl:'/partials/item_select.html',
      template:'<div ng-class="{\'col-md-12\':colClass}">' +
                  '<div class="bs-component" ng-class="{\'has-error\':!isValid && isRequired}">' +
                    '<div class="input-group">' +
                      '<span class="input-group-addon" ng-class="labelClass">{{::title}}</span>' +
                      '<label class="field select" ng-class="isErrorState()">' +

                      '<select class="" ng-model="selectedValue" ng-options="item[valKey] as item[nameKey] for item in itemData" ng-change="changeValue(selectedValue)" ng-disabled="isDisabled" ng-required="isRequired" test-valid="isValid"></select>' +

                      '<i class="arrow"></i>' +
                      '</label>' +
                    '</div>' +
                  '</div>' +
               '</div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.isValid = false;
        scope.labelClass = '';
        scope.fieldClass = '';
        // 控件标签
        scope.title = attrs.title;
        // 是否必填
        if(angular.isUndefined(scope.required)){
          scope.isRequired = true;
        }else{
          scope.isRequired = scope.required === 'true';
        }

        if(angular.isUndefined(attrs.colClass)){
          scope.colClass = true;
        }else{
          scope.colClass = scope.required === 'true';
        }

        scope.isErrorState = function(){
          if(!scope.isValid && scope.isRequired){
            return 'state-error' + scope.fieldClass;
          }else{
            return scope.fieldClass;
          }
        };


        // 是否禁用
        scope.isDisabled = attrs.disabled === 'true';

        // 标签样式
        if(angular.isDefined(attrs.labelClass)){
          scope.labelClass = attrs.labelClass;
        }
        // 尺寸样式
        if(angular.isDefined(attrs.sizeClass)) {
          scope.labelClass += ' ' + attrs.sizeClass;
          scope.fieldClass += ' ' + attrs.sizeClass;
        };


        // 变更事件
        scope.changeValue = function(val){
          if(scope.change()){
            scope.change()(val);
          }
        };
      }
    };
  });
