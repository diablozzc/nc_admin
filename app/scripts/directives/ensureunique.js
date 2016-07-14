'use strict';

/**
 * @ngdoc directive
 * @name propertyAdminApp.directive:ensureUnique
 * @description
 * # ensureUnique
 */

  app.directive('ensureUnique', function ($timeout,ModelFactory) {
    return {
      require:'ngModel',
      link:function(scope,element,attrs,c){
        var stop;
        scope.$watch(attrs.ngModel,function(data){

            $timeout.cancel(stop);
            stop = $timeout(function(){
              var post_data = {
                //value:data,
                //field:attrs.ensureUnique
                'username':data
              };

             if(angular.isDefined(attrs.sys)){
                post_data.userSys = attrs.sys;
             }


              if(!angular.isUndefined(data)) {
                var uname = ModelFactory.init('Usernames');

                uname.action('check',post_data).then(function (ret) {
                  if (ret.meta.code !== 200) {
                    // 用户名格式错误
                    c.$setValidity('format', false);
                    c.$setValidity('unique', true);
                    console.log(ret);
                    scope.errorInfo[attrs.ensureUnique] = {error:ret.meta.error,info:ret.meta.info};
                    console.log(scope.errorInfo);

                  } else {
                    // 用户名存在
                    if (ret.data === 1) {
                      c.$setValidity('unique', false);
                    } else {
                      c.$setValidity('unique', true);
                    }
                    c.$setValidity('format', true);
                  }
                });
              }
            },500);
        });
      }
    };
  });
