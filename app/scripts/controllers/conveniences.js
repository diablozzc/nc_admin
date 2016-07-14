'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:ConveniencesCtrl
 * @description
 * # ConveniencesCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('ConveniencesCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth) {

    $scope.key = 'conveniences';
    $scope.conveniences_list = [];
    $scope.the_search = {};

    $scope.ucauth = ucauth;
    $scope.flag = {};
    $scope.flag.add_convenience = false;
    $scope.flag.edit_convenience = false;
    $scope.flag.del_convenience = false;

    ucauth.hasRole('add_convenience',$scope.flag);
    ucauth.hasRole('edit_convenience',$scope.flag);
    ucauth.hasRole('del_convenience',$scope.flag);

    // 获取分页数据
    $scope.getPageList = function(){

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

          $scope.conveniencesListPromise = Models.init('Conveniences').actions('list',the_param).then(function(ret){
            if(ret.meta.code == 200){
              params.total(ret.data.totalRecord);
              $defer.resolve(ret.data.data);
            }
          });

        }
      });


      //Models.init('Conveniences').actions('list',params).then(function(ret){
      //  //console.log(ret);
      //  if(ret.meta.code == 200){
      //    $scope.tp = ret.data.pageTotal;
      //    $scope.conveniences_list = ret.data.data;
      //  }
      //});

    };

    // 编辑按钮
    $scope.edit = function(item){
      $state.go('admin.conveniences.edit',{itemId:item.autoId,action:'edit'});
    };
    // 添加按钮
    $scope.add = function(){
      $state.go('admin.conveniences.add', {action:'add'});
    };
    // 删除按钮
    $scope.del = function(item){
      //if(window.confirm("确定要删除该信息吗?")){
        Models.init('Conveniences/id').actions('delete',{},{'autoId':item.autoId}).then(function(ret){
          if(ret.meta.code == 200){
            notify({message:'已删除',classes:'alert-success'});
            $scope.getPageList();
          }else{
            notify({message:ret.meta.error + " " + ret.meta.info , classes:'alert-danger'});
          }
        });
      //}
    };

    $scope.getPageList();

    // 更新数据表
    //$scope.updateGrid = function(e,data){
    //  if(!angular.isUndefined(data)){
    //    $scope.cp = data.curpage;
    //  }
    //  var params_data = {page:true,pageSize:$scope.pageSize,pageIndex:$scope.cp,name:$scope.keyword};
    //  //if(!angular.isUndefined($scope.the_community)){
    //  //  params_data.community = $scope.the_community;
    //  //}
    //  //console.log(params_data);
    //  $scope.getPageList(params_data);
    //};
    //
    ////$scope.changeCommunity = function(val){
    ////  $scope.the_community = val;
    ////  $scope.updateGrid();
    ////};
    //
    //// 过滤参数相关
    //// 读取本地缓存的参数
    //$scope.params = localStorageService.get($scope.key + '.params');
    //
    //if($scope.params){
    //  $scope.keyword = $scope.params.keyword;
    //  $scope.tp = 1;
    //  $scope.cp = $scope.params.p;
    //  $scope.ms = 5;
    //}else{
    //  $scope.keyword = '';
    //  $scope.tp = 1;
    //  $scope.cp = 1;
    //  $scope.ms = 5;
    //
    //  $scope.params = {p:$scope.cp,keyword:$scope.keyword};
    //  localStorageService.set($scope.key + '.params',$scope.params);
    //}
    //
    //$scope.pageSize = 10;
    //
    //$scope.$on('update_page',$scope.updateGrid);
    //
    //$scope.$on('$stateChangeSuccess',
    //  function(event, toState, toParams, fromState, fromParams){
    //    $scope.updateGrid();
    //  });
  });
