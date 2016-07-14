'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('UploadCtrl', function ($scope,$timeout,Upload,Files) {
    var max_files = 3;
    $scope.add_files = 0;
    $scope.file_queue = [];

    $scope.$watch('files',function(){
      $scope.upload($scope.files);
    });

    $scope.upload = function(files){
      if(files && files.length){
        for(var i=0;i < files.length; i++){
          var file = files[i];
          $scope.add_files++;
          if(max_files>= $scope.add_files){
            Upload.upload({
              url:'http://file.muranyun.com/index.php/Home/Index/upload',
              fields:{'username':$scope.username},
              sendFieldAs:'form',
              file:file
            }).progress(function(evt){
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
            }).success(function (data, status, headers, config) {
              console.log('file ' + config.file.name + ' uploaded. Response: ', data);
              $scope.file_queue.push(data);
            });
          }else{
            console.log('error: more file',file);
            console.log($scope.file_queue);
            return false;
          }

        }
      }
    };

    $scope.create_file = function(){
      var data = {"name":"zhangzhichao","username":"blackzzc","email":"zzc7400@gmail.com"};
      //console.log($.param(data));
      Files.create(data).$promise.then(function(ret){
        console.log(ret);
      });
    };
  });
