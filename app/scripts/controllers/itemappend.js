'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:ItemappendCtrl
 * @description
 * # ItemappendCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('ItemAppendCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth) {
    $scope.key = 'item_append';
    $scope.itemappend_list = [];

    $scope.ucauth = ucauth;
    $scope.flag = {};
    $scope.flag.add_append_item = false;
    $scope.flag.edit_append_item = false;
    $scope.flag.del_append_item = false;

    ucauth.hasRole('add_append_item',$scope.flag);
    ucauth.hasRole('edit_append_item',$scope.flag);
    ucauth.hasRole('del_append_item',$scope.flag);

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

          the_param.item = $stateParams.itemId;

          $scope.itemAppendListPromise = Models.init('ItemAppend').actions('list',the_param).then(function(ret){
            console.log(ret);

            if(ret.meta.code == 200){
              //lodash.map(ret.data,function(n){
              //  n.months+='个月';
              //});
              params.total(ret.data.totalRecord);
              $defer.resolve(ret.data.data);
            }
          });

        }
      });

    };

    // 编辑按钮
    $scope.edit = function(item){
      $state.go('admin.payment.edititemappend',{itemId:$stateParams.itemId,appendId:item.itemAppend.autoId,action:'edit'});
    };
    // 添加按钮
    $scope.add = function(){
      $state.go('admin.payment.additemappend', {itemId:$stateParams.itemId,action:'add'});
    };
    // 删除按钮
    $scope.del = function(item){
      //if(window.confirm("确定要删除 "+ item.name + " 该项目吗?")){
      Models.init('ItemAppend/id').actions('delete',{},{'autoId':item.itemAppend.autoId}).then(function(ret){
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
