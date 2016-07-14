'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:ItemsCtrl
 * @description
 * # ItemsCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('ItemsCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth) {

    $scope.key = 'items';
    $scope.items_list = [];

    $scope.ucauth = ucauth;
    $scope.flag = {};
    $scope.flag.add_items = false;
    $scope.flag.edit_items = false;
    $scope.flag.del_items = false;
    $scope.flag.item_appends = false;
    $scope.flag.item_specials = false;

    ucauth.hasRole('add_items',$scope.flag);
    ucauth.hasRole('edit_items',$scope.flag);
    ucauth.hasRole('del_items',$scope.flag);
    ucauth.hasRole('item_appends',$scope.flag);
    ucauth.hasRole('item_specials',$scope.flag);

    // 获取分页数据
    $scope.getPageList = function(params){


      $scope.the_params = angular.extend({
        page: 1,
        count: 8,
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

          $scope.itemsListPromise = Models.init('Items').actions('list',the_param).then(function(ret){
            if(ret.meta.code == 200){
              lodash.map(ret.data,function(n){
                n.months+='个月';
              });
              params.count(ret.data.length);
              params.total(ret.data.length);
              $defer.resolve(ret.data);
            }
          });

        }
      });

    };

    // 编辑按钮
    $scope.edit = function(item){
      $state.go('admin.payment.edititem',{itemId:item.autoId,action:'edit'});
    };
    // 添加按钮
    $scope.add = function(){
      $state.go('admin.payment.additem', {action:'add'});
    };
    // 删除按钮
    $scope.del = function(item){
      //if(window.confirm("确定要删除 "+ item.name + " 该项目吗?")){
        Models.init('Items/id').actions('delete',{},{'autoId':item.autoId}).then(function(ret){
          if(ret.meta.code == 200){
            notify({message:'该项目已删除',classes:'alert-success'});
            $scope.tableParams.reload();
          }else{
            notify({message:ret.meta.error + " " + ret.meta.info , classes:'alert-danger'});
          }
        });
      //}
    };
    $scope.appends = function(item){
      $state.go('admin.payment.itemappend',{itemId:item.autoId});
    };

    $scope.special = function(item){
      $state.go('admin.payment.itemspecial',{itemId:item.autoId});
    };

    $scope.getPageList();

  });
