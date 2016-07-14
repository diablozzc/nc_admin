'use strict';

/**
 * @ngdoc service
 * @name propertyAdminApp.models
 * @description
 * # models
 * Factory in the propertyAdminApp.
 */

  app.factory('DataService',['$window',function($window){
    return {
      formData:function(obj,encode){

        encode = angular.isUndefined(arguments[1])?true:arguments[1];
        var str = [];
        var tmp = [];
        angular.forEach(obj,function(val,key){
          tmp[tmp.length] = key;
        });
        //按Key排序
        tmp.sort();
        var obj2 = {};
        angular.forEach(tmp,function(key){
          obj2[key] = obj[key];
        });
        for(var p in obj2) {
          if (encode) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }else{
            str.push((p) + "=" + (obj[p]));
          }
        }

        str = str.join("&");
        return str;
      },
      saveData:function(obj){
        var data_str = this.formData(obj);
        //console.log('data_str',data_str);
        $window.sessionStorage.req_data = data_str;
      }
      //saveRequestURL:function(url){
      //  $window.sessionStorage.req_url = url;
      //}
    };
  }]);


  app.factory('ModelFactory',function($q,$resource,config,DataService){

    this.conf = {};
    this.res = {};
    this.serverKey = '';
    // 获取配置
    function getConf(){
      return this.conf;
    }
    // 获取资源
    function getRes(){
      return this.res;
    }
    // 调用动作
    function action(action_str,data,params){

      params = arguments[2]?arguments[2]:{};

      var deferred = $q.defer();
      //console.log(action_str,this.res);

      var handle;
      if(arguments[2]){
        handle = this.res[action_str](params,data)
      }else{
        handle = this.res[action_str](data);
      }

      handle.$promise.then(function(ret){
        deferred.resolve(ret);
      },function(error){
        deferred.reject(error);
      });
      this.serverKey = undefined;

      return deferred.promise;
    }

    // 获取URL
    function getURL(data){
      var REG = /:([^/]+)/gi;
      var pattern = this.conf.uri;
      var target = pattern;

      var result = pattern.match(REG);

      if(result!==null){
        for(var i = 0, max = result.length; i < max; i++){
          var key = result[i];
          var index = key.substr(1);
          if(undefined !== data[index]){
            target = target.replace(key,data[index]);
          }
        }
      }

      return config.global[this.conf.serverKey] + target;
    }

    // 初始化Resource
    function init(key){
      // 根据Key获取资源配置
      this.conf = config.data.resources[key];

      //初始化操作
      if(angular.isDefined(this.serverKey)){
        this.conf.serverKey = this.serverKey;
      }

      var actions = {};

      var jsonRequestor = function(data){
        //console.log(JSON.stringify(data));
        return JSON.stringify(data);
      };


      angular.forEach(this.conf.actions,function(m,val){
        var resType = angular.isUndefined(m.responseType) ? "json" : m.responseType;
        var requestor = DataService.formData;
        m.requestType = angular.isUndefined(m.requestType) ? 'form' : m.requestType;

        if(m.requestType == 'json'){
          requestor = jsonRequestor;
        }

        actions[m.action] = {
          method: m.method
          ,isArray: m.isArray
          ,responseType: resType
          ,transformRequest: requestor
          ,requestType: m.requestType
        };
      });

      this.res = $resource(config.global[this.conf.serverKey] + this.conf.uri,{},actions);
      return this;
    }
    // 设置serverKey
    function setServer(serverKey){
      this.serverKey = serverKey;
      return this;
    }

    return {
      init:init,
      setServer:setServer,
      getConf:getConf,
      resource:getRes,
      action:action,
      getURL:getURL
    }
  });


//

  app.factory('Models',function($q,ModelFactory,DataService){
    this.key = '';
    this.serverKey = '';

    function init(key,serverKey){
      this.key = key;
      this.serverKey = arguments[1]?arguments[1]:'';

      return this;
    }

    function actions(action,data,params){

      //params = arguments[2]?arguments[2]:{};

      var deferred = $q.defer();
      var obj = {};

      if(this.serverKey == ''){
        obj = ModelFactory.init(this.key);
      }else{
        obj = ModelFactory.setServer(this.serverKey).init(this.key);
      }

      //DataService.saveData(data);

      //if(arguments[2]){
      //  DataService.saveRequestURL(obj.getURL(params));
      //}else{
      //  DataService.saveRequestURL(obj.getURL(data));
      //}

      obj.action(action,data,params).then(function(ret){
        deferred.resolve(ret);
      },function(error){
        deferred.reject(error);
      });
      return deferred.promise;
    }
    return{
      init:init,
      actions:actions
    };
  });
