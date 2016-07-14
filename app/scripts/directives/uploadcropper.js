'use strict';

/**
 * @ngdoc directive
 * @name superAdminApp.directive:uploadCropper
 * @description
 * # uploadCropper
 */

app.run(['$templateCache', function($templateCache) {
  var tpl_str = '<div class="clearfix"><div class="fileupload mr10 mb20 fl" ng-style="style" ng-show="sourceImage && !uploaded"><div class="cropArea" ngf-drop ng-model="sourceImage" ngf-pattern="image/*"></div></div><div class="preview fl" ng-class="{\'error-zone\':error.required}"><img ng-src="{{croppedImage | ngfDataUrl}}" ng-show="sourceImage && !uploaded && !uploadedImage" /><img ng-src="{{uploadedImage | fullImageUrl}}" ng-show="uploadedImage" /><div class="progress progress-bar-xxs mt10" ng-show="sourceImage && !uploaded && !uploadedImage"><div class="progress-bar progress-bar-system" role="progressbar" aria-valuenow="{{progress}}" aria-valuemin="0" aria-valuemax="100" ng-style="progressStyle"><span class="sr-only">{{progress}}%</span></div></div></div></div><div class="clearfix mt10"><span class="button btn-system btn-sm btn-file btn-block w100"><span class="fileupload-new" ng-if="!uploadedImage && !sourceImage">{{attrs.btnTitle}}</span><span class="fileupload-exists" ng-if="sourceImage || uploadedImage">更改</span><input type="file" ng-model="sourceImage" accept="image/*" ngf-select/><input type="hidden" ng-model="uploadedImage" ng-required="isRequired" test-valid /></span><span class="button btn-system btn-sm w100" ng-click="upload(croppedImage)" ng-if="sourceImage && !uploaded">保存</span></div>';

  $templateCache.put('uploadCropper',tpl_str);
}]);


  app.directive('uploadCropper', function (Upload,config,notify,$timeout,$templateCache,$compile) {
    return {
      scope:{
        uploadedImage:'=',
        required:'@',
      },
      restrict: 'AC',
      controller:function($scope,$attrs){
        $scope.initState = function(){
          $scope.progressStyle = {
            width:'0%'
          }
          $scope.uploaded = false;
        };

        $scope.initState();

        $scope.upload = function (dataUrl) {
          Upload.upload({
            url: config.global.fs_server + config.global.upload_service,
            data: {
              file: Upload.dataUrltoBlob(dataUrl)
            }
          }).then(function (response) {
            //$timeout(function () {
              $scope.result = response.data;

              if($scope.result.meta.code !== 200){
                notify({message:ret.meta.error , classes:'alert-danger'});
              }else{
                notify({message:'上传成功',classes:'alert-success'});
                $scope.uploaded = true;
                $scope.uploadedImage = $scope.result.data;
              }

            //});
          }, function (response) {
            if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
          }, function (evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progressStyle = {width:$scope.progress+'%'};
          });
        }

      },
      link: function postLink(scope, element, attrs) {

        scope.attrs = attrs;
        scope.error = {};

        if(angular.isUndefined(scope.required)){
          scope.isRequired = false;
        }else{
          scope.isRequired = scope.required === 'true';
        }

        scope.style = {
          width:scope.attrs.width - 0 + 14,
          height:scope.attrs.height
        };

        var tpl = $templateCache.get('uploadCropper');
        element.html(tpl);

        var the_canvas = '<canvas width="'+ scope.attrs.width +'" height="'+ scope.attrs.height +'" image-cropper image="sourceImage | ngfDataUrl" cropped-image="croppedImage" crop-width="'+ scope.attrs.cropWidth +'" crop-height="'+ scope.attrs.cropHeight +'" keep-aspect="true" touch-radius="10" crop-area-bounds="bounds"></canvas>';

        var img_link = "holder.js/"+scope.attrs.cropWidth+"x"+ scope.attrs.cropHeight +"?text="+scope.attrs.title+" \n " + scope.attrs.cropWidth+"x"+ scope.attrs.cropHeight;

        var the_preview_img = '<img src="'+img_link+'" ng-show="!sourceImage && !uploadedImage" holder-fix />';

        element.find("div.preview").prepend(the_preview_img);
        element.find("div.cropArea").html(the_canvas);

        $compile(element.contents())(scope);

        scope.$watch('uploadedImage',function(newData,oldData){
          console.log(newData,oldData);
          if(newData === null || angular.isUndefined(newData)){
            scope.initState();
          }
        });

        scope.$watch('sourceImage',function(newData,oldData){
          console.log('sourceImage',newData,oldData);
          if(null !== newData){
            scope.uploadedImage = undefined;
          }
        });

      }
    };
  });
