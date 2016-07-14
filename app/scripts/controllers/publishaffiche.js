'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:PublishafficheCtrl
 * @description
 * # PublishafficheCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('PublishafficheCtrl', function ($rootScope,$scope,$state,$stateParams,localStorageService,uiGridConstants,Models,notify,config,ucauth) {

    // 初始化数据
    $scope.accept_type_list = config.data.states.acceptType;
    $scope.community_list = [];
    $scope.building_list = [];
    $scope.unit_list = [];
    $scope.accepter_list = [];
    $scope.current = {};
    $scope.current.building = {};


    // 获取小区列表
    Models.init('Communities').actions('list',{}).then(
      function(ret){
        $scope.community_list = ret.data;
      }
    );

    // 构建小区选项
    $scope.makeCommunityAccepter = function(data_list){
      lodash.forEach(data_list,function(key){
        var tmp = {};
        tmp.name = key.name;
        tmp.val = key.code;
        $scope.accepter_list.push(tmp);
      });
    };

    // 构建楼宇选项
    $scope.makeBuildingAccepter = function(data_list){
      lodash.forEach(data_list,function(key){
        var tmp = {};
        tmp.name = key.name;
        tmp.val = key.code;
        $scope.accepter_list.push(tmp);
      });
    };

    // 构建单元list
    $scope.createUnitList = function(val){
      $scope.unit_list = [];
      var ul = lodash.range(1,val+1);
      angular.forEach(ul,function(k){
        $scope.unit_list.push({val:k,name:k+'单元'});
      });
    };

    // 构建单元选项
    $scope.makeUnitAccepter = function(building_code,unit){
      var ul = lodash.range(1,unit+1);
      lodash.forEach(ul,function(key){
        var tmp = {};
        tmp.name = "单元"+key;
        key = (key<10) ? ('0'+key) : key;
        tmp.val = building_code + key;
        $scope.accepter_list.push(tmp);
      });
    };

    // 构建房间选项
    $scope.makeRoomAccepter = function(data_list){
      lodash.forEach(data_list,function(key){
        var tmp = {};
        tmp.name = key.houseNumber + '室';
        tmp.val = key.code;
        $scope.accepter_list.push(tmp);
      });
    };


    // 选择小区
    $scope.onCommunityChange = function(val){
      $scope.building_list = [];
      $scope.unit_list = [];

      var params = {community:val};

      Models.init('Buildings').actions('list',params).then(function(ret){
        if(ret.meta.code == 200){
          $scope.building_list = ret.data;
          if($scope.the_publish.acceptType == 1){
            $scope.accepter_list = [];
            $scope.makeBuildingAccepter($scope.building_list);
          }
        }
      });
    };

    // 选择楼宇
    $scope.onBuildingChange = function(val){
      $scope.unit_list = [];

      Models.init('Buildings/id').actions('get',{},{autoId:val}).then(function(ret){
        if(ret.meta.code == 200){

          console.log(ret.data);
          $scope.current.building = ret.data;
          $scope.createUnitList(ret.data.unit);

          if($scope.the_publish.acceptType == 2){
            $scope.accepter_list = [];
            $scope.makeUnitAccepter(ret.data.code,ret.data.unit);
          }
        }
      });
    };

    // 选择单元
    $scope.onUnitChange = function(val){
      var params = {building:$scope.current.building.code,unit:val};
      //console.log(params);
      Models.init('Rooms').actions('list',params).then(function(ret){
        if(ret.meta.code == 200){
          $scope.accepter_list = [];
          $scope.makeRoomAccepter(ret.data);
        }
      });
    };


    $scope.onAcceptTypeChange = function(val){
      $scope.accepter_list = [];
      switch (val){
        case 0:
          $scope.makeCommunityAccepter($scope.community_list);
          break;
        case 1:
          break;
        case 2:
          break;
        case 3:
          break;
      }
    };

    $scope.changeBox = function(index){
      var tmp = [];
      lodash.forEach($scope.accepter_list,function(key){
        if(key.selected){
          tmp.push(key.val);
        }
      });
      $scope.the_publish.accepter = (tmp.join(','));
    };


    var action = $stateParams.action;
    $scope.action = $stateParams.action;

    var init = function(){
      $scope.the_affiche = {};
      $scope.the_publish = {};

    };

    switch (action){

      case 'publish':
        $scope.form_title = '发布公告...';
        init();

        Models.init('Affiches/id').actions('get',{'autoId':$stateParams.itemId}).then(
          function(ret){
            $scope.the_affiche = ret.data;

            $scope.form_title = '公告标题 :: ' + $scope.the_affiche.title;
          }
        );
        break;
    }


    $scope.save = function(keep){
      if($scope.publishAfficheForm.$valid){
        switch (action){
          case 'publish':
            Models.init('Affiches/publish/id').actions('publish',$scope.the_publish,{'autoId':$stateParams.itemId}).then(
              function(ret){

                if(ret.meta.code == 200){
                  notify({message:'发布成功',classes:'alert-success'});
                }else{
                  notify({message:ret.meta.error , classes:'alert-danger'});
                }


                $state.go('admin.affiches.list');
              }
            );
            break;
        }

      }

    };

    $scope.close = function(){
      $state.go('admin.affiches.list');
    };
  });
