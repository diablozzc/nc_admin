'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:AffichesCtrl
 * @description
 * # AffichesCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('AffichesCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth) {
    $scope.key = 'affiches';
    $scope.affiches_list = [];
    $scope.the_search = {};

    $scope.ucauth = ucauth;
    $scope.flag = {};
    $scope.flag.add_affiche = false;
    $scope.flag.edit_affiche = false;
    $scope.flag.cancel_affice = false;
    $scope.flag.publish_affice = false;
    $scope.flag.details_affice = false;

    ucauth.hasRole('add_affiche',$scope.flag);
    ucauth.hasRole('edit_affiche',$scope.flag);
    ucauth.hasRole('cancel_affiche',$scope.flag);
    ucauth.hasRole('publish_affiche',$scope.flag);
    ucauth.hasRole('details_affiche',$scope.flag);

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

          $scope.affichesListPromise = Models.init('Affiches').actions('list',the_param).then(function(ret){
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
      $state.go('admin.affiches.edit',{itemId:item.autoId,action:'edit'});
    };
    // 添加按钮
    $scope.add = function(){
      $state.go('admin.affiches.add', {action:'add'});
    };
    // 撤销按钮
    $scope.cancel = function(item){
      //if(window.confirm("确定要撤销该公告吗?")){
        Models.init('Affiches/cancel/id').actions('cancel',{},{'autoId':item.autoId}).then(function(ret){
          if(ret.meta.code == 200){
            notify({message:'已撤销',classes:'alert-success'});
            $scope.tableParams.reload();
          }else{
            notify({message:ret.meta.error + " " + ret.meta.info , classes:'alert-danger'});
          }
        });
      //}
    };
    // 发布按钮
    $scope.publish = function(item){
      $state.go('admin.affiches.publish',{itemId:item.autoId,action:'publish'});
    };
    // 发布详情
    $scope.details = function(item){
      $state.go('admin.affiches.details',{itemId:item.autoId,action:'details'});
    };

    // 查找
    $scope.search = function(){
      $location.search(angular.extend($location.search(),$scope.the_search));
      $scope.getPageList();
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

    //$scope.changeCommunity = function(val){
    //  $scope.the_community = val;
    //  $scope.updateGrid();
    //};

    // 过滤参数相关
    // 读取本地缓存的参数
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
