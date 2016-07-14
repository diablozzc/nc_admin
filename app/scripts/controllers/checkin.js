'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:CheckinCtrl
 * @description
 * # CheckinCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('CheckinCtrl', function ($scope,Models) {
    $scope.communityCounts = 0;
    $scope.rowCounts = 0;
    $scope.rows = [];
    $scope.communities = [];

    Models.init('Rooms/Reports').actions('get').then(function(ret){
      $scope.communities = ret.data;
      $scope.communityCounts = ret.data.length;
      $scope.rowCounts = Math.ceil($scope.communityCounts / 2);

      var key = '';
      for(var i=0; i<$scope.rowCounts; i++){
        $scope.rows.push([]);
      }

      //console.log($scope.communities);


      angular.forEach($scope.communities,function(value,key){
        var rowIndex = Math.floor(key / 2);

        value.unuseRoomCount = value.roomCount - value.useRoomCount;

        value.options = {
          data: [
            {use: value.useRoomCount},
            {unuse: value.unuseRoomCount}
          ],
          dimensions: {
            use: {
              type: 'donut',
              name:'已入住',
              color:'#3498db'
            },
            unuse:{
              type:'donut',
              name:'未入住',
              color:'#cccccc'
            }

          }
        };
        $scope.rows[rowIndex].push(value);
      });

    });
  });
