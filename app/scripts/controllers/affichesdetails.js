'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:AffichesdetailsCtrl
 * @description
 * # AffichesdetailsCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('AffichesdetailsCtrl', function ($rootScope, $scope, $state, $stateParams, $location,$q,$sce, localStorageService, ngTableParams, Models, DataService, notify, ucauth, ngDialog, config) {


    $scope.key = 'affiches_details';
    $scope.affiches_details_list = [];


    // 获取分页数据
    $scope.getPageList = function(){

      $scope.the_params = angular.extend({
        page: 1,
        count: 10,
        sorting: {
          autoId: 'desc'     // initial sorting
        }
      }, $location.search());

      $scope.tableParams = new ngTableParams($scope.the_params, {
        total: 0,           // length of data
        //counts: [],
        getData: function ($defer, params) {

          $location.search(params.url());

          var the_param = {page: true, pageSize: params.count(), pageIndex: params.page(),'autoId':$stateParams.itemId};

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

          $scope.affichesDetailsPromise = Models.init('Affiches/id/details').actions('details', the_param).then(function (ret) {

            if (ret.meta.code == 200) {
              params.total(ret.data.totalRecord);

              $defer.resolve(ret.data.data);
            }
          });
        }
      });

    };

    $scope.getPageList();

    Models.init('Affiches/id').actions('get',{autoId:$stateParams.itemId}).then(function(ret){
      $scope.the_affiche = ret.data;
    });



  });
