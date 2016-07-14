'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:EnteringCtrl
 * @description
 * # EnteringCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('EnteringCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify,ngDialog, ucauth) {


    $scope.key = 'entering';

    $scope.ucauth = ucauth;
    $scope.flag = {};
    $scope.flag.audit_entering = false;

    ucauth.hasRole('audit_entering',$scope.flag);


    // 获取分页数据
    $scope.getPageList = function(){

      $scope.the_params = angular.extend({
        page: 1,
        count: 10,
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
            //the_param = angular.extend(the_param,{sorting:sort_param});
            the_param.sorting = sort_param;
          }

          $scope.enteringListPromise = Models.init('Entering').actions('list',the_param).then(function(ret){

            if(ret.meta.code == 200){
              params.total(ret.data.totalRecord);

              lodash.map(ret.data.data,function(item){
                item.idType = item.code.charAt(item.code.length-1);
              });

              $defer.resolve(ret.data.data);

            }
          });

        }
      });

    };

    $scope.audit = function(item){
      ngDialog.open({
        template:'auditEnteringTpl',
        controller:'AuditEnteringWindow',
        resolve: {
          item: function enteringFactory() {
            return item;
          }
        },
        preCloseCallback: function(value) {
          $scope.tableParams.reload();
          //$scope.updateGrid();

        }
      });
    };
    $scope.getPageList();

    $scope.$on('search',function(e,data){
      //console.log(data);
      $scope.the_search = data;
      $location.search(angular.extend($location.search(),$scope.the_search));
      $scope.getPageList();
    });

    //// 更新数据表
    //$scope.updateGrid = function(e,data){
    //  if(!angular.isUndefined(data)){
    //    $scope.cp = data.curpage;
    //  }
    //  var params_data = {page:true,pageSize:$scope.pageSize,pageIndex:$scope.cp,realName:$scope.keyword};
    //  if(!angular.isUndefined($scope.the_community)){
    //    params_data.communityCode = $scope.the_community;
    //  }
    //  //console.log(params_data);
    //  $scope.getPageList(params_data);
    //};
    //
    //$scope.changeCommunity = function(val){
    //  $scope.the_community = val;
    //  $scope.updateGrid();
    //};
    //
    //// 过滤参数相关
    //// 读取本地缓存的参数
    //$scope.params = localStorageService.get($scope.key + '.params');
    //
    //if($scope.params){
    //  $scope.keyword = $scope.params.keyword;
    //  $scope.tp = 1;
    //  $scope.cp = $scope.params.p;
    //  $scope.ms = 5;
    //}else{
    //  $scope.keyword = '';
    //  $scope.tp = 1;
    //  $scope.cp = 1;
    //  $scope.ms = 5;
    //
    //  $scope.params = {p:$scope.cp,keyword:$scope.keyword};
    //  localStorageService.set($scope.key + '.params',$scope.params);
    //}
    //
    //$scope.pageSize = 10;
    //
    //$scope.$on('update_page',$scope.updateGrid);
    //
    //$scope.$on('$stateChangeSuccess',
    //  function(event, toState, toParams, fromState, fromParams){
    //    //console.log('Building State:',fromState);
    //    $scope.updateGrid();
    //  });

  });

  app.controller('AuditEnteringWindow',function($scope,Models,config,item){

      if(angular.isDefined(item)){
          $scope.the_entering = item;
      }else{
          $scope.the_entering = {};
      }
      $scope.expireOpened = false;

    //$scope.the_entering = {};
    $scope.entering_status_list = config.data.states.enteringStatus;

    $scope.submit = function(data){

        if(angular.isDate(data.expire)) {
            data.expire = (Date.parse(data.expire));
        }

      Models.init('Entering/idCode').actions('audit',data,{idCode:item.code}).then(function(ret){
        $scope.closeThisDialog();
      });
    };

    $scope.accept = function(){
      $scope.the_entering.auditResult = 1;
      $scope.submit($scope.the_entering);
    };

    $scope.reject = function(){
      $scope.the_entering.auditResult = 2;
      $scope.submit($scope.the_entering);


    };
    $scope.close = function(){
      $scope.closeThisDialog();
    }


  });
