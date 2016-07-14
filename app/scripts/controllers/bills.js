'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:BillsCtrl
 * @description
 * # BillsCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('BillsCtrl', function ($rootScope, $scope, $state, $stateParams, $location,$q,$sce, localStorageService, ngTableParams, Models, DataService, notify, ucauth, ngDialog, config) {
    // 初始化
    $scope.key = 'bills';
    $scope.bills_list = [];
    $scope.the_search = {};
    $scope.show_all = true;

    $scope.ucauth = ucauth;
    $scope.flag = {};
    $scope.flag.add_bill = false;
    $scope.flag.create_bill = false;
    $scope.flag.payment_bill = false;
    $scope.flag.download_bill = false;
    $scope.flag.print_payment = false;

    ucauth.hasRole('add_bill',$scope.flag);
    ucauth.hasRole('create_bill',$scope.flag);
    ucauth.hasRole('payment_bill',$scope.flag);
    ucauth.hasRole('download_bill',$scope.flag);
    ucauth.hasRole('print_payment',$scope.flag);

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

      $scope.showRoomBill(val);

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

            $scope.showRoomBill($scope.current.building.code);
            $scope.createUnitList($scope.current.building.unit);
          }
          deferred.resolve(ret);
        });
        return deferred.promise;

      }else{
        $scope.showRoomBill($scope.current.community);
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
        $scope.showRoomBill(unit_code);
        var params = {building:$scope.current.building.code,unit:val};

        Models.init('Rooms').actions('list',params).then(function(ret){
          if(ret.meta.code == 200){
            $scope.room_list = ret.data;
            $scope.room_list.unshift({houseNumber:'不限'});
          }
        });

      }else{
        $scope.showRoomBill($scope.current.building.code);
      }

    };

    // 切换房间
    $scope.onRoomChange = function(val){

      if(val){
        $scope.showRoomBill(val);
      }else{
        var unit_str = $scope.current.unit<10 ? '0'+$scope.current.unit : $scope.current.unit+'';
        var unit_code = $scope.current.building.code + unit_str;
        $scope.showRoomBill(unit_code);
      }
    };

    // 多选

    $scope.checkboxes = {
      checked: false,
      items: {}
    };

    $scope.$watch(function() {
      return $scope.checkboxes.checked;
    }, function(value) {
      angular.forEach($scope.bills_list, function(item) {
        if(item.status == 0){
          $scope.checkboxes.items[item.code] = value;
        }
      });
    });


    // 获取分页数据
    $scope.getPageList = function(param){
      if(angular.isDefined(param)){
        $scope.the_params = angular.extend({
          page: 1,
          count: 10,
          sorting: {
            autoId: 'desc'     // initial sorting
          }
        }, param);
      }else{
        $scope.the_params = angular.extend({
          page: 1,
          count: 10,
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
            //the_param = angular.extend(the_param,{sorting:sort_param});
            the_param.sorting = sort_param;
          }

          $scope.billsListPromise = Models.init('Bills').actions('list', the_param).then(function (ret) {

            //console.log(ret.data.data);
            if (ret.meta.code == 200) {
              params.total(ret.data.totalRecord);
              lodash.map(ret.data.data,function(n){

              });

              $scope.bills_list = ret.data.data;
              $defer.resolve(ret.data.data);
            }
          });
        }
      });

    };

    //// 编辑按钮
    //$scope.edit = function(row){
    //  $state.go('admin.payment.editmeter',{itemId:row.entity.autoId,action:'edit'});
    //};
    // 添加按钮
    $scope.add = function(){
      $state.go('admin.payment.addbill', {action:'add'});
    };
    // 生成账单
    $scope.create = function(){
      $state.go('admin.payment.createbills',{action:'create'});
    };
    //$scope.show = function(){
    //  $state.go('admin.payment.showbill',{action:'show'});
    //};

    $scope.showRoomBill = function(room){
      $scope.show_all = angular.isUndefined(room);
      $scope.the_search.room = room;
      $scope.getPageList({page:1});
    };
    $scope.showAllBill = function(){
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


    $scope.download = function(){
      Models.init('DownloadIds').actions('downloadids').then(function(ret){
        //console.log(ret);
        if(ret.meta.code == 200){
          var the_param = {};
          the_param.id = ret.data;

          //if($scope.showAll == false){
            the_param = lodash.merge(the_param,$scope.the_search);
          //}

          the_param.property = ucauth.getUser().property;

          var the_param_str = DataService.formData(the_param);
          //console.log(the_param_str);

          var url = config.global.prop_server + config.global.download_bills;
          url += '?'+the_param_str;

          //console.log(url);


          $scope.the_link = $sce.trustAsResourceUrl(url);
        }

      });

    };

    //打印缴费记录
    $scope.print = function(item){
      console.log(item);
      var data = {};
      data.payBillNo = item.trdBillNo;

      Models.init('PayRecords/Voucher').actions('get',data).then(function(ret){
        //console.log(ret);
        $scope.$broadcast('print',{tpl:'paymentVoucher',data:ret.data});
      });

    };



    $scope.payment = function(itemCode){

      var codes = [];
      var codesStr = '';
      var selectedItem = [];
      var rooms = [];
      var total_payment_amt = 0;


      if(angular.isUndefined(itemCode)){
        //console.log($scope.checkboxes);
        lodash.forIn($scope.checkboxes.items,function(value,key){
          if(value){
            codes.push(key);
          }
        });
      }else{
        codes.push(itemCode)
      }

      codesStr = codes.join(',');


      angular.forEach(codes,function(code){
        var index = lodash.findIndex($scope.bills_list,{code:code});
        selectedItem.push($scope.bills_list[index]);
        total_payment_amt += $scope.bills_list[index].paymentAmt;

      });
      total_payment_amt = Math.round(total_payment_amt*100)/100;

      if(selectedItem.length > 0){

        var isUniqRoom = lodash.uniq(lodash.pluck(selectedItem, 'room')).length == 1;

        if(isUniqRoom){

          ngDialog.open({
            template: 'paymentTpl',
            controller:'paymentWindow',
            resolve: {
              info: function paymentInfoFactory() {
                var info = {};
                info.codesStr = codesStr;
                info.selectedItems = selectedItem;
                info.totalPaymentAmt = total_payment_amt;
                return info;
              }

            },
            preCloseCallback: function(value) {
              //$scope.tableParams.reload();
              $scope.getPageList();
              //$scope.updateGrid();

            }
          });

        }else{
          notify({message:'请选择相同的房间进行合并支付' , classes:'alert-danger'});
        }


      }else{
        notify({message:'请先选择要支付的账单' , classes:'alert-danger'});
      }
    };

    $scope.statusModel = '';

    $scope.$watch('statusModel',function(data){
      $scope.the_search.status = data;
      $scope.getPageList({page:1});
    });




  });

app.controller('paymentWindow',function($scope,$rootScope,notify,info,ucauth,config,Models){


  $scope.pay_channel_list = config.data.states.payChannel;

  $scope.selectedItems = info.selectedItems;
  $scope.totalPaymentAmt = info.totalPaymentAmt;

  $scope.theRoom = info.selectedItems[0];

  $scope.thePay = {};
  $scope.thePay.payChannel = 1;

  $scope.confirm = function(){
    $scope.thePay.billNos = info.codesStr;
    $scope.thePay.totalAmt = $scope.totalPaymentAmt;


    Models.init('Bills/PayBills').actions('pay',$scope.thePay).then(function(ret){
      if(ret.meta.code == 200){
        notify({message:'支付完成',classes:'alert-success'});
      }else{
        notify({message:ret.meta.error , classes:'alert-danger'});
      }

      $scope.closeThisDialog();
    });


  };

  $scope.close = function(){
    $scope.closeThisDialog();
  }
});

