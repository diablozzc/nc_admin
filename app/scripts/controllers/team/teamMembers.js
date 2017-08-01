app.controller('TeamMembersCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, config, notify, ucauth) {

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

  $scope.getPageList();


});
