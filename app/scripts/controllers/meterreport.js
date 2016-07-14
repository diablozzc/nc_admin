'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:MeterreportCtrl
 * @description
 * # MeterreportCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('MeterreportCtrl', function ($scope,Models) {
    $scope.meterData = [];
    Models.init('Meters/Reports').actions('get').then(function(ret){

      $scope.meterData = ret.data;

      angular.forEach($scope.meterData,function(meter){
        angular.forEach(meter.report,function(item){
          //console.log(item);
          item.unreadRoomCount = item.useRoomCount - item.readRoomCount;

          item.options = {
            data: [
              {read: item.readRoomCount},
              {unread: item.unreadRoomCount}
            ],
            dimensions: {
              read: {
                type: 'donut',
                name: '已抄表',
                color:'#3498db'
              },
              unread: {
                type: 'donut',
                name: '未抄表',
                color:'#cccccc'
              }
            }
          }


        });
      });


    });
  });
