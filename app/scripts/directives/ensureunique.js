'use strict';

/**
 * @ngdoc directive
 * @name propertyAdminApp.directive:ensureUnique
 * @description
 * # ensureUnique
 */

app.directive('ensureUnique', function ($timeout, ModelFactory) {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, c) {
      var stop;
      scope.$watch(attrs.ngModel, function (data) {

        $timeout.cancel(stop);
        stop = $timeout(function () {
          var post_data = {
            //value:data,
            //field:attrs.ensureUnique
            'username': data
          };

          if (angular.isDefined(attrs.sys)) {
            post_data.userSys = attrs.sys;
          }


          if (!angular.isUndefined(data)) {
            var uname = ModelFactory.init('Admins/getByUsername/username');

            uname.action('get', post_data).then(function (ret) {
              // 用户名格式错误
              c.$setValidity('format', false);
              c.$setValidity('unique', true);
              console.log(ret);
              console.log(scope.errorInfo);
              // 用户名存在
              c.$setValidity('unique', false);

            }, function (err) {
              scope.errorInfo[attrs.ensureUnique] = {error: err.data.info};
              c.$setValidity('unique', true);
              c.$setValidity('format', true);
            });
          }
        }, 500);
      });
    }
  };
});
