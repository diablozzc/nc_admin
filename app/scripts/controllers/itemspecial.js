'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:ItemspecialCtrl
 * @description
 * # ItemspecialCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('ItemSpecialCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth) {
    $scope.key = 'item_special';

    $scope.ucauth = ucauth;
    $scope.flag = {};
    $scope.flag.add_special_item = false;
    $scope.flag.edit_special_item = false;
    $scope.flag.del_special_item = false;

    ucauth.hasRole('add_special_item',$scope.flag);
    ucauth.hasRole('edit_special_item',$scope.flag);
    ucauth.hasRole('del_special_item',$scope.flag);

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
            the_param.sorting = keys[0] + ':' + values[0];
          }

          the_param.item = $stateParams.itemId;

          $scope.itemSpecialListPromise = Models.init('ItemConfig').actions('list',the_param).then(function(ret){
            console.log(ret);

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
      $state.go('admin.payment.edititemspecial',{itemId:$stateParams.itemId,specialId:item.config.autoId,action:'edit'});
    };
    // 添加按钮
    $scope.add = function(){
      $state.go('admin.payment.additemspecial', {itemId:$stateParams.itemId,action:'add'});
    };
    // 删除按钮
    $scope.del = function(item){
      //if(window.confirm("确定要删除 "+ item.name + " 该项目吗?")){
      Models.init('ItemConfig/id').actions('delete',{},{'autoId':item.config.autoId}).then(function(ret){
        if(ret.meta.code == 200){
          notify({message:'该项目已删除',classes:'alert-success'});
          $scope.tableParams.reload();
        }else{
          notify({message:ret.meta.error + " " + ret.meta.info , classes:'alert-danger'});
        }
      });
      //}
    };

    $scope.getPageList();
  });
