/**
 * Created by wxz on 16/7/16.
 */
app.controller('ActivitySignupCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, config, notify, ucauth) {

  //console.log($stateParams.activityId);

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
        var the_param = {pageSize: params.count(), pageIndex: params.page(),autoId:$stateParams.activityId};

        $scope.signupListPromise = Models.init('Activities/Signup').actions('signup',the_param).then(function (ret) {
          //console.log(ret);
          params.total(ret.totalRecord);
          $defer.resolve(ret.data);

        }, function (err) {
          notify({message: err.data.info, classes: 'alert-danger'});
        });
      }
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

  $scope.getPageList();

});
