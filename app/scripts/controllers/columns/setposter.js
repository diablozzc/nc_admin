/**
 * Created by wxz on 16/7/16.
 */
/**
 * Created by wxz on 16/7/15.
 */
app.controller('SetPosterCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models,config, notify, ucauth) {

  $scope.TrueOrFalse_list = config.data.states.TrueOrFalse;
  $scope.flag.set_poster = false;
  ucauth.hasRole('set_poster', $scope.flag);
  // 获取传过来的数据
  $scope.column={};
  $scope.column.columnKey=$stateParams.itemKey;

  $scope.upload_param = {pub: 'pub', fileType: 'column_poster'};
  var the_param = {};

  Models.init('Columns/ColumnKey/Posters').actions('get', the_param,{columnKey:$scope.column.columnKey}).then(function (ret) {
    console.info(ret);
    //$defer.resolve(ret);
    $scope.column.name=ret.name;
    $scope.column.isShowPoster=ret.isShowPoster;
    $scope.column.posterUrl=ret.posterUrl;
    $scope.column.posterImageUrl=ret.posterImageUrl;
  }, function () {

  });

  $scope.close = function () {
    $state.go('admin.sys.column');
  };

  $scope.save = function (keep) {
    if ($scope.SetPosterForm.$valid) {
      var the_param = {isShowPoster:$scope.column.isShowPoster,posterUrl: $scope.column.posterUrl,posterImageUrl: $scope.column.posterImageUrl};
          Models.init('Columns/ColumnKey/Posters').actions('put', the_param,{columnKey:$scope.column.columnKey}).then(function (ret) {
              notify({message: '设置成功', classes: 'alert-success'});
              $state.go('admin.sys.column');
            },
            function (err) {
              //console.log(err);
              notify({message: err.data.info, classes: 'alert-danger'});
              if (keep) {
                init();
              }
            }
          );
    }

  }
  ;

});
