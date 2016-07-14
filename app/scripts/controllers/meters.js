'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:MetersCtrl
 * @description
 * # MetersCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('MetersCtrl', function ($rootScope, $scope, $state, $stateParams, $location,$q,$sce, localStorageService, ngTableParams, Models,DataService, notify, ucauth, ngDialog,config) {

    // 初始胡
    $scope.key = 'meters';
    $scope.meters_list = [];

    $scope.ucauth = ucauth;
    $scope.flag = {};
    $scope.flag.add_meter = false;
    $scope.flag.edit_meter = false;
    $scope.flag.del_meter = false;

    ucauth.hasRole('add_meter',$scope.flag);
    ucauth.hasRole('edit_meter',$scope.flag);
    ucauth.hasRole('del_meter',$scope.flag);

    $scope.the_search = {};
    $scope.show_all = true;


    $scope.current = {};
    $scope.current.building = {};

    $scope.community_list = [];
    $scope.building_list = [{name:'不限'}];
    $scope.unit_list = [{name:'不限'}];
    $scope.room_list = [{houseNumber:'不限'}];

    // 获取小区列表
    Models.init('Communities').actions('list',{}).then(
      function(ret){
        $scope.community_list = ret.data;
        $scope.community_list.unshift({name:'不限'});
      }
    );
    // 切换小区
    $scope.onCommunityChange = function(val,refresh){
      //console.log(val);
      $scope.building_list = [{name:'不限'}];
      $scope.unit_list = [{name:'不限'}];
      $scope.room_list = [{houseNumber:'不限'}];

      if(angular.isUndefined(refresh)) refresh = true;

      if(refresh){
        $scope.current.buildingId = undefined;
        $scope.current.unit = undefined;
        $scope.current.room = undefined;
      }

      $scope.showRoomMeter(val);

      if(val){

        var deferred = $q.defer();
        var params = {community:val};

        Models.init('Buildings').actions('list',params).then(function(ret){
          if(ret.meta.code == 200){
            $scope.building_list = ret.data;
            $scope.building_list.unshift({name:'不限'});
          }
          deferred.resolve(ret);
        });
        return deferred.promise;

      }


    };
    // 切换楼宇
    $scope.onBuildingChange = function(val,refresh){
      $scope.unit_list = [{name:'不限'}];
      $scope.room_list = [{houseNumber:'不限'}];

      if(angular.isUndefined(refresh)) refresh = true;

      if(refresh){
        $scope.current.unit = undefined;
        $scope.current.room = undefined;
      }

      if(val){

        var deferred = $q.defer();
        Models.init('Buildings/id').actions('get',{},{autoId:val}).then(function(ret){
          if(ret.meta.code == 200){
            $scope.current.building = ret.data;

            $scope.showRoomMeter($scope.current.building.code);
            $scope.createUnitList($scope.current.building.unit);
          }
          deferred.resolve(ret);
        });
        return deferred.promise;

      }else{
        $scope.showRoomMeter($scope.current.community);
      }


    };
    // 构建单元list
    $scope.createUnitList = function(val){
      //$scope.unit_list = [];
      var ul = lodash.range(1,val+1);
      angular.forEach(ul,function(k){
        $scope.unit_list.push({val:k,name:k+'单元'});
      });
    };

    // 切换单元
    $scope.onUnitChange = function(val,refresh){
      $scope.room_list = [{houseNumber:'不限'}];

      if(angular.isUndefined(refresh)) refresh = true;

      if(refresh){
        $scope.current.room = undefined;
      }

      if(val){

        var unit_str = val<10 ? '0'+val : val+'';
        var unit_code = $scope.current.building.code + unit_str;
        $scope.showRoomMeter(unit_code);
        var params = {building:$scope.current.building.code,unit:val};

        Models.init('Rooms').actions('list',params).then(function(ret){
          if(ret.meta.code == 200){
            $scope.room_list = ret.data;
            $scope.room_list.unshift({houseNumber:'不限'});
          }
        });

      }else{
        $scope.showRoomMeter($scope.current.building.code);
      }

    };

    // 切换房间
    $scope.onRoomChange = function(val){

      if(val){
        $scope.showRoomMeter(val);
      }else{
        var unit_str = $scope.current.unit<10 ? '0'+$scope.current.unit : $scope.current.unit+'';
        var unit_code = $scope.current.building.code + unit_str;
        $scope.showRoomMeter(unit_code);
      }
    };






    // 获取分页数据
    $scope.getPageList = function(){

      $scope.the_params = angular.extend({
        page: 1,
        count: 8,
        sorting: {
          //autoId: 'desc'     // initial sorting
        }
      }, $location.search());

      $scope.tableParams = new ngTableParams($scope.the_params, {
        total: 0,           // length of data
        //counts: [],
        getData: function ($defer, params) {

          $location.search(params.url());

          var the_param = {page: true, pageSize: params.count(), pageIndex: params.page()};
          the_param = angular.extend(the_param,$scope.the_search);
          // 排序
          var the_sorting = params.sorting();
          var keys = lodash.keys(the_sorting);
          var values = lodash.values(the_sorting);
          if(angular.isDefined(keys[0])){
            var sort_param = keys[0] + ':' + values[0];
            the_param.sorting = sort_param;
          }

          //console.log(the_param);

          $scope.metersListPromise = Models.init('Meters').actions('list',the_param).then(function(ret){
            //console.log(ret);
            if(ret.meta.code == 200){
              lodash.map(ret.data.data,function(n){
                n.unit+='单元';

                n.roomName = n.room.substr(-4)+'号';
                if(n.roomName[0] == '0'){
                  n.roomName = n.room.substr(-3)+'号';
                }

              });
              //console.log(ret.data.data);

              params.total(ret.data.totalRecord);
              $defer.resolve(ret.data.data);
            }
          });

        }
      });


    };

    // 编辑按钮
    $scope.edit = function(item){
      $state.go('admin.payment.editmeter',{itemId:item.autoId,action:'edit'});
    };
    // 添加按钮
    $scope.add = function(){
      $state.go('admin.payment.addmeter', {action:'add'});
    };
    // 删除按钮
    $scope.del = function(item){
      //if(window.confirm("确定要删除该信息吗?")){
        Models.init('Meters/id').actions('delete',{},{'autoId':item.autoId}).then(function(ret){
          if(ret.meta.code == 200){
            notify({message:'已删除',classes:'alert-success'});
            $scope.tableParams.reload();
          }else{
            notify({message:ret.meta.error + " " + ret.meta.info , classes:'alert-danger'});
          }
        });
      //}
    };



    $scope.showRoomMeter = function(room){
      $scope.show_all = angular.isUndefined(room);
      if($scope.show_all){
        $scope.the_search.room = '';
      }else{
        $scope.the_search.room = room;
      }

      $scope.getPageList();
    };
    $scope.showAllMeter = function(){
      $scope.show_all = true;

      $scope.current = {};
      $scope.current.building = {};

      $scope.building_list = [{name:'不限'}];
      $scope.unit_list = [{name:'不限'}];
      $scope.room_list = [{houseNumber:'不限'}];


      var tmp = $scope.the_search.status;
      $scope.the_search = {};
      $scope.the_search.status = tmp;

      $scope.getPageList();
    };


    //$scope.getPageList();

    $scope.statusModel = 0;

    $scope.$watch('statusModel',function(data){
      $scope.the_search.status = data;
      $scope.getPageList();
    });

  });
