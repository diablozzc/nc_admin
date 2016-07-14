'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:UsercenterCtrl
 * @description
 * # UsercenterCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('UsercenterCtrl', function ($scope,$state,ucauth) {
    $scope.user = ucauth.getUser();

    $scope.flag = {
      withdraw:false
    };
    ucauth.hasRole('withdraw',$scope.flag);

  });
