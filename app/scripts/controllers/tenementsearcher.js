'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:TenementsearcherCtrl
 * @description
 * # TenementsearcherCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('TenementsearcherCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth) {

    $scope.the_search = {};
    $scope.community_list = [];

    Models.init('Communities').actions('list',{}).then(
      function(ret){
        $scope.community_list = ret.data;
        $scope.community_list.unshift({name:'不限'});
      }
    );

    $scope.search = function(){
      $rootScope.$broadcast('search',$scope.the_search);
    }

  });
