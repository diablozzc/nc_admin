app.controller('TeamCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, config, notify, ucauth) {

  $scope.search = {};
  $scope.search.title = '';
  $scope.search.startTime = '';
  $scope.search.endTime = '';
  $scope.search.keyword = '';


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
  $scope.flag.edit_activity = false;
  $scope.flag.back_activity = false;
  $scope.flag.delete_activity = false;


  //ucauth.hasRole('publish_activity', $scope.flag);
  ucauth.hasRole('edit_activity', $scope.flag);
  ucauth.hasRole('back_activity', $scope.flag);
  ucauth.hasRole('delete_activity', $scope.flag);

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

        //控制状态查询参数
        if ($state.current.url == '/published/list') {
          $scope.search.status = 1;
        } else if ($state.current.url == '/edit/list') {
          $scope.search.status = 0;
        }

        the_param = angular.extend(the_param, $scope.search);
        $scope.activityListPromise = Models.init('Activities').actions('list', the_param).then(function (ret) {
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
    $state.go('admin.activity.edit', {itemId: item.autoId, action: 'edit'});
  };
  // // 添加按钮
  // $scope.add = function () {
  //   $state.go('admin.sys.add', {action: 'add'});
  // };
  //
  // //重置密码
  // $scope.resetPwd = function (item) {
  //   Models.init('Admins/AutoId').actions('delete', {}, {'autoId': item.autoId}).then(function (ret) {
  //       notify({message: '该员工已删除', classes: 'alert-success'});
  //       $scope.tableParams.reload();
  //     },
  //     function (err) {
  //       notify({message: err.data.info, classes: 'alert-danger'});
  //     });
  // };
  //
  //报名信息
  $scope.signupinfo=function(item){
    $state.go('admin.activity.signupinfo', {activityId: item.autoId});
  }

  // 删除按钮
  $scope.del = function (item) {
    //if(window.confirm("确定要删除 "+ item.title + " 吗?")){
    Models.init('Activities/autoId').actions('delete', {}, {'autoId': item.autoId}).then(function (ret) {
        notify({message: '删除成功!', classes: 'alert-success'});
        $scope.tableParams.reload();
      },
      function (err) {
        notify({message: err.data.info, classes: 'alert-danger'});
      });
    //}
  };

  // 收回按钮
  $scope.back = function (item) {

    Models.init('Activities/back').actions('back', {}, {'autoId': item.autoId}).then(function (ret) {
        notify({message: '收回成功!', classes: 'alert-success'});
        $scope.tableParams.reload();
      },
      function (err) {
        notify({message: err.data.info, classes: 'alert-danger'});
      });
  };
  //
  // // 活动详情
  // $scope.entry = function (item) {
  //   $state.go('admin.activities.entry', {itemId: item.autoId, action: 'entry'});
  // };
  $scope.search = function () {
    $scope.getPageList();
  };

  $scope.dateChange = function () {
    $scope.search.startTime = $scope.datePicker.date.startDate.valueOf();
    $scope.search.endTime = $scope.datePicker.date.endDate.valueOf();
  };

  // $scope.$on('updateDate', function (e, value) {
  //   $scope.search.startTime = angular.isUndefined(value.startDate) ? null : value.startDate.valueOf();
  //   $scope.search.endTime = angular.isUndefined(value.endDate) ? null : value.endDate.valueOf();
  // })

  $scope.getPageList();




});
