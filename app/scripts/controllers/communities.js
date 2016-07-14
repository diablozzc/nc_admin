'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:CommunitysCtrl
 * @description
 * # CommunitysCtrl
 * Controller of the propertyAdminApp
 */

app.controller('CommunitiesCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth) {

  $scope.key = 'communities';
  $scope.the_search = {};
  $scope.action = $stateParams.action;

  $scope.ucauth = ucauth;
  $scope.flag = {};
  $scope.flag.add_community = false;
  $scope.flag.edit_community = false;
  $scope.flag.del_community = false;

  ucauth.hasRole('add_community',$scope.flag);
  ucauth.hasRole('edit_community',$scope.flag);
  ucauth.hasRole('del_community',$scope.flag);



  // 获取分页数据
  $scope.getPageList = function () {

    $scope.the_params = angular.extend({
      page: 1,
      count: 5,
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
          //the_param = angular.extend(the_param,{sorting:sort_param});
          the_param.sorting = sort_param;
        }

        $scope.communitiesListPromise = Models.init('Communities').actions('list', the_param).then(function (ret) {
          if (ret.meta.code == 200) {
            params.total(ret.data.totalRecord);
            $defer.resolve(ret.data.data);
          }
        });
      }
    });

  };


  // 编辑按钮
  $scope.edit = function (item) {
    $state.go('admin.communities.edit', {itemId: item.autoId, action: 'edit'});
  };
  // 添加按钮
  $scope.add = function () {
    $state.go('admin.communities.add', {action: 'add'});
  };
  // 删除按钮
  $scope.del = function (item) {
    //if (window.confirm("确定要删除 " + item.name + " 该小区吗?")) {
      Models.init('Communities/id').actions('delete', {}, {'autoId': item.autoId}).then(function (ret) {
        if (ret.meta.code == 200) {
          notify({message: '删除成功', classes: 'alert-success'});
          $scope.tableParams.reload();
        } else {
          notify({message: ret.meta.error + " " + ret.meta.info, classes: 'alert-danger'});
        }
      });
    //}
  };

  $scope.$on('onAdd',function(e,item){
    $state.go('admin.communities.add', {action: 'add'});
  });

  $scope.$on('onEdit',function(e,item){
    $state.go('admin.communities.edit', {itemId: item.autoId, action: 'edit'});
  });

  $scope.$on('onDel',function(e,item){

    Models.init('Communities/id').actions('delete', {}, {'autoId': item.autoId}).then(function (ret) {
      if (ret.meta.code == 200) {
        notify({message: '删除成功', classes: 'alert-success'});
        $scope.tableParams.reload();
      } else {
        notify({message: ret.meta.error + " " + ret.meta.info, classes: 'alert-danger'});
      }
    });

  });




  $scope.getAreaList = function(){
    var theCityCode = ucauth.getUser().propertyInfo.city;
    Models.init('Provinces/getchild').actions('getchild',{parentId:theCityCode}).then(function(ret){
      $scope.area_list = ret.data;
      $scope.area_list.unshift({name:'不限'});
    });
  };

  $scope.selectedDataItem = undefined;
  $scope.$on('updateSelected',function(e,data){
    $scope.selectedDataItem = data;
  });

  $scope.search = function(){
    $location.search(angular.extend($location.search(),$scope.the_search));
    $scope.getPageList();
  };

  $scope.getPageList();
  $scope.getAreaList();

});
