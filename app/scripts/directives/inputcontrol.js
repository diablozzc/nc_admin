/**
 * Created by zhangzhichao on 15/10/5.
 */

app.directive('testValid',function($timeout){
  return {
    restrict: 'A',
    require:'ngModel',
    link:function(scope,element,attrs,c){
      scope.$watch(attrs.ngModel,function(data){

        $timeout(function(){
          scope.isValid = c.$valid;
          scope.isDirty = c.$dirty;
          scope.error   = c.$error;
        });
      });
    }
  }
});

app.directive('inputText', function () {
  return {
    scope:{
      value:'=',
      required:'@',
      requiredAsync:'=',
      pattern:'@',
      max:'@'
    },
    transclude: true,
    template:'<div ng-class="{\'col-md-12\':colClass}">' +
              '<div class="bs-component" ng-class="{\'has-error\':!isValid && isDirty}">' +
                '<div class="input-group">' +
                  '<span class="input-group-addon" ng-class="isErrorState()">' +
                    '<i class="mr5" ng-class="attrs.icon" ng-if="attrs.icon"></i>{{attrs.label}}' +
                  '</span>' +
                  '<label class="field input-text">' +
                    '<ng-transclude></ng-transclude>' +
                    '<span class="label label-danger" ng-if="isRequired" ng-show="error.required">必填</span>' +
                    '<span class="label label-danger" ng-show="error.pattern">填写无效</span>' +
                    '<input type="text" name="{{attrs.inputText}}" id="{{attrs.inputText}}" class="form-control" ng-model="value" maxlength="{{attrs.max}}" ng-required="isRequired" ng-pattern="attrs.pattern" test-valid ng-disabled="isDisabled" ng-class="attrs.sizeClass"/> ' +
                  '</label>' +
                '</div>' +
              '</div>' +
              '</div>',
    restrict: 'A',
    replace:true,
    link:function(scope,element,attrs){
      scope.attrs = attrs;
      scope.isRequired = false;
      scope.isValid = true;
      scope.isDirty = false;
      scope.error = {};
      scope.fieldClass = '';

      if(angular.isUndefined(scope.required)){
        scope.isRequired = false;
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
          return 'text-danger' + scope.fieldClass;
        }else{
          return scope.fieldClass;
        }
      };

      // 尺寸样式
      if(angular.isDefined(attrs.sizeClass)) {
        scope.fieldClass += ' ' + attrs.sizeClass;
      };

      // 是否禁用
      scope.isDisabled = attrs.disabled === 'true';

      if(angular.isDefined(attrs.requiredAsync)){
        scope.$watch('requiredAsync',function(data){

          scope.isRequired = !(angular.isDefined(data) && data.length > 0);

        });
      }

    }
  };
});

app.directive('inputPassword', function () {
  return {
    scope:{
      value:'=',
      required:'@',
      requiredAsync:'=',
      repassword:'=',
      pattern:'@'
    },
    template: '<div class="col-lg-12">' +
                '<div class="bs-component" ng-class="{\'has-error\':!isValid && isDirty}">' +
                  '<div class="input-group">' +
                    '<span class="input-group-addon" ng-class="{\'text-danger\':!isValid && isRequired}">' +
                      '<i class="mr5" ng-class="attrs.icon" ng-if="attrs.icon"></i>{{attrs.label}}' +
                    '</span>' +
                    '<label class="field input-text">' +
                      '<span class="label label-danger" ng-if="isRequired" ng-show="error.required">必填</span>' +
                      '<span class="label label-danger" ng-show="error.minlength">填写无效</span>' +
                      '<span class="label label-danger" ng-show="error.validator">密码不一致</span>' +
                      '<input type="password" name="{{attrs.inputText}}" id="{{attrs.inputText}}" class="form-control" ng-model="value" ng-required="isRequired" ng-pattern="attrs.pattern" ng-minlength="attrs.minlength" ui-validate="\'$value==repassword || repassword == undefined\'" ui-validate-watch="\'repassword\'" test-valid/> ' +
                    '</label>' +
                  '</div>' +
                '</div>' +
              '</div>',
    restrict: 'A',
    replace:true,
    link:function(scope,element,attrs){
      scope.attrs = attrs;
      scope.isRequired = false;
      scope.isValid = true;
      scope.isDirty = false;
      scope.error = {};

      if(angular.isUndefined(scope.required)){
        scope.isRequired = false;
      }else{
        scope.isRequired = scope.required === 'true';
      }

      if(angular.isDefined(attrs.requiredAsync)){
        scope.$watch('requiredAsync',function(data){

          scope.isRequired = !(angular.isDefined(data) && data.length > 0);

        });
      }


    }
  };
});


app.directive('inputEmail', function () {
  return {
    scope:{
      value:'=',
      required:'@',
      requiredAsync:'='
    },
    template: '<div class="col-lg-12">' +
                '<div class="bs-component" ng-class="{\'has-error\':!isValid && isDirty}">' +
                  '<div class="input-group">' +
                    '<span class="input-group-addon" ng-class="{\'text-danger\':!isValid && isRequired}">' +
                    '<i class="mr5" ng-class="attrs.icon" ng-if="attrs.icon"></i>{{attrs.label}}' +
                    '</span>' +
                    '<label class="field input-text">' +
                    '<span class="label label-danger" ng-if="isRequired" ng-show="error.required">必填</span>' +
                    '<span class="label label-danger" ng-show="error.email">填写无效</span>' +
                    '<input type="email" name="{{attrs.inputText}}" id="{{attrs.inputText}}" class="form-control" ng-model="value" ng-required="isRequired" test-valid/> ' +
                    '</label>' +
                  '</div>' +
                '</div>' +
              '</div>',
    restrict: 'A',
    replace:true,
    link:function(scope,element,attrs){
      scope.attrs = attrs;
      scope.isRequired = false;
      scope.isValid = true;
      scope.isDirty = false;
      scope.error = {};

      if(angular.isUndefined(scope.required)){
        scope.isRequired = false;
      }else{
        scope.isRequired = scope.required === 'true';
      }

      if(angular.isDefined(attrs.requiredAsync)){
        scope.$watch('requiredAsync',function(data){

          scope.isRequired = !(angular.isDefined(data) && data.length > 0);

        });
      }

    }
  };
});


