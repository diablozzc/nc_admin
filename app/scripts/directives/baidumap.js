'use strict';

/**
 * @ngdoc directive
 * @name propertyAdminApp.directive:baiduMap
 * @description
 * # baiduMap
 */
  app.directive('baiduMap', function ($log) {
    return {
      restrict: 'A',
      scope:{
        position:'='
      },
      link: function postLink(scope, element, attrs) {
        // 是否初始化
        var inited = false;
        // 地图,标记实例
        var map,mk;

        // 初始化地图
        scope.initMap = function(p){
          var id = attrs.id;
          map = new BMap.Map(id);
          //var point = new BMap.Point(112.44752477,34.65736782);
          var point = new BMap.Point(p.lng-0, p.lat-0);
          map.centerAndZoom(point,15);


          mk = new BMap.Marker(point);
          mk.enableDragging();
          map.addOverlay(mk);
          mk.addEventListener("dragend",function(e){
            scope.setPosition(e.point);
          });

          inited = true;
        };
        // 设置位置
        scope.setPosition = function(pos){
          var pos_str = JSON.stringify(pos);
          scope.position = pos_str;
          scope.$apply();
          //console.log('当前位置',scope.position);
        };

        // 获取当前位置
        scope.getCurrentPosition = function(){
          var geolocation = new BMap.Geolocation();

          geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){

              map.centerAndZoom(r.point, 16);
              mk.setPosition(r.point);
              mk.setAnimation(BMAP_ANIMATION_DROP); //跳动的动画
              scope.setPosition(r.point);

            }
            else {
              //console.log('failed'+this.getStatus());
            }
          },{enableHighAccuracy: true});


        };

        // 根据地址解析
        scope.$on('resolve',function(e,data){
          // 创建地址解析器实例
          if(data){
            var myGeo = new BMap.Geocoder();
            // 将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint(data, function(point){
              if (point) {
                map.centerAndZoom(point, 16);
                mk.setPosition(point);
                mk.setAnimation(BMAP_ANIMATION_DROP); //跳动的动画
                scope.setPosition(point);
              }else{
                //$log.log("您选择地址没有解析到结果!");
              }
            }, "洛阳市");
          }

        });


        // 未知初始化
        scope.$watch('position',function(pos){
          var p;
          if(pos) {

            if(angular.isObject(pos)){
                if(!inited){
                  scope.initMap(pos);
                  scope.getCurrentPosition();
                }
            }else{

              if (!inited) {
                try{
                  p = JSON.parse(pos);
                }catch (e){
                  console.log(e);
                  p = {"lng":112.413006,"lat":34.656602};
                }

                scope.initMap(p);
              }

            }

          }

        });


      }
    };
  });
