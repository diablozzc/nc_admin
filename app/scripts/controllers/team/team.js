app.controller('TeamCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, config, notify, ucauth) {

  $scope.search = {};
  $scope.search.title = '';
  $scope.search.startTime = '';
  $scope.search.endTime = '';
  $scope.search.keyword = '';
  $scope.user = ucauth.getUser();
  $scope.isAdmin = $scope.user.username === 'admin' ? true : false
  // console.log($state.current.url);
  // console.log($state.current.url=='/published/list');
  //控制状态查询条件的显示
  if ($state.current.url == '/published/list') {
    $scope.status_able = false;

  } else if ($state.current.url == '/edit/list') {
    $scope.status_able = false;
  }
  else if ($state.current.url == '/search/list') {
    $scope.status_able = true;
    //console.log($state.current.url);
  }


  $scope.statuslist = lodash.clone(config.data.states.ActivityStatus);
  $scope.statuslist.unshift({name: '全部'});

  $scope.datePicker = {
    date: {startDate: undefined, endDate: undefined}
  };


  $scope.ucauth = ucauth;
  $scope.flag = {};
  //$scope.flag.publish_activity = false;
  $scope.flag.edit_team = false;
  $scope.flag.back_team = false;
  $scope.flag.delete_team = false;


  //ucauth.hasRole('publish_activity', $scope.flag);
  ucauth.hasRole('edit_team', $scope.flag);
  ucauth.hasRole('back_team', $scope.flag);
  ucauth.hasRole('delete_team', $scope.flag);

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


        the_param = angular.extend(the_param, $scope.search);
        $scope.activityListPromise = Models.init('Teams').actions('list', the_param).then(function (ret) {
          //console.log(ret);
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
    $state.go('admin.team.edit', {itemId: item.autoId, action: 'edit'});
  };
  //报名信息
  $scope.signupinfo = function (item) {
    $state.go('admin.team.members', {activityId: item.autoId});
  }

  //发布
  $scope.publish = function (item) {
    Models.init('UpdateTeamStatus').actions('update', {}, {
      'activityId': item.autoId,
      'status': '1'
    }).then(function (ret) {
        notify({message: '发布成功!', classes: 'alert-success'});
        $scope.tableParams.reload();
      },
      function (err) {
        notify({message: err.data.info, classes: 'alert-danger'});
      });
  }
  // 删除按钮
  $scope.del = function (item) {
    Models.init('Teams').actions('delete', {}, {'activityId': item.autoId}).then(function (ret) {
        notify({message: '删除成功!', classes: 'alert-success'});
        $scope.tableParams.reload();
      },
      function (err) {
        notify({message: err.data.info, classes: 'alert-danger'});
      });
  };

  // 收回按钮
  $scope.back = function (item) {
    Models.init('UpdateTeamStatus').actions('update', {}, {
      'activityId': item.autoId,
      'status': '2'
    }).then(function (ret) {
        notify({message: '收回成功!', classes: 'alert-success'});
        $scope.tableParams.reload();
      },
      function (err) {
        notify({message: err.data.info, classes: 'alert-danger'});
      });
  };

  $scope.search = function () {
    $scope.getPageList();
  };

  $scope.getPageList();

});
