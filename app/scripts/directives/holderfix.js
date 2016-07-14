'use strict';

/**
 * @ngdoc directive
 * @name superAdminApp.directive:holderFix
 * @description
 * # holderFix
 */

  app.directive('holderFix', function () {
    return {
      link: function (scope, element, attrs) {
        Holder.run({ images: element[0], nocss: true });
      }
    };
  });
