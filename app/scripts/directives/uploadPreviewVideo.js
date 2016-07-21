/**
 * Created by Administrator on 2016/7/18.
 */
'use strict';
app.directive('uploadPreviewVideo', function (Models,$rootScope,$sce) {
  return {
    scope:{
      files:'=',
      urls:'=',
      uploadParam:'='
    },
    templateUrl:'/partials/upload_videopre.html',
    restrict: 'A',
    replace:true,
    link: function postLink(scope, element, attrs) {

      scope.init = false;

      scope.deleteUploadFile = function(index,file){

        var data = {};
        data.fileName = file.fileName;
        data.pub = file.pub;
        data.fileType = file.fileType;

        // Models.init('Files').actions('delete',data).then(function(ret){
        //   if(ret.meta.code == 200){
        //
        //   }
        // });
        scope.files.splice(index,1);
        $rootScope.$broadcast('updateResult');

      };

      scope.createFiles = function(){
        var files = [];
        if(scope.urls){
          var imgs = scope.urls.split(',');
          lodash.forEach(imgs,function(key){
            var obj = {};
            obj.fileName = $sce.trustAsResourceUrl(key);
            obj.uploaded = true;
            obj.old = true;
            obj.pub = scope.uploadParam.pub;
            obj.fileType = scope.uploadParam.fileType;
            files.push(obj);
          });
        }
        scope.files = files;
        scope.init = true;
      };


      scope.$watch('urls',function(data){
        if(angular.isDefined(data) && !scope.init){
          scope.createFiles();
        }
      });
    }
  };
});
