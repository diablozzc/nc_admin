'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('SignupCtrl', function ($scope,$state,DataService,ModelFactory,$window,ngDialog) {
    $scope.user = {};
    $scope.user.type = 'username';

    $scope.errorInfo = [];

    $scope.signup = function(){

      var user = ModelFactory.init('Users');

      user.action('signup',$scope.user).then(function(ret){

        if(ret.meta.code === 200){
          //localStorageService.set('tokenSecret',ret.data.tokenSecret);
          //localStorageService.set('userToken',ret.data.userToken);
          $window.sessionStorage.tokenSecret = ret.data.tokenSecret;
          $window.sessionStorage.userToken = ret.data.userToken;
          $state.go("admin.welcome");
        }

      });
    };


  });
