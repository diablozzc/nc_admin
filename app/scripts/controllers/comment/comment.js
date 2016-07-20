/**
 * Created by wxz on 16/7/18.
 */
app.controller('CommentCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, config, notify, ngDialog, ucauth) {

  $scope.ucauth = ucauth;
  $scope.flag = {};
  $scope.flag.see_signinfo = false;
  $scope.flag.publish_activity = false;
  $scope.flag.edit_activity = false;
  $scope.flag.back_activity = false;
  $scope.flag.delete_activity = false;

  ucauth.hasRole('see_signinfo', $scope.flag);
  ucauth.hasRole('publish_activity', $scope.flag);
  ucauth.hasRole('edit_activity', $scope.flag);
  ucauth.hasRole('back_activity', $scope.flag);
  ucauth.hasRole('delete_activity', $scope.flag);

  // 获取分页数据
  $scope.getPageList = function () {

    $scope.the_params = angular.extend({
      page: 1,
      count: 10,
      // sorting: {
      //   autoId: 'desc'     // initial sorting
      // }
    }, $location.search());

    $scope.tableParams = new ngTableParams($scope.the_params, {
      total: 0,           // length of data
      //counts: [],
      getData: function ($defer, params) {
        // console.log(params);
        $location.search(params.url());
        var the_param = {pageSize: params.count(), pageIndex: params.page()};
        the_param = angular.extend(the_param, $scope.search);
        $scope.commentListPromise = Models.init('Comments/list').actions('list', the_param).then(function (ret) {
          console.log(ret);
          params.total(ret.totalRecord);
          $defer.resolve(ret.data);

        }, function (err) {
          notify({message: err.data.info, classes: 'alert-danger'});
        });
      }
    });

  };
  $scope.getPageList();


  $scope.audit = function (item) {
    // console.log(autoId);
    // console.log(status);
    Models.init('Comments/autoId').actions('audit', {'status': item.status}, {'autoId': item.autoId}).then(function (ret) {
        notify({message: '审核成功!', classes: 'alert-success'});
        $scope.tableParams.reload();
      },
      function (err) {
        notify({message: err.data.info, classes: 'alert-danger'});
      });
  };


  $scope.reply = function (item) {
    ngDialog.open({
      template: 'commentReplyTpl',
      controller: 'commentReplyWindow',
      resolve: {
        info: function paymentInfoFactory() {
          var info = item;
          //info.autoId = item.autoId;
          //info.content=
          // info.selectedItems = selectedItem;
          // info.totalPaymentAmt = total_payment_amt;
          return info;
        }

      },
      preCloseCallback: function (value) {
        //$scope.tableParams.reload();
        $scope.getPageList();
        //$scope.updateGrid();

      }
    });
  };

  $scope.showReply = function (item) {
    ngDialog.open({
      template: 'showReplyTpl',
      controller: 'showReplyWindow',
      width:800,
      resolve: {
        info: function paymentInfoFactory() {
          var info = item;
          //info.autoId = item.autoId;
          //info.content=
          // info.selectedItems = selectedItem;
          // info.totalPaymentAmt = total_payment_amt;
          return info;
        }

      },
      preCloseCallback: function (value) {
        //$scope.tableParams.reload();
        $scope.getPageList();
        //$scope.updateGrid();

      }
    });
  };

});

app.controller('commentReplyWindow', function ($scope, $rootScope, notify, info, ucauth, config, Models) {




  // $scope.pay_channel_list = config.data.states.payChannel;
  //
  // $scope.selectedItems = info.selectedItems;
  // $scope.totalPaymentAmt = info.totalPaymentAmt;
  //
  // $scope.theRoom = info.selectedItems[0];
  //
  // $scope.thePay = {};
  // $scope.thePay.payChannel = 1;
  //
  $scope.the_reply={};
  $scope.save = function () {
    // $scope.thePay.billNos = info.codesStr;
    // $scope.thePay.totalAmt = $scope.totalPaymentAmt;

    //console.log(info.autoId);
    console.log($scope.the_reply.content);
    $scope.the_reply.type=0;//留言
    $scope.the_reply.message=info.autoId;
    //$scope.the_reply.reply={};
    $scope.the_reply.replyType=0;//居委会回复

    Models.init('Replies/reply').actions('reply', $scope.the_reply).then(function (ret) {

        notify({message: '回复成功', classes: 'alert-success'});

        $scope.closeThisDialog();
      },
      function (err) {
        notify({message: err.data.info, classes: 'alert-danger'});
        $scope.closeThisDialog();
      });


  };

  $scope.close = function () {
    $scope.closeThisDialog();
  }
});


app.controller('showReplyWindow', function ($scope, $rootScope, notify,ngTableParams, info, ucauth, config, Models) {

  $scope.tableParams = new ngTableParams($scope.the_params, {
    total: 0,           // length of data
    //counts: [],
    getData: function ($defer, params) {
      // console.log(params);
      $defer.resolve(info);
    }
  });

  $scope.close = function () {
    $scope.closeThisDialog();
  }
});
