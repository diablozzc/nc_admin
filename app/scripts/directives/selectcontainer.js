'use strict';

/**
 * @ngdoc directive
 * @name propertyAdminApp.directive:selectContainer
 * @description
 * # selectContainer
 */

  app.directive('selectContainer', function ($parse) {
    return {
      restrict: 'A',
      controller:function($scope,$attrs){


        $scope.multiSelect = $attrs.multiSelect === 'true';

        $scope.checkIt = function(item){

          var data = $parse($attrs.selectContainer);
          item.selected = !item.selected;

          if(item.selected){

            //var the_index = lodash.findIndex(data($scope),'$$hashKey',item.$$hashKey);
            //单选情况
            if(!$scope.multiSelect){
              lodash.forEach(data($scope),function(one){
                one.selected = false;
              });
              item.selected = !item.selected;

              $scope.$emit('updateSelected',item);

              //多选情况
            }else{
              var selected_list = [];
              lodash.forEach(data($scope),function(one){
                if(one.selected){
                  selected_list.push(one)
                }
              });
              if(selected_list.length > 1){
                $scope.$emit('updateSelected',selected_list);
              }else{
                $scope.$emit('updateSelected',selected_list[0]);
              }
            }

          }else{
            $scope.$emit('updateSelected',undefined);
          }

        };

      }
    };
  });
