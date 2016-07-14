'use strict';

/**
 * @ngdoc directive
 * @name propertyAdminApp.directive:provinceSelect
 * @description
 * # provinceSelect
 */

app.directive('areaSelect', function (Models) {
    return {
      restrict: 'AE',
      templateUrl:'/partials/area_select.html',
      scope:{
        province:'=',
        city:'=',
        area:'=',
        names:'='
      },
      link: function postLink(scope, element, attrs) {

        scope.values = [
          scope.province,
          scope.city,
          scope.area
        ];

        scope.data = [];

        scope.key = ['province','city','area'];
        scope.indexs = [];
        scope.names = [];

        scope.getChild = function(){
          //console.log('child');

          Models.init('Provinces/getchild').actions('getchild',{parentId:0}).then(function(ret){
            ret.data.unshift({code:'',name:'请选择省份'});
            scope.data.push(ret.data);
          });

        };
        scope.getAll = function(code){
          //console.log('all');
          if(code !== ''){
            Models.init('Provinces/getall').actions('getall',{code:code}).then(function(ret){
              console.log(ret);

              if(ret.meta.code == 200){
                scope.data = [];
                if(ret.data.cityList !== null){
                  ret.data.provinceList.unshift({code:'',name:'请选择省份'});
                  scope.data.push(ret.data.provinceList);
                }
                if(ret.data.cityList !== null){
                  ret.data.cityList.unshift({code:'',name:'请选择城市'});
                  scope.data.push(ret.data.cityList);
                }
                if(ret.data.areaList !== null){
                  ret.data.areaList.unshift({code:'',name:'请选择区域'});
                  scope.data.push(ret.data.areaList);
                }
              }else{
                scope.getChild();
              }


              scope.values = [
                scope.province,
                scope.city,
                scope.area
              ];

            });
          }
        };

        function getItemIndex(arr,val){
          //console.log(arr,val);
          return lodash.findIndex(arr,function(item){
            return item.code == val;
          })
        }
        function getNameByIndex(){
          angular.forEach(scope.indexs,function(val,key){
            scope.names.push(scope.data[key][val].name);
          });
        }

        scope.change = function(index,value,items){

          scope.values = scope.values.slice(0,index+1);

          if(scope.key[index]!=='area'){
            scope.getAll(value);
          }

          scope.indexs = [];
          angular.forEach(scope.values,function(val,key){
            if(val !== ''){
              scope.indexs.push( getItemIndex(scope.data[key],val) );
            }
          });
          scope.names = [];
          getNameByIndex();

          scope.province = scope.values[0];
          scope.city = scope.values[1];
          scope.area = scope.values[2];
        };

        scope.$watch('city',function(data){
          if(!angular.isUndefined(data)){
            if(data === 0){
              scope.getChild();
            }else{
              scope.getAll(data);
            }
          }
        });
        scope.$watch('names',function(data){
          scope.names = data;
          scope.$emit('updateNames',scope.names);
        },true);

      }
    };
  });
