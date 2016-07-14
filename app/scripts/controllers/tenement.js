'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:TenementCtrl
 * @description
 * # TenementCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('TenementCtrl', function ($rootScope, $scope, $state, $stateParams, $location,$q, localStorageService, ngTableParams, Models, notify, ucauth, config) {
    // 同步初始化 ==============================
    $scope.key = 'tenement';
    $scope.inited = false;

    $scope.pager = {};
    $scope.pager.tp = 100;
    $scope.pager.cp = 1;
    $scope.pager.ms = 10;

    $scope.ucauth = ucauth;
    $scope.flag = {};
    $scope.flag.add_owner = false;
    $scope.flag.edit_owner = false;
    $scope.flag.del_owner = false;

    ucauth.hasRole('add_owner',$scope.flag);
    ucauth.hasRole('edit_owner',$scope.flag);
    ucauth.hasRole('del_owner',$scope.flag);

    $scope.treeData = [];
    $scope.selectedDataItem = undefined;
    $scope.selectedRoom = undefined;

    //$scope.the_building = localStorageService.get('buildings.entity');
    $scope.the_room = localStorageService.get('rooms.entity');


    // 功能 ===============================

    $scope.getPageList = function(params){
      var deferred = $q.defer();
      var default_params = {
        page: 1,
        count: 15,
        sorting: {
          autoId: 'desc'
        }
      };

      if(angular.isDefined(params)){
        $scope.the_params = angular.extend(default_params,params);
      }else {
        $scope.the_params = angular.extend(default_params,$location.search());
      }

      $scope.tableParams = new ngTableParams($scope.the_params, {
        total: 0,           // length of data
        //counts: [],
        getData: function ($defer, params) {
          // 同步地址栏
          $location.search(params.url());
          // 分页,查询参数
          var the_page = {page: true, pageSize: params.count(), pageIndex: params.page()};
          var the_query = $scope.the_search;
          var the_param = angular.extend(the_page,the_query);
          // 排序
          var keys = lodash.keys(params.sorting());
          var values = lodash.values(params.sorting());
          if(angular.isDefined(keys[0])){
            the_param.sorting = keys[0] + ':' + values[0];
          }

          $scope.pager.cp = params.page();

          $scope.ownerListPromise = Models.init('Owners').actions('list',the_param).then(function(ret){
            if(ret.meta.code == 200){
              //console.log(ret);
              params.total(ret.data.totalRecord);
              $defer.resolve(ret.data.data);
              deferred.resolve(ret.data);
            }
          });

        }
      });
      return deferred.promise;

    };
    $scope.onSearch = function(item){
      if($scope.inited){
        $scope.getPageList({page:1});
      }
    };


    $scope.findTreeRoom = function(target){
      var deferred = $q.defer();

      var community_index = lodash.findIndex($scope.treeData,'code',target.community);
      if(community_index > -1){
        $scope.the_community = $scope.treeData[community_index];
        // 展开小区
        $scope.expandCommunity(null,$scope.the_community).then(function(ret){
          //展开楼宇
          var building_index = lodash.findIndex(ret.children,'code',target.building);
          // 未找到
          $scope.the_building = $scope.the_community.children[building_index];
          $scope.expandBuilding(null,$scope.the_building);
          //展开单元
          var unit_index = target.unit - 1;
          $scope.the_unit = $scope.the_building.children[unit_index];
          $scope.expandUnit(null,$scope.the_unit).then(function(ret){
            var room_index = lodash.findIndex(ret.children,'code',target.code);
            // 未找到
            deferred.resolve(ret.children[room_index]);
          });
        });
      }else{
        deferred.reject({data:-1});
      }
      return deferred.promise;

    };

    $scope.showRoomTenement = function(item,$event){

      var room = {};
      room.community = item.community;
      room.buildingId = item.buildingId;
      room.building = item.building;
      room.unit = item.unit;
      room.code = item.room;
      room.houseNumber = item.houseNumber;
      room.useState = item.useState;

      $rootScope.$broadcast('selectRoom',room);

      $scope.findTreeRoom(room).then(function(ret){
        $rootScope.$broadcast('onSelectTreeNode',{node:ret,send:false});
        $scope.selectedRoom = ret;
      });
      $event.stopPropagation();

    };


    $scope.expandCommunity = function(e,data){
      //console.log(data);
      var deferred = $q.defer();
      if(angular.isUndefined(data.children)){
        data.children = [];
        var params = {community:data.code};
        // 加载子元素
        Models.init('Buildings').actions('list',params).then(function(ret){
          if(angular.isDefined(ret.data) && ret.data.length > 0){
            //console.log(ret.data[0]);
            localStorageService.set('buildings.entity',ret.data[0]);
          }
          lodash.forEach(ret.data,function(item){
            var obj = {};
            obj.autoId = item.autoId;
            obj.name = item.name;
            obj.code = item.code;
            obj.community = item.community;
            obj.unit = item.unit;
            obj.type = "Building";
            obj.icon = "imoon imoon-home";
            obj.collapsed = true;
            data.children.push(obj);
            data.collapsed = false;
          });
          deferred.resolve(data);
        },function(error){
          deferred.reject(error);
        });

      }else{
        data.collapsed = false;
        deferred.resolve(data);
      }
      return deferred.promise;
    };
    $scope.expandBuilding = function(e,data){
      var deferred = $q.defer();
      if(angular.isUndefined(data.children)){
        data.children = [];
        var ul = lodash.range(1,data.unit+1);
        angular.forEach(ul,function(k){
          var obj = {};
          obj.name = k+'单元';
          obj.building = data.code;
          obj.building_data = lodash.cloneDeep(data);
          obj.unit = k;
          obj.type="Unit";
          obj.icon = "imoon imoon-home2";
          obj.collapsed = true;
          data.children.push(obj);
          data.collapsed = false;
        });
      }else{
        data.collapsed = false;
      }
      deferred.resolve(data);
      return deferred.promise;

    };
    $scope.expandUnit = function(e,data){
      var deferred = $q.defer();
      if(angular.isUndefined(data.children)){
        data.children = [];
        var params = {building:data.building,unit:data.unit};
        Models.init('Rooms').actions('list',params).then(function(ret){
          //console.log(ret.data);
          lodash.forEach(ret.data,function(item){
            var obj = {};
            obj.name = item.houseNumber+'室'+'['+item.useState+']';
            obj.houseNumber = item.houseNumber+'室';
            obj.community = item.community;
            obj.communityName = item.communityName;
            obj.building = item.building;
            obj.buildingName = item.buildingName;
            obj.buildingId = $scope.the_building.autoId;
            obj.autoId = item.autoId;
            obj.code = item.code;
            obj.unit = item.unit;
            obj.unitName = item.unit+'单元';
            obj.type = "Room";
            obj.icon = "imoon imoon-home3";
            obj.isLeaf = true;
            data.children.push(obj);
            data.collapsed = false;
          });
          deferred.resolve(data);
        },function(error){
          deferred.reject(error);
        });
      }else{
        data.collapsed = false;
        deferred.resolve(data);
      }

      return deferred.promise;
    };

    // 事件 ========================

    $scope.$on('onAddOwner',function(e,item){
      localStorageService.set('rooms.entity',item);
      $state.go('admin.tenement.add', {action:'add',ownerType:0});
    });
    $scope.$on('onAddFamily',function(e,item){
      localStorageService.set('rooms.entity',item);
      $state.go('admin.tenement.add', {action:'add',ownerType:2});
    });
    $scope.$on('onAddLessee',function(e,item){
      localStorageService.set('rooms.entity',item);
      $state.go('admin.tenement.add', {action:'add',ownerType:1});
    });


    $scope.$on('onEdit',function(e,item){

      $state.go('admin.tenement.edit',{itemId:item.autoId,action:'edit'});
    });
    $scope.$on('onDel',function(e,item){

      Models.init('Owners/id').actions('delete',{},{'autoId':item.autoId}).then(function(ret){
        if(ret.meta.code == 200){
          notify({message:'住户已迁出',classes:'alert-success'});
          $scope.tableParams.reload();
        }else{
          notify({message:ret.meta.error + " " + ret.meta.info , classes:'alert-danger'});
        }

        if(angular.isDefined($scope.selectedRoom)){
          $rootScope.$broadcast('onUpdateTreeNode',$scope.selectedRoom);
        }else{
          var node = {};
          node.code = item.room;
          node.type = 'Room';
          $rootScope.$broadcast('onUpdateTreeNode',node);

        }


      });
    });


    $scope.$on('selectCommunity',function(e,data){
      $scope.selectedDataItem = undefined;
      $scope.selectedRoom = undefined;

      if(angular.isDefined(data.children) && data.children.length >0){
        localStorageService.set('buildings.entity',data.children[0]);
      }
      $scope.the_search = {community:data.code};
      $scope.getPageList({page:1});

    });
    $scope.$on('selectBuilding',function(e,data){
      $scope.selectedDataItem = undefined;
      $scope.selectedRoom = undefined;

      localStorageService.set('buildings.entity',data);
      $scope.the_search = {'building':data.code};
      $scope.getPageList({page:1});
    });
    $scope.$on('selectUnit',function(e,data){
      $scope.selectedDataItem = undefined;
      $scope.selectedRoom = undefined;

      data.building_data.current_unit = data.unit;
      localStorageService.set('buildings.entity',data.building_data);
      $scope.the_search = {'building':data.building,'unit':data.unit};
      $scope.getPageList({page:1});
    });
    $scope.$on('selectRoom',function(e,data){
      $scope.selectedDataItem = undefined;
      $scope.selectedRoom = data;

      $scope.the_search = {'room':data.code};
      $scope.getPageList({page:1}).then(function(ret){
        $scope.inited = true;
      });
    });

    $scope.$on('expandCommunity',$scope.expandCommunity);
    $scope.$on('expandBuilding',$scope.expandBuilding);
    $scope.$on('expandUnit',$scope.expandUnit);

    $scope.$on('updateRoom',function(e,data){
      //console.log(data);
      Models.init('Rooms/id').actions('get',{autoId:data.autoId}).then(function(ret){
        //console.log(data,ret);
        data.name = ret.data.houseNumber+'室['+ret.data.useState+']';
      });
    });

    $scope.$on('initTree',function(e,data){

      Models.init('Communities').actions('list',{}).then(function(ret){
        //console.log(ret.data);
        lodash.forEach(ret.data,function(item){
          var obj = {};
          obj.name = item.name;
          obj.code = item.code;
          obj.type = "Community";
          obj.icon = "imoon imoon-office";
          obj.collapsed = true;
          $scope.treeData.push(obj);
        });

        // 初始化树节点
        $scope.findTreeRoom($scope.the_room).then(function(ret){

          $rootScope.$broadcast('onSelectTreeNode',{node:ret,send:true});
          $scope.selectedRoom = ret;
        },function(){
          $scope.getPageList().then(function(ret){
            $scope.inited = true;
          });
        })
      });

    });


    $scope.$on('search',function(e,data){
      //console.log(data);
      $scope.the_search = data;
      $location.search(angular.extend($location.search(),$scope.the_search));
      $scope.getPageList();
    });
    $scope.$on('updateSelected',function(e,data){
      $scope.selectedDataItem = data;
    });


    // 异步初始化
    //$scope.getPageList();

  });
