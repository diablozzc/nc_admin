'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:PayrecordCtrl
 * @description
 * # PayrecordCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('PayrecordCtrl', function ($rootScope, $scope, $state, $stateParams, $location,$q,$sce, $timeout,localStorageService, ngTableParams, Models,DataService, notify, ucauth, ngDialog,config) {
    $scope.key = 'payrecord';
    $scope.the_print_link = '/';
    $scope.payrecord_list = [];
    $scope.the_search = {};
    $scope.datePicker = {};
    $scope.datePicker.date = {startDate: undefined, endDate: undefined};
    $scope.showAll = true;

    $scope.ucauth = ucauth;
    $scope.flag = {};
    $scope.flag.download_record = false;
    $scope.flag.print_payment = false;

    ucauth.hasRole('download_record',$scope.flag);
    ucauth.hasRole('print_payment',$scope.flag);


    // 获取分页数据
    $scope.getPageList = function(param){

      if(angular.isDefined(param)){
        $scope.the_params = angular.extend({
          page: 1,
          count: 8,
          sorting: {
            autoId: 'desc'     // initial sorting
          }
        }, param);
      }else{
        $scope.the_params = angular.extend({
          page: 1,
          count: 8,
          sorting: {
            autoId: 'desc'     // initial sorting
          }
        }, $location.search());
      }


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

          $scope.payRecordListPromise = Models.init('PayRecords').actions('list',the_param).then(function(ret){
            //console.log(ret);
            if(ret.meta.code == 200){
              params.total(ret.data.totalRecord);
              $defer.resolve(ret.data.data);
            }
          });

        }
      });

    };
    $scope.download = function(){
      Models.init('DownloadIds').actions('downloadids').then(function(ret){
        //console.log(ret);
        if(ret.meta.code == 200){
          var the_param = {};
          the_param.id = ret.data;

          if($scope.showAll == false){
            the_param = lodash.merge(the_param,$scope.the_search);
          }

          the_param.property = ucauth.getUser().property;

          var the_param_str = DataService.formData(the_param);
          //console.log(the_param_str);

          var url = config.global.prop_server + config.global.download_payrecords;
          url += '?'+the_param_str;

          //console.log(url);


          $scope.the_link = $sce.trustAsResourceUrl(url);
        }

      });

    };

    $scope.dateChange = function(){
      $scope.showAll = false;
      $scope.the_search.startDate = $scope.datePicker.date.startDate.valueOf();
      $scope.the_search.endDate = $scope.datePicker.date.endDate.valueOf();
      $scope.getPageList({page:1});
    };

    $scope.showAllList = function(){
      $scope.showAll = true;
      $scope.the_search = {};
      $scope.getPageList();
    };


    // 查找
    $scope.search = function(){
      $location.search(angular.extend($location.search(),$scope.the_search));
      $scope.getPageList();
    };

    //打印缴费记录
    $scope.print = function(item){
      //console.log(item);
      var data = {};
      data.payBillNo = item.payBillNo;

      Models.init('PayRecords/Voucher').actions('get',data).then(function(ret){
        //console.log(ret);
        $scope.$broadcast('print',{tpl:'paymentVoucher',data:ret.data});
      });

    };


    $scope.getPageList();
  });
