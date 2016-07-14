'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:RoomsCtrl
 * @description
 * # RoomsCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('RoomsCtrl', function ($rootScope, $scope, $state, $stateParams, $location,$q, localStorageService, ngTableParams, Models, notify, ucauth, config) {
    // 同步初始化
    $scope.key = 'rooms';
    $scope.the_search = {};

    $scope.pager = {};
    $scope.pager.tp = 100;
    $scope.pager.cp = 1;
    $scope.pager.ms = 10;

    $scope.ucauth = ucauth;
    $scope.flag = {};
    $scope.treeData = [];
    $scope.selectedDataItem = undefined;
    //$scope.flag.add_room = false;
    //$scope.flag.edit_room = false;
    //$scope.flag.del_room = false;
    //$scope.flag.room_generate = false;
    //$scope.flag.add_owner = false;
    $scope.flag.building_rooms = false;

    //ucauth.hasRole('add_room',$scope.flag);
    //ucauth.hasRole('edit_room',$scope.flag);
    //ucauth.hasRole('del_room',$scope.flag);
    //ucauth.hasRole('room_generate',$scope.flag);
    //ucauth.hasRole('add_owner',$scope.flag);
    ucauth.hasRole('building_rooms',$scope.flag);


    $scope.the_building = localStorageService.get('buildings.entity');
    $scope.unit_list = [];

    var ul = lodash.range(1,$scope.the_building.unit+1);
    angular.forEach(ul,function(k){
      $scope.unit_list.push({val:k,name:k+'单元'});
    });

    $scope.use_state_list = lodash.clone(config.data.states.useState, true);
    $scope.sale_state_list = lodash.clone(config.data.states.saleState, true);

    $scope.unit_list.unshift({name:'不限'});
    $scope.use_state_list.unshift({name:'不限'});
    $scope.sale_state_list.unshift({name:'不限'});

    // 功能================================================================


    // 获取分页数据
    $scope.getPageList = function(params){
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

          $scope.roomsListPromise = Models.init('Rooms').actions('list',the_param).then(function(ret){
            if(ret.meta.code == 200){
              params.total(ret.data.totalRecord);
              $defer.resolve(ret.data.data);
            }
          });

        }
      });
    };

    // 添加住户
    //$scope.addTenement = function(item){
    //  $state.go('admin.tenement.add', {action:'add',roomId:item.autoId});
    //};
    // 管理住户
    $scope.goTenement = function(item){
      //console.log(item);
      localStorageService.set($scope.key + '.entity',item);
      $state.go('admin.tenement.list');
    };

    $scope.search = function(){
      $location.search(angular.extend($location.search(),$scope.the_search));
      $scope.getPageList();
    };

    $scope.expandCommunity = function(e,data){
      //console.log(data);
      var deferred = $q.defer();
      var params = {community:data.code};
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
        });
        deferred.resolve(data);
      },function(error){
        deferred.reject(error);
      });
      return deferred.promise;
    }

    // 事件==========================================================
    // 新增房间
    $scope.$on('onAdd',function(e,item){
      $state.go('admin.rooms.add', {action:'add'});
    });

    // 修改房间
    $scope.$on('onEdit',function(e,item){
      $state.go('admin.rooms.edit',{roomId:item.autoId,action:'edit'});
    });

    // 删除房间
    $scope.$on('onDel',function(e,item){

      Models.init('Rooms/id').actions('delete',{},{'autoId':item.autoId}).then(function(ret){
        if(ret.meta.code == 200){
          notify({message:'删除成功',classes:'alert-success'});
          //$scope.updateGrid();
          $scope.tableParams.reload();
        }else{
          notify({message:ret.meta.error + " " + ret.meta.info , classes:'alert-danger'});
        }
      });

    });


    $scope.$on('expandCommunity',$scope.expandCommunity);
    $scope.$on('selectCommunity',function(e,data){
      $scope.selectedDataItem = undefined;
      if(angular.isDefined(data.children) && data.children.length >0){
        localStorageService.set('buildings.entity',data.children[0]);
      }
      $scope.the_search = {community:data.code};
      $scope.getPageList({page:1});

    });

    $scope.$on('selectBuilding',function(e,data){
      $scope.selectedDataItem = undefined;
      localStorageService.set('buildings.entity',data);
      $scope.the_search = {'building':data.code};
      $scope.getPageList({page:1});
    });

    $scope.$on('selectUnit',function(e,data){
      $scope.selectedDataItem = undefined;
      data.building_data.current_unit = data.unit;
      localStorageService.set('buildings.entity',data.building_data);
      $scope.the_search = {'building':data.building,'unit':data.unit};
      $scope.getPageList({page:1});
    });


    $scope.$on('expandBuilding',function(e,data){

      var ul = lodash.range(1,data.unit+1);
      angular.forEach(ul,function(k){
        var obj = {};
        obj.name = k+'单元';
        obj.building = data.code;
        obj.building_data = lodash.cloneDeep(data);
        obj.unit = k;
        obj.type="Unit";
        obj.icon = "imoon imoon-home2";
        obj.isLeaf = true;
        if(angular.isUndefined(data.children)){
          data.children = [];
        }
        data.children.push(obj);
      });
    });

    $scope.$on('expandUnit',function(e,data){
      var params = {building:data.building,unit:data.unit};
      Models.init('Rooms').actions('list',params).then(function(ret){
        //console.log(ret.data);
        lodash.forEach(ret.data,function(item){
          var obj = {};
          obj.name = item.houseNumber+'室';
          obj.code = item.code;
          obj.unit = item.unit;
          obj.type = "Room";
          obj.icon = "imoon imoon-home3";
          data.children.push(obj);
        });
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
        var community_index = lodash.findIndex($scope.treeData,'code',$scope.the_building.community);
        if(community_index > -1){
          if(angular.isUndefined($scope.treeData[community_index].children)){
            $scope.treeData[community_index].children = [];

            $scope.expandCommunity(null,$scope.treeData[community_index]).then(function(ret){
              $rootScope.$broadcast('onToggleTreeNode',ret);
              var building_index = lodash.findIndex(ret.children,'code',$scope.the_building.code);
              $rootScope.$broadcast('onSelectTreeNode',{node:ret.children[building_index],send:true});
            });
          }

        }else{
          $scope.getPageList();
        }

      });

    });

    $scope.$on('updateSelected',function(e,data){
      $scope.selectedDataItem = data;
    });
    //=================================================================
    // 异步初始化

  });
