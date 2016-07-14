'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:SuggestionsCtrl
 * @description
 * # SuggestionsCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('SuggestionsCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth) {
    $scope.key = 'suggestions';
    $scope.suggestions_list = [];
    $scope.the_search = {};
    $scope.statusPage = [1,1,1];

    $scope.ucauth = ucauth;
    $scope.flag = {};
    $scope.flag.accept_suggestion = false;
    $scope.flag.feedback_suggestion = false;
    $scope.flag.check_suggestion = false;

    ucauth.hasRole('accept_suggestion',$scope.flag);
    ucauth.hasRole('feedback_suggestion',$scope.flag);
    ucauth.hasRole('check_suggestion',$scope.flag);


    // 获取分页数据
    $scope.getPageList = function(){

      $scope.the_params = angular.extend({
        page: 1,
        count: 8,
        sorting: {
          autoId: 'desc'     // initial sorting
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

          $scope.statusPage[$scope.the_search.status] = params.page();

          $scope.suggestListPromise = Models.init('Suggestions').actions('list',the_param).then(function(ret){
            if(ret.meta.code == 200){
              params.total(ret.data.totalRecord);
              $defer.resolve(ret.data.data);
            }
          });

        }
      });



    };

    // 受理按钮
    $scope.accept = function(item){
        Models.init('Suggestions/accept/id').actions('accept',{},{'autoId':item.autoId}).then(function(ret){
          if(ret.meta.code == 200){
            notify({message:'已受理',classes:'alert-success'});
            $scope.getPageList();
          }else{
            notify({message:ret.meta.error + " " + ret.meta.info , classes:'alert-danger'});
          }
        });
    };
    // 反馈按钮
    $scope.feedback = function(item){
      $state.go('admin.suggestions.feedback', {itemId:item.autoId,action:'feedback'});
    };

    // 查看按钮
    $scope.check = function(item){
      $state.go('admin.suggestions.check', {itemId:item.autoId,action:'check'});
    };

    $scope.statusModel = 0;

    $scope.$watch('statusModel',function(data){

      var current_search = $location.search();
      current_search.status = data;
      current_search.page = $scope.statusPage[data];
      $location.search(current_search);

      //
      $scope.the_search.status = data;
      $scope.getPageList();
    });

    $scope.$on('search',function(e,data){
      $scope.the_search = data;
      $location.search(angular.extend($location.search(),$scope.the_search));
      $scope.getPageList();
    });



  });
