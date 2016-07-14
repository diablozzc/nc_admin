'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:UserinfoCtrl
 * @description
 * # UserinfoCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('UserinfoCtrl', function ($scope,ucauth) {
    $scope.userInfo = ucauth.getUser();
  });
