'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:EditorconvenienceCtrl
 * @description
 * # EditorconvenienceCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('EditorconvenienceCtrl', function ($rootScope,$scope,$state,$stateParams,localStorageService,uiGridConstants,Models,notify,config,ucauth) {
    // 初始化数据
    var action = $stateParams.action;
    $scope.action = $stateParams.action;

    var init = function(){
      $scope.the_convenience = {};

    };


    $scope.types_list = [];
    $scope.community_list = [];
    init();


    Models.init('ConveniencesTypes').actions('list',{}).then(function(ret){
      $scope.types_list = ret.data;
      if(action=='add'){
        $scope.the_convenience.type = $scope.types_list[0].code;
      }
    });

    Models.init('Communities').actions('list',{}).then(
      function(ret){
        $scope.community_list = ret.data;
        if(action=='add'){
          $scope.the_convenience.community = $scope.community_list[0].code;
        }
      }
    );


    switch (action){
      case 'add':
        $scope.form_title = '新增便民信息';


        break;
      case 'edit':
        $scope.form_title = '修改便民信息';

        Models.init('Conveniences/id').actions('get',{'autoId':$stateParams.itemId}).then(
          function(ret){
            $scope.the_convenience = ret.data;
            $scope.form_title = '修改便民信息';
          }
        );
        break;
    }


    $scope.save = function(keep){
      if($scope.convenienceForm.$valid){
        switch (action){
          case 'add':

            Models.init('Conveniences').actions('add',$scope.the_convenience).then(function(ret){

              if(ret.meta.code == 200){
                notify({message:'添加成功',classes:'alert-success'});
              }else{
                notify({message:ret.meta.error , classes:'alert-danger'});
              }

              if(keep){
                init();
              }else{
                $state.go('admin.conveniences.list');
              }
            });
            break;
          case 'edit':

            Models.init('Conveniences/id').actions('update',$scope.the_convenience,{'autoId':$scope.the_convenience.autoId}).then(
              function(ret){

                if(ret.meta.code == 200){
                  notify({message:'修改成功',classes:'alert-success'});
                }else{
                  notify({message:ret.meta.error , classes:'alert-danger'});
                }

                if(keep){
                  $state.go('admin.conveniences.add',{action:'add'});
                }else{
                  $state.go('admin.conveniences.list');
                }
              }
            );
            break;
        }
      }

    };

    $scope.close = function(){
      $state.go('admin.conveniences.list');
    };
  });
