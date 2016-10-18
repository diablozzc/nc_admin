/**
 * Created by wxz on 16/7/15.
 */
app.controller('ColumnConfigCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth) {


  // $scope.the_search = {};
  // $scope.ucauth = ucauth;
  // $scope.flag = {};
  // $scope.flag.set_poster = false;
  // $scope.flag.set_outurl = false;
  // $scope.flag.edit_activity = false;
  // $scope.flag.remove_activity = false;
  // $scope.flag.entry_activity = false;
  //
  // ucauth.hasRole('set_poster', $scope.flag);
  // ucauth.hasRole('set_outurl', $scope.flag);
  // ucauth.hasRole('edit_activity',$scope.flag);
  // ucauth.hasRole('remove_activity',$scope.flag);
  // ucauth.hasRole('entry_activity',$scope.flag);

  // 获取数据
  $scope.getList = function (item) {
    $scope.the_params = {};

    $scope.tableParams = new ngTableParams($scope.the_params, {
      total: 0,           // length of data
      //counts: [],
      getData: function ($defer, params) {
        var the_param = {};
        $scope.columnListPromise = Models.init('Columns/Config').actions('get', the_param).then(function (ret) {
          //console.log(ret);
          $defer.resolve(ret);

        }, function () {
          $defer.resolve(ret);
        });
      }
    });

  };
  
  $scope.readNumControl=function (item) {
    Models.init('Columns/Config/ShowReadNum').actions('put', {'showReadNum': item.showReadNum}, {'autoId': item.autoId}).then(function (ret) {
        notify({message: '操作成功!', classes: 'alert-success'});
        $scope.tableParams.reload();
      },
      function (err) {
        notify({message: err.data.info, classes: 'alert-danger'});
      });
  }


  $scope.getList();
  
});
