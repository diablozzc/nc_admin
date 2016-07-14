'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:EditorguideCtrl
 * @description
 * # EditorguideCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('EditorguideCtrl', function ($rootScope,$scope,$state,$stateParams,Models,ucauth,notify) {
    // 初始化
    var action = $stateParams.action;
    $scope.action = $stateParams.action;

    $scope.community_list = [];
    $scope.guide_content_list = [

    ];
    Models.init('Communities').actions('list',{}).then(
      function(ret){
        $scope.community_list = ret.data;
        $scope.community_list.unshift({name:'请选择...'});
      }
    );


    var init = function(){
      $scope.the_guide = {};
      $scope.the_guide.property = ucauth.getUser().property;
    };

    switch (action){
      case 'add':
        $scope.form_title = '新增办事指南';
        init();
        break;
      case 'edit':
        $scope.form_title = '修改办事指南';

        Models.init('Guides/id').actions('get',{autoId:$stateParams.itemId}).then(
          function(ret){
            $scope.the_guide = ret.data;
            $scope.guideRemark = $scope.the_guide.remark;
          }
        );
        Models.init('GuideContents').actions('list',{gid:$stateParams.itemId}).then(function(ret){
          $scope.guide_content_list = ret.data;
        });

        break;
    }
    $scope.save = function(){
      switch (action){
        case 'add':

          Models.init('Guides').actions('add',$scope.the_guide).then(function(ret){

            if(ret.meta.code == 200){
              notify({message:'添加成功',classes:'alert-success'});
            }else{
              notify({message:ret.meta.error , classes:'alert-danger'});
            }

            $state.go('admin.guide.list');
          });
          break;
        case 'edit':


          Models.init('Guides/id').actions('update',$scope.the_guide,{'autoId':$scope.the_guide.autoId}).then(
            function(ret){

              if(ret.meta.code == 200){
                notify({message:'修改成功',classes:'alert-success'});
              }else{
                notify({message:ret.meta.error , classes:'alert-danger'});
              }

              $state.go('admin.guide.list');
            }
          );
          break;
      }

    };

    // 添加指南内容
    $scope.addContent = function(){

      switch (action){
        case 'add':

          Models.init('Guides').actions('add',$scope.the_guide).then(function(ret){

            if(ret.meta.code == 200){
              notify({message:'保存成功',classes:'alert-success'});
              $scope.the_guide = ret.data;
              $scope.guide_content_list.push({content:'',sort:$scope.guide_content_list.length+1,gid:$scope.the_guide.autoId});
              action = 'edit';
            }else{
              notify({message:ret.meta.error , classes:'alert-danger'});
            }

          });
          break;
        case 'edit':

          $scope.guide_content_list.push({content:'',sort:$scope.guide_content_list.length+1,gid:$scope.the_guide.autoId});

          break;
      }




    };


    $scope.updateOrder = function(){
      var all = [];
      angular.forEach($scope.guide_content_list,function(value,index){
        var tmp = {};
        $scope.guide_content_list[index].sort = index+1;
        tmp.autoId = value.autoId;
        tmp.content = value.content;
        tmp.sort = value.sort;
        all.push(tmp);

      });

      Models.init('GuideContents').actions('update',all).then(function(ret){
        if(ret.meta.code == 200){
          notify({message:'更新成功',classes:'alert-success'});
        }else{
          notify({message:ret.meta.error , classes:'alert-danger'});
        }
      });
    };

    $scope.sortableOptions = {
      stop: $scope.updateOrder,
      axis: 'y'
    };

    $scope.saveContent = function(item){
      var index = lodash.findIndex($scope.guide_content_list,item);
      if(angular.isDefined(item.autoId)){
        // update guide content
        if(angular.isDefined(item.content) && item.content.length > 0){
          Models.init('GuideContents/id').actions('update',item,{'autoId':item.autoId}).then(function(ret){
            if(ret.meta.code == 200){
              notify({message:item.sort+'.更新成功',classes:'alert-success'});
            }else{
              notify({message:ret.meta.error , classes:'alert-danger'});
            }
          });
        }

      }else{
        // add guide content
        if(item.content.length > 0){
          Models.init('GuideContents').actions('add',item).then(function(ret){

            if(ret.meta.code == 200){
              notify({message:item.sort+'.添加成功',classes:'alert-success'});
              $scope.guide_content_list[index].autoId = ret.data.autoId;
            }else{
              notify({message:ret.meta.error , classes:'alert-danger'});
            }

          });
        }

      }

    };
    $scope.deleteContent = function(item){
      var index = lodash.findIndex($scope.guide_content_list,item);
      if(angular.isDefined(item.autoId)){
        Models.init('GuideContents/id').actions('delete',{}, {'autoId': item.autoId}).then(function(ret){
          if(ret.meta.code == 200){
            notify({message:item.sort+'.删除成功',classes:'alert-success'});
          }else{
            notify({message:ret.meta.error , classes:'alert-danger'});
          }
        });
      }

      $scope.guide_content_list.splice(index, 1);

      $scope.updateOrder();

    };


    $scope.close = function(){
      $state.go('admin.guide.list');
    };

  });
