'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:BuildingsCtrl
 * @description
 * # BuildingsCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('BuildingsCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth) {

    $scope.community_list = [];

    $scope.ucauth = ucauth;
    $scope.flag = {};
    $scope.flag.add_building = false;
    $scope.flag.edit_building = false;
    $scope.flag.del_building = false;
    $scope.flag.building_rooms = false;

    ucauth.hasRole('add_building',$scope.flag);
    ucauth.hasRole('edit_building',$scope.flag);
    ucauth.hasRole('del_building',$scope.flag);
    ucauth.hasRole('building_rooms',$scope.flag);


    Models.init('Communities').actions('list',{}).then(
      function(ret){
        $scope.community_list = ret.data;
        $scope.community_list.unshift({name:'不限'});
      }
    );


    $scope.key = 'buildings';
    $scope.the_search = {};


    // 获取分页数据
    $scope.getPageList = function(){

      $scope.the_params = angular.extend({
        page: 1,
        count: 10,
        sorting: {
          autoId: 'desc'     // initial sorting
        }
      }, $location.search());

      $scope.tableParams = new ngTableParams($scope.the_params, {
        total: 0,           // length of data
        //counts: [],
        getData: function ($defer, params) {

          $location.search(params.url());

          var the_param = {page: true, pageSize: params.count(), pageIndex: params.page()};
          the_param = angular.extend(the_param,$scope.the_search);
          // 排序
          var the_sorting = params.sorting();
          var keys = lodash.keys(the_sorting);
          var values = lodash.values(the_sorting);
          if(angular.isDefined(keys[0])){
            var sort_param = keys[0] + ':' + values[0];
            the_param.sorting = sort_param;
          }

          $scope.buildingsListPromise = Models.init('Buildings').actions('list',the_param).then(function(ret){
            if(ret.meta.code == 200){
              params.total(ret.data.totalRecord);
              $defer.resolve(ret.data.data);
            }
          });
        }
      });


    };

    // 编辑按钮
    $scope.edit = function(item){
      $state.go('admin.buildings.edit',{itemId:item.autoId,action:'edit'});
    };
    // 添加按钮
    $scope.add = function(){
      $state.go('admin.buildings.add', {action:'add'});
    };
    // 删除按钮
    $scope.del = function(item){
      //if(window.confirm("确定要删除 "+ item.name + " 该楼宇吗?")){
        Models.init('Buildings/id').actions('delete',{},{'autoId':item.autoId}).then(function(ret){
          if(ret.meta.code == 200){
            notify({message:'删除成功',classes:'alert-success'});
            $scope.tableParams.reload();
          }else{
            notify({message:ret.meta.error + " " + ret.meta.info , classes:'alert-danger'});
          }
        });
      //}
    };

    $scope.$on('onAdd',function(e,item){
      $state.go('admin.buildings.add', {action:'add'});
    });

    $scope.$on('onEdit',function(e,item){
      $state.go('admin.buildings.edit',{itemId:item.autoId,action:'edit'});
    });

    $scope.$on('onDel',function(e,item){
      Models.init('Buildings/id').actions('delete',{},{'autoId':item.autoId}).then(function(ret){
        if(ret.meta.code == 200){
          notify({message:'删除成功',classes:'alert-success'});
          $scope.tableParams.reload();
        }else{
          notify({message:ret.meta.error + " " + ret.meta.info , classes:'alert-danger'});
        }
      });
    });

    // 生成房间
    $scope.$on('onGenerateRoom',function(e,item){
      localStorageService.set($scope.key + '.entity',item);
      $state.go('admin.rooms.generate', {action:'generate'});
    });


    //// 管理房间
    $scope.rooms = function(item){
      localStorageService.set($scope.key + '.entity',item);
      $state.go('admin.rooms.list');
    };

    $scope.search = function(){
      $location.search(angular.extend($location.search(),$scope.the_search));
      $scope.getPageList();
    };

    $scope.selectedDataItem = undefined;
    $scope.$on('updateSelected',function(e,data){
      $scope.selectedDataItem = data;
    });

    $scope.communityChange = function(val){
      $location.search(angular.extend($location.search(),{'community':val}));
      $scope.getPageList();
    };


    $scope.getPageList();

  });
