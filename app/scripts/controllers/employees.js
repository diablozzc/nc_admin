'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:EmployeesCtrl
 * @description
 * # EmployeesCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('EmployeesCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify,config, ucauth) {

    $scope.ucauth = ucauth;
    $scope.flag = {};
    $scope.flag.add_employee = false;
    $scope.flag.edit_employee = false;
    $scope.flag.del_employee = false;
    $scope.flag.save_menugroup = false;

    ucauth.hasRole('add_employee',$scope.flag);
    ucauth.hasRole('edit_employee',$scope.flag);
    ucauth.hasRole('del_employee',$scope.flag);
    ucauth.hasRole('save_menugroup',$scope.flag);

    $scope.community_list = [];
    $scope.gender_list = lodash.clone(config.data.states.gender);
    $scope.gender_list.unshift({name:'不限'});

    Models.init('Communities').actions('list',{}).then(
      function(ret){
        $scope.community_list = ret.data;
        $scope.community_list.unshift({name:'不限'});
      }
    );

    $scope.key = 'employees';
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
          the_param.userTag = 1;

          $scope.adminListPromise = Models.init('Admins').actions('list',the_param).then(function(ret){

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
      $state.go('admin.employees.edit',{itemId:item.autoId,action:'edit'});
    };
    // 添加按钮
    $scope.add = function(){
      $state.go('admin.employees.add', {action:'add'});
    };
    // 删除按钮
    $scope.del = function(item){
      //if(window.confirm("确定要删除 "+item.name+" 吗?")){
        Models.init('Admins/id').actions('delete',{},{'autoId':item.autoId}).then(function(ret){
          if(ret.meta.code == 200){
            notify({message:'已删除',classes:'alert-success'});
            $scope.tableParams.reload();
          }else{
            notify({message:ret.meta.error + " " + ret.meta.info , classes:'alert-danger'});
          }
        });
      //}
    };
    // 分配菜单
    $scope.assignMenu = function(item){
      $state.go('admin.employees.menus', {itemId:item.autoId});
    };
    // 分配权限
    $scope.assignAuth = function(item){
      $state.go('admin.employees.auth', {itemId:item.autoId});
    };

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
