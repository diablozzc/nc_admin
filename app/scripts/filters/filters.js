'use strict';

/**
 * @ngdoc filter
 * @name propertyAdminApp.filter:Filters
 * @function
 * @description
 * # Filters
 * Filter in the propertyAdminApp.
 */
app.filter('statesName',function(config){
  return function(input,param){
    if(angular.isUndefined(input)){
      return '';
    }
    var the_index = lodash.findIndex(config.data.states[param],'val',input);
    return config.data.states[param][the_index].name;
  }
});

app.filter('fullImageUrl',function(config){
  return function(input){
    if(angular.isUndefined(input)){
      return false;
    }
    return config.global.qiniu_pub_domain + input;
  }
});
