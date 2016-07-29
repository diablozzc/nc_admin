'use strict';

/**
 * @ngdoc directive
 * @name propertyAdminApp.directive:daterangeSelect
 * @description
 * # daterangeSelect
 */

  app.directive('testDate',function(){
    return {
      restrict: 'A',
      require:'ngModel',
      link:function(scope,element,attrs,c){
        scope.$watch(attrs.ngModel,function(data){

          if(angular.isDefined(data) && angular.isDefined(data.startDate)){

            c.$setValidity('date', data.startDate.isValid());

          }
          scope.isValid = c.$valid;
          scope.isDirty = c.$dirty;
          scope.error   = c.$error;


        });
      }
    }
  });


  app.directive('daterangeSelect', function () {
    return {
      scope:{
        value:'=',
        required:'@',
        change:'&onChange',
        maxDate:'=',
        minDate:'=',
        limit:'=',
        need:'='
      },
      template: '<div class="col-lg-12">' +
                  '<div class="bs-component" ng-class="{\'has-error\':!isValid && isDirty}">' +
                    '<div class="input-group">' +
                      '<span class="input-group-addon" ng-class="{\'text-danger\':!isValid && isRequired}">' +
                        '{{attrs.label}}' +
                      '</span>' +
                      '<label class="field input-text">' +
                        '<span class="label label-danger" ng-if="isRequired" ng-show="error.required">必填</span>' +
                        '<input  date-range-picker type="text" name="{{attrs.inputText}}" id="{{attrs.inputText}}" class="form-control date-picker" ng-model="value" ng-required="isRequired" ng-disabled="isDisabled" test-date options="options"/> ' +
                      '</label>' +
                      '<span class="input-group-addon"><i ng-class="icon"></i></span>' +
                    '</div>' +
                  '</div>' +
                '</div>',
      restrict: 'A',
      controller:function($scope,$attrs){


        $scope.options = {
          'autoApply': true,
          'timePicker': false,
          'locale': {
            'format': 'YYYY-MM-DD',
            'applyLabel': "确定",
            'cancelLabel': "取消"
          },
          'singleDatePicker': false,
          'eventHandlers':{
            'apply.daterangepicker':function(e,picker){
              if($scope.change()){
                if(angular.isUndefined($scope.value.startDate)){
                  $scope.value.startDate = moment();
                }
                $scope.change()($scope.value);
              }
              $scope.$emit('updateDate',$scope.value);
            }
          }
        };

        $scope.id = $attrs.daterangeSelect;

        if(angular.isUndefined($attrs.timePicker)){
          $scope.options.timePicker = false;
        }else{
          $scope.options.timePicker = $attrs.timePicker === 'true';
        }

        if(angular.isDefined($attrs.format)){
          $scope.options.locale.format = $attrs.format;
        }

        if(angular.isUndefined($attrs.single)){
          $scope.options.singleDatePicker = false;
        }else{
          $scope.options.singleDatePicker = $attrs.single === 'true';
        }

        $scope.options.autoApply = true;

        if(angular.isDefined($scope.maxDate)){
          $scope.options.maxDate = $scope.maxDate;
        }

        if(angular.isDefined($scope.minDate)){
          $scope.options.minDate = $scope.minDate;
        }
        if(angular.isDefined($scope.limit)){
          $scope.options.dateLimit = $scope.limit;
        }

        $scope.$watch('maxDate',function(value){
          if(angular.isDefined(value)){
            $scope.options['maxDate'] = value;
          }
        },true);

        $scope.$watch('minDate',function(value){
          if(angular.isDefined(value)){
            $scope.options['minDate'] = value;
          }
        },true);

        $scope.$watch('need',function(value){
          if(angular.isDefined(value)){
            $scope.isDisabled = angular.isUndefined(value.startDate);
          }
        },true);


      },
      link: function (scope, element, attrs) {

        scope.attrs = attrs;
        scope.isRequired = false;
        scope.isValid = true;
        scope.isDirty = false;
        scope.error = {};

        // 图标
        scope.icon = 'fa fa-clock-o';
        if(angular.isDefined(attrs.icon)){
          scope.icon = attrs.icon;
        }

        if(angular.isUndefined(scope.required)){
          scope.isRequired = false;
        }else{
          scope.isRequired = scope.required === 'true';
        }

        // scope.isDisabled = attrs.disabled === 'true';

        scope.$on('updateOptions',function(e,data){
          if(scope.id == data.id){
            scope.options[data.option] = data.value;
          }
        });


      }
    };
  });
