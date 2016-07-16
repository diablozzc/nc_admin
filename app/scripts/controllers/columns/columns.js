/**
 * Created by wxz on 16/7/15.
 */
app.controller('ColumnCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth) {


  // $scope.the_search = {};
  // $scope.ucauth = ucauth;
  // $scope.flag = {};
  $scope.flag.set_poster = false;
  $scope.flag.set_outurl = false;
  // $scope.flag.edit_activity = false;
  // $scope.flag.remove_activity = false;
  // $scope.flag.entry_activity = false;
  //
  ucauth.hasRole('set_poster', $scope.flag);
  ucauth.hasRole('set_poster', $scope.flag);
  // ucauth.hasRole('edit_activity',$scope.flag);
  // ucauth.hasRole('remove_activity',$scope.flag);
  // ucauth.hasRole('entry_activity',$scope.flag);

  // 获取数据
  $scope.getList = function () {
    $scope.the_params = {};

    $scope.tableParams = new ngTableParams($scope.the_params, {
      total: 0,           // length of data
      //counts: [],
      getData: function ($defer, params) {
        var the_param = {};
        $scope.columnListPromise = Models.init('Columns/Posters').actions('list', the_param).then(function (ret) {
          //console.log(ret);
          $defer.resolve(ret);

        }, function () {
          $defer.resolve(ret);
        });
      }
    });

  };
  $scope.outUrl = '';
  $scope.getCommunityOutUrl = function () {
    $scope.the_params = {};
    var the_param = {};
    Models.init('Columns/Communities').actions('get', the_param).then(function (ret) {
      console.info(ret);
      //$defer.resolve(ret);
      $scope.outUrl=ret.value;
    }, function () {

    });


  };
  $scope.setUrl=function () {
    $scope.the_params = {};
    var the_param = {outUrl:$scope.outUrl};
    Models.init('Columns/Communities').actions('put', the_param).then(function (ret) {
      //console.info(ret);
      notify({message: '设置成功', classes: 'alert-success'});
      $state.go('admin.sys.column');
    }, function (err) {
      notify({message: err.data.info, classes: 'alert-danger'});
      $state.go('admin.sys.column');
    });
  }

  // 设置
  $scope.set = function(item){
    $state.go('admin.sys.setposter',{itemKey:item.columnKey});
  };
  // // 添加按钮
  // $scope.add = function(){
  //   $state.go('admin.activities.add', {action:'add'});
  // };
  // // 删除按钮
  // $scope.del = function(item){
  //   //if(window.confirm("确定要删除 "+ item.title + " 吗?")){
  //   Models.init('Activities/id').actions('delete',{},{'autoId':item.autoId}).then(function(ret){
  //     if(ret.meta.code == 200){
  //       notify({message:'该活动已删除',classes:'alert-success'});
  //       $scope.tableParams.reload();
  //     }else{
  //       notify({message:ret.meta.error + " " + ret.meta.info , classes:'alert-danger'});
  //     }
  //   });
  //   //}
  // };
  //
  // // 活动详情
  // $scope.entry = function(item){
  //   $state.go('admin.activities.entry',{itemId:item.autoId,action:'entry'});
  // };
  //
  // $scope.$on('on_search',function(e,data){
  //   $scope.the_search = data;
  //   $scope.getPageList();
  // });

  $scope.getList();
  $scope.getCommunityOutUrl();




});
