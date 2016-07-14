'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:EditorbylawCtrl
 * @description
 * # EditorbylawCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('EditorbylawCtrl', function ($rootScope,$scope,$state,$stateParams,Models,ucauth,notify) {
    // 初始化
    var action = $stateParams.action;
    $scope.action = $stateParams.action;

    $scope.community_list = [];
    Models.init('Communities').actions('list',{}).then(
      function(ret){
        $scope.community_list = ret.data;
        $scope.community_list.unshift({name:'请选择...'});
      }
    );


    var init = function(){
      $scope.the_bylaw = {};

      $scope.the_bylaw.property = ucauth.getUser().property;
    };

    switch (action){
      case 'add':
        $scope.form_title = '新增管理规定';
        init();
        break;
      case 'edit':
        $scope.form_title = '修改管理规定';

        Models.init('Bylaws/id').actions('get',{autoId:$stateParams.itemId}).then(
          function(ret){
            $scope.the_bylaw = ret.data;
            $scope.bylawContent = $scope.the_bylaw.content;

          }
        );
        break;
    }
    $scope.save = function(){
      switch (action){
        case 'add':

          Models.init('Bylaws').actions('add',$scope.the_bylaw).then(function(ret){

            if(ret.meta.code == 200){
              notify({message:'添加成功',classes:'alert-success'});
            }else{
              notify({message:ret.meta.error , classes:'alert-danger'});
            }

            $state.go('admin.bylaw.list');
          });
          break;
        case 'edit':


          Models.init('Bylaws/id').actions('update',$scope.the_bylaw,{'autoId':$scope.the_bylaw.autoId}).then(
            function(ret){

              if(ret.meta.code == 200){
                notify({message:'修改成功',classes:'alert-success'});
              }else{
                notify({message:ret.meta.error , classes:'alert-danger'});
              }

              $state.go('admin.bylaw.list');
            }
          );
          break;
      }

    };
    $scope.close = function(){
      $state.go('admin.bylaw.list');
    };

  });
