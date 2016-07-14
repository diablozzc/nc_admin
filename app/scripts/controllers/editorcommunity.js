'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:EditorcommunityCtrl
 * @description
 * # EditorcommunityCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('EditorcommunityCtrl', function ($rootScope,$scope,$state,$stateParams,Models,ucauth,notify) {

    // 初始化
    var action = $stateParams.action;
    $scope.action = $stateParams.action;
    $scope.province_list = [];
    $scope.city_list = [];
    $scope.area_list = [];

    var init = function(){
      $scope.the_community = {};
      $scope.the_community.province = '410000';
      $scope.the_community.city = '410300';
      $scope.the_community.area = '';
      $scope.the_community.property = ucauth.getUser().property;
      $scope.the_community.position = {'lng':112.413006,'lat':34.656602};
      $scope.areaNames = [];

      Models.init('Provinces/getchild').actions('getchild',{parentId:0}).then(function(ret){
        $scope.province_list = ret.data;
      });

      Models.init('Provinces/getchild').actions('getchild',{parentId:$scope.the_community.province}).then(function(ret){
        $scope.city_list = ret.data;

      });

      $scope.cityChange('410300');

    };

    $scope.provinceChange = function(val){
      $scope.the_community.city = '';
      $scope.the_community.area = '';
      $scope.area_list = [];
      Models.init('Provinces/getchild').actions('getchild',{parentId:val}).then(function(ret){
        $scope.city_list = ret.data;
      });

    };

    $scope.cityChange = function(val){
      $scope.the_community.area = '';
      Models.init('Provinces/getchild').actions('getchild',{parentId:val}).then(function(ret){
        $scope.area_list = ret.data;
      });

    };

    switch (action){
      case 'add':
        $scope.form_title = '新增小区';
        init();
        break;
      case 'edit':
        $scope.form_title = '修改小区';
        Models.init('Communities/id').actions('get',{autoId:$stateParams.itemId}).then(
          function(ret){
            $scope.the_community = ret.data;

            // 获取省市区 列表
            Models.init('Provinces/getall').actions('getall',{code:$scope.the_community.area}).then(function(ret){
              //$scope.area_list = ret.data;
              $scope.province_list = ret.data.provinceList;
              $scope.city_list = ret.data.cityList;
              $scope.area_list = ret.data.areaList;
            });

          }
        );
        break;
    }
    $scope.save = function(){
      switch (action){
        case 'add':

          $scope.updateNames();

          Models.init('Communities').actions('add',$scope.the_community).then(function(ret){


            if(ret.meta.code == 200){
              notify({message:'添加成功',classes:'alert-success'});
            }else{
              notify({message:ret.meta.error , classes:'alert-danger'});
            }

            $state.go('admin.communities.list');


          });
          break;
        case 'edit':

          $scope.updateNames();

          Models.init('Communities/id').actions('update',$scope.the_community,{'autoId':$scope.the_community.autoId}).then(function(ret){

              if(ret.meta.code == 200){
                notify({message:'修改成功',classes:'alert-success'});
              }else{
                notify({message:ret.meta.error , classes:'alert-danger'});
              }

              $state.go('admin.communities.list');
            }
          );
          break;
      }

    };
    $scope.close = function(){
      $state.go('admin.communities.list');
    };

    $scope.updateNames = function(){
      var province_index = lodash.findIndex($scope.province_list,'code',$scope.the_community.province);
      var city_index = lodash.findIndex($scope.city_list,'code',$scope.the_community.city);
      var area_index = lodash.findIndex($scope.area_list,'code',$scope.the_community.area);
      if(province_index>=0){

        $scope.the_community.provinceName = $scope.province_list[province_index].name;
      }
      if(city_index>=0){

        $scope.the_community.cityName = $scope.city_list[city_index].name;
      }
      if(area_index>=0){
        console.log(area_index);
        $scope.the_community.areaName = $scope.area_list[area_index].name;
      }

    };

  });
