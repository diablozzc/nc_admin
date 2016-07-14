'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:BylawCtrl
 * @description
 * # BylawCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('BylawCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth) {
    $scope.key = 'bylaw';
    $scope.the_search = {};
    $scope.action = $stateParams.action;

    $scope.ucauth = ucauth;
    $scope.flag = {};
    $scope.flag.add_bylaw = false;
    $scope.flag.edit_bylaw = false;
    $scope.flag.del_bylaw = false;

    ucauth.hasRole('add_bylaw',$scope.flag);
    ucauth.hasRole('edit_bylaw',$scope.flag);
    ucauth.hasRole('del_bylaw',$scope.flag);


    // 获取分页数据
    $scope.getPageList = function () {

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
            //the_param = angular.extend(the_param,{sorting:sort_param});
            the_param.sorting = sort_param;
          }

          $scope.bylawListPromise = Models.init('Bylaws').actions('list', the_param).then(function (ret) {
            //console.log(ret);
            if (ret.meta.code === 200) {
              params.total(ret.data.totalRecord);
              $defer.resolve(ret.data.data);
            }
          });
        }
      });

    };


    // 编辑按钮
    $scope.edit = function (item) {
      $state.go('admin.bylaw.edit', {itemId: item.autoId, action: 'edit'});
    };
    // 添加按钮
    $scope.add = function () {
      $state.go('admin.bylaw.add', {action: 'add'});
    };
    // 删除按钮
    $scope.del = function (item) {
      //if (window.confirm('确定要删除 ' + item.title + ' 该条规章制度吗?')) {
        Models.init('Bylaws/id').actions('delete', {}, {'autoId': item.autoId}).then(function (ret) {
          if (ret.meta.code === 200) {
            notify({message: '删除成功', classes: 'alert-success'});
            $scope.tableParams.reload();
          } else {
            notify({message: ret.meta.error + ' ' + ret.meta.info, classes: 'alert-danger'});
          }
        });
      //}
    };


    $scope.search = function(){
      $location.search(angular.extend($location.search(),$scope.the_search));
      $scope.getPageList();
    };

    $scope.getPageList();
  });
