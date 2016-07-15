/**
 * Created by Administrator on 2016/7/14.
 */
app.controller('AccountCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth) {

  $scope.key = 'account';
  $scope.the_search = {};
  $scope.ucauth = ucauth;
  $scope.flag = {};
  $scope.flag.add_employee = false;
  $scope.flag.edit_employee = false;
  $scope.flag.del_employee = false;
  $scope.flag.save_menugroup = false;

  ucauth.hasRole('add_employee', $scope.flag);
  ucauth.hasRole('edit_employee', $scope.flag);
  ucauth.hasRole('del_employee', $scope.flag);
  ucauth.hasRole('save_menugroup', $scope.flag);

  // 获取分页数据
  $scope.getPageList = function () {

    $scope.the_params = angular.extend({
      page: 1,
      count: 10,
      // sorting: {
      //   autoId: 'desc'     // initial sorting
      // }
    }, $location.search());

    $scope.tableParams = new ngTableParams($scope.the_params, {
      total: 0,           // length of data
      //counts: [],
      getData: function ($defer, params) {
        // console.log(params);
        $location.search(params.url());

        var the_param = {pageSize: params.count(), pageIndex: params.page()};

        the_param = angular.extend(the_param, $scope.the_search);

        // // 排序
        // var the_sorting = params.sorting();
        // var keys = lodash.keys(the_sorting);
        // var values = lodash.values(the_sorting);
        // if (angular.isDefined(keys[0])) {
        //   var sort_param = keys[0] + ':' + values[0];
        //   //the_param = angular.extend(the_param,{sorting:sort_param});
        //   the_param.sorting = sort_param;
        // }

        $scope.adminsListPromise = Models.init('Admins').actions('list', the_param).then(function (ret) {
          // console.log(ret);
          params.total(ret.totalRecord);
          $defer.resolve(ret.data);

        }, function (err) {
          notify({message: err.data.info, classes: 'alert-danger'});
        });
      }
    });

  };

  // 编辑按钮
  $scope.edit = function (item) {
    $state.go('admin.sys.edit', {itemId: item.autoId, action: 'edit'});
  };
  // 添加按钮
  $scope.add = function () {
    $state.go('admin.sys.add', {action: 'add'});
  };

  //重置密码
  $scope.resetPwd=function (item) {
    Models.init('Admins/AutoId').actions('delete', {}, {'autoId': item.autoId}).then(function (ret) {
        notify({message: '该员工已删除', classes: 'alert-success'});
        $scope.tableParams.reload();
      },
      function (err) {
        notify({message: err.data.info, classes: 'alert-danger'});
      });
  };

  // 删除按钮
  $scope.del = function (item) {
    //if(window.confirm("确定要删除 "+ item.title + " 吗?")){
    Models.init('Admins/AutoId').actions('delete', {}, {'autoId': item.autoId}).then(function (ret) {
        notify({message: '该员工已删除', classes: 'alert-success'});
        $scope.tableParams.reload();
      },
      function (err) {
        notify({message: err.data.info, classes: 'alert-danger'});
      });
    //}
  };

  // 活动详情
  $scope.entry = function (item) {
    $state.go('admin.activities.entry', {itemId: item.autoId, action: 'entry'});
  };

  $scope.$on('on_search', function (e, data) {
    $scope.the_search = data;
    $scope.getPageList();
  });

  $scope.getPageList();

});

app.controller('ActivitiesSearchCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth) {
  $scope.the_search = {};
  $scope.search = function () {
    $scope.$broadcast('on_search', $scope.the_search);
  };
});
