'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:SigninCtrl
 * @description
 * # SigninCtrl
 * Controller of the propertyAdminApp
 */

app.controller('SigninCtrl', function ($scope,$state,localStorageService,notify,ucauth,ModelFactory,DataService) {

  $scope.signined = false;

  $scope.user = {};
  $scope.user.user = localStorageService.get('last_user');

  if(localStorageService.get('last_user') !== null){
    $scope.remember = true;
  }
  $scope.signin = function(){

    $scope.signined = true;

    $scope.signinPromise = ucauth.login($scope.user.user,md5($scope.user.password)).then(function(ret){

        if($scope.remember){
          localStorageService.set('last_user',$scope.user.user);
        }else{
          localStorageService.remove('last_user');
        }

        notify({message:'登录成功',classes:'alert-success'});
        $state.go("admin.welcome");
     
    },function(error){
      notify({message:error.data.info,classes:'alert-danger'});
      $scope.signined = false;
    });
  };

});
