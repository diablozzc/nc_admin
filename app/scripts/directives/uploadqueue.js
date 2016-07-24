'use strict';

/**
 * @ngdoc directive
 * @name propertyAdminApp.directive:uploadQueue
 * @description
 * # uploadQueue
 */

(function (window) {
  'use strict';
  var app = window.app;

  app.directive('uploadQueue', function (Upload, config) {
    return {
      templateUrl: '/partials/upload_queue.html',
      restrict: 'AC',
      //replace:true,
      scope: {
        multiple: '@',
        maxfiles: '@',
        title: '@',
        keep: '@',
        distinct: '@',
        disabled: '@',
        required: '@',
        fields: '=',
        result: '=',
        selected: '='
      },
      link: function postLink(scope, element, attrs) {

        //初始化

        var max_files = scope.maxfiles;
        scope.add_files = 0;
        //console.log(scope.required);
        scope.multiple = angular.isUndefined(scope.multiple) ? false : scope.multiple;
        // scope.isRequired = angular.isUndefined(scope.required) ? false : scope.required;
        if(angular.isUndefined(scope.required)){
          scope.isRequired = false;
        }else{
          scope.isRequired = scope.required === 'true';
        }
        scope.keep = angular.isUndefined(scope.keep) ? true : scope.keep;
        scope.distinct = angular.isUndefined(scope.distinct) ? true : scope.distinct;
        scope.isButton = angular.isUndefined(attrs.isButton) ? false : attrs.isButton;

        scope.isValid = true;
        scope.isDirty = false;


        scope.$watch('selected', function () {
          scope.upload(scope.selected);
        });

        function updateResult() {
          var tmp = [];
          lodash.forEach(scope.selected, function (f) {
            if (f.uploaded) {
              tmp.push(f.fileName);
            }
          });
          scope.result = tmp.join(',');
          console.log(scope.result);
        }

        scope.$on('updateResult', function () {
          updateResult();
        });

        scope.upload = function (files) {
          if (files && files.length) {

            for (var i = 0; i < files.length; i++) {

              if (max_files >= files.length) {
                if (files[i].uploaded !== true) {
                  Upload.upload({
                    // 上传服务器地址
                    url: config.global.nc_server + config.global.upload_service,
                    fields: scope.fields,
                    sendFieldAs: 'form',
                    file: files[i]
                  }).progress(scope.uploadProgress).success(scope.uploadSuccess);

                }

              } else {
                console.log('error: more file', files);
                return false;
              }

            }
          }
        };

        scope.uploadProgress = function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          evt.config.file.progress = progressPercentage;
          console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        };


        scope.uploadSuccess = function (data, status, headers, config) {
          config.file.newupload = true;
          config.file.uploaded = true;
          config.file.fileName = data.data;
          config.file.pub = scope.fields.pub;
          config.file.fileType = scope.fields.fileType;

          updateResult();
          scope.$emit('changeSaved');
        };

      }
    };
  });

})(window);
