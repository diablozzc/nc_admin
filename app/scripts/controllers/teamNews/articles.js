/**
 * Created by Administrator on 2016/7/15.
 */

app.controller('TeamArticlesCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth, config) {

  $scope.key = 'articlesSearch';
  $scope.ucauth = ucauth;
  $scope.flag = {};
  $scope.status_list = [];
  $scope.column_list = [];
  $scope.the_article = {};

  $scope.flag.edit_article = false;//修改
  $scope.flag.del_article = false;//删除
  $scope.flag.see_article = false;//详情
  $scope.flag.publish_article = false;//发布
  $scope.flag.back_article = false;//收回

  $scope.flag.disabled = "false";
  $scope.flag.list = false;//已发布
  $scope.flag.listedit = false;//继续编辑
  $scope.flag.search = false;//搜索
  var action = $stateParams.action;
  $scope.action = $stateParams.action;
  $scope.isAdmin = $scope.user.username === 'admin' ? true : false

  ucauth.hasRole('edit_article', $scope.flag);
  ucauth.hasRole('del_article', $scope.flag);
  ucauth.hasRole('see_article', $scope.flag);
  ucauth.hasRole('publish_article', $scope.flag);
  ucauth.hasRole('back_article', $scope.flag);
  $scope.teams = []

  $scope.datePicker = {
    date: {startDate: undefined, endDate: undefined}
  };
//初始化获取团队
  $scope.initData = function () {
    var the_param = {pageSize: 100000, pageIndex: 1}
    Models.init('Teams').actions('list', the_param).then(function (ret) {
      $scope.teams = ret.data;
      // if ($scope.isAdmin) {
      //   $scope.teams.unshift({name: '全部'})
      // } else {
        if ($scope.teams.length > 0) {
          $scope.the_article.teamId = $scope.teams[0].autoId
        }
      // }
      $scope.getPageList();
    }, function (err) {
      notify({message: err.data.info, classes: 'alert-danger'});
    });
  }
  $scope.initData()
  $scope.dateChange = function (value) {
    // console.log(value);
    // console.log($scope.datePicker);
    // $scope.the_article.startTime = $scope.datePicker.date.startDate.valueOf();
    // $scope.the_article.endTime = $scope.datePicker.date.endDate.valueOf();
  };

  $scope.$on('updateDate', function (e, value) {
    console.log(value);
    $scope.the_article.startTime = angular.isUndefined(value.startDate) ? null : value.startDate.valueOf();
    $scope.the_article.endTime = angular.isUndefined(value.endDate) ? null : value.endDate.valueOf();
  });
  $scope.getStatusList = function () {
    //状态
    $scope.status_list = lodash.clone(config.data.states.publishStatus);
    $scope.status_list.unshift({name: '全部'});
    //栏目
    $scope.column_list = lodash.clone(config.data.states.columnName);
    $scope.column_list.unshift({name: '全部'});
  };

  //评论管理
  $scope.goToComment = function (item) {
    console.log(item)
    $state.go('admin.teamComment.list', {itemId: item.autoId});
  }

  // 获取分页数据
  $scope.getPageList = function () {
    $scope.the_params = angular.extend({
      page: 1,
      count: 10
    }, $location.search());
    $scope.tableParams = new ngTableParams($scope.the_params, {
      total: 0,           // length of data
      getData: function ($defer, params) {
        $location.search(params.url());
        var the_param = {pageSize: params.count(), pageIndex: params.page()};
        the_param = angular.extend(the_param, $scope.the_article);
        $scope.articlesListPromise = Models.init('Articles/list').actions('list', the_param).then(function (ret) {
          params.total(ret.totalRecord);
          $defer.resolve(ret.data);
        }, function (err) {
          notify({message: err.data.info, classes: 'alert-danger'});
        });
      }
    });
  };
  switch (action) {
    case 'search':
      $scope.flag.disabled = "false";
      $scope.flag.search = true;
      // console.log($scope.flag.disabled);
      break;
    case 'list':
      $scope.flag.disabled = "true";
      $scope.flag.list = true
      $scope.the_article.status = 1;
      // console.log($scope.flag.disabled);
      break;
    case 'listedit':
      $scope.flag.listedit = true;
      $scope.flag.disabled = "true";
      $scope.the_article.status = 0;
      // console.log($scope.flag.disabled);
      break;

  }
  // 编辑按钮
  $scope.edit = function (item) {
    $state.go('admin.teamNews.edit', {itemId: item.autoId, action: 'edit'});
  };
  // 添加按钮
  $scope.add = function () {
    $state.go('admin.teamNews.add', {action: 'add'});
  };
  // 删除按钮
  $scope.del = function (item) {
    Models.init('Articles/autoId').actions('delete', {}, {'autoId': item.autoId}).then(function (ret) {
        notify({message: '删除成功', classes: 'alert-success'});
        $scope.tableParams.reload();
      },
      function (err) {
        notify({message: err.data.info, classes: 'alert-danger'});
      });
  };
  //发布
  $scope.publish = function (item) {
    console.log(item);
    Models.init('Articles/publish').actions('publish', {}, {'autoId': item.autoId}).then(function (ret) {
        notify({message: '发布成功', classes: 'alert-success'});
        $scope.tableParams.reload();
      },
      function (err) {
        notify({message: err.data.info, classes: 'alert-danger'});
      });
  };
//收回
  $scope.back = function (item) {
    Models.init('Articles/back').actions('back', {}, {'autoId': item.autoId}).then(function (ret) {
        notify({message: '收回成功', classes: 'alert-success'});
        $scope.tableParams.reload();
      },
      function (err) {
        notify({message: err.data.info, classes: 'alert-danger'});
      });
  };
  //搜索
  $scope.search = function () {
    $scope.getPageList();
  };
  // 文章详情
  $scope.entry = function (item) {
    $state.go('admin.activities.entry', {itemId: item.autoId, action: 'entry'});
  };


  $scope.getStatusList();

});
