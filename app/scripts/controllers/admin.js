'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the propertyAdminApp
 */

app.controller('AdminCtrl', function ($state,$stateParams,$scope,$rootScope,$window,Models,ucauth,ngDialog,notify) {
  // Init Theme Core
  Core.init();
  // Init Demo JS
  Demo.init();

  $scope.logout = function(){
    $rootScope.$broadcast('logout');
  };

  $scope.$on('logout',function(e,data){

    Models.init('Users/LoginOut').actions('loginout').then(function(ret){

    },function(error){
      console.log(error);
    });

    $window.sessionStorage.clear();
    $state.go('pages.signin');

  });

  $scope.user = ucauth.getUser();
  $scope.user.balance = 0;
    // console.log($scope.user);
    // 获取管理员信息
    Models.init('Admins/getByUsername/username').actions('get',{username:$scope.user.username}).then(function(ret){

      var user = lodash.merge($scope.user,ret);
      ucauth.setUser(user);
      $scope.user = user;

      if(user.status === 0){
        $state.go('admin.usercenter.password');
        notify({message:'初次使用请重新设置登录密码' , classes:'alert-danger',duration:5000});
      }

      // // 获取物业公司信息
      // Models.init('Properties/getbycode').actions('getbycode',{code:$scope.user.property}).then(function(ret){
      //   $scope.user.propertyInfo = ret.data;
      //   $scope.user.department = ret.data.name;
      //   ucauth.setUser($scope.user);
      //   //console.log($scope.user);
      //
      //   if($scope.user.community){
      //     Models.init('Communities/code').actions('get',{code:$scope.user.community}).then(function(ret){
      //       $scope.user.communityInfo = ret.data;
      //       $scope.user.department = ret.data.name;
      //       ucauth.setUser($scope.user);
      //
      //     });
      //   }
      //
      // });

      if($scope.user.userTag == 0){
        $scope.getUserBalance();
      }

    });

  $scope.flag = {
    withdraw:false
  };


  // $window.sessionStorage['server']='prop';

  // // 获取账户积分余额
  // $scope.getUserBalance = function(){
  //
  //   // Models.init('Accounts').actions('get').then(function(ret){
  //   //   //console.log(ret);
  //   //   $scope.user.balance = ret.data.balance.balance;
  //   //   ucauth.hasRole('withdraw',$scope.flag);
  //   // });
  // };
  //
  // $scope.$on('refresh',function(){
  //   $scope.getUserBalance();
  // });
  //
  //
  // $scope.withDraw = function(){
  //   Models.init('WdAttachs').actions('get').then(function(ret){
  //     if(ret.data && ret.data.length > 0){
  //       if($scope.user.balance > 0){
  //
  //         ngDialog.open({
  //           template:'withDrawTpl',
  //           controller:'withDrawWindow',
  //           resolve: {
  //             accountData: function accountFactory() {
  //               return {
  //                 balance:$scope.user.balance,
  //                 accounts:ret.data
  //               };
  //             }
  //           },
  //           preCloseCallback: function(value) {
  //             $rootScope.$broadcast('refresh');
  //           }
  //         });
  //
  //       }else{
  //         notify({message:'余额不足' , classes:'alert-danger'});
  //       }
  //
  //     }else{
  //
  //         ngDialog.open({
  //           template:'bindAccountTpl',
  //           controller:'bindAccountWindow',
  //           preCloseCallback: function(value) {
  //
  //           }
  //         });
  //
  //     }
  //   });
  // }

  $rootScope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams){
      //console.log(fromState,toState);
      //console.log('success',toState);
      $rootScope.$broadcast('update_bread');
      //$rootScope.$broadcast('init');
    });



});
