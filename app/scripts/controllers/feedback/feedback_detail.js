/**
 * Created by Administrator on 2016/7/19.
 */
app.controller('FeedbackDetailCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth, ngDialog, config) {

  $scope.the_feedback = {};

  var action = $stateParams.action;
  $scope.action = $stateParams.action;
  $scope.images=[];//图片

  switch (action) {
    case 'entry':
      Models.init('Feedback/AutoId').actions('get', {'autoId': $stateParams.itemId}).then(
        function (ret) {
          $scope.the_feedback = ret;
          if (ret.image) {
            var imgs = ret.image.split(',');
            $scope.images=imgs;
          }
        },
        function (err) {
          notify({message: err.data.info, classes: 'alert-danger'});
        });
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
  $scope.preImageUrl="";
  $scope.preImage=function (url) {
    $scope.preImageUrl=url;
    // console.log($scope.preImageUrl);
  }
});
