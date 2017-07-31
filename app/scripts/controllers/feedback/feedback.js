/**
 * Created by Administrator on 2016/7/19.
 */
app.controller('FeedbackCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth, ngDialog, config) {

  $scope.key = 'Feedback';
  $scope.ucauth = ucauth;
  $scope.flag = {};
  $scope.status_list = [];
  $scope.column_list = [];
  $scope.the_article = {};
  $scope.flag.reply_feedback = false;//回复我有话说
  $scope.flag.audit_feedback = false;//审核我有话说

  $scope.flag.disabled = "false";
  $scope.flag.list = false;//已发布
  $scope.flag.listedit = false;//继续编辑
  $scope.flag.search = false;//搜索
  var action = $stateParams.action;
  $scope.action = $stateParams.action;

  ucauth.hasRole('reply_feedback', $scope.flag);
  ucauth.hasRole('audit_feedback', $scope.flag);


  $scope.datePicker = {
    date: {startDate: undefined, endDate: undefined}
  };
  $scope.dateChange = function () {
    $scope.the_article.startTime = $scope.datePicker.date.startDate.valueOf();
    $scope.the_article.endTime = $scope.datePicker.date.endDate.valueOf();
  };

  $scope.$on('updateDate', function (e, value) {
    $scope.the_article.startTime = angular.isUndefined(value.startDate) ? null : value.startDate.valueOf();
    $scope.the_article.endTime = angular.isUndefined(value.endDate) ? null : value.endDate.valueOf();
  })
  $scope.getStatusList = function () {
    //状态
    $scope.status_list = lodash.clone(config.data.states.publishStatus);
    $scope.status_list.unshift({name: '全部'});
    //栏目
    $scope.column_list = lodash.clone(config.data.states.columnName);
    $scope.column_list.unshift({name: '全部'});
  }


  $scope.audit = function (item) {
    // console.log(autoId);
    // console.log(status);
    Models.init('Feedback/audit').actions('audit', {'status': item.status}, {'autoId': item.autoId}).then(function (ret) {
        notify({message: '审核成功!', classes: 'alert-success'});
        $scope.tableParams.reload();
      },
      function (err) {
        notify({message: err.data.info, classes: 'alert-danger'});
      });
  };

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
        $scope.feedbackListPromise = Models.init('Feedback/list').actions('list', the_param).then(function (ret) {
          params.total(ret.totalRecord);
          $defer.resolve(ret.data);
        }, function (err) {
          console.log(err);
          notify({message: err.data.info, classes: 'alert-danger'});
        });
      }
    });
  };
  switch (action) {
    case 'search':
      $scope.flag.disabled = "false";
      $scope.flag.search = true;
      console.log($scope.flag.disabled);
      break;
    case 'list':
      $scope.flag.disabled = "true";
      $scope.flag.list = true
      $scope.the_article.status = 1;
      console.log($scope.flag.disabled);
      break;
    case 'listedit':
      $scope.flag.listedit = true;
      $scope.flag.disabled = "true";
      $scope.the_article.status = 0;
      console.log($scope.flag.disabled);
      break;

  }
  // 回复
  $scope.reply = function (item) {
    ngDialog.open({
      template: 'replyFeedbackTpl',
      controller: 'ReplyFeedbackWindow',
      resolve: {
        item: function enteringFactory() {
          return item;
        }
      },
      preCloseCallback: function (value) {
        $scope.tableParams.reload();
      }
    });
  };


  //搜索
  $scope.search = function () {
    $scope.getPageList();
  }
  // 详情
  $scope.entry = function (item) {
    localStorageService.set('the_feedback_' + item.autoId, item);
    $state.go('admin.feedback.detail', {itemId: item.autoId, action: 'entry'});
  };

  //获取一张图片
  $scope.getImgUrl = function (urls) {
    var imgUrl = "";
    if (urls) {
      var imgs = urls.split(',');
      if (imgs.length > 0)
        imgUrl = imgs[0];
    }
    // console.log(imgUrl);
    return imgUrl;
  }
  $scope.getPageList();

});
app.controller('ReplyFeedbackWindow', function ($scope, Models, config, item) {

  if (angular.isDefined(item)) {
    $scope.the_feedback = item;
  } else {
    $scope.the_feedback = {};
  }
  $scope.the_reply = {};
  $scope.submit = function (data) {

    Models.init('Replies/reply').actions('reply', data).then(function (ret) {
      $scope.closeThisDialog();
    });
  };

  $scope.accept = function () {
    $scope.the_reply.type = 1;
    $scope.the_reply.message = item.autoId;
    $scope.the_reply.replyType = 0;//居委会
    $scope.submit($scope.the_reply);
  };

  $scope.close = function () {
    $scope.closeThisDialog();
  }
});
