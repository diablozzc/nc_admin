'use strict';

/**
 * @ngdoc directive
 * @name propertyAdminApp.directive:searcher
 * @description
 * # searcher
 */
  var stop;
  app.directive('searcher', function ($timeout,localStorageService) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.$watch('keyword',function(data,old){
          $timeout.cancel(stop);
          stop = $timeout(function(){
            //console.log(data);
            if(data !== old){
              var params = localStorageService.get(attrs.key + '.params');
              params = lodash.merge(params,{'keyword':data});
              localStorageService.set(attrs.key + '.params',params);
              scope.$emit('update_page');
            }
          },1000);

        });
      }
    };
  });
