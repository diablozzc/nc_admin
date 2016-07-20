/**
 * Created by Administrator on 2016/7/19.
 */
app.controller('FeedbackDetailCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth, ngDialog, config) {

  $scope.the_feedback = {};

  var action = $stateParams.action;
  $scope.action = $stateParams.action;
  switch (action) {
    case 'entry':
      // $scope.the_feedback = localStorageService.get('the_feedback_' + $stateParams.itemId);
      Models.init('Feedback/AutoId').actions('get', {'autoId': $stateParams.itemId}).then(
        function (ret) {
          $scope.the_feedback = ret;
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
});
