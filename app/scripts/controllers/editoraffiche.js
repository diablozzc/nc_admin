'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:EditorafficheCtrl
 * @description
 * # EditorafficheCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('EditorafficheCtrl', function ($rootScope,$scope,$state,$stateParams,localStorageService,Models,notify,config,ucauth,errorReport) {

    // 初始化数据
    $scope.type_list = config.data.states.afficheType;
    //$scope.user_tag_list = config.data.states.userTag;
    //$scope.errorInfo = [];
    $scope.community_list = [];


    // 获取小区列表
    Models.init('Communities').actions('list',{}).then(
      function(ret){
        $scope.community_list = ret.data;
      }
    );


    var action = $stateParams.action;
    $scope.action = $stateParams.action;

    var init = function(){
      $scope.the_affiche = {};
    };


    switch (action){
      case 'add':
        $scope.form_title = '新增公告';
        init();

        break;
      case 'edit':
        $scope.form_title = '修改公告信息';

        Models.init('Affiches/id').actions('get',{'autoId':$stateParams.itemId}).then(
          function(ret){
            $scope.the_affiche = ret.data;
            $scope.afficheContent = $scope.the_affiche.content;
          }
        );
        break;
    }

    $scope.save = function(keep){
      if($scope.afficheForm.$valid){
        switch (action){
          case 'add':
            $scope.the_affiche.property = ucauth.getUser().property;
            if($scope.the_affiche.type == 1){
              $scope.community = '';
            }

            //console.log($scope.the_affiche);


            Models.init('Affiches').actions('add',$scope.the_affiche).then(function(ret){

              if(ret.meta.code == 200){
                notify({message:'添加成功',classes:'alert-success'});
              }else{
                notify({message:ret.meta.error , classes:'alert-danger'});
              }

              if(keep){
                init();
              }else{
                $state.go('admin.affiches.list');
              }
            },function(error){
              errorReport.report(error);
            });


            break;
          case 'edit':
            if($scope.the_affiche.type == 1){
              $scope.community = '';
            }


            Models.init('Affiches/id').actions('update',$scope.the_affiche,{'autoId':$scope.the_affiche.autoId}).then(
              function(ret){

                if(ret.meta.code == 200){
                  notify({message:'修改成功',classes:'alert-success'});
                }else{
                  notify({message:ret.meta.error , classes:'alert-danger'});
                }

                if(keep){
                  $state.go('admin.affiches.add', {action:'add'});
                }else{
                  $state.go('admin.affiches.list');
                }
              }
            );
            break;
        }

      }

    };

    $scope.close = function(){
      $state.go('admin.affiches.list');
    };
  });