app.directive('inputNumber', function () {
  return {
    scope:{
      value:'=',
      required:'@',
      pattern:'@'
    },
    template:'<div class="col-lg-12">' +
              '<div class="bs-component" ng-class="{\'has-error\':!isValid && isDirty}">' +
                '<div class="input-group">' +
                  '<span class="input-group-addon" ng-class="{\'text-danger\':!isValid && isRequired}">' +
                    '<i class="mr5" ng-class="attrs.icon" ng-if="attrs.icon"></i>{{attrs.label}}' +
                  '</span>' +
                  '<label class="field input-text">' +
                    '<span class="label label-danger" ng-if="isRequired" ng-show="error.required">必填</span>' +
                    '<span class="label label-danger" ng-show="error.number">填写无效</span>' +
                    '<input type="number" name="{{attrs.inputText}}" id="{{attrs.inputText}}" class="form-control" ng-model="value" ng-required="isRequired" min="{{attrs.min}}" max="{{attrs.max}}" step="{{attrs.step}}" placeholder="{{attrs.placeholder}}" test-valid/>' +
                    '<span ng-if="attrs.unit"></span>' +
                  '</label>' +
                  '<span class="input-group-addon" ng-if="attrs.unit">{{attrs.unit}}</span>' +
                '</div>' +
              '</div>' +
              '</div>',
    restrict: 'A',
    replace:true,
    link:function(scope,element,attrs){
      scope.attrs = attrs;
      scope.isRequired = false;
      scope.isValid = true;
      scope.isDirty = false;
      scope.error = {};

      if(angular.isUndefined(scope.required)){
        scope.isRequired = false;
      }else{
        scope.isRequired = scope.required === 'true';
      }

    }
  };
});

app.directive('inputLabel', function () {
  return {
    scope:{
      value:'='
    },
    template:'<div class="col-lg-12">' +
              '<div class="bs-component">' +
                '<div class="input-group">' +
                  '<span class="input-group-addon">' +
                    '<i class="mr5" ng-class="attrs.icon" ng-if="attrs.icon"></i>{{attrs.label}}' +
                  '</span>' +
                  '<label class="field input-text">' +
                    '<span class="form-control" disabled ng-if="!dateFormat">{{value}}</span>' +
                    '<span class="form-control" disabled ng-if="dateFormat">{{value | date:attrs.dateFormat}}</span>' +
                  '</label>' +
                  '<span class="input-group-addon" ng-if="attrs.unit">{{attrs.unit}}</span>' +
                '</div>' +
              '</div>' +
              '</div>',
    restrict: 'A',
    replace:true,
    link:function(scope,element,attrs){
      scope.attrs = attrs;
      scope.dateFormat = false;

      scope.dateFormat = angular.isDefined(scope.attrs.dateFormat);

    }
  };
});

app.directive('encodeText',function($parse){
  return {
    restrict: 'A',
    require:'ngModel',
    link:function(scope,element,attrs,c){
      scope.$watch(attrs.ngModel,function(data){
        var sometext = $parse(attrs.encodeText);
        sometext.assign(scope,encodeURIComponent(data));
      });
    }
  }
});

app.directive('autoAction',function($parse,$timeout){
  return {
    restrict: 'A',
    link:function(scope,element,attrs,c){
      scope.$watch(attrs.value,function(data){

        var model = $parse(attrs.autoAction);
        var action = $parse(attrs.onAction);

        $timeout.cancel(stop);
        stop = $timeout(function(){
          action(scope)(model(scope));
        },500);

      });
    }
  }
});

/**
 * 动作按钮
 */
app.directive('actionBtn',function($parse,$compile,$templateCache,$timeout,ucauth){
  return {
    restrict: 'A',
    scope:{
      value:'='
    },
    controller:function($scope,$attrs){

      $scope.action = function(){

        ucauth.isAccessLite($attrs.actionBtn).then(function(ret){
          //console.log(angular.isArray($scope.value));
          $scope.$emit($attrs.action,$scope.value);

        });

      };

      $scope.isDisable = function(){
        var cond = angular.isUndefined($scope.value) && $attrs.valueType !== 'any' || angular.isArray($scope.value) && $scope.value.length === 0;
        var cond2 = $attrs.valueType === 'object' && angular.isArray($scope.value);

        return !$scope.flag[$attrs.actionBtn] || cond || cond2;
      }

    },
    link:function(scope,element,attrs,c){

     scope.attrs = attrs;
      if(attrs.actionBtn){
        scope.flag = {};
        scope.flag[attrs.actionBtn] = false;
        ucauth.hasRole(attrs.actionBtn,scope.flag);
      }

      var tpl = '';

      if(attrs.confirm === 'true'){
        tpl = $templateCache.get("confirm_button");
      }else{
        tpl = $templateCache.get("normal_button");
      }

      element.html(tpl);
      $compile(element.contents())(scope);

    }
  }
});
