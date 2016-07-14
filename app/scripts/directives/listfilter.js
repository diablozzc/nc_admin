'use strict';

/**
 * @ngdoc directive
 * @name propertyAdminApp.directive:listFilter
 * @description
 * # listFilter
 */

  app.directive('listFilter', function ($templateCache) {
    return {
      scope:{
        tpl:'@'
      },
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var tpl = $templateCache.get(scope.tpl);
        console.log(tpl);
      }
    };
  });
