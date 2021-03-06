/**
 * Created by Administrator on 2016/7/16.
 */
app.controller('EditorarticleCtrl', function ($rootScope, $scope, $state, $stateParams, localStorageService,  Models, notify, ngDialog, config, ucauth,Upload) {

  $scope.ucauth = ucauth;
  $scope.flag = {};
  $scope.flag.add_article = false;//添加文章
  ucauth.hasRole('add_article', $scope.flag);

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
    $scope.the_article.showType = 'text';
    $scope.the_article.columnKey = 'column_news';
    $scope.the_article.attachUrl = '';
    $scope.the_article.coverUrl = '';
    $scope.the_article.videoUrl = '';
  };

  $scope.upload_param = {pub: 'pub', fileType: 'activity_poster'};
  $scope.upload_video = {pub: 'pub', fileType: ''};
  $scope.upload_file = {pub: 'pub', fileType: ''};
  switch (action) {
    case 'new':
      $scope.form_title = '新增内容';
      init();
      break;
    case 'edit':
      $scope.form_title = '修改信息';
      Models.init('Articles/Web/autoId').actions('get', {'autoId': $stateParams.itemId}).then(
        function (ret) {
          $scope.the_article = ret;
          console.log($scope.the_article);
          // $scope.articleContent = $scope.the_article.content;
          $scope.the_article.attachUrl="";

          Models.init('Attaches').actions('get', {'columnKey': ret.columnKey, 'itemId': $stateParams.itemId}).then(
            function (att) {
              // console.log(att);
              var attachs = att;
              if (attachs && attachs.length) {
                for (var i = 0; i < attachs.length; i++) {
                  if (i == attachs.length - 1) {
                    $scope.the_article.attachUrl += attachs[i].url;
                  } else {
                    $scope.the_article.attachUrl += attachs[i].url + ",";
                  }
                }
              }
            }
          );
        }
      );

      break;
  }


  $scope.imageUpload = function(files) {
    // console.log('image upload:', files);

    if (files && files.length) {

      for (var i = 0; i < files.length; i++) {
        Upload.upload({
          // 上传服务器地址
          url: config.global.nc_server + config.global.upload_service,
          sendFieldAs: 'form',
          file: files[i]
        }).success(function(data, status, headers, config){
          $scope.editor.summernote('insertImage', data.data, function ($image) {
            $image.css('width', '50%');
          });

        });
      }
    }
  };


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
    if (keep) {
      $scope.the_article.status = 1;
    }
    else {
      $scope.the_article.status = 0;
    }
    if ($scope.articleForm.$valid) {
      // $scope.the_article.content = $scope.articleContent;
      //图片控制
      switch ($scope.the_article.showType) {
        case 'text':
          $scope.the_article.coverUrl = "";
          $scope.the_article.videoUrl = "";
          break;
        case 'singleImage':
        case 'imageText':
          var imgs = $scope.the_article.coverUrl.split(',');
          $scope.the_article.coverUrl = imgs[0];
          $scope.the_article.videoUrl = "";
          break;
        case 'multiImage':
          $scope.the_article.videoUrl = "";
          break;
        case 'video':
          break;
      }
      switch (action) {
        case 'new':
          // console.log($scope.the_article);
          Models.init('Articles').actions('add', $scope.the_article).then(function (ret) {
            notify({message: '添加成功', classes: 'alert-success'});
            init();
          }, function (err) {
            notify({message: err.data.info, classes: 'alert-danger'});
          });
          break;
        case 'edit':
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
  //关闭
  $scope.close = function () {
    $state.go('admin.article.search', {'action': 'search'});
  };
  $scope.summernote_conf = {
    height:300,
    placeholder: '文章内容'
  };

  //预览（手机端）
  $scope.preview = function (item,content) {
    item.content=content;
    ngDialog.open({
      template:'articlePreTpl',
      controller:'ArticlePreWindow',
      resolve: {
        item: function preFactory() {
          return item;
        }
      },
      preCloseCallback: function(value) {
        // $scope.tableParams.reload();
      }
    });
  }
});
app.controller('ArticlePreWindow',function($scope,Models,config,item,$sce){

  if(angular.isDefined(item)){
    $scope.the_article = item;
  }else{
    $scope.the_article = {};
  }
  $scope.the_article.publishTime= new Date();
  $scope.videoUrl= $sce.trustAsResourceUrl($scope.the_article.videoUrl);
  // console.log($scope.the_article.videoUrl);
  $scope.close = function(){
    $scope.closeThisDialog();
  }
});
