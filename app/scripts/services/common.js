/**
 * Created by zhangzhichao on 15/10/19.
 */
(function (window) {
  'use strict';
  var app = window.app;
  var md5 = window.md5;

  var req_count = 0;

  // HTTP请求头部信息处理
  app.factory('authInterceptor', ['$rootScope', '$q', '$window', '$location', 'DataService', 'config', function ($rootScope, $q, $window, $location, DataService, conf) {
    return {
      'request': function (config) {
        config.headers = config.headers || {};

        var req_url = config.url;
        var data_string = '';
        var contentType = '';

        switch (config.requestType) {
          case 'json':
            contentType = 'application/json;charset=utf-8';
            break;
          case 'form':
            contentType = 'application/x-www-form-urlencoded;charset=utf-8';
            break;
          default :
            contentType = '';
        }


        if ((config.method === 'POST' || config.method === 'PUT') && contentType.length > 0 ) {
          config.headers['Content-Type'] = contentType;
        }

        var params_str = '';
        if (config.requestType === 'json') {
          if (!angular.isUndefined(config.params)) {
            params_str = JSON.stringify(config.params);
            data_string = params_str;
          } else if (!angular.isUndefined(config.data)) {
            data_string = JSON.stringify(config.data);
          }
        } else {
          if (!angular.isUndefined(config.params)) {
            params_str = DataService.formData(config.params, false);
            data_string = params_str;
          } else if (!angular.isUndefined(config.data)) {
            data_string = DataService.formData(config.data, false);
          }

        }

        var userToken = $window.sessionStorage.userToken;
        var time = Date.now();
        var tokenSecret = $window.sessionStorage.tokenSecret;
        var signStr = userToken + time + data_string + req_url + tokenSecret;
        var signCode = md5(signStr);


        config.headers.UserToken = userToken;
        config.headers.Time = time;
        config.headers.SignCode = signCode;
        config.headers.UserSys = conf.global.user_sys;

        //console.log(req_count,config);
        req_count++;

        return config;
      },
      'response': function (response) {
        return response || $q.when(response);
      },
      'responseError': function (rejection) {
        if (rejection.status > 400) {
          $location.path('/signin');
        }
        return $q.reject(rejection);
      }

    };

  }]);

// 全局初始化
  app.run(function ($rootScope, $state, $stateParams, amMoment, notify) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    amMoment.changeLocale('zh-cn');

    notify.config({
      'duration': 3000,
      'position': 'right',
      'templateUrl': 'partials/alert.html'
    });

  });

// 用户身份检测
  app.factory('authService', ['$q', 'ucauth','$location', function ($q, ucauth,$location) {
    return {
      auth: function () {
        var userToken = ucauth.getUserToken();

        if (userToken) {
          return $q.when({authed: true});
        } else {
          $location.path('/signin');
          //return $q.reject({authed: false});
        }
      }
    };
  }]);

// 配置 uiSelect
  app.config(function (uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
  });

// 配置文本编辑器
  app.config(function ($provide) {
    $provide.decorator('taOptions', ['$delegate', function (taOptions) {
      taOptions.toolbar = [
        ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'justifyLeft', 'justifyCenter', 'justifyRight']
      ];
      return taOptions;
    }]);

  });

})(window);
