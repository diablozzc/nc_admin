/**
 * Created by Administrator on 2016/7/16.
 */
app.controller('EditorarticleCtrl', function ($rootScope, $scope, $state, $stateParams, localStorageService, uiGridConstants, Models, notify, config, ucauth) {

  $scope.column_list = [];
  //栏目
  $scope.column_list = lodash.clone(config.data.states.columnName);
  //类型
  $scope.showType_list = [];
  $scope.showType_list = lodash.clone(config.data.states.showType);
  $scope.user = ucauth.getUser();


  var action = $stateParams.action;
  $scope.action = $stateParams.action;


  var init = function () {
    $scope.the_article = {};
  };

  $scope.upload_param = {pub: 'pub', fileType: 'activity_poster'};

  switch (action) {
    case 'new':
      $scope.form_title = '新增文章';
      init();
      break;
    case 'edit':
      $scope.form_title = '修改文章信息';
      // console.log($stateParams.itemId);
      Models.init('Articles/Web/autoId').actions('get', {'autoId': $stateParams.itemId}).then(
        function (ret) {
          $scope.the_article = ret;
          $scope.articleContent = $scope.the_article.content;
        }
      );
      break;
  }

  $scope.deleteUploadFile = function (index, file) {
    var data = {};
    data.fileName = file.fileName;
    data.pub = file.pub;
    data.fileType = file.fileType;

    // Models.init('Upload').actions('delete',data).then(function(ret){
    //
    // });
    $scope.files.splice(index, 1);
    $scope.$broadcast('updateResult');
    $scope.saved = false;
  };


  $scope.save = function (keep) {
    if ($scope.articleForm.$valid) {
      switch (action) {
        case 'new':
          $scope.the_article.status = 0;
          $scope.the_article.coverUrl = [{'value':$scope.the_article.coverUrl1},{'value':$scope.the_article.coverUrl2},{'value':$scope.the_article.coverUrl3}];
          $scope.the_article.content= $scope.articleContent;
          Models.init('Articles').actions('add', $scope.the_article).then(function (ret) {
            notify({message: '添加成功', classes: 'alert-success'});
            init();
          }, function (err) {
            notify({message: err.data.info, classes: 'alert-danger'});
          });
          break;
        case 'edit':
          $scope.the_article.status = 0;
          $scope.the_article.coverUrl = [];
          $scope.the_article.attachUrl = "";
          $scope.the_article.content= $scope.articleContent;
          Models.init('Articles/autoId').actions('update', $scope.the_article, {'autoId': $scope.the_article.autoId}).then(
            function (ret) {
              notify({message: '修改成功', classes: 'alert-success'});
            }, function (err) {
              notify({message: err.data.info, classes: 'alert-danger'});
            }
          );
          break;
      }

    }

  };

});
