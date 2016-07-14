'use strict';

/**
 * @ngdoc directive
 * @name propertyAdminApp.directive:confirmPopover
 * @description
 * # confirmPopover
 */

  app.directive('confirmPopover', function ($popover) {
    return {
      scope:{
        title:'@',
        content:'@',
        action:'&onAction',
        value:'=',
        disabled:'=',
        useless:'&onUseless'
      },
      restrict: 'A',
      template: '<button type="button" class="btn" ' +
                        'ng-class="attrs.btnClass" ' +
                        'title="{{title}}" ' +
                        'data-placement="left" ' +
                        'data-content="{{content}}" ' +
                        'data-template-url="confirmPopover.html" ' +
                        'bs-popover="options"' +
                        'ng-disabled="isDisable()">' +
                        '<i ng-class="attrs.btnIcon"></i>' +
                        '{{attrs.btnName}}</button>',
      link: function(scope, element, attrs, controller) {
        scope.attrs = attrs;
        scope.options = {
          html:true
        };

        scope.closeText = '关闭';
        scope.confirmText = '确定';

        scope.confirm = function(){
          if(scope.action()){
            scope.action()(scope.value);
          }
        };

        scope.isDisable = function(){
          return scope.disabled || scope.useless()?scope.useless()():false;
        }

      }
    };
  });
