'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:WithdrawCtrl
 * @description
 * # WithdrawCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('WithdrawCtrl', function ($scope,$state,$location,ucauth,ngTableParams,Models,notify,ngDialog) {
    //Models.init('WdAttachs').actions('get').then(function(ret){
    //  console.log(ret);
    //});

    // 获取分页数据
    $scope.getPageList = function () {

      $scope.the_params = angular.extend({
        page: 1,
        count: 5,
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
            //the_param = angular.extend(the_param,{sorting:sort_param});
            the_param.sorting = sort_param;
          }

          $scope.withDrawListPromise = Models.init('WdApplys').actions('list', the_param).then(function (ret) {
            //console.log(ret);
            if (ret.meta.code == 200) {
              params.total(ret.data.totalRecord);
              $defer.resolve(ret.data.data);
            }
          });
        }
      });

    };


    $scope.bindAccount = function(){
      ngDialog.open({
        template:'bindAccountTpl',
        controller:'bindAccountWindow',
        //resolve: {
        //  item: function enteringFactory() {
        //    return item;
        //  }
        //},
        preCloseCallback: function(value) {

        }
      });
    };
    $scope.cancelApply = function(item){
      //console.log(item);
      Models.init('WdApplys/Cancel').actions('cancel',{},{autoId:item.autoId}).then(function(ret){

        if (ret.meta.code == 200) {
          notify({message: '撤销成功', classes: 'alert-success'});
          $scope.getPageList();
          $scope.$emit('refresh');
        } else {
          notify({message: ret.meta.info, classes: 'alert-danger'});
        }

      });
    };

    $scope.$on('refresh',function(){
      $scope.getPageList();
    });

    $scope.getPageList();

  });

  app.controller('bindAccountWindow',function($scope,Models,config,notify){
    $scope.the_bind = {};
    $scope.accountTypeList = config.data.states.accountType;
    $scope.accountType = 'alipay';
    $scope.accountNameLabel = '用户名';
    $scope.accountNoLabel = '支付宝帐号';

    $scope.accountTypeChange = function(val){
      switch(val){
        case 'bank':
          $scope.accountNameLabel = '真实姓名';
          $scope.accountNoLabel = '银行卡号';
          break;
        case 'alipay':
          $scope.accountNameLabel = '用户名';
          $scope.accountNoLabel = '支付宝帐号';
          break;
      }
      $scope.the_bind.bankName = '';
      $scope.the_bind.wdAccName = '';
      $scope.the_bind.bankCardNo = '';
    };

    $scope.bind = function(){
      $scope.the_bind.bankCode = $scope.accountType;

      switch($scope.accountType){
        case 'bank':
          break;
        case 'alipay':
          $scope.the_bind.bankName = '支付宝';
          break;
      }
      Models.init('WdAttachs').actions('bindit',$scope.the_bind).then(function(ret){
        if(ret.meta.code == 200){
          notify({message:'绑定成功',classes:'alert-success'});
        }else{
          notify({message:ret.meta.error , classes:'alert-danger'});
        }
        $scope.closeThisDialog();
      })

    };

    $scope.close = function(){
      $scope.closeThisDialog();
    };

  });

  app.controller('withDrawWindow',function($scope,Models,config,notify,accountData){
    $scope.the_apply = {};
    $scope.accounts = accountData.accounts;
    $scope.balance = accountData.balance;
    $scope.account = $scope.accounts[0].bankCardNo;

    $scope.accountChange = function(val){
      $scope.account = val;
    };


    $scope.close = function(){
      $scope.closeThisDialog();
    };

    $scope.withDraw = function(){
      $scope.the_apply.source = 'web';
      var selectIndex = lodash.findIndex($scope.accounts,{bankCardNo:$scope.account});

      $scope.the_apply.type = $scope.accounts[selectIndex].bankCode === 'alipay' ? 0 : 1;
      $scope.the_apply.bankCode = $scope.accounts[selectIndex].bankCode;
      $scope.the_apply.trdTo = $scope.account;

      Models.init('WdApplys').actions('applyit',$scope.the_apply).then(function(ret){
        if(ret.meta.code == 200){
          notify({message:'提交成功',classes:'alert-success'});
        }else{
          notify({message:ret.meta.error , classes:'alert-danger'});
        }
        $scope.closeThisDialog();
      });

    }

  });
