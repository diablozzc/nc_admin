'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:GuideCtrl
 * @description
 * # GuideCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('GuideCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth) {
    $scope.key = 'guide';
    $scope.the_search = {};
    $scope.action = $stateParams.action;
    $scope.ucauth = ucauth;
    $scope.flag = {};
    $scope.flag.add_guide = false;
    $scope.flag.edit_guide = false;
    $scope.flag.del_guide = false;

    ucauth.hasRole('add_guide',$scope.flag);
    ucauth.hasRole('edit_guide',$scope.flag);
    ucauth.hasRole('del_guide',$scope.flag);


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

          $scope.guideListPromise = Models.init('Guides').actions('list', the_param).then(function (ret) {
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
      $state.go('admin.guide.edit', {itemId: item.autoId, action: 'edit'});
    };
    // 添加按钮
    $scope.add = function () {
      $state.go('admin.guide.add', {action: 'add'});
    };
    // 删除按钮
    $scope.del = function (item) {
      Models.init('Guides/id').actions('delete', {}, {'autoId': item.autoId}).then(function (ret) {
        if (ret.meta.code === 200) {
          notify({message: '删除成功', classes: 'alert-success'});
          $scope.tableParams.reload();
        } else {
          notify({message: ret.meta.error + ' ' + ret.meta.info, classes: 'alert-danger'});
        }
      });
    };


    $scope.search = function(){
      $location.search(angular.extend($location.search(),$scope.the_search));
      $scope.getPageList();
    };

    $scope.getPageList();
  });
