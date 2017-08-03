app.controller('TeamMembersCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, config,ngDialog, notify, ucauth) {

  $scope.search = {};

  $scope.ucauth = ucauth;
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
        var the_param = {pageSize: params.count(), pageIndex: params.page(), activityId: $stateParams.activityId};
        the_param = angular.extend(the_param, $scope.search);
        $scope.activityListPromise = Models.init('Teams/users').actions('users', the_param).then(function (ret) {
          //console.log(ret);
          params.total(ret.totalRecord);
          $defer.resolve(ret.data);
        }, function (err) {
          notify({message: err.data.info, classes: 'alert-danger'});
        });
      }
    });

  };



  //审核
  $scope.audit = function (item) {
    ngDialog.open({
      template: 'auditMemberTpl',
      controller: 'AuditMemberWindow',
      resolve: {
        item: function enteringFactory() {
          return item;
        }
      },
      preCloseCallback: function (value) {
        $scope.tableParams.reload();
      }
    });
  }

  //踢出成员
  $scope.deleteMember = function (item) {
    Models.init('Teams/outUser').actions('delete', {joinId: item.autoId}).then(function (ret) {
      notify({message: '踢出成功', classes: 'alert-success'});
      $scope.tableParams.reload();
    }, function (err) {
      notify({message: err.data.info, classes: 'alert-danger'});
    });
  }

  $scope.getPageList();


});

app.controller('AuditMemberWindow', function ($scope, Models, config,notify, item) {

  if (angular.isDefined(item)) {
    $scope.the_member = item;
  } else {
    $scope.the_member = {};
  }
  $scope.the_reply = {};
  $scope.submit = function (data) {
    Models.init('Teams/teams').actions('update', data).then(function (ret) {
      $scope.closeThisDialog();
    }, function (err) {
      notify({message: err.data.info, classes: 'alert-danger'});
    });
  };

  $scope.accept = function () {
    $scope.the_reply.joinedId = $scope.the_member.autoId
    $scope.the_reply.status = 'ADUTIED'
    $scope.submit($scope.the_reply);
  };
  $scope.reject = function () {
    $scope.the_reply.joinedId = $scope.the_member.autoId
    $scope.the_reply.status = 'REJECTED'
    $scope.submit($scope.the_reply);
  };
  $scope.close = function () {
    $scope.closeThisDialog();
  }
});
